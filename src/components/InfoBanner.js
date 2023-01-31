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
    backgroundColor: '#E8E8E8',
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
  };

  return (
    <div style={style}>
      <div stule={textStyle}>
        <p>Part 6 has new content about React Query, useReducer hook and React context.</p>
        <p>The new content replaces the chapter on Redux connect (that still remains online for a while).</p>
        <div style={{ marginTop: 10 }}><i>If you have already completed the part 6, this change has no effect on your progress.</i></div>
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
