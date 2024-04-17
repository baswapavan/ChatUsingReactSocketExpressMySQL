const AWS = require('aws-sdk');
const fs = require('fs');
const { awsKeys } = require('./config');
const { URL } = require('url');
// Set the region
AWS.config.update({ region: 'ap-south-1' });

// Set your AWS credentials (access key and secret key)
const credentials = new AWS.Credentials({
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey

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

function deleteFile(filename) {
  console.log('filename', filename);
  const parsedUrl = new URL(filename);
  let previous_file_name = parsedUrl.pathname;
  previous_file_name = previous_file_name.substring(1);
  console.log(previous_file_name);
  const params = {
    Bucket: 'indiausers',
    Key: previous_file_name
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send('Error deleting file');
    }
    console.log('File deleted successfully');
    //res.send('File deleted successfully');
  });

}



module.exports = {
  addFile, deleteFile
};