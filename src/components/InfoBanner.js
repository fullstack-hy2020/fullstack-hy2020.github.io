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
        <p style={{ marginBottom: 20}}>
          The testing libraries used in part 5 were changed 3rd March 2024. In frontend Vite replaced Jest. For End to end-tests Playwright is the new preferred library.
        </p>  
        <p>
          If you have started with Jest or Cypress, you may continue. The relevant material is still available, for Jest, the link is at the top of part 5c and for the Cypress, the link is at the menu at the left.
        </p>
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
