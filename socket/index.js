// import {Server} from "socket.io";
// import { writeFile } from "node:fs";
const { Server } = require("socket.io");
const { writeFile } = require("node:fs");
// const socketServerURL = '';

const io = new Server({
  cors: {
    origin: ["http://localhost:3000"],
    maxHttpBufferSize: 4096
  }
});
let onlineUsers = [];
const getUsers = () => {

  return onlineUsers;
}

const getTimeStamp = () => {
  let d = new Date(),
    dformat = [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear()].join('/') + ' ' +
      [String(d.getHours()).padStart(2, '0'),
      String(d.getMinutes()).padStart(2, '0'),
      String(d.getSeconds()).padStart(2, '0')].join(':');
  return dformat;
}
const getUser = (username) => {
  return onlineUsers.find(_ => _['socketID'] == socketID);
}
const addUser = ({ username, email, user_id, conversation_id }, socketID) => {
  let result = {};
  if (Array.isArray(onlineUsers)) {
    const userIndex = onlineUsers.findIndex(_ => _.username === username);
    console.log(`userIndex : ${userIndex}`);
    if (userIndex >= 0) {
      onlineUsers[userIndex].socketID = socketID;
      onlineUsers[userIndex].user_id = user_id;
      result = onlineUsers[userIndex];

    } else {
      result = { username: username, email: email, user_id: user_id, conversation_id: conversation_id, socketID: socketID };
      onlineUsers.push(result);

    }
  }

  return result;

};

const emitActiveUsersListToAll = () => {
  Array.isArray(onlineUsers) && onlineUsers.map(_ => {
    console.log(_.socketID);
    io.to(_.socketID).emit("users", getUsers());
    // io.emit("users", getUsers());
  });
  // console.log(onlineUsers);
}


const removeUser = (socketID) => {
  console.log(onlineUsers);
  onlineUsers = onlineUsers && onlineUsers.length > 0 && onlineUsers.filter(_ => _['socketID'] != socketID);
  emitActiveUsersListToAll();
};

io.on("connection", (socket) => {
  console.log(`Someone has connected with id: ${socket.id}`);
  // io.emit("initChat","How may we help you?");
  //io.to(socket.id).emit('users',users);
  socket.on('joinRoom', (data) => {

    socket.join(data);
  });

  socket.on('newUser', ({ username, email, user_id, conversation_id }, call_back) => {
    //console.log(`${username},${socket.id}`);
    let user = addUser({ username, email, user_id, conversation_id }, socket.id);
    call_back(user);
    console.log(onlineUsers);
    emitActiveUsersListToAll();
  });

  socket.on('getUsers', (input, call_back) => {
    console.log('in getUsers');
    call_back(getUsers());
  })

  socket.on("disconnect", () => {
    //console.log('Removed user:' + socket.id );
    //removeUser(socket.id);
    console.log(onlineUsers ? onlineUsers.length : "No users online!");
  });

  socket.on("sendMessage", (objMessage) => {
    console.log(objMessage);
    const receiverSocketID = objMessage.receiverSocketID;
    // receiverSocketID.map(_ =>
    receiverSocketID && io.to(receiverSocketID).emit('getMessage', { ...objMessage, t: getTimeStamp() })
    // );
    // io.to(objMessage.senderSocketID).emit('getMessage'
    //   , { ...objMessage, t: getTimeStamp(), msgStatus: "SENT" }
    // );
  });
  socket.on("typingMessage", (objMessage) => {
    console.log(objMessage);
    const receiverSocketID = objMessage.receiverSocketID;
    receiverSocketID && io.to(receiverSocketID).emit('typingMessage', { ...objMessage, t: getTimeStamp() });
  });

  socket.on("upload", (objImage, callback) => {
    console.log('In upload file'); // <Buffer 25 50 44 ...>
    // console.log(data);

    // save the content to the disk, for example
    writeFile(`../public/${objImage.name}`, objImage.data, (err) => {
      callback({
        message: err ? err
          : {
            ...objImage,
            // path: `http://localhost:3000/${objImage.name}`
            path: `${objImage.name}`
            , data: ""
          }
      });
      const returnObjImage = {
        ...objImage,
        // path: `http://localhost:3000/${objImage.name}`
        path: `${objImage.name}`
        , data: ""
      };
      objImage.receiverSocketID && io.to(objImage.receiverSocketID).emit('getMessage', { ...returnObjImage, t: getTimeStamp() });

      io.to(objImage.senderSocketID).emit('getMessage', { ...returnObjImage, t: getTimeStamp() });

    });
  });

});

io.listen(5000, (res) => {
  console.log(res);
});
console.log('Node server is listening...' + getTimeStamp());