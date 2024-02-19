import React from 'react';

const RoleManagement = ({ selectedRole, handleUpdateRole, newRole, handleCreateRole, setNewRole, setSelectedRole }) => {
  return (
    <>
      <div className="offcanvas offcanvas-end" id="EditRole">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Edit Role</h5>
        </div>
        <div className="offcanvas-body">
          <div>
            {selectedRole && (
              <form key={selectedRole.role_id}>
                <label className='float-start mx-2 my-0 h6' htmlFor="email">Role:</label>
                <input
                  type="text"
                  value={selectedRole.role}
                  onChange={(e) => setSelectedRole({ ...selectedRole, role: e.target.value })}
                  className='form-control m-2 p-2 my-3'
                  placeholder='Role'
                />
                <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
                <input
                  type="text"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                  className='form-control m-2 p-2 my-3'
                  placeholder='Discription'
                />
                <div>
                  <button onClick={handleUpdateRole} className='btn btn-primary m-0'>Update</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="offcanvas offcanvas-end" id="CreateRole">
        <div className="offcanvas-header">
          <h1 className="offcanvas-title">CreateRole</h1>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {newRole && (
            <form>
              <label className='float-start mx-2 my-0 h6' htmlFor="email">Role:</label>
              <input
                type="text"
                onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                className='form-control m-2 p-2 my-3'
                placeholder='Role'
              />
              <label className='float-start mx-2 my-0 h6' htmlFor="email">Description:</label>
              <textarea
                type="text"
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className='form-control m-2 p-2 my-3'
                placeholder='Discription'
              />
              <div>
                <button onClick={handleCreateRole} className='btn btn-primary m-0'>Create</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default RoleManagement;
