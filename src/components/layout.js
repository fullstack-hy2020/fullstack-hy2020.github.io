import './layout.css';
import './index.scss';

import Header from './Header/Header';
import PropTypes from 'prop-types';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="main-wrapper">
      <Header />

      {children}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
