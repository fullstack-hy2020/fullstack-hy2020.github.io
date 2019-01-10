import './PartIntroTemplate.scss';

import path from 'path';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import React from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';

export default function PartIntroTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { mainImage, title, partColor, part, navigation } = frontmatter;

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

  const navArray = navigation ? navigation.split('@') : [];

  return (
    <Layout>
      <Banner
        style={{
          backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
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
              {
                backgroundColor: colors[partColor],
                text: 'Fullstack',
                link: '/about',
              },
              {
                backgroundColor: 'black',
                text: title,
              },
            ]}
          />

          <div className="part-intro col-7 spacing--after-small">
            {Parser(html, parserOptions)}
          </div>

          <Arrow
            className="spacing"
            stack
            content={navArray.map(n => {
              const arr = n.split('|');

              return {
                letter: arr[0],
                path: arr[1],
                text: arr[2],
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
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        path
        mainImage {
          publicURL
        }
        partColor
        part
        letter
        navigation
      }
    }
  }
`;
