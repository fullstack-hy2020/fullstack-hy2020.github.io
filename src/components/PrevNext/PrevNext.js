import './PrevNext.scss';

import Element from '../Element/Element';
import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';
import snakeCase from 'lodash/fp/snakeCase';

const navArray = Object.keys(navigation);

const prevChar = c => String.fromCharCode(c.charCodeAt(0) - 1);
const nextChar = c => String.fromCharCode(c.charCodeAt(0) + 1);
const hasPart = part => navArray.includes(part.toString());
const nextLetterExists = (letter, part) => nextChar(letter) in navigation[part];
const hasNext = (letter, part) => {
  return (
    (!letter && hasPart(part + 1)) || (letter && nextLetterExists(letter, part))
  );
};

const PrevNext = ({ part, letter }) => {
  const getPrev = () => {
    if (!letter && hasPart(part - 1)) {
      return (
        <>
          <Link
            to={`/osa${part - 1}`}
            className="col-4--mobile push-right-1 prev"
          >
            <Element flex dirColumn>
              <p>Osa {part - 1}</p>

              <b>Edellinen osa</b>
            </Element>
          </Link>

          {hasNext(letter, part) && <div className="col-1--mobile separator" />}
        </>
      );
    } else if (letter) {
      if (letter !== 'a') {
        return (
          <>
            <Link
              to={`/osa${part}/${snakeCase(
                navigation[part][prevChar(letter)]
              )}`}
              className="col-4--mobile push-right-1 prev"
            >
              <Element flex dirColumn>
                <p>Osa {`${part}${prevChar(letter)}`}</p>

                <b>Edellinen osa</b>
              </Element>
            </Link>

            {hasNext(letter, part) && (
              <div className="col-1--mobile separator" />
            )}
          </>
        );
      } else if (hasPart(part - 1)) {
        return (
          <>
            <Link
              to={`/osa${part - 1}`}
              className="col-4--mobile push-right-1 prev"
            >
              <Element flex dirColumn>
                <p>Osa {part - 1}</p>

                <b>Edellinen osa</b>
              </Element>
            </Link>

            {hasNext(letter, part) && (
              <div className="col-1--mobile separator" />
            )}
          </>
        );
      } else {
        return <Element className="push-right-1" />;
      }
    } else {
      return <Element className="push-right-1" />;
    }
  };

  const getNext = () => {
    if (!letter && hasPart(part + 1)) {
      return (
        <Link to={`/osa${part + 1}`} className="col-4--mobile push-left-1 next">
          <Element flex dirColumn>
            <p>Osa {part + 1}</p>

            <b>Seuraava osa</b>
          </Element>
        </Link>
      );
    } else if (letter) {
      if (nextLetterExists(letter, part)) {
        return (
          <Link
            to={`/osa${part}/${snakeCase(navigation[part][nextChar(letter)])}`}
            className="col-4--mobile push-left-1 next"
          >
            <Element flex dirColumn>
              <p>Osa {`${part}${nextChar(letter)}`}</p>

              <b>Seuraava osa</b>
            </Element>
          </Link>
        );
      } else if (hasPart(part + 1)) {
        return (
          <Link
            to={`/osa${part + 1}`}
            className="col-4--mobile push-left-1 next"
          >
            <Element flex dirColumn>
              <p>Osa {part + 1}</p>

              <b>Seuraava osa</b>
            </Element>
          </Link>
        );
      } else {
        return <Element className="push-left-1" />;
      }
    } else {
      return <Element className="push-left-1" />;
    }
  };

  return (
    <Element className="container spacing spacing--after-large prev-next__container">
      {getPrev()}

      {getNext()}
    </Element>
  );
};

PrevNext.defaultProps = {
  part: undefined,
  letter: undefined,
};

PrevNext.propTypes = {
  part: PropTypes.number,
  letter: PropTypes.string,
};

export default PrevNext;
