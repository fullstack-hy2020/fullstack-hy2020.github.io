---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: it
---

<div class="content">

Inizieremo ora a familiarizzare con quello che è probabilmente l'argomento più imnportante di questo corso, ovvero la libreria [React](https://reactjs.org/). Iniziamo creando una semplice applicazione React e facendo la conoscenza dei concetti principali di React.

Il modo più semplice di iniziare è di gran lunga l'uso di uno strumento denominato [create-react-app](https://github.com/facebook/create-react-app). E' possibile (ma non necessario) installare create-react-app se la versione di <i>npm</i> installata con Node è la <i>5.3</i> o superiore.

Creiamo un'applicazione chiamata part1 e spostiamoci nella sua cartella:

```bash
npx create-react-app part1
cd part1
```

L'applicazione può essere eseguita così:

```bash
npm start
```

Di default, l'applicazione gira sulla porta 3000 di localhost all'indirizzo <http://localhost:3000>.

Il browser di default dovrebbe essere lanciato automaticamente. Apri la console del browser **immediatamente**. Apri anche un editor di testo in modo che tu possa vedere sia il codice che l'applicazione contemporaneamente sullo schermo:

![](../../images/1/1e.png)

Il codice dell'applicazione risiede nella cartella <i>src</i>. Semplifichiamo il codice di default così che il contenuto del file <i>index.js</i> appaia così:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

and file <i>App.js</i> looks like this

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

export default App
```

I file <i>App.css</i>, <i>App.test.js</i>, <i>index.css</i>, <i>logo.svg</i>, <i>setupTests.js</i> e <i>reportWebVitals.js</i> possono essere cancellati dal momento che non sono necessari nella nostra applicazione in questo momento.

Se hai il seguente errore:

![](../../images/1/r18-error.png)

allora per qualche ragione stai usando una versione di React più vecchia della corrente 18.

La soluzione è di modificare come segeue il file <i>index.js</i>:

```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

Probabilmente dovrai fare lo stesso sul tuo repository.

Vedi [qui](/en/part1/a_more_complex_state_debugging_react_apps/#a-note-on-react-version) for more about the version differences. <!-- TODO Fix link -->

### Componenti

Il file <i>App.js</i> definisce ora un [componente React](https://reactjs.org/docs/components-and-props.html) di nome <i>App</i>. Il comando all'ultima riga del file <i>index.js</i> 

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

visualizza il suo contenuto nell'elemento <i>div</i> definito nel file <i>public/index.html</i>, e avente <i>id</i> valorizzato a 'root'.

Di default, il file <i>public/index.html</i> non contiene markup HTML visibile all'utente nel browser. Puoi verificarlo aggiungendo dell'HTML nel file. Invece, quando si usa React, il contenuto che deve essere visualizzato è normalmente definito nei componenti React.

Vediamo più da vicino il codice che definisce il componente:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Come avrai probabilmente intuito, il componente sarà visualizzato come un elemento <i>div</i> che racchiude un elemento <i>p</i> contenente il testo <i>Hello world</i>.

Tecnicamente il componente è definito da una funzione JavaScript. Quella che segue è una funzione che non riceve parametri in input:

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

La funzione viene quindi assegnata a una costante <i>App</i>:

```js
const App = ...
```

Ci sono diversi modi di definire una funzione in JavaScript. Qui usiamo le [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), che sono introdotte nella nuova versione di JavaScript nota come [ECMAScript 6](http://es6-features.org/#Constants), o ES6.

Dato che la funzione consiste di un'unica espressione abbiamo usato una scorciatoia, che equivale al codice seguente:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

In altre parole, la funzione restituisce il valore dell'espressione.

La funzione che definisce il componente muò contenere codice JavaScript arbitrario. Modifica il componente come di seguito e osserva cosa accade nella console:

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

E' anche possibile mostrare contenuto dinamico nel componente.

Modifica il componente come di seguito:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Qualunque codice JavaScript racchiuso in parentesi graffe viene valutato, e il risultato della valutazione viene incluso nel pundo definito all'interno dell'HTML generato dal componente.

### JSX

Sembra che i componenti React restutuiscano codice HTML. In reantà non è così. I componenti React sono perlo più scritti in [JSX](https://reactjs.org/docs/introducing-jsx.html). Sebbene JSX sia simile all'HTML, abbiamo in realtà a che fare con un modo di scrivere codice JavaScript. Dietro le quinte il JSX restituito dai componenti JavaScript è comilato in JavaScript. 

Dopo la compilazione, la nostra applicazione appare così:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

La compilazione è gestita da [Babel](https://babeljs.io/repl/). I progetti creati con *create-react-app* sono configurati per compilare automatiamente. Impareremo di più su questo argomento nella [sezione 7](/it/part7) del corso.

E' anche possibile scrivere componenti react in puro JavaScript, senza JSX, anche se nessuno dotato di buon senso lo farebbe mai.

In parica, JSX è molto simile all'HTML con la differenza che con JSX è possibile incorporare facilmente contenuto dinamico scrivendo codice JavaScrip nelle parentesi graffe. L'idea di JSX è comune a molti linguaggi di template, come ad esempio Thymeleaf usato in congiunzione a Java Spring lato server.

JSX è un formato "[simil-XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)", il che significa che tutti gli elementi devono essere chiusi. Per esempio un a capo è un elemento vuoto, che in HTML può essere scritto così:

```html
<br>
```

ma quando si scrive JSX, l'elemento deve essere chiuso:

```html
<br />
```

### Componenti multipli

Modifichiamo il file <i>App.js</i> come segue (NB: l'export alla fine è omesso in questi <i>esempi</i>, qui e in futuro. E' comunque sempre richiesto affinché il codice funzioni):

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

Abbiamo definito un nuovo componente <i>Hello</i> e lo abbiamo usato all'interno del componente <i>App</i>. Naturalmente, un componente può essere usato più di una volta.

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

Scrivere componenti React è semplice, e combinando componenti, anche un'applicazione complessa può essere mantenuta ragionevolmente manutenibile. In effetti, un principio cardine di React è la composizione di applicazioni da diversi componenti riusabili specializzati.

Un'altra convenzione forte è l'idea di un <i>root component</i> chiamato <i>App</i> al vertice dell'alberatura di componenti dell'applicazione. Ciò non di meno, come apprenderemo nella [sezione 6](/it/part6), ci sono situazioni in cui il componente <i>App</i> non è esattamente la radice, ma è invece contenuto da un apprioprato componente di utilità.

### props: passare dati ai componenti

E' possibile passare daiti ai componenti usanod le cosiddette [props](https://reactjs.org/docs/components-and-props.html).

Modifichiamo il componente <i>Hello</i> come segue:

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Ora la funzione che definisce il componente ha un parametro <i>props</i>. Come argomento, il parametro riceve un oggetto che ha campi corrispondenti a tutte le "props" che l'utente del componente ha definito.

Le props sono definite come segue:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='George' /> // highlight-line
      <Hello name='Daisy' /> // highlight-line
    </div>
  )
}
```

Ci può essere un numero arbitrario di props e il loro valore può essere una stringa cablata o il risultato di un'espressione JavaScript. Nel caso in cui il valore della prop sia calcolato usando JavaScript, deve essere circondato da parentesi graffe.

Modifichiamo il codice di modo che il componente <i>Hello</i> usi due props:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // highlight-line
  const age = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} />     // highlight-line
    </div>
  )
}
```

Le props inviate dal componente <i>App</i> sono i valori delle variabili, il risultato della valutazione dell'espressione somma e una stringa fissa.

### Alcune note

React è stato configurato per restutuire messaggi di errore piuttosto chiari. Nonostante ciò, dovresti, almeno all'inizio, avanzare per **passi molto piccoli** e assicurarti che ciascuna modifica funzioni come atteso.

**La console dovrebbe essere sempre aperta**. Se il browser segnala degli errori, non è consigliabilie continuare a scrivere altro codice, sperando in un miracolo. Dovresti invece comprendere la causa dell'errore e, per esempio, ritornare al precedente stato funzionante:

![](../../images/1/2a.png)

E' bene ricordare che in React è possibile comandi <em>console.log()</em> (che stampano nella console) nel codice e che spesso vale la pena farlo.

Ricorda inoltre che **i nomi dei componenti React devono iniziare con una lettera maiuscola**. Se si prova a definire un componente come segue:

```js
const footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
```

e lo si usa così:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

l'applicazione non mostrerà il contenuto definito nel componente Footer, e invece React crea solamente un elemento [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) vuoto, ovvero l'elemento footer standard di HTML anziché il componente React avente lo stesso nome. Mdificando la lettera iniziale nel nome del componente in maiuscolo, React crea  l'elemento<i>div</i> definito nel componente Footer, che viene visualizzato in pagina.

Si noti che il contenuto di un componente React (di solito) deve contenere **un elemento radice**. Se, per esempio, provassimo a definire il componente <i>App</i>  senza l'elemento<i>div</i> più esterno:

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name='Maya' age={26 + 10} />
    <Footer />
  )
}
```

il risultato sarebbe un errore:

![](../../images/1/3c.png)

L'uso dun elemento radice non è l'unica opzione. Un array di componenti è unáternativa valida.

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

Tuttavia, quando si definisce il componente radice di un'applicazione questa non è una scelta particolarmente saggia poiché rende il codice piuttosto contorto.

Dato che l'elemento root è previsto, avremo degli elementi div "extra"nell'albero DOM. Questo può essere evitato con l'uso dei [fragments](https://reactjs.org/docs/fragments.html#short-syntax), cioè includendo gli elementi che il componente deve restituire in un elemento vuoto.

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Ora il codice compila correttamente e il DOM generato da React non contiene più elementi div extra.

</div>

<div class="tasks">
  <h3>Esercizi 1.1.-1.2.</h3>

Gli esercizi sono sottomessi via GitHub, e marcandoli come fatti nel [sistema di sottomissione](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Puoi sottomettere tutti gli esercizi nello stesso repository, o usare più repository differenti. Se sottometti esercizi di sezioni differenti nello stesso repository, assicurati di nominare correttamente le directory. Se utilizzi un repository privato per sottomettere gli esercizi, aggiungi _mluukkai_ come collaboratore.

Un buon modo di nominare le directory nel tuo repository di sottomissione è come segue:

```
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  courseinfo
  phonebook
  countries
```

In questo modo, ogni sezione è nella sua directory, che a sua volta contiene una directory per ogni gruppo di esercizi (come gli esercizi unicafe nella sezione 1).

Gli esercizi sono sottomessi **una sezione alla volta**. Una volta sottomessi gli esercizio di una sezione, non puoi più sottomettere esercizi mancanti per quella sezione.

Si noti che in questa sezione ci sono altri esercizi oltre a quelli che si trovano qui sotto. <i>Non sottomettere il tuo lavoro</i> finché non avrai completato tutti gli esercizi che vuoi sottomettere per questa sezione. 

  <h4>1.1: informazioni sui corsi, step1</h4>

<i>L'applicazione su cui inizieremo a lavorare in questo esercizio sarà ulteriormente sviluppata in alcuni degli esercizi seguenti. In questo e negli altri gruppi di esercizi nel corso, è sufficiente sottomettere solo lo stato finale dell'applicazione. Se lo desideri puoi anche creare un commit per ciascun esercizio, m è completamente opzionale.</i>

Usa create-react-app per inizializzare una nuova applicazione. Modifica il file <i>index.js</i> come di seguito:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

e <i>App.js</i> come di seguito:

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

e rimuovi i file addizionali (App.css, App.test.js, index.css, logo.svg, setupTests.js, reportWebVitals.js).

Sfortunatamente l'intera applicazione è nello stesso componente. Esegui il refactoring del codice così che consista di tre nuovi componenti: <i>Header</i>, <i>Content</i>, e <i>Total</i>. Tutti i dati devono continuare a risiedere nel componente <i>App</i> component, che passa i dati necessari a ciascun componente usando delle <i>props</i>. <i>Header</i> si occupa di visualizzare il nome del corso, <i>Content</i> visualizza le sezioni e il relativo numero di esercizi e <i>Total</i> mostra il numero totale di esercizi.

Definisci i nuovi componenti nel file <i>App.js</i>.

Il corpo del componente sarà approssimativamente come segue:

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**ATTENZIONE** create-react-app rende automaticamente il progetto un repository git a meno che l ápplicazione non sia creata già all'interno di un repository git esustente. Moltro probabilmente **non vorrai** che il progetto diventi un repository git, quindi lancia questo comando dalla radice del progetto: 

<h4>1.2: informazioni sui corsi, step2</h4>

Esegui il refactor del componente di modo che non visualizzi direttamente i nomi delle sezioni o il relativo numero di esercizi. Invece visualizza solamente tre componenti <i>Part</i> dei quali ciascuno mostra il nome e il numero di esercizi della relativa sezione.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

La nostra applicazione passa le informazioni in un modo piuttosto primitivo per ora, in quanto si basa su singole variabili. La situazione migliorerà presto.

</div>
