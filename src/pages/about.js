import { StaticQuery, graphql } from 'gatsby';

import Accordion from '../components/Accordion/Accordion';
import Arrow from '../components/Arrow/Arrow';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import { Image } from './../components/Image/Image';
import Layout from '../components/layout';
import { PartBanner } from '../components/PartBanner/PartBanner';
import React from 'react';
import SEO from '../components/seo';
import colors from '../colors';
import landingImage from '../images/landing.svg';

const About = () => (
  <Layout>
    <SEO
      title="ABOUT"
      keywords={[
        'fullstack',
        'course',
        'helsingin yliopisto',
        'tietojenkäsittelytieteen osasto',
        'mooc',
        'mooc.fi',
        'full stack',
        'web-sovelluskehitys',
      ]}
    />
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
          <>
            <Element className="container">
              <Arrow
                className="spacing--small"
                content={[
                  {
                    backgroundColor: colors['black'],
                    text: name,
                  },
                ]}
              />

              <Element flex spaceBetween>
                <div className="col-6 spacing--after">
                  <BodyText text={intro} className="link" headingFont />

                  <BodyText
                    className="link"
                    headingFont
                    text={[
                      'Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.',
                      'Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai Javascript-kielen hallintaa.',
                      'Kurssi sisältää yhden luennon, kohtuullisen määrään pajaohjausta ja hirveän määrän itsenäistä koodaamista. Varaudu käyttämään aikaa noin 10-15 tuntia viikossa koko periodin ajan.',
                      'Kurssin sisällöstä ja suoritustavasta kerrotaan materiaalissa osassa 0, lue ne huolella.',
                    ]}
                  />
                </div>

                <Image
                  contain
                  style={{ margin: 0 }}
                  alt="Stacked cubes with React logo and JavaScript text"
                  src={landingImage}
                />
              </Element>

              {false &&
                info.map(item => (
                  <Accordion
                    key={item}
                    title={item.title}
                    content={item.content}
                  />
                ))}
            </Element>

            <PartBanner />
          </>
        );
      }}
    />

    <Footer />
  </Layout>
);

export default About;
