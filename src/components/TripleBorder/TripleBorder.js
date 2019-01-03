import './TripleBorder.scss';

import PropTypes from 'prop-types';
import React from 'react';

export const TripleBorder = ({
  children,
  largeMargin,
  className,
  childrenClassName,
  backgroundColor,
  props,
}) => (
  <div
    className={`triple-border ${className} ${
      largeMargin ? 'triple-border--large-margin' : ''
    }`}
    style={{ padding: largeMargin ? '' : '0.2em' }}
    {...props}
  >
    <div
      className={`triple-border__container ${childrenClassName}`}
      style={{ backgroundColor: backgroundColor }}
    >
      {children}
    </div>
  </div>
);

TripleBorder.defaultProps = {
  className: '',
  childrenClassName: '',
  largeMargin: false,
  backgroundColor: 'transparent',
};

TripleBorder.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  childrenClassName: PropTypes.string,
  largeMargin: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
