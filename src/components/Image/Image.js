import './Image.scss';

import PropTypes from 'prop-types';
import React from 'react';

export const Image = ({
  src,
  alt,
  hover,
  className,
  overlay,
  contain,
  circle,
  extraSmall,
  small,
  medium,
  large,
  fullWidth,
  actualSize,
  squareBig,
  ...props
}) => {
  const classes = [];

  contain && classes.push('image--contain');
  fullWidth && classes.push('image--full-width');
  circle && classes.push('image--circle');
  extraSmall && classes.push('image--extra-small');
  small && classes.push('image--small');
  medium && classes.push('image--medium');
  large && classes.push('image--large');
  squareBig && classes.push('image--square-big');
  actualSize && classes.push('image--acctual-size');

  return (
    <div className={`image ${className} ${classes.join(' ')}`} {...props}>
      <div className="image__container">
        <img
          style={{ backgroundColor: overlay, backgroundOpacity: '0.5' }}
          className="image__content"
          src={src}
          alt={alt}
        />
      </div>
    </div>
  );
};

Image.defaultProps = {
  src: '',
  alt: '',
  overlay: '',
  className: '',
};

Image.propTypes = {
  overlay: PropTypes.string,
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  alt: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  hover: PropTypes.string,
  className: PropTypes.string,
  contain: PropTypes.bool,
  circle: PropTypes.bool,
  extraSmall: PropTypes.bool,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  squareBig: PropTypes.bool,
  fullWidth: PropTypes.bool,
  actualSize: PropTypes.bool,
};
