import { StaticQuery, graphql } from 'gatsby';
import React from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import SEO from '../components/seo';
import part7Image from '../images/osa7.png';

const partColor = 'light-blue';

const Osa7 = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

    <StaticQuery
      query={graphql`
        query {
          allOsa7Json {
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
        const { arrowTitle, intro } = data.allOsa7Json.edges[0].node;

        return (
          <Banner
            style={{
              backgroundImage: `url(${part7Image})`,
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
                  { letter: 'a', text: 'Webpack', path: '/osa7/webpack' },
                  {
                    letter: 'b',
                    text: 'Tyylien lisääminen sovellukseen',
                    path: '/osa7/tyylit',
                  },
                  { letter: 'c', text: 'Testaus', path: '/osa7/testaus' },
                  { letter: 'd', text: 'React', path: '/osa7/react' },
                  {
                    letter: 'e',
                    text: 'React/node-sovellusten titeoturva',
                    path: '/osa7/tietoturva',
                  },
                  { letter: 'f', text: 'Tyypitys', path: '/osa7/tyypitys' },
                  {
                    letter: 'g',
                    text: 'Tulevaisuuden trendejä',
                    path: '/osa7/trendit',
                  },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={6} />
  </Layout>
);

export default Osa7;
