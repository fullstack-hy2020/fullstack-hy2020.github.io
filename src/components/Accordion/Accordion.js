import './Accordion.scss';

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { BodyText } from '../BodyText/BodyText';

class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };
  }
  render() {
    const { title, content, className } = this.props;
    const { isOpened } = this.state;

    return (
      <div className="accordion__container col-8 push-right-1">
        <button
          className={`accordion accordion__title ${
            isOpened ? 'active' : ''
          } ${className}`}
          onClick={() => this.setState({ isOpened: !isOpened })}
        >
          {title}
        </button>
        <div
          className="panel"
          style={{
            padding: `${isOpened ? '2rem 18px' : ''}`,
            maxHeight: `${!isOpened ? 0 : 'unset'}`,
            transition: 'max-height 0.2s ease-out',
          }}
        >
          <BodyText text={content} />
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
};

Accordion.defaultProps = {
  className: '',
};

export default Accordion;
