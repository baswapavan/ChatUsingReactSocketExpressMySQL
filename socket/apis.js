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
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.query.loggedin_userid}, @p_username := '${req.body.username}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}', @p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}', @p_mode := 'GET_ALL');`
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
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid ? req.body.loggedin_userid : null}, @p_username := '${req.body.username}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}', @p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}', @p_mode := 'CREATE');`
  console.log(query);
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while creating user: ${err}`);
    } else {
      res.send(result);
    }
  });
};

/////////////////////////
const updateUser = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid ? req.body.loggedin_userid : null}, @p_username := ${req.body.user_name ? `'${req.body.user_name}'` : null}, @p_password := ${req.body.password ? `'${req.body.password}'` : null}, @p_email := ${req.body.email ? `'${req.body.email}'` : null}, @p_full_name := ${req.body.full_name ? `'${req.body.full_name}'` : null}, @p_timezone := ${req.body.time_zone ? `'${req.body.time_zone}'` : null}, @p_about := ${req.body.about ? `'${req.body.about}'` : null}, @p_mode := 'UPDATE');`;
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while updating user: ${err}`);
    } else {
      res.send(result);
    }
  })
};
////////////////////////////
const deleteUser = (req, res) => {
  var query = `CALL usp_UserCRUD(@p_loggedin_userid := ${req.body.loggedin_userid}, @p_username := '${req.body.user_name}', @p_password := '${req.body.password}', @p_email := '${req.body.email}', @p_full_name := '${req.body.full_name}'
    , @p_timezone := '${req.body.time_zone}', @p_about := '${req.body.about}', @p_mode := 'DELETE');`
  console.log(query)
  con.query(query, (err, result) => {
    if (err) {
      res.send(`Error while deleting user: ${err}`);
    } else {
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
        @p_metadata :='${req.body.meta_data ? req.body.meta_data : null}', @p_settings := null, @p_profile_image :='${req.body.profile_image ? req.body.profile_image : null}',@p_users:='${req.body.users ? req.body.users : null}');`
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
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := ${req.query.conversation_id ? req.query.conversation_id : null}, @type := 'One-to-One',@p_name := ${req.body.name ? req.body.name : null},@p_creator_id := ${req.body.creator_id ? req.body.creator_id : null},@p_member_count := '2' ,
    @p_metadata := ${req.body.meta_data ? req.body.meta_data : null},@p_settings := ${req.body.settings ? req.body.settings : null},@p_profile_image := ${req.body.profile_image ? req.body.profile_image : null},@p_mode :='NONUSERS');`
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
  var query = `CALL usp_ConversationsCRUD(@p_conversation_id := '${req.body.conversation_id}', @type := '${req.body.type}',@p_name := '${req.body.name}',@p_creator_id := '${req.body.creator_id}',@p_member_count := '${req.body.member_count}' ,
    @p_metadata := '${req.body.meta_data}',@p_settings := '${req.body.settings}',@p_profile_image := '${req.body.profile_image}',@p_mode :='UPDATE');`
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
  var query = `CALL usp_ConversationMembersCRUD(@p_membership_id:= ${req.query.membership_id},@p_conversation_id := '1',@p_user_id := '5',@p_role := 'Participant',@p_status :='Active',@p_unread_count := '0',
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

module.exports = {
  validateUser,
  users,
  createUser,
  updateUser,
  deleteUser,
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
};