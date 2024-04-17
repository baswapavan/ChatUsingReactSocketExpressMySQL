import React from 'react'
import { useEffect, useState } from 'react'
import { createPrioritie, deletePrioritie, taskPriorities, updatePrioritie } from './Library';
import { Delete } from '@mui/icons-material';



function Statuses() {

  const [priorities, setpriorities] = useState([]);
  const [selectedPrioritie, setSelectedPrioritie] = useState(null);
  const [newPrioritie, setNewPrioritie] = useState({ priority_id: '', priority_name: '', description: '' });

  const handleUpdatePrioritie = async () => {
    try {
      await updatePrioritie(
        {
          priority_id: selectedPrioritie.priority_id,
          priority_name: selectedPrioritie.priority_name,
          description: selectedPrioritie.description
        },
        (result) => {
          // setEditStatus('success');
          // Update the prioritys array
          setpriorities((prevPriority) => {
            const updatedPriority = prevPriority.map(priority => {
              if (priority.priority_id === result[0][0].priority_id) {
                // Update the priority here
                return result[0][0];
              }
              // If the priority ID doesn't match, return the original priority
              return priority;
            });
            return updatedPriority;
          });
        }
      );
    } catch (error) {
      // setEditStatus('error');
      console.log(error);
    }
  };

  const handleCreatePrioritie = async () => {
    try {
      await createPrioritie(
        {
          priority_name: newPrioritie.priority_name,
          description: newPrioritie.description
        },
        (result) => {
          // setEditStatus('success');
          setpriorities((prevPriorities) => {
            return [...prevPriorities, result[0][0]]
          })
          // Clear input field values
          setNewPrioritie({
            priority_name: '',
            description: ''
          });
        }
      );
    } catch (error) {
      // setEditStatus('error');
    }
  };

  const handlePrioritieDelect = (priority_id) => {
    const isConfirmed = window.confirm("Are you sure to delete the priority");

    if (isConfirmed) {
      deletePrioritie({ priority_id: priority_id }, (result) => {
        // Handle deletion callback if needed
        console.log(result)
        setpriorities((prevPriorities) => {
          const updatePrioritie = prevPriorities.filter(prioritie => (prioritie.priority_id != result[0][0].priority_id))
          return updatePrioritie;
        }
        )
      });
    } else {
      // Handle cancellation if needed
    }
  };

  const handleCheckboxChange = (prioritie) => {
    setSelectedPrioritie(prioritie);
  };


  useEffect(() => {
    taskPriorities((priorities) => {
      setpriorities(priorities)
    })
  }, [])

  return (
    <div >
      <button type="button" className="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
        data-bs-target="#CreatePrioritie" >Add Prioritie</button>
      <div className='container pt-5'>
        <table className="table table-bordered mx-5">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>Prioritie_id</th>
              <th>Prioritie_name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {
              priorities && priorities.map((prioritie) => (
                <tr key={priorities.priority_id}>
                  <td>
                    <input
                      type="checkbox"
                      data-bs-toggle="offcanvas" data-bs-target="#EditPrioritie"
                      checked={selectedPrioritie && selectedPrioritie.priority_id === prioritie.priority_id}
                      onChange={() => handleCheckboxChange(prioritie)}
                    />
                    <Delete className='float-end' onClick={() => handlePrioritieDelect(prioritie.priority_id)} />
                  </td>
                  <td>{prioritie.priority_id}</td>
                  <td>{prioritie.priority_name}</td>
                  <td>{prioritie.description}</td>
                </tr>
              )
              )
            }
          </tbody>
          <tr>
            <>
              <div className="offcanvas offcanvas-end" id="EditPrioritie">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title">Edit Prioritie</h5>
                </div>
                <div className="offcanvas-body">
                  <div>
                    {selectedPrioritie && (
                      <form key={selectedPrioritie.priority_id}>
                        <label className='float-start mx-2 my-0 h6' htmlFor="email">priorit_name:</label>
                        <input
                          type="text"
                          value={selectedPrioritie.priority_name}
                          onChange={(e) => setSelectedPrioritie({ ...selectedPrioritie, priority_name: e.target.value })}
                          className='form-control m-2 p-2 my-3'
                          placeholder='prioritie'
                        />
                        <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                        <input
                          type="text"
                          value={selectedPrioritie.description}
                          onChange={(e) => setSelectedPrioritie({ ...selectedPrioritie, description: e.target.value })}
                          className='form-control m-2 p-2 my-3'
                          placeholder='Discription'
                        />
                        <input
                          type='button'
                          onClick={handleUpdatePrioritie}
                          className='btn btn-primary m-0'
                          value="Update"
                        />
                      </form>
                    )}
                  </div>
                </div>
              </div>
              <div className="offcanvas offcanvas-end" id="CreatePrioritie">
                <div className="offcanvas-header">
                  <h1 className="offcanvas-title">CreatePrioritie</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                  {newPrioritie && (
                    <form>
                      <label className='float-start mx-2 my-0 h6' htmlFor="email">Prioritie_name:</label>
                      <input
                        type="text"
                        onChange={(e) => setNewPrioritie({ ...newPrioritie, priority_name: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='prioritie_name'
                      />
                      <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                      <textarea
                        type="text"
                        onChange={(e) => setNewPrioritie({ ...newPrioritie, description: e.target.value })}
                        className='form-control m-2 p-2 my-3'
                        placeholder='Discription'
                      />
                      <input
                        onClick={handleCreatePrioritie}
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