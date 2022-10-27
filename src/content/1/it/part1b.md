---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: it
---

<div class="content">

Durante questo corso abbiamol'obiettivo e la necessità di imparare a un livello sufficiente JavaScript oltre che lo sviluppo web.

JavaScript è notevolmente progredito negli ultimi anni e in questo corso utilizzeremo funzionalità introdotte nelle ultime versioni. Il nome ufficiale dello standard JavaScript è [ECMAScript](https://it.wikipedia.org/wiki/ECMAScript). Al momento la versione più recente è quella rilasciata nel Giugno del 2021 sotto il nome di[ECMAScript®2021](https://www.ecma-international.org/ecma-262/), altrimenti nota come ES12.

I browser non supportano ancora tutte le nuove funzionalità di JavaScript. Per questo motivo, molto del codice eseguito nei browser è stato <i>transpilato</i> dalle nuove versioni di JavaScript a una più vecchia e più compatibile.

Oggi il modo più diffuso di effettuare la transpilazione è usando [Babel](https://babeljs.io/). La transpilazione è automaticamente configurata nelle applicazioni React create usando create-react-app. Daremo uno sguardo più attento alla configurazione della transpilazione nella [sezione 7](/it/part7) del corso.

[Node.js](https://nodejs.org/en/) è un ambiente di esecuzione di JavaScript basato sul motore JavaScript [Chrome V8](https://developers.google.com/v8/) sviluppato da Google, e funziona praticamente ovunque, dai server ai telefoni cellulari. Facciamo pratica nella scrittura di JavaScript usando Node. Ci si aspetta che la versione di Node installata sulla tua macchina sia almeno la <i>16.13.2</i>. L'ultima versione di Node conosce già le ultime versioni di JavaScript, quindi il codice non ha bisogno di essere transpilato.

Il codice è scritto in file con estensione .js che sono eseguiti lanciando il comando <em>node nome\_del\_file.js</em>.

E' anche possibile scrivere codice JavaScript nella console Node.js, che si apre digitando  _node_ da linea di comando, così come nella console per sviluppatori del browser. [Le versioni più recenti di Chrome gestiscono abbastanza bene le funzionalità più moderne di JavaScript](http://kangax.github.io/compat-table/es2016plus/) senza bisogno di transpilare il codice. In alternativa è possibile utilizzare strumenti come [JS Bin](https://jsbin.com/?js,console).

JavaScript ricorda Java sia nel nome che nella sintassi. Ma per quanto riguarda i meccaniscmi di funzionamento del linguaggio non potrebbero essere più diversi. Venendo da un; esperienza in Java, il funzionamento di JavaScript può apparire strano, specialmente se non si fa lo sforzo di entrare nel dettaglio delle funzionalità.

In alcuni ambiti è anche stato popolare il tentativo di "simulare" in JavaScript funzionalità e design pattern propri di Java. Non raccomandiamo questo approccio dato che i linguaggi e i relativi ecosistemi sono intrinsecamente molto diversi.

### Variabili

In JavaScript ci sono diversi modi di definire variabili: 

```js
const x = 1
let y = 5

console.log(x, y)   // 1, 5 are printed
y += 10
console.log(x, y)   // 1, 15 are printed
y = 'sometext'
console.log(x, y)   // 1, sometext are printed
x = 4               // causes an error
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) in realtà non definisce una variabile ma una <i>costante</i> pe la quale il valore non può più essere modificato. D'altro canto, [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) definisce una normale variabile.

Nell'esempio sopra vediamo anche che il tipo di dato assegnato alla variabile può variare durante l'esecuzione. All'inizio _y_ contiene un numero intero e alla fine una stringa.

E' anche possibile definire variabili in JavaScript usando la parola chiave [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). var è stata per lungo tempo il solo modo di definire variabili. const e let were sono stati aggiunti solo di recente nella vesrione ES6. In alcune situazioni specifiche var funziona in modo diverso rispetto a come la definizione di variabili funziona nella maggior parte dei linguaggi - si veda [JavaScript Variables - Should You Use let, var or const? su Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) o [Keyword: var vs. let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) per maggiori informazioni. In questo corso l'uso di var è sconsigliato e dovresti usare const e let!
E'possibile trovare altro materiale su questo argomento su YouTube - ad esempio [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

### Array

Un [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) e un paio di esempi di utilizzo:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})                    
```

Da notare in questo esempio è il fatto che il contenuto dell'array può essere modificato sebbene sia definito come _const_. Poiché l'array è un oggettoo, la variabile punta sempre allo stesso oggetto. Tuttavia, il contenuto dell'array cambia man mano che nuovi elementi sono aggiunti.

Un modo di scorrere gli elementi di un array è usando _forEach_ come visto nell'esempio. _forEach_ riceve come parametro una <i>funzione</i> definita usando la sintassi a freccia (arrow function).

```js
value => {
  console.log(value)
}
```

forEach invoca la funzione <i>per ciascun elemento dell'array</i>, passando sempre un valore individuale come argomento. La funzione passata come argomento di forEach può anche ricevere [altri argomenti](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Nell'esempio precedente, un nuovo elemento è stato aggiunto all'array usando il metodo [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Quando si usa React è comune adottare tecniche di programmazione funzionale. Una caratteristiche della programmazione funzionale è l'uso di strutture dati [immutabili](https://en.wikipedia.org/wiki/Immutable_object) data structures. Nel codice React, è preferibile usare il metodo [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), che non aggiunge l'elemento all'array, ma crea un nuovo array che include sia il contenuto del vecchio array che il nuovo elemento.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```

La chiamata al metodo _t.concat(5)_ non aggiunge un nuovo elemento al vecchio array, ma restituisce un nuovo array che oltre a contenere i vecchi elementi, contiene anche il nuovo elemento.

Esiste una ricca varietà di metodi utili per lavorare con gli array. Vediamo un breve esempio di uso del metodo [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed
```

A partire dal vecchio array, map crea un <i>nuovo array</i>, i cui elementi sono creati usando la funzione passata come input. Nel caso di questo esempio il valore originale è moltiplicato per due.

Map può anche trasformare un array in qualcosa di completamente diverso:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```

Qui un array di numeri interi viene trasformato in un array contenente stringhe HTML usando il metodo map. Nella [sezione 2](/it/part2) del corso, vedremo che map è usata piuttosto di frequenete in React.

E' facile asegnare i singoli elementi di un array a variabili con l'aiuto dell'[assegnazione destrurante (destructuring assignment)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4, 5] is printed
```

Grazie all'aaegnazione, le variabili _first_ e _second_ will riceveranno i valori dei primi due interi dell'array. Gli interi rimanenti saranno "collezionati" in un array a loro dedicato che sarà assegnato alla variabile _rest_.

### Oggetti

Ci sono alcuni modi differenti di definire oggetti in JavaScript. Uno molto comune è l'uso degli [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), che avviene elencando le prioprietà tra parentesi graffe: 

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```
I valori delle proprietà possono essere di qualunque tipo, come interi, stringhe, array, oggetti...

Le proprietà di un oggetto sono referenziate tramite la notazione puntata o utilizzando le parentesi quadre:

```js
console.log(object1.name)         // Arto Hellas is printed
const fieldName = 'age' 
console.log(object1[fieldName])    // 35 is printed
```

E' anche possibile aggiungere proprietà a un oggetto in tempo reale usando la notazione puntata o le parentesi quadre:      

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

L'ultima aggiunta deve essere fatta usando le parentesi quadre perchè con la notazione puntata <i>secret number</i> non è un nome di property valido a causa del carattere spazio.

Naturalmente gli oggetti in JavaScript possono anche avere metodi. Tuttavia, in questo corso non avremo bisogno di definire oggetti con metodi propri. Questo è il motivo per cui sono trattati solo brevemente nel corso.

Gli oggetti possono anche essere definiti usando le cosiddette funzioni costruttori, il cui meccanismo ricorda quello di diversi altri linguaggi di programmazione, come ad esempio Java. A dispetto di queste somiglianze, JavaScript non ha classi nello stesso senso dei linguaggi di programmazione orientati agli oggettoi. C'è stata però un'aggiunta dlla <i>sintassi delle classi</i> a partire dalla versione ES6, che in alcune circostanze aiuta a strutturare classi orientate agli oggetti.

### Funzioni

Abbiamo già familiarizzato con la definizione di arrow function. Il processo completo, senza scorciatoie, per la definizione di una arrow function è il seguente:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

e la funzione viene invocata come ci si aspetterebbe:

```js
const result = sum(1, 5)
console.log(result)
```

Nel caso in cui ci sia un solo parametro, le parentesi tonde possono essere omesse dalla definizione della funzione:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

If the function only contains a single expression then the braces are not needed. In this case the function only returns the result of its only expression. Now, if we remove console printing, we can further shorten the function definition:

```js
const square = p => p * p
```

Questa forma è particolarmente comoda per la manipolazione di array, ad esempio usando il metodo map:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```

Le arrow function sono state aggiunte a JavaScript solo un apio di anni fa con la versione [ES6](http://es6-features.org/). In precedenza l'unico modo di definire le funzioni era tramite la parola chiave _function_.

Ci sono due modi di referenziare la funzione; una è dando un nome in una [dichiarazione di funzione](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function).

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result is now 12
```

L'altro modo di definizione di una funzione è utilizzando una [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In questo caso non c'è bisogno di dare un nome alla funzione e la definizione può risiedere con il resto del codice:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result is now 3.5
```

In questo corso definiremo tutte le funzioni usando la sintassi a freccia.

</div>

<div class="tasks">
  <h3>Esercizi 1.3.-1.5.</h3>

<i>Continuiamo a sviluppare l ápplicazione che abbiamo iniziato a lavorare negli esercizi precedenti. Puoi scrivere il codice nello stesso progetto, dato che siamo unicamente interessati allo stato finale dell'applicazione sottomessa.</i>

**Pro-tip:** potresti incontrare problemi quando si arriva alla struttura delle <i>props</i> che i componenti ricevono. Un buon modo per rendere le cose più chiare è stampare le props in console, ad esempio come segue:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: infromazioni sui corsi step3</h4>

Andiamo avanti utilizziando gli oggetti nella nostra applicazione. Modifica la definizione delle variabili nel componente <i>App</i> come segue e rivedi l'applicazione in modo che continui a funzionare:

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: infromazioni sui corsi step4</h4>

Quindi metti gli oggettiin un array. Modifica la definizione delle variabili nel componente <i>App</i> come segue e rivedi l'applicazione in modo che continui a funzionare:

```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**NB** per ora <i>puoi assumere che ci siano sempre tre elementi nell'array</i>, quindi non c'è bisogno di scorrere gli elementi usando cicli. Torneremo sull'argomento di come visualizzare componenti in base agli elementi di un array con un'esplorazione più approfondita [nella prossima sezione del corso](../part2).

Tuttavia, non passare props separate dal componente <i>App</i> ai componenti <i>Content</i> e <i>Total</i>. Invece passali direttamente come array:

```js
const App = () => {
  // const definitions

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: infromazioni sui corsi step5</h4>

FAcciamo un ulteriore passo avanti con le modifiche. Fondi il corso e le sue parti in un unico oggetto JavaScript. Correggi ciò che si rompe.

```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Metodi degli oggetti e "this"

Dato che nel corso stiamo utilizzando una versione di React che supporta i React Hooks non abbiamo necessità di definire oggetti con metodi. **I contenuti di questo capitono non sono rilevanti al fine del completamento del corso**, ma è certamente utile conoscerli sotto diversi punti di vista. In particolare quando si suano vecchie versioni di React è importante conoscere gli argomenti di questo capitolo.

Le funzioni freccia e le funzioni definite usando la parola chiave _function_ variano sensibilmente nel modo in cui si comportano rispetto alla parola chiave [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), che fa riferimento all'oggetto stesso.

Possiamo assegnare metodi a un oggetto assegnando proprietà che sono funzioni:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

arto.greet()  // "hello, my name is Arto Hellas" gets printed
```

I metodi possono essere assegnati a oggetti anche dopo la creazione degli oggetti stessi:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed
```

Modifichiamo leggermente l'oggetto:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed
```

Ora l'oggetto ha il metodo _doAddition_ che calcola la somma dei numeri che gli sono passati come parametri. Il metodo è invocato nel solito modo, attraverso l'oggetto <em>arto.doAddition(1, 4)</em> o salvando una <i>referenza al metodo </i> in una variabile e chiamando il metodo attraverso la variabile.: <em>referenceToAddition(10, 15)</em>.

Se cerchiamo di fare la stessa cosa con il metodo _greet_ incontriamo un problema:

```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```

Quando si invoca un matodo attraverso una referenza, il metodo perde la conoscenza di cosa _this_ fosse in origine. Al contrario di altri linguaggi, in JvaScript il valore di [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) è definito in base a <i>come il metodo è invocato</i>. Quando si invoca un metodo tramite una referenza il valore di _this_ diventa il cosiddetto [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) e il risultato finale è spesso diverso da quello che lo sviluppatore intendeva.

Perdere traccia di _this_ quando si scrive codice JavaScript genera alcuni altri problemi potenziali. Si verificano spesso in cui React o Node (o più specificatamente il motore JavaScript del browser) hanno bisogno di invocare qualche metodo su un oggetto definito dallo sviluppatore. Tuttavia, in questo corso eviteremo questo tipo di problemi utilizzando JavaScript "this-less".

Una situazione che porta alla "scomparsa" di _this_ si verifica quando impostiamo un timeout per la chiamata a _greet_ sull'oggetto _arto_, usando la funzione [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

Come detto, il valore di _this_ in JavaScript è definito in base a come il metodo viene invocato. Quando <em>setTimeout</em> invoca il metodo, in realtà è il motore JavaScript che fa la chiamata e, a quel punto, _this_ refernzia l'oggetto global.

Ci sono alcuni meccanismi per preservare il _this_ originale. Uno di questi è l'uso del metodo [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

L'invocazione di <em>arto.greet.bind(arto)</em> crea una nuova funzione in cui _this è vincolato a puntare a Arto, indipendentemente da dove e come il metodo venga chiamato.

Usando le [funzioni freccia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) è possibile risolvere alcuni dei problemi correlati a _this_. Non devono tuttavia essere usati come metodi degli oggetti perché _this_ perché in questo caso non funzionano affatto. Torneremo in seguito sil funzionamento di _this_ in relazione alle funzioni freccia.

Se ti interessa avere una conoscenza più approfondita di come funzioni _this_ in JavaScript, Internet è piena di materiali sull'argomento, ad esempio la serie [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) da [egghead.io](https://egghead.io) è fortemente raccomandata.

### Classi

Come menzionato in precedenza, non c'è in JavaScript un meccanismo di classi simile a quello dei linguaggi di programmazione orientati agli oggetti. Ci sono tuttavia delle funzionalità che rendono possibile "simulare" [classi]https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) orientate agli oggetti.

Diamo uno sguardo veloce alla <i>sintassi delle classi</i> introdotta in JavaScript con ES6, che semplifica in maniera sostanziale la definizione delle classi (o di entità simili alle classi) in JavaScript.

Nell'esempio seguente definiamo una "classe" Person e due oggetti Person:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 29)
adam.greet()

const janja = new Person('Janja Garnbret', 23)
janja.greet()
```

Dal punto di vista della sintassi, le classi e gli oggetti creati a partire da esse sono molto simili alle classi e agli oggetti di Java. Anche il comportamento è piuttosto simile agli oggetti Java. Nella sostanza però sono ancora oggetti basati sull'[ereditarietà prototipale](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance) propria di JavaScript. Il tipo di entrambi gli oggetti è _Object_, dato che JavaScript definisce essenzialmente solo i tipi [Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

L'aggiunta della sintassi delle classi è stata controversa. Vedi [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) o [Is “Class” In ES6 The New “Bad” Part? on Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) per approfondire.

La sintassi delle classi ES6 è molto usata nelle vecchie versioni di React e anche in Node.js, pertanto la loro comprensione è utile anche in questo corso. Tuttavia, dato che in questo corso usiamo la nuova funzionalità di React costituita dagli [Hooks](https://reactjs.org/docs/hooks-intro.html) non vedremo utilizzi concreti delle classi.

### Materiali su JavaScript

Su Internet si trovano molte guide a JavaScriot alcune molto buone e altre meno. La maggior parte dei link in questa pagina che fanno riferimento a JavaScript puntano alla [Giuda JavaScript di Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

SI raccomanda caldamente di leggere subito [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) sul sito Web di Mozilla.

Sei vuoi conoscere JavaScript in maniera approfondita c'è online l'ottimo libro gratuito [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

Un'altra fonte importante per imparare JavaScript è [javascript.info](https://javascript.info).
  
Il libro gratuito e molto coinvolgente [Eloquent JavaScript](https://eloquentjavascript.net) porta velocemente il lettore dalle basi ad argomenti interessanti, e, con un mix di teoria ed esercizi, copre la teoria della programmazione in generale e il linguaggio JavaScript in particolare.

[egghead.io](https://egghead.io) offre molti screencast di qualità su JavaScript, React e altri argomeni interessanti. Purtroppo alcuni dei contenuti sono a pagamento. 

</div>
