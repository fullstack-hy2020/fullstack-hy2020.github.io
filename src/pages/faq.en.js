import Accordion from '../components/Accordion/Accordion';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';
import { SubHeader } from '../components/SubHeader/SubHeader';
import content from '../content/pages/faq.json';
import mainSEOtags from '../content/seo/mainSEOtags';

const FAQ = () => (
  <Layout>
    <SEO
      title="FAQ | Full Stack Open 2019"
      description="Usein kysytyt kysymykset"
      keywords={[
        ...mainSEOtags,
        'faq',
        'frequently asked questions',
        'ukk',
        'usein kysytyt kysymykset',
      ]}
    />

    <Element className="container link spacing spacing--after">
      <SubHeader
        className="spacing--after-small"
        headingLevel="h1"
        text="Frequently asked questions"
      />
      {content.en.map(item => {
        return (
          <Accordion
            track
            key={item.title}
            title={item.title}
            content={item.text}
          />
        );
      })}
    </Element>

    <Footer lang="en" />
  </Layout>
);

export default FAQ;
