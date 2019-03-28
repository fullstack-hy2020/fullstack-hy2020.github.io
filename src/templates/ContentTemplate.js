import './ContentTemplate.scss';

import React, { Component } from 'react';

import Arrow from '../components/Arrow/Arrow';
import ArrowToTop from '../images/up-arrow.svg';
import { Banner } from '../components/Banner/Banner';
import EditLink from '../components/EditLink/EditLink';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import Parser from 'html-react-parser';
import PrevNext from '../components/PrevNext/PrevNext';
import ReturnInfo from '../components/ReturnInfo/ReturnInfo';
import SEO from '../components/seo';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import { SubHeader } from '../components/SubHeader/SubHeader';
import colors from '../colors';
import domToReact from 'html-react-parser/lib/dom-to-react';
import { graphql } from 'gatsby';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';
import navigation from '../content/partnavigation/partnavigation';
import { partColors } from './partColors';
import path from 'path';
import snakeCase from 'lodash/fp/snakeCase';

export default class ContentTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      h1Top: 0,
      h1Title: '',
      otherTitles: '',
      top: 0,
    };
  }

  componentDidMount() {
    const links = Array.from(document.querySelectorAll('a'));
    const h1 = document.querySelector('h1');
    const h3 = document.querySelectorAll('h3');
    const h3Arr = Array.from(h3).map(t => t.innerText);

    const { frontmatter } = this.props.data.markdownRemark;

    links.map(i => {
      i.style = `border-color: ${colors[partColors[frontmatter.part]]}`;
      i.target = '_blank';

      function over() {
        i.style.backgroundColor = colors[partColors[frontmatter.part]];
      }
      function out() {
        i.style.backgroundColor = 'transparent';
      }

      i.onmouseover = over;
      i.onmouseleave = out;

      return null;
    });

    this.setState({
      h1Top: h1.offsetTop,
      h1Title: h1.innerText,
      otherTitles: [...h3Arr],
    });

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      top: window.scrollY,
    });
  };

  render() {
    const { markdownRemark } = this.props.data;
    const { frontmatter, html } = markdownRemark;
    const { mainImage, letter, part } = frontmatter;
    const colorCode = colors[partColors[part]];

    const parserOptions = {
      replace: ({ type, name, attribs, children }) => {
        if (type === 'tag' && name === 'picture') {
          return (
            <picture>
              <img
                style={{ borderColor: colorCode }}
                alt="fullstack content"
                src={children[0].attribs.src}
              />
            </picture>
          );
        } else if (type === 'tag' && name === 'pre') {
          return <pre>{domToReact(children, parserOptions)}</pre>;
        } else if (type === 'tag' && attribs.class === 'content') {
          return (
            <div className="container">
              <div className="course-content col-6 push-right-3">
                {domToReact(children, parserOptions)}
              </div>
            </div>
          );
        } else if (type === 'tag' && attribs.class === 'tasks') {
          return (
            <Banner
              style={{
                backgroundColor: colorCode,
              }}
              className="spacing spacing--after tasks"
            >
              <div className="container">
                <div
                  className="course-content col-6 push-right-3"
                  style={{
                    borderColor: colorCode,
                    backgroundColor: 'transparent',
                  }}
                >
                  {children.name === 'pre' ? (
                    <pre>{domToReact(children, parserOptions)}</pre>
                  ) : (
                    domToReact(children, parserOptions)
                  )}
                </div>
              </div>
            </Banner>
          );
        }
        return;
      },
    };

    return (
      <Layout>
        <SEO
          title={`Fullstack osa${part} | ${this.state.h1Title}`}
          description={mainSEOdescription}
          keywords={[
            ...mainSEOtags,
            this.state.h1Title,
            ...this.state.otherTitles,
          ]}
        />

        {this.state.top > 300 && (
          <div
            className="arrow-go-up"
            onClick={() =>
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              })
            }
          >
            <img src={ArrowToTop} alt="arrow-up" />
          </div>
        )}

        <div className="course-container spacing--after">
          <Banner
            className="part-main__banner spacing--mobile--small"
            backgroundColor={colorCode}
            style={{
              backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
              backgroundColor: colorCode,
            }}
          >
            <div className="container spacing--after">
              <Arrow
                className="breadcrumb"
                content={[
                  {
                    backgroundColor: colorCode,
                    text: 'Fullstack',
                    link: '/#course-contents',
                  },
                  {
                    backgroundColor: colorCode,
                    text: `osa ${part}`,
                    link: `/osa${part}`,
                  },
                  {
                    backgroundColor: colors['black'],
                    text: navigation[part][letter],
                  },
                ]}
              />
            </div>
          </Banner>

          <Element className="course">
            <Element flex className="container" relative>
              <ScrollNavigation
                part={part}
                letter={letter}
                currentPartTitle={navigation[part][letter]}
                currentPath={`/osa${part}/${snakeCase(
                  navigation[part][letter]
                )}`}
                colorCode={colorCode}
                className="col-2 spacing"
                style={{ top: this.state.h1Top }}
              />

              <Element
                className="course-content col-6 push-right-3"
                autoBottomMargin
              >
                <p className="col-1 letter" style={{ borderColor: colorCode }}>
                  {letter}
                </p>

                <SubHeader headingLevel="h1" text={navigation[part][letter]} />
              </Element>
            </Element>

            {Parser(html, parserOptions)}
          </Element>

          {false && <ReturnInfo />}

          <EditLink part={part} letter={letter} />

          <PrevNext part={part} letter={letter} />
        </div>

        <Footer />
      </Layout>
    );
  }
}

export const contentPageQuery = graphql`
  query($part: Int!, $letter: String!) {
    markdownRemark(
      frontmatter: { part: { eq: $part }, letter: { eq: $letter } }
    ) {
      html
      frontmatter {
        mainImage {
          publicURL
        }
        part
        letter
      }
    }
  }
`;
