import './layout.css';
import './index.scss';

import React, { Component } from 'react';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import Footer from './Footer/Footer';
import PropTypes from 'prop-types';

const BANNER_TO_KEY = 'exam_banner_seen';

class Layout extends Component {
  state = {
    siteLanguage: 'fi',
    visible: false,
  };

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') > -1
        ? 'en'
        : window.location.pathname.indexOf('/zh') > -1
        ? 'zh'
        : 'fi';

    const visible = false; // !localStorage.getItem(BANNER_TO_KEY);

    this.setState({
      siteLanguage: siteLanguage,
      visible,
    });
  }

  hideNote() {
    localStorage.setItem(BANNER_TO_KEY, 'yes');
    this.setState({
      siteLanguage: this.state.siteLanguage,
      visible: false,
    });
  }

  render() {
    const { children, hideFooter } = this.props;
    const { siteLanguage, visible } = this.state;

    return (
      <div className="main-wrapper">
        <Header lang={siteLanguage} />

        <InfoBanner onHide={() => this.hideNote()} visible={visible} />

        <main>{children}</main>

        {!hideFooter && <Footer lang={siteLanguage} />}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
