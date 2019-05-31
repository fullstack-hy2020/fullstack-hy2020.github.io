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
      lang="en"
      title="Full stack -challenge | Full Stack Open 2019"
      description="The University of Helsinki and Houston Inc. have partnered up to challenge both individual developers and companies alike to learn and build upon their expertise in true Full Stack development. The course is built by coders for coders, and offers something for both newcomers and seasoned industry veterans alike. "
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
            'The world is in dire need of software developers. We want to help breed the next generation of coders — one of our offered methods is to enroll in the Full Stack MOOC course.',
            'The University of Helsinki and Houston Inc. have partnered up to challenge both individual developers and companies alike to learn and build upon their expertise in true Full Stack spirit. Among our affiliates and challenge initiators are Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj, and Unity Technologies Finland Ltd.',
            'Our objective is to encourage learning. We offer a fully-assembled and purposefully-scoped Full Stack course that lowers the barrier of entry for learning about new state-of-the-art and production grade technologies. The course is free of charge and you can participate from anywhere at anytime, at your leisure.',
            'The course is built by coders for coders, and offers something for both newcomers and seasoned industry veterans alike. The only prerequisite is a solid grasp of basic programming fundamentals.',
          ]}
        />

        <BodyText
          className="spacing"
          headingFont
          heading={{
            level: 'h2',
            title: 'Companies, Heed The Call!',
          }}
          text={[
            'By accepting the challenge you are encouraging and empowering the members of your working community to acquire new skills. The fully-online Full Stack course will make a great addition to your internal training and development programs and will serve well as self-study material amongst your other in-company training offerings.',
            'By partaking in the challenge, you will send a strong message to the outside world about your company’s technical expertise — this will help build your employer image and increase your visibility to software industry professionals.',
            'Joining the challenge is free of charge. Companies that heed the call and accept the challenge will have their logo proudly placed on the Full Stack course webpage.',
          ]}
        />

        <Form lang="en" />
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
