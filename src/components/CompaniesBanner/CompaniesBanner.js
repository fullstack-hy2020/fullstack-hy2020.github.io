import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import React from 'react';
import elisaLogo from '../../images/Elisa_logo_black.png';
import houstonLogo from '../../images/houston_logo.png';
import nokiaLogo from '../../images/nokia_logo_blue.png';
import seLogo from '../../images/SE_Color_WebLogo_RGB.jpg';
import terveystaloLogo from '../../images/terveystalo-logo.png';
import yliopistoLogo from '../../images/hgin_yliopisto.png';

export const CompaniesBanner = () => (
  <Element className="container spacing--after" flex>
    <BodyText
      centered
      className="col-4 push-right-3"
      text="These companies are taking the Full Stack Challenge"
    />

    <Element flex spaceBetween className="col-6 push-right-2">
      <ContentLiftup
        small
        image={{
          src: yliopistoLogo,
          alt: 'Helsingin yliopisto logo',
        }}
        className="col-2 col-4--mobile"
      />

      <ContentLiftup
        small
        image={{ src: houstonLogo, alt: 'Houston Inc. logo' }}
        className="col-2 push-right-2 col-4--mobile"
      />

      <ContentLiftup
        small
        image={{
          src: terveystaloLogo,
          alt: 'Terveystalo logo',
        }}
        className="col-2 push-right-2 col-4--mobile"
      />

      <ContentLiftup
        small
        image={{ src: nokiaLogo, alt: 'Nokia logo' }}
        className="col-2 col-4--mobile"
      />

      <ContentLiftup
        small
        image={{
          src: elisaLogo,
          alt: 'Elisa logo',
        }}
        className="col-2 col-4--mobile"
      />

      <ContentLiftup
        small
        image={{ src: seLogo, alt: 'Storaenso logo' }}
        className="col-2 col-4--mobile"
      />
    </Element>
  </Element>
);
