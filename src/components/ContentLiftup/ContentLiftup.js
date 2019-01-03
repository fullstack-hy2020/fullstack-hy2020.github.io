import './ContentLiftup.scss';

import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';

import colors from '../../colors';
import { Image } from '../Image/Image';
import { TripleBorder } from '../TripleBorder/TripleBorder';

const setSrcToChildrenImage = (event, src) => {
  event.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.src = src;

  return;
};

export const ContentLiftup = ({
  image,
  hoverImageSrc,
  background = 'main',
  name,
  summary,
  path,
  small,
  className,
}) => {
  const classes = [];

  small && classes.push('content-liftup--small');

  return path ? (
    <div
      onMouseOver={e => {
        setSrcToChildrenImage(e, hoverImageSrc ? hoverImageSrc : image.src);
      }}
      onMouseOut={e => {
        setSrcToChildrenImage(e, image.src);
      }}
      className={`content-liftup col-3 ${className} ${classes.join(' ')}`}
    >
      <TripleBorder largeMargin>
        <Link to={path}>
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
    <div
      className={`content-liftup ${className} ${classes.join(' ')} no-hover`}
    >
      <Image
        {...image}
        contain
        className="content-liftup__image image--square-big"
      />

      {name && <p className="content-liftup__name">{name}</p>}

      {summary && <p className="content-liftup__summary">{summary}</p>}
    </div>
  );
};

ContentLiftup.defaultProps = {
  className: '',
  published: '',
  path: '',
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
  small: PropTypes.bool,
};
