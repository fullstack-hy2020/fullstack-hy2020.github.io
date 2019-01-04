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
import part3Image from '../images/osa3.png';

const partColor = 'light-orange';

const Osa3 = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

    <StaticQuery
      query={graphql`
        query {
          allOsa3Json {
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
        const { arrowTitle, intro } = data.allOsa3Json.edges[0].node;

        return (
          <Banner
            style={{
              backgroundImage: `url(${part3Image})`,
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
                    text: 'Web-sovellusten toiminnan perusteet',
                    path: '/osa3/perusteet',
                  },
                  {
                    letter: 'b',
                    text: 'node.js/express',
                    path: '/osa3/node-express',
                  },
                  { letter: 'c', text: 'mongo', path: '/osa3/mongo' },
                  {
                    letter: 'd',
                    text: 'konfiguraatiot',
                    path: '/osa3/konfiguraatiot',
                  },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={2} next={4} />

    <Footer />
  </Layout>
);

export default Osa3;
