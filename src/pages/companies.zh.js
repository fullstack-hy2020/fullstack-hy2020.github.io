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
      lang="zh"
      title="合作伙伴 | 全栈公开课2020"
      description="合作伙伴中的全栈工程师"
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
          title: '来自合作伙伴中全栈开发的故事',
          level: 'h1',
        }}
      />

      {stories.zh.map(story => (
        <DeveloperStory key={story.name} {...story} lang="zh" />
      ))}

      <Element className="spacing" />
    </Element>

    <Footer lang="zh" />
  </Layout>
);

export default Companies;
