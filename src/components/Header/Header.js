import { Link } from 'gatsby';
import React from 'react';

import { TripleBorder } from '../TripleBorder/TripleBorder';

const Header = () => (
  <div className="container" style={{ alignItems: 'center' }}>
    <Link to="/" style={{ textDecoration: 'none' }}>
      <TripleBorder
        className="nav-item-hover"
        childrenClassName="triple-border__logo"
      >
        {'{() => fs}'}
      </TripleBorder>
    </Link>

    <div
      className="col-4 push-left-4"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
      }}
    >
      <Link to="/about" className="nav-item-hover">
        KURSSISTA
      </Link>

      <Link to="/faq" className="nav-item-hover">
        FAQs
      </Link>

      <Link to="/companies" className="nav-item-hover">
        YRITYSESITTELYT
      </Link>
    </div>
  </div>
);

export default Header;
