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
      lang="zh"
      title="常见问题 | 全栈公开课2020"
      description="Frequently asked questions"
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
        text="常见问题"
      />
      {content.zh.map(item => {
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

    <Footer lang="zh" />
  </Layout>
);

export default FAQ;
