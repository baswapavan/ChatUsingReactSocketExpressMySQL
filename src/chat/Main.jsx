import React, { useEffect, useState, createContext, useContext } from 'react';
import ChatList from "./ChatList";
import SendMessage from "./SendMessage";
import { GVContext } from './Login';
import SignUp from './SignUp';
import Users from './Users';
import threedots from './three-dots.png';
import { conversationsGet, getChatUser, conversationWithMembersAdd, users, updateUser, conversationToDelete } from './Library';
import Roles from './Roles';

function Main(props) {
  const { GV, setGV } = useContext(GVContext);
  const [activeChat, setActiveChat] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState();
  const [conversations, setConversations] = useState([]);
  const [conversationName, setConversationName] = useState('');
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [createStatus, setCreationStatus] = useState(null);
  const [editStatus, setEditStatus] = useState(null);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [fullname, setFullname] = useState();
  const [timezone, setTimezone] = useState();
  const [about, setAbout] = useState();
  const [editMode, isEditMode] = useState(false);
  const [conversationId, setConversationId] = useState();
  const [showUsers, setShowUsers] = useState(true);
  const [isDropdownVisable, setIsDropdownVisable] = useState(false);
  const [showRoles, setShowRoles] = useState(true);
  const [activeMenu, setActiveMenu] = useState('chat');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await conversationWithMembersAdd({
        name: conversationName,
        creator_id: GV.loggedInUser.user_id,
        users: [GV.loggedInUser.user_id, ...members],
        meta_data: description,
        profile_image: profileImage,
      }, (result) => {
        setConversations(prevConversations => [result[1], ...prevConversations]);
        setCreationStatus(result[0]);
        setActiveChat(result[1]); // Select the new conversation
        setGV({ ...GV, selectedUser: result[0] });
        setNeedUpdate(n => !n);
      });

    } catch (error) {
      setCreationStatus('error');
    }
  };
  const updateSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUser(
        {
          loggedin_userid: GV.loggedInUser.user_id,
          user_name: GV.loggedInUser.username,
          password: password,
          email: email,
          full_name: fullname,
          time_zone: timezone,
          about: about,
        },
        (result) => {
          setEditStatus(result);
        }
      );
    } catch (error) {
      setEditStatus('error');
    }
  };
  const handleChatListClick = (user) => {
    setActiveChat(() => user);
    setGV({ ...GV, selectedUser: user });
  }

  useEffect(() => {

    GV.thisSocket && GV.thisSocket.emit("getUsers", {}, (res) => {
      // console.log(res);
      setGV((prev) => { return { ...prev, users: res } });
    });

    GV.thisSocket && GV.thisSocket.on("getMessage", (message, call_back) => {
      //console.log(message);
      setGV((prev) => { return { ...prev, messages: [...prev.messages, { ...message, isRead: false }] } });
      //setMessageList((prev) => [...prev, {...message, isRead:false}]);
      setNeedUpdate(n => !n);
      //call_back({...message, 'msgStatus':'DELIVERED'});

      message.senderUserName !== GV.loggedInUser.username &&
        playMessageNotification();
      //showNotification(message);

    });

    function playMessageNotification() {
      var audio = document.createElement('audio');
      var source = document.createElement('source');
      source.src = 'MessageTone.mp3';
      source.type = 'audio/mpeg';
      audio.appendChild(source);
      audio.play();
    }

    GV.thisSocket && GV.thisSocket.on("typingMessage", (notification) => {
      setConversations((prev) => { return prev.map(_ => { return { ..._, composing: ((_.conversation_id === notification.conversationID && notification.composing && notification.senderUserName != GV.loggedInUser.username) ? true : false) } }) });
      setGV(prev => { return { ...prev, conversations: prev.conversations.map(_ => { return { ..._, composing: ((_.conversation_id === notification.conversationID && notification.composing && notification.senderUserName != GV.loggedInUser.username) ? true : false) } }) } })
      // setConversations(newconversations);
      setNeedUpdate(n => !n);
    });

    GV.thisSocket && GV.thisSocket.on("users", (users) => {
      console.log(users);
      // setUsers(users);
      setGV((prev) => {
        return {
          ...prev,
          'users': users
          , 'selectedUser': users.find(_ => _.email === activeChat.email)
        }
      })
    });

  }, [GV.thisSocket]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const username = getChatUser().username;
        await conversationsGet({ username }, (res) => {
          setConversations(res);
          setGV((prev) => { return { ...prev, conversations: res } });
        });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);


  useEffect(() => {
    const fetchUsersData = async (event) => {
      try {
        const user_id = GV.loggedInUser.user_id;
        await users({ user_id }, (res) => {
          setUsersData(res);
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    GV.loggedInUser && fetchUsersData();
  }, [GV.thisSocket]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // const handleChatSignup = () => {
  //   setSignUp(true);
  // }

  const handleEditClick = () => {
    isEditMode(true);
  }

  const conversationDelete = () => {
    conversationToDelete({ conversation_id: conversationId }, () => {
      //Next code to execute
    });
  }

  // const handleUsersButtonClick = () => {
  //   setShowUsers(!showUsers);
  // };

  // const handleRolesButtonClick = () => {
  //   setShowRoles(!showRoles);
  // };

  const handleHeaderMenuClick = (menuname) => {
    setActiveMenu(menuname);
  }


  const toggleDropdown = () => {
    setIsDropdownVisable(!isDropdownVisable)
  };

  return (
    <>
      <table className="table my-0 border border-top-0 w-100 vh-100">
        <tbody>
          <tr style={{ height: '40px' }} className='border-bottom'>
            <td className='p-1' >
              <div className='text-primary p-2 text-start' ><i>Hello!</i>
                <b> <a href="#EditLoggedInUser" data-bs-toggle="offcanvas" style={{ textDecoration: "none" }}>{GV.loggedInUser && GV.loggedInUser.username}</a></b>
                <div className="offcanvas offcanvas-end" id="EditLoggedInUser">
                  <div className='mx-auto justify-content-center align-middle card' style={{ width: '100%' }} >
                    <div className=' mb-2 card-header display-6' >EditUser</div>
                    <div className='card-body'>
                      {usersData &&
                        usersData
                          .filter((user) => user.user_id == GV.loggedInUser.user_id)
                          .map((user) => (
                            <form key={user.user_id}>
                              <label className='float-start mx-2 my-0 h6' >Password:</label>
                              <input
                                type="password"
                                // value={user.password_hash}
                                value={editMode ? password : user.password_hash}
                                onChange={(e) => setPassword(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='Password'
                                id="password"
                                onClick={handleEditClick}
                              />
                              <label className='float-start mx-2 my-0 h6' >Email:</label>
                              <input
                                type="text"
                                // value={user.email}
                                value={editMode ? email : user.email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='Email'
                                id="email"
                                onClick={handleEditClick}
                              />
                              <label className='float-start mx-2 my-0 h6' >Full Name:</label>
                              <input
                                type="text"
                                // value={user.full_name}
                                value={editMode ? fullname : user.full_name}
                                onChange={(e) => setFullname(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='Full name'
                                id="fullname"
                                onClick={handleEditClick}
                              />
                              <label className='float-start mx-2 my-0 h6' >Profile Image:</label>
                              <input
                                type="file"
                                // value={user.profileImage}
                                value={editMode ? profileImage : user.profileImage}
                                onChange={(e) => setProfileImage(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='Profile image'
                                id="userProfileImage"
                                onClick={handleEditClick}
                              />
                              <label className='float-start mx-2 my-0 h6' >Time Zone:</label>
                              <input
                                type="text"
                                // value={user.timezone}
                                value={editMode ? timezone : user.timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='Time zone'
                                id="timezone"
                                onClick={handleEditClick}
                              />
                              <label className='float-start mx-2 my-0 h6' >About:</label>
                              <input
                                type="text"
                                // value={user.about}
                                value={editMode ? about : user.about}
                                onChange={(e) => setAbout(e.target.value)}
                                className='form-control m-2 p-2 my-3'
                                placeholder='About'
                                id="about"
                                onClick={handleEditClick}
                              />
                            </form>
                          ))}
                      <div>
                        <input type="submit" onClick={updateSubmit} className='btn btn-primary m-0' value="Update"></input>
                      </div>
                    </div>
                  </div>
                  {editStatus && editStatus[0].status === 1 && (
                    <div className="alert alert-success mt-3 mx-4">
                      {editStatus[0].message}</div>
                  )}
                  {editStatus === 'error' && (
                    <div class="alert alert-danger mt-5 m-4" >
                      Failed to updated UserDetials. Please try again.
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td >
              <div className="offcanvas offcanvas-end" id="addConversation">
                <div className='mx-auto justify-content-center align-middle  card' style={{ width: '100%' }} >
                  <div className=' mb-2 card-header display-6' > New Conversation</div>
                  <div className='card-body'>
                    <form>
                      <span className='float-start mx-2 my-0 h6'>Conversation Name:</span>
                      <input type="text" className="form-control m-2 p-2 my-3" id="conversationName" name="conversationName" required onChange={(e) => setConversationName(e.target.value)} />
                      <span className='float-start mx-2 my-0 h6'>Members:</span>
                      <select className="form-select m-2 p-2 my-3" id="members" name="members[]" multiple required
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions);
                          const selectedUserIds = selectedOptions.map(option => option.value);
                          setMembers(selectedUserIds);
                        }}
                      >
                        {usersData && usersData
                          .filter((_) => _.user_id !== GV.loggedInUser.user_id)
                          .map(_ => (
                            <option key={_.user_id} value={_.user_id}>
                              {_.full_name}
                            </option>
                          ))}
                      </select>
                      <span className='float-start mx-2 my-0 h6' >Description:</span>
                      <textarea className="form-control m-2 p-2 my-3" id="description" name="description" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
                      <span className='float-start mx-2 my-0 h6' >Profile Image:</span>
                      <input type="file" className="form-control m-2 p-2 my-3" id="conversationProfileImage" name="conversationProfileImage" accept="image/*" onChange={(e) => handleProfileImageChange(e)}
                      />
                      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    </form>
                  </div>
                </div>
                {createStatus && createStatus[0].status === 1 && (
                  <div className="alert alert-success mt-3 m-4" role="alert">
                    {createStatus[0].message}
                  </div>
                )}
                {createStatus === 'error' && (
                  <div className="alert alert-danger mt-3 m-4" role="alert">
                    Failed to create conversation. Please try again.
                  </div>
                )}
              </div>
            </td>
            <td>
              <div className="offcanvas offcanvas-end " id="deleteConversation" style={{ height: "200px" }}>
                <div className="offcanvas-body">
                  <div style={{ fontSize: "15px" }} className="mt-5">
                    <table className="table table-borderless mt-3" >
                      <tbody>
                        <label className='float-start mx-2 my-0 h6'>Conversations</label>
                        <tr >
                          <td>
                            <select className='form-select' onClick={(e) => setConversationId(e.target.selectedOptions[0].value)}>
                              {conversations && conversations.filter((_) => _.creator_id == GV.loggedInUser.user_id).map(_ => <option key={_.conversation_id} value={_.conversation_id} >{_.conversation_name}</option>)}
                            </select>
                          </td>
                          <td>
                            <button className='float-end' onClick={conversationDelete}>Delete</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div >
              {/* <div>
                  <button class="btn btn-" type="button" data-bs-toggle="offcanvas" data-bs-target="#deleteConversation"
                  >Delete Conversation</button>
                </div> */}
            </td>
            <td>
              <img src={threedots} alt="info" onClick={toggleDropdown} className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{ cursor: 'pointer', width: "28px" }}>
              </img>
              <ul className="dropdown-menu" style={{ cursor: 'pointer' }}>
                <li className="dropdown-item">{usersData && (usersData.some(_ => _.user_id === GV.loggedInUser.user_id && _.role_id === 1)) ? (
                  <a onClick={(e) => handleHeaderMenuClick('roles')}>
                    Roles
                  </a>
                ) : null}</li>
                <li className="dropdown-item">{usersData && (usersData.some(_ => _.user_id === GV.loggedInUser.user_id && _.role_id === 1)) ? (
                  <a onClick={() => handleHeaderMenuClick('users')}>
                    Users
                  </a>
                ) : null}</li>
                <li><a className="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#chat" onClick={() => handleHeaderMenuClick('chat')}>Chat</a></li>
                <li><a className="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#addConversation">Add Conversation</a></li>
                <li><a className="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#deleteConversation">Delete Conversation</a></li>
              </ul>
            </td>
          </tr>
          {activeMenu === "chat" ?
            <tr className='h-100'>
              <td className='d-flex h-100 py-0'>
                <>
                  <div className="col-3 border-end p-0">
                    <ChatList socket={GV.thisSocket} users={GV.users} activeChat={activeChat} conversations={conversations} handleChatListClick={handleChatListClick} />
                  </div>
                  <div className="col-12  d-flex p-2  ">
                    <SendMessage messageTemplate={messageTemplate} />
                  </div>
                </>
              </td>
            </tr>
            :
            activeMenu === "roles" ?
              <Roles />
              : activeMenu === 'users' && <Users usersData={usersData} conversations={conversations}></Users>
          }
        </tbody >
      </table >
    </>
  );
}

export default Main;