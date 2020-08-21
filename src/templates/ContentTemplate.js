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
      h1Title: '',
      otherTitles: '',
      showArrowUp: false,
    };
  }

  componentDidMount() {
    const links = Array.from(document.querySelectorAll('a'));
    const images = Array.from(document.querySelectorAll('.gatsby-resp-image-image'));
    const h1 = document.querySelector('h1');
    const h3 = document.querySelectorAll('h3');
    const h3Arr = Array.from(h3).map(t => t.innerText);

    const { frontmatter } = this.props.data.markdownRemark;
    const colorCode = colors[partColors[frontmatter.part]];

    images.map(i => {
      i.style.borderColor = colorCode;
    }); 

    links.map(i => {
      i.style.borderColor = colorCode;
      i.classList.contains('language-switcher__language')
        ? (i.target = i.target)
        : (i.target = '_blank');

      function over() {
        i.style.backgroundColor = colorCode;
      }
      function out() {
        i.style.backgroundColor = 'transparent';
      }

      i.onmouseover = over;
      i.onmouseleave = out;

      return null;
    });

    this.setState({
      h1Title: h1.innerText,
      otherTitles: [...h3Arr],
    });

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 300 && !this.state.showArrowUp) {
      this.setState({
        showArrowUp: true
      });
    } else if (window.scrollY <= 300 && this.state.showArrowUp) {
      this.setState({
        showArrowUp: false
      });
    }
  };

  render() {
    const { markdownRemark } = this.props.data;
    const { frontmatter, html } = markdownRemark;
    const { mainImage, letter, part, lang } = frontmatter;
    const colorCode = colors[partColors[part]];

    const parserOptions = {
      replace: ({ type, name, attribs, children }) => {
        if (type === 'tag' && name === 'pre') {
          return <pre>{domToReact(children, parserOptions)}</pre>;
        } else if (type === 'tag' && attribs.class === 'content') {
          return (
            <Element className="course-content">
              <Element className="course-content-inner">
                {domToReact(children, parserOptions)}
              </Element>
            </Element>
          );
        } else if (type === 'tag' && attribs.class === 'tasks') {
          return (
            <Banner
              style={{
                backgroundColor: colorCode
              }}
              className="spacing tasks content-banner"
            >
              <Element
                className="course-content"
                style={{
                  borderColor: colorCode,
                  backgroundColor: 'transparent',
                }}
              >
                <Element className="course-content-inner">
                  {children.name === 'pre' ? (
                    <pre>{domToReact(children, parserOptions)}</pre>
                  ) : (
                    domToReact(children, parserOptions)
                  )}
                </Element>
              </Element>
            </Banner>
          );
        }
        return;
      },
    };

    return (
      <Layout>
        <SEO
          lang={lang}
          title={`Fullstack ${lang === 'en' ? 'part' :lang === 'zh' ? 'part' :'osa'}${part} | ${
            this.state.h1Title
          }`}
          description={mainSEOdescription[lang]}
          keywords={[
            ...mainSEOtags,
            this.state.h1Title,
            ...this.state.otherTitles,
          ]}
        />

        {this.state.showArrowUp && (
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
                    link: `/${lang === 'en' ? 'en/' :lang === 'zh' ? 'zh/' : ''}#course-contents`,
                  },
                  {
                    backgroundColor: colorCode,
                    text: `${lang === 'en' ? 'part' : lang === 'zh' ? 'part' :'osa'} ${part}`,
                    link: lang === 'en' ? `/en/part${part}` :lang === 'zh' ? `/zh/part${part}` : `/osa${part}`,
                  },
                  {
                    backgroundColor: colors['black'],
                    text: navigation[lang][part][letter],
                  },
                ]}
              />
            </div>
          </Banner>

          <Element className="course">
            <ScrollNavigation
              part={part}
              letter={letter}
              lang={lang}
              currentPartTitle={navigation[lang][part][letter]}
              currentPath={`/${
                lang === 'en' ? 'en/part' : lang === 'zh' ? 'zh/part':'osa'
              }${part}/${snakeCase(navigation[lang][part][letter])}`}
              colorCode={colorCode}
            />

            <Element className="course-content-container">
              <Element
                className="course-content"
                autoBottomMargin
              >
                <Element className="course-content-inner">
                  <p className="col-1 letter" style={{ borderColor: colorCode }}>
                    {letter}
                  </p>

                  <SubHeader
                    headingLevel="h1"
                    text={navigation[lang][part][letter]}
                  />
                </Element>
              </Element>

              {Parser(html, parserOptions)}

            </Element>
          </Element>

          <EditLink part={part} letter={letter} lang={lang} />

          <PrevNext part={part} letter={letter} lang={lang} />
        </div>

        <Footer lang={lang} />
      </Layout>
    );
  }
}

export const contentPageQuery = graphql`
  query($part: Int!, $letter: String!, $lang: String!) {
    markdownRemark(
      frontmatter: {
        part: { eq: $part }
        letter: { eq: $letter }
        lang: { eq: $lang }
      }
    ) {
      html
      frontmatter {
        mainImage {
          publicURL
        }
        part
        letter
        lang
      }
    }
  }
`;
