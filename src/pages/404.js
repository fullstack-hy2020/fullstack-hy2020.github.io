import React, { Component } from 'react';

import Arrow from '../components/Arrow/Arrow';
import Element from '../components/Element/Element';
import Layout from '../components/layout';
import SEO from '../components/seo';
import colors from '../colors';
import getTranslationPath from '../utils/getPartTranslationPath';

class NotFoundPage extends Component {
  state = {
    siteLanguage: 'fi',
  };

  componentDidMount() {
    const siteLanguage =
      window.location.pathname.indexOf('/en') > -1
        ? 'en'
        : window.location.pathname.indexOf('/zh') > -1
        ? 'zh'
        : window.location.pathname.indexOf('/fr') > -1
        ? 'fr'
        : window.location.pathname.indexOf('/it') > -1
        ? 'it'        
        : 'fi';

    this.setState({ siteLanguage });
  }

  render() {
    const title =
      this.state.siteLanguage === 'en' ? 'Page not found' 
      : this.state.siteLanguage === 'fr' ? 'Page non trouvée'
      : this.state.siteLanguage === 'it' ? 'Pagina non trovata'
      : 'Sivua ei löytynyt';

    return (
      <Layout>
        <SEO
          title={`${title} | Full stack open`}
          lang={this.state.siteLanguage}
        />

        <Element className="container spacing--large spacing--after">
          <h1>404 - {title}</h1>

          <p className="col-10 spacing--small spacing--after">
            Uncaught ReferenceError: unknown is not defined
          </p>

          <Arrow
            className="col-10 arrow__container--with-link"
            bold
            thickBorder
            link={getTranslationPath(this.state.siteLanguage, '/')}
            content={[
              { backgroundColor: colors['main'], text: 'Go back home' },
            ]}
          />
        </Element>
      </Layout>
    );
  }
}

export default NotFoundPage;
