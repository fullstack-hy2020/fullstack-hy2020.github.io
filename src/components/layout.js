import './layout.css';
import './index.scss';

import React, { Component } from 'react';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import PropTypes from 'prop-types';

class Layout extends Component {
  state = {
    siteLanguage: 'fi',
    visible: true,
  };

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') > -1
        ? 'en'
        : window.location.pathname.indexOf('/zh') > -1
        ? 'zh'
        : 'fi';

    const visible = !localStorage.getItem('exam_banner_seen');

    console.log(visible);

    this.setState({
      siteLanguage: siteLanguage,
      visible,
    });
  }

  hideNote() {
    localStorage.setItem('r18_banner_seen', 'yes');
    this.setState({
      siteLanguage: this.state.siteLanguage,
      visible: false,
    });
  }

  render() {
    const { siteLanguage, visible } = this.state;

    return (
      <div className="main-wrapper">
        <Header lang={siteLanguage} />

        <InfoBanner onHide={() => this.hideNote()} visible={visible} />

        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
