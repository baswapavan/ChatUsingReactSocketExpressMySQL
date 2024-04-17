import React, { useState, useEffect, useContext } from 'react';
import { userPerformance, roles, taskStatuses, taskPriorities, parentTasks } from './Library';
import { GVContext } from './Login';

let getParentsAPIHit;

function UserPerformance({ usersData }) {
  const { GV, setGV } = useContext(GVContext);
  const [tasks, setTasks] = useState([]);
  const [tasksCount, setTasksCount] = useState({ total_results: 0 });
  const [userId, setUserId] = useState('');
  const [rolesData, setRolesData] = useState();
  const [statuses, setStatuses] = useState()
  const [priorities, setPriorities] = useState();
  const [allParentTasks, setAllParentTasks] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [disaplyTaskParents, setDisaplyTaskParents] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    user_id: null,
    role_id: null,
    task_title: '',
    due_date_from: '',
    due_date_to: '',
    status_id: null,
    priority_id: null,
    parent_task_id: null,
    offset: 0,
    limit: 10
  });

  function updateSearchCriteria(params) {
    setSearchCriteria(prevCriteria => ({
      ...prevCriteria,
      ...params
    }));
  }
  // const searchCriteria = { user_id: null, role_id: null, task_title: null, due_date: null, status_id: null, priority_id: null, parent_task: null };

  // function updateSearchCriteria(params) {
  //   searchCriteria = { ...searchCriteria, ...params }
  // }

  useEffect(() => {
    userPerformance({
      user_id: searchCriteria.user_id,
      role_id: searchCriteria.role_id,
      task_title: searchCriteria.task_title,
      due_date_from: searchCriteria.due_date_from,
      due_date_to: searchCriteria.due_date_to,
      status_id: searchCriteria.status_id,
      priority_id: searchCriteria.priority_id,
      parent_task_id: searchCriteria.parent_task_id,
      offset: searchCriteria.offset,
      limit: searchCriteria.limit
    }, (res) => {
      setTasksCount(res[1][0])
      setTasks(res[0])
    })
  }, [])

  const handleUserPerfomence = async () => {
    await userPerformance({
      user_id: searchCriteria.user_id,
      role_id: searchCriteria.role_id,
      task_title: searchCriteria.task_title,
      due_date_from: searchCriteria.due_date_from,
      due_date_to: searchCriteria.due_date_to,
      status_id: searchCriteria.status_id,
      priority_id: searchCriteria.priority_id,
      parent_task_id: searchCriteria.parent_task_id,
      offset: searchCriteria.offset,
      limit: searchCriteria.limit
    }, (res) => {
      setTasks(res[0])
    })
  }


  const handleRolesGet = () => {
    !rolesData && roles((roles) => {
      setRolesData(roles);
    });
  }

  const handleStatusesGet = () => {
    !statuses && taskStatuses((statuses) => {
      setStatuses(statuses)
    })
  }

  const handlePrioritiesGet = () => {
    !priorities && taskPriorities((priorities) => {
      setPriorities(priorities)
    })
  }

  const handleInputChange = (event) => {
    updateSearchCriteria({ parent_task_id: null });
    const value = event.target.value;
    setDisaplyTaskParents(true);
    setSearchTerm(value);
    clearTimeout(getParentsAPIHit);
    if (value.length > 2) {
      getParentsAPIHit = setTimeout(() => {
        parentTasks({ parent_filter: value }, (res) => {
          setAllParentTasks(res);
        });
      }
        , 500);
    } else {
      // Clear the parent tasks if the search term is not long enough
      setAllParentTasks([]);
    }
  }


  const handlePageClick = (pageNumber) => {
    // updateSearchCriteria({ offset: (pageNumber - 1) * searchCriteria.limit });
    userPerformance({
      user_id: searchCriteria.user_id,
      role_id: searchCriteria.role_id,
      task_title: searchCriteria.task_title,
      due_date_from: searchCriteria.due_date_from,
      due_date_to: searchCriteria.due_date_to,
      status_id: searchCriteria.status_id,
      priority_id: searchCriteria.priority_id,
      parent_task_id: searchCriteria.parent_task_id,
      offset: (pageNumber - 1) * searchCriteria.limit,
      limit: searchCriteria.limit
    }, (res) => {
      setTasks(res[0])
    })
  }

  const totalPages = Math.ceil(tasksCount.total_results / searchCriteria.limit);

  // useEffect(() => {
  //   // Clear the searchTerm when allParentTasks becomes empty
  //   if (allParentTasks && allParentTasks.length === 0) {
  //     setSearchTerm('');
  //   }
  // }, [allParentTasks]);

  return (
    <div >
      <div className=" d-flex row mx-3 mt-1">
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>UserName:</label>
          <select type="text" placeholder="User Name" className='form-select form-control-md mb-3' onChange={(e) => updateSearchCriteria({ user_id: (e.target.value == '') ? null : e.target.value })}><option value="" select>Select UserName</option>
            {usersData && usersData
              .filter((_) => _.user_id !== GV.loggedInUser.user_id)
              .map(_ => (
                <option key={_.user_id} value={_.user_id}>{_.full_name}</option>
              ))}</select>
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Role:</label>
          <select type="text" placeholder="Role" className='form-select' onClick={handleRolesGet} onChange={(e) => updateSearchCriteria({ role_id: (e.target.value == '') ? null : e.target.value })}>
            <option value='' >Select Role</option>
            {rolesData && rolesData.map((_) => (
              <option key={_.role_id} value={_.role_id}>
                {_.role}
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Task Title:</label>
          <input type="text" placeholder="Task Title" className='form-control' onChange={(e) => updateSearchCriteria({ task_title: e.target.value })} />
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Due Date From:</label>
          <input type="date" placeholder="Due Date" className='form-control' onChange={(e) => updateSearchCriteria({ due_date_from: e.target.value })} />
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Due Date To:</label>
          <input type="date" placeholder="Due Date" className='form-control' onChange={(e) => updateSearchCriteria({ due_date_to: e.target.value })} />
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Status:</label>
          <select type="text" placeholder="Status" className='form-select' onClick={handleStatusesGet} onChange={(e) => updateSearchCriteria({ status_id: (e.target.value == '') ? null : e.target.value })}>
            <option value='' >Select Status</option>
            {statuses && statuses.map((_) => (
              <option key={_.status_id} value={_.status_id}>
                {_.status_name}
              </option>))}
          </select>
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Priority:</label>
          <select type="text" placeholder="Priority" className='form-select' onClick={handlePrioritiesGet} onChange={(e) => updateSearchCriteria({ priority_id: (e.target.value == '') ? null : e.target.value })}>
            <option value='' >Select Priority</option>
            {priorities && priorities.map((_) => (
              <option key={_.priority_id} value={_.priority_id}>
                {_.priority_name}
              </option>))}
          </select>
        </div>
        <div style={{ width: '240px' }}>
          <label className='float-start mx-2 my-0 h6'>Parent Task:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search Parent Tasks..."
            value={searchTerm}
            onChange={handleInputChange}

          />
          <div className="list-group" style={{ position: 'absolute', backgroundColor: 'white', zIndex: "999", maxHeight: '200px', overflowY: 'auto', cursor: 'pointer' }}>
            {disaplyTaskParents && allParentTasks &&
              allParentTasks.map(_ => (
                <div
                  key={_.parent_task_id}
                  className="list-group-item"
                  onClick={e => {
                    updateSearchCriteria({ parent_task_id: _.parent_task_id });
                    setSearchTerm(_.parent_task_title); setDisaplyTaskParents(false);
                  }}
                >
                  {_.parent_task_title}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '300px' }}>
          <button type="button" className="btn btn-primary" onClick={handleUserPerfomence}>Search</button>
        </div>
      </div>
      <div style={{ height: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#BEBEBE transparent' }}>
        <table className="table table-bordered">
          <thead style={{ position: 'sticky', top: '0' }}>
            <tr style={{ position: 'sticky' }}>
              <th style={{ position: 'sticky' }}>Task Id</th>
              <th style={{ position: 'sticky' }}>User Name</th>
              <th style={{ position: 'sticky' }}>Role</th>
              <th style={{ position: 'sticky' }}>Task Title</th>
              <th style={{ position: 'sticky' }}>Due Date</th>
              <th style={{ position: 'sticky' }}>Status</th>
              <th style={{ position: 'sticky' }}>Priority</th>
              <th style={{ position: 'sticky' }}>Parent Task</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.task_id}</td>
                <td>{task.user_name}</td>
                <td>{task.user_role}</td>
                <td>{task.task_title}</td>
                <td>{task.task_due_date}</td>
                <td>{task.task_status}</td>
                <td>{task.task_priority}</td>
                <td>{task.parent_task_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '300px' }}>
          <ul className="pagination">
            {[...Array(totalPages).keys()].map(pageNumber => (
              <li key={pageNumber} className="page-item">
                <button className="page-link" onClick={() => handlePageClick(pageNumber + 1)}>
                  {pageNumber + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserPerformance;
