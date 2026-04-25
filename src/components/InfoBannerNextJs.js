import React from 'react';

const NEXT_JS_COURSE_URL =
  'https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs';

const InfoBannerNextJs = ({ visible, onHide, language }) => {
  if (!visible) return null;

  const text =
    language === 'fi'
      ? 'Uusi osa ilmestynyt:'
      : 'A new course part has been released:';

  const style = {
    position: 'fixed',
    left: 24,
    right: 24,
    bottom: 20,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 14,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#ffc107',
    backgroundColor: '#fff3cd',
    color: '#5a4000',
    zIndex: 2147483647,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  };

  const textStyle = {
    flex: 1,
    minWidth: 0,
    lineHeight: '1.4em',
  };

  const linkStyle = {
    color: '#5a4000',
    fontWeight: 600,
    textDecoration: 'underline',
    wordBreak: 'break-all',
  };

  const buttonStyle = {
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
  };

  return (
    <div style={style} role="region" aria-label="Next.js course notice">
      <div style={textStyle}>
        {text}{' '}
        <a href={NEXT_JS_COURSE_URL} style={linkStyle}>
          {NEXT_JS_COURSE_URL}
        </a>
      </div>
      <button
        style={buttonStyle}
        onClick={onHide}
        aria-label={language === 'fi' ? 'Sulje ilmoitus' : 'Close notice'}
      >
        x
      </button>
    </div>
  );
};

export default InfoBannerNextJs;