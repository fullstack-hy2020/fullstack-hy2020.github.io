import React from 'react';

const onRenderBody = ({ setHeadComponents }) => {
  const initializeTheme = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('selected_theme');

      if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        document.documentElement.dataset.theme = 'dark';
      }
    } catch (e) {}
  })();
  `;

  setHeadComponents([
    <script
      key="initialize-theme"
      dangerouslySetInnerHTML={{
        __html: initializeTheme,
      }}
    />,
  ]);
};

export default onRenderBody;
