import './Header.scss';

import React, { Component } from 'react';
import { Link } from 'gatsby';
import Navigation from '../Navigation/Navigation';
import { TripleBorder } from '../TripleBorder/TripleBorder';
import getTranslationPath from '../../utils/getTranslationPath';

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
    const { lang } = this.props;

    const isSmallHeader = headerClass === 'header--small';

    return (
      <header
        ref={this.header}
        className={`header ${headerClass}`}
        style={{
          backgroundColor:
            headerClass !== '' ? 'transparent' : 'var(--color-background)',
        }}
      >
        <div
          className="container"
          style={{ alignItems: 'center', justifyContent: 'flex-start' }}
        >
          <Link to={getTranslationPath(lang, '/')} className="header__logo">
            {headerClass === '' ? (
              <TripleBorder
                className="nav-item-hover"
                childrenClassName="triple-border__logo"
              >
                <bdi dir="ltr">{'{() => fs}'}</bdi>
              </TripleBorder>
            ) : (
              <TripleBorder
                hover
                className="nav-item-hover"
                childrenClassName="triple-border__logo triple-border__logo--small"
              >
                fs
              </TripleBorder>
            )}
          </Link>
          {!isSmallHeader && <Navigation lang={lang} />}
        </div>
      </header>
    );
  }
}

export default Header;
