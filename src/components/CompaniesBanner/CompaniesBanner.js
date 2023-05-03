import './CompaniesBanner.scss';

import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import { Image } from '../Image/Image';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import snakeCase from 'lodash/fp/snakeCase';
import { useTranslation } from 'react-i18next';
import getTranslationPath from '../../utils/getTranslationPath';

const partners = [
  {
    image: { name: 'uoh_centre.svg', alt: 'Helsingin yliopisto' },
    url: 'https://www.helsinki.fi/',
  },
  {
    image: { name: 'houston2.svg', alt: 'Houston inc.' },
    url: 'https://www.houston-inc.com/careers',
  },
  {
    image: { name: 'terveystalo.svg', alt: 'Terveystalo' },
    url: 'https://www.terveystalo.com/',
  },
  {
    image: { name: 'elisa.svg', alt: 'Elisa' },
    url: 'https://corporate.elisa.fi/rekrytointi/',
  },
  {
    image: { name: 'unity.svg', alt: 'Unity' },
    url: 'https://www.instagram.com/unitytechnologies/?hl=en',
  },
  {
    image: { name: 'konecranes.svg', alt: 'Konecranes' },
    url: 'https://careers.konecranes.com/Konecranes/',
  },
  {
    image: { name: 'smartly_io.svg', alt: 'Smartly' },
    url: 'https://www.smartly.io/careers/',
  },
];

/* All logos must be in SVG format */
const inChallenge = [
  'Tivia',
  'Relex',
  'Smartly.io',
  'Eficode',
  'Sympa',
  'Cinia',
  'AppGyver',
  'Codento',
  'Taito united',
  'Emblica',
  'Kodan',
  'UpCloud',
  'Perfektio',
  'Blok',
  'G-Works',
  'Webscale',
  'Siili',
  'Ilmatieteenlaitos',
  'Futurice',
  'Visma',
  'Platonic Partnership',
  'Omnia',
  'Tietotalo',
  'Circles',
  'Nordcloud',
  'Wunderdog',
  'Gofore',
  'Nortal Oy',
  'NurseBuddy',
  'Wolt',
  'Pori',
  'Motley',
  'Bonsky Digital',
  'Plan Brothers',
  'Integrify',
  'Rentle',
  'Compile',
  'Telia',
  'Umbrella Interactive',
  'Tabella',
  'Nextup',
  // 'Vertix',
  // 'Future Captcha Consulting',
  'Kela',
  'Geometrix',
  'Netyourself',
  'Vincit',
  'Vero',
  'Hiq',
  'Resilient E',
  'Neemia',
  'Bubblin',
  'Zaibatsu',
];

export const CompaniesBanner = ({ isFrontPage, lang }) => {
  const { t } = useTranslation();

  return (
    <Banner
      backgroundColor={isFrontPage && 'var(--color-background)'}
      className="spacing--after"
      id="challenge"
    >
      <Element className="container" flex>
        <BodyText
          centered
          className="col-4 push-right-3 challenge-title"
          text={t('challengePage:coOperationTitle')}
        />
        <Element
          flex
          spaceBetween
          className="col-6 push-right-2 flex-fix-aligning space-between--mobile contributors-logos"
        >
          {partners.map((company, i) => (
            <ContentLiftup
              key={company.url}
              small
              applyPadding
              companyPath={company.url}
              image={{
                src: require(`../../images/company_logos/${company.image.name}`),
                alt: company.image.alt,
              }}
              className={`col-3 col-5--mobile col-5--tablet`}
            />
          ))}
        </Element>

        {!isFrontPage && (
          <>
            <BodyText
              centered
              className="col-4 spacing push-right-3 challenge-title"
              text={t('challengePage:participantsTitle')}
            />
            <Element
              flex
              className="col-9 flex-fix-aligning space-between--mobile"
            >
              {inChallenge.map(company => (
                <Image
                  key={company}
                  contain
                  src={require(`../../images/company_logos/${snakeCase(
                    company
                  )}.svg`)}
                  alt={company}
                  className={`company__logo push-right-1 col-3--mobile col-3--tablet`}
                  backdrop
                />
              ))}
            </Element>
          </>
        )}

        {isFrontPage && (
          <Element flex spaceAround className="col-10 spacing">
            <Link
              className="about__challenge-button"
              to={getTranslationPath(lang, '/challenge')}
            >
              {t('challengePage:infoButton')}
            </Link>
          </Element>
        )}
      </Element>
    </Banner>
  );
};

CompaniesBanner.defaultProps = {
  isFrontPage: false,
  lang: 'fi',
};

CompaniesBanner.propTypes = {
  isFrontPage: PropTypes.bool,
  lang: PropTypes.string.isRequired,
};
