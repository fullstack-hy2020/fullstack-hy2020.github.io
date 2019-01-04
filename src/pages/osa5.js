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
import part5Image from '../images/osa5.png';

const partColor = 'pink';

const Osa5 = () => (
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
              backgroundImage: `url(${part5Image})`,
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
                  { letter: 'a', text: 'React', path: '/osa5/react' },
                  {
                    letter: 'b',
                    text: 'Frontendin testauksen alkeet',
                    path: '/osa5/frontend-testaus',
                  },
                  { letter: 'c', text: 'Redux', path: '/osa5/redux' },
                  {
                    letter: 'd',
                    text: 'React+redux',
                    path: '/osa5/react-redux',
                  },
                  { letter: 'e', text: 'Javascript', path: '/osa5/javascript' },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={4} next={6} />

    <Footer />
  </Layout>
);

export default Osa5;
