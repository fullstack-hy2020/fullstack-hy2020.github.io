import React from 'react';

import navigation from '../../content/partnavigation/partnavigation';
import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';

const parts = Object.keys(navigation);

export const PartBanner = () => {
  return (
    <Banner className="spacing spacing--after">
      <div
        id="course-contents"
        className="container spacing flex-fix-aligning col-7--mobile"
      >
        {parts.map(part => {
          const partNames = [
            "Web-sovellusten toiminnan perusteet",
            "Reactin perusteet",
            "Palvelimen kanssa tapahtuva kommunikointi",
            "Palvelimen ohjelmointi NodeJS:n Express-kirjastolla",
            "Express-sovellusten testaaminen",
            "React-sovelluksen testaaminen",
            "Sovelluksen tilan hallinta Redux-kirjastolla",
            "Tulevaisuuden trendejä",
          ]

          return (
            <ContentLiftup
              image={{
                src: require(`../../images/thumbnails/part-${part}.svg`),
                alt: '',
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
