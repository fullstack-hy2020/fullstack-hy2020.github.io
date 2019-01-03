import './layout.css';
import './index.scss';

import PropTypes from 'prop-types';
import React from 'react';

import Footer from './Footer/Footer';
import Header from './Header/Header';

const Layout = ({ children }) => (
  <div>
    <Header />
    <div>{children}</div>
    {window.location.pathname !== '/' ? <Footer /> : null}
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
