import './PartIntroTemplate.scss';

import path from 'path';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import snakeCase from 'lodash/fp/snakeCase';
import React from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import navigation from '../content/partnavigation/partnavigation';
import { partColors } from './partColors';

export default function PartIntroTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { mainImage, part } = frontmatter;

  const titles = Object.keys(navigation[part]);

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
      <Banner
        style={{
          backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
          backgroundPosition: 'center right',
          backgroundSize: '80%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: colors[partColors[part]],
        }}
        className="spacing spacing--after"
      >
        <Element className="container">
          <Arrow
            className="breadcrumb"
            content={[
              {
                backgroundColor: colors[partColors[part]],
                text: 'Fullstack',
                link: '/about',
              },
              {
                backgroundColor: colors['black'],
                text: `osa ${part}`,
              },
            ]}
          />

          <div className="part-intro col-7 spacing--after-small">
            {Parser(html, parserOptions)}
          </div>

          <Arrow
            className="spacing--mobile"
            stack
            content={titles.map(n => {
              return {
                backgroundColor: colors['white'],
                letter: n,
                path: `/osa${part}/${snakeCase(navigation[part][n])}`,
                text: navigation[part][n],
              };
            })}
          />
        </Element>
      </Banner>

      <PrevNext
        prev={part > 0 ? part - 1 : undefined}
        next={part < 8 ? part + 1 : undefined}
      />

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
