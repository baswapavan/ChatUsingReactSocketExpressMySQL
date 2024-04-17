import React, { useEffect, useState, useContext } from 'react'
import { addUser, roles } from './Library';
import { GVContext } from './Login';




function SignUp(props) {

  const [loggedin_userid, setLoggedin_Userid] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [about, setAbout] = useState('');
  const [role, setRole] = useState('');
  const [createNewUser, setCreateNewUser] = useState(null);
  const [rolesDataIn, setRolesDataIn] = useState();
  const { GV, setGV } = useContext(GVContext);
  const { thisSocket } = GV;



  useEffect(() => {
    props.loggedInUser && props.loggedInUser.user_id &&
      setLoggedin_Userid(props.loggedInUser.user_id);
  }, []);

  function upload(files) {
    thisSocket.emit("upload", {
      data: files[0],
      name: files[0].name,
    }, (response) => {
      if (response) {
        setProfileImage(response.message.path);
      } else {
        // Handle upload failure
        console.error("Failed to upload image:", response.error);
      }
    });
  }

  const handleSignUp = async () => {
    //socket.emit("upload", object, (result)=>{})
    try {
      await addUser({ loggedin_userid, username, password, email, fullname, profile_picture: profileImage, timezone, about, role })
      setCreateNewUser('success');

    }
    catch (error) {
      setCreateNewUser('success');
    }
  }

  // const handleSignUp = () => {
  //   socket.emit("upload", object, (result) => {

  //     try {
  //       addUser({ loggedin_userid, username, password, email, fullname, profileImage: result["path"], timezone, about, role })
  //       setCreateNewUser('success');

  //     }
  //     catch (error) {
  //       setCreateNewUser('success');
  //     }
  //   })

  // }

  // const handleRolesGet = () => {
  //   roles((roles) => {
  //     setRolesData(roles);
  //   });
  // }

  const handleRolesGet = () => {
    props.rolesData &&
      setRolesDataIn(props.rolesData);
  }

  return (
    <>
      <div className='mx-auto justify-content-center align-middle card'>
        <div className=' mb-2 card-header display-6' >Add User</div>
        <div className='card-body'>
          <form >
            <input type="text" value={username}
              onChange={(e) => setUsername(e.target.value)} className='form-control m-2 p-2' placeholder='username'></input>

            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} className='form-control m-2 p-2' placeholder='Password'></input>

            <input type="text" value={email}
              onChange={(e) => setEmail(e.target.value)} className='form-control m-2 p-2' placeholder='Email'></input>
            <input type="text" value={fullname}
              onChange={(e) => setFullname(e.target.value)} className='form-control m-2 p-2' placeholder='Full name'></input>
            <input type="file"
              onChange={(e) => upload(e.target.files)} className='form-control m-2 p-2' placeholder='Profile image'></input>
            <input type="text" value={timezone}
              onChange={(e) => setTimezone(e.target.value)} className='form-control m-2 p-2' placeholder='Time zone'></input>
            <input type="text" value={about}
              onChange={(e) => setAbout(e.target.value)} className='form-control m-2 p-2' placeholder='About'></input>
            {/* <input type="text" value={role}
              onChange={(e) => setRole(e.target.value)} className='form-control m-2 p-2' placeholder='Role'></input> */}
            <select
              className='form-select m-2 p-2'
              value={role}
              onClick={handleRolesGet}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled select>Select a role</option>
              {rolesDataIn && rolesDataIn.map((_) => (
                <option key={_.role_id} value={_.role_id}>
                  {_.role}
                </option>
              ))}
            </select>

          </form>
        </div>
        <div>
          <input type="submit" onClick={handleSignUp} className='btn btn-primary m-3 mt-0' value="Register"></input>
        </div>
        {/* <div>
        Already registered? <a onClick={handleChatLogin} className='m-2' style={{ cursor: 'pointer' }}> Login here</a>
      </div> */}
      </div>
      {createNewUser === 'success' && (
        <div class="alert alert-success mt-3" role="alert">
          newUser successfully created!
        </div>
      )}
      {createNewUser === 'error' && (
        <div class="alert alert-danger mt-3" role="alert">
          Failed to create newUser. Please try again.
        </div>
      )}
    </>
  )
}

export default SignUp