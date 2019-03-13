import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <Layout>
    <SEO title="Sivua ei löytynyt" />

    <Element className="container spacing--small spacing--after link">
      <h1>NOT FOUND</h1>

      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Element>

    <Footer />
  </Layout>
);

export default NotFoundPage;
