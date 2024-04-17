import React, { useContext, useEffect, useState } from 'react'
import MessageList from './MessageList';
import { GVContext } from './Login';
import { getChatUser, addConversation } from './Library';
import fileImg from './file.png'


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
    // Extracting file extension
    const fileExtension = path.split('.').pop().toLowerCase();

    // Setting content type based on file extension
    let contentType;
    switch (fileExtension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'tiff':
        contentType = 'Image';
        break;
      case 'pdf':
      case 'txt':
      case 'doc':
      case 'docx':
      case 'rtf':
        contentType = 'File';
        break;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mkv':
      case 'wmv':
      case 'flv':
      case 'webm':
        contentType = 'Video';
        break;
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'flac':
      case 'ogg':
      case 'wma':
      case 'm4a':
        contentType = 'Audio';
        break;
      default:
        // If extension is not recognized, you can set a default content type or handle it accordingly
        contentType = '';
        break;
    }

    // Adding conversation with appropriate content type
    addConversation({
      conversationid: selectedUser.conversation_id,
      senderid: loggedInUser.user_id,
      contenttype: contentType,
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
    }, (response) => {

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

    // Extract file extension from the name
    const fileExtension = files[0].name.split('.').pop().toLowerCase();

    // Define content type based on file extension
    var contentType = "";
    if (fileExtension === 'jpg' || fileExtension === 'png') {
      contentType = "Image";
    } else if (fileExtension === 'mp4') {
      contentType = "Video";
    } else if (fileExtension === 'mp3') {
      contentType = "Audio";
    } else if (fileExtension === 'pdf') {
      contentType = "File";
    }
    else {
      // Default to empty string or handle unsupported file types
      // based on your application's requirements
      contentType = "";
    }
    thisSocket.emit("upload", {
      data: files[0],
      name: files[0].name,
      "senderUserName": loggedInUser.username,
      "conversation_id": selectedUser.conversation_id,
      "receiverSocketID": GV.conversationMembers?.map(_ => _.user_id)?.map(cm => GV.users?.find(u => u.user_id == cm)?.socketID),
      "content_type": contentType
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
      <div className='d-flex me-5 ms-1 '>
        {
          selectedUser && <>
            <input type="text" className='col-11 text p-2'
              value={message} onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e => e.key === 'Enter' ? handleSendMessageClick() : true)}
              style={{ borderRadius: "10px" }}
            />
            <input type="button" className='col-1 btn btn-secondary' value=">"
              style={{ fontSize: '25px', paddingTop: '0px', width: '45px', borderRadius: "15px", }}
              onClick={handleSendMessageClick}></input>
            <label className='col-1' for="file_uploads"><img width="40px" src={fileImg} style={{ cursor: 'pointer' }} /></label>
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