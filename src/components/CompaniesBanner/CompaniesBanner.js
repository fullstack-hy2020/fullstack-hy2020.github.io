import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import appgyverLogo from '../../images/appgyver_logo.svg';
import ciniaLogo from '../../images/cinia_logo.svg';
import codentoLogo from '../../images/codento_logo.svg';
import eficodeLogo from '../../images/eficode_logo.svg';
import elisaLogo from '../../images/elisa_logo.svg';
import emblicaLogo from '../../images/emblica_logo.svg';
import houstonLogo from '../../images/houston_logo.svg';
import keskoLogo from '../../images/kesko_logo.svg';
import konecranesLogo from '../../images/konecranes_logo.svg';
import relexLogo from '../../images/relex_logo.svg';
import smartlyLogo from '../../images/smartly_logo.svg';
import sympaLogo from '../../images/sympa_logo.svg';
import taitounitedLogo from '../../images/taito_logo.svg';
import terveystaloLogo from '../../images/terveystalo_logo.svg';
import unityLogo from '../../images/unity_logo.svg';
import yliopistoLogo from '../../images/hgin_yliopisto.svg';

const partners = [
  {
    image: { src: yliopistoLogo, alt: 'Helsingin yliopisto' },
    url: 'https://www.helsinki.fi/',
  },
  {
    image: { src: houstonLogo, alt: 'Houston inc.' },
    url: 'https://www.houston-inc.com/careers',
  },
  {
    image: { src: terveystaloLogo, alt: 'Terveystalo' },
    url: 'https://www.terveystalo.com/',
  },
  {
    image: { src: elisaLogo, alt: 'Elisa' },
    url: 'https://corporate.elisa.fi/rekrytointi/',
  },
  {
    image: { src: keskoLogo, alt: 'Kesko' },
    url: 'https://www.kesko.fi/',
  },
  {
    image: { src: unityLogo, alt: 'Unity' },
    url: 'https://www.instagram.com/unitytechnologies/?hl=en',
  },
  {
    image: { src: konecranesLogo, alt: 'Konecranes' },
    url: 'https://careers.konecranes.com/Konecranes/',
  },
  {
    image: { src: ciniaLogo, alt: 'Cinia' },
    url: 'https://www.cinia.fi/',
  },
];

const inChallenge = [
  {
    src: sympaLogo,
    alt: 'Sympa',
  },
  {
    src: appgyverLogo,
    alt: 'AppGyver',
  },
  {
    src: smartlyLogo,
    alt: 'Smartly.io',
  },
  {
    src: codentoLogo,
    alt: 'Codento',
  },
  {
    src: emblicaLogo,
    alt: 'Emblica',
  },
  {
    src: taitounitedLogo,
    alt: 'Taito united',
  },
  {
    src: eficodeLogo,
    alt: 'Eficode',
  },
  {
    src: relexLogo,
    alt: 'Relex',
  },
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
        text="Yhteistyössä"
      />
      <Element
        flex
        spaceBetween
        className="col-6 push-right-2 flex-fix-aligning space-between--mobile"
      >
        {partners.map((company, i) => (
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

      <BodyText
        centered
        className="col-4 spacing push-right-3 challenge-title"
        text="Full stack -haasteessa mukana"
      />
      <Element
        flex
        className="col-6 push-right-2 flex-fix-aligning space-between--mobile"
      >
        {inChallenge.map((company, i) => (
          <ContentLiftup
            key={company.alt}
            small
            image={{
              src: company.src,
              alt: company.alt,
            }}
            className={`col-2 push-right-1 col-3--mobile col-3--tablet`}
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
