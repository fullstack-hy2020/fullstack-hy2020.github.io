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
        <p>
          There are some changes in part 9. The <i>Patientor</i> example app
          structure has been refactored to a less complex form to make it easier
          to concentrate on learning TypeScript.
        </p>
        <div style={{ marginTop: 10 }}>
          If you are just working with the old Patientor, no worries, the old
          material shall stay online for a couple of weeks.
        </div>

        <div style={{ marginTop: 10 }}>
          <i>
            If you have already completed the part 9, this change has absolutely
            no effect on your progress.
          </i>
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
