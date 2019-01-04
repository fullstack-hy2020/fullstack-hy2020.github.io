import { StaticQuery, graphql } from 'gatsby';
import React from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import SEO from '../components/seo';
import part4Image from '../images/osa5.png';

const partColor = 'yellow';

const Osa4 = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

    <StaticQuery
      query={graphql`
        query {
          allOsa5Json {
            edges {
              node {
                arrowTitle
                intro
              }
            }
          }
        }
      `}
      render={data => {
        const { arrowTitle, intro } = data.allOsa5Json.edges[0].node;

        return (
          <Banner
            style={{
              backgroundImage: `url(${part4Image})`,
              backgroundPosition: 'center right',
              backgroundSize: '80%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: colors[partColor],
            }}
            className="spacing spacing--after"
          >
            <Element className="container">
              <Arrow
                upperCase
                content={[
                  { backgroundColor: colors[partColor], text: 'Yleistä' },
                  {
                    backgroundColor: 'black',
                    text: arrowTitle,
                  },
                ]}
              />

              <BodyText className="col-7" text={intro} />

              <Arrow
                stack
                content={[
                  {
                    letter: 'a',
                    text: 'Node.js / Express',
                    path: '/osa4/node-express',
                  },
                  {
                    letter: 'b',
                    text: 'Node.js -sovellusten testaus',
                    path: '/osa4/node-testaus',
                  },
                  { letter: 'c', text: 'JS', path: '/osa4/js' },
                  { letter: 'd', text: 'Mongoose', path: '/osa4/mongoose' },
                  { letter: 'e', text: 'Web', path: '/osa4/web' },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={3} next={5} />

    <Footer />
  </Layout>
);

export default Osa4;
