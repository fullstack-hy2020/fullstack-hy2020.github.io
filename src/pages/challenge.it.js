import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="it"
      title="Full stack -challenge | Full Stack open 2022"
      seoDescription="L'Università di Helsinki e Huston Inc. hanno collaborato per sfidare sia gli sviluppatori singoli che le aziende allo stesso modo per apprendere e costruire sulla propria esperienza in vero stile Full Stack. Il corso è realizzato da sviluppatori per sviluppatori, e offre qualcosa sia per nuovi arrivati che per veterani del settore. "
      aboutContent={[
        'Il mondo ha un disperato bisogno di sviluppatori di software. Vogliamo aiutare a far crescere la prossima generazione di sviluppatori — uno dei nostri metodi offerti è di iscriversi al corso di Full Stack MOOC.',
        "L'Università di Helsinki e Huston Inc. hanno collaborato per sfidare sia gli sviluppatori singoli che le aziende allo stesso modo per apprendere e costruire sulla propria esperienza in vero spirito Full Stack. Tra i nostri affiliati e creatori della Challenge ci sono Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj, e Unity Technologies Finland Ltd.",
        "Il nostro obbiettivo è incoraggiare l'apprendimento. Offriamo un corso Full Stack preassemblato e intenzionalmente mirato che abbassa le barriere di accesso all'apprendimento delle nuove tecnologie all'avanguardia e production-ready. Il corso è gratuito e puoi partecipare da dove vuoi quando vuoi, a tuo piacimento.",
        "Il corso è realizzato da sviluppatori per sviluppatori, e offre qualcosa sia per nuovi arrivati che per veterani del settore. L'unico prerequisito è una solida conoscenza dei fondamenti di programmazione di base.",
      ]}
      joinContent={[
        "Accettando la Full Stack-challenge avrete la possibilità di incoraggiare e rafforzare i membri della vostra comunità di lavoro ad acquisire nuove skill. Il corso Full Stack completamente online sarà un'ottima aggiunta al vostro training interno e servirà da materiale di studio individuale tra le vostre altre offerte di training in-azienda.",
        "Partecipando alla challenge, manderai un forte messaggio al mondo esterno riguardo la competenza tecnica della tua azienda — questo aiuterà a costruire un'immagine del tuo datore di lavoro e aumentare la vostra visibilità tra i professionisti dell'industria software.",
        'La partecipazione alla challenge è gratuita. Le aziende che accettano la challenge avranno il loro logo inserito nella pagina web del corso Full Stack.',
      ]}
    />
  );
};

export default Challenge;
