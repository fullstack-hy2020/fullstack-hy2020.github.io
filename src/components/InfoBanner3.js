import React from 'react';

const InfoBanner = ({ visible, onHide }) => {
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
    <div style={style}>
      <div style={textStyle}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <b>Changes in part 7 (6th April 2026):</b>
            <ul style={{ marginTop: 6, paddingLeft: 20 }}>
              <li><i>React router, UI libraries and Styled components moved to part 5</i></li>
              <li><i>Webpack replaced with esbuild</i></li>
              <li><i>Error boundaries and keeping the frontend and backend in a single repository covered</i></li>
              <li><i>Some of the hook exercises have changed</i></li>
              <li><i>Some new exercises for the blog list</i></li>
            </ul>
          </div>
          <div>
            The old content is still found <a style={linkStyle} href="https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/tree/7599b17c02b056fcad4f12d8708f0e07980b7564/src/content/7/en">here</a>. 
          </div>
        </div>
      </div>
      <div style={buttonDiv}>
        <button style={buttonStyle} onClick={onHide}>
          <div style={textStyle}>x</div>
        </button>
      </div>
    </div>
  );
};

export default InfoBanner;
