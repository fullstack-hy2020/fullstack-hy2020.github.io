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
      const { part } = frontmatter;

      if (!frontmatter.letter) {
        createPage({
          path: `/osa${part.toString()}`,
          component: partIntroTemplate,
          context: {
            part: part,
          },
        });
      } else if (!isEmpty(navigation[part]) && frontmatter.letter) {
        createPage({
          path: `/osa${part}/${snakeCase(
            navigation[part][frontmatter.letter]
          )}`,
          component: contentTemplate,
          context: {
            part: part,
            letter: frontmatter.letter,
          },
        });
      } else return;
    });
  });
};
