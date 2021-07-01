const request = require('request');
const fs = require('fs');
const readline = require('readline');

// take command line args for URL and local file path
const args = process.argv.splice(2);
const URL = args[0];
const PATH = args[1];

const downloadPage = () => {
  request(`https://${URL}`, (error, response, body) => {
    if (error) {
      console.log('Invalid URL: \n', error.name, error.message);
      process.exit();
    }
    console.log('statusCode:', response && response.statusCode);
    fs.writeFile(PATH, body, (err) => {
      if (!err) {
        console.log(`Page from ${URL} successfully saved to ${PATH}`);
      } else {
        console.log('Invalid PATH: \n', err.name, err.message);
        process.exit();
      }
    });
  });
};

const promptUser = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log(`File already exist`);
  rl.question(`Press 'y' key and ENTER to overwrite. Press 'ctrl+c' to end \n`, (resp) => {
    if (resp === 'y') {
      console.log('Downloading and overwriting file now');
      downloadPage();
      rl.close();
    }
  });
};

// check if file already exists
fs.access(PATH, fs.constants.F_OK, (err) => {
  // based on documentation
  // err means file does not exist - download page
  if (err) {
    console.log('Downloading and saving page');
    downloadPage();
  } else {
    // file exists and we need addition imput to proceed
    promptUser();
  }
});

// HTTP request to given URL
