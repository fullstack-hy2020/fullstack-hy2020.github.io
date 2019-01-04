import { Link } from 'gatsby';
import React from 'react';

import yliopisto from '../../images/hgin_yliopisto.png';
import houston from '../../images/houston_logo.png';
import { Image } from './../Image/Image';

const Footer = () => (
  <div
    id="footer"
    className="container spacing--after"
    style={{ justifyContent: 'space-between' }}
  >
    <div
      className="col-4"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Image className="image--large image--contain" src={yliopisto} />

      <Image
        className="image--large push-right-2 image--contain"
        src={houston}
      />
    </div>

    <div
      className="col-2"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/about"
        className="nav-item-hover"
        style={{ paddingLeft: '4.5rem' }}
      >
        KURSSISTA
      </Link>
      <Link to="/faq" className="nav-item-hover">
        FAQs
      </Link>
    </div>
  </div>
);

export default Footer;
