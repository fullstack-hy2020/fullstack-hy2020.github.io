---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: it
---

<div class="content">

Prima di iniziare a sviluppare, ripercorriamo alcuni principi di sviluppo Web esaminando un'applicazione di esempio all'indirizzo <https://studies.cs.helsinki.fi/exampleapp>.

L'applicazione esiste al solo scopo di dimostrare alcuni concetti elementari del corso e non è in alcun modo un esempio di <i>come</i> dovrebbe essere fatta un'applicazione web moderna.
Al contrario, mostra alcune tecniche obsolete di sviluppo web, che potrebbero anche essere considerate <i>cattive pratiche</i> oggi.

Il codice aderirà alle migliori pratiche contemporanee a partire dalla [sezione 1](/it/part1).

Apri l'[applicazione di esempio](https://studies.cs.helsinki.fi/exampleapp) nel tuo browser. A volte ci mette un po'.

**Prima regola dello sviluppo web**: tieni sempre aperti gli strumenti per sviluppatori (aka Developer console) del tuo browser. Su macOS, apri la console premendo _F12_ o _option-cmd-i_ contemporaneamente. Su Windows o Linux, apri la console premendo _F12_ or _ctrl-shift-i_ contemporaneamente. La console può anche essere aperta dal [menù contestuale](https://en.wikipedia.org/wiki/Menu_key).

Ricorda di tenere sempre aperta la developer console quando scrivi applicazioni Web.

La console appare così: 

![Una schermata degli strumenti per sviluppatori aperti in un browser](../../images/0/1e.png)

Assicurati che il tab <i>Rete</i> sia aperto e spunta l'opzione <i>Disabilita cache</i> come mostrato. <i>Preserve log</i> può anche essere utile: mantiene visibili i log dell'applicazione quando la pagina viene ricaricata.

**NB:** Il tab più importante è il tab <i>Console</i>. Tuttavia, in questa introduzione useremo spesso il tab <i>Network</i>.

### HTTP GET

Server e Client comunicano tra loro usando il protocollo [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP). Il tab <i>Network</i> mostra la comunicazione tra client e server. 

Quando ricarichi la pagina (premendo il tasto F5 o il simbolo &#8635; sul tuo browser), la console motra che due eventi sono accaduti:

- Il browser ha caricato i contenuti della pagina <i>studies.cs.helsinki.fi/exampleapp</i> dal server
- Il browser ha scaricato l'immagine <i>kuva.png</i>

![Screenshot della developer console che mostra i due eventi](../../images/0/2e.png)

Su uno schermo piccolo potresti dover allargare la finestra della cosnole per vederli.

Cliccando sul primo evento verrano mostrate ulteriori informazioni su ciò che sta accadendo:

![Dettaglio di un singolo evento](../../images/0/3e.png)

La parte in alto, <i>General</i>, mostra che il browser ha inviato una richesta all'indirizzo <i>https://studies.cs.helsinki.fi/exampleapp</i> (l'indirizzo è leggermente cambiato da quando límmagine è stata presa) usando ilo metodo [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET), e che la richiesta ha avuto successo avendo il server risposto con il [codice di stato](https://it.wikipedia.org/wiki/Codici_di_stato_HTTP) 200.

La richiesta e la risposta del server hanno diversi [header](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

![](../../images/0/4e.png)

Gli <i>header di risposta</i> in alto ci dicono ad esempio la dimensione della risposta in byte, e l'easatto momento della risposta. Un header importante  [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) ci dice che la risposta è un file di testo in formato [utf-8](https://en.wikipedia.org/wiki/UTF-8), il cui contenuto è stato formattato in HTML. In questo modo il browser sa che la risposta è una normale pagina [HTML](https://en.wikipedia.org/wiki/HTML)-page, e che la può mostrare 'come una pagina web'.

Il tab <i>Response</i> mostra i dati in risposta, una normale pagine HTML. Il <i>body</i> definisce la struttura della pagina mostrata sullo schermo:

![Screenshot del response tab](../../images/0/5e.png)

La pagina contiene un elemento [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), che a sua volta contiene un titolo, un link alla pagina <i>notes</i>, e un elemento [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), e mostra il numero di note create.

A causa dell'elemento img, il browseer effettua una seconda <i>chiamata HTTP</i> per caricare l'immagine <i>kuva.png</i> dal server. Di seguito i dettagli della richiesta:

![Vista di dettaglio del secondo evento](../../images/0/6e.png)

La richiesta è stata fatta all'indirizzo <https://studies.cs.helsinki.fi/exampleapp/kuva.png> ed è di tipo HTTP GET. Gli header di risposta ci diocono che la dimensione della risposta è di 89350 byte, e il suo [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) è <i>image/png</i>, si tratta pertanto di un'immagine png. Il browser usa questa informazione per mostrare correttamente l'immagine sullo schermo.

La sequenza degli eventi causata dall'apertura della pagina https://studies.cs.helsinki.fi/exampleapp in un browser è rappresentata dal seguente [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/):

![Sequence diagram del flusso visto sopra](../../images/0/7e.png)

Innanzitutto, il browser invia una richiesta HTTP GET al server per caricare il codice HTML della pagina. L'elemento <i>img</i> nell'HTML istruisce il browser a caricare l'immagine <i>kuva.png</i>. Il browser renderizza la pagina HTML e l'immagine sullo schermo.

Sebbene sia difficile notarlo, il rendering della pagina HTML inizia prima che l'immagine sia stata caricata dal server.

### Applicazioni Web tradizionali

La homepage dell'applicazione di esempio funziona come una <i>applicazione web tradizionale</i>. Quando la pagina viene aperta, il browser carica dal server il documento HTML che dettaglia la struttura e il contenuto testuale della pagina.

Il server ha in qualche modo prodotto questo documento. Il documento può essere un file di testo <i>statico</i>, salvato in una cartella del server. Il server può in alternativa generare il documento HTML <i>dinamicamente</i> eseguendo codice applicativo e usando, ad esempio, dati caricati da un database.

Il codice HTML dell'applicazione di esempio è stato generato dinamicamente perché contiene informazioni sul numero di note create.

Il codice HTML della homepage è il seguente: 

```js
const getFrontPageHtml = (noteCount) => {
  return(`
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`)
} 

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```
Per ora mon è importante che capiate questo codice.

Il contenuto delle pagine HTML è stato salvato come una template string, ovvero una stringa che consente ad esempio la valutazione di variabili al suo interno. La parte della home page che cambia dinamicamente, il numero di note salvate (nel codice <em>noteCount</em>), è sostituito dal valore reale del numero di note (nel codice <em>notes.length</em>) all'interno della template string.

Scrivere HTML inframezzato al codice non è ottimale, ma per i programmatori PHP vecchia scuola era la pratica consolidata.

Nelle applicazioni web tradizionali il browser è "stupido". Si limta a caricare l'HTML dal server mentre tutta la logica applicativa è sul server. UN server può essere creato utilizzando Java Spring (come nel corso dell'università di Helsinki [Web-palvelinohjelmointi](https://courses.helsinki.fi/fi/tkt21007/119558639)), Python Flask (come nel corso [tietokantasovellus](https://materiaalit.github.io/tsoha-18/)) o con [Ruby on Rails](http://rubyonrails.org/) solo per nominare alcuni esempi.

L'esempio usa la libreria [Express](https://expressjs.com/) con Node.js. Questo corso utilizzerà Node.js e Express pre creare server web.

### Eseguire la logica applicativa nel server

Tieni aperta la developer console. Svuota la console premendo il simbolo 🚫 o digitando clear() nella console.
Quando vai alla pagina [notes](https://studies.cs.helsinki.fi/exampleapp/notes) il browser esegue 4 richieste: 

![Screenshot delle developer console con 4 richieste visibili](../../images/0/8e.png)

Ogni richiesta ha un tipo <i>differente</i>. Il tipo della prima richiesta è <i>document</i>. Si tratta del codice HTML della pagina e appare così:

![Vista di dettaglio ella prima richiesta](../../images/0/9e.png)

Confrontando la pagina mostrata nel browser e il coice HTML restituito dal server, notiamo che il codice non contiene la lista delle note. La sezione [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) dell'HTML contiene un elemento [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script), che fa sì che il browser carichi un file JavaScript chiamato <i>main.js</i>.

Il codice JavaScript appare così:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementsByClassName('notes').appendChild(ul)
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```
Per ora i dettagli del codice non sono importanti, ma si nota come del codice è stato aggiunto per dare vita al testo e alle immagini. Inizieremo effettivamente a scrivere codice nella [sezione 1](/it/part1). Gli esempi di codice in questa sezione non sono in alcun modo rilevanti per le tecniche illustrate nel prosieguo corso.

> Qualcuno potrebbe chiedersi come mai venga usato xhttp-object anziché il più moderno fetch. Ciò è dovuto alla volontà di non addentrarsi nelle promise in questo momento e al fatto che il codice ha un ruolo secondario per ora. Torneremo su modalità moderne di fare richieste al server nella sezione 2.

Immediatamente dopo aver caricato l'elemento <i>script</i> il browser inizia a eseguire il codice.

Le ultime due righe istruiscono il browser a fare una richiesta HTTP GET all'indirizzo <i>/data.json</i> del server:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```
Questa è la richiesta mostrata più in basso nel pannello Network.

Possiamo provare ad aprire direttamente l'indirizzo <https://studies.cs.helsinki.fi/exampleapp/data.json> nel browser:

![](../../images/0/10e.png)

Vi troviamo le note "grezze" in formato [JSON](https://it.wikipedia.org/wiki/JSON). Di default i browser basati su Chromium non eccellono nel mostrare dati in formato JSON. E' possibile usare dei plugin per gestire la formattazione. Installando, per esempio, [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) in Chrome e ricaricando la pagina, i dati sono formattati in maniera leggibile:

![Output JSON formattato](../../images/0/11e.png)

Il codice JavaScript della pagina notes scarica il documento JSON che contiene le note e crea un elenco puntato con le note.

Questo è realizzato dal codice seguente:

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById('notes').appendChild(ul)
```
Il codice prima crea una lista non ordinata con un elemento [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)...

```js
var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')
```
...quindi aggiunge un elemento [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li) per ciascuna nota. Solo il campo <i>content</i> di ciascuna nota viene inserito nell'elemento li. I timestamp che si trovano nei dati grezzi non sono usati in alcun modo fin qui.

```js
data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```
Ora apri il tab <i>Console</i> della Developer Console: 

![Screenshot del tab console nella Developer Console](../../images/0/12e.png)

Cliccando il piccolo triangolo all'inizio della riga è possibile espandere il testo nella console.

![Screenshot del dettaglio di un elemento precedentemente chiuso](../../images/0/13e.png)

Questo output nella console è causato dal comando <em>console.log</em> nel codice:

```js
const data = JSON.parse(this.responseText)
console.log(data)
```

Dopo aver ricevuto i dati dal server, il codice li stampa nella console.

Il tab <i>Console</i> e il comando <em>console.log</em> diventeranno davvero familiari durante il corso. 

### Event handlers e funzioni Callback

La struttura di questo codice è un po' bizzarra:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  // code that takes care of the server response
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```
La richiesta al server è inviata nell'ultima riga, ma il codice che la gestisce si trova più in alto. Cosa sta accadendo?

```js
xhttp.onreadystatechange = function () {
```

In questa riga viene definito un <i>event handler</i> per l'evento <i>onreadystatechange</i> sull'oggetto <em>xhttp</em> che effettua la richiesta. Quando lo stato dell'oggetto cambia, il browser invoca la funzione handler dell'evento. Il codice della funzione verifica che il [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) dell'oggetto xhttp sia uguale a 4 (che rappresenta la situazione <i>L'operazione è completa</i>) e che il codice HTTP di risposta sia 200.

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // code that takes care of the server response
  }
}
```
Il meccanismo di invocazione degli event handler è molto comune in JavaScript. Le funzioni che gestiscono gli eventi sono dette [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). Il codice applicativo non invoca le funzioni direttamente, ma è l'ambiente di esecuzione - il browser - che invoca la funzione al momento opportuno, quando si verifica un determinato <i>evento</i>.

### Document Object Model o DOM

Possiamo pensare alle pagine HTML come a una struttura ad albero implicita.

<pre>
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
</pre>

La stessa struttura ad albero può essere visualizzata nel tab <i>Elements</i> della console.

![Uno screenshot del pannello Elements nella developer console](../../images/0/14e.png)

Il funzionamento del browser è centrato sull'idea di raffigurare gli elementi HTML come un albero.

Document Object Model, o [DOM](https://it.wikipedia.org/wiki/Document_Object_Model), è una Application Programming Interface (<i>API</i>) che abilita la manipolazione applicativa degli <i>elementi dell'albero</i> che corrispondono alle pagine web.

Il codice JavScript introdotto nel capitolo precedente usa la DOM-API per aggiungere una lista di note alla pagina.

Il codice seguente aggiunge una nuova nota alla variabile <em>ul</em> e aggiunge dei nodi ad essa:

```js
var ul = document.createElement('ul')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```
Infine, il ramo dell'albero associato alla variabile <em>ul</em> è aggiunto nel punto corretto nell'albero HTML della pagina HTML complessiva.

```js
document.getElementsByClassName('notes').appendChild(ul)
```

### Manipolare il DOM dalla console

Il nodo più in alto nel DOM di un documento HTML è l'oggetto <em>document</em>. Possiamo effettuare diverse operazioni su una pagina web utilizzando la DOM-API. E' possibile accedere all'oggetto <em>document</em> digitando <em>document</em> nel tab Console.

![](../../images/0/15e.png)

Aggiungiamo una nuova nota alla pagina dalla console.

Innanzitutto recuperiamo la lista delle note dalla pagina. La lista è il primo elemento ul della pagina:

```js
list = document.getElementsByTagName('ul')[0]
```

Quindi creiamo un nuovo elemento li e aggiungiamo ad esso del contenuto testuale:

```js
newElement = document.createElement('li')
newElement.textContent = 'Page manipulation from console is easy'
```

Aggiungiamo il nuovo elemento li alla lista:

```js
list.appendChild(newElement)
```

![Screenshot della pagina con il nuovo elemento aggiunto alla lista](../../images/0/16e.png)

Sebbene la pagina si sia aggiornata nel browser, le modifiche non sono permanenti. Se la pagina fosse ricaricata, la nuova nota sparirebbe perchè le modifiche non sono state inviate al server. Il codice JavaScript caricato dal browser leggerà sempre la lista di note a partire dal dato in formato JSON caricato dall'indirizzo <https://studies.cs.helsinki.fi/exampleapp/data.json>.

### CSS

L'elemento <i>head</i> del codice HTML della pagina Notes contiene un elemento [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), che determina che il browser deve caricare un foglio di stile [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) dall'indirizzo [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).

Cascading Style Sheets, o CSS, è un linguaggio per fogli di stile usato per definire l'aspetto delle pagine web.

Il file CSS caricato appare così:

```css
.container {
  padding: 10px;
  border: 1px solid; 
}

.notes {
  color: blue;
}
```
Il file definisce due [selettori di classe](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). Questi sono usati per selezionare certe sezioni della pagina e per definire le relative regole di stile da applicare.

La definizione di un selettore di classe inizia sempre con un punto e contiene il nome della classe.

Le classi sono [attributi](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) che possono essere aggiunti agli elementi HTML.

Gli attributi CSS possono essere ispezionati nel tab <i>elements</i> della console.

![Screenshot del tab Elementi nella developer console](../../images/0/17e.png)

L'elemento <i>div</i> più esterno ha la classe <i>container</i>. L'elemento <i>ul</i> contenente la lista di note ha la classe <i>notes</i>.

La prima regola CSS definisce che gli elementi con la classe <i>container</i> saranno evidenziati da un [bordo](https://developer.mozilla.org/en-US/docs/Web/CSS/border) di 1 pixel di larghezza. Imposta inoltre a 10 pixel il [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) sull'elemento. In questo modo si aggiunge uno spazio bianco tra il contenuto dell'elemento e il suo bordo.

La seconda regola CSS imposta a blu il colore del testo delle note.

Gli elementi HTML possono avere altri attributi oltre alla classe. L'elemento <i>div</i> contenente le note ha un attributo id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). Il codice JavaScript usa l'id per trovare l'elemento.

L'elemento <i>Elements</i> della console può essere usato per modificare gli stili degli elementi.

![](../../images/0/18e.png)

Le modifiche fatte attraverso al console non sono permanenti. Per rendere queste modifiche permanenti sarebbe necessario salvarle nel foglio di stile CSS sul server.

### Caricamento di una pagina contenente JavaScript - review

Rivediamo cosa accade quando la pagina https://studies.cs.helsinki.fi/exampleapp/notes viene aperta nel browser. 

![](../../images/0/19e.png)

- Il browser carica dal server il codice HTML che definisce il contenuto e la struttura della pagina usando una richiesta HTTP GET.
- I link nel codice HTML fanno sì che il browser carichi anche il foglio di stile <i>main.css</i>...
- ...e un file sorgente JavaScript <i>main.js</i>. 
- Il browser esegue il codice JavaScript. Il codice esegue una richiesta HTTP GET all'indirizzo https://studies.cs.helsinki.fi/exampleapp/data.json che restituisce le note in fromato JSON.
- Una volta che i dati sono stati caricati, il browser invoca un <i>gestore di eventi</i> che renderizza le note nella pagina usando la DOM-API.

### Form e HTTP POST

Proseguiamo vedendo come possiamo aggiungere una nuova nota.

La pagina Note contiene un [elemento form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

![](../../images/0/20e.png)

Quando il bottone nel form viene premuto, il browser invierà l'input dell'utente al server. Apriamo il tab <i>Network</i> e vediamo cosa si succede quando un form viene sottomesso:

![Screenshot del tab Network dove vengono mostrati gli eventi legati alla sottomissione di un form](../../images/0/21e.png)

Sorprendentemente, la sottomissione del form causa non meno di <i>cinque</i> richiesta HTTP.
La prima è l'evento stesso di sottomissione del form. Facciamo zoom su di essa:

![Vista di dettaglio della prima richiesta](../../images/0/22e.png)

Si tratta di una richiesta [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) all'indirizzo del server <i>new\_note</i>. Il server risponde con codice di stato HTTP 302. Questo è un [reindirizzamento URL](https://it.wikipedia.org/wiki/Reindirizzamento_di_URL), con il quale il server chiede al browser di fare una nuova richiesta HTTP GET all'indirizzo definito nell header <i>Location</i> - l'indirizzo <i>notes</i>.

Quindi, il browser ricarica la pagina Notes. Il ricaricamento causa tre richieste HTTP ulteriori: il caricamento del foglo di stile (main.css), del codice JavaScript (main.js) e il dato grezzo delle note (data.json).

Il tab rete mostra anche i dati sottomessi con il form:

NB: Sulle versioni più recenti di Chrome, il dettaglio dei dati del form si trova nel nuovo pannello Payload, posizionato alla destra del tab header.

![](../../images/0/23e.png)

L'elemento form ha gli attributi <i>action</i> e <i>method</i>, che definiscono che la sottomissione del form è fatta tramite una richiesta HTTP POST all'indirizzo <i>new_note</i>.

![](../../images/0/24e.png)

Il codicesul server responsabile di gestire la richiesta POST è piuttosto semplice (NB: questo codice è eseguito sul server, non è codice JavaScript scaricato ed eseguito dal browser):

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect('/notes')
})
```
I dati sono inviati come [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) della richiesta POST.

Il server può accedere ai dati attraverso il campo <em>req.body</em> dell'oggetto <em>req</em> che rappresenta la richiesta.

Il server crea un nuovo oggetto nota e lo aggiunge a un array chiamato <em>notes</em>.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
})
```

L'oggetto Note ha due campi: <i>content</i> contiene il reale contenuto della nota, e <i>date</i> che contiene la data e ora di creazione della nota.

Il server non salva le nuove note in un database, pertanto le nuove note spariscono quando il server viene riavviato.

### AJAX

La pagina Notes dell'applicazione segue uno stile di sviluppo in voga nei primi anni '90a usa "Ajax". Come tale è sulla cresta dell'onda delle tecnologie web dei primi anni 2000.

[AJAX](<https://it.wikipedia.org/wiki/AJAX>) (Asynchronous JavaScript and XML) è un termine introdotto nel Febbraio 2005, in seguito agli sviluppi della tecnologia dei browser, per descrivere un nuovo approccio rivoluzionario che ha abilitato il caricamento di contenuti nelle pagine Web usando codice JavaScript inserito nell'HTML, senza bisogno di ri-renderizzare la pagina.

Prima dell'era AJAX, tutte le pagine Web funzionavano come [applicazioni web tradizionali](/it/part0/fondamenti_di_applicazioni_web#applicazioni-web-tradizionali) che abbiamo visto in precedenza in questo capitolo.
Tutti i dati mostrati in pagina erano caricati con il codice HTM scaricato dal server.

La pagina Notes usa AJAX per caricare le note. La sottomissione di un form usa ancora il meccanismo tradizionale di sottomissione di form.

La URL dell'applicazione riflette i bei vecchi tempi. I dati JSON sono caricati dalla URL <https://studies.cs.helsinki.fi/exampleapp/data.json> e le nuove note sono inviate alla URL <https://studies.cs.helsinki.fi/exampleapp/new_note>.  
Oggi URL come queste non sarebbero considerate accettabili in quanto non seguono le convenzioni generalmente seguite delle API [RESTful](https://it.wikipedia.org/wiki/Representational_state_transfer), che vedremo in dettaglio nella [sezione 3](/it/part3).

Ciò che chiamiamo AJAX è oggi così comune che è dato per scontato. Il termine è scivolato nell'oblio, e le nuove generazioni non l'anno nemmeno sentito nominare.

### Single page app

Nella nostra applicazione di esempio, la home page funziona come una pagina web tradizionale: tutta la logica risiede sul server, e il browser si limita a visualizzare l'HTML.

La pagina Notes delega alcune responsabilità al browser, come generare il codice HTML per le note esistenti. Il browser assolve questo compito eseguendo il codice JavaScript caricato dal server. Il codice carica le note dal server come dato in formato JSON e aggiunge elementi HTML che visualizzano le note in pagina usando la [DOM-API](/it/part0/fondamenti_di_applicazioni_web#document-object-model-o-dom).

Negli ultimi anni, è emerso lo stile [Single-page application](https://it.wikipedia.org/wiki/Single-page_application) (SPA) per la creazione di applicazioni web. I siti costruiti come SPA non caricano le loro pagine separatamente dal server, come fa la nostra applicazione di esempio. Invece, sono costituite da un'unica pagina HTML scaricata dal server, il cui contenuto viene manipolato da codice JavaScript eseguito nel browser.

La pagina Notes della nostra applicazione ha alcune somiglianze con le app construite nello stile SPA, ma non è una SPA in senso stretto. Sebbene la logica di visualizzazione delle note sia eseguita nel browser, la pagina continua ad utilizzare il metodo tradizionale per aggiungere nuove note. I dati sono inviati al server attraverso la sottomissione di un form e il server istruisce il browser a ricaricare la pagina Notes tramite una <i>redirezione</i>.

Una versione in puro stile SPA della nostra applicazione di esempio può essere trovata all'indirizzo <https://studies.cs.helsinki.fi/exampleapp/spa>.
A prima vista appare identica alla precedente.
Il codice HTML è qusi identico, ma il file JavaScript è differente (<i>spa.js</i>) e c'è una sottile differenza in come è definito l'elemento form.

![](../../images/0/25e.png)

Il form non ha gli attributi <i>action</i> o <i>method</i> per definire come e dove inviare i dati inseriti.

Apri il tab <i>Network</i> e svuotalo. Quando crei una nuova nota vedrai che il browser invia una sola richiesta al server.

![](../../images/0/26e.png)

La richiesta POST all'indirizzo <i>new\_note\_spa</i> contiene la nuova nota in formato JSON e include sia il contenuto della nota (<i>content</i>) che la data e ora di creazione (<i>date</i>):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

L'header <i>Content-Type</i> della richesta dice al server che i dati inviati sono rappresentati in formato JSON.

![](../../images/0/27e.png)

Senza questo header, il server non saprebbe come interpretare correttamente i dati ricevuti.

Il server risponde con un codice di stato [201 created](https://httpstatuses.com/201). Questa volta il server non richiede una redirezione e il browser resta sulla stessa pagina senza effettuare ulteriori richieste HTTP.

La versione SPA dell'applicazione non invia i dati dei from nel modo tradizionale; invece usa il codice JavaScript scaricato in precedenza dal server.
Diamo uno sguardo a questo codice, anche se in questo momento non è importante comprendenrne tutti i risvolti.

```js
var form = document.getElementById('notes_form')
form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

Il comando <em>document.getElementById('notes\_form')</em> istruisce il codice a caricare l'elemento form dalla pagina e a registrare un <i>gestore di eventi</i> per gestire l'evento di sottomissione. Il gestore di eventi chiama immediatamente il metodo <em>e.preventDefault()</em> per inibire la gestione standard della sottomissione di form. La gestione di sefault invierebbe una richiesta al server e causerebbe una nuova richiesta GET, cosa che noi non vogliamo accada.

Quindi il gestore di eventi crea una nuova nota, la aggiunge alla lista di note con il comando <em>notes.push(note)</em>, mostra la lista di note nella pagina e invia al server la nuova nota. 

Questo è il codice che esegue l'invio della nota al server:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader(
    'Content-type', 'application/json'
  )
  xhttpForPost.send(JSON.stringify(note))
}
```

Il codice definisce che i dati devono essere inviati attraverso una richiesta HTTP POST e che il tipo di dato deve essere JSON. Il tipo di dato è impostato con l'header <i>Content-type</i>. Quindi i dati sono inviati sotto forma di stringa JSON.

Il codice dell'applicazione è disponibile all'indirizzo <https://github.com/mluukkai/example_app>. 

Vale la pena ricordare che l'applicazione è unicamente concepita per dimostrare i concetti del corso. Il codice segue in certa misura stili di programmazione non ottimali, e non deve essere usato come un esempio nella creazione di applicazioni reali. Lo stesso vale per le URL usate. La URL <i>new\_note\_spa</i>, alla quale sono inviate le nuove note, non aderisce alle migliori pratiche correnti.

### Librerie JavaScript

L'applicazione di esempio è realissata con quello che viene comunemente chiamato [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/), usando solo la DOM API e JavaScript per manipolare la struttura delle pagine.

Anziché utilizzare esclusivamente JavaScript e la DOM API, è pratica comune usare diverse librerie che offrono strumenti di più semplice utilizzo della DOM API. Una di queste librerie è la sempre popolarissima [jQuery](https://jquery.com/).

jQuery è stata sviluppata ai tempi in cui le applicazioni generalemnte seguivano il paradigma tradizionale di generare pagine HTML lato server, le cui funzionalità venivano arricchite sul browser attraverso codice JavaScript scritto usando jQuery. Uno dei fattori di successo di jQuery era la sua cosiddetta compatibilità cross-browser. La libreria funzionava indipendentemente dal browser o dal suo produttore, pertanto non c'era necessità si soluzioni specifiche per i singoli browser. Oggi l'utilizzo di jQuery non è altrettanto giustificato dati i progressi di JavaScript e dato che i browser più popolari ben supportano le funzionalità di base.

L'ascesa delle Single Page Application ha portato a modalitá di sviluppo di applicazioni web più "moderne" di jQuery. La prima di queste fu [BackboneJS](http://backbonejs.org/). Dopo il suo [lancio](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) nel 2012, [AngularJS](https://angularjs.org/) di Google divenne rapidamente lo standard quasi de facto dello sviluppo di app moderne.

Tuttavia, la popolarità di Angular crollò nell'Ottobre 2014 dopo che [il team Angular annunciò che il supporto alla versione 1 sarebbe terminato](https://web.archive.org/web/20151208002550/https://jaxenter.com/angular-2-0-announcement-backfires-112127.html), e che Angular 2 non sarebbe stato retrocompatibile con la prima versione. La versione 2 di Angular e le successive non hanno mai avuto accoglienza partticolarmente calorosa.

Attualmente lo strumento più popolare per l'implementazione di logica lato client nelle applicazioni web è la libreria [React](https://reactjs.org/) di Facebook.

Lo stato di React sembra solido, ma il mondo di JavaScript è in continuo cambiamento. Per esempio, recentemente un nuovo entrato - [VueJS](https://vuejs.org/) - ha catturato notevole interesse. 

### Sviluppo full stack

Cosa significa il titolo del corso, <i>Sviluppo web full stack</i>? Full stack è un termine di cui tutti parlano, ma che nessuno da davvero cosa significhi. O quantomeno non c'è un consenso diffuso sulla sua definizione.

In pratica tutte le applicazioni web hanno (almeno) due "livelli": il browser, il più vicino all'utente finale, è il livello superiore, e il server quello inferiore. Spesso c'è anche un database ad un livello ancora inferiore. Possiamo quindi pensare all'<i>architettura</i> di un'applicazione web come una sorta di <i>pila (stack)</i> di strati.

Spesso si parla anche di [frontend e backend](https://it.wikipedia.org/wiki/Front-end_e_back-end). Il browser è il frontend e il codice JavaScipr eseguito nel browser è il codice di frontend. Dall'altra parte il server è il backend.

Nel contesto di questo corso, sviluppo full stack significa che ci focalizziamo su tutti gli strati dell'applicazione: il fontend, il backend e il database. A volte il software sul server e il suo sistema operativo sono visti come parti dello stack, ma qui no entreremo in questo dettaglio.

Scriveremo il codice di backend in JavaScript, usando l'ambiente di esecuzione [Node.js](https://nodejs.org/en/). L'uso dello stesso linguaggio in diversi strati dello stack fornisce allo sviluppo full stack una domensione completamente nuova. Tuttavia, non è un requisito della programmazione full stack che tutti in tutti gli strati sia usato il medesimo linguaggio di programmazione (JavaScript).

In passato è stata pratica comune per gli sviluppatori quella di specializzarsi in un layer dello stack, ad esempio il backend. Le tecnologie di frontend e backend erano piuttosto diverse. Con la tendenza allo sviluppo full stack è diventato normale per gli sviluppatori essere efficaci su tutti gli strati dell'applicazione e sui database. Spesso gli sviluppatori full stack devono anche avere sufficienti competenze di configurazione e gestione per poter eseguire le loro applicazioni, ad sempio, nel cloud.

### Fatica da JavaScript

Lo sviluppo full stack è sfidante sotto diversi punti di vista. Le cose avvengono contemporaneamente in diversi punti, e il debug è un po' più complesso che con applicazioni desktop tradizionali. JavaScript non funziona sempre come ci si aspetterebbe (in confronto ad altri linguaggi), e la natura asincrona del suo ambiente di esecuzione introduce diversi problemi. Comiunicare in rete richiede conoscenza del protocollo HTTP. E' anche richiesto saper gestire i database e configurare e amministrate i server. Sarebbe anche buona cosa avere una conoscenza di CSS almeno sufficiente per rendere le applicazioni presentabili.

L'ecosistema di JavaScript si evolve velocemente, il che comporta ulteriori nuove sfide. Gli strumenti, le librerie e il linguaggio stesso sono in continuo, costante sviluppo. Qualcuno sta iniziando a stancarsi di questo cambiamento continuo e per riferirsi a questo fenomeno ha coniato il termine <em>fatica da JavaScript (JavaScript fatigue)</em>. Si veda ad esempio [How to Manage JavaScript Fatigue su auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) o [JavaScript fatigue su Medium](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).

Tu stesso soffrirai della fatica da JavaScript in questo corso. Fortunatamente per noi, ci sono diversi modi per rendere meno ripida la curva di apprendimento, e possiamo iniziare a concentrarci sullo sviluppo invece che sulla configurazione. Non possiamo evitare completamente la configurazione, ma possiamo felicemente posticiparla di qualche settimana evitando nel mentre il peggio dell'inferno della configurazione.

</div>

<div class="tasks"> 
  <h3>Esercizi 0.1.-0.6.</h3>

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

  <h4>0.1: HTML</h4>

Ripassa le basi di HTML leggendo questo tutorial da Mozilla: [tutorial HTML](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics). 

<i>Questo esercizio non va sottomesso su GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.2: CSS</h4>

Ripassa le basi di CSS leggendo questo tutorial da Mozilla: [tutorial CSS](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

<i>Questo esercizio non va sottomesso su GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.3: form HTML</h4>

Impara i fondamenti dei form HTML leggendo il tutorial di Mozilla [Il tuo primo form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

<i>Questo esercizio non va sottomesso su GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.4: Nuova nota</h4>

Nel capitolo [Caricamento di una pagina contenente JavaScript - review](/it/part0/fondamenti_di_applicazioni_web#caricamento-di-una-pagina-contenente-java-script-review) la successione di eventi causata dall'apertura della pagina <https://studies.cs.helsinki.fi/exampleapp/notes> è raffigurata con un [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)

Il diagramma è stato realizzato usando il servizio [websequencediagrams](https://www.websequencediagrams.com) come segue: 

```
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
server-->browser: HTML-code
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
server-->browser: main.css
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
server-->browser: main.js

note over browser:
browser starts executing js-code
that requests JSON data from server 
end note

browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser:
browser executes the event handler
that renders notes to display
end note
```

**Crea un diagramma simile**, raffigurante la situazione in cui l'utente crea una nuova nota nella pagina <https://studies.cs.helsinki.fi/exampleapp/notes> quando scrive qualcosa nel campo di testo e preme il bottone <i>submit</i>. 

Se necessario, mostra le operazioni nel browser o nel server come commenti nel diagramma.

Il diagramma non deve necessariamente essere un sequence diagram. Qualunque modo rilevante di rappresentare gli eventi è accettabile.

Tutte le informazioni necessarie per svolgere questo e i prossimi due esercizi possono essere reperite dal testo di [questa sezione](/it/part0/fondamenti_di_applicazioni_web#form-e-http-post).
L'idea di questi esercizi è di leggere il testo una volta in più, e di riflettere a quel che viene descritto. Leggere il [codice](https://github.com/mluukkai/example_app) dell'applicazione non è necessario ma è ovviamente possibile.

  <h4>0.5: Single page app</h4>

Crea un diagramma raffigurante la situazione in cui l'utente apre la versione [single page app](/it/part0/fondamenti_di_applicazioni_web#single-page-app) dell'applicazione Note all'indirizzo <https://studies.cs.helsinki.fi/exampleapp/spa>.

  <h4>0.6: Nuova nota</h4>

Crea un diagramma raffigurante la situazione in cui l'utente crea una nuova nota usando la versione single page dell'applicazione.

Questo era l'ultimo esercizio, ed è tempo di fare il push delle tue risposte su GitHub e segnare gli esercizi come fatti nel [sistema di sottomissione](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
