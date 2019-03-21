import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import { CompaniesBanner } from '../components/CompaniesBanner/CompaniesBanner';
import Element from '../components/Element/Element';
import Form from '../components/Form/Form';
import { Image } from '../components/Image/Image';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';
import { SubHeader } from '../components/SubHeader/SubHeader';
import landingImage from '../images/landing.svg';

const Challenge = () => (
  <Layout>
    <SEO title="Yritysesittelyt" />

    <Banner style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '-70px',
        }}
        className="container"
      >
        <Image
          className="col-4 push-right-2"
          contain
          style={{ margin: 0 }}
          alt="Stacked cubes with React logo and JavaScript text"
          src={landingImage}
        />
      </div>
    </Banner>

    <Element className="container spacing">
      <SubHeader
        className="col-10col-8 push-right-1"
        text="Tämä on Full Stack -haaste"
        headingLevel="h1"
      />

      <Element className="spacing--after col-6 push-right-2">
        <BodyText
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
            //'<b>Haastekumppanuus</b>',
            'Kevyesti kyytiin! Anna yrityksesi tuki Full stack -haasteelle, ja kannustakaa työyhteisönne osaajat kurssin pariin päivittämään ja laajentamaan taitojaan. Kiitoksena yhteistyöstä haastekumppanin logo nostetaan Full stack -kurssin sivulle.',
            //'<b>Yhteistyökumppanuus</b>',
            //'Kaikki hyöty irti! Iso lisäarvo syntyy aidosta yhteistyöstä rekrytointimahdollisuuksien, hackathonien ja vierailijaluentojen merkeissä. Lisäksi yhteistyökumppanuus tarjoaa logonäkyvyyden sekä yritysesittelyn Full stack -sivulle.Yhteistyökumppanuus on maksullinen.',
            'Kasvatetaan osaamista yhdessä! Kumppanuudesta vastaa Jan Myller, yhteyspäällikkö, Helsingin yliopisto p. 02 941 40361, jan.myller@helsinki.fi',
          ]}
        />

        <BodyText
          className="spacing spacing--after"
          headingFont
          heading={{
            level: 'h2',
            title: 'Otamme sinuun yhteyttä ja kerromme lisää.',
          }}
        />

        <Form />
      </Element>
    </Element>

    <CompaniesBanner />

    <SubHeader
      className="col-10 spacing--after centered"
      text="#fullstackhaaste"
      headingLevel="h3"
    />
  </Layout>
);

export default Challenge;
