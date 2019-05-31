import './layout.css';
import './index.scss';

import React, { Component } from 'react';

import EnglishRelease from './EnglishRelease/EnglishRelease';
import Header from './Header/Header';
import PropTypes from 'prop-types';

class Layout extends Component {
  state = {
    siteLanguage: 'fi',
    notificationDismissed: false,
  };

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') !== -1 ? 'en' : 'fi';

    const messageDismissed = window.localStorage.getItem(
      'notificationDismissed'
    );

    this.setState({
      siteLanguage: siteLanguage,
      notificationDismissed: messageDismissed,
    });
  }

  dismissMessage = bool => {
    this.setState({ notificationDismissed: bool }, () => {
      window.localStorage.setItem('notificationDismissed', bool);
    });
  };

  render() {
    const { siteLanguage, notificationDismissed } = this.state;

    return (
      <div className="main-wrapper">
        <Header lang={this.state.siteLanguage} />

        {siteLanguage === 'fi' && !notificationDismissed && (
          <EnglishRelease dismissed={bool => this.dismissMessage(bool)} />
        )}

        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
