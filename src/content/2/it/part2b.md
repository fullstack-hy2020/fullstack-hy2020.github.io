---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: it
---

<div class="content">

continuiamo ad evolvere la nostra applicazione permettendo agli utenti di aggiungere nuove note. Puoi trovare [qui](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1) il codice per la versione attuale dell'applicazone.

Affinché la nostra pagina si aggiorni quando nuove note vengono aggiunte, è opportuno salvare le note nello stato del componente <i>App</i>.
Importiamo la funzione [useState](https://reactjs.org/docs/hooks-state.html) e usiamola per definire un elemento di stato che viene inizializzato con le note iniziali passate nelle props.

```js
import { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

Il componente usa la funzione <em>useState</em> per inizializzare l'elemento di stato memorizzato nelle <em>notes</em> con l'array passato nelle props:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```

Se avessimo voluto iniziare con una lista vuota, avremmo impostato il valore iniziale a un array vuoto e, dato che le props non sarebbero state usate, avremmo potuto rimuoverle dalla definizione della funzione:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```

Per ora manteniamo la versione in cui il valore iniziale è passato tramite props.

Proseguiamo aggiungendo al componente un [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) HTML che sarà usato per aggiungere nuove note.

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start 
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end   

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start 
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
      // highlight-end   
    </div>
  )
}
```

Abbiamo aggiunto all'elemento form la funzione _addNote_ come gestore di eventi che sarà invocata quando il form viene sottomesso cliccando il bottone _submit_.

Usiamo il metodo disucusso nella [sezione 1](/it/part1/stato_dei_componenti_event_handlers#gestione-degli-eventi) per definire il nostro event handler:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

Il parametro <em>event</em> è l'[evento](https://reactjs.org/docs/handling-events.html) che scatena la chiamata alla funziona di gestione dell'evento: 

L'event handler chiama immediatamente il metodo <em>event.preventDefault()</em> che previene l'esecuzione dell'azione di defualt, ovvero la sottomissione del form. L'azione di default [tra le altre cose](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), causerebbe il ricaricamento della pagina.

Il target dell'evento memorizzato in _event.target_ è loggato a console:

![](../../images/2/6e.png)

Il target in questo caso è il form definito nel nostro componente.

Come accediamo ai dati contenuti nell'elemento <i>input</i> del form?

### Componenti controllati

Ci sono diversi modi di raggingere questo obiettivo. Il primo modo che vedremo è l'uso dei cosiddetti [componenti controllati] [controlled components](https://reactjs.org/docs/forms.html#controlled-components).

Aggiungiamo un nuovo elemento di stato detto <em>newNote</em> per memorizzare l'input inserito dall'utente **e** impostiamolo come valore dell'attributo <i>value</i> dell'elemento <i>input</i>: 

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

Il testo segnaposto memorizzato come valore iniziale della variabile di stato <em>newNote</em> appare nell'elemento <i>input</i>, ma il testo non ppuò essere modificato. La console mostra un avvertimento che ci fornisce un indizio su cosa potrebbe esserci di sbagliato:

![](../../images/2/7e.png)

Dato che abiamo assegnato un elemento di stato del componente <i>App</i> all'attrivuto <i>value</i> dell'elemento input, il componente <i>App</i> ora [controlla](https://reactjs.org/docs/forms.html#controlled-components) il comportamento dell'elemento input.

Per abilitare la modifica dell'elemento input, dobbiamo registrare un <i>event handler</i> che sincronizza le modifiche fatte all'elemento input aon lo stato del componente:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

Abbiamo così registrato un gestore di eventi sull'attributo <i>onChange</i> dell'elemento <i>input</i> del form:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

Il gestore di eventi viene invocato ogni volta che <i>si verifica una modifica all'elemento di input</i>. La funzione riceve l'oggetto evento come parametro  <em>event</em>:

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

La proprietà <em>target</em> dell'oggetto evento corrisponde ora all'elemento contollato <i>input</i>, e <em>event.target.value</em> fa riferimento al valore inputato in quell'elemento.

Si noti che non è stato necessario chiamare il metodo _event.preventDefault()_ come abbiamo fatto per il gestore dell'evento <i>onSubmit</i>. Questo perchè non c'è un'azione di default associata al cambiamento di un elemento input, a differenza di quanto accade per il submit di un form.

Puoi seguire nella console il modo in cui l'event handler viene invocato:

![](../../images/2/8e.png)

Avete ricordato di installare gli [strumenti di sviluppo React](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), vero? Bene, potrete vedere direttamente nel pannello React Devtools come lo stato cambia.

![](../../images/2/9ea.png)

Ora la variabile di stato <em>newNote</em> del componente <i>App</i> riflette il valora attuale dell'elemento input, il che significa che possiamo completare la funzione <em>addNote</em> per l'aggiunta di nuove note:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

Inanzitutto creiamo un nuovo oggetto chiamato <em>noteObject</em> che riceve il suo contenuto dalla variabile di stato <em>newNote</em> del componente. L'identificativo univoco <i>id</i> è enerato in base al numero totale di note. Questo metodo funziona per la nostra applicazione dato che le note non possono essere cancellate. Con l'aiuto della funzione <em>Math.random()</em> la nostra nuova nota ha il 50% di probabilità di essere annotata come importante.

La nuova nota è aggiunta alla lista di note attraverso il metodo [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) introdotto nella [sezione 1](/it/part1/java_script#array):

```js
setNotes(notes.concat(noteObject))
```

Il metodo non muta l'array <em>notes</em> originale, invece crea <i>una nuova copia dell'array con il nuovo elemento aggiunto in coda</i>. Questo è importante dato che [lo stato non deve mai essere mutato direttamente](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly) in React!

Il getore dell'evento reimposta anche il valore dell'elemento di input controllato attraverso la chiamata al metodo <em>setNewNote</em> della variabile di stato <em>newNote</em>:

```js
setNewNote('')
```

E' possibile trovare il codice della versione attuale dell'applicazione nella sua interezza nel branch <i>part2-2</i> di [questo repository GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2).

### Filtrare gli elementi mostrati

Aggiungiamo una nuova funzionalità alla nostra applicazione per permettere di visualizzare le sole note importanti.

Aggiungiamo una variabile di stato al componente <i>App</i> che tiene traccia di quali note debbano essere visualizzate:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

Modifichiamo il componente di modo che memorizzi la lista delle note da msotrare nella variabile <em>notesToShow</em>. Gli elementi della lista dipendono dallo stato del componente:

```js
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

La definizione della variabile <em>notesToShow</em> è piuttosto compatta:

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

La definizione usa l'operatore [conditzionale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) presente in numerosi altri linguaggi di programmazione.

L'operatore funziona nel modo seguente. Se abbiamo:

```js
const result = condition ? val1 : val2
```

la variabile  <em>result</em> sarà valorizzata con il valore <em>val1</em> se <em>condition</em> è vera. Se <em>condition</em> è falsa, la variabile <em>result</em> assumerà il valore di <em>val2</em>.

Se il valore di <em>showAll</em> è false, alla variabile <em>notesToShow</em> sarà assegnata la lista che contiene le sole note per cui la proprietà <em>important</em> è vera. Il filtro è effettuato usando il metodo [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) degli array:

```js
notes.filter(note => note.important === true)
```

L'operatore di confronto è in effetti ridondante, dato che il valore di <em>note.important</em> è <i>true</i> o <i>false</i>, il che significa che possiamo scrivere semplicemente:

```js
notes.filter(note => note.important)
```

Il motivo per cui abbiamo inizialmente mostrato l'operatore di confronto era di enfatizzare un dettaglio importante: in JavaScript <em>val1 == val2</em> non funziona sempre come ci si aspetterebbe ed è più sicuro utilizzare esclusivamente <em>val1 === val2</em> nei confronti. E'possibile approfondire questo argomento [qui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

Si può testare la funzionalità di filtro modificando il valore iniziale della variabile di stato <em>showAll</em>.

Proseguiamo aggiungendo la funzionalità che permette all'utente di modificare lo stato di <em>showAll</em> attraverso l'interfaccia dell'applicazione.

Le modifiche rilevanti sono mostrate di seguito:

```js
import { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
// highlight-start      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
// highlight-end            
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...    
    </div>
  )
}
```

Le note mostrate (tutto o le importanti) sono gestite tramite un bottone. L'event handler per il bottone è talmente semplice che è stato definito direttamente nell'attributo dell'elemento button. L'event handler alterna il valore di _showAll_ da vero a falso e viceversa.

```js
() => setShowAll(!showAll)
```

Il testo del bottone dipende dal valore della variabile di stato <em>showAll</em> :

```js
show {showAll ? 'important' : 'all'}
```

E' possibile trovare il codice della versione attuale dell'applicazione nel branch <i>part2-3</i> [di questo repository  GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3).
</div>

<div class="tasks">

<h3>Esercizi 2.6.-2.10.</h3>

Nel primo esercizio inizieremo a lavorare su un'applicazione che verrà ulteriormente sviluppata negli esercizi successivi. Nei gruppi di esercizi correlati è sufficiente sottomettere la versione finale dell'aplicazione. E'possibile fare commit separati alla fine di ciascuna parte degli esercizi, ma questo è completamente opzionale.

**ATTENZIONE** create-react-app trasformerà automaticamente la tua applicazione in un repository git a meno che la tua applicazione non venga creata all'interno di un altro repository git. **Molto probabilmente non si vorrà create un nuovo repository Git per ciascun progetto**, perciò esegui semplicemente il comando _rm -rf .git_ dalla radice dell'applicazione.

<h4>2.6: Rubrica telefonica Step1</h4>

Creaiamo una semplice rubrica telefonica. <i>**In questa sezione ci limiteremo ad aggiungere nomi alla rubrica**</i>

Iniziamo dall'aggiunta di una persona alla rubrica.

Puoi utilizzare il codice qui sotto come punto di partenza per il componenten <i>App</i> dell'applicazione:

```js
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
```

Lo scopo della variavile di stato <em>newName</em> è di controllare l'elemento di input del form.

A volte può essere utile visualizzare lo stato e altre variabili come testo ai fini di debuggare l'applicazione. Puoi temporaneamente aggiungere l'elemento seguente al componente visualizzato:

```
<div>debug: {newName}</div>
```

E'anche importante utilizzare bene quanto abbiamo appreso nella sezione 1 a proposito del [debug delle applicazioni React](/en/part1/a_more_complex_state_debugging_react_apps). Gli [strumenti per sviluppatori React](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) in particolare, sono incredibilmente utili per tenere traccia delle modifiche che avvengono allo stato dell'applicazione.

Una volta terminato l'esercizio, l'applicazione dovrebbe apparire così:

![](../../images/2/10e.png)

Si noti l'uso degli strumenti di sviluppo React nell'immagina qui sopra.

**NB:**

- è possibile utilizzare il nome della persona come valore dell'attributo <i>key</i>
- ricorda di prevenire l'azione di default di sottomissione dei form HTML!
- 
<h4>2.7: Rubrica telefonica Step2</h4>

Impedisci la possibilità per l'utente di inserire nomi già esistenti nella rubrica. Gli arrau JavaScript hanno numerosi [metodi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) utili per raggiungere lo scopo. Ricorda [come funziona l'uguaglianza tra oggetti](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/) in Javascript.

Produci un messaggio di errore usando il comando [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) quando viene fatto un tentativo:

![](../../images/2/11e.png)

**Suggerimento** quando stai creando stringhe che contengono valori di variabili è raccomandato l'uso di [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```js
`${newName} is already added to phonebook`
```

Se la variabile <em>newName</em> ha il valore <i>Arto Hellas</i>, l'espressione _template litear_ restituisce la stringa

```js
`Arto Hellas is already added to phonebook`
```

La stessa cosa sarebbe fattibile usando l'operatore _+_ come si farebbe in Java:

```js
newName + ' is already added to phonebook'
```

L'uso di _template string_ è più idiomatico ed è distintivo degli sviluppatori JavaScript professionali.

<h4>2.8: Rubrica telefonica Step3</h4>

Espandi lápplicazione per permettere agli utentid di aggiungere numeri di telefono alla rubrica. Dovrai aggiungere un secondo elemento <i>input</i> al form (insieme al suo event handler):

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

A questo punto l'applicazione potrebbe apparise qualcosa di simile. L'immagine mostr anche lo stato dell'applicazione con l;'ausilio degli [strumenti per svilupatori React](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):

![](../../images/2/12e.png)

<h4>2.9*: Rubrica telefonica Step4</h4>

Implementa un campo di ricerca che può essere usato per filtrare la lista di persone per nome:

![](../../images/2/13e.png)

Puoi implementare il campo di ricerca come elemento <i>input</i> collocato al di fuori del form HTML. La logica di filtro mostrata nell'immagine è  <i>case insensitive</i>, ovvero anche il termine di ricerca <i>arto</i> restiituisce anche risultati che contengono Arto con la A maiuscola.

**NB:** Quando si lavora con nuove funzionalità è spesso utile lavorare con dei dati fittizi cablati nell'applicazione, come ad esempio:

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // ...
}
```

Questo ti risparmia dal dover inserire manualmente i dati nell'applicazione per testare la nuova funzionalità.

<h4>2.10: Rubrica telefonica Step5</h4>

Se hai implementato l'applicazione come singolo componente, rivedila estraendo le sue parti in componenti. Mantieni nel compnente radice <i>App</i> lo stato e gli event handler.

E' sufficiente estrarre <i>**tre**</i> componenti dall'applicazione. Dei buoni candidati sono, ad esempio, il filtro di ricerca, il form di aggiunta di una nuova persona alla rubrica e un componente che visualizza il dettaglio di una songola persona.

La radice dell'applicazione potrebbe essere qualcosa di simile a quanto segue dopo la revisone. Il componente radice rivisto mostrato qui sotto mostra solo i tisoli e lascia che i componenti estrapolati si occupino del resto.

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

**NB**: Potresti incontrare problemi in questo esercizio se definisci i componenti "nel posto sbagliato". Potrebbe essere un buon momento per riprendere il capitolo [it/part1/stato_complesso_debug_di_app_react#non-definire-componenti-dentro-altri-componenti](/en/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components)
dalla sezione precedente.

</div>
