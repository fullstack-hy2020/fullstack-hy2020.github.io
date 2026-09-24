import React from 'react';

const EN_SITE_URL = 'https://fullstackopen.com/en/';

const MORE_INFO_URL_BY_LANGUAGE = {
  fi: '/new-platform/',
  en: '/en/new-platform/',
  zh: '/zh/new-platform/',
  es: '/es/new-platform/',
  fr: '/fr/new-platform/',
  ptbr: '/ptbr/new-platform/',
};

const TEXT_BY_LANGUAGE = {
  en: {
    ariaLabel: 'New platform notice',
    closeAriaLabel: 'Close notice',
    machineTranslatedNote: null,
    p1: 'Starting from Part 6 onward, Full Stack Open has moved to a new platform. This site is no longer being updated, and any exercises you submit here for Part 6 and later will not be counted.',
    p2Pre: 'Please see the ',
    siteLinkText: 'English version of the Full Stack Open page',
    p2Mid:
      ' for the links to the new platform parts, and continue your studies there. For more information click ',
    hereLinkText: 'here',
    p2End: '.',
    p3: 'Unfortunately, the new platform is currently available only in English. There is ongoing work to see if language support can be brought back in the future.',
  },
  fi: {
    ariaLabel: 'Ilmoitus uudesta alustasta',
    closeAriaLabel: 'Sulje ilmoitus',
    machineTranslatedNote: 'Konekäännetty suomeksi.',
    p1: 'Osasta 6 alkaen Full Stack Open on siirtynyt uudelle alustalle. Tätä sivustoa ei enää päivitetä, eikä osan 6 ja sitä myöhempien osien tehtäviä lasketa, jos ne palautetaan täällä.',
    p2Pre: 'Katso ',
    siteLinkText: 'Full Stack Open -sivuston englanninkielisestä versiosta',
    p2Mid:
      ' linkit uuden alustan osiin ja jatka opintojasi siellä. Lisätietoa saat ',
    hereLinkText: 'täältä',
    p2End: '.',
    p3: 'Valitettavasti uusi alusta on toistaiseksi saatavilla vain englanniksi. Kielten tuen palauttamista muille kielille selvitetään parhaillaan.',
  },
  zh: {
    ariaLabel: '新平台通知',
    closeAriaLabel: '关闭通知',
    machineTranslatedNote: '本内容为机器翻译。',
    p1: '从第 6 部分开始,全栈公开课已迁移到新平台。本网站将不再更新,您在此提交的第 6 部分及以后的练习将不计入成绩。',
    p2Pre: '请查看 ',
    siteLinkText: '全栈公开课页面的英文版本',
    p2Mid: ',获取新平台各部分的链接,并在那里继续学习。欲了解更多信息,请点击',
    hereLinkText: '此处',
    p2End: '。',
    p3: '很遗憾,新平台目前仅提供英文版本。我们正在努力研究未来是否能够恢复对其他语言的支持。',
  },
  es: {
    ariaLabel: 'Aviso sobre la nueva plataforma',
    closeAriaLabel: 'Cerrar aviso',
    machineTranslatedNote: null,
    p1: 'A partir de la Parte 6 en adelante, Full Stack Open se ha trasladado a una nueva plataforma. Este sitio ya no se actualiza, y cualquier ejercicio que envíes aquí para la Parte 6 o posterior no será contabilizado.',
    p2Pre: 'Consulta la ',
    siteLinkText: 'versión en inglés de la página de Full Stack Open',
    p2Mid:
      ' para encontrar los enlaces a las nuevas partes de la plataforma y continúa tus estudios allí. Para más información, haz clic ',
    hereLinkText: 'aquí',
    p2End: '.',
    p3: 'Desafortunadamente, la nueva plataforma actualmente solo está disponible en inglés. Se está trabajando para ver si el soporte de idiomas puede volver en el futuro.',
  },
  fr: {
    ariaLabel: 'Avis concernant la nouvelle plateforme',
    closeAriaLabel: "Fermer l'avis",
    machineTranslatedNote: 'Traduction automatique en français.',
    p1: "À partir de la partie 6, Full Stack Open a été déplacé vers une nouvelle plateforme. Ce site n'est plus mis à jour, et les exercices que vous soumettez ici pour la partie 6 et au-delà ne seront pas comptabilisés.",
    p2Pre: 'Veuillez consulter la ',
    siteLinkText: 'version anglaise de la page Full Stack Open',
    p2Mid:
      " pour obtenir les liens vers les parties de la nouvelle plateforme, et poursuivre vos études là-bas. Pour plus d'informations, cliquez ",
    hereLinkText: 'ici',
    p2End: '.',
    p3: "Malheureusement, la nouvelle plateforme n'est actuellement disponible qu'en anglais. Des travaux sont en cours pour voir si la prise en charge d'autres langues pourra être rétablie à l'avenir.",
  },
  ptbr: {
    ariaLabel: 'Aviso sobre a nova plataforma',
    closeAriaLabel: 'Fechar aviso',
    machineTranslatedNote: 'Traduzido automaticamente para o português (BR).',
    p1: 'A partir da Parte 6, o Full Stack Open foi migrado para uma nova plataforma. Este site não está mais sendo atualizado, e os exercícios enviados aqui para a Parte 6 em diante não serão contabilizados.',
    p2Pre: 'Consulte a ',
    siteLinkText: 'versão em inglês da página do Full Stack Open',
    p2Mid:
      ' para ver os links das partes na nova plataforma e continuar seus estudos por lá. Para mais informações, clique ',
    hereLinkText: 'aqui',
    p2End: '.',
    p3: 'Infelizmente, a nova plataforma está disponível apenas em inglês por enquanto. Há um trabalho em andamento para verificar se o suporte a outros idiomas poderá ser reintroduzido no futuro.',
  },
};

const InfoBannerNewPlatform = ({ visible, onHide, language }) => {
  // English and Finnish content is up to date on this site, so this
  // notice is only relevant for the other languages.
  if (!visible || language === 'en' || language === 'fi') return null;

  const content = TEXT_BY_LANGUAGE[language] || TEXT_BY_LANGUAGE.en;
  const {
    ariaLabel,
    closeAriaLabel,
    machineTranslatedNote,
    p1,
    p2Pre,
    siteLinkText,
    p2Mid,
    hereLinkText,
    p2End,
    p3,
  } = content;

  const moreInfoUrl =
    MORE_INFO_URL_BY_LANGUAGE[language] || MORE_INFO_URL_BY_LANGUAGE.en;

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

  const noteStyle = {
    marginBottom: 8,
    fontStyle: 'italic',
    fontSize: '0.85em',
    color: '#5a4000',
  };

  const paragraphStyle = {
    marginBottom: 8,
    color: '#000',
  };

  const linkStyle = {
    color: '#5a4000',
    fontWeight: 600,
    textDecoration: 'underline',
  };

  const buttonStyle = {
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#5a4000',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
  };

  return (
    <div style={style} role="region" aria-label={ariaLabel}>
      <div style={textStyle}>
        {machineTranslatedNote && <p style={noteStyle}>{machineTranslatedNote}</p>}

        <p style={paragraphStyle}>{p1}</p>

        <p style={paragraphStyle}>
          {p2Pre}
          <a style={linkStyle} href={EN_SITE_URL}>
            {siteLinkText}
          </a>
          {p2Mid}
          <a style={linkStyle} href={moreInfoUrl}>
            {hereLinkText}
          </a>
          {p2End}
        </p>

        <p style={{ ...paragraphStyle, marginBottom: 0 }}>{p3}</p>
      </div>
      <button
        style={buttonStyle}
        onClick={onHide}
        aria-label={closeAriaLabel}
      >
        x
      </button>
    </div>
  );
};

export default InfoBannerNewPlatform;
