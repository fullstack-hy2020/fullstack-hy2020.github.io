import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';

export const PartBanner = ({ lang }) => {
  const parts = Object.keys(navigation[lang]);

  return (
    <Banner
      className="spacing spacing--after-small spacing--after-mobile offset"
      id="course-contents"
    >
      <div className="container spacing flex-fix-aligning col-7--mobile">
        {parts.map(part => {
          const partNames =
            lang === 'en'
              ? [
                  'Fundamentals of Web apps',
                  'Introduction to React',
                  'Communicating with server',
                  'Programming a server with NodeJS and Express',
                  'Testing Express servers, user administration',
                  'Testing React apps',
                  'State management with Redux',
                  'React router, custom hooks, styling app with CSS and webpack',
                  'GraphQL',
                  'Typescript',
                  'React Native',
                ]
              : lang === 'zh'
              ? [
                  'Web 应用的基础设施',
                  'React 入门',
                  '与服务端通信',
                  '用NodeJS和Express写服务端程序',
                  '测试 Express 服务端程序, 以及用户管理',
                  '测试 React 应用',
                  '利用Redux进行状态管理',
                  'React router、自定义 hook，利用CSS和webpack给app添加样式',
                  'GraphQL',
                  'Typescript',
                  'React Native',
                ]
              : [
                  'Web-sovellusten toiminnan perusteet',
                  'Reactin perusteet',
                  'Palvelimen kanssa tapahtuva kommunikointi',
                  'Palvelimen ohjelmointi NodeJS:n Express-kirjastolla',
                  'Express-sovellusten testaaminen, käyttäjänhallinta',
                  'React-sovelluksen testaaminen',
                  'Sovelluksen tilan hallinta Redux-kirjastolla',
                  'React router, custom-hookit, tyylikirjastot ja webpack',
                  'GraphQL',
                  'Typescript',
                  'React Native',
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
              name={`${
                lang === 'en' ? 'Part' : lang === 'zh' ? 'Part' : 'Osa'
              } ${part}`}
              summary={partNames[part]}
              path={
                lang === 'en'
                  ? `/en/part${part}`
                  : lang === 'zh'
                  ? `/zh/part${part}`
                  : `/osa${part}`
              }
            />
          );
        })}
      </div>
    </Banner>
  );
};
