import './BodyText.scss';

import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import React from 'react';

export const BodyText = ({
  text,
  className,
  heading,
  headingFontSize,
  bold,
  centered,
  noPadding,
  headingFont,
  ...props
}) => {
  const classes = [];

  centered && classes.push('centered');
  bold && classes.push('bold');
  noPadding && classes.push('body-text--no-padding');
  headingFont && classes.push('heading-font');

  const getHeading = () => {
    if (heading) {
      const Heading = heading.level;
      return (
        <Heading
          className="body-text__title"
          style={headingFontSize ? { fontSize: headingFontSize } : {}}
        >
          {heading.title}
        </Heading>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={`body-text ${className}`} {...props}>
      {heading.title && getHeading()}
      {text && typeof text === 'string' ? (
        <p className={`body-text__content ${classes.join(' ')}`}>{text}</p>
      ) : (
        text &&
        text.map(p => (
          <div key={p} className={`body-text__content ${classes.join(' ')}`}>
            {Parser(p)}
          </div>
        ))
      )}
    </div>
  );
};

BodyText.defaultProps = {
  heading: { title: '', level: 'h2' },
  text: '',
  className: '',
  centered: false,
  bold: false,
  noPadding: false,
};

BodyText.propTypes = {
  heading: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.string,
  }),
  headingFontSize: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  centered: PropTypes.bool,
  bold: PropTypes.bool,
  noPadding: PropTypes.bool,
};
