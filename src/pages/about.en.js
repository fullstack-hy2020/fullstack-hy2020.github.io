import Accordion from '../components/Accordion/Accordion';
import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import { Image } from './../components/Image/Image';
import Layout from '../components/layout';
import { PartBanner } from '../components/PartBanner/PartBanner';
import React from 'react';
import SEO from '../components/seo';
import content from '../content/pages/about.json';
import landingImage from '../images/landing.svg';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';

const About = () => {
  const { intro, info } = content.en;

  return (
    <Layout>
      <SEO
        lang="en"
        title="About the course | Full Stack Open 2019"
        description={mainSEOdescription['en']}
        keywords={[
          ...mainSEOtags,
          'Avoin yliopisto',
          'Full stack harjoitustyö',
        ]}
      />

      <Banner style={{ paddingBottom: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '-70px',
          }}
          className="container"
        >
          <Image
            className="col-4 push-right-2"
            contain
            style={{ margin: 0 }}
            alt="Stacked cubes with React logo and JavaScript text"
            src={landingImage}
          />
        </div>
      </Banner>

      <Element className="container spacing spacing--mobile--large">
        <Element className="col-8 push-right-1">
          <BodyText
            heading={{ level: 'h1', title: 'General' }}
            headingFontSize="2.3rem"
          />

          <Element flex spaceBetween>
            <div className="col-10 spacing--after">
              <BodyText text={intro} className="link" headingFont />

              <BodyText
                className="link"
                headingFont
                text={[
                  'Participants are expected to have good programming skills, basic knowledge of web - programming and databases, and to know the basics of working with the Git version-control system. You are also expected to have perseverance and the ability for independent problem solving and information seeking.',
                  'Part 0 of the course material goes through the content and conduct of the course in more detail. Make sure to read the material and instructions thoroughly.',
                ]}
              />
            </div>
          </Element>
        </Element>
      </Element>

      {false &&
        info.map(item => (
          <Accordion key={item} title={item.title} content={item.content} />
        ))}

      <PartBanner lang="en" />
      <Footer lang="en" />
    </Layout>
  );
};

export default About;
