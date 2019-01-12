import React from 'react';

import Element from '../components/Element/Element';
import { BodyText } from '../components/BodyText/BodyText';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import SEO from '../components/seo';
import faqs from '../content/faq/faq.json'

const FAQ = () => (
  <Layout>
    <SEO title="FAQ" />

    <Element className="container">
      <Element className="col-10 col-8--mobile spacing--small">
        <BodyText
          heading={{ title: 'Usein kysytyst kysymykset' , level: 'h1' }}
        />
      </Element>    

      <h1>Usein kysytyst kysymykset</h1>

      {faqs.map(faq =>
        <Element className="col-10 col-8--mobile">
          <BodyText
            className="spacing--small" 
            heading={{ title: faq.title , level: 'h3' }}
            text={faq.text} 
          />
        </Element> 
      )}

    </Element>

    <Footer />
  </Layout>
);

export default FAQ;
