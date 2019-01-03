import './Banner.scss';

import PropTypes from 'prop-types';
import React from 'react';

export const Banner = ({ className, backgroundColor, ...props }) => {
  const background = backgroundColor
    ? { backgroundColor: backgroundColor }
    : null;

  return (
    <div className={`banner ${className}`} style={background} {...props} />
  );
};

Banner.defaultProps = {
  className: '',
};

Banner.propTypes = {
  className: PropTypes.string,
};
