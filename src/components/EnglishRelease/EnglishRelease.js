import './EnglishRelease.scss';

import PropTypes from 'prop-types';
import React from 'react';

const EnglishRelease = ({ dismissed }) => {
  return (
    <div className="release-message">
      <div>
        <p>
          This course is now available in English.<a href="/en">Click here</a>{' '}
          to change the language.
        </p>
      </div>

      <button
        className="release-message__button"
        onClick={() => dismissed(true)}
      >
        <span>x</span>
      </button>
    </div>
  );
};

EnglishRelease.propTypes = {
  dismissed: PropTypes.func.isRequired,
};

export default EnglishRelease;
