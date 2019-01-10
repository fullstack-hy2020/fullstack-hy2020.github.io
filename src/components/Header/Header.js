import './Header.scss';

import { Link } from 'gatsby';
import React, { Component } from 'react';

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
        this.state.top > 0 && scroll > this.state.top ? 'header-small' : '',
    });
  };

  render() {
    const { headerClass } = this.state;

    return (
      <div ref={this.header} className={`header ${headerClass}`}>
        <div className="container" style={{ alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
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

          {headerClass !== 'header-small' && <Navigation />}
        </div>
      </div>
    );
  }
}

export default Header;
