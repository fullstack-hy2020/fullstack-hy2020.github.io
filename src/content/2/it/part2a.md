---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: it
---

<div class="content">

Prima di iniziare una nuova sezione, ricapitoliamo gli argomenti che si sono rivelati più insidiosi lo scorso anno.

### console.log

**Qual'è la differenza tra uno svilupatore JavScript esperto e un novizio? Quello espero usa console.log 10-100 volte di più.**

PAradossalmente, questo sembra essere vero anche se dovrebbe aver bisogno di <i>console.log</i> (o qualsiasi altro metodo di debug) più di uno esperto.

Quando qualcosa non funziona, non tirare semplicemente a indovinare cosa non stia funzionando. Invece, logga o usa qualche altr modalità di debug.

**NB** Come spiegato nella sezione 1, quando si usa _console.log_ per debuggare, non si deve concatenare gli oggetti 'alla Java' con il più. Invece di scrivere:

```js
console.log('props value is ' + props)
```

separate le cosa da stampare con una virgola

```js
console.log('props value is', props)
```

Se si concatena un oggetto con una stringa e si logga il risultato a console (come nel nostro esempio), il risultato sarà sostanzialmente inutile: 

```js
props value is [Object object]
```

Al contrario, quando si passano oggetti a _console.log_ come argomenti distinti separati da virgole, come nel nostro secondo esempio qui sopra, il contenuto dell'oggetto viene stampato nella console per sviluppatori come stringhe pertinenti.
Se necessario, è possibile leggere di più  proposito di [come debuggare applicazioni React](/it/part1/stato_complesso_debug_di_app_react#debug-di-applicazioni-react).

### Condigli da pro: snippet di codice in Visual Studio 

Con Visual Studio Code è semplice creare 'snippet' di codice, scorciatoie per generare porzioni di codice usate frequentemente, un po' come funziona 'sout' in Netbeans.

Le istruzioni per creare snippet può essere trovata [qui](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

Snipper utili e già pronti posnno essere anche trovati sotto froma di plugin di VS Code, nel [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).

Lo snippet più importante è quello per il comando <em>console.log()</em>, per esempio, <em>clog</em>. Può essere creato così: 
```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

Fare il debug del codice con l'uso di _console.log()_ è talmente comune che Visual Studio Code ha uno snippet integrato. Per usarlo, digita _log_ e premi tab per attivare l'autocompletamento. Nel [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance) è possibile trove estensioni con snippet di _console.log()_ più ricchi di funzionalità.

### Array JavaScript

Da qui in poi, utilizzeremo sempre i metodi di programmazione funzionale dell'[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) JavaScript, come ad esempio _find_, _filter_, e _map_. Essi operano sugli stessi principi generali degli stream in Java 8, che sono stati usati negli ultimi anni nei corsi 'Ohjelmoinnin perusteet' e 'Ohjelmoinnin jatkokurssi' al dipartimento di Computer Science dell'università, e anche nel MOOC di programmazione.

Se ti senti straniato dalla programmazione funzionale con gli array, vale la pena vedere almeno le prime tre parti della serie di video YouTube [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Gestori di eventi rivisitati

Nel corso dello scorso anno, la gestione degli eventi si è rivelata un argomento complesso.

Vale la pena leggere il capitolo riepilogativo alla fine della sezione precedente [gestione degli eventi rivisitata](it/part1/stato_complesso_debug_di_app_react#gestione-degli-eventi-rivisitata), se avete la sensazione che la vostra conoscenza dell'argomento necessiti di una rinfrescata.

Il passaggio di event handler ai componenti figli del componente <i>App</i> ha sollevato diverse domande. Una breve revisione dell'argomento può essere trovata [qui](/it/part1/stato_complesso_debug_di_app_react#passare-i-gestori-di-eventi-ai-componenti-figli).

### Visualizzare collezioni

Realizzeremo ora il 'frontend', ovvero la logica applicativa lato browser, in React per un'applicazione simile a quella di esempio vista nella [sezione 0](/it/part0)

Iniziamo con quanto segue (il file <i>App.js</i>):

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App
```

Il file <i>index.js</i> appare così:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
```

Ogni nota contiene il suo contenuto testuale, un timestamp, un valore booleano che indica se la nota è importante o meno e un <i>id</i> unico.

L'esempio sopra funziona grazie al fatto che ci sono esattamente tre note nell'array.

Un singolo nodo viene visualizzato accedendo gli oggetti nell'array referenziandolo attraverso un indice numerico cablato:

```js
<li>{notes[1].content}</li>
```

Questo metodo, ovviamente, è poco pratico. Possiamo migliorarlo generando elementi React dagli oggetti nell'array attraverso la funzione [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
notes.map(note => <li>{note.content}</li>)
```

Il risultato è un array di elementi <i>li</i>.

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

Che può a questo punto essere messo all'interno di un tag <i>ul</i>:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

Poiché il codice che genera i tag <i>li</i> è JavaScript, deve essere racchiuso in parentesi graffe in un template JSX esattamente come qualsiasi altro frammento di codice JavaScript.

Rendiamo inoltre il codice più leggibile separando le dichiarazioni di funzioni freccia su più righe:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### Attributo chiave

Anche se sembra che l'applicazone funzioni, c'è un brutto avviso nella console:

![](../../images/2/1a.png)

Come suggerisce la [pagina React](https://reactjs.org/docs/lists-and-keys.html#keys) linkata nel messaggio di errore, gli elementi della lista, ovvero gli elementi generati dal metodo _map_, devono avere una chiave univoca ciascuno: un attributo deominato <i>key</i>.

Aggiungiamo le chiavi:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}> // highlight-line
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

E il messaggio di errore scompare.

React usa gli attributi _key_ degli oggetti in un array per stabilire come aggiornare la vista generata da un componente quando viene ri-renderizzato. Altro materiale può essere trovato a riguardo nella [documentazione di React](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### Map

Comprendere il funzionamento del metodo [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) degli array è cruciale per il prosieguo del corso.

L'applicazione contiene un array denominato _notes_:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]
```

Fermiamoci un attimo ed esaminiamo come funziona _map_.

Se ad esempio il codice seguente fosse aggiunto alla fine del file:

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i>  verrebbe stampato nela console.
_map_ crea sempre un nuovo array, i cui elementi sono stati creati dagli elementi dell'array originale effettuando il <i>mapping</i> attraverso la funzione passata come parametro al metodo _map_.

LA funzione è:

```js
note => note.id
```

Che è una funzione a freccia scritta in forma compatta. La forma completa sarebbe:

```js
(note) => {
  return note.id
}
```

La funzione riceve in input un oggetto _note_ e restituisce il valore del suo campo <i>id</i>.

Modificando il comando in:

```js
const result = notes.map(note => note.content)
```

si avrebbe un array con i contenuti delle note.

Questo è già abbastanza simile al codice React che abbiamo usato:

```js
notes.map(note =>
  <li key={note.id}>{note.content}</li>
)
```

che genera un elemento <i>li</i> contenente il corpo di ciascun oggetto nota.

Dato che la funzione passata come parametro al metodo _map_ -

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp;- è usata per creare elementi visuali, il valore della variabile deve essere scritto tra parentesi graffe. Provate a vedere cosa accade rimuovendo le parentesi.

L'uso delle graffe sarà causa di qualche frustrazione all'inizio, ma vi abituerete in fretta. Il feedback visivo di React è immediato.

### Anti-pattern: Indice dell'array come chiave

Avremmo potutto far sparire l'errore in console usando l'indice dell'array come chiave. Gli indici possono essere ottenuti aggiungendo un secondo parametro alla callback passata al metodo _map_:

```js
notes.map((note, i) => ...)
```

Quando la callback è chiamata in questo modo, a _i_ viene assegnato il valore dell'indice della posizione nell'array in cui sono memorizzate le note.

Pertanto, uno modo per definire la generazione delle righe senza avere errori è:

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

Questo metodo tuttavia **non è raccomandato** e può causare problemi indesiderati anche se sembra funzionare bene.

Si può approfondire l'argomento in [questo articolo](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Ristrutturazione dei moduli

Faßcciamo un po' di pulizia nel codice. Siamo interessati al solo campo _notes_ delle props, pertanto recuperiamolo direttamente sfruttando la [destrutturazione](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment): 

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

Se non ricordate cosa sia la destrutturazione e come funzioni, siete pregati di rivedere la [sezione sulla destrutturazione](/it/part1/stato_dei_componenti_event_handlers#destrutturazione).

Separiamo la visualizzazione di una singola nota in un componente dedicato <i>Note</i>: 

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Si noti che a questo punto l'attributo <i>key</i> deve essere definito per il componente <i>Note</i>, e non per l'elemento <i>li</i> come prima. 

Un'intera applicazione React può essere scritta in un unico file, anche se ovviamente non è la cosa più agevole. La pratica comune è di dichiarare ciascun componente come _modulo ES6_ in un file dedicato.

Abbiamo usato moduli fin dall'inizio. Le prime righe del file <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
```

[importano](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) tre moduli, rendendoli disponibili per l'uso nel file. Il modulo <i>React</i> è associato alla variabile _React_, il modulo <i>react-dom</i> alla variabile _ReactDOM_, e il modulo che definisce il componente principale dell'app è associato alla variabile _App_.

Spostiamo il nostro componente <i>Note</i> nel suo modulo dedicato. 

In applicazioni più piccole i componenti sono solitamente collocati in una cartella chiamata <i>components</i>, a sua volta collocata nella directory <i>src</i>. La convenzione è dare al file lo stesso nome del componente.

Ora creeremo la caretlla <i>components</i> dellam nostra applicazione e vi collocheremo il file <i>Note.js</i>.
Il contenuto del file Note.js è il seguente:

```js
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

L'ultima riga del modulo fa l'[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) del modulo dichiarato, la variabile <i>Note</i>.

Ora il file che usa il componente - <i>App.js</i> - può fare l'[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) del modulo: 

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

Il componente esportato dal modulo è ora disponibile per l'uso nella variabile  <i>Note</i>, esattamente come lo era prima. 

Si noti che quanto si importano i nostri componenti, deve essere fornita la loro collocazione <i>con il percorso relativo al file che fa l'importazione</i>:

```js
'./components/Note'
```

Il punto - <i>.</i> - all'inizio fa riferimenti alla directory corrente, quindi la posizione del modulo è un file denominato  <i>Note.js</i> nella sotto-cartella <i>components</i> della cartella corrente. L'estensione del file _.js_ [uò essere omessa.

I moduli hanno numerosi altri usi oltre a consentire che le dichiarazioni dei componenti siano separate nei loro rispettivi file. Ci torneremo più avanti nel corso.

Il codice attuale dell'applicazione può essere trovato su [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).

Si noti che il branch <i>main</i> del repository contiene il codice di una versione successiva dell'applicazione. Il codice attuale è nel branch [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):

![](../../images/2/2e.png)

Se cloni il progetto, lancia il comando _npm install_ prima di avviare l'applicazione con _npm start_.

### QUando l'applicazione si rompe

All'inizio della carriera da sviluppatore (e a volte in realtà anche dopo 30 di sviluppo), capita che la tua applicazione semplicemente si rompa completamente. Questo accade ancor più di frequente con i linguaggi dinamici, come JavaScript, dove il compilatore non fa controlli sui tipi di dato, come ad esempio i parametri delle funzioni o i valori che restituiscono.

Una "esplosione di React", per esempio, appare così:

![](../../images/2/3b.png)

In queste situazioni la migliore via di uscita è <em>console.log</em>.

Il frammento di codice che causa l'esplosione è il seguente:

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```

Arriviamo alla causa del problema aggiungendo comandi <em>console.log</em> al codice. Dal momento che la prima cosa che viene visualizzata è il componente <i>App</i>, vale la pena mettere il primo <em>console.log</em> proprio lì: 

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

Per vedere la stampa nella console, occorre scorrere sopra il lingo muro rosso di errori.

![](../../images/2/4b.png)

Quando si trova una cosa che funziona, è il momento di andare a loggare più in profondità. Se il componente è stato definito con una singola sitruzione, o una funzione senza return, stampare a console è un po' più complicato.

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

Il componente deve essere modificato nella sua forma più estesa in modo da poter aggiungere la stampa a console:

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Piuttosto di frequente la causa originale del problema è il fatto che ci si aspetta props di tipo differente da quelle effettivamente ricevute, e questo causa il fallimendo del comando di destrutturazione. Spesso ci si avvicina alla soluzione rimuovendo la destrutturazione e andando a gaurdare ciò che effettivamente le props contengono.

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Se ancora il prblema non è risolto, non cè molto altro da fare se non continuare la caccia al bug inserendo altre istruzioni _console.log_ nel codice.

Questo capitolo è stato aggiunto al materiale dopo che la risposta tipo alla prossima domanda è esplosa completamente (a causa di props di tipo differente) rendendo necessario il debug tramite <em>console.log</em>.

</div>

<div class="tasks">

<h3>Esercizi 2.1.-2.5.</h3>

Gli esercizi sono sottomessi via GitHub e spuntandoli come fatti nel [sistema di sottomissione online](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Puoi sottomettere tutti gli esercizi in un unico repository o in repository differenti. Se sottometti esercizi di sezioni differenti in un unico repository, nomina opportunamente le directory.

Gli esercizi sono sottomessi **una sezione alla volta**. Una volta sottomessi gli esercizi per una sezione, non è più possibile aggiungere esercizi mancanti per quella sezione.

Nota che questa sezione ha più esercizi delle precedenti, quindi non sottomettere prima di aver completato tutti gli esercizi di questa sezione che intendi completare.

**ATTENZIONE** create-react-app trasformerà automaticamente la tua applicazione in un repository git a meno che la tua applicazione non venga creata all'interno di un altro repository git. **Molto probabilmente non si vorrà create un nuovo repository Git per ciascun progetto**, perciò esegui semplicemente il comando _rm -rf .git_ dalla radice dell'applicazione.

<h4>2.1: Informazioni sui corsi step6</h4>

Completiamo il codice per mostrare le informazioni sui corsi iniziato negli esercizi 1.1 - 1.5. Puoi partire con il codice dalle risposte di esempio. Le risposte di esempio possono essere trovate nel [sistema di sottomissione](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), cliccando su <i>my submissions</i> in alto,  e cliccando su <i>show</i> nella riga corrispondente alla sezione 1 nella colonna <i>solutions</i> . Per vedere la soluzione all'esercizio <i>course info</i>, clicca su _index.js_ sotto _course info_.

**Si noti che se si copia un progetto da un posto a un altro, occorre cancellare la cartella <i>node\_modules</i> e installare di nuovo le dipendenze con il comando _npm install_ prima di poter lanciare l'applicazione.**
In generale non è consigliabile copiare i contenuti di un intero progetto e/o aggiungere la cartella <i>node\_modules</i> al sistema di versioning. 

Cambiamo così il componente <i>App</i>: 

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
```

Definisci un componente responsabile della formattazione di un singolo corso, cchiamato <i>Course</i>. 

La struttura dei componenti dell'applicazione potrebbe essere ad esempio la seguente:

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

Pertanto, il componente <i>Course</i> contiene i componenti definiti nella sezione precedente, che sono responsabili di viaualizzare il nome del corso e le sue sezioni.

La pagina visualizzata potrebbe ad esempio avere il seguente aspetto:

![](../../images/teht/8e.png)

Per il momento il totale delle sezioni non è richiesto.

L'applicazione deve funzionare <i>indipendentemente dal numero di sezioni di un corso</i>, quindi assicurati che l'applicazione funzioni se si aggiunge o rimuove un corso.

Assicurati che non ci siano errori in console!

<h4>2.2: Informazioni sui corsi step7</h4>

Mostra anche la somma del numero di parti dei corsi.

![](../../images/teht/9e.png)

<h4>2.3*: Informazioni sui corsi step8</h4>

Se già non lo hai fatto, calcola la somma degli esercizi usando il metodo [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) degli array.

**Pro tip:** quando il codice è così:

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```

e non funziona, vale la pena usare _console.log_, che richiede di scrivere la funziona a freccia nella sua forma estesa:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```
 
**Non funziona? :** Usa il motore di ricerca per trovare come usare _reduce_ su un **Object Array**.

**Pro tip 2:** C'è un [plugin per VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer) che modifica automaticamente una funzione a freccia nella sua forma estesa e viceversa.

![](../../images/2/5b.png)

<h4>2.4: Informazioni sui corsi step9</h4>

Estendiamo l'applicazione per gestire <i>un numero arbitrario</i> di corsi: 

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

L'applicazione potrebbe ad esempio apparire così: 

![](../../images/teht/10e.png)

<h4>2.5: Separa i moduli</h4>

Dichiara il componente <i>Course</i> come modulo separato, che viene importato dal componente <i>App</i>. Puoi includere nello stesso moculo tutti i sottocomponenti di <i>Course</i>.

</div>
