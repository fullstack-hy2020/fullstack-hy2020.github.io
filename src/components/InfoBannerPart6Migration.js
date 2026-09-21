import React from 'react';

const PART_6_NEW_COURSE_URL =
  'https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-state-management';

const InfoBannerPart6Migration = ({ visible, onHide, language }) => {
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
    color: style.color,
    cursor: 'pointer',
  };

  return (
    <aside style={style} role="status" aria-label="Course notice">
      <div style={textStyle}>
        <div style={{ marginBottom: 20 }}>
          <div>
            {language === 'fi' ? (
              <>
                Osan 6 materiaali on siirretty uudelle alustalle, katso{' '}
                <a
                  style={linkStyle}
                  href={PART_6_NEW_COURSE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  uusi materiaali
                </a>{' '}
                täältä.
              </>
            ) : (
              <>
                The material of part 6 has been moved to a new platform, see the{' '}
                <a
                  style={linkStyle}
                  href={PART_6_NEW_COURSE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  new material
                </a>{' '}
                here.
              </>
            )}
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

export default InfoBannerPart6Migration;
