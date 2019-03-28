import './PartIntroTemplate.scss';

import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import Parser from 'html-react-parser';
import PrevNext from '../components/PrevNext/PrevNext';
import React from 'react';
import SEO from '../components/seo';
import colors from '../colors';
import domToReact from 'html-react-parser/lib/dom-to-react';
import { graphql } from 'gatsby';
import isEmpty from 'lodash/fp/isEmpty';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';
import navigation from '../content/partnavigation/partnavigation';
import { partColors } from './partColors';
import path from 'path';
import snakeCase from 'lodash/fp/snakeCase';

export default function PartIntroTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { mainImage, part } = frontmatter;

  const titles = !isEmpty(navigation[part])
    ? Object.keys(navigation[part])
    : [];

  const parserOptions = {
    replace: ({ type, attribs, children }) => {
      if (type === 'tag' && attribs.class === 'intro') {
        return (
          <div className="col-7">{domToReact(children, parserOptions)}</div>
        );
      }
      return;
    },
  };

  return (
    <Layout>
      <SEO
        title={`Fullstack osa${part}`}
        description={mainSEOdescription}
        keywords={[
          ...mainSEOtags,
          navigation[part] ? Object.values(navigation[part]) : [],
        ]}
      />

      <div className="spacing--after">
        <Banner
          className="part-intro__banner spacing--mobile--small"
          style={{
            backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
            backgroundColor: colors[partColors[part]],
          }}
        >
          <Element className="container">
            <Arrow
              className="breadcrumb"
              content={[
                {
                  backgroundColor: colors[partColors[part]],
                  text: 'Fullstack',
                  link: '/#course-contents',
                },
                {
                  backgroundColor: colors['black'],
                  text: `osa ${part}`,
                },
              ]}
            />

            <div className="part-intro col-7 col-10--mobile spacing--after-small">
              {Parser(html, parserOptions)}
            </div>

            {titles && (
              <Arrow
                wrapperClassName="spacing--mobile--large"
                stack
                content={titles.map(n => {
                  return {
                    backgroundColor: colors['white'],
                    letter: n,
                    path: `/osa${part}/${snakeCase(navigation[part][n])}`,
                    text: `${n} ${navigation[part][n]}`,
                  };
                })}
              />
            )}
          </Element>
        </Banner>

        <PrevNext part={part} />
      </div>

      <Footer />
    </Layout>
  );
}

export const partInfoQuery = graphql`
  query($part: Int!) {
    markdownRemark(frontmatter: { part: { eq: $part }, letter: { eq: null } }) {
      html
      frontmatter {
        mainImage {
          publicURL
        }
        part
      }
    }
  }
`;
