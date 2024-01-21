import React, { useContext, useState, useEffect } from 'react';
import { updateUser, conversationsGet, conversationMemberDelete, roles } from './Library';
import { GVContext } from './Login';
import flag_Icon from './more.png';
import SignUp from './SignUp';


function Users({ usersData }) {
  const { GV, setGV } = useContext(GVContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState()
  const [conversations, setConversations] = useState([]);
  const [rolesData, setRolesData] = useState([]);


  const handleCheckboxChange = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setShowEditOverlay(true);

  };



  // const handleEditClick = (user) => {
  //   setEditMode(true);
  //   setShowEditOverlay(true);
  // };

  // const handleEditClose = () => {
  //   setEditMode(false);
  //   setShowEditOverlay(false);
  // };

  const updateSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUser(
        {
          loggedin_userid: selectedUser.user_id,
          user_name: selectedUser.username,
          // password: selectedUser.password,
          email: selectedUser.email,
          full_name: selectedUser.full_name,
          time_zone: selectedUser.timezone,
          about: selectedUser.about,
          role_id: selectedUser.role_id,
          is_active: selectedUser.is_active
        },
        (result) => {
          setEditStatus('success');
        }
      );
    } catch (error) {
      setEditStatus('error');
    }
  };

  const handleConversatioGet = () => {
    const fetchConversations = async () => {
      try {
        await conversationsGet({ username: selectedUser.username }, (res) => {
          setConversations(res);
        });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    selectedUser && fetchConversations();
  }

  const handleMemberDelect = (membershipId) => {
    conversationMemberDelete({ membership_id: membershipId }, () => {
    });
  };

  // const handleRolesGet = () => {
  //   roles((roles) => {
  //     setRolesData(roles);
  //   });
  // }

  useEffect(() => {
    roles((roles) => {
      setRolesData(roles);
    });
  }, []);


  return (
    <tr>
      <button type="button" className="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
        data-bs-target="#addUser" >Add User</button>
      <div className='container pt-5'>
        <table className="table table-bordered" >
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>Email</th>
              <th>Fullname</th>
              <th>Timezone</th>
              <th>About</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {usersData && usersData.map((user) => (
              <tr key={user.user_id}>
                <td>
                  <input
                    type="checkbox"
                    data-bs-toggle="offcanvas" data-bs-target="#EditUser"
                    checked={selectedUser && selectedUser.user_id === user.user_id}
                    onChange={() => handleCheckboxChange(user)}
                  />
                  <img src={flag_Icon} alt='img' style={{ width: '18px' }} className='float-end'></img>
                </td>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.timezone}</td>
                <td>{user.about}</td>
                <td>{user.is_active}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditOverlay && (
          <div className="offcanvas offcanvas-end" id="EditUser">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" >Edit User</h5>
            </div>
            <div className="offcanvas-body">
              {editMode && selectedUser && (
                <form key={selectedUser.user_id}>
                  <label className='float-start mx-2 my-0 h6' htmlFor="email">Email:</label>
                  <input
                    type="text"
                    value={editMode ? selectedUser.email : selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className='form-control m-2 p-2 my-3'
                    placeholder='Email'
                    id="Email"
                  />
                  <label className='float-start mx-2 my-0 h6' htmlFor="full_name">Fullname:</label>
                  <input
                    type="text"
                    value={selectedUser.full_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                    className='form-control m-2 p-2 my-3'
                    placeholder='Fullname'
                    id="Fullname"
                  />
                  <label className='float-start mx-2 my-0 h6' htmlFor="timezone">Timezone:</label>
                  <input
                    type="text"
                    value={selectedUser.timezone}
                    onChange={(e) => setSelectedUser({ ...selectedUser, timezone: e.target.value })}
                    className='form-control m-2 p-2 my-3'
                    placeholder='Timezone'
                    id="Timezone"
                  />
                  <label className='float-start mx-2 my-0 h6' htmlFor="about">About:</label>
                  <input
                    type="text"
                    value={selectedUser.about}
                    onChange={(e) => setSelectedUser({ ...selectedUser, about: e.target.value })}
                    className='form-control m-2 p-2 my-3'
                    placeholder='About'
                    id="About"
                  />
                  <label className='float-start mx-2 my-0 h6'>Role:</label>
                  <select
                    className='form-select  m-2 p-2 my-3'
                    value={selectedUser.role_id}
                    // onClick={handleRolesGet}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role_id: e.target.value })}
                  >
                    {rolesData && rolesData.map((_) => (
                      <option key={_.role_id} value={_.role_id}>
                        {_.role}
                      </option>
                    ))}
                  </select>
                  <label className='float-start mx-2 my-0 h6'>Status:</label>
                  <select
                    value={selectedUser.is_active}
                    onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.value })}
                    className='form-select m-2 p-2 my-3'
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <div>
                    <button onClick={updateSubmit} className='btn btn-primary m-0'>Update</button>
                  </div>
                </form>
              )}
              <div id="accordion"  >
                <div className="card mt-3">
                  <div className="card-header">
                    <a data-bs-toggle="collapse"
                      className='text-decoration-none'
                      href="#collapseOne" onClick={handleConversatioGet}
                    >
                      User Conversation
                    </a>
                  </div>
                  <div id="collapseOne" className="collapse" data-bs-parent="#accordion">
                    <div className="card-body" >
                      {conversations && conversations.length > 0 ? <table className="table " style={{ maxHeight: '300px', overflow: 'auto' }}>
                        <thead>
                          <tr >
                            <th >Conversation Name</th>
                            <th>Role</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversations.map((_) => (
                            <tr key={_.membership_id}>
                              <td>
                                <td >{_.conversation_name}</td>
                              </td>
                              <td>{_.role ? _.role : 'Role'}</td>
                              <td>
                                <button className='btn btn-primary btn-sm' onClick={() => handleMemberDelect(_.membership_id)}>
                                  Exit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table> : <h6 className='pt-5'>This User is not a member of any one of the Conversation</h6>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* /////////// */}
        <td >
          {usersData && (usersData.some?.(_ => _.user_id === GV.loggedInUser.user_id && _.role_id === 1)) ? (
            <>
              <div className="offcanvas offcanvas-end" id="addUser">
                <div className='mx-auto justify-content-center align-middle' style={{ width: '100%' }}>
                  <SignUp loggedInUser={GV.loggedInUser} rolesData={rolesData} />
                </div>
              </div>
            </>
          ) : null}
        </td>
      </div>
    </tr>
  );
}

export default Users;
