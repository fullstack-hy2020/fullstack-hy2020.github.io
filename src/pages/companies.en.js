import { BodyText } from '../components/BodyText/BodyText';
import { DeveloperStory } from '../components/DeveloperStory/DeveloperStory';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';
import mainSEOtags from '../content/seo/mainSEOtags';
import stories from '../content/pages/stories';

const Companies = () => (
  <Layout>
    <SEO
      lang="en"
      title="Partner companies | Full Stack Open 2019"
      description="Full stack development in partner companies"
      keywords={[
        ...mainSEOtags,
        'houston',
        'houston inc',
        'software development',
        'frontend',
        'elisa',
        'terveystalo',
        'konecranes',
        'k-ryhmä',
        'unity technologies',
        'unity',
        'kesko',
        'sympa',
        'funktionaalinen ohjelmointi',
        'functional programming',
        'mikropalveluarkkitehtuuri',
        'micro service architecture',
        'micro service',
      ]}
    />

    <Element className="container">
      <BodyText
        className="col-10 spacing"
        heading={{
          title: 'Developer stories from our partners',
          level: 'h1',
        }}
      />

      {stories.en.map(story => (
        <DeveloperStory key={story.name} {...story} lang="en" />
      ))}

      <Element className="spacing" />
    </Element>

    <Footer lang="en" />
  </Layout>
);

export default Companies;
