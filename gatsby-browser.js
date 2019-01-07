import { anchorate } from 'anchorate';
require('prismjs/themes/prism-dark.css');

export const onRouteUpdate = () => {
  anchorate({
    scroller: function(element) {
      if (!element) return false;
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    },
  });
};
