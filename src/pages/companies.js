import { Link } from 'gatsby';
import React from 'react';

import Element from '../components/Element/Element';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Companies = () => (
  <Layout>
    <SEO title="Companies" />

    <Element className="container spacing--after">
      <h1>Hi from the Companies page</h1>

      <Link to="/">Go back to the homepage</Link>
    </Element>
  </Layout>
);

export default Companies;
