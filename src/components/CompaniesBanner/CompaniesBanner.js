import { Banner } from '../Banner/Banner';
import { BodyText } from '../BodyText/BodyText';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import Element from '../Element/Element';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import elisaLogo from '../../images/elisa_logo.png';
import houstonLogo from '../../images/houston_logo.png';
// import seLogo from '../../images/SE_logo.png';
import sympaLogo from '../../images/sympa_logo.png';
import terveystaloLogo from '../../images/terveystalo_logo.png';
import yliopistoLogo from '../../images/hgin_yliopisto.png';

const companies = [
  {
    image: { src: yliopistoLogo, alt: 'Helsingin yliopisto logo' },
    url: 'https://www.helsinki.fi/',
  },
  {
    image: { src: houstonLogo, alt: 'Houston inc. logo' },
    url: 'https://www.houston-inc.com/',
  },
  {
    image: { src: terveystaloLogo, alt: 'Terveystalo logo' },
    url: 'https://www.terveystalo.com/',
  },
  {
    image: { src: elisaLogo, alt: 'Elisa logo' },
    url: 'https://elisa.fi/',
  },
  {
    image: { src: sympaLogo, alt: 'Sympa logo' },
    url: 'https://www.sympa.com/fi/',
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
      {!frontPage && (
        <Element className="spacing spacing--after col-6 push-right-2">
          <BodyText
            heading={{ level: 'h2', title: 'Tämä on Full stack -haaste' }}
            headingFont
            text={[
              'Full stack -haaste rohkaisee niin osaajat kuin yritykset kasvattamaan osaamistaan Full stack -hengessä.',
              'Päämäärämme on auttaa oppimaan. Tarjoamme valmiiksi kootun ja ajatuksella rajatun Full Stack -kurssin, joka helpottaa ja vauhdittaa nykyaikaisiin, tuotannossa käytettyihin teknologioihin tutustumista. Kurssin materiaali ja tehtävät sopivat niin konkarille kuin aloittelevalle osaajalle; täydennyskoulutusta etsivälle, alanvaihtajalle, taitojaan päivittävälle, alan opiskelijalle sekä jokaiselle, joka haluaa tarttua haasteeseen ja kasvattaa osaamistaan koodarina.',
              'Full stack -kurssi on ilmainen verkkokurssi, joka on koottu ajatuksella koodarilta koodarille. Kokonaisuus on Helsingin yliopiston ja Houston Inc.’n yhteistyössä toteuttama.',
            ]}
          />

          <BodyText
            className="spacing"
            headingFont
            heading={{
              level: 'h2',
              title: 'Yritys, anna tukesi Full stack -haasteelle',
            }}
            text={[
              '<b>Haastekumppanuus</b>',
              'Kevyesti kyytiin! Anna yrityksesi tuki Full stack -haasteelle, ja kannustakaa työyhteisönne osaajat kurssin pariin päivittämään ja laajentamaan taitojaan. Kiitoksena yhteistyöstä haastekumppanin logo nostetaan Full stack -kurssin sivulle.',
              '<b>Yhteistyökumppanuus</b>',
              'Kaikki hyöty irti! Iso lisäarvo syntyy aidosta yhteistyöstä rekrytointimahdollisuuksien, hackathonien ja vierailijaluentojen merkeissä. Lisäksi yhteistyökumppanuus tarjoaa logonäkyvyyden sekä yritysesittelyn Full stack -sivulle.Yhteistyökumppanuus on maksullinen.',
              'Kasvatetaan osaamista yhdessä! Kumppanuuksista vastaa Jan Myller, yhteyspäällikkö, Helsingin yliopisto p. 02 941 40361, jan.myller@helsinki.fi',
              '#fullstackhaaste',
            ]}
          />
        </Element>
      )}
      <BodyText
        centered
        className="col-4 push-right-3"
        text="Full stack -haasteessa mukana"
      />
      <Element flex className="col-6 push-right-2 flex-fix-aligning space-between--mobile">
        {companies.map((company, i) => (
          <ContentLiftup
            key={company.url}
            small
            companyPath={company.url}
            image={{
              src: company.image.src,
              alt: company.image.alt,
            }}
            className={`col-2 col-4--mobile col-4--tablet push-right-1`}
          />
        ))}

        {frontPage && (
          <Element flex spaceAround className="col-10 spacing">
            <Link className="about__challenge-button" to="/companies/#challenge">
              Lisätietoja haasteesta
            </Link>
          </Element>
        )}
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
