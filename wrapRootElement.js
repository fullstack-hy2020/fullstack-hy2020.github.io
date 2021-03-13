import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from './src/i18n';

const wrapRootElement = ({ element }) => (
  <I18nextProvider i18n={i18n}>
    {element}
  </I18nextProvider>
);

export default wrapRootElement;