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
import part1Image from '../images/osa1.png';

const partColor = 'green';

const Osa1 = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

    <StaticQuery
      query={graphql`
        query {
          allOsa1Json {
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
        const { arrowTitle, intro } = data.allOsa1Json.edges[0].node;

        return (
          <Banner
            style={{
              backgroundImage: `url(${part1Image})`,
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
                  { letter: 'a', text: 'Reactin alkeet', path: '/osa1/reactin_alkeet' },
                  { letter: 'b', text: 'Javascript', path: '/osa1/javascript' },
                  { letter: 'c', text: 'React-komponentin tila', path: '/osa1/komponentin_tila' },
                ]}
              />
            </Element>
          </Banner>
        );
      }}
    />

    <PrevNext prev={0} next={2} />

    <Footer />
  </Layout>
);

export default Osa1;
