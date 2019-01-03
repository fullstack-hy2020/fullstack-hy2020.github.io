import { Link } from 'gatsby';
import { PropTypes } from 'prop-types';
import React from 'react';

import Element from '../Element/Element';

const PrevNext = ({ prev, next }) => (
  <Element className="container spacing spacing--after-large">
    {prev !== undefined ? (
      <Link to={`/osa${prev}`} className="push-right-1">
        <Element flex dirColumn>
          <p style={{ textAlign: 'right' }}>Osa {prev}</p>

          <b>Edellinen osa</b>
        </Element>
      </Link>
    ) : (
      <Element className="push-right-1" />
    )}

    {next !== undefined ? (
      <Link to={`/osa${next}`} className="push-left-1">
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

PrevNext.defaultProps = {
  prev: undefined,
  next: undefined,
};

PrevNext.propTypes = {
  prev: PropTypes.number,
  next: PropTypes.number,
};

export default PrevNext;
