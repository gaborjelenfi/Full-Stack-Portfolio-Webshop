import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAdminStore from '../../Store/adminStore';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const isAdminAuth = useAdminStore(state => state.isAdminAuth);
  const logout = useAdminStore(state => state.logout);
  const loggedInAdminData = useAdminStore(state => state.loggedInAdminData);

  useEffect(() => {
    // if not admin logged in then navigate to login page
    if (!isAdminAuth) {
      logout();
      navigate('./');
    }
  }, [navigate, isAdminAuth, logout]);

  return (
    <header>
      <div className="header-container">
        <div className="header-top">
          <div className="container">
            <div className="row">
              <div className="col-xs-7 col-sm-6">
                <div className="welcome-msg hidden-xs"> SUPERB furnitures </div>
              </div>
              {/* Header Logo */}
              <div className="logo">
                <img
                  crossOrigin='anonymous'
                  alt="Datson"
                  src="/images/logo.png"
                  style={{
                    margin: '0',
                    marginTop: '-20px',
                    width: '90px',
                    height: '60px',
                  }}
                />
              </div>
              <div className="col-xs-5 col-sm-6">
                {/* Header Top Links */}
                <div className="toplinks">
                  <div className="links">
                    <div className="check">
                      {isAdminAuth && (
                        <h5
                          title="welcome"
                          style={{ color: '#fff', marginRight: '15px' }}
                        >
                          <span>
                            Welcome{' '}
                            {`${loggedInAdminData.firstName} ${loggedInAdminData.lastName}`}
                          </span>
                        </h5>
                      )}
                    </div>
                    <div className="login">
                      {isAdminAuth && (
                        <Link to={'./'} onClick={logout}>
                          <span>Log Out</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                {/* End Header Top Links */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
