import './layout.css';
import './index.scss';

import Header from './Header/Header';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Layout extends Component {
  state = {
    siteLanguage: 'fi'
  }

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') !== -1 ? 'en' : 'fi';

    this.setState({ siteLanguage });
  };

  render() {
    return (
      <div className="main-wrapper">
        <Header lang={this.state.siteLanguage} />

        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
