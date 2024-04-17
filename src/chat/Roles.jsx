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
        (res) => {
          // Update the rolesData array
          setRolesData((prevRolesData) => {
            const updatedRolesData = prevRolesData.map(role => {
              if (role.role_id === res[0][0].role_id) {
                // Update the role here
                return res[0][0];
              }
              // If the role ID doesn't match, return the original role
              return role;
            });
            return updatedRolesData;
          });
        }
      );
    } catch (error) {
      // Handle error
      console.error('Error updating role:', error);
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
          // Assuming 'result' contains the newly created role
          setRolesData((prevRolesData) => {
            // Append the newly created role to the existing rolesData array
            return [...prevRolesData, result[0][0]];
          });
        }
      );
    } catch (error) {
      // setEditStatus('error');
    }
  };

  const handleRoleDelect = (role_id) => {
    const isConfirmed = window.confirm("Are you sure to delete the role?");

    if (isConfirmed) {
      deleteRole({ role_id: role_id }, (result) => {
        // Handle deletion callback if needed
        console.log(result)
        setRolesData((prevRolesData) => {
          // Filter out the newly created role from the prevRolesData array
          const updatedRolesData = prevRolesData.filter(role => role.role_id !== result[0][0].role_id);
          return updatedRolesData;
        });
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



















