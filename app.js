const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './files/output.csv',
  header: [{id: 'Index', title: 'Index'}, {id: 'Number', title: 'Number'}]
});

function format(number) {
  //Ensure that number is a string
  number = number + '';
  //Remove any non-numeric characters
  number = number.replace(/\D/g,'');
  //Handle 10 digit phone numebers
  if(number.length === 10) {
    const area_code = number.slice(0, 3);
    const first_three = number.slice(3, 6);
    const last_four = number.slice(6, 10);
    return (area_code+'-'+first_three+'-'+last_four);
  //Handle phone numbers with a country code
  }else if(number.length >= 11) {
    let number_length = number.length;
    const last_four = number.slice(number.length - 4, number.length);
    number_length -= 4;
    const first_three = number.slice(number_length - 3, number_length);
    number_length -= 3;
    const area_code = number.slice(number_length - 3, number_length);
    number_length -= 3;
    const country_code = number.slice(0, number_length);
    return (country_code+'-'+area_code+'-'+first_three+'-'+last_four);
  //Handle numbers too short to be a phone number
  }else{
    return '';
  }
}

async function init()  {
  const list = await csv().fromFile('./files/input.csv');
  list.forEach(item => {
    item.Number = format(item.Number);
  });
  const formatted_list = Object.values(list);
  csvWriter.writeRecords(list);
}

init();