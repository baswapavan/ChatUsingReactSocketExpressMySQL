import React, { useState, useEffect, createContext, useContext } from 'react';
import Main from "./Main";
import { io } from "socket.io-client";
import { socketServerURL, addChatUser, validateUser, getChatUser } from './Library';
import SendMessage from './SendMessage';

export const GVContext = createContext();

function Login() {

  const [socket, setSocket] = useState(null);

  const [GV, setGV] = useState(GVContext);
  let user = getChatUser();
  const [username, setUsername] = useState(user && user.username);
  const [email, setEmail] = useState(user && user.email);
  const [password, setPassword] = useState();
  ///
  const [userId, setUserId] = useState(user && user.userId);
  ///
  useEffect(() => {
    if (user) {
      const objSocket = io(socketServerURL);
      user.username && addChatUser(objSocket, user);
      setGV((prev) => {
        return {
          ...prev, 'thisSocket': objSocket
          , 'loggedInUser': getChatUser()
          , 'messages': GV.messages ? [...GV.messages] : []
          , 'users': GV.users ? [...GV.users] : []
        }
      });
    }
  }, []);

  useEffect(() => {
    socket && socket.on("users", (users) => {
      console.log(users);
      //setUsers(users);
      setGV((prev) => {
        return {
          ...prev,
          'users': users,
          'loggedInUser': users.find(_ => _.socketID === socket.id),
          'thisSocket': socket,
          'messages': prev.messages ? [...prev.messages] : []
        }
      })
    });
  }, [socket]);

  const handleChatJoin = () => {
    validateUser({ username: username, password: password }, (res) => {
      const objSocket = io(`http://localhost:5000`);
      setSocket(objSocket);
      addChatUser(objSocket, { username: username, email: email, user_id: res[0].user_id });
    }
    );
    // var obj = socket.emit('newUser', {username:username, email:email},(res) => {
    //     debugger;
    //     //setUsers(res);
    //     window.localStorage.setItem('chat',JSON.stringify({username:username, email:email, socketID:socket.id}))
    // });
  }

  const createASocket = () => {
    //debugger;
    const objSocket = io(socketServerURL);
    setSocket(objSocket);
    addChatUser(objSocket, { username: username, email: email });
  }
  // const handleChatSignup = () => {
  //   setSignUp(true);
  // }
  return (
    <GVContext.Provider value={{ GV, setGV }} >
      {!user ?
        <div className='mx-auto justify-content-center align-middle m-5 card' style={{ width: '400px' }} >
          <div className=' mb-2 card-header display-6' >Login</div>
          <div className='card-body'>
            <form >
              <input type="text" value={username}
                onChange={(e) => setUsername(e.target.value)} className='form-control m-2 p-2' placeholder='Name'></input>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} className='form-control m-2 p-2' placeholder='Password'></input>
            </form>
          </div>
          <div>
            <input type="submit" onClick={handleChatJoin} className='btn btn-primary  m-2' value="Join Chat"></input>
          </div>
          {/* <div>
            <a onClick={handleChatSignup} className='m-2' style={{ cursor: 'pointer' }}> Sign up</a>
          </div> */}

        </div>
        : <><Main /></>
      }
    </GVContext.Provider>

  )
}

export default Login