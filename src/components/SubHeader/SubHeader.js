import './SubHeader.scss';

import PropTypes from 'prop-types';
import React from 'react';

export const SubHeader = ({
  className,
  headingLevel = 'h2',
  headingFontSize,
  text,
  ...props
}) => {
  const Heading = headingLevel;

  return (
    <Heading
      className={`sub-header ${className}`}
      style={headingFontSize ? { fontSize: headingFontSize } : {}}
      {...props}
    >
      {text}
    </Heading>
  );
};

SubHeader.propTypes = {
  className: PropTypes.string,
  headingLevel: PropTypes.string,
  text: PropTypes.string.isRequired,
  headingFontSize: PropTypes.string,
};

SubHeader.defaultProps = {
  className: '',
};
