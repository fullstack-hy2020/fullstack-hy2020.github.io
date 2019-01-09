import './Accordion.scss';

import { Link } from 'gatsby';
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

  componentDidMount() {
    this.props.initiallyOpened && this.setState({ isOpened: true });
  }

  render() {
    const {
      title,
      content,
      className,
      containerClassName,
      list,
      titleStyle,
    } = this.props;
    const { isOpened } = this.state;

    return (
      <div
        className={`accordion__container col-8 push-right-1 ${containerClassName}`}
      >
        <button
          className={`accordion accordion__title ${
            isOpened ? 'active' : ''
          } ${className}`}
          style={titleStyle}
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
          {content && (
            <BodyText className="col-8 push-right-1" text={content} />
          )}
          {list && (
            <ul>
              {list.map(l => (
                <li key={l.text}>
                  <Link to={l.href}>{l.text}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  list: PropTypes.array,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  initiallyOpened: PropTypes.bool,
  titleStyle: PropTypes.object,
};

Accordion.defaultProps = {
  className: '',
  containerClassName: '',
  initiallyOpened: false,
  titleStyle: {},
};

export default Accordion;
