import './Arrow.scss';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import Element from '../Element/Element';

const Arrow = ({
  className,
  link,
  content,
  stack,
  bold,
  thickBorder,
  upperCase,
  ...props
}) => {
  const arrowContent = (
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
              {arrow.link ? (
                <Link to={arrow.link}>
                  {upperCase ? arrow.text.toUpperCase() : arrow.text}
                </Link>
              ) : upperCase ? (
                arrow.text.toUpperCase()
              ) : (
                arrow.text
              )}
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
  );

  let render;

  if (!stack && !link) {
    render = (
      <div className="col-10 spacing spacing--after">{arrowContent}</div>
    );
  } else if (!stack && link) {
    render = (
      <div className="spacing spacing--after">
        <Link to={link} style={{ display: 'inline-block' }}>
          {arrowContent}
        </Link>
      </div>
    );
  } else if (stack) {
    render = (
      <div className="col-10 spacing--after">
        <div
          className="arrow__container arrow__container--with-link"
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
                key={arrow.text}
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
  }

  return render;
};

Arrow.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
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
