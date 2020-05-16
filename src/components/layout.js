import './layout.css';
import './index.scss';

import React, { Component } from 'react';

import Header from './Header/Header';
import PropTypes from 'prop-types';

class Layout extends Component {
  state = {
    siteLanguage: 'fi',
  };

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') > -1
        ? 'en'
        : window.location.pathname.indexOf('/zh') > -1
        ? 'zh'
        : 'fi';
    this.setState({
      siteLanguage: siteLanguage,
    });
  }

  render() {
    const { siteLanguage } = this.state;

    return (
      <div className="main-wrapper">
        <Header lang={siteLanguage} />

        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
