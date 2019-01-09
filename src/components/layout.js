import './layout.css';
import './index.scss';

import PropTypes from 'prop-types';
import React from 'react';

import Header from './Header/Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />

      {children}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
