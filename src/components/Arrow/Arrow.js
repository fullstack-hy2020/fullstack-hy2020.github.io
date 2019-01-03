import './Arrow.scss';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import Element from '../Element/Element';

const Arrow = ({
  className,
  content,
  stack,
  bold,
  thickBorder,
  upperCase,
  ...props
}) => {
  return !stack ? (
    <div className="col-10 spacing spacing--after">
      <div className="arrow__container arrows--horizontal">
        {content.map((arrow, i) => {
          const arrowStyle = {
            backgroundColor: arrow.backgroundColor
              ? arrow.backgroundColor
              : 'transparent',
            color: arrow.backgroundColor === 'black' ? 'white' : 'black',
          };

          return (
            <div
              key={`arrow${i}`}
              className={`arrow__wrapper ${className}`}
              {...props}
            >
              <div
                className={`arrow__rectangle ${bold ? 'bold' : ''} ${
                  thickBorder ? 'arrow__rectangle--thick-border' : ''
                }`}
                style={arrowStyle}
              >
                {upperCase ? arrow.text.toUpperCase() : arrow.text}
              </div>
              <div
                className={`arrow__point ${
                  thickBorder ? 'arrow__point--thick-border' : ''
                }`}
                style={arrowStyle}
              />
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="col-10 spacing--after">
      <div
        className="arrow__container"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {content.map(arrow => {
          const arrowStyle = {
            backgroundColor: arrow.backgroundColor
              ? arrow.backgroundColor
              : 'transparent',
            color: arrow.backgroundColor === 'black' ? 'white' : 'black',
          };

          return (
            <Link
              key={arrow}
              to={arrow.path}
              className={`arrow__wrapper--stacked ${className}`}
              {...props}
            >
              <Element flex className="arrow__rectangle" style={arrowStyle}>
                <p className="arrow--stacked-letter">{arrow.letter}</p>

                <p className="arrow--stacked-title">{arrow.text}</p>
              </Element>
              <div className="arrow__point" style={arrowStyle} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

Arrow.propTypes = {
  className: PropTypes.string,
  content: PropTypes.array.isRequired,
  stack: PropTypes.bool,
  upperCase: PropTypes.bool,
  bold: PropTypes.bool,
  thickBorder: PropTypes.bool,
};

Arrow.defaultProps = {
  className: '',
};

export default Arrow;
