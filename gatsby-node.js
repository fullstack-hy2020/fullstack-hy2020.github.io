const path = require('path');
const titles = require('./src/content/partnavigation/partnavigation');
const snakeCase = require('lodash/fp/snakeCase');

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

      createPage({
        path: frontmatter.letter
          ? `/osa${part}/${snakeCase(titles[part][frontmatter.letter])}`
          : `/osa${part}`,
        component: frontmatter.letter ? contentTemplate : partIntroTemplate,
        context: {
          part: part,
          letter: frontmatter.letter,
        },
      });
    });
  });
};
