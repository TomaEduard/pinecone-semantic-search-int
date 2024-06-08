const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

function loadLocalCsvToArray(directoryPath, callback) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
    const allRecords = [];

    function processFile(index) {
      if (index >= csvFiles.length) {
        callback(allRecords);
        return;
      }

      const filePath = path.join(directoryPath, csvFiles[index]);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err.message);
          processFile(index + 1);
          return;
        }

        parse(data, { columns: true }, (err, records) => {
          if (err) {
            console.error(err.message);
          } else {
            const columnsToKeep = [
              'User Name', 'Likes at Posting', 'Followers at Posting',
              'Message', 'Link', 'Image Text', 'Link Text', 'Description'
            ];
            const filteredRecords = records.map(record => {
              let filteredRecord = {};
              columnsToKeep.forEach(column => {
                if (record.hasOwnProperty(column) && record[column].trim() !== '') {
                  filteredRecord[column] = record[column];
                }
              });
              return filteredRecord;
            });
            allRecords.push(...filteredRecords);
          }
          processFile(index + 1);
        });
      });
    }

    processFile(0);
  });
}

// Usage example:
const directoryPath = 'csv/';
loadLocalCsvToArray(directoryPath, (rows) => {
  console.log(rows); // Array of objects, each representing a filtered row
});
