import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import appgyverLogo from '../../images/appgyver_logo.svg';
import elisaLogo from '../../images/elisa_logo.svg';
import houstonLogo from '../../images/houston_logo.svg';
import keskoLogo from '../../images/kesko_logo.svg';
import sympaLogo from '../../images/sympa_logo.svg';
import terveystaloLogo from '../../images/terveystalo_logo.svg';
// import seLogo from '../../images/SE_logo.png';
import unityLogo from '../../images/unity_logo.svg';
import yliopistoLogo from '../../images/hgin_yliopisto.svg';

const companies = [
  {
    image: { src: yliopistoLogo, alt: 'Helsingin yliopisto logo' },
    url: 'https://www.helsinki.fi/',
  },
  {
    image: { src: houstonLogo, alt: 'Houston inc. logo' },
    url: 'https://www.houston-inc.com/careers',
  },
  {
    image: { src: terveystaloLogo, alt: 'Terveystalo logo' },
    url: 'https://www.terveystalo.com/',
  },
  {
    image: { src: elisaLogo, alt: 'Elisa logo' },
    url: 'https://corporate.elisa.fi/rekrytointi/',
  },
  {
    image: { src: sympaLogo, alt: 'Sympa logo' },
    url: 'https://sympa.com/careers',
  },
  {
    image: { src: keskoLogo, alt: 'Kesko logo' },
    url: 'https://www.kesko.fi/',
  },
  {
    image: { src: unityLogo, alt: 'Unity logo' },
    url: 'https://careers.unity.com/location/helsinki',
  },
  {
    image: { src: appgyverLogo, alt: 'AppGyver logo' },
    url: 'https://www.appgyver.com/',
  },

  // {
  //   image: { src: seLogo, alt: 'Storaenso logo' },
  //   url: 'https://www.storaensometsa.fi/',
  // },
];

export const CompaniesBanner = ({ frontPage }) => (
  <Banner
    backgroundColor={frontPage && 'white'}
    className="spacing--after"
    id="challenge"
  >
    <Element className="container" flex>
      <BodyText
        centered
        className="col-4 push-right-3 challenge-title"
        text="Full stack -haasteessa mukana"
      />
      <Element
        flex
        spaceBetween
        className="col-6 push-right-2 flex-fix-aligning space-between--mobile"
      >
        {companies.map((company, i) => (
          <ContentLiftup
            key={company.url}
            small
            companyPath={company.url}
            image={{
              src: company.image.src,
              alt: company.image.alt,
            }}
            className={`col-3 col-5--mobile col-5--tablet`}
          />
        ))}
      </Element>

      {frontPage && (
        <Element flex spaceAround className="col-10 spacing">
          <Link className="about__challenge-button" to="/challenge">
            Lisätietoja haasteesta
          </Link>
        </Element>
      )}
    </Element>
  </Banner>
);

CompaniesBanner.defaultProps = {
  frontPage: false,
};

CompaniesBanner.propTypes = {
  frontPage: PropTypes.bool,
};
