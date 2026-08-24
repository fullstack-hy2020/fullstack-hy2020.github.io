import React from 'react';

const InfoBanner = ({ visible, onHide, language }) => {
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
    <aside
     style={style}
     role="status"
     aria-label={language === 'fi' ? 'Kurssi-ilmoitus' : 'Course notice'}
    >
      <div style={textStyle}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            The format of submission repository in the part 6 has changed, see {' '}
            <a
              style={linkStyle}
              href="https://fullstackopen.com/en/part6/flux_architecture_and_zustand#submission-repository"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{' '}
            for more
          </div>

          <div>
            Osan 6 tehtävien palautusrepositorion formaatti on muuttunut, katso tarkemmin {' '}
            <a
              style={linkStyle}
              href="https://fullstackopen.com/osa6/flux_arkkitehtuuri_ja_zustand#tehtavarepositorio"
              target="_blank"
              rel="noreferrer"
            >
              täältä
            </a>
          </div>
        </div>
      </div>
      <div style={buttonDiv}>
        <button
          style={buttonStyle}
          aria-label={language === 'fi' ? 'Sulje kurssi-ilmoitus' : 'Close course notice'}
          onClick={onHide}
        >
          <div style={textStyle}>x</div>
        </button>
      </div>
    </aside>
  );
};

export default InfoBanner;
