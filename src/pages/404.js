import React from 'react';

import Element from '../components/Element/Element';
import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />

    <Element className="container spacing--after">
      <h1>NOT FOUND</h1>

      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Element>
  </Layout>
);

export default NotFoundPage;
