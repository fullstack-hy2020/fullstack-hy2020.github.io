const path = require('path');
const snakeCase = require('lodash/fp/snakeCase');
const isEmpty = require('lodash/fp/isEmpty');
const navigation = require('./src/content/partnavigation/partnavigation');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const contentTemplate = path.resolve(`src/templates/ContentTemplate.js`);
  const partIntroTemplate = path.resolve(`src/templates/PartIntroTemplate.js`);

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
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
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const { frontmatter } = node;
      const { part, lang } = frontmatter;

      if (!frontmatter.letter) {
        createPage({
          path:
            lang === 'en'
              ? `/en/part${part.toString()}`
              : lang === 'zh'
              ? `/zh/part${part.toString()}`
              : `/osa${part.toString()}`,
          component: partIntroTemplate,
          context: {
            part: part,
            lang: lang,
          },
        });
      } else if (!isEmpty(navigation[lang][part]) && frontmatter.letter) {
        createPage({
          path:
            lang === 'en'
              ? `/en/part${part}/${snakeCase(
                  navigation[lang][part][frontmatter.letter]
                )}`
              : lang === 'zh'
              ? `/zh/part${part}/${snakeCase(
                  navigation[lang][part][frontmatter.letter]
                )}`
              : `/osa${part}/${snakeCase(
                  navigation[lang][part][frontmatter.letter]
                )}`,
          component: contentTemplate,
          context: {
            part: part,
            letter: frontmatter.letter,
            lang: lang,
          },
        });
      } else return;
    });
  });
};
