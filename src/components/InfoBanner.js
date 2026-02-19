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
    backgroundColor: 'var(--color-background)',
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
            Material of Part 13 has been moved to <a style={linkStyle} href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases">https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases</a>
          </div>
          <div style={{ marginBottom: 10 }}>
            The content and exercises are still same, there is a change how exercises are submitted.
          </div>
          <div>
            The old content is still found <a style={linkStyle} href="https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/tree/7599b17c02b056fcad4f12d8708f0e07980b7564/src/content/13">here</a>. 
          </div>
        </div>
      </div>
      <div style={buttonDiv}>
        <button style={buttonStyle} onClick={onHide}>
          x
        </button>
      </div>
    </div>
  );
};

export default InfoBanner;
