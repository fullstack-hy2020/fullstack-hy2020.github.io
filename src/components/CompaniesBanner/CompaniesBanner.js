import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import {PropTypes} from 'prop-types';
import React from 'react';
import elisaLogo from '../../images/elisa_logo.png';
import houstonLogo from '../../images/houston_logo.png';
import seLogo from '../../images/SE_logo.png';
import sympaLogo from '../../images/sympa_logo.png';
import terveystaloLogo from '../../images/terveystalo_logo.png';
import yliopistoLogo from '../../images/hgin_yliopisto.png';

const companies = [
  {
    image: { src: yliopistoLogo, alt: 'Helsingin yliopisto logo' },
    url: 'https://www.helsinki.fi/',
    className: 'col-2 col-4--mobile',
  },
  {
    image: { src: houstonLogo, alt: 'Houston inc. logo' },
    url: 'https://www.houston-inc.com/',
    className: 'col-2 push-right-2 col-4--mobile',
  },
  {
    image: { src: terveystaloLogo, alt: 'Terveystalo logo' },
    url: 'https://www.terveystalo.com/',
    className: 'col-2 push-right-2 col-4--mobile',
  },
  {
    image: { src: sympaLogo, alt: 'Sympa logo' },
    url: 'https://www.sympa.com/fi/',
    className: 'col-2 col-4--mobile',
  },
  {
    image: { src: elisaLogo, alt: 'Elisa logo' },
    url: 'https://elisa.fi/',
    className: 'col-2 col-4--mobile',
  },
  {
    image: { src: seLogo, alt: 'Storaenso logo' },
    url: 'https://www.storaensometsa.fi/',
    className: 'col-2 col-4--mobile',
  },
];

export const CompaniesBanner = ({ frontPage }) => (
  <Banner
    backgroundColor={frontPage && 'white'}
    className="spacing--after"
  >
    <Element className="container" flex>
      <BodyText
        centered
        className="col-4 push-right-3"
        text="These companies are taking the Full Stack Challenge"
      />

      <Element flex spaceBetween className="col-6 push-right-2">
        {companies.map(company => (
          <ContentLiftup
            key={company.url}
            small
            companyPath={company.url}
            image={{
              src: company.image.src,
              alt: company.image.alt,
            }}
            className={company.className}
          />
        ))}
      </Element>

      {!frontPage && (
        <Element className="spacing--large col-6 push-right-2">
          <BodyText
            text={[
              'This is a description of what the Full Stack challenge is about. A reason for why the companies should take part in this challenge. What do students who do the course get out of this. What is the benefit for the companies if they do this challenge.',
              'This is a second description of what the Full Stack challenge is about. A reason for why the companies should take part in this challenge. What do students who do the course get out of this. What is the benefit for the companies if they do this challenge.',
            ]}
          />
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
