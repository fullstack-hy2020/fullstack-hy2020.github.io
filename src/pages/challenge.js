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
import mainSEOtags from '../content/seo/mainSEOtags';

const Challenge = () => (
  <Layout>
    <SEO
      title="Full stack -haaste | Full Stack Open 2019"
      description="Helsingin yliopisto, Houston Inc ja kumppaniyrityksemme haastavat niin koodarit kuin yritykset kasvattamaan osaamistaan tätä kurssia suorittamalla. Haaste on tarkoitettu jokaiselle sovelluskehitysalan osaajalle ja sellaiseksi haluavalle."
      keywords={[
        ...mainSEOtags,
        'fullstackhaaste',
        'full stack haaste',
        'elisa',
        'terveystalo',
        'sympa',
        'konecranes',
        'unity technologies',
        'täydennyskoulutus',
        'koodari',
        'haaste',
      ]}
    />

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
            'Suomi tarvitsee lisää ohjelmistokehittäjiä. Haluamme kasvattaa seuraavan sukupolven koodareita - yksi valitsemistamme tavoista on osallistuminen Full Stack MOOC -kurssille.',
            'Helsingin yliopisto ja Houston Inc. haastavat niin tekijöitä kuin yrityksiä oppimaan uutta ja laajentamaan osaamistaan Full Stack -hengessä. Yhteistyökumppaneina ja haasteen käynnistäjinä ovat myös Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj ja Unity Technologies Finland Ltd.',
            'Haasteen päämäärä on kannustaa oppimaan. Tarjoamme valmiiksi kootun ja ajatuksella rajatun Full Stack -kurssin, joka helpottaa ja vauhdittaa nykyaikaisiin, tuotannossa käytettyihin teknologioihin tutustumista. Kurssi on maksuton, eikä sen suorittaminen ole aikaan tai paikkaan sidottu.',
            'Kurssi on rakennettu koodarilta koodarille ja tarjoaa uutta kokeneemmallekin konkarille. Pohjatiedoiksi vaaditaan hyvä perustason ohjelmointirutiini.',
          ]}
        />

        <BodyText
          className="spacing"
          headingFont
          heading={{
            level: 'h2',
            title: 'Yritykset, ottakaa haaste vastaan!',
          }}
          text={[
            'Tarttumalla haasteeseen kannustatte työyhteisönne osaajia uuden oppimisen äärelle. Full Stack -verkkokurssi on oiva lisä yrityksen täydennyskoulutusvalikoimaan ja toimii hyvin itseopiskelumateriaalina yrityksen muiden koulutusmahdollisuuksien joukossa',
            'Osallistumalla haasteeseen voitte viestiä omaa teknologista osaamistanne yrityksen ulkopuolelle – tämä auttaa niin työnantajakuvan muodostamisessa kuin näkyvyydessä sovelluskehitysalan ammattilaisille.',
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
