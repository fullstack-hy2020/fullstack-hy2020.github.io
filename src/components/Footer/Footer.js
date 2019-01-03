import { Link } from 'gatsby';
import React from 'react';

import yliopisto from '../../images/hgin_yliopisto.png';
import houston from '../../images/houston_logo.png';
import { Image } from './../Image/Image';

const Footer = () => (
  <div
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
      <div>
        <Link
          to="/about"
          className="nav-item-hover"
          style={{
            textDecoration: 'none',
          }}
        >
          KURSSISTA
        </Link>
      </div>
      <div>
        <Link
          to="/faq"
          className="nav-item-hover"
          style={{
            textDecoration: 'none',
          }}
        >
          FAQs
        </Link>
      </div>
    </div>
  </div>
);

export default Footer;
