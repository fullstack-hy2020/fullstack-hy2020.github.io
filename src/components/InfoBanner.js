import React from 'react';

const InfoBanner = ({ visible, onHide, language }) => {
  if (!visible) return null;

  const SUBMISSION_REPO_URL =
    language === 'fi'
      ? 'https://fullstackopen.com/osa6/flux_arkkitehtuuri_ja_zustand#tehtavarepositorio'
      : 'https://fullstackopen.com/en/part6/flux_architecture_and_zustand#submission-repository';

  const text =
    language === 'fi'
      ? 'Osan 6 tehtävien palautusrepositorion formaatti on muuttunut, katso tarkemmin '
      : 'The format of submission repository in the part 6 has changed, see ';
  const text_after_link =
    language === 'fi'
      ? 'täältä.'
      : 'more information.';
  const text_here =
    language === 'fi'
      ? 'täältä'
      : 'here';
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
            {text} {' '}
            <a 
              style={linkStyle}
              href={SUBMISSION_REPO_URL}
              target="_blank"
              rel="noreferrer">
              {text_here}
            </a>
            {' '}
            {text_after_link}
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
