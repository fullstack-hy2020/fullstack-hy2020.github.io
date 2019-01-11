import './PrevNext.scss';

import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';

import Element from '../Element/Element';

const PrevNext = ({ prev, next }) => {
  const hasPrev = prev >= 0 ? true : false;
  const hasNext = next <= 8 ? true : false;

  return (
    <Element className="container spacing spacing--after-large prev-next__container">
      {hasPrev ? (
        <>
          <Link to={`/osa${prev}`} className="col-4--mobile push-right-1 prev">
            <Element flex dirColumn>
              <p>Osa {prev}</p>

              <b>Edellinen osa</b>
            </Element>
          </Link>

          {hasNext && <div className="col-1--mobile separator" />}
        </>
      ) : (
        <Element className="push-right-1" />
      )}

      {hasNext ? (
        <Link to={`/osa${next}`} className="col-4--mobile push-left-1 next">
          <Element flex dirColumn>
            <p>Osa {next}</p>

            <b>Seuraava osa</b>
          </Element>
        </Link>
      ) : (
        <Element className="push-left-1" />
      )}
    </Element>
  );
};

PrevNext.defaultProps = {
  prev: undefined,
  next: undefined,
};

PrevNext.propTypes = {
  prev: PropTypes.number,
  next: PropTypes.number,
};

export default PrevNext;
