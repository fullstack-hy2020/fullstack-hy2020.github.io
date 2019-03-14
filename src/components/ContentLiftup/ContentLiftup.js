import './ContentLiftup.scss';

import { Image } from '../Image/Image';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import { TripleBorder } from '../TripleBorder/TripleBorder';
import colors from '../../colors';

const setSrcToChildrenImage = (event, src) => {
  event.currentTarget.firstElementChild.firstElementChild.firstElementChild.src = src;

  return;
};

export const ContentLiftup = ({
  image,
  hoverImageSrc,
  background = 'main',
  name,
  summary,
  path,
  companyPath,
  small,
  className,
}) => {
  const classes = [];

  small && classes.push('content-liftup--small');

  return path ? (
    <div className={`content-liftup ${className} ${classes.join(' ')}`}>
      <TripleBorder largeMargin>
        <Link
          to={path}
          onMouseOver={e => {
            setSrcToChildrenImage(e, hoverImageSrc ? hoverImageSrc : image.src);
          }}
          onMouseOut={e => {
            setSrcToChildrenImage(e, image.src);
          }}
        >
          <Image
            {...image}
            className="content-liftup__image image--square-big"
            overlay={colors[background]}
          />
        </Link>
      </TripleBorder>

      <p className="content-liftup__name">{name}</p>

      <p className="content-liftup__summary">{summary}</p>
    </div>
  ) : (
    <>
      {companyPath ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={companyPath}
          className={`content-liftup ${className} ${classes.join(
            ' '
          )} no-hover`}
        >
          <Image
            {...image}
            contain
            squareBig
            className="content-liftup__image"
          />

          {name && <p className="content-liftup__name">{name}</p>}

          {summary && <p className="content-liftup__summary">{summary}</p>}
        </a>
      ) : (
        <div
          className={`content-liftup ${className} ${classes.join(
            ' '
          )} no-hover`}
        >
          <Image
            {...image}
            contain
            className="content-liftup__image image--square-big"
          />

          {name && <p className="content-liftup__name">{name}</p>}

          {summary && <p className="content-liftup__summary">{summary}</p>}
        </div>
      )}
    </>
  );
};

ContentLiftup.defaultProps = {
  className: '',
  published: '',
  path: '',
  companyPath: '',
};

ContentLiftup.propTypes = {
  className: PropTypes.string,
  image: PropTypes.shape({
    alt: PropTypes.string.isRequired,
    src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }),
  hoverImageSrc: PropTypes.string,
  name: PropTypes.string,
  summary: PropTypes.string,
  path: PropTypes.string,
  companyPath: PropTypes.string,
  small: PropTypes.bool,
};
