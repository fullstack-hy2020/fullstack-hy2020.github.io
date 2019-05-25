import Arrow from '../components/Arrow/Arrow';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';
import colors from '../colors';

const NotFoundPage = () => (
  <Layout>
    <SEO title="Page not found | Full Stack Open 2019" />

    <Element className="container spacing--large spacing--after">
      <h1>404 - Page not found</h1>

      <p className="col-10 spacing--small spacing--after">
        Uncaught ReferenceError: unknown is not defined
      </p>

      <Arrow
        className="col-10 arrow__container--with-link"
        bold
        thickBorder
        link="/"
        content={[{ backgroundColor: colors['main'], text: 'Go back home' }]}
      />
    </Element>

    <Footer lang="en" />
  </Layout>
);

export default NotFoundPage;
