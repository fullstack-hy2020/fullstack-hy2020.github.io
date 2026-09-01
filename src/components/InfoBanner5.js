import React from 'react';

const InfoBanner5 = ({ visible, onHide }) => {
  if (!visible) return null;

  const style = {
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    marginLeft: 80,
    marginRight: 80,
    position: 'sticky',
    top: 100,
    left: 40,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'space-between',
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    color: '#5a4000',
    zIndex: 2147483647,
  };

  const linkStyle = {
    color: 'grey',
    textDecoration: 'underline',
  };

  const textStyle = {
    flex: 90,
  };

  const buttonDiv = {
    flex: 10,
    textAlign: 'right',
  };

  const buttonStyle = {
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-text)',
    cursor: 'pointer',
  };

  return (
    <aside style={style} role="status" aria-label="Course notice">
      <div style={textStyle}>
        <div style={{ marginBottom: 20 }}>
          <div>
            The format of submission repository in part 7 has changed, see {' '}
            <a
              style={linkStyle}
              href="https://fullstackopen.com/en/part7/more_about_react_hooks#submission-repository"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{' '}
            for more
          </div>
        </div>
      </div>
      <div style={buttonDiv}>
        <button
          style={buttonStyle}
          className="info-banner__close"
          aria-label="Close course notice"
          onClick={onHide}
        >
          <div style={textStyle}>x</div>
        </button>
      </div>
    </aside>
  );
};

export default InfoBanner5;
