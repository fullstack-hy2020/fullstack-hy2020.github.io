---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: it
---

<div class="content">

Torniamo a lavorare con React

Ripartiamo da un nuovo esempio:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### Funzioni di utilità nei componenti

Sviluppiamo il nostro componente <i>Hello</i> in modo che indovini l'anno di nascita della persona salutata:

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

La logica per indovinare l'anno di nascita è separata in una funzione a se stante che viene invocata al momento della renderizzazione del componente.

L'età della persona non ha bisogno di essere passata come parametro della funzione, dato che può accedere direttamente alle props passate al componente.

Osservando il codice attentamente, si può notare che la funzione di supporto è in effetti definita all'interno di un'altra funzione che definisce il comportamento del componente. In Java, definire una funzione dentro un'altra è complesso e tedioso ed è quindi un'opzione poco usata. In JavaScript invecela definizione di una funzione all'interno di un'altra funzione è una pratica comune.

### Destrutturazione

Prima di procedere, diamo uno sguardo a una semplice ma utile funzionalità di JavaScript, aggiunta nella specifica ES6, che permette di [destrutturare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) i valori contenuti in oggetti o array al momento dell'assegnazione.

Nel nostro codice precedente, abbiamo dovuto fare riferimento ai dati passati al nostrro componente come _props.name_ e _props.age_. Abbiamo dovuto ripetere due volte l'espressione _props.age_ twice nel nostro codice.

Dato che <i>props</i> è un oggetto

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

possiamo semplificare il nostro componente assegnando i valori delle proprietà in due variabili _name_ e _age_ che possiamo poi usare nel nostro codice:

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Si noti che abbiamo anche usato la forma più compatta delle arrow function nella definizione della funzione _bornYear_. Come detto in precedenza, se una arrow function consiste di un'unica espressione le parentesi graffe possono essere omesse. In questa forma compatta la funzione restituisce semplicemente il risultato della valutazione della singola espressione.

Ricapitolando, le due definizioni di funzione seguenti che seguono sono equivalenti.
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

La destrutturazione rende l'assegnamento delle variabili ancora più semplice dato che possiamo usarla per raccogliere i valori delle proprietà di un oggetto in variabili separate:

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- Eli koska -->
Se l'oggetto che stiamo destrutturando ha i valori:
```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

l'espressione <em>const { name, age } = props</em> assegna i valori 'Arto Hellas' a _name_ e 35 a _age_.

Possiamo portare la destrutturazione un passo avanti:
```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Le props passate al componente sono ora destrutturate direttamente nelle varriabili _name_ e _age_.

Ciò significa che, invece di assegnare l'intero oggetto props a una variabile chiamata <i>props</i> e di assegnare poi le sue proprietà alle variabili _name_ e _age_

```js
const Hello = (props) => {
  const { name, age } = props
```

assegnamo i valori delle proprietà direttamente a delle variabili destrutturando l'oggetto props passato al componente come parametro della funzione:

```js
const Hello = ({ name, age }) => {
```

### Aggiornamento della pagina

Fino ad ora in tutte le nostre applicazioni l'aspetto rimane invariato dopo la visualizzazione iniziale. Cosa accdrebbe invece se invece volessimo creare un contatore il cui valore cambia in funzione del tempo o al click di un bottone?

Iniziamo come di seguito. Il file <i>App.js</i> diventa:

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

E il file <i>index.js</i> diventa:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

Al componente App è assegnato il valore del contatore attraverso la prop _counter_. Il vomponente visualizza il valore sullo schermo. Cosa accade quando il valore di _counter_ cambia? Anche se aggiungessimo questo codice

```js
counter += 1
```

il componente non si aggiornerebbe. Possiamo forzare il componente ad aggiornarsi invocando il metodo _render_ una seconda volta, ad esempio come segue:

```js
let counter = 1

const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

Il comando di aggiornamento è stato incorporato nella funzione _refresh_ per ridurre la quantità di "copia e incolla" di codice.

Ora il componente <i>si aggiorna tre volte</i>, prima con il valore 1, poi 2 e infine 3. Tuttavia, i valori 1 e 2 sono visualizzati per un tempo così breve da risultare impercettibili.

Possiamo implementare una funzione leggermente più interessante incrementando e aggiornando il componente ogni secondo usando la funzione [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Chiamare ripetutamente il metodo _render_ non è la modalità raccomandata di aggiornare i componenti. Di seguito introdurremo una modalità migliore di raggiungere lo stesso obiettivo.

### Componenti con stato

Tutti i nostri componenti fino ad ora sono stati semplici nel senso che non contenevano alcuno stato che potesse mutare durante il ciclo di vita del componente.

Di seguito aggiungeremo uno stato al nostro componente <i>App</i> con l'aiuto degli [state hook](https://reactjs.org/docs/hooks-state.html) di React.

Modifichiamo l'applicazione come segue:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

e <i>App.js</i> diventa:

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```

Nella prima riga il file importa la funzione _useState_:

```js
import { useState } from 'react'
```

Il corpo della funzione che definisce il componente inizia invocando la funzione:

```js
const [ counter, setCounter ] = useState(0)
```

La chiamata alla funzione aggiunge uno <i>stato</i> al componente e lo visualizza inizializzato al valore zero. La funzione restituisce un array di due elementi. Assegnamo i sueoi elementi alle variabili _counter_ e _setCounter_ usando l'assegnamento destrutturante visto in precedenza.

Alla variabile _counter_ è assegnato il valore iniziale dello <i>stato</i> che è zero. Alla variabile _setCounter_ è assegnata una funzione che varrà usata per modificare lo stato. 

L'applicazione invoca la funzione [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) passando due parametri: una funzione che incrementa lo stato del contatore e un timeout di un secondo:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

La funzione passata come primo parametro alla funzione _setCounter_ viene invocata un secondo dopo l'invocazione della funzione _setTimerout_.

```js
() => setCounter(counter + 1)
```

Quando la funzione di modifica dello stato _setCounter_ viene invocata, <i>React aggiurna il componente</i> ri-eseguendo la funzione che definisce il componente.

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

Alla seconda esecuzione, la funzione componente invoca la funzione _useState_ e restituisce il nuovo valore dello stato: 1. Eseguendo nuovamente il corpo della funzione esso effettua una nuova invocazione di _setTimeout_ che imposta un nuovo timeout di un secondo e incrementa di uno il valore del _counter_. Dato che il valore della variabile _counter_ è 1, incrementare il valore di 1 è essenzialmente equivalente a un'espressione che imposti il valore di _counter_ a 2. 
The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of _counter_ to 2.

```js
() => setCounter(2)
```

Nel frattempo, il vecchio valore di _counter_ - "1" - viene mostrato sullo schermo.

Ogni volta che _setCounter_ modifica lo stato, causa un aggiornamento del componente. Il valore dello stato sarà incrementato di nuovo di uno dopo un secondo e quenso continuerà a ripetere finché l'applicazione resta in esecuzione.

Se un componente non si aggiorna quando pensi che dovrebbe, o se si aggiorna "al momento sbagliato", puoi effettuare il debug dell'applicazione stampando nella console i valori delle variabili del componente. Se facciamo la seguente aggiunta al codice: 

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

è facile vedere e seguire le chiamate fatte alla funzione _render_ del componente <i>App</i>:

![](../../images/1/4e.png)

### Gestione degli eventi

Abbiamo già menzionato i <i>gestori degli eventi</i> che sono registrati per essere invocati quando si verificano eventi specifici nella [sezione 0](/it/part0). Ad esempio, l'interazione di un utente con diversi elementi della pagina può scatenare l'invocazione din un variegato insieme di eventi.

Modifichamo l'applicazione in modo che l'incremento del contatore avvenga quando un utente preme un bottone, che è implementato dall'elemento [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).

Gli elementi button supportano i cosiddetti [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), dei quali [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) à il più comune. Il click di un bottone può anche essere attivato con la tastiera o con uno schermo touch, a dspetto del nome <i>mouse event</i>.

In React, [registrare una funzione di gestione di eventi](https://reactjs.org/docs/handling-events.html) di <i>click</i> avviene così:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

Impostiamo il valore dell'attributo <i>onClick</i> del bottone a una referenza alla funzione _handleClick_ definita nel codice.

Ora ogni pressione del bottone <i>plus</i> causa l'invocazione della funzione _handleClick_, il che significa che ogni click stamperà nella console il messaggio <i>clicked</i>.

La funzione event handler può anche essere definita direttamente nell'assegnamento dell'attributo onClick:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

Modificando l'event handler nella forma seguente

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

raggiungiamo l óbiettivo atteso, ovvero che il valore di _setCounter_ sia incrementato di uno <i>e</i> che il componente si aggiorni.

Aggiungiamo anche un bottone per resettare il contatore:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

La nostra applicazione è ora pronta!

### L'event handler è una funzione

Definiamo la funzione event handler dei nostri bottoni nella definizione del loro attributo <i>onClick</i>:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Cosa accadrebbe se cercassimo di definire la funzione in modo più semplice?

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

La nostra applicazione smetterebbe completamente di funzionare:
![](../../images/1/5c.png)

Cosa succede? Si suppone che un event handler sia una <i>funzione</i> o un <i>riferimento a una funzione</i>, e quando scriviamo:

```js
<button onClick={setCounter(counter + 1)}>
```

l'event handler in realtà è una invocazione di funzione. In molte situazioni questo va bene, ma non in questo caso specifico. All'inizio il valore della variabile <i>counter</i> è 0. Quando React visualizza il componente per la prima volta, esegue la chiamata <em>setCounter(0+1)</em>, e modifica il valore di stato del componente.Questo farà sì che il componente si aggiorni, React eseguirà di nuovo la chiamata alla funzione setCounter e lo stato cambierà portando a un nuovo aggiornamento... 

Definiamo l'event handler come prima:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Ora l'attributo del bottone che definisce cosa accade alla pressione delo bottone - <i>onClick</i> - ha il valore _() => setCounter(counter + 1)_. La funzione _setCounter_ viene invocata solo quando l'utente preme il pulsante.

Di solito definire gli event handler all'interno di template JSX non è buona prassi. Qui è accettabile perché i nostri gestori di eventi sono molto semplici.

Separiamo comunque i gestori di eventi in funzioni dedicate:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

Qui gli event handler sono definiti correttamente. Il valore dell'attributo <i>onClick</i> è una variabile contenente un riferimento alla funzione:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Passare lo stato ai componenti figli

E` consigliato creare componenti React piccoli e riusabili in diversi punti dell'applicazione e anche in progetti diversi. Ristrutturiamo la nostra applicazione in modo che sia fatta da tre componenti più piccoli, uno per mostrare il contatore e due per i pulsanti.

Iniziamo a implementare un componente <i>Display</i> responsabile di mostrare il valore del contatore.

Una buona pratica in React è di [alzare lo stato di livello (lift state up)](https://reactjs.org/docs/lifting-state-up.html) nella gerarchia dei componenti. La documentazione recita:

> <i>Spesso, diversi componenti hanno bisogno di rispecchiare le modifiche agli stessi dati. Raccomandiamo di portare lo stato condiviso ad un livello più alto della gerarchia costituito dal più prossimo antenato comune.</i>

Collochiamo quindi lo stato dell'applicazione nel componente <i>App</i> e passiamolo in giù al componente <i>Display</i> attraverso le sue <i>props</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

L'uso del componente è lineare, dato che abbiamo solo bisogno di passagli lo stato del _counter_:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

Tutto continua a funzionare. Quando i pulsanti sono premuti l'<i>App</i> viene aggiornata e anche tutti i suoi figli incluso il componente <i>Display</i> sono aggiornati.

Ora, creiamo un componente <i>Button</i> per i pulsanti della nostra applicazione. Dobbiamo passare l'event handler e il titolo del bottone attraverso le props del componente:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Il nostro componente <i>App</i> ha ora questo aspetto:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Dato che ora abbiamo un componente <i>Button</i> facilmente riusabile, abbiamo  implementato anche una nuova funzionalità nella nostra applicazione aggiungendo un bottone che può decrementare il contatore.

Il gestore di eventi è passato al componente <i>Button</i> component attraverso la prop _onClick_. Il nome della proprietà non ha di per sé un significato particolare, ma la scelta del nome che abbiamo fatto non è stata completamente casuale. Il [tutorial](https://reactjs.org/tutorial/tutorial.html) ufficiale di react suggerisce questa convenzione.

### Le modifiche allo stato causano l'aggiornamento

Torniamo ancora una volta sui principi fondamentali di funzionamento di un'applicazione.

Quando l'applicazione parte, il codice in _App_ viene eseguito. Il codice usa l'hook [useState](https://reactjs.org/docs/hooks-reference.html#usestate) per creare lo stato dell'applicazione, impostando un valore iniziale nella variabile _counter_.
L'applicazione contiene il componente _Display_ - che mostra il valore del contatore, 0 - e tre componenti _Button_. Tutti i bottoni hanno un event handler, usato per modificare lo stato del contatore.

Alla pressione di uno dei bottoni, l'event handler viene invocato. L'event handler modifica lo stato del componente _App_ attraverso la funzione _setCounter_.
**Invocare una funzione che modifica lo stato causa l'aggiornamento del componente.**

Quindi, se un utente preme il bottone <i>plus</i> l'event handler del bottone imposta il valore di _counter_ a 1, e il componente _App_ viene aggiornato. 
Questo fa sì che i suoi sottocomponenti _Display_ e _Button_ vengano a loro volta ggiornati. 
_Display_ riceve il nuovo valore del contatore, 1, come props. Il componente _Button_ riceve dei gestori di eventi che possono essere usati per modificare lo stato del contatore.

### Refactoring dei componenti

Il componente che mostra il valore del contatore è il seguente:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Il componente usa solo il campo _counter_ delle sue <i>props</i>. Ciò significa che possiamo semplificare il componente attraverso la [destrutturazione](/it/part1/stato_dei_componenti_event_handlers#destrutturazione), in questo modo:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

LA funzione che definisce il componente contiene solo l'istruzione di ritorno, possiamo quindi definire la funzione usando la forma compatta a freccia:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

Possiamo semplificare anche il componente _Button_.

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Possiamo usare la destrutturazione per ottenere i soli campi richiesti dalle <i>props</i>, e adottare la forma compatta a freccia:

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

Potremmo semplificare ulteriormente il componente _Button_ dichiarando lístruzione di ritorno su una sola riga:

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

Tuttavia, va fatta attenzione a non semplificare eccessivamente i componenti, poiché questo rende più difficile aggiungere complessità in seguito.

</div>
