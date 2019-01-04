import { StaticQuery, graphql } from 'gatsby';
import React from 'react';

import Accordion from '../components/Accordion/Accordion';
import Arrow from '../components/Arrow/Arrow';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import { PartBanner } from '../components/PartBanner/PartBanner';
import SEO from '../components/seo';
import LandingImage from '../images/Landing.png';

const About = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />

    <StaticQuery
      query={graphql`
        query aboutQuery {
          allAboutJson {
            edges {
              node {
                id
                name
                intro
                info {
                  title
                  content
                }
              }
            }
          }
        }
      `}
      render={data => {
        const { name, intro, info } = data.allAboutJson.edges[0].node;

        return (
          <div>
            <Element className="container">
              <Arrow
                className="spacing"
                content={[
                  {
                    backgroundColor: 'black',
                    text: name,
                  },
                ]}
              />

              <Element flex spaceBetween>
                <div className="col-6 spacing--after">
                  <BodyText text={intro} />

                  <BodyText
                    heading={{ title: 'Oletetut esitiedot', level: 'h2' }}
                    text={[
                      'Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.',
                      'Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai Javascript-kielen hallintaa.',
                    ]}
                  />
                </div>

                <Element className="col-3">
                  <img
                    style={{ marginTop: 'auto' }}
                    alt="Stacked cubes with React logo and JavaScript text"
                    src={LandingImage}
                  />
                </Element>
              </Element>

              {info.map(item => (
                <Accordion
                  key={item}
                  title={item.title}
                  content={item.content}
                />
              ))}
            </Element>

            <PartBanner />
          </div>
        );
      }}
    />

    <Footer />
  </Layout>
);

export default About;
