import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="it"
      title="Full stack -challenge | Full Stack open 2022"
      seoDescription="L'università di Helsinki e Huston Inc. hanno realizzato una partnership per sfidare sviluppatori individuali e aziende a imparare e costruire sulla loro esperienza nello sviluppo Full Stack. Il corso è fatto da sviluppatori per sviluppatori e ha qualcosa da offrire sia a chi è alle prime armi che ai più esperti del settore"
      aboutContent={[
        'Il mondo ha disperato bisogno di sviluppatori software. Vogliamo contribuire ad allevare la prossima generazione di sviluppatori — ono degli strumenti che offriamo è l\'iscrizione al corso Full Stack MOOC.',
        'L\'università di Helsinki e Huston Inc. hanno realizzato una partnership per sfidare sviluppatori individuali e aziende a imparare e costruire sulla loro esperienza nello sviluppo Full Stack. Tra i nostri affiliati e fondatori della competizione ricordiamo Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj, e Unity Technologies Finland Ltd.',
        'Il nostro obiettivo è di incoraggiare l\'apprendimento. Offriamo un corso completo e mirato che abbassa le barriere all\'ingresso nell\'apprendimento di tecnologie che costituiscono lo stato dell\'arte dell\'industria. Il corso è completamente gratuito e puoi partecipare quando vuoi e ovunque tu sia, come ti è più comodo.',
        'Il corso è fatto da sviluppatori per sviluppatori e ha qualcosa da offrire sia a chi è alle prime armi che ai più esperti del settore. L\'unico prerequisito è una buona conoscenza dei fondamenti di programmazione.',
      ]}
      joinContent={[
        'Accettando la sfida incoraggerete e abiliterete i membri delle vostra comunità professionale ad acquisire nuove competenze. Il corso on-line Full Stack sarà un grande acceleratore per i tuoi programmi di formazione e sviluppo e sarà un utile materiale di auto-apprendimento, in affiancamento ai materiali di formazione già esistenti in azienda.',
        'Partecipando alla sfida, invierai un messaggio forte al mondo sulle competenze tecniche della tua azienda — questo aiuterà a sviluppare l\'employer branding dell\'azienda e accrescerà la tua visibilità tra i professionisti dello sviluppo software.',
        'Partecipare alla sfida è gratuito. Le aziende che rispondono alla chiamata e accettano la sfida avranno il loro logo fieramente mostrato nella pagina Web del corso Full Stack.',
      ]}
    />
  );
};

export default Challenge;
