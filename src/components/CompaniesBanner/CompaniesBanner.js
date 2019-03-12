import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import { PropTypes } from 'prop-types';
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
  <Banner backgroundColor={frontPage && 'white'} className="spacing--after">
    <Element className="container" flex>
      {!frontPage && (
        <Element className="spacing spacing--after col-6 push-right-2">
          <BodyText
            heading={{ level: 'h2', title: 'Tämä on Full stack -haaste' }}
            text={[
              'Full stack -haaste rohkaisee niin osaajat kuin yritykset kasvattamaan osaamistaan Full stack -hengessä.',
              'Päämäärämme on auttaa oppimaan. Tarjoamme valmiiksi kootun ja ajatuksella rajatun Full Stack -kurssin, joka helpottaa ja vauhdittaa nykyaikaisiin teknologioihin tutustumista. Kurssin materiaali ja tehtävät sopivat niin konkarille kuin aloittelevalle osaajalle; täydennyskoulutusta etsivälle, alanvaihtajalle, taitojaan päivittävälle, alan opiskelijalle sekä jokaiselle, joka haluaa tarttua haasteeseen ja kasvattaa osaamistaan koodarina.',
              'Full stack -kurssi on ilmainen verkkokurssi, joka on koottu ajatuksella koodarilta koodarille. Kokonaisuus on Helsingin yliopiston ja Houston Inc.’n yhteistyössä toteuttama.',
            ]}
          />

          <BodyText className="spacing"
            heading={{
              level: 'h2',
              title: 'Yritys, anna tukesi Full stack -haasteelle',
            }}
            text={[
              'Haastekumppanuus',
              'Kevyesti kyytiin! Anna yrityksesi tuki Full stack -haasteelle, ja kannustakaa työntekijöitänne kurssin pariin päivittämään ja laajentamaan taitojaan. Kiitoksena yhteistyöstä haastekumppanin logo nostetaan Full stack -kurssin sivulle.',
              'Yhteistyökumppanuus',
              'Kaikki hyöty irti! Tärkein lisäarvo syntyy aidosta yhteistyöstä rekrytointimahdollisuuksien, hackathonien ja vierailijaluentojen merkeissä. Lisäksi yhteistyökumppanuus tarjoaa logonäkyvyyden sekä yritysesittelyn Full stack -sivulle. Yhteistyökumppanuus on maksullinen.',
              'Kasvatetaan osaamista yhdessä! Kumppanuuksista vastaa Jan Myller, yhteyspäällikkö, Helsingin yliopisto p. xxx.xxxx.xxxxx, jan.myller@helsinki.fi',
              '#fullstackhaaste',
            ]}
          />
        </Element>
      )}
      <BodyText
        centered
        className="col-4 push-right-3"
        text="Haasteessa mukana"
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
    </Element>
  </Banner>
);

CompaniesBanner.defaultProps = {
  frontPage: false,
};

CompaniesBanner.propTypes = {
  frontPage: PropTypes.bool,
};
