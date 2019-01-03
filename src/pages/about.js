import { StaticQuery, graphql } from 'gatsby';
import React from 'react';

import { Image } from './../components/Image/Image';
import Accordion from '../components/Accordion/Accordion';
import Arrow from '../components/Arrow/Arrow';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
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
      render={data => (
        <div>
          <Element className="container">
            <Arrow
              className="spacing"
              content={[
                {
                  backgroundColor: 'black',
                  text: data.allAboutJson.edges[0].node.name,
                },
              ]}
            />

            <div className="col-6 spacing--after">
              <BodyText text={data.allAboutJson.edges[0].node.intro} />

              <BodyText
                heading={{ title: 'Oletetut esitiedot', level: 'h2' }}
                text={[
                  'Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.',
                  'Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai Javascript-kielen hallintaa.',
                ]}
              />
            </div>

            <Image
              className="col-4 image--small image--contain"
              src={LandingImage}
            />

            {data.allAboutJson.edges[0].node.info.map(item => (
              <Accordion key={item} title={item.title} content={item.content} />
            ))}
          </Element>

          <PartBanner />
        </div>
      )}
    />
  </Layout>
);

export default About;
