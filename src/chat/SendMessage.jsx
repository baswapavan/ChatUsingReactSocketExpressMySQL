import React, { useContext, useEffect, useState } from 'react'
import MessageList from './MessageList';
import { GVContext } from './Login';
import { getChatUser, addConversation } from './Library';

function SendMessage({ messageTemplate, userId }) {
  const { GV, setGV } = useContext(GVContext);
  const { thisSocket, messages, selectedUser } = GV;
  const [message, setMessage] = useState(messageTemplate);
  const [conversationid, setConversationId] = useState();
  const [senderid, setSenderid] = useState();
  const [receiverid, setReceiverid] = useState();
  const [contenttype, setContentType] = useState();
  const [content, setContent] = useState('');
  const [parentmessageid, setParentmessageid] = useState();
  const [reactions, setReactions] = useState();
  const [mentions, setMentions] = useState();
  const [forwardedfromconversationid, setForwardedFromConversationid] = useState();
  const [attachments, setAttachments] = useState();
  const [isedited, setIsEdited] = useState();
  const loggedInUser = getChatUser();
  // const [path, setPath] = useState();

  const handleSendMessageClick = () => {
    const sendMessageInput = {
      "senderSocketID": loggedInUser.socketID,
      "senderUserName": loggedInUser.username,
      "receiverSocketID": GV.conversationMembers?.map(_ => _.user_id)?.map(cm => GV.users?.find(u => u.user_id == cm)?.socketID),
      "conversation_id": selectedUser.conversation_id,
      "msg": (message),
      "msgStatus": 'INITIATED',
      "contentType": "Text"
    }
    console.log(sendMessageInput.receiverSocketID);
    thisSocket.emit("sendMessage", sendMessageInput);


    setContent(message);

    handleConversationSet();

    setMessage('');


  }

  const handleSendFileClick = (path) => {
    addConversation({
      conversationid: selectedUser.conversation_id,
      senderid: loggedInUser.user_id,
      // receiverid: selectedUser.user_id,
      contenttype: 'Image',
      content: path,
      parentmessageid,
      reactions,
      mentions,
      forwardedfromconversationid,
      attachments,
      isedited,
    });
  }

  const handleConversationSet = () => {
    addConversation({
      conversationid: selectedUser.conversation_id,
      senderid: loggedInUser.user_id,
      // receiverid: selectedUser.user_id,
      contenttype: 'Text',
      content: message,
      parentmessageid,
      reactions,
      mentions,
      forwardedfromconversationid,
      attachments,
      isedited,
    });
  }

  useEffect(() => {
    thisSocket && thisSocket.emit("typingMessage", {
      "senderSocketID": loggedInUser.socketID,
      "senderUserName": loggedInUser.username,
      "receiverSocketID": GV.conversationMembers?.map(_ => _.user_id)?.map(cm => GV.users?.find(u => u.user_id == cm)?.socketID),
      "conversationID": selectedUser && selectedUser.conversation_id,
      "composing": message ? true : false
    });
  }, [message ? true : false]);

  function upload(files) {
    thisSocket.emit("upload", {
      data: files[0], name: files[0].name,
      "senderUserName": loggedInUser.username,
      "conversation_id": selectedUser.conversation_id,
      "receiverSocketID": GV.conversationMembers?.map(_ => _.user_id)?.map(cm => GV.users?.find(u => u.user_id == cm)?.socketID),
      "content_type": "Image"
    }, (response) => {
      handleSendFileClick(response.message.path);
    }
    );
  }
  return (<>
    <div className='align-self-end flex-column w-100'  >
      {/* <div className=' align-items-end flex-column '>
        <div className="w-100 align-items-end d-flex">
        </div>
      </div> */}
      <MessageList messageList={messages} activeChat={selectedUser} />
      <div className='d-flex me-5 ms-1'>
        {
          selectedUser && <>
            <input type="text" className='col-11 text p-2'
              value={message} onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e => e.key === 'Enter' ? handleSendMessageClick() : true)}
            />

            <input type="button" className='col-1 btn btn-secondary' value=">"
              style={{ fontSize: '25px', paddingTop: '0px', width: '45px' }}
              onClick={handleSendMessageClick}></input>
            <label className='col-1' for="file_uploads"><img width="45px" className='border' src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344464.jpg"></img></label>
            <input type="file" onChange={(event) => upload(event.target.files)}
              id="file_uploads" name="file_uploads" style={{ opacity: '0', width: '1px' }}
            />
          </>
        }
      </div>
    </div>
  </>
  )
}
export default SendMessage