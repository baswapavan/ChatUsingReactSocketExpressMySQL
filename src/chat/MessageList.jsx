import React, { useContext, useState, useEffect } from 'react';
import { conversationInfoGet, getChatUser, conversationNonMembersGet, conversationMemberAdd, conversationMemberDelete } from './Library';
import { GVContext } from './Login';
import groupImg from './group.png';


function MessageList({ messageList, activeChat }) {
  const { GV, setGV } = useContext(GVContext);
  const loggedInUser = getChatUser();
  const [infoClicked, setInfoClicked] = useState(false);
  const [conversationInfo, setConversationInfo] = useState();
  const [conversationNonMembers, setConversationNonMembers] = useState();
  const [memberToAdd, setMemberToAdd] = useState();
  const [memberToDelete, setMemberToDelete] = useState();

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
  };


  const handleMemberAdd = () => {
    conversationMemberAdd({ conversation_id: activeChat.conversation_id, user_id: memberToAdd, invite_by_user_id: loggedInUser.user_id, role: 'Participant', status: 'Active' }, (res) => {
      //Next code to execute
    });
  }

  const handleMemberDelete = () => {
    conversationMemberDelete({ membership_id: memberToDelete }, () => {
      //Next code to execute
    });
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
        "content_type": _.content_type
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


  return (
    <>
      <div className="offcanvas offcanvas-end " id="demo">
        {activeChat && (
          <div className="offcanvas-header container border-bottom">
            <h1 className="offcanvas-title">{activeChat.conversation_name}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
        )}
        <div className="offcanvas-body">
          {conversationInfo && (
            <>
              {conversationInfo[0].map((conversation, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                      <img className="rounded" style={{ width: '120px', paddingTop: '0px' }} src={groupImg} alt="info" />
                    </div>
                    <div className='' style={{ marginLeft: '20px', marginTop: '-10px', fontSize: "14px" }}>
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

              <div className="my-3 " style={{ backgroundColor: '#eeeeee' }}><span className='float-start'>Participants:</span>
                {activeChat && conversationInfo && loggedInUser.user_id == conversationInfo[0][0].creator_id ?
                  <button onClick={handleMemberEdit} className='float-end'>
                    Edit
                  </button> : null
                }
              </div>
              <div style={{ fontSize: "15px" }} className="mt-5">
                <table className="table table-borderless mt-3" >
                  <tbody>
                    {conversationInfo[1].map((conversationmembers, index) => (
                      <tr >
                        <td className="float-start">{conversationmembers.participant_name}</td>
                        <td className="float-end">{conversationmembers.role}</td>
                      </tr>
                    ))}
                    {conversationNonMembers && conversationNonMembers.length > 0 &&
                      <tr>
                        <td>
                          <select className='form-select' onClick={(e) => setMemberToAdd(e.target.selectedOptions[0]?.value)}>
                            {conversationNonMembers.map(_ => <option key={_.user_id} value={_.user_id} >{_.full_name}</option>)}
                          </select>
                        </td>
                        <td>
                          <button onClick={handleMemberAdd} className='float-end'>Add</button>
                        </td>
                      </tr>
                    }
                    {conversationNonMembers && conversationNonMembers.length > 0 &&
                      <tr>
                        <td>
                          <select className='form-select' onClick={(e) => setMemberToDelete(e.target.selectedOptions[0]?.value)}>
                            {conversationInfo[1].filter(_ => _.user_id !== GV.loggedInUser.user_id).map(_ => <option key={_.membership_id} value={_.membership_id} >{_.participant_name}</option>)}
                          </select>
                        </td>
                        <td>
                          <button onClick={handleMemberDelete} className='float-end'>Delete</button>
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
      {activeChat && (
        <div className="selected-user-details bg-light text-white ">
          <div className="row" style={{
            backgroundColor: "#e9ecef", marginLeft: '-8px',
            marginTop: '4px', position: 'fixed', top: 50, width: '100%', paddingBottom: "10px"
          }}>
            <div className="col">
              <img className="info_icon ps-1 pe-4 py-1 float-start btn " type="button" data-bs-toggle="offcanvas" data-bs-target="#demo" src={groupImg} style={{ width: '60px', cursor: 'pointer' }} alt="info"
                onClick={handleInfoClick}
              />
              <h5 className="float-start text-black">{activeChat.conversation_name}<br /></h5>
            </div>
          </div>
        </div>
      )
      }

      {
        !contextMessages || contextMessages.length === 0 ? <>
          <div className=' d-flex align-items-center'>You have neither selected an conversation nor you may have started the conversation yet!</div>
          {
            isComposing &&
            <div style={{ fontStyle: 'italic' }}
              className='text-primary'
            >{`${activeChat.conversation_name} is typing...`}</div>
          }
        </>
          : <div className='m-0'>
            {
              contextMessages.map((_, index) =>
                <div key={index}
                  className={
                    _.senderUserName === loggedInUser.username
                      ? 'text-end '
                      : 'text-start'}
                >
                  {_.content_type == "Image" ?
                    <img className="ps-2 pe-4 py-2 mw-50" src={_.msg || _.path} width='200px' alt="img"></img>
                    : <span className="ps-2 pe-4 py-2 mw-50" style={_.senderUserName === loggedInUser.username ? { backgroundColor: '#eafade', borderRadius: '10px', lineHeight: '29px', overflowWrap: 'anywhere' } : { backgroundColor: '#dcdddb', borderRadius: '10px', lineHeight: '29px', overflowWrap: 'anywhere' }} > {_.msg} </span>
                  }
                  <div style={{ fontSize: '10px' }} className='pt-1 pb-3 ps-2 pe-2'><span style={{ fontStyle: 'italic', color: '#adadad' }}>{_.t}</span></div>
                </div>
              )}
            {
              isComposing &&
              <div style={{ fontStyle: 'italic', fontSize: '10px' }}
                className='text-primary'
              >{`${activeChat.conversation_name} is typing...`}</div>
            }
          </div>
      }
    </>
  );
}

export default MessageList