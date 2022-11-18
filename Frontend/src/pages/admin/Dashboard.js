import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import useUrlStore from '../../Store/urlStore';
import useAdminStore from '../../Store/adminStore';

const AdminDashboard = () => {
  const URL = useUrlStore(state => state.baseURL);
  
  const isAdminAuth = useAdminStore(state => state.isAdminAuth);
  const logout = useAdminStore(state => state.logout);

  useEffect(() => {
    // if not admin then logout
    if (!isAdminAuth) {
      logout();
    }
  }, [URL, isAdminAuth, logout]);

  return (
    <>
      <div className="inner-page">
        <div id="page">
          <br />
          {/* Main Container */}
          <section className="main-container col2-left-layout bounceInUp animated">
            <div className="container">
              <div className="row">
                <div className="col-main col-sm-8 col-sm-push-4">
                  <article className="col-main">
                    <Outlet />
                  </article>
                </div>
                <div className="col-left sidebar col-sm-2 col-xs-12 col-sm-pull-8">
                  <aside className="col-left sidebar">
                    <div className="block block-list">
                      <div className="block-title"> Webshop </div>
                      {/*block-title*/}
                      {/* BEGIN BOX-CATEGORY */}
                      <div className="box-content box-category">
                        <ul>
                          <li>
                            <Link to="./products">Products</Link>
                          </li>
                          <li>
                            <Link to="./categories">Categories</Link>
                          </li>
                          <li>
                            <Link to="./manufacturers">Manufacturers</Link>
                          </li>
                        </ul>
                      </div>
                      {/*box-content box-category*/}
                    </div>
                    <div className="block block-list">
                      <div className="block-title"> Consumer </div>
                      {/*block-title*/}
                      {/* BEGIN BOX-CATEGORY */}
                      <div className="box-content box-category">
                        <ul>
                          <li>
                            <Link to="./customers">Customers</Link>
                          </li>
                          <li>
                            <Link to="./orders">Orders</Link>
                          </li>
                        </ul>
                      </div>
                      {/*box-content box-category*/}
                    </div>
                    <div className="block block-list">
                      <div className="block-title"> Admin </div>
                      {/*block-title*/}
                      {/* BEGIN BOX-CATEGORY */}
                      <div className="box-content box-category">
                        <ul>
                          <li>
                            <Link to="./admins">Admins</Link>
                          </li>
                        </ul>
                      </div>
                      {/*box-content box-category*/}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </section>
          {/* Main Container End */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
