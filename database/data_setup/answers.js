const moment = require('moment')

const csv = require('csv-parser')
const fs = require('fs')
const results = [];
var db = require('../database/index.js')

const read = fs.createReadStream('/Users/helen/Desktop/HR/Week 8/questions/server/csv/answers.csv').pipe(csv());
const write = fs.createWriteStream('/Users/helen/Desktop/HR/Week 8/questions/server/csv/clean_answers.csv');

read.on('data', (data) => {
  if (data.date_written[data.date_written.length - 1] ===')') {
    data.date_written = moment(data.date_written.slice(4, 24), ['MMMMDDY']).format().slice(0, 19);
  }
  if (data.date_written.length === 13) {
    data.date_written = moment(Number.parseInt(data.date_written)).format().slice(0, 19);
  } else {
    data.date_written = data.date_written.slice(0, 19);
  }

  if (data.helpful !== undefined) {
    const result = write.write(data.id + ',' + data.question_id + ',' + '"' + data.body + '"' + ',' + data.date_written +
    ',' + '"' + data.answerer_name + '"' + ',' + '"' + data.answerer_email + '"' + ',' + data.reported + ',' + data.helpful +"\n");

    if (!result) {
      read.pause();
    }

  }
})

write.on ('drain', () => {
  read.resume();
})
read.on('end', () => {
  write.end();
})
write.on('close', () => {
  console.log('write done');
})

