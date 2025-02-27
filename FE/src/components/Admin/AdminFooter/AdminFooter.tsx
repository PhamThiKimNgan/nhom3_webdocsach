import React from 'react';
import { Link } from 'react-router-dom';
import './AdminFooter.scss';

function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="admin-footer">
      <div className="admin-footer__container">
        <div className="admin-footer__copyright">
          © {currentYear} Team 3 Story Admin Panel. All rights reserved.
        </div>
        
        <div className="admin-footer__links">
          <Link to="/admin/help">Help</Link>
          <Link to="/admin/terms">Terms of Service</Link>
          <Link to="/">Back to Main Site</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;
