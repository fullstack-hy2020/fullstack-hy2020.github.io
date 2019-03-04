import { BodyText } from '../components/BodyText/BodyText';
import { CompaniesBanner } from '../components/CompaniesBanner/CompaniesBanner';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';

const Companies = () => (
  <Layout>
    <SEO title="Companies" />

    <Element className="container">
      <BodyText
        className="col-10 spacing"
        heading={{ title: 'Developer stories', level: 'h1' }}
        headingFontSize="3rem"
      />

      <Element className="spacing" />

      <CompaniesBanner />
    </Element>

    <Footer />
  </Layout>
);

export default Companies;
