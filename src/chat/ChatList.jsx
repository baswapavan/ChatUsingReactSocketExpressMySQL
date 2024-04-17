import React, { useState, useEffect, useContext } from 'react'
// import { Socket } from 'socket.io-client';
import { GVContext } from './Login';
import { getChatUser } from './Library';
import groupImg from './group.png';
import plainImg from './Plain Profile.jpeg';



function ChatList(props) {
  const { GV, setGV } = useContext(GVContext);
  const activeChatEmail = props && props.activeChat?.email;
  // const activeChatEmail = props.activeChat?.email;
  const loggedInUser = getChatUser();
  const users = props.users;

  let conversations = GV.conversations;
  // conversations = conversations && conversations.map(_ => {
  //   const user = users.find(user => user.username === _.conversation_name);
  //   console.log('user:', user);
  //   _.socketID = user && user.socketID;
  //   _.composing = user && user.composing;
  //   return _;
  // });

  // console.log(conversations);
  const handleChatListClick = (user) => {
    props.handleChatListClick(user);
  };

  const getLastMessage = (conversation) => {
    const lastMessageIndex = GV.messages && GV.selectedUser && GV.messages.findLastIndex(_ =>
      (_.conversation_id === conversation.conversation_id)
      //   && _.receiverUserName === loggedInUser.username)
      // || (_.receiverUserName === username && _.senderUserName === loggedInUser.username)
    );
    return lastMessageIndex > -1 ? GV.messages[lastMessageIndex].msg : conversation.last_message;
  };
  return (
    <>
      <div class=" p-3 border-bottom" style={{ backgroundColor: "#e9ecef", alignItems: "flex-start" }}>Chats</div>
      {
        conversations && conversations.length > 0
          ? conversations.map((_, index) =>
            _.socketID !== props.socket.id &&
            <div className={activeChatEmail === _.email ? " p-1 border-bottom" : "m-0 p-1 border-bottom"}
              style={{ textAlign: 'center', cursor: 'pointer', borderBottomColor: '#f3f3f3', color: activeChatEmail === _.email ? '#50c36e' : null }}
              onClick={() => handleChatListClick(_)}
              key={index}
            >
              <div className='d-flex'>
                <div className="info_icon ps-1 pe-1 py-1 float-start" style={{ width: '50px', height: '50px', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden' }}>
                  <img
                    src={_.profile_image ? _.profile_image : plainImg}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
                <span style={{ fontSize: '20px', textAlign: 'left' }} className='px-2'>{_.conversation_name}<div style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', maxWidth: '230px' }}
                >{getLastMessage(_)}</div></span>
                {_.composing &&
                  <div className='text-end w-100'><img style={{ height: '30px' }} src="https://www.perodua.com.my/assets/gif/loading5.gif" alt="Typing..." /></div>}
              </div>
            </div>)

          : <div className='display-6'> No conversation online</div>
      }

    </>
  )
}

export default ChatList;