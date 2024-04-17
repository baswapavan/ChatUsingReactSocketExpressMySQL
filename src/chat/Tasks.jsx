import React, { useContext, useEffect, useState } from 'react'
import { GVContext } from './Login'
import { tasks, createTask, updateTask, deleteTask, taskStatuses, taskPriorities, getAllTasksForDropdown } from './Library';
import { Delete } from '@mui/icons-material';
import TaskManagement from './TaskManagement';
// import TaskManagement from './TaskManagement';


function Tasks(props) {

  const { GV, setGV } = useContext(GVContext);
  const [tasksData, setTasksData] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', created_by: '', assigned_to: '', due_date: '', status_id: '', priority_id: '', parent_task_id: '' })
  const [selectedTask, setSelectedTask] = useState([]);
  const users = props.usersData
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [getAllTasks, setGetAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Change page size as needed



  useEffect(() => {
    tasks((Task) => {
      setTasksData(Task)
    });
  }, [])

  const handleGetAllTasks = () => {
    getAllTasksForDropdown((Tasks) => {
      setGetAllTasks(Tasks)
    });
  }


  const handletaskStatuses = () => {
    taskStatuses((statuses) => {
      setStatuses(statuses)
    });
  }


  const handletaskPriorities = () => {
    taskPriorities((priorities) => {
      setPriorities(priorities)
    });
  }




  const handleCreateTask = async (e) => {
    await createTask({ title: newTask.title, description: newTask.description, created_by: GV.loggedInUser.user_id, assigned_to: newTask.assigned_to, due_date: newTask.due_date, status_id: newTask.status_id, priority_id: newTask.priority_id, parent_task_id: newTask.parent_task_id },
      (result) => {
        console.log(result)
        setTasksData((prevTasks) => {
          return [result[0][0], ...prevTasks]
        })
      }
    )
  }

  const handleUpdateTask = async () => {
    await updateTask({
      task_id: selectedTask.task_id,
      title: selectedTask.title,
      description: selectedTask.description,
      assigned_to: selectedTask.assigned_to,
      updated_by: GV.loggedInUser.user_id,
      due_date: selectedTask.due_date,
      status_id: selectedTask.status_id,
      priority_id: selectedTask.priority_id,
      parent_task_id: selectedTask.parent_task_id
    },
      (result) => {
        console.log(result);
        // Update the Tasks array
        setTasksData((prevTasks) => {
          const updatedTask = prevTasks.map(task => {
            if (task.task_id === result[0][0].task_id) {
              // Update the priority here
              return result[0][0];
            }
            // If the priority ID doesn't match, return the original priority
            return task;
          });
          return updatedTask;
        });

      })
  }

  const handleCheckboxChange = (task) => {
    setSelectedTask(task);
  };

  const handleDeleteTask = (taskId) => {
    const ifConformed = window.confirm("Are you sure to delete the Task?")

    if (ifConformed) {
      deleteTask({ task_id: taskId }, (res) => {
        // Handle deletion callback if needed
        console.log(res)
        setTasksData((prevTask) => {
          const updatedTasks = prevTask.filter(task => (
            task.task_id !== res[0][0].task_id))
          return updatedTasks
        })
      });
    }
    else {
      // Handle cancellation if needed
    }
  }

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const totalPages = Math.ceil(tasksData.length / pageSize);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const currentTasks = tasksData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <button type="button" className="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
        data-bs-target="#Createtask" >Add Task</button>
      <div className='container pt-5'>
        <table className="table table-bordered mx-5">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>Title</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Assigned_To</th>
              <th>Updated By</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Parent Task Id</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks && currentTasks.map((task) => (
              <tr key={task.task_id}>
                <td>
                  <input
                    type="checkbox"
                    data-bs-toggle="offcanvas" data-bs-target="#EditTask"
                    checked={selectedTask && selectedTask.task_id === task.task_id}
                    onChange={() => handleCheckboxChange(task)}
                  />
                  <Delete alt='img' onClick={() => handleDeleteTask(task.task_id)} style={{ width: '18px' }} className='float-end'
                  />
                </td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.created_by}</td>
                <td>{task.assigned_name}</td>
                <td>{task.updated_by}</td>
                <td>{task.due_date}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{task.parent_task_id}</td>
              </tr>
            ))}
            <TaskManagement
              selectedTask={selectedTask}
              handleUpdateTask={handleUpdateTask}
              setNewTask={setNewTask}
              setSelectedTask={setSelectedTask}
              handleCreateTask={handleCreateTask}
              statuses={statuses}
              priorities={priorities}
              GV={GV}
              users={users}
              newTask={newTask}
              getAllTasks={getAllTasks}
              handleGetAllTasks={handleGetAllTasks}
              handletaskPriorities={handletaskPriorities}
              handletaskStatuses={handletaskStatuses}

            />
          </tbody>
        </table>
      </div>
      <footer>
        <button className="btn btn-primary" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        {pageNumbers.map((number) => (
          <button key={number} className="btn btn-primary mx-1" onClick={() => setCurrentPage(number)}>{number}</button>
        ))}
        <button className="btn btn-primary" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>

      </footer>
    </div>
  )
}

export default Tasks