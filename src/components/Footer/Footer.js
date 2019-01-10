import { Link } from 'gatsby';
import React from 'react';

import yliopisto from '../../images/hgin_yliopisto.png';
import houston from '../../images/houston_logo.png';
import { Image } from './../Image/Image';
import Element from '../Element/Element';

const Footer = () => (
  <Element
    id="footer"
    className="container spacing--after"
    style={{ justifyContent: 'space-between' }}
  >
    <div
      className="col-4"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <a
        href="https://www.helsinki.fi/"
        className="image--large image--contain"
        style={{ width: '100%' }}
      >
        <Image className="image--large image--contain" src={yliopisto} />
      </a>

      <a
        href="https://www.houston-inc.com/"
        className="push-right-2"
        style={{ width: '100%' }}
      >
        <Image className="image--large image--contain" src={houston} />
      </a>
    </div>

    <Element
      flex
      className="col-2 order-1--mobile"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/about"
        className="nav-item-hover"
        style={{ marginLeft: '4.5rem' }}
      >
        KURSSISTA
      </Link>
      <Link to="/faq" className="nav-item-hover">
        FAQs
      </Link>
    </Element>
  </Element>
);

export default Footer;
