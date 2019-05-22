import './layout.css';
import './index.scss';

import Header from './Header/Header';
import PropTypes from 'prop-types';
import React from 'react';

const Layout = ({ children }) => {
  const siteLanguage =
    window.location.pathname.indexOf('/en') !== -1 ? 'en' : 'fi';

  return (
    <div className="main-wrapper">
      <Header lang={siteLanguage} />

      {children}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
