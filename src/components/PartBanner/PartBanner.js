import translationProgress from '../../utils/translationProgress';
import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';
import getPartTranslationPath from '../../utils/getPartTranslationPath';

const partNameTranslations = {
  fi: [
    'Web-sovellusten toiminnan perusteet',
    'Reactin perusteet',
    'Palvelimen kanssa tapahtuva kommunikointi',
    'Palvelimen ohjelmointi NodeJS:n Express-kirjastolla',
    'Express-sovellusten testaaminen, käyttäjänhallinta',
    'React-sovelluksen testaaminen',
    'Edistynyt tilan hallinta',
    'React router, custom-hookit, tyylikirjastot ja webpack',
    'GraphQL',
    'TypeScript',
    'React Native',
    'CI/CD',
    'Konttiteknologia',
    'Relaatiotietokannan käyttö',
  ],
  en: [
    'Fundamentals of Web apps',
    'Introduction to React',
    'Communicating with server',
    'Programming a server with NodeJS and Express',
    'Testing Express servers, user administration',
    'Testing React apps',
    'Advanced state management',
    'React router, custom hooks, styling app with CSS and webpack',
    'GraphQL',
    'TypeScript',
    'React Native',
    'CI/CD',
    'Containers',
    'Using relational databases',
  ],
  zh: [
    'Web 应用的基础设施',
    'React 入门',
    '与服务端通信',
    '用NodeJS和Express写服务端程序',
    '测试 Express 服务端程序, 以及用户管理',
    '测试 React 应用',
    '利用Redux进行状态管理',
    'React router、自定义 hook，利用CSS和webpack给app添加样式',
    'GraphQL',
    'TypeScript',
    'React Native',
    'CI/CD',
    '容器',
    '使用关系型数据库',
  ],
  fr: [
    'Introduction aux applications Web',
    'Premiers pas avec React',
    'Communiquer avec le serveur',
    'Programmation côté serveur avec NodeJS et Express',
    'Test des serveurs Express, gestion des utilisateurs',
    'Tester des applications React',
    "Gestion d'état avec Redux",
    'React router, hooks personnalisés, application de style avec CSS et webpack',
    'GraphQL',
    'TypeScript',
    'React Native',
    'CI/CD',
    'Conteneurs',
    'Utilisation de bases de donées relationnelles',
  ],
  ptbr: [
    'Fundamentos de aplicações web',
    'Introdução ao React',
    'Comunicação com o servidor',
    'Programando um servidor com NodeJS e Express',
    'Teste de servidores Express e Administração de Usuários',
    'Teste de aplicações React',
    'Gerenciamento de Estado com Redux',
    'React router, hooks personalizados, estilização de aplicações com CSS e Webpack',
    'GraphQL',
    'TypeScript',
    'React Native',
    'CI/CD',
    'Containers',
    'Utilizando bancos de dados relacionais',
  ],
};

export const PartBanner = ({ lang }) => {
  // TODO change on release
  const parts = Object.keys(navigation[lang]);

  function partName(lang) {
    return lang === 'fi' ? 'Osa' : lang === 'ptbr' ? 'Parte' : 'Part';
  }

  return (
    <Banner
      className="spacing spacing--after-small spacing--after-mobile offset"
      id="course-contents"
    >
      <div className="container spacing flex-fix-aligning col-7--mobile">
        {parts.map(part => {
          const partNames =
            partNameTranslations[lang] || partNameTranslations.en;

          const summary =
            translationProgress[lang] < part
              ? partNames[part] + ' (english only)'
              : partNames[part];
          return (
            <ContentLiftup
              key={partNames[part]}
              className="col-3 col-10--mobile col-4--tablet"
              image={{
                src: require(`../../images/thumbnails/part-${part}.svg`),
                alt: partNames[part],
              }}
              hoverImageSrc={require(`../../images/thumbnails/part-${part}_ovr.svg`)}
              name={`${partName(lang)} ${part}`}
              summary={summary}
              path={getPartTranslationPath(lang, part)}
            />
          );
        })}
      </div>
    </Banner>
  );
};
