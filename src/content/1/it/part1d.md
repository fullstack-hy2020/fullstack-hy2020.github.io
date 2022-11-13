---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: it
---

<div class="content">

### Una precisazione sulla versione di React

La versione 18 di React è stata rilasciata nel Marzo 2022. Il codice in questo corso dovrebbe funzionare con la nuova versione di React. Tuttavia, alcune librerie potrebbero non essere ancora compatibili con la nuova versione di React. Al momento della scrittura (4 Aprile) almeno il client Apollo usato nella [sezione 8](/it/partt8) non funziona ancora con la versione più recente di React.

Nel caso vi trovaste nella situazione in cui l'applicazione non funziona a causa di problemi di compatibilità delle versioni, effettuate il <i>downgrade</i> alla versione di React precedente modificando il file <i>package.json</i> come di seguito:

```js
{
  "dependencies": {
    "react": "^17.0.2", // highlight-line
    "react-dom": "^17.0.2", // highlight-line
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.4"
  },
  // ...
}
```

Una volta fatta la modifica, occorre reinstallare le dipendenze eseguendo il comando:

```js
npm install
```

Si noti inoltre che il file <i>index.js</i> necessita alcuni adeguamenti. Per la versione 17 di React appare così:

```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

mentre per la versione 18 la forma corretta è:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

### Stato complesso

Nell'esempio precedente lo stato dell'applicazione era semplice e consisteva di un singolo intero. Cosa cambierebbe se la nostra applicazione avesse bisogno di uno stato più complesso?

Nella maggior parte dei casi il modo migliore e più semplice è usando la funzione _useState_ più volte per creare diversi "pezzi" di stato.

Nel codice seguente due pezzi di stato vengono creati per l'applicazione, denominati _left_ e _right_ ed entrambi inizializzati a 0:

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

Il componente accede alle funzioni _setLeft_ e _setRight_ che può usare per aggiornare i due elementi di stato.

Lo stato del componente o un suo pezzo possono essere di qualsiasi tipo. Potremmo implementare la medesima funzionalità salvando il contatore dei click dei bottoni <i>left</i> e <i>right</i> in un singolo oggetto:

```js
{
  left: 0,
  right: 0
}
```

In questo caso l'applicazione aparirebbe così:

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

Ora il componente ha un singolo elemento di stato e gli event handler devono occuparso di modificare <i>l'intero stato dell'applicazione</i>.

L'event handler risulta un po' contorto. Quando viene premuto il bottone destro, viene invocata la funzione seguente:

```js
const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

L'oggetto seguente viene impostato come nuovo stato dell'applicazione:

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

Il nuovo valore della proprietà <i>left</i> è uguale al valore di <i>left + 1</i> dallo stato precedente, e il valore della proprietà <i>right</i> ha lo stesso valore della proprietà <i>right</i> dallo stato precedente.

Possiamo definire il nuovo stato in maniera un po' più pulita usando la sintassi [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) aggiunta alla specifica del linguaggio nell'estate del 2018.

```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

A prima vista la sintassi può aparire un po' strana. In pratica <em>{ ...clicks }</em> crea un nuovo oggetto che ha delle copie di tutte le proprietà dell'oggetto _clicks_. Quando specifichiamo una proprietà specifica - ad esempio <i>right</i> in <em>{ ...clicks, right: 1 }</em>, il valore della proprietà _right_ sarà 1 nel nuovo oggetto. 

Nell'esempio sopra, questo codice:

```js
{ ...clicks, right: clicks.right + 1 }
```

crea una copia dell'oggetto _clicks_ in cui il valore della proprietà _right_ è incrementato di uno.

Non è necessario assegnare l'oggetto a una variabile nell'event handler e possiamo semplificare le funzioni nella forma seguente:

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

Qualche lettore potrebbe chiedersi perché non abbiamo semplicemente aggiornato lo stato direttamente, ad esempio così:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

L'applicazione sembra funzionare. Tuttavia, <i>in React è vietato mutare direttamente lo stato</i>, dato che [può portare a effetti indesiderati](https://stackoverflow.com/a/40309023). La modifica dello stato deve essere sempre effettuata assegnando allo stato un nuovo valore. Se le proprietà del precedente stato non sono cambiate, devono semplicemente essere copiate, il che è ottenuto copiando le proprietà in un nuovo oggetto e impostando questo come nuovo stato.

Memorizzare tutto lo stato in un singolo oggetto non è una buona idea in questa particolare applicazione; non c'è alcun beneficio evidente e l'applicazione che ne risulta è decisamente più complessa. In questo caso salvare i contatori di click in elementi di stato distinti è una scelta più opportuna.

Ci sono situazioni dove può risultare conveniente salvare un pezzo di stato dell'applicazione in una struttura dati più complessa. [L documentazione ufficiale di React](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contiene alcuni suggerimenti utili sull'argomento.

### Gestire gli array

Aggiungiamo alla nostra applicazione un elemento di stato contenente l'array _allClicks_ che memorizza i click avvenuti nell'applicazione.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end  

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end  

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Tutti i clieck sono salvati in un elemento di stato separato denominato _allClicks_, che è inizializzato all'array vuoto:

```js
const [allClicks, setAll] = useState([])
```

QUando viene premuto il tasto <i>left</i> aggiungiamo la lettera <i>L</i> all'array _allClicks_:

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

L'elemento di stato memorizzato in _allClicks_ viene impostato all'array contenente tutti gli elementi dell array dallo stato precedente più la lettera <i>L</i>. L'aggiunta del nuovo elemento all'array è ottenuta col metodo [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), che non muta l'array esistente ma restituisce una <i>nuova copia dell'array</i> con il nuovo elemento aggiunto.

Come detto in precedenza, in JavaScript è anche posibile aggiungere un elemento a un array col metodo [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Se aggiungessimo l'elemento con il push nell'array _allClicks_ e poi aggiornassimo lo stato, apparentemente l'applicazione continuerebbe a funzionare:

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

Tuttavia, __non fatelo__. Come detto in precedenza, lo stato dei componenti React come _allClicks_ non deve essere mutato direttamente. Anche se a volte mutare lo stato sembra funzionare, può portare a problemi che sono davvero difficili da analizzare.

Vediamo più da vicino come il click è nmostrato in pagina:

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

sSull'array _allClicks_ invochiamo il metodo [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join), che unisce gli elementi in un'unica stringa, con elementi separati dalla stringa passata come parametro alla funzione, uno spazio vuoto nel nostro caso.

### Visualizzazione condizionale

Modifichiamo l'applicazione in modo che la visualizzazione della storia dei click sia gestita da un nuovo componente <i>History</i>:

```js
// highlight-start
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

Ora il comportamento del componente dipende dal fatto che siano stati premuti dei bottoni o meno. In caso negativo, ovvero se l'array <em>allClicks</em> è vuoto, il componente viaualizza un  elemento div con delle istruzioni d'uso:

```js
<div>the app is used by pressing the buttons</div>
```

In tutti gli altri casi, il componente mostra lo storico dei click:

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

Il componente <i>History</i> mostra elementi React completamente diversi a seconda dello stato dell'applicazione. Si parla di <i>visualizzazione condizionale (conditional rendering)</i>.

React offre molte altre modalità di fare [conditional rendering](https://reactjs.org/docs/conditional-rendering.html). Vedremo questo argomento più in dettaglio nella [sezione 2](/it/part2).

Facciamo un'ultima modifica all'applicazione in modo che utilizzi il componente _Button_ che abbiamo definito in precedenza:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// highlight-start
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
// highlight-end

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### Vecchio React

In questo corso usiamo gli [state hook](https://reactjs.org/docs/hooks-state.html) per aggiungere lo stato ai componenti React, funzionalità che è parte della nuova versione di React ed è disponibile dalla versione [16.8.0](https://www.npmjs.com/package/react/v/16.8.0) in poi. Prima dell'introduzione degli hook, non c'era modo di aggiungere stato ai componenti funzionali. I componenti che richiedevano stato dovevano essere definito come [class components](https://reactjs.org/docs/react-component.html) usando la sintassi delle classi di JavaScript.

In questo corso abbiamo fatto la decisione piuttosto radicale di usare esclusivamente gli hook dal primo giorno, per essere sicuri di imparare lo stile corrente e futuro di React. Anche se i componenti funzionali sono il futuro di React, è ancora importante imparare la sintassi a classi, dato che ci sono miliardi di righe di codice legacy in React che potreste trovarvi a dover manutenere. La stessa cosa si aplica alla documentazione e a esempi di React in cui opotreste imbattervi in rete.

Impareremo di più sui class components di React più avanti nel corso.

### Debug di applicazioni React

Una parte considerevole della tipica giornata di uno sviluppatore viene spesa nel debug e nella lettura di codice esistente. Di tanto in tanto ci può capitare di scrivere un paio di nuove righe di codice, ma gran parte del nostro tempo è speso nel tentativo di comprendere perché qualcosa non stia funzionando o come qualcosa stia funzionando. Buone pratiche e buoni strumenti per il debug sono estremamente importanti per questo motivo.

Per nostra fortuna, React è una libreria estremamente developer-friendly per quanto riguarda il debug.

Prima di procedere, ripassiamo una delle più importanti regole dello sviluppo web.

<h4>La prima regola dello sviluppo Web</h4>

>  **Tieni sempre aperti gli strumenti per sviluppatori del tuo browser**
>
> Il tab <i>Console</i> in particolare dovrebbe essere sempre aperto, a meno che non ci sia una ragione specifica per vedere un tab differente.

Tieni sia il tuo codice che la pagina web aperti **contemporaneamente**.

Se e quando il tuo codice smette di compilare e il tuo browser mostra qualcosa di simile a un albero di Natale:

![](../../images/1/6x.png)

non scrivere altro codice ma piuttosto trova e correggi **immediatamente** il problema. Deve ancora arrivare il momento nella storia della programmazione in cui del codice che non compila inizia improvvisamente a funzionare dopo aver scritto un altro bel po' di codice aggiuntivo. Dobito anche che questo evento possa materializzarsi in questo corso.

Il debug vecchia scuola, basato sulla stampa, è sempre una buona idea. Se il componente

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

non funziona come atteso, è utile iniziare a stampare le sue variabili nella console. Per farlo eficacemente, dobbiamo trasformare la nostra funzione nella formameno compatta e ricevere l'intero oggetto props senza farne l'immediata destrutturazione:

```js
const Button = (props) => { 
  console.log(props) // highlight-line
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
```

Questo rivelerà immediatamente se, per esempio, uno degli attributi è stato scritto male nell'uso del componente.

**NB** Quando usi _console.log_ per fare il debug, non combinare gli oggetti con l'operatore + come si farebbe in Java. Invece di scrivere:

```js
console.log('props value is ' + props)
```

Separa gli oggetti da stampare con delle virgole:

```js
console.log('props value is', props)
```

Usando lo stile Java di concatenare striinghe e oggetti, si ottengono messaggi scarsamente informativi:

```js
props value is [Object object]
```

D'altra parte, gli elementi separati da virgole saranno disponibili nella console JavaScript per essere ulteriormente ispezionati.

Il log a console non è assolutamente l'unico modo di eseguire il debug delle nostre applicazione. E' possibile mettere in pausa l'esecuzione dell'applicazione nel <i>debugger</i> della conole per sviluppatori di Chrome scrivendo il comando [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) ovunque nel codice.

L'esecuzione si metterà in pausa una volta arrivata al punto in cui il comando _debugger_ viene eseguitoL:

![](../../images/1/7a.png)

Andando sul tab <i>Console</i> tab, è facile ispezionare lo stato corrente delle variabili:

![](../../images/1/8a.png)

Una volta individuata la cusa del bug è possibile rimuovere il comando _debugger_ e aggiornare la pagina.

Il debugger consente anche di eseguire il codice una linea alla volta tramite i controlli che si trovano alla destra del tab <i>Sources</i>.

Si può accedere al debugger anche senza il comando _debugger_ aggiungendo dei breakpoint nel tab <i>Sources</i>. L'ispezione dei valori delle variabili dei componenti può essere effettuata nella sezione _Scope_: 

![](../../images/1/9a.png)

Si consiglia caldamente di aggiungere a Chrome l'estensione [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Questa aggiunge un nuovo pannello _Components_ agli strumenti per sviluppatori. Il nuovo tab può essere usato per ispezionare i diversi componenti React nell'applicazione così come le loro props:

![](../../images/1/10ea.png)

Lo stato del componente _App_ è così definito:

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

Gli strumenti per sviluppatori mostrano lo stato degli hook in ordine di definizione:

![](../../images/1/11ea.png)

Il primo <i>State</i> contiene il valore della variabile di stato <i>left</i>, il successivo contiene il valore della variabile di stato <i>right</i> e l'ultimo contiene il valore della variabile di stato <i>allClicks</i>.

### Regole degli Hooks

Ci sono alcune limitazioni e regle da seguire per assicurare che la nostra applicazione usi in maniera corretta le funzioni di stato basate su hook.

La funzione _useState_ (così come la _useEffect_ introdotta più avanti nel corso) <i>non deve essere invocata</i> all'interno di un ciclo, un'espressione condizionale, o qualsiasi altro punto che non sia una funzione che definisce un componente. Questo al fine di assicurare che gli hook vengano sempre chiamati nello stesso ordine, e in caso contrario si avrebbero dei comportamenti imprevedibili.

Ricapitolando, gli hook possono essere invocati solo all'interno del corpo di una funzione che definisce un componente React:

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Gestione degli eventi rivisitata

La gestione degli eventi si è dimostrata essere un argomento complesso nelle precedenti edizioni di questo corso.

Per questo motivo rivisiteremo l'argomento.

Assumiamo di dover sviluppare questa semplice applicazione con il componente  <i>App</i> seguente:

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

Vogliamo che il click sul bottone reimposti lo stato memorizzato nella variabile _value_.

Per far sì che il bottone reagisca all'evento click, dobbiamo aggiungergli un <i>event handler</i>.

Gli event handler devono sempre essere una funzione oppure una referenza a una funzione. Il bottone non funzionerebbe se l'event handler fosse impostato a una variabile di qualsiasi altro valore.

Se dovessimo definire l évent handler come stringa:

```js
<button onClick="crap...">button</button>
```

React ci avviserebbe di questo nella console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

Anche il tentativo seguente non avrebbe successo:

```js
<button onClick={value + 1}>button</button>
```

Abbiamo cercato di impostare il gestore di eventi a _value + 1_ che semplicemente restutisce il risultato dell'operazione. React ci avviserebbe di questo nella cnsole:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

Anche questo tentativo non funzionerebbe:

```js
<button onClick={value = 0}>button</button>
```

Il gestore di eventi non è una funzione, ma un assegnamento di variabile, e React ci darebbe ancora una volta un messaggio di avvertimento nella console. Queston tentativo è anche errato nel senso che non dovremmo mai mutare direttamente lo stato in React.

E questo?

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

Il messaggio viene stampato a console una volta quando il componente viene visualizzato in pagina, ma nulla accade quando premiamo il bottone. Perché non funziona sebbene il nostro event handler contenga una funzione _console.log_?

Il problema qui è che il gestore di eventi è definito come una <i>chiamata di funzione</i>, il che significa che al gestore di eventi viene assegnato il risultato dell'invocazione della funzione, che nel cao di _console.log_ è <i>undefined</i>.

La chiamata alla funzione _console.log_ viene effettuata quando il componente viene visualizzato e per questo motivo il messaggio viene stampato una volta in console.

Anche il seguente tentativo non è corretto:

```js
<button onClick={setValue(0)}>button</button>
```

Ancora una volta abbiamo cercato di assegnare un'invocazione di funzione come event handler. Questo non funziona. Questo tentativo causa inoltre un altro problema. Quando il componente viene visualizzato, la funzione _setValue(0)_ viene eseguita, il che causa il ri-aggiornamento del componente. Questo a sua volta invoca nuovamente le funzione _setValue(0)_, causando una ricorsione infinita.

L'esecuzione di una specifica funzione al click del bottone può essere ottenuta come segue:

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

Ora l'event handler è una funzione definista con la sintassi a freccia _() => console.log('clicked the button')_. Quando il componente viene visualizzato, nessuna funzione viene invocata, semplicemente la referenza alla arrow function viene impostata come vanlore dell'event handler. L'invocazione della funzione avviene solo quando il bottone viene premuto.

Possiamo impplementare il reset dello stato dell'applicazione esattamente con la medesima tecnica:

```js
<button onClick={() => setValue(0)}>button</button>
```

Il gestore di eventi è ora la funzione _() => setValue(0)_.

Definire gli event handler direttamente nell'attributo del bottone non è necessariamente la tecnica migliore.

Vedrete di frequente event handler definiti altrove. Nella versione seguente dell'applicazione definiamo una funzione che viene poi assegnata alla variabile _handleClick_ nel corpo della funzione del componente:

You will often see event handlers defined in a separate place. In the following version of our application we define a function that then gets assigned to the _handleClick_ variable in the body of the component function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

La variabile _handleClick_ è ora assegnata a una referenza alla funzione. La referenza è passata al bottone come valore dell'attributo <i>onClick</i>:


```js
<button onClick={handleClick}>button</button>
```

Naturalmente la nostra funzione che gestisce l'evento può essere composta da più comandi. In questo caso usiamo la forma con le parentesi graffe per la funzione a freccia:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### Funzioni che restituiscono funzioni

Un altro modo fi definire un event handler è l'uso di una <i>funzione che restituisce una funzione</i>.

Probabilmente non avrai bisogno in questo corso di utilizzare funzioni che restituiscono funzioni. Se questo argomento causa confusione è possibile saltare questa sezione e ritornarci in un momento successivo.

Modifichiamo il codice come segue:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello world')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

Il codice funziona correttemente anche se sembra complicato:

L'event handler è ora impostato alla chiamata a una funzione:

```js
<button onClick={hello()}>button</button>
```

Prima abbiamo detto che un event handler non dovrebbe essere una chiamata di funzione, e che dovrebbe essere una definizione di funzione o un riferimento ad essa. Perché allora l'invocazione di una funzione è corretta in questo caso?

Quando il componente viene visualizzato, la funzione seguente viene eseguita:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

Il <i> valore di ritorno</i> della funzione è un'altra funzione che è assegnata alla variabile _handler_.

Quando React visualizza la linea:

```js
<button onClick={hello()}>button</button>
```

Assegna il valore restituito da _hello()_ all'attrinuto onClick. Sostanzialmente la riga viene trasformata in:

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

Dato che la funzione _hello()_ restituisce una funzione, l'event handler è ora una funzione.

Qual è il punto di questo concetto?

Facciamo qualche piccola modifica al codice:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end  

  return (
    <div>
      {value}
  // highlight-start      
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end      
    </div>
  )
}
```

Ora l'applicazione ha tre bottoni con gestori di eventi definiti dalla funzione _hello()_ che accetta un parametro.

Il primo bottone è definito come:

```js
<button onClick={hello('world')}>button</button>
```

L'event handler viene creato <i>eseguendo</i> la chiamata di funzione _hello('world')_. La chiamata alla funzione restituisce la funzione:

```js
() => {
  console.log('hello', 'world')
}
```

La seconda funzione è definita come:

```js
<button onClick={hello('react')}>button</button>
```

La chiamata alla funzione _hello('react')_ che crea l'event handler restituisce:

```js
() => {
  console.log('hello', 'react')
}
```

Entrambi i bottoni hanno il loro event handelr specifico.

Le funzioni che restituiscono funzioni possono essere utilizzate per definire funzionalità generiche che possono essere personalizzate tramite parametri. La funzione _hello_ che crea gli event handler può essere pensata come un costruttore che produce getori di eventi specifici per salutare gli utenti.

La nostra attuale versione è un po' verbosa:

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Eliminiamo la funzione di supporto e retituiamo direttamente la funzione creata:

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Dato che la funzione _hello_ è composta solamente da un comando return, possiamo omettere le parentesi graffe e usare la sintassi compatta a freccia:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Infine, scriviamo su un'unica riga tutte le frecce:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

Possiamo usare lo stesso trucco per definire gestori di eventi che impostano lo stato del componente a un determinato valore. Modifichiamo il nostro codice come segue:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  // highlight-end
  
  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

Alla creazione del componente, viene crato anche il bottone <i>thousand</i>:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

L'event handler restituirà il valore di _setToValue(1000)_ che è la funzione seguente:

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

Il bottone per incrementare è così dichiarato:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

Il gestore di eventi è creato dalla chiamata alla funzione _setToValue(value+ 1 )_ che riceve come parametro il vaore corrente della variabile di stato _value_ incrementato di uno. Se il valore di _value_ fosse 10, allora l'event handler creato sarebe la funzione:

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

L'utilizzo di funzioni che restituiscono funzioni non è indispensabile per realizzare questa funzonalità. Facciamo tornare la funzione _setToValue_ responsabile di aggiornare lo stato una funzione normale:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

Possiamo ora definire l'event handler come una funzione che invoca la funzione _setToValue_ con il parametro opportuno. Il gestore di eventi per resettare lo stato del'applicazione sarebbe:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Scegliere una delle sue modalità illustrate per definire i gestori di eventi è sostanzialmente una questione di gusti.

### Passare i gestori di eventi ai componenti figli

Estraiamo il bottone nel rispettivo componente:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

Il componente riceve la funzione event handler dalla proprietà _handleClick_, e il testo del bottone dalla proprietà _text_.

Usare il componente <i>Button</i> è semplice, anche se dobbiamo assicurarci che usiamo i nomi di attributo corretti quando passiamo le props al componente

![](../../images/1/12e.png)

### Non definire componenti dentro altri componenti

Iniziamo a mostrare lo stato dell'applicazione in un componente dedicato <i>Display</i>.

Modifichiamo l'applicazione definendo un nuovo componente all'interno del componente <i>App</i>.

```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

Apparentemente l'applicazione continua a funzionare, ma **non implementate componenti in questo modo!** Non si deve mai definire un componente all'interno di un altro componente: non c'è nessun vantaggio nel farlo e può portare a diversi problemi spiacevoli. I problemi maggiori sono dovuti al fatto che React tratta un componente definito all'interno di un altro componente come un componente nuovo ad ogni visualizzazione. Ciò rende impossibile a React ottimizzare il componente.

Spostiamo invece la funzione componente <i>Display</i> al posto corretto, al di fuori della funzione componente <i>App</i>.

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### Letture utili

La rete è piena di materiale su React.  Tuttavia, qui usiamo il nuovo stile di React per il quale gran parte del materiale che si trova online è obsoleto.

I link seguenti potrebero essere utili::

- La [documentazione ufficiale di React](https://reactjs.org/docs/hello-world.html) merita di essere vista, sebbene gran parte di essa diventerà rilevante solo più avanti nel corso. Inoltre, tutto ciò che è correlato ai class-components non è rilevante in questo contesto;
- Alcuni corsi su [Egghead.io](https://egghead.io) come [Start learning React](https://egghead.io/courses/start-learning-react) sono di alta qualità, e anche [The Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs), aggiornato di recente, è di buona qualità; entrambi i corsi introducono concetti che saranno trattati più avanti anche in questo corso. both courses introduce concepts that will also be introduced later on in this course. **NB** Il primo usa class component mentre il secondo usa i nuovi componenti funzionali.

</div>

<div class="tasks">

<h3>Esercizi  1.6.-1.14.</h3>

Sottometti le tue soluzioni agli esercizi facendo il push del codice su GitHub e poi spuntando gli esercizi completato nel [sistema di sottomissione online](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Ricorda, sottometti **tutti** gli esercizi di una parte **in un'unica sottomissione**. Una volta sottoessi gli esercizi per una parte, **non è più possibile aggiungere altri esercizi per quella stessa parte**.

<i>Alcuni esercizi operano sulla stessa applicazione. In questi casi è sufficiente sottomettere la versione finale dell'applicazione. Se vuoi, puoi fare un commit per ogni esercizio completato, ma non è obbligatorio.</i>

**ATTENZIONE** create-react-app trasformerà automaticamente la tua applicazione in un repository git a meno che la tua applicazione non venga creata all'interno di un altro repository git. **Molto probabilmente non si vorrà create un nuovo repository Git per ciascun progetto**, perciò esegui semplicemente il comando _rm -rf .git_ dalla radice dell'applicazione.

In alcuni casi è anche necessario eseguire il codice seguente dalla radice del progetto:
``` 
rm -rf node_modules/ && npm i
```

<h4> 1.6: unicafe step1</h4>

Come molte aziende, [Unicafe](https://www.unicafe.fi/#/9/4) raccoglie feedback dai suoi clienti. Il tuo compito è di implementare un'applicazione web per la raccolta dei feedback. Ci sono solo tre opzioni per il feedback: <i>good</i>, <i>neutral</i>, e <i>bad</i>.

L'applicazione deve mostrare il numero totale di feedback raccolti per ciascuna categoria. L'applicazione finale potrebbe apparire così:

![](../../images/1/13e.png)

Si noti che l'applicazione deve funzionare in una singola sessione del browser. Quando la pagina viene ricaricata, è consentito che i feedback spariscano.

Si consiglia di utilizzare la stessa struttura suata nel materiale e nellésercizio precedente. Il file <i>index.js</i> appare così:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Puoi usare il codice seguente come punto di partenza per il file App.js:

```js
import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

<h4>1.7: unicafe step2</h4>

Esapndi l'applicazione in modo che mostri più statistiche sul feedback raccolto: il numero totale di feedback raccolti, il voto medio (good: 1, neutral: 0, bad: -1)  e la percentuale di voti positivi.

![](../../images/1/14e.png)

<h4>1.8: unicafe step3</h4>

Modifica l'applicazione in modo che la visualizzazione delle statistiche sia estratta nel suo proprio componente <i>Statistics</i>. Lo stato dell'applicazione deve rimanere nel componente radice <i>App</i>.

Ricorda che i componenti non devono essere definiti all'interno di altri componenti:

```js
// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe step4</h4>

Modifica la tua applicazione per mostrate le statistiche solo dopo che il feedback è stato raccolto.
Change your application to display statistics only once feedback has been gathered.

![](../../images/1/15e.png)

<h4>1.10: unicafe step5</h4>

Continuiamo a modificare l'applicazione. Estrai i seguenti componenti:

- <i>Button</i> per definire i bottoni usati per sottomettere il feedback
- <i>StatisticLine</i> per mostrare una singola statisctica, ad esempio il punteggio medio.

Per chiarezza: il componente <i>StatisticLine</i> mostra sempre una singola statistica, vale  a dire che l'applicazione usa più componenti per visualizzare tutte le statistiche:

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value ={...} />
      <StatisticLine text="neutral" value ={...} />
      <StatisticLine text="bad" value ={...} />
      // ...
    </div>
  )
}

```

Lo stato dell'applicazione deve ancora essere mantenuto nel componente radice <i>App</i>.

<h4>1.11*: unicafe step6</h4>

Mostra le statistiche in una [tabella](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) HTML, così che l'applicazione appaia approssimativamente così:

![](../../images/1/16e.png)

Ricorda di mantenere la console sempre aperta. Se vedi questo avviso in console:

![](../../images/1/17a.png)

Allora fai le modifiche necessarie per farlo sparire. Prova a ricercare il messaggio di errore online se ti trovi bloccato.

<i>La tipica fonte di un errore `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` è un'estensione di Chrome. Prova ad aprire `chrome://extensions/` e a disabilitarle una a una aggiornando la pagina React; alla fine l'errore dovrebbe sparire.</i>

**Assicurati d'ora in poi che non ci sia alcun messaggio di errore in console!**

<h4>1.12*: aneddoti step1</h4>

Il mondo del software è ricco di [aneddoti](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) che distillano intramontabili verità in frasi di una riga.

Elabora l'applicazione seguente aggiungendo un bottone che può essere premuto per mostrare un aneddoto <i>casuale</i>  dal campo dell'ingegneria del software:

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

Il contenuto del file <i>index.js</i> è il medesimo degli esercizi precedenti.

Trova come generare numeri casuali in JavaScript, ad esempio con un motore di ricerca o su [Mozilla Developer Network](https://developer.mozilla.org). Ricorda che puoi testare la generazione di numeri casuali direttamente nella console del browser.

La tua applicazione finita potrebbe apparire così:

![](../../images/1/18a.png)

**ATTENZIONE** create-react-app trasformerà automaticamente la tua applicazione in un repository git a meno che la tua applicazione non venga creata all'interno di un altro repository git. **Molto probabilmente non si vorrà create un nuovo repository Git per ciascun progetto**, perciò esegui semplicemente il comando _rm -rf .git_ dalla radice dell'applicazione.

In alcuni casi è anche necessario eseguire il codice seguente dalla radice del progetto:
``` 
rm -rf node_modules/ && npm i
```

<h4>1.13*: anecdotes step2</h4>

Espandi la tua applicazione così che sia possibile votare l'aneddoto mostrato.

![](../../images/1/19a.png)

**NB** salva i voti di ciascun aneddoto in un array o in un oggetto nello stato del componente. Ricorda che il modo corretto di aggiornare lo stato memorizzato in strutture dati complesse come oggetti o array è di fare copie dello stato.

E' possibile creare la copia di un oggetto così:

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1     
```

O una copia di un array nel seguente modo:

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1     
```

Un array potrebbe essere la scelta più semplice in questo caso. Una ricerca in rete fornirà numerosi suggerimenti su come [creare un array di zeri della dimensione desiderata](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1.14*: anecdotes step3</h4>

Ora implementa la versione finale dell'applicazione che mostra l áneddoto più votato:

![](../../images/1/20a.png)

In caso di pareggio tra più aneddoti è sufficiente mostrarne uno.

Questo era l'ultimo esercizio di questa sezione del corso ed è il momento di fare il push del codice su GitHub e di spuntare gli esercizi completati sul [sistema di sottomissione](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
