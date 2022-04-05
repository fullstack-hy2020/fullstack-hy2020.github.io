import './layout.css';
import './index.scss';

import React, { Component } from 'react';

import Header from './Header/Header';
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

    this.setState({
      siteLanguage: siteLanguage,
      visible: true,
    });
  }

  hideNote() {
    console.log('yes');
    this.setState({
      siteLanguage: this.state.siteLanguage,
      visible: false,
    });
  }

  render() {
    const { siteLanguage, visible } = this.state;

    const style = {
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 2,
      marginLeft: 80,
      marginRight: 80,
      position: 'sticky',
      top: 100,
      left: 40,
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignContent: 'space-between',
      backgroundColor: '#E8E8E8',
      zIndex: 2147483647,
    };

    const linkStyle = {
      color: 'grey',
      textDecoration: 'underline',
    };

    const textStyle = {
      flex: 90,
    };

    const buttonDiv = {
      flex: 10,
      textAlign: 'right',
    };

    const buttonStyle = {
      outline: 'none',
      backgroundColor: 'transparent',
      border: 'none',
    };

    console.log(this.state);

    return (
      <div className="main-wrapper">
        <Header lang={siteLanguage} />

        {visible && (
          <div style={style}>
            <div stule={textStyle}>
              Note that some libraries might not work with the new React version
              18. If you run in trouble with library compatibility, read{' '}
              <a href="/en/part1/a_more_complex_state_debugging_react_apps#a-note-on-react-version">
                <span style={linkStyle}>this</span>
              </a>
              .
            </div>
            <div style={buttonDiv}>
              <button style={buttonStyle} onClick={() => this.hideNote()}>
                x
              </button>
            </div>
          </div>
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
