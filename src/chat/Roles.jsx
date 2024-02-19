import React, { useContext, useState, useEffect } from 'react';
import { GVContext } from './Login';
import { createRole, deleteRole, roles, updateRole } from './Library';
import RoleManagement from './RoleManagement';
import { Delete } from '@mui/icons-material';

function Roles() {
  const { GV, setGV } = useContext(GVContext);
  const [rolesData, setRolesData] = useState([]);
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
      console.log(error);
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
    // setEditMode(true);
    // setShowEditOverlay(true);
  };


  return (<div>
    <button type="button" className="btn btn-primary float-start mt-3 mb-3 ms-2" data-bs-toggle="offcanvas"
      data-bs-target="#CreateRole" >Add Role</button>
    <div className='container pt-5'>
      <table className="table table-bordered mx-5">
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
                <Delete className='float-end' onClick={() => handleRoleDelect(role.role_id)} />
              </td>
              <td>{role.role_id}</td>
              <td>{role.role}</td>
            </tr>
          ))}
          <tr>
            <RoleManagement
              selectedRole={selectedRole}
              handleUpdateRole={handleUpdateRole}
              newRole={newRole}
              handleCreateRole={handleCreateRole}
              setNewRole={setNewRole}
              setSelectedRole={setSelectedRole}
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  );
}

export default Roles;



















