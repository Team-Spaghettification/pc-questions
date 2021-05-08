const csv = require('csv-parser')
const fs = require('fs')
const results = [];
var db = require('../database/index.js')

const read = fs.createReadStream('/Users/helen/Desktop/HR/Week 8/questions/server/csv/answers_photos.csv').pipe(csv());
const write = fs.createWriteStream('/Users/helen/Desktop/HR/Week 8/questions/server/csv/clean_answers_photos.csv');

read.on('data', (data) => {
  if (data.url) {
    const result = write.write(data.id + ',' + data.answer_id + ',' + '"' + data.url + '"' + "\n");
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

