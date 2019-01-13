import { Link } from 'gatsby';
import React from 'react';

import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Companies = () => (
  <Layout>
    <SEO title="Companies" />

    <Element className="container spacing spacing--after link">
      <h1>Hi from the Companies page</h1>

      <Link to="/">Go back to the homepage</Link>
    </Element>

    <Footer />
  </Layout>
);

export default Companies;
