const IS_DEV = process.env.NODE_ENV === 'development';

const createSearchConfig = (indexName, language) => {
  return {
    resolve: 'gatsby-plugin-local-search',
    options: {
      name: indexName,
      engine: 'flexsearch',
      engineOptions: 'speed',
      query: `
        {
          allMarkdownRemark(filter: {frontmatter: {lang: {eq: "${language}"}}}) {
            nodes {
              frontmatter {
                lang
                letter
                part
              }
              id      
              rawMarkdownBody
            }
          }
        }
    `,
      ref: 'id',
      index: ['body'],
      store: ['id', 'part', 'letter', 'lang'],
      normalizer: ({ data }) => {
        return IS_DEV
          ? []
          : data.allMarkdownRemark.nodes.map(node => ({
              id: node.id,
              part: node.frontmatter.part,
              letter: node.frontmatter.letter,
              lang: node.frontmatter.lang,
              body: node.rawMarkdownBody,
            }));
      },
    },
  };
};

const plugins = [
  createSearchConfig('finnish', 'fi'),
  createSearchConfig('english', 'en'),
  createSearchConfig('chinese', 'zh'),
  {
    resolve: `gatsby-plugin-sitemap`,
  },
  {
    resolve: 'gatsby-plugin-i18n',
    options: {
      langKeyDefault: 'fi',
      langKeyForNull: 'fi',
      prefixDefault: false,
      useLangKeyLayout: false,
    },
  },
  'gatsby-plugin-react-helmet',
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: 'gatsby-starter-default',
      short_name: 'starter',
      start_url: '/',
      background_color: '#e1e1e1',
      theme_color: '#e1e1e1',
      display: 'minimal-ui',
      icon: 'src/images/favicon.png',
    },
  },
  'gatsby-plugin-remove-serviceworker',
  'gatsby-plugin-sass',
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `src`,
      path: `${__dirname}/src/content/`,
      ignore: [`${__dirname}/src/content/pages/*`],
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/src/content`,
      name: 'markdown-pages',
      ignore: [`${__dirname}/src/content/pages/*`],
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-unwrap-images',
        'gatsby-remark-picture',
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: 'language-',
            inlineCodeMarker: null,
            aliases: {},
            showLineNumbers: false,
            noInlineHighlight: false,
          },
        },
      ],
    },
  },
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: 'UA-135975842-1',
      head: false,
      respectDNT: true,
      exclude: [],
      cookieDomain: 'fullstackopen.com',
    },
  },
  {
    resolve: `gatsby-plugin-canonical-urls`,
    options: {
      siteUrl: `https://fullstackopen.com`,
    },
  },
];

module.exports = {
  siteMetadata: {
    title: 'Full Stack open 2020',
    description: '',
    author: 'Houston Inc. Consulting oy',
    siteUrl: 'https://fullstack-hy2020.github.io/',
  },
  plugins,
};
