import React from 'react'

function TaskManagement({ selectedTask, handleUpdateTask, setNewTask, setSelectedTask, handleCreateTask, GV, users, newTask, statuses, priorities, getAllTasks, handleGetAllTasks, handletaskPriorities, handletaskStatuses }) {
  return (
    <>
      <div className="offcanvas offcanvas-end" id="EditTask">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Edit Task</h5>
        </div>
        <div className="offcanvas-body">
          <div>
            <form key={selectedTask.task_id}>
              <label className='float-start mx-2 my-0 h6' >Title:</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                className='form-control m-2 p-2 my-3'
                placeholder='Title'
                id="Title"
              />
              <label className='float-start mx-2 my-0 h6' >Description:</label>
              <textarea
                type="text"
                value={selectedTask.description}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                className='form-control m-2 p-2 my-3'
                placeholder='Discription'
                id="Discription"
              />
              <label className='float-start mx-2 my-0 h6' >Assigned To:</label>
              {/* <input
                        type="text"
                        value={selectedTask.assigned_to}
                        onChange={(e) => setSelectedTask({ ...selectedTask, assigned_to: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='Assigned To'
                        id="Assigned_To"
                      /> */}
              <select
                className='form-select m-2 p-2 my-3'
                onChange={(e) => setSelectedTask({ ...selectedTask, assigned_to: e.target.value })}
                value={selectedTask.assigned_to}
              >
                {users && users.filter(_ => _.user_id !== GV.loggedInUser.user_id).map(_ => (
                  <option key={_.user_id} value={_.user_id}>{_.full_name}</option>
                ))
                }
              </select>
              <label className='float-start mx-2 my-0 h6' >Due Date:</label>
              <input
                type="datetime-local"
                value={selectedTask.due_date}
                onChange={(e) => setSelectedTask({ ...selectedTask, due_date: e.target.value })}
                className='form-control m-2 p-2 my-3'
                placeholder='Due Date'
                name='datetime'
                id="datetime"
              />
              <label className='float-start mx-2 my-0 h6' >Status:</label>
              <select
                onClick={handletaskStatuses}
                onChange={(e) => setSelectedTask({ ...selectedTask, status_id: e.target.value })}
                className='form-select m-2 p-2 my-3'
                value={selectedTask.status_id}
              >
                {/* <option defaultValue={selectedTask.status_name}>{selectedTask.status_name}</option> */}
                {statuses && statuses.map(_ => (
                  <option key={_.status_id} value={_.status_id}>{_.status_name}</option>
                ))
                }
              </select>
              <label className='float-start mx-2 my-0 h6' >Priority:</label>
              {/* <input
                        type="text"
                        value={selectedTask.priority_id}
                        onChange={(e) => setSelectedTask({ ...selectedTask, priority_id: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='Priority'
                        id="Priority"
                      /> */}
              <select
                onClick={handletaskPriorities}
                onChange={(e) => setSelectedTask({ ...selectedTask, priority_id: e.target.value })}
                className='form-select m-2 p-2 my-3'
                value={selectedTask.priority_id}
              >
                {priorities && priorities.map(_ => (
                  <option key={_.priority_id} value={_.priority_id}>{_.priority_name}</option>
                ))
                }
              </select>
              <label className='float-start mx-2 my-0 h6' >Parent Task Id:</label>
              <select
                onClick={handleGetAllTasks}
                value={selectedTask.parent_task_id}
                onChange={(e) => setSelectedTask({ ...selectedTask, parent_task_id: e.target.value })}
                className='form-select m-2 p-2 my-3'
                placeholder='parent_task_id'
              >
                {getAllTasks && getAllTasks.map(_ => (
                  <option key={_.task_id} value={_.task_id}>{_.title}</option>
                ))
                }
              </select>
              <input
                type='button'
                onClick={handleUpdateTask}
                className='btn btn-primary m-0'
                value="Update"
              ></input>
            </form>
          </div>
        </div>
      </div>
      <div className="offcanvas offcanvas-end" id="Createtask">
        <div className="offcanvas-header">
          <h1 className="offcanvas-title">CreateTask</h1>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <label className='float-start mx-2 my-0 h6' >Title:</label>
            <input
              type="text"
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className='form-control m-2 p-2 my-3'
              placeholder='Title'
              id="Title"
            />
            <label className='float-start mx-2 my-0 h6' >Description:</label>
            <textarea
              type="text"
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className='form-control m-2 p-2 my-3'
              placeholder='Discription'
              id="Discription"
            />
            <label className='float-start mx-2 my-0 h6' >Assigned To:</label>
            <select
              className='form-select m-2 p-2 my-3'
              onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              value={newTask.assigned_to}
            >
              <option value="" disabled select>Select The User</option>
              {users && users.filter(_ => _.user_id !== GV.loggedInUser.user_id).map(_ => (
                <option key={_.user_id} value={_.user_id}>{_.full_name}</option>
              ))
              }
            </select>
            <label className='float-start mx-2 my-0 h6' >Due Date:</label>
            <input
              type="datetime-local"
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className='form-control m-2 p-2 my-3'
              placeholder='Due Date'
              id="datatime"
              name='datatime'
            />
            <label className='float-start mx-2 my-0 h6' >Status:</label>
            <select
              onClick={handletaskStatuses}
              onChange={(e) => setNewTask({ ...newTask, status_id: e.target.value })}
              className='form-select m-2 p-2 my-3'
              value={newTask.status_id}
            >
              <option value="" disabled select>Select The Statues</option>
              {statuses && statuses.map(_ => (
                <option key={_.status_id} value={_.status_id}>{_.status_name}</option>
              ))
              }
            </select>
            <label className='float-start mx-2 my-0 h6' >Priority:</label>
            <select
              onClick={handletaskPriorities}
              onChange={(e) => setNewTask({ ...newTask, priority_id: e.target.value })}
              className='form-select m-2 p-2 my-3'
              value={newTask.priority_id}
            >
              <option value="" disabled select>Select The Prioritie</option>
              {priorities && priorities.map(_ => (
                <option key={_.priority_id} value={_.priority_id}>{_.priority_name}</option>
              ))
              }
            </select>
            <label className='float-start mx-2 my-0 h6' >ParentTask:</label>
            <select
              onClick={handleGetAllTasks}
              onChange={(e) => setNewTask({ ...newTask, parent_task_id: e.target.value })}
              className='form-select m-2 p-2 my-3'
            >
              <option value="" disabled select>Select The ParentTask</option>
              {getAllTasks && getAllTasks.map(_ => (
                <option key={_.task_id} value={_.task_id}>{_.title}</option>
              ))
              }
            </select>
            <div>
              <input
                type='button'
                onClick={handleCreateTask}
                className='btn btn-primary m-0' value="Create"></input>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default TaskManagement