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
import part2Image from '../images/osa2.png';

const partColor = 'dark-orange';

const Osa2 = () => (
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
              backgroundImage: `url(${part2Image})`,
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
                    path: '/osa2/perusteet',
                  },
                  {
                    letter: 'b',
                    text: 'React',
                    path: '/osa2/react',
                  },
                  { letter: 'c', text: 'Javascript', path: '/osa2/javascript' },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={1} next={3} />

    <Footer />
  </Layout>
);

export default Osa2;
