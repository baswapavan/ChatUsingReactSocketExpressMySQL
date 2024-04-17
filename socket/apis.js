const mysql = require('mysql');

const getConfig = () => {
  const dbConnectionProps = {
    host: 'localhost',
    user: 'root',
    password: 'Pav@n.1316'
  };
  return dbConnectionProps;
}

const dbConnectionProps = getConfig();
const con = mysql.createConnection({ ...dbConnectionProps, database: 'chat' });
const conOffice24by7 = mysql.createConnection({ ...dbConnectionProps, database: 'officechat' });
con.connect((err) => {
  if (err) {
    console.log(`Error in connection:${err}`);
  }
});

const validateUser = (req, res) => {
  var query = `CALL usp_UserValidate(@p_username := '${req.body.username}', @p_password := '${req.body.password}')`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error in validating the user credentials: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const users = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.query.loggedin_userid}, @p_username := '${req.body.username}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}',@p_profile_picture:='${req.body.profile_picture ? req.body.profile_picture : null}' , @p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}',@p_role_id:= '1',@p_is_active := '1', @p_mode := 'GET_ALL');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while creating user: ${err}`);
    } else {
      res.send(result);
    }
  });
};

const createUser = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid ? req.body.loggedin_userid : null}, @p_username := '${req.body.username}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}', @p_profile_picture := '${req.body.profile_picture}',@p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}',@p_role_id := ${req.body.role_id ? req.body.role_id : null},@p_is_active := '1', @p_mode := 'CREATE');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while creating user: ${err}`);
    } else {
      res.send(result);
    }
  });
};

const updateUser = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid ? req.body.loggedin_userid : null}, @p_username := ${req.body.user_name ? `'${req.body.user_name}'` : null}, @p_password := ${req.body.password ? `'${req.body.password}'` : null}, @p_email := ${req.body.email ? `'${req.body.email}'` : null}, @p_full_name := ${req.body.full_name ? `'${req.body.full_name}'` : null},@p_profile_picture:='${req.body.profile_picture ? req.body.profile_picture : null}' , @p_timezone := ${req.body.time_zone ? `'${req.body.time_zone}'` : null}, @p_about := ${req.body.about ? `'${req.body.about}'` : null}, @p_role_id := ${req.body.role_id ? req.body.role_id : null},@p_is_active := ${req.body.is_active ? `'${req.body.is_active}'` : null}, @p_mode := 'UPDATE');`;
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updating user: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const deleteUser = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid}, @p_username := '${req.body.user_name}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}',@p_profile_picture:='${req.body.profile_picture ? req.body.profile_picture : null}' ,@p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}',@p_is_active := '1', @p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleting user: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const roles = (req, res) => {
  var query = `CALL usp_RolesCRUD(@p_role_id := '0',@p_role := 'role',@p_description := 'About Member',@p_mode := 'READ');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting roles:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const createRole = (req, res) => {
  var query = `CALL usp_RolesCRUD(@p_role_id := ${req.body.role_id ? req.body.role_id : null},@p_role := ${req.body.role ? `'${req.body.role}'` : null},@p_description := ${req.body.description ? `'${req.body.description}'` : null},@p_mode := 'CREATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while createing role:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const updateRole = (req, res) => {
  var query = `CALL usp_RolesCRUD(@p_role_id := ${req.body.role_id ? `${req.body.role_id}` : null},@p_role := '${req.body.role ? req.body.role : null}',@p_description := ${req.body.description ? `'${req.body.description}'` : null},@p_mode := 'UPDATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updateing role:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const deleteRole = (req, res) => {
  var query = `CALL usp_RolesCRUD(@p_role_id := ${req.query.role_id ? `${req.query.role_id}` : null},@p_role := '${req.query.role ? req.query.role : null}',@p_description := ${req.query.description ? `'${req.query.description}'` : null},@p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while delecting role:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const tasks = (req, res) => {
  var query = `CALL usp_TasksCRUD(@p_task_id := '1',@p_title := 'Test', @p_description := 'About Test',
@p_due_date := '2024-02-01',@p_priority_id := '1',@p_status_id := '2',@p_assigned_to := '0',@p_parent_task_id := '2',@p_created_by := '13',@p_updated_by := '14',@p_mode :=  'READ');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting tasks:${err}`)
    }
    else {
      res.send(result);
    }
  })
};


const getAllTasksForDropdown = (req, res) => {
  var query = `CALL usp_GetAllTasksForDropdown();`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting tasks:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const createTask = (req, res) => {
  var query = `CALL usp_TasksCRUD(@p_task_id :=${req.body.task_id ? `'${req.body.task_id}'` : null},@p_title := ${req.body.title ? `'${req.body.title}'` : null}, @p_description := ${req.body.description ? `'${req.body.description}'` : null},
@p_due_date := ${req.body.due_date ? `'${req.body.due_date}'` : null},@p_priority_id :=${req.body.priority_id ? `${req.body.priority_id}` : null},@p_status_id :=${req.body.status_id ? `${req.body.status_id}` : null},@p_assigned_to := ${req.body.assigned_to ? `${req.body.assigned_to}` : null},@p_parent_task_id :=${req.body.parent_task_id ? `${req.body.parent_task_id}` : null},@p_created_by :=${req.body.created_by ? `${req.body.created_by}` : null},@p_updated_by := ${req.body.updated_by ? `'${req.body.updated_by}'` : null},@p_mode := 'CREATE');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while createing task:${err}`)
    }
    else {
      res.send(result);
    }
  })
};


const updateTask = (req, res) => {
  var query = `CALL usp_TasksCRUD(@p_task_id :=${req.body.task_id ? `'${req.body.task_id}'` : null},@p_title := ${req.body.title ? `'${req.body.title}'` : null}, @p_description := ${req.body.description ? `'${req.body.description}'` : null},
@p_due_date := ${req.body.due_date ? `'${req.body.due_date}'` : null},@p_priority_id :=${req.body.priority_id ? `'${req.body.priority_id}'` : null},@p_status_id :=${req.body.status_id ? `'${req.body.status_id}'` : null},@p_assigned_to := ${req.body.assigned_to ? `'${req.body.assigned_to}'` : null},@p_parent_task_id :=${req.body.parent_task_id ? `'${req.body.parent_task_id}'` : null},@p_created_by :=${req.body.created_by ? `'${req.body.created_by}'` : null},@p_updated_by := ${req.body.updated_by ? `'${req.body.updated_by}'` : null},@p_mode := 'UPDATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updateing task:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const deleteTask = (req, res) => {
  var query = `CALL usp_TasksCRUD(@p_task_id :=${req.query.task_id ? `'${req.query.task_id}'` : null},@p_title := 'Test', @p_description := 'About Test',
@p_due_date := '2024-02-01',@p_priority_id := '1',@p_status_id := '1',@p_assigned_to := '0',@p_parent_task_id := '2',@p_created_by := '13',@p_updated_by := '14',@p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while delecting task:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const taskStatuses = (req, res) => {
  var query = `CALL usp_TaskStatusesCRUD(@p_status_id := 1,@p_status_name := 'Todo',@p_description := 'complete the task as soon as posable',@p_mode := 'READ');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting statuses:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const createStatus = (req, res) => {
  var query = `CALL usp_TaskStatusesCRUD(@p_status_id := ${req.body.status_id ? `'${req.body.status_id}'` : null},@p_status_name := ${req.body.status_name ? `'${req.body.status_name}'` : null},@p_description := ${req.body.description ? `'${req.body.description}'`
    : null},@p_mode := 'CREATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while createing status:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const updateStatus = (req, res) => {
  var query = `CALL usp_TaskStatusesCRUD(@p_status_id := ${req.body.status_id ? `'${req.body.status_id}'` : null},@p_status_name := ${req.body.status_name ? `'${req.body.status_name}'` : null},@p_description := ${req.body.description ? `'${req.body.description}'`
    : null},@p_mode := 'UPDATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updateing status:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const deleteStatus = (req, res) => {
  var query = `CALL usp_TaskStatusesCRUD(@p_status_id := ${req.query.status_id ? `'${req.query.status_id}'` : null},@p_status_name := 'Todo',@p_description := 'complete the task as soon as posable',@p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting taskstatuses:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const taskPriorities = (req, res) => {
  var query = `CALL usp_TaskPrioritiesCRUD(@p_priority_id := 1,@p_priority_name := null,@p_description := null,@p_mode := 'READ');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting taskpriorities:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const createPrioritie = (req, res) => {
  var query = `CALL usp_TaskPrioritiesCRUD(@p_priority_id := ${req.body.priority_id ? `'${req.body.priority_id}'` : null},@p_priority_name :=  ${req.body.priority_name ? `'${req.body.priority_name}'` : null},@p_description := ${req.body.description ? `'${req.body.description}'` : null},@p_mode := 'CREATE')`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while createing  prioritie:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const updatePrioritie = (req, res) => {
  var query = `CALL usp_TaskPrioritiesCRUD(@p_priority_id := ${req.body.priority_id ? `'${req.body.priority_id}'` : null},@p_priority_name :=  ${req.body.priority_name ? `'${req.body.priority_name}'` : null},@p_description := ${req.body.description ? `'${req.body.description}'` : null},@p_mode :='UPDATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updateing prioritie:${err}`)
    }
    else {
      res.send(result);
    }
  })
};

const deletePrioritie = (req, res) => {
  var query = `CALL usp_TaskPrioritiesCRUD(@p_priority_id :=${req.query.priority_id ? `'${req.query.priority_id}'` : null},@p_priority_name := null,@p_description := null,@p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleteing prioritie:${err}`)
    }
    else {
      res.send(result);
    }
  })
};


const conversationsGet = (req, res) => {
  var query = `CALL usp_ConversationsGet(@p_user_name := '${req.query.user_name}');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversations: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const conversationInfoGet = (req, res) => {
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := ${req.query.conversation_id}, @type := 'One-to-One',@p_name := ${req.body.name ? req.body.name : null},@p_creator_id := ${req.body.creator_id ? req.body.creator_id : null},@p_member_count := '2' ,
    @p_metadata := ${req.body.meta_data ? req.body.meta_data : null},@p_settings := ${req.body.settings ? req.body.settings : null},@p_profile_image := ${req.body.profile_image ? req.body.profile_image : null},@p_mode :='READ');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation information: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const conversationAdd = (req, res) => {
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := '', @type := 'One-to-One',@p_name := '${req.body.name}',@p_creator_id := '${req.body.user_id}',@p_member_count := '2' ,
    @p_metadata := '${req.body.meta_data}',@p_settings := '${req.body.settings}',@p_profile_image := '${req.body.profile_image}',@p_mode :='CREATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while creating a conversation: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const conversationWithMembersAdd = (req, res) => {
  var query = `CALL usp_ConversationWithMembersAdd(@p_conversation_id := null, @p_type := 'Group', @p_name := '${req.body.name ? req.body.name : null}', @p_creator_id := '${req.body.creator_id ? req.body.creator_id : null}', @p_member_count := '3',
        @p_metadata :=${req.body.meta_data ? `'${req.body.meta_data}'` : null}, @p_settings := null, @p_profile_image :=${req.body.profile_image ? `'${req.body.profile_image}'` : null},@p_users:='${req.body.users ? req.body.users : null}');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation information: ${err}`);
    } else {
      res.send(result);
    }
  })
};
////////////
const conversationToDelete = (req, res) => {
  var query = `CALL usp_ConversationDelete(@p_conversation_id:=${req.body.conversation_id});`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation information: ${err}`);
    } else {
      res.send(result);
    }
  })
};


///////////
const conversationNonMembersGet = (req, res) => {
  var query = `CALL usp_NonConversationMembers(@p_conversation_id :=${req.query.conversation_id}, @p_user_id := ${req.query.user_id});`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation information: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const conversationUpdate = (req, res) => {
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := '${req.body.conversation_id}', @p_type := ${req.body.type ? `'${req.body.type}'` : null},@p_name := ${req.body.name ? `'${req.body.name}'` : null},@p_creator_id := ${req.body.creator_id ? `'${req.body.creator_id}'` : null},@p_member_count :=${req.body.member_count ? `'${req.body.member_count}'` : null} ,@p_metadata := ${req.body.metadata ? `'${req.body.metadata}'` : null},@p_settings := ${req.body.settings ? `'${req.body.settings}'` : null},@p_profile_image := ${req.body.profile_image ? `'${req.body.profile_image}'` : null},@p_mode :='UPDATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updating conversation: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const conversationDelete = (req, res) => {
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := '${req.body.conversation_id}', @type := 'One-to-One',@p_name := '${req.body.name}',@p_creator_id := '${req.body.user_id}',@p_member_count := '2' ,
    @p_metadata := '${req.body.meta_data}',@p_settings := '${req.body.settings}',@p_profile_image := '${req.body.profile_image}',@p_mode :='DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleting conversation: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const conversationMembersGet = (req, res) => {
  var query = `CALL usp_ConversationMembersCRUD(@p_conversation_id := ${req.body.conversation_id},@p_user_id := null, @p_role :=null, @p_status :=null, @p_unread_count := null, 
    @p_notifications_enabled := null, @p_block_status := null, @p_invite_by_user_id := null,
    @p_read_receipts_enabled := null, @p_participant_order := null, @p_starred := null, @p_mode := 'READ');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting conversation member: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const conversationMemberAdd = (req, res) => {
  var query = `CALL usp_ConversationMembersCRUD(@p_membership_id := null,@p_conversation_id := ${req.body.conversation_id ? req.body.conversation_id : null},@p_user_id := ${req.body.user_id ? req.body.user_id : null},@p_role := '${req.body.role ? req.body.role : null}',@p_status := '${req.body.status}',@p_unread_count := '0',
    @p_notifications_enabled := '1', @p_block_status := 'Not Blocked',@p_invite_by_user_id := ${req.body.invite_by_user_id ? req.body.invite_by_user_id : null},
    @p_read_receipts_enabled := '1',@p_participant_order := '1',@p_starred := '0',@p_mode := 'CREATE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while creating conversation member: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const conversationMemberDelete = (req, res) => {
  var query = `CALL usp_ConversationMembersCRUD(@p_membership_id:= ${req.query.membership_id},@p_conversation_id := ${req.query.conversation_id},@p_user_id := '5',@p_role := 'Participant',@p_status :='Active',@p_unread_count := '0',
    @p_notifications_enabled := '1', @p_block_status := 'Not Blocked',@p_invite_by_user_id := NULL,
    @p_read_receipts_enabled := '1',@p_participant_order := '1',@p_starred := '0',@p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updating conversation member: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const conversationMessagesGet = (req, res) => {
  var query = `CALL usp_ConversationMessagesCRUD(@p_conversation_id := ${req.body.conversation_id}, @p_sender_id := 1, @receiver_id := 2, @p_content_type := 'Text', @p_content := 'Hello!', 
    @p_parent_message_id := NULL, @p_reactions := NULL, @p_mentions := NULL, @p_forwarded_from_conversation_id := NULL,
    @p_attachments := NULL, @p_is_edited := 0, @p_mode := 'READ');`;

  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation messages: ${err}`);
    } else {
      res.send(result);
    }
  });
};
/////////////////////
const conversationMessagesCreate = (req, res) => {
  var query = `CALL usp_ConversationMessagesCRUD(@p_conversation_id := ${req.body.conversation_id ? req.body.conversation_id : null}, @p_sender_id := ${req.body.sender_id}, @p_receiver_id := ${req.body.receiver_id ? req.body.receiver_id : null}, @p_content_type := '${req.body.content_type ? req.body.content_type : null}', @p_content := '${req.body.content}', 
    @p_parent_message_id := ${req.body.parent_message_id ? req.body.parent_message_id : null}, @p_reactions := ${req.body.reactions ? req.body.reactions : null}, @p_mentions := ${req.body.mentions ? req.body.mentions : null}, @p_forwarded_from_conversation_id := ${req.body.forwarded_from_conversation_id ? req.body.forwarded_from_conversation_id : null},
    @p_attachments := ${req.body.attachments ? req.body.attachments : null}, @p_is_edited := 0, @p_mode := 'CREATE');`;

  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      console.log(`Error while fetching conversation messages: ${err}`);
    } else {

    }
  });
};
////////////////////////////
const conversationMessagesUpdate = (req, res) => {
  var query = `CALL usp_ConversationMessagesCRUD(@p_conversation_id := ${req.body.conversation_id}, @p_sender_id := ${req.body.sender_id}, @p_receiver_id := ${req.body.receiver_id}, @p_content_type := '${req.body.content_type}', @p_content := '${req.body.content}', 
    @p_parent_message_id := ${req.body.parent_message_id == "" ? null : req.body.parent_message_id}, @p_reactions := ${req.body.reactions == "" ? null : req.body.reactions}, @p_mentions := ${req.body.mentions == "" ? null : req.body.mentions}, @p_forwarded_from_conversation_id := ${(req.body.forwarded_from_conversation_id == "") ? null : req.body.forwarded_from_conversation_id},
    @p_attachments := ${req.body.attachments == "" ? null : req.body.attachments}, @p_is_edited := ${req.body.is_edited == "" ? 0 : 1}, @p_mode := 'UPDATE');`;

  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation messages: ${err}`);
    } else {
      res.send(result);
    }
  });
};

const conversationMessagesDelete = (req, res) => {
  var query = `CALL usp_ConversationMessagesCRUD(@p_conversation_id := ${req.body.conversation_id}, @p_sender_id := ${req.body.sender_id}, @receiver_id := ${req.body.receiver_id}, @p_content_type := '${req.body.content_type}', @p_content := '${req.body.content}', 
    @p_parent_message_id := ${req.body.parent_message_id == "" ? null : req.body.parent_message_id}, @p_reactions := ${req.body.reactions == "" ? null : req.body.reactions}, @p_mentions := ${req.body.mentions == "" ? null : req.body.mentions}, @p_forwarded_from_conversation_id := ${(req.body.forwarded_from_conversation_id == "") ? null : req.body.forwarded_from_conversation_id},
    @p_attachments := ${req.body.attachments == "" ? null : req.body.attachments}, @p_is_edited := ${req.body.is_edited == "" ? 0 : 1}, @p_mode := 'UPDATE');`;

  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while fetching conversation messages: ${err}`);
    } else {
      res.send(result);
    }
  });
};

const conversationMessageDelete = (req, res) => {
  var query = `CALL usp_ConversationMessageDelete(@p_message_id :=${req.query.message_id});`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleting conversation: ${err}`);
    } else {
      res.send(result);
    }
  })
};

const userPerformance = (req, res) => {
  var query = `CALL usp_GetUserTasksDetails(@p_userid := ${req.query.user_id ? req.query.user_id
    : null},@p_role_id:= ${req.query.role_id ? req.query.role_id : null},@p_task_title:= ${req.query.task_title ? `'${req.query.task_title}'` : null},@p_due_date_from:=${req.query.due_date_from ? `'${req.query.due_date_from}' ` : null},
@p_due_date_to:= ${req.query.due_date_to ? `'${req.query.due_date_to}'` : null},@p_status_id:= ${req.query.status_id ? req.query.status_id : null},@p_priority_id:= ${req.query.priority_id ? req.query.priority_id : null},@p_parent_task_id:=${req.query.parent_task_id ? req.query.parent_task_id : null},@p_offset:=${req.query.offset ? req.query.offset : null},@p_limit:=${req.query.limit ? req.query.limit : null});`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while getting userPerfomanceData: ${err}`);
    } else {
      res.send(result);
    }
  })
};


const parentTasks = (req, res) => {
  var query = `CALL usp_GetParentTasks(@p_parent_filter := ${req.query.parent_filter ? `'${req.query.parent_filter}'` : null});`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleting conversation: ${err}`);
    } else {
      res.send(result);
    }
  })
};




module.exports = {
  validateUser,
  users,
  createUser,
  updateUser,
  deleteUser,
  roles,
  createRole,
  updateRole,
  deleteRole,
  tasks,
  getAllTasksForDropdown,
  createTask,
  updateTask,
  deleteTask,
  taskStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
  taskPriorities,
  createPrioritie,
  updatePrioritie,
  deletePrioritie,
  conversationsGet,
  conversationInfoGet,
  conversationAdd,
  conversationWithMembersAdd,
  conversationToDelete,
  conversationNonMembersGet,
  conversationUpdate,
  conversationDelete,
  conversationMembersGet,
  conversationMemberAdd,
  conversationMemberDelete,
  conversationMessagesGet,
  conversationMessagesCreate,
  conversationMessagesUpdate,
  conversationMessagesDelete,
  conversationMessageDelete,
  userPerformance,
  parentTasks
};