import { StaticQuery, graphql } from 'gatsby';
import React from 'react';

import Accordion from '../components/Accordion/Accordion';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { SubHeader } from '../components/SubHeader/SubHeader';

const FAQ = () => (
  <Layout>
    <SEO title="FAQ" />

    <StaticQuery
      query={graphql`
        query {
          allFaqJson {
            edges {
              node {
                title
                text
              }
            }
          }
        }
      `}
      render={data => {
        const { edges } = data.allFaqJson;

        return (
          <Element className="container link spacing spacing--after-small">
            <SubHeader
              className="spacing--small spacing--after-small"
              headingLevel="h1"
              text="Usein kysytyst kysymykset"
            />

            {edges.map(edge => {
              const { node } = edge;

              return (
                <Accordion
                  key={node.title}
                  title={node.title}
                  content={node.text}
                />
              );
            })}
          </Element>
        );
      }}
    />

    <Footer />
  </Layout>
);

export default FAQ;
