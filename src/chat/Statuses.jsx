import React from 'react'
import { useEffect, useState } from 'react'
import { createStatus, deleteStatus, taskStatuses, updateStatus } from './Library';
import { Delete } from '@mui/icons-material';



function Statuses() {

  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newStatus, setNewStatus] = useState({ status_id: '', status_name: '', description: '' });


  const handleUpdateStatus = async () => {
    try {
      await updateStatus(
        {
          status_id: selectedStatus.status_id,
          status_name: selectedStatus.status_name,
          description: selectedStatus.description
        },
        (result) => {
          // setEditStatus('success');
        }
      );
    } catch (error) {
      // setEditStatus('error');
      console.log(error);
    }
  };

  const handleCreateStatus = async () => {
    try {
      await createStatus(
        {
          status_name: newStatus.status_name,
          description: newStatus.description
        },
        (result) => {
          // setEditStatus('success');
        }
      );
    } catch (error) {
      // setEditStatus('error');
    }
  };

  const handleStatusDelect = (status_id) => {
    const isConfirmed = window.confirm("Are you sure to delete the status");

    if (isConfirmed) {
      deleteStatus({ status_id: status_id }, () => {
        // Handle deletion callback if needed
      });
    } else {
      // Handle cancellation if needed
    }
  };

  const handleCheckboxChange = (status) => {
    setSelectedStatus(status);
  };


  useEffect(() => {
    taskStatuses((statuses) => {
      setStatuses(statuses)
    })
  }, [])



  return (
    <div >
      <button type="button" className="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
        data-bs-target="#CreateStatus" >Add Status</button>
      <div className='container pt-5'>
        <table className="table table-bordered mx-5">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>status_id</th>
              <th>status_name</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {
              statuses && statuses.map((status) => (
                <tr key={status.status_id}>
                  <td>
                    <input
                      type="checkbox"
                      data-bs-toggle="offcanvas" data-bs-target="#EditStatus"
                      checked={selectedStatus && selectedStatus.status_id === status.status_id}
                      onChange={() => handleCheckboxChange(status)}
                    />
                    <Delete className='float-end' onClick={() => handleStatusDelect(status.status_id)} />
                  </td>
                  <td>{status.status_id}</td>
                  <td>{status.status_name}</td>
                  <td>{status.description}</td>
                </tr>
              )
              )
            }
          </tbody>
          <tr>
            <>
              <div className="offcanvas offcanvas-end" id="EditStatus">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title">Edit Status</h5>
                </div>
                <div className="offcanvas-body">
                  <div>
                    {selectedStatus && (
                      <form key={selectedStatus.status_id}>
                        <label className='float-start mx-2 my-0 h6' htmlFor="email">status_name:</label>
                        <input
                          type="text"
                          value={selectedStatus.status_name}
                          onChange={(e) => setSelectedStatus({ ...selectedStatus, status_name: e.target.value })}
                          className='form-control m-2 p-2 my-3'
                          placeholder='status'
                        />
                        <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                        <input
                          type="text"
                          value={selectedStatus.description}
                          onChange={(e) => setSelectedStatus({ ...selectedStatus, description: e.target.value })}
                          className='form-control m-2 p-2 my-3'
                          placeholder='Discription'
                        />
                        <input
                          type='button'
                          onClick={handleUpdateStatus}
                          className='btn btn-primary m-0'
                          value="Update"
                        />
                      </form>
                    )}
                  </div>
                </div>
              </div>
              <div className="offcanvas offcanvas-end" id="CreateStatus">
                <div className="offcanvas-header">
                  <h1 className="offcanvas-title">CreateStatus</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                  {newStatus && (
                    <form>
                      <label className='float-start mx-2 my-0 h6' htmlFor="email">Status_name:</label>
                      <input
                        type="text"
                        onChange={(e) => setNewStatus({ ...newStatus, status_name: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='status_name'
                      />
                      <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                      <textarea
                        type="text"
                        onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='Discription'
                      />
                      <input
                        onClick={handleCreateStatus}
                        className='btn btn-primary m-0'
                        value="Create"
                      />
                    </form>
                  )}
                </div>
              </div>
            </>
          </tr>
        </table>
      </div>
    </div>
  )
}

export default Statuses