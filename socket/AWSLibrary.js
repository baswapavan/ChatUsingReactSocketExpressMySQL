const AWS = require('aws-sdk');
const fs = require('fs');

// Set the region
AWS.config.update({ region: 'ap-south-1' });

// Set your AWS credentials (access key and secret key)
const credentials = new AWS.Credentials({
  accessKeyId: 'AKIA5H7FKR42HFQO3RPR',
  secretAccessKey: '99AGOWyp7PjDYj5Q4Rzvmcz3FSfzAAwrb2UJpCU+'
});

// Set the credentials
AWS.config.credentials = credentials;
// Create an S3 service object
const s3 = new AWS.S3();

// Upload the file
function addFile(params, call_back) {

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      // return err;
    } else {
      call_back(data.Location);
      console.log(data.Location);
      // return data.Location;
    }
  });
}

module.exports = {
  addFile
};