import './BodyText.scss';

import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import PropTypes from 'prop-types';
import React from 'react';

import githubLogo from '../../images/GitHub-Mark-32px.png';
import Element from '../Element/Element';

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

  const parserOptions = {
    replace: ({ type, attribs, children }) => {
      if (type === 'tag' && attribs.class === 'github-logo') {
        return (
          <Element flex autoBottomMargin className="github-logo__container">
            <img
              style={{
                maxWidth: '1rem',
                maxHeight: '1rem',
                margin: 'auto 0',
              }}
              alt="github-logo"
              src={githubLogo}
            />

            <p style={{ marginLeft: '0.611rem' }}>
              {domToReact(children, parserOptions)}
            </p>
          </Element>
        );
      }
    },
  };

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
            {Parser(p, parserOptions)}
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
