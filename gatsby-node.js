const path = require('path');

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
              title
              subTitle
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
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const pathArr = node.frontmatter.path.split('/');

      createPage({
        path: node.frontmatter.path,
        component: pathArr.length > 2 ? contentTemplate : partIntroTemplate,
        context: {},
      });
    });
  });
};
