import { Link } from 'gatsby';
import React from 'react';
import { useTranslation } from 'react-i18next';

import './Footer.scss';

import Element from '../Element/Element';
import { Image } from '../Image/Image';
import houston from '../../images/company_logos/houston.svg';
import { getNavigation } from '../Navigation/Navigation';
import yliopisto from '../../images/company_logos/uoh_centre.svg';

const images = [
  {
    src: yliopisto,
    alt: 'Helsingin yliopiston logo',
    href: 'https://www.helsinki.fi/',
  },
  {
    src: houston,
    alt: 'Houston inc. logo',
    href: 'https://www.houston-inc.com/',
  },
];

const Footer = () => {
  const { t, i18n } = useTranslation();
  const navigation = getNavigation(i18n.language, t);

  return (
    <Element
      id="footer"
      className="container spacing--after-small spacing--mobile"
      flex
    >
      <Element
        className="col-5 push-right-3 col-10--mobile order-2--mobile order-2--tablet footer__links"
        flex
        spaceBetween
      >
        {images.map(image => (
          <a
            key={image.alt}
            href={image.href}
            className="col-5 col-4--mobile spacing--mobile"
          >
            <Image contain src={image.src} alt={image.alt} className="col-6" />
          </a>
        ))}
      </Element>

      <Element
        flex
        className="col-5 col-5--mobile order-1--mobile order-1--tablet footer__navigation"
      >
        <div className="footer__navigation-link-container">
          {navigation.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="footer__navigation-link nav-item-hover"
              style={{ marginLeft: '4.5rem' }}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </Element>
    </Element>
  );
};

export default Footer;
