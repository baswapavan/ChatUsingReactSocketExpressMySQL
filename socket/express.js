const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const apis = require('./apis.js');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,FETCH',
};

app.use(cors(corsOptions));
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello, Express Server!');
});

app.post('/validateUser', (req, res) => {
  console.log(JSON.stringify(req.body.username));
  apis.validateUser(req, res);
});

app.get('/userDetails', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.userDetails(req, res);
});
app.get('/users', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.users(req, res);
});
app.post('/user', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.createUser(req, res);
});

app.put('/updateUser', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.updateUser(req, res);
});

app.delete('/user', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.deleteUser(req, res);
});
///////////////////////////////////////////////////////////////////////////////////////////
app.get('/roles', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.roles(req, res);
});

app.post('/role', (req, res) => {
  console.log(JSON.stringify(req.query));
  apis.createRole(req, res);
});

app.put('/role', (req, res) => {
  console.log(JSON.stringify(req.query));
  apis.updateRole(req, res);
});

app.delete('/role', (req, res) => {
  console.log(JSON.stringify(req.query));
  apis.deleteRole(req, res);
});
//////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/conversations', (req, res) => {
  console.log(JSON.stringify(req.query));
  apis.conversationsGet(req, res);
});

app.get('/conversation', (req, res) => {
  console.log(JSON.stringify(req.query));
  apis.conversationInfoGet(req, res);
});

app.post('/conversation', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationAdd(req, res);
});

app.get('/conversation/nonmembers', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationNonMembersGet(req, res);
});


app.put('/conversation', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationUpdate(req, res);
});

app.delete('/conversation', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationDelete(req, res);
});

app.get('/conversation/messages', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMessagesGet(req, res);
});

app.post('/conversation/members', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationWithMembersAdd(req, res);
});
app.delete('/conversation/members/messages', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationToDelete(req, res);
});
app.post('/conversation/member', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMemberAdd(req, res);
});

app.delete('/conversation/member', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMemberDelete(req, res);
});


app.post('/conversation/messages', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMessagesCreate(req, res);
  apis.conversationMembersGet(req, res);
});

app.put('/conversation/messages', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMessagesUpdate(req, res);
});

app.delete('/conversation/messages', (req, res) => {
  console.log(JSON.stringify(req.body));
  apis.conversationMessagesDelete(req, res);
});

server.listen(3300, () => {
  console.log('Express server is running on port 3300');
});