import React, { useState, useEffect, useContext } from 'react'
// import { Socket } from 'socket.io-client';
import { GVContext } from './Login';
import { getChatUser } from './Library';


function ChatList(props) {
  const { GV, setGV } = useContext(GVContext);
  const activeChatEmail = props && props.activeChat?.email;
  // const activeChatEmail = props.activeChat?.email;
  const loggedInUser = getChatUser();
  const users = props.users;

  let conversations = props.conversations;
  // conversations = conversations && conversations.map(_ => {
  //   const user = users.find(user => user.username === _.conversation_name);
  //   console.log('user:', user);
  //   _.socketID = user && user.socketID;
  //   _.composing = user && user.composing;
  //   return _;
  // });

  console.log(conversations);
  const handleChatListClick = (user) => {
    props.handleChatListClick(user);
  };

  const getLastMessage = (conversationId) => {
    const lastMessageIndex = GV.messages && GV.selectedUser && GV.messages.findLastIndex(_ =>
      (_.conversation_id === conversationId)
      //   && _.receiverUserName === loggedInUser.username)
      // || (_.receiverUserName === username && _.senderUserName === loggedInUser.username)
    );
    return lastMessageIndex > -1 ? GV.messages[lastMessageIndex].msg : '';
  };
  return (
    <>
      {
        conversations && conversations.length > 0
          ? conversations.map((_, index) =>
            _.socketID !== props.socket.id &&
            <div className={activeChatEmail === _.email ? " p-1 border-bottom" : "m-0 p-1 border-bottom"}
              style={{ textAlign: 'left', cursor: 'pointer', borderBottomColor: '#f3f3f3', color: activeChatEmail === _.email ? '#50c36e' : null }}
              onClick={() => handleChatListClick(_)}
              key={index}
            >
              <div className='d-flex'><span style={{ fontSize: '20px' }}>{_.conversation_name}</span>
                {_.composing &&
                  <div className='text-end w-100'><img style={{ height: '30px' }} src="https://www.perodua.com.my/assets/gif/loading5.gif" alt="Typing..." /></div>}
              </div>
              <div style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >{getLastMessage(_.conversation_id)}</div>
            </div>)

          : <div className='display-6'> No conversation online</div>
      }

    </>
  )
}

export default ChatList;