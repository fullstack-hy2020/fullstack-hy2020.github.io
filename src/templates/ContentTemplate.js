import './ContentTemplate.scss';

import path from 'path';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import React, { Component } from 'react';

import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import EditLink from '../components/EditLink/EditLink';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import Layout from '../components/layout';
import PrevNext from '../components/PrevNext/PrevNext';
import ReturnInfo from '../components/ReturnInfo/ReturnInfo';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import { SubHeader } from '../components/SubHeader/SubHeader';
import ArrowToTop from '../images/up-arrow.svg';

export default class ContentTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      h1Top: 0,
      top: 0,
    };
  }

  componentDidMount() {
    const links = Array.from(document.querySelectorAll('a'));
    const h1 = document.querySelector('h1');

    const { frontmatter } = this.props.data.markdownRemark;

    links.map(i => {
      return (i.style = `border-color: ${colors[frontmatter.partColor]}`);
    });

    this.setState({
      h1Top: h1.offsetTop,
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
    const { mainImage, title, subTitle, letter, part, partColor } = frontmatter;
    const colorCode = colors[partColor];

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
                  style={{ borderColor: colorCode }}
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

        <div className="course-container spacing--small spacing--after">
          <Banner
            backgroundColor={colorCode}
            className="spacing--after"
            style={{
              backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
              backgroundPosition: 'center left',
              backgroundSize: '80%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: colorCode,
            }}
          >
            <div className="container">
              <Arrow
                content={[
                  {
                    backgroundColor: colorCode,
                    text: 'Fullstack',
                    link: '/about',
                  },
                  {
                    backgroundColor: colorCode,
                    text: title,
                    link: `/osa${part}`,
                  },
                  {
                    backgroundColor: colors['black'],
                    text: subTitle,
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
                currentPartTitle={subTitle}
                currentPath={frontmatter.path}
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

                <SubHeader
                  headingLevel="h1"
                  text={subTitle}
                  style={{ fontSize: '3rem' }}
                />
              </Element>
            </Element>

            {Parser(html, parserOptions)}
          </Element>

          <ReturnInfo />

          <EditLink part={part} letter={letter} />

          <PrevNext prev={part - 1} next={part + 1} />
        </div>

        <Footer />
      </Layout>
    );
  }
}

export const contentPageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        subTitle
        path
        mainImage {
          publicURL
        }
        partColor
        part
        letter
      }
    }
  }
`;
