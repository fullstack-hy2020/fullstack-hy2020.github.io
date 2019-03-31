import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';

const parts = Object.keys(navigation);

export const PartBanner = () => {
  return (
    <Banner
      className="spacing spacing--after-small spacing--after-mobile offset"
      id="course-contents"
    >
      <div className="container spacing flex-fix-aligning col-7--mobile">
        {parts.map(part => {
          const partNames = [
            'Web-sovellusten toiminnan perusteet',
            'Reactin perusteet',
            'Palvelimen kanssa tapahtuva kommunikointi',
            'Palvelimen ohjelmointi NodeJS:n Express-kirjastolla',
            'Express-sovellusten testaaminen, käyttäjänhallinta',
            'React-sovelluksen testaaminen, custom hookit',
            'Sovelluksen tilan hallinta Redux-kirjastolla',
            'React router, tyylikirjastot ja webpack',
            'GraphQL'
          ];

          return (
            <ContentLiftup
              key={partNames[part]}
              className="col-3 col-10--mobile col-4--tablet"
              image={{
                src: require(`../../images/thumbnails/part-${part}.svg`),
                alt: partNames[part],
              }}
              hoverImageSrc={require(`../../images/thumbnails/part-${part}_ovr.svg`)}
              name={`Osa ${part}`}
              summary={partNames[part]}
              path={`/osa${part}`}
            />
          );
        })}
      </div>
    </Banner>
  );
};
