import React, { useContext, useState, useEffect } from 'react';
import { GVContext } from './Login';
import { createRole, deleteRole, roles, updateRole } from './Library';
import Delete from './trash.png';

function Roles() {
  const { GV, setGV } = useContext(GVContext);
  const [rolesData, setRolesData] = useState([]);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({ role_id: '', role: '', description: '' });

  useEffect(() => {
    roles((roles) => {
      setRolesData(roles);
    });
  }, []);

  const handleUpdateRole = async (event) => {
    event.preventDefault();
    try {
      await updateRole(
        {
          role_id: selectedRole.role_id,
          role: selectedRole.role,
          description: selectedRole.description
        },
        (result) => {
          // setEditStatus('success');
        }
      );
    } catch (error) {
      // setEditStatus('error');
    }
  };

  const handleCreateRole = async (event) => {
    event.preventDefault();
    try {
      await createRole(
        {
          role: newRole.role,
          description: newRole.description
        },
        (result) => {
          // setEditStatus('success');
        }
      );
    } catch (error) {
      // setEditStatus('error');
    }
  };

  const handleRoleDelect = (role_id) => {
    const isConfirmed = window.confirm("Are you sure to delete the role?");

    if (isConfirmed) {
      deleteRole({ role_id: role_id }, () => {
        // Handle deletion callback if needed
      });
    } else {
      // Handle cancellation if needed
    }
  };





  const handleCheckboxChange = (role) => {
    setSelectedRole(role);
    setEditMode(true);
    setShowEditOverlay(true);
  };


  return (
    <div>
      <button type="button" class="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
        data-bs-target="#CreateRole" >Add Role</button>
      <div className='container pt-5'>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>RoleId</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {rolesData && rolesData.map((role) => (
              <tr key={role.role_id}>
                <td>
                  <input
                    type="checkbox"
                    data-bs-toggle="offcanvas" data-bs-target="#EditRole"
                    checked={selectedRole && selectedRole.role_id === role.role_id}
                    onChange={() => handleCheckboxChange(role)}
                  />
                  <img src={Delete} alt='img' style={{ width: '18px' }} className='float-end' onClick={() => handleRoleDelect(role.role_id)}></img>
                </td>
                <td>{role.role_id}</td>
                <td>{role.role}</td>
              </tr>
            ))}
            <tr>
              {showEditOverlay && (
                <div className="offcanvas offcanvas-end" id="EditRole">
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Edit Role</h5>
                  </div>
                  <div className="offcanvas-body">
                    <div>
                      {editMode && selectedRole && (
                        <form key={selectedRole.role_id}>
                          <label className='float-start mx-2 my-0 h6' htmlFor="email">Role:</label>
                          <input
                            type="text"
                            value={selectedRole.role}
                            onChange={(e) => setSelectedRole({ ...selectedRole, role: e.target.value })}
                            className='form-control m-2 p-2 my-3'
                            placeholder='Role'
                            id="Role"
                          />
                          <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                          <input
                            type="text"
                            value={selectedRole.description}
                            onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                            className='form-control m-2 p-2 my-3'
                            placeholder='Discription'
                            id="Discription"
                          />
                          <div>
                            <button onClick={handleUpdateRole} className='btn btn-primary m-0'>Update</button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </tr>
            <div class="offcanvas offcanvas-end" id="CreateRole">
              <div class="offcanvas-header">
                <h1 class="offcanvas-title">CreateRole</h1>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
              </div>
              <div class="offcanvas-body">
                {newRole && (
                  <form>
                    <label className='float-start mx-2 my-0 h6' htmlFor="email">Role:</label>
                    <input
                      type="text"
                      onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                      className='form-control m-2 p-2 my-3'
                      placeholder='Role'
                      id="Role"
                    />
                    <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                    <textarea
                      type="text"
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className='form-control m-2 p-2 my-3'
                      placeholder='Discription'
                      id="Discription"
                    />
                    <div>
                      <button onClick={handleCreateRole} className='btn btn-primary m-0'>Create</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Roles;



















