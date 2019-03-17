import './Header.scss';

import React, { Component } from 'react';

import { Link } from 'gatsby';
import Navigation from '../Navigation/Navigation';
import { TripleBorder } from '../TripleBorder/TripleBorder';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      headerClass: '',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  header = React.createRef();

  handleScroll = () => {
    let scroll = window.scrollY;

    this.setState({
      top: scroll,
      headerClass:
        this.state.top > 10 && scroll > this.state.top ? 'header--small' : '',
    });
  };

  render() {
    const { headerClass } = this.state;

    return (
      <div
        ref={this.header}
        className={`header ${headerClass}`}
        style={{
          backgroundColor: headerClass !== '' ? 'transparent' : 'white',
        }}
      >
        <div
          className="container"
          style={{ alignItems: 'center', justifyContent: 'flex-start' }}
        >
          <Link to="/" className="header__logo">
            {headerClass === '' ? (
              <TripleBorder
                className="nav-item-hover"
                childrenClassName="triple-border__logo"
              >
                {'{() => fs}'}
              </TripleBorder>
            ) : (
              <TripleBorder
                hover
                className="nav-item-hover"
                childrenClassName="triple-border__logo"
              >
                fs
              </TripleBorder>
            )}
          </Link>

          {this.state.headerClass !== 'header--small' && <Navigation />}
        </div>
      </div>
    );
  }
}

export default Header;
