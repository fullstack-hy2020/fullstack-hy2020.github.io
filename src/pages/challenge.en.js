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
        text="This is Full Stack -challenge"
        headingLevel="h1"
      />

      <Element className="spacing--after col-6 push-right-2">
        <BodyText
          headingFont
          text={[
            'Finland needs more software developers. We want to grow the next generation of coders - one of the ways we choose is to participate in the Full Stack MOOC course. ',
            'The University of Helsinki and Houston Inc. challenge both authors and companies to learn new things and expand their skills in the spirit of Full Stack. Also partners and launchers are Elisa Corporation, K-Group, Konecranes Plc, Terveystalo Oyj and Unity Technologies Finland Ltd. ',
            'The goal of the challenge is to encourage learning. We offer a pre-assembled and thought-out Full Stack course that facilitates and accelerates familiarization with modern technologies used in production. The course is free of charge and is not tied to time or place. ',
            'The course is built from an encoder to a coder and offers a new experience for a more experienced competitor. A good basic programming routine is required for the background information. ',
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
            "By grabbing the challenge, you encourage the skills of your work community to learn new things. The Full Stack Online Course is a great addition to the company's in-service training portfolio and works well as a self-study tool among the company's other training opportunities",
            'By participating in the challenge, you can communicate your own technological expertise outside the company - this helps both the image of the employer and the visibility of the application development professionals.',
            'Participation in the challenge is free of charge. The logos of the companies that received the challenge will be placed on the Full Stack course page. ',
          ]}
        />

        <Form />
      </Element>
    </Element>

    <CompaniesBanner lang="en" />

    <SubHeader
      className="col-10 spacing--after centered"
      text="#fullstackchallenge"
      headingLevel="h3"
    />
  </Layout>
);

export default Challenge;
