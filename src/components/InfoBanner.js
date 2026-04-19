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
            Material of Part 9 has been moved to <a style={linkStyle} 
                href="https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript"
              >
                https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-typescript
              </a>
          </div>
          <div style={{ marginBottom: 10 }}>
            There are some notable changes in the content. If you have already started this part, and advanced beyond the first exercises, you may continue following the old material, it shall remain here until 1st May 2026.
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
