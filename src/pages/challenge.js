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
import landingImage from '../images/haaste.svg';

const Challenge = () => (
  <Layout>
    <SEO title="Yritysesittelyt" />

    <Banner style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div className="container challenge__banner">
        <Image
          contain
          className="col-10"
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
            'Helsingin yliopisto ja Houston Inc. haastavat niin koodarit kuin yritykset kasvattamaan osaamistaan Full Stack -hengessä. Haaste on tarkoitettu jokaiselle sovelluskehitysalan osaajalle.',
            'Haasteen päämäärä on kannustaa oppimaan. Tarjoamme valmiiksi kootun ja ajatuksella rajatun Full Stack -kurssin, joka helpottaa ja vauhdittaa nykyaikaisiin, tuotannossa käytettyihin teknologioihin tutustumista.',
            'Kurssin materiaali ja tehtävät sopivat niin konkarille kuin uraansa aloittelevalle osaajalle; täydennyskoulutusta etsivälle, alanvaihtajalle, taitojaan päivittävälle, alan opiskelijalle sekä jokaiselle, joka haluaa tarttua haasteeseen ja kasvattaa osaamistaan.',
            "Full Stack -kurssi on ilmainen verkkokurssi, joka on koottu ajatuksella koodarilta koodarille. Kokonaisuus on Helsingin yliopiston ja Houston Inc.'n yhteistyössä toteuttama.",
          ]}
        />

        <BodyText
          className="spacing"
          headingFont
          heading={{
            level: 'h2',
            title: 'Yritys, anna tukesi Full Stack -haasteelle',
          }}
          text={[
            'Tarttumalla Full Stack -haasteeseen kannustatte työyhteisönne osaajia uuden oppimisen äärelle. Haasteen kautta Full Stack osaamisalueena tulee tutuksi niin kokeneelle kuin aloittelevalle koodarille.',
            'Haasteeseen sisällön tuo Full Stack -kurssi, joka toimii hienosti itseopiskelumateriaalina yrityksen muiden koulutusmahdollisuuksien joukossa',
            'Haasteeseen osallistuminen on maksutonta. Haasteen vastaanottaneiden yritysten logot nostetaan Full Stack -kurssin sivulle.',
          ]}
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
