const remark = require('remark');
const stringify = require('remark-stringify');
const visit = require('unist-util-visit');
const navigation = require('./src/content/partnavigation/partnavigation');
const isEmpty = require('lodash/fp/isEmpty');
const snakeCase = require('lodash/fp/snakeCase');
const { kebabCase } = require('lodash');

module.exports = { transformMarkdown };

/*
Transform each raw markdown node into a markdown AST. Traverse the AST
pulling out headings and subsequent text, adding them as key-value pairs to a Map object.
Return the Map as an array.

Note that the 'gatsby-plugin-local-search' plugin expects its normalizer function to return a flat array.
Since this function returns an array which is in turned mapped, the overall result needs to be flattened.
*/

function pagePath(lang, part, letter) {
  if (!isEmpty(navigation[lang][part]) && letter) {
    return snakeCase(navigation[lang][part][letter]);
  }
}

async function transformMarkdown({ lang, part, letter }, id, node) {
  // content = new Map< string, string > ; {'some-unique-heading-key': 'all text content here' }
  const content = new Map();

  const transform = options => tree => {
    // the current heading-key string
    let current = null;

    visit(tree, node => {
      if (node.type === 'heading' && node.depth < 4) {
        // check if heading has a title
        if (node.children && node.children[0].type === 'text') {
          let path = pagePath(lang, part, letter);
          let heading = kebabCase(node.children[0].value);

          // set the current heading
          current = `${path}#${heading} ${id}`;
        }
      } else if (node.type === 'paragraph' && current) {
        if (!content.has(current)) {
          // no text has been stored so far; create a key value pair of the heading and an empty string
          content.set(current, '');
        } else {
          // a heading-key exists; obtain its text content and add to it
          let textContent = content.get(current);

          if ('children' in node) {
            let { children } = node;

            children.forEach(childNode =>
              childNode.type === 'link'
                ? (textContent += childNode.children[0].value)
                : (textContent += childNode.value)
            );
          }

          content.set(current, textContent);
        }
      }
    });

    // delete empty entries from the Map object
    content.delete();

    // delete entries that have a key but no text content
    for (let [k, v] of content.entries()) {
      if (!v) content.delete(k);
    }
  };

  await remark()
    .use(transform)
    .use(stringify)
    .process(node);

  return Array.from(content).map(([key, value]) =>
    ({
      id: key,
      part,
      letter,
      lang,
      text: value,
    })
  );
}
