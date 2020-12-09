import { StaticQuery, graphql } from 'gatsby';

import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import defaultImage from '../images/seo_image.jpg';
import englishVersionSeoImage from '../images/EYE_green_wide.jpg';
import path from 'path';

function SEO({ description, lang, meta, image, keywords, title }) {
  const seoImage =
    image || lang === 'en'
      ? englishVersionSeoImage
      : lang === 'zh'
      ? englishVersionSeoImage
      : defaultImage;

  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description;

        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={title}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'og:title',
                content: title,
              },
              {
                property: 'og:description',
                content: metaDescription,
              },
              {
                name: 'og:image',
                content: path.resolve(seoImage),
              },
              {
                property: 'og:type',
                content: 'website',
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
              },
              {
                name: 'twitter:title',
                content: title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
              {
                name: 'twitter:image',
                content: path.resolve(seoImage),
              },
              {
                name: 'google-site-verification',
                content: 'ds9pQKiK3kjhRSHHbf5ccoG-oJggn7Lq4A8uHxM3Mkw',
              },
            ]
              .concat(
                keywords.length > 0
                  ? {
                      name: 'keywords',
                      content: keywords.join(', '),
                    }
                  : []
              )
              .concat(meta)}
          />
        );
      }}
    />
  );
}

SEO.defaultProps = {
  lang: 'fi',
  image: null,
  meta: [],
  keywords: [],
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  image: PropTypes.string,
  keywords: PropTypes.array,
  title: PropTypes.string.isRequired,
};

export default SEO;

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;
