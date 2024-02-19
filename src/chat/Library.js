import React from 'react'

// export const socketServerURL = 'http://fyiserver.office24by7.in:5000';
// export const APIServerURL = 'http://fyiserver.office24by7.in:3300';
export const APIServerURL = 'http://localhost:3300';

export const socketServerURL = 'http://localhost:5000';
// export const socketServerURL = 'http://13.200.117.24:5000';
function Library() {
  return (
    <div>Library</div>
  )
}


export const getChatUser = () => {
  return JSON.parse(window.localStorage.getItem('chat'));
};

export const validateUser = ({ username, password }, call_back) => {
  fetch(APIServerURL + '/validateUser', {
    method: 'POST'
    , body: JSON.stringify({
      'username': username
      , 'password': password

    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      console.log(json);
      if (json[0][0].response === 'valid')
        call_back(json[0]);
      else {
        alert(json[0][0].response);
      }
    })
}


export const addChatUser = (socket, user) => {
  socket.emit('newUser', user, (res) => {
    //Set Chat user details in local storage.
    window.localStorage.setItem('chat', JSON.stringify(res));
  });
};

export const addUser = ({ loggedin_userid, username, password, email, fullname, profileImage, timezone, about, role }) => {
  fetch(APIServerURL + '/user', {
    method: 'POST'
    , body: JSON.stringify({
      'loggedin_userid': loggedin_userid,
      'username': username
      , 'password': password
      , 'email': email
      , 'full_name': fullname
      , 'profileImage': profileImage
      , 'time_zone': timezone
      , 'about': about
      , 'role_id': role
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      console.log(json);
    })
}

export const conversationsGet = ({ username }, call_back) => {
  fetch(APIServerURL + `/conversations?user_name=${username}`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      // console.log('API calling')
      // console.log(json)
      call_back(json[0]);
    })
}

///org_id at here
export const users = ({ user_id }, call_back) => {
  fetch(APIServerURL + `/users?loggedin_userid=${user_id}`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0]);
    })
}

///////////////////////
export const updateUser = ({ loggedin_userid, user_name, password, email, full_name, time_zone, about, role_id, is_active }, call_back) => {
  fetch(APIServerURL + '/updateUser', {
    method: 'PUT'
    , body: JSON.stringify({
      'loggedin_userid': loggedin_userid,
      'user_name': user_name
      , 'password': password
      , 'email': email
      , 'full_name': full_name
      , 'time_zone': time_zone
      , 'about': about
      , 'role_id': role_id
      , 'is_active': is_active
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0]);

    })
}

export const roles = (call_back) => {
  fetch(APIServerURL + `/roles`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0])
    })
}

export const createRole = ({ role, description }, call_back) => {
  fetch(APIServerURL + `/role`, {
    method: 'POST'
    , body: JSON.stringify({
      "role": role,
      "description": description
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json)
    })
}

export const updateRole = ({ role_id, role, description }, call_back) => {
  fetch(APIServerURL + `/role`, {
    method: 'PUT'
    , body: JSON.stringify({
      "role_id": role_id,
      "role": role,
      "description": description
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json)
    })
}

export const deleteRole = ({ role_id }, call_back) => {
  fetch(APIServerURL + `/role?role_id=${role_id}`, {
    method: 'DELETE'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json)
    })
}



export const tasks = (call_back) => {
  fetch(APIServerURL + `/tasks`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0])
    })
}

export const getAllTasksForDropdown = (call_back) => {
  fetch(APIServerURL + `/getalltasksfordropdown`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0])
    })
}

export const createTask = ({ title, description, created_by, assigned_to, due_date, status_id, priority_id, parent_task_id }, call_back) => {
  fetch(APIServerURL + '/task', {
    method: 'POST'
    , body: JSON.stringify({
      'title': title,
      "description": description,
      "created_by": created_by,
      "assigned_to": assigned_to,
      "due_date": due_date,
      "status_id": status_id,
      "priority_id": priority_id,
      "parent_task_id": parent_task_id
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}



export const updateTask = ({ task_id, title, description, created_by, assigned_to, updated_by, due_date, status_id, priority_id, parent_task_id }, call_back) => {
  fetch(APIServerURL + `/task`, {
    method: 'PUT'
    , body: JSON.stringify({
      "task_id": task_id,
      'title': title,
      "description": description,
      "created_by": created_by,
      "assigned_to": assigned_to,
      "updated_by": updated_by,
      "due_date": due_date,
      "status_id": status_id,
      "priority_id": priority_id,
      "parent_task_id": parent_task_id
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const deleteTask = ({ task_id }, call_back) => {
  fetch(APIServerURL + `/task?task_id=${task_id}`, {
    method: 'DELETE'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json)
    })
}

export const taskStatuses = (call_back) => {
  fetch(APIServerURL + `/taskstatuses`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0])
    })
}

export const createStatus = ({ status_name, description }, call_back) => {
  fetch(APIServerURL + '/taskstatus', {
    method: 'POST'
    , body: JSON.stringify({
      'status_name': status_name,
      "description": description,
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const updateStatus = ({ status_id, status_name, description }, call_back) => {
  fetch(APIServerURL + '/taskstatus', {
    method: 'PUT'
    , body: JSON.stringify({
      'status_id': status_id,
      'status_name': status_name,
      "description": description,
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const deleteStatus = ({ status_id }, call_back) => {
  fetch(APIServerURL + `/taskstatus?status_id=${status_id}`, {
    method: 'DELETE'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const taskPriorities = (call_back) => {
  fetch(APIServerURL + `/taskpriorities`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0])
    })
}

export const createPrioritie = ({ priority_name, description }, call_back) => {
  fetch(APIServerURL + '/taskprioritie', {
    method: 'POST'
    , body: JSON.stringify({
      'priority_name': priority_name,
      "description": description,
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const updatePrioritie = ({ priority_id, priority_name, description }, call_back) => {
  fetch(APIServerURL + '/taskprioritie', {
    method: 'PUT'
    , body: JSON.stringify({
      'priority_id': priority_id,
      'priority_name': priority_name,
      "description": description,
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const deletePrioritie = ({ priority_id }, call_back) => {
  fetch(APIServerURL + `/taskprioritie?priority_id=${priority_id}`, {
    method: 'DELETE'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const conversationInfoGet = ({ conversation_id }, call_back) => {
  fetch(APIServerURL + `/conversation?conversation_id=${conversation_id}`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json);
    })
}

export const conversationNonMembersGet = ({ conversation_id, user_id }, call_back) => {
  fetch(APIServerURL + `/conversation/nonmembers?conversation_id=${conversation_id}&user_id=${user_id}`, {
    method: 'GET'
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      call_back(json[0]);
    })
}



export const addConversation = ({ conversationid, senderid, receiverid, contenttype, content, parentmessageid, reactions, mentions, forwardedfromconversationid, attachments, isedited }) => {
  fetch(APIServerURL + '/conversation/messages', {
    method: 'POST'
    , body: JSON.stringify({
      'conversation_id': conversationid
      , 'sender_id': senderid
      , 'receiver_id': receiverid
      , 'content_type': contenttype
      , 'content': content
      , 'parent_message_id': parentmessageid
      , 'reactions': reactions
      , 'mentions': mentions
      , 'forwarded_from_conversation_id': forwardedfromconversationid
      , 'attachments': attachments
      , 'is_edited': isedited
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {

    })
}

export const conversationWithMembersAdd = ({ name, creator_id, meta_data, profile_image, users }, call_back) => {
  fetch(APIServerURL + '/conversation/members', {
    method: 'POST'
    , body: JSON.stringify({
      'name': name
      , 'creator_id': creator_id
      , 'meta_data': meta_data
      , 'profile_image': profile_image
      , 'users': users
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      // console.log('Library', json.slice(0, 2))
      // call_back(json.slice(0, 2));
      call_back(json.slice(0, 2));

    })
}

export const conversationToDelete = ({ conversation_id }) => {
  fetch(APIServerURL + `/conversation/members/messages`, {
    method: 'DELETE'
    , body: JSON.stringify({
      'conversation_id': conversation_id
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      console.log(json);

    })
}

export const conversationMemberAdd = ({ conversation_id, user_id, role, status, invite_by_user_id }) => {
  fetch(APIServerURL + '/conversation/member', {
    method: 'POST'
    , body: JSON.stringify({
      'conversation_id': conversation_id
      , 'user_id': user_id
      , 'role': role
      , 'status': status
      , 'invite_by_user_id': invite_by_user_id
    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      console.log(json);

    })
}


export const conversationMemberDelete = ({ membership_id }) => {
  fetch(APIServerURL + `/conversation/member?membership_id=${membership_id}`, {
    method: 'DELETE'
    , body: JSON.stringify({

    })
    , headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
    .then(json => {
      console.log(json);

    })
}


export default Library