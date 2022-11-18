import React from 'react';

const AdminFooter = () => {
  return (
    <>
      <div style={{ height: '212px' }}></div>
      <footer
        style={{
          width: '100%',
          height: '185px',
          paddingTop: '0px',
        }}
      >
        <div className="footer-inner">
          <div className="container">
            <address>
              <i className="fa fa-map-marker" />
              1165 Budapest, Hungary <i className="fa fa-mobile" />
              <span> +(888) 123-4567</span> <i className="fa fa-envelope" />
              <span> gabor.jelenfi@gmail.com</span>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-xs-12 coppyright">
                © 2022 ThemesGround. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AdminFooter;
