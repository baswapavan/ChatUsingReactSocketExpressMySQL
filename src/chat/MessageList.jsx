import React, { useContext, useState, useEffect, useRef } from 'react';
import { conversationInfoGet, getChatUser, conversationNonMembersGet, conversationMemberAdd, conversationMemberDelete, updateConversation, conversationMessageDelete } from './Library';
import { GVContext } from './Login';
import groupImg from './group.png';
import plainImg from './Plain Profile.jpeg'
import { Delete } from '@mui/icons-material';



function MessageList({ messageList, activeChat }) {
  const { GV, setGV } = useContext(GVContext);
  const loggedInUser = getChatUser();
  const [infoClicked, setInfoClicked] = useState(false);
  const [conversationInfo, setConversationInfo] = useState();
  const [conversationNonMembers, setConversationNonMembers] = useState();
  const [memberToAdd, setMemberToAdd] = useState();
  const [memberToDelete, setMemberToDelete] = useState();
  const { thisSocket } = GV;
  const containerRef = useRef(null);
  const [editConversation, setEditConversation] = useState({
    name: '',
    metadata: '',
    profileimage: '' // Assuming profileimage is a file input
  });
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [editMode, isEditMode] = useState(false);

  const handleEditClick = () => {
    isEditMode(true);
  }

  const isComposing =
    activeChat &&
    GV.conversations &&
    GV.conversations.find(_ => _.conversation_id === activeChat.conversation_id)?.composing;


  const contextMessages = activeChat && messageList &&
    messageList.filter(_ =>
      (_.conversation_id == activeChat.conversation_id));
  const selectedUserDetails =
    activeChat &&
    GV.users &&
    GV.users.find((user) => user.username === activeChat.conversation_name);

  // const isCreator = activeChat && conversationInfo && loggedInUser.user_id == conversationInfo[0][0].creator_id;

  const handleInfoClick = () => {
    setInfoClicked((prevInfoClicked) => !prevInfoClicked);
  };
  const handleMemberEdit = () => {
    conversationNonMembersGet({ conversation_id: activeChat.conversation_id, user_id: GV.loggedInUser.user_id }, (res) => {
      setConversationNonMembers(res);
    });
    handleEditClick()
  };


  const handleMemberAdd = () => {
    conversationMemberAdd({ conversation_id: activeChat.conversation_id, user_id: memberToAdd, invite_by_user_id: loggedInUser.user_id, role: 'Participant', status: 'Active' }, (res) => {
      console.log(res)
      setConversationInfo((prev) => {
        // Copy the existing second array from prev        
        const updateFirstArray =
          prev[0] && prev[0][0].conversation_id === res[0][0].conversation_id
            ? [{ ...prev[0][0], member_count: res[0][0].member_count }, ...prev[0].slice(1)] // Update member_count if conversation_id matches
            : prev[0];

        const updatedSecondArray = [...prev[1]];
        // Append the latest record from res[0] to the copied array
        updatedSecondArray.push(res[0][0]);
        // Update the context with the updated second array and member_count in the first array
        return {
          [0]: updateFirstArray, // Add member_count to the first array
          [1]: updatedSecondArray // Update the second array
        };
      });
      setConversationNonMembers((prev) => {
        // Filter out the member with the specified user ID
        const updatedMembers = prev.filter(member => member.user_id !== res[0][0].user_id);
        // Return the updated list of members directly
        return updatedMembers;
      });
    });
  }

  const handleMemberDelete = (membership_id) => {
    const isConfirmed = window.confirm("Are you sure to delete the Member");

    if (isConfirmed) {
      conversationMemberDelete({
        membership_id, conversation_id: GV.selectedUser.conversation_id
      }, (response) => {
        // setGV((prev) => {
        //   // Filter out the deleted message from the message list
        //   const updatedMembers = prev.conversationMembers.filter(member => member.membership_id
        //     !== response[0][0].membership_id);
        //   // Update the context with the new message list
        //   return {
        //     ...prev, conversationMembers: updatedMembers
        //   };
        // });
        setConversationInfo((prev) => {

          // Update conversation member count within the conversation object
          const updatedConversation = prev[0].map(conversation => ({
            ...conversation,
            member_count: response[0][0].member_count // Update member count
          }));

          const updatedMembers = prev[1].filter(member => member.membership_id
            !== response[0][0].membership_id);
          return {
            ...prev, [0]: updatedConversation, [1]: updatedMembers
          };
        });
        setConversationNonMembers((prevConversations) => {
          return [...prevConversations, response[1][0]]
        })
      });
    }
    else {
    }
  }

  const getMessage = (msgs) => {
    return msgs.map(_ => {
      return {
        "senderSocketID": "",
        "senderUserName": _.sender_username,
        "receiverSocketID": "",
        "conversation_id": _.conversation_id,
        "msg": _.content,
        "msgStatus": _.status,
        "content_type": _.content_type,
        "t": _.timestamp,
        "msgId": _.message_id
      }
    });
  }
  useEffect(() => {
    if (activeChat) {
      conversationInfoGet({ conversation_id: activeChat.conversation_id }, (conversationInfo) => {
        // console.log(conversationInfo);
        setConversationInfo(conversationInfo);
        setGV((prev) => {
          return {
            ...prev, conversationMembers: conversationInfo[1], messages: getMessage(conversationInfo[2]),
          };
        });
      });
    }
  }, [activeChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messageList]);




  const handleUpdateConversation = async () => {
    try {
      if (selectedFile) {
        upload(selectedFile);
      }
      updateConversation(
        {
          conversationid: activeChat.conversation_id,
          name: editConversation.name,
          metadata: editConversation.metadata
        },
        (response) => {
          // Update the state with the updated conversation
          setGV((prev) => {
            // Update the specific conversation in the conversations array
            const updatedConversations = prev.conversations.map((conversation) => {
              if (conversation.conversation_id === response[0][0].conversation_id) {
                return response[0][0]; // Replace the existing conversation with the updated one
              } else {
                return conversation; // Keep other conversations unchanged
              }
            });

            // Update selectedUser if its conversation_id matches the updated conversation
            const updatedSelectedUser =
              prev.selectedUser && prev.selectedUser.conversation_id === response[0][0].conversation_id
                ? response[0][0]
                : prev.selectedUser;

            // Return the updated state with the updated conversations and selectedUser
            return { ...prev, conversations: updatedConversations, selectedUser: updatedSelectedUser };
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  function upload(files) {
    thisSocket.emit("upload", {
      data: files[0],
      name: files[0].name,
      previous_file_name: conversationInfo[0][0].profile_image
    }, (response) => {
      if (response) {
        setEditConversation({ ...editConversation, profileimage: response.message.path });
        const result = updateConversation(
          {
            conversationid: activeChat.conversation_id,
            name: editConversation.name,
            metadata: editConversation.metadata,
            profileimage: response.message.path
          }, (response) => {
            setConversationInfo(prev => ({
              ...prev,
              name: editConversation.name,
              metadata: editConversation.metadata,
              profile_image: editConversation.profileimage
            }));
            setGV((prev) => {
              // Update the specific conversation in the conversations array
              const updatedConversations = prev.conversations.map(conversation => {
                if (conversation.conversation_id === response[0][0].conversation_id) {
                  return response[0][0]; // Replace the existing conversation with the updated one
                } else {
                  return conversation; // Keep other conversations unchanged
                }
              });

              // Update selectedUser if its conversation_id matches the updated conversation
              const updatedSelectedUser =
                prev.selectedUser && prev.selectedUser.conversation_id === response[0][0].conversation_id
                  ? response[0][0]
                  : prev.selectedUser;

              // Return the updated state with the updated conversations
              return { ...prev, conversations: updatedConversations, selectedUser: updatedSelectedUser };
            });
          });
      }
    });
  }



  const handleDeleteMessage = (_) => {
    const isConfirmed = window.confirm("Are you sure to delete the message?");

    if (isConfirmed) {
      // Delete SQL data regardless of the content type
      conversationMessageDelete({ message_id: _.msgId }, (response) => {
        // Handle deletion callback if needed
        console.log(response);

        if (response[0][0]) {
          // Execute this block if content type is Text and response is not empty
          // Call socket event to delete AWS S3 file
          thisSocket.emit('deleteFile', { filepath: response[0][0].content }, () => {
            // Callback after deleting file
          });
        }
        setGV((prev) => {
          // Filter out the deleted message from the message list
          const updatedMessages = prev.messages.filter(message => message.msgId !== _.msgId);
          // Update the context with the new message list
          return { ...prev, messages: updatedMessages };
        });
      });
    } else {
      // Handle cancellation if needed
    }
  };



  useEffect(() => {
    // Populate input fields with current conversation details when component mounts
    if (conversationInfo) {
      setEditConversation({
        name: conversationInfo[0][0].name,
        metadata: conversationInfo[0][0].metadata,
        profileimage: ''
      });
    }
  }, [conversationInfo]);



  return (
    <>
      <div className="offcanvas offcanvas-end " id="demo" >
        {activeChat && (
          <div className="offcanvas-header container border-bottom">
            <h1 className="offcanvas-title">{activeChat.conversation_name}</h1>
            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#updateConversation" className='btn btn-primary'>Edit</button>
          </div>
        )}
        <div className="offcanvas-body">
          {conversationInfo && (
            <>
              {conversationInfo[0].map((conversation, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden' }}>
                      {conversation.profile_image !== null && conversation.profile_image !== "" ? (
                        <img
                          className="rounded"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          src={conversation.profile_image}
                          alt="Profile"
                        />
                      ) : (
                        <img
                          className="rounded"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          src={plainImg}
                          alt="Plain"
                        />
                      )}
                    </div>
                    <div className='' style={{ marginLeft: '0px', marginTop: '-10px', fontSize: "14px" }}>
                      <table className="table-borderless " >
                        <tbody >
                          <tr >
                            <td>creater:</td>
                            <td>{conversation.creator_name}</td>
                          </tr>
                          <tr>
                            <td>creation date:</td>
                            <td>{conversation.creation_timestamp}</td>
                          </tr>
                          <tr>
                            <td>members count:</td>
                            <td>{conversation.member_count}</td>
                          </tr>
                        </tbody>
                      </table >
                    </div>
                  </div>
                  <p className="mt-2"><b>Description: </b>{conversation.metadata}</p>
                </div>
              ))}

              <div className="my-3" style={{ backgroundColor: '#eeeeee' }}><span className='float-start '>Participants:</span>
                {activeChat && conversationInfo && loggedInUser.user_id == conversationInfo[0][0].creator_id ?
                  <button onClick={handleMemberEdit} className='float-end btn btn-primary'>
                    Edit
                  </button> : null
                }
              </div>
              <div style={{ fontSize: "15px" }} className="mt-5">
                <table className="table table-borderless mt-3" >
                  <tbody>
                    {conversationInfo[1].map((conversationmembers, index) => (
                      <tr key={index}>
                        <td className="float-start">{conversationmembers.participant_name}</td>
                        <td className="float-end">{conversationmembers.role}</td>
                        <td>
                          {editMode && conversationmembers.role !== 'Admin' && (
                            <Delete onClick={() => handleMemberDelete(conversationmembers.membership_id)} />
                          )}
                        </td>
                      </tr>
                    ))}

                    {conversationNonMembers && conversationNonMembers.length > 0 &&
                      <tr>
                        <td>
                          <select className='form-select' onClick={(e) => setMemberToAdd(e.target.selectedOptions[0]?.value)}>
                            <option value='' disabled selected>Add User</option>
                            {conversationNonMembers.map(_ => <option key={_.user_id} value={_.user_id} >{_.full_name}</option>)}
                          </select>
                        </td>
                        <td>
                          <button onClick={handleMemberAdd} className='float-end btn btn-primary'>Add</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div >
      {conversationInfo && (
        <div className="offcanvas offcanvas-end" id="updateConversation">
          <div className='mx-auto justify-content-center align-middle  card' style={{ width: '100%' }} >
            <div className=' mb-2 card-header display-6' > Update Conversation</div>
            <div className='card-body'>
              {conversationInfo[0].map((conversation, index) =>
              (<div key={index}>
                <span className='float-start mx-2 my-0 h6'>Conversation Name:</span>
                <input type="text" className="form-control m-2 p-2 my-3" id="conversationName" name="conversationName" required value={editConversation.name} onChange={(e) => setEditConversation({ ...editConversation, name: e.target.value })} />
                <span className='float-start mx-2 my-0 h6' >Description:</span>
                <textarea className="form-control m-2 p-2 my-3" id="description" name="description" rows="3" value={editConversation.metadata} onChange={(e) => setEditConversation({ ...editConversation, metadata: e.target.value })}></textarea>
                <span className='float-start mx-2 my-0 h6' >Profile Image:</span>
                <input type="file" className="form-control m-2 p-2 my-3"
                  onChange={(event) => setSelectedFile(event.target.files)}
                />

                <button type="text" className="btn btn-primary" onClick={handleUpdateConversation} >Submit</button>
              </div>))}
            </div>
          </div>
        </div>)
      }
      {activeChat && (
        <div className="selected-user-details bg-light text-white ">
          <div className="col p-1 m-0" style={{
            backgroundColor: "#e9ecef",
            position: 'fixed', top: 53, width: '100%', padding: "9px", margin: "0px"
          }}>
            <div className="info_icon ps-1 pe-1 py-1 float-start" style={{ width: '50px', height: '50px', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden' }}>
              {activeChat.profile_image !== null && activeChat.profile_image !== "" ? (
                <img className="info_icon ps-1 pe-1 py-1 float-start btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#demo" src={activeChat.profile_image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onClick={handleInfoClick} />
              ) : (
                <img className="info_icon ps-1 pe-1 py-1 float-start btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#demo" src={plainImg} alt="Plain" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onClick={handleInfoClick} />
              )}
            </div>

            <span className="float-start text-black px-2">{activeChat.conversation_name} <br /><span className="float-start" style={{ fontSize: "10px" }}>{activeChat.last_message_timestamp}</span></span>
          </div>
        </div>
      )
      }

      {
        !contextMessages || contextMessages.length === 0 ? <>
          <div class="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <h6>You have neither selected an conversation nor you may have started the conversation yet!</h6>
          </div>

          {
            isComposing &&
            <div style={{ fontStyle: 'italic' }}
              className='text-primary'
            >{`${activeChat.conversation_name} is typing...`}</div>
          }
        </>
          : <div className='m-0' style={{ maxHeight: '572px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#BEBEBE transparent' }} ref={containerRef}>
            {contextMessages.map((_, index) => (
              <div key={index} className={_.senderUserName === loggedInUser.username ? 'text-end ' : 'text-start'}>
                {hoveredMessageId === _.msgId && (
                  <div style={{ position: 'relative', top: -7, right: 7 }}>
                    <button onClick={() => handleDeleteMessage(_)} className='btn btn-secondary'>Delete</button>
                  </div>
                )}
                {_.content_type === "Image" ? (
                  <img
                    className="ps-2 pe-2 py-2 mx-2 mw-50"
                    src={_.msg || _.path}
                    width="200px"
                    alt="img"
                    style={
                      _.senderUserName === loggedInUser.username
                        ? {
                          backgroundColor: '#eafade',
                          borderRadius: '10px',
                          overflowWrap: 'anywhere',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                        : {
                          backgroundColor: '#dcdddb',
                          borderRadius: '10px',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                    }
                    onClick={() => setHoveredMessageId(_.msgId)}
                  ></img>
                ) : _.content_type === "File" ? (
                  <span className='ps-2 pe-2 py-2 mx-2  mw-50'
                    style={
                      _.senderUserName === loggedInUser.username
                        ? {
                          backgroundColor: '#eafade',
                          display: 'inline-block',
                          width: '300px', // Set your desired fixed width
                          height: 'auto', // Set your desired fixed height
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          borderRadius: '10px'
                        }
                        : {
                          backgroundColor: '#dcdddb',
                          display: 'inline-block',
                          width: '300px', // Set your desired fixed width
                          height: '200px', // Set your desired fixed height
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          borderRadius: '10px'
                        }
                    }
                    onClick={() => setHoveredMessageId(_.msgId)}>
                    <a
                      href={_.msg || _.path}
                      target="_blank" // Open the PDF file in a new tab window
                      rel="noopener noreferrer"
                      style={{ width: '300px', height: '200px' }}
                    >
                      {_.msg || _.path}
                    </a>
                  </span>

                ) : _.content_type === "Video" ? (
                  <video
                    controls // Display video controls
                    className="ps-2 pe-2 py-2 mx-2 mw-50"
                    style={
                      _.senderUserName === loggedInUser.username
                        ? {
                          backgroundColor: '#eafade',
                          borderRadius: '10px',
                          overflowWrap: 'anywhere',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                        : {
                          backgroundColor: '#dcdddb',
                          borderRadius: '10px',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                    }
                    onClick={() => setHoveredMessageId(_.msgId)}
                  >
                    <source src={_.msg || _.path} type="video/mp4" />
                    {/* Assuming `_.msg` or `_.path` contains the URL of the video file */}
                    Your browser does not support the video tag.
                  </video>
                ) : _.content_type === "Audio" ? (
                  <audio
                    controls // Display audio controls
                    className="ps-2 pe-2 py-2 mx-2 mw-50"
                    style={
                      _.senderUserName === loggedInUser.username
                        ? {
                          backgroundColor: '#eafade',
                          borderRadius: '10px',
                          overflowWrap: 'anywhere',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                        : {
                          backgroundColor: '#dcdddb',
                          borderRadius: '10px',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                    }
                    onClick={() => setHoveredMessageId(_.msgId)}
                  >
                    <source src={_.msg || _.path} type="audio/mpeg" />{/* Assuming `_.msg` or `_.path` contains the URL of the audio file */}
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <span
                    className="ps-2 pe-4 py-2 m-2 mw-50"
                    style={
                      _.senderUserName === loggedInUser.username
                        ? {
                          backgroundColor: '#eafade',
                          borderRadius: '10px',
                          lineHeight: '29px',
                          overflowWrap: 'anywhere',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                        : {
                          backgroundColor: '#dcdddb',
                          borderRadius: '10px',
                          lineHeight: '29px',
                          overflowWrap: 'anywhere',
                          maxWidth: '400px',
                          maxHeight: 'auto',
                        }
                    }
                    onClick={() => setHoveredMessageId(_.msgId)}
                  >
                    {_.msg}
                  </span>
                )}
                <div style={{ fontSize: '10px' }} className="pt-1 pb-3 ps-2 pe-2">
                  <span style={{ fontStyle: 'italic', color: '#adadad' }}>{_.t}</span>
                </div>
              </div>
            ))}

            {
              isComposing &&
              <div style={{ fontStyle: 'italic', fontSize: '10px' }}
                className='text-primary'
              >{`${activeChat.conversation_name} is typing...`}</div>
            }
          </div >
      }
    </>
  );
}
export default MessageList