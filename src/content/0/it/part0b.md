---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: it
---

<div class="content">

Prima di iniziare a programmare, esamineremo alcuni principi dello sviluppo web esaminando un'applicazione di esempio su <https://studies.cs.helsinki.fi/exampleapp>.

L'applicazione esiste solo per dimostrare alcuni concetti base del corso e non sono in alcun modo esempi di <i>come</i> le applicazioni web dovrebbero essere realizzate.
Al contrario, dimostrano alcune vecchie tecniche di sviluppo web, che al giorno d'oggi possono anche essere viste come una <i>cattiva pratica</i>.

La programmazione nello stile consigliato comincia in [parte 1](/it/part1).

Apri l'[applicazione esempio](https://studies.cs.helsinki.fi/exampleapp) nel tuo browser. A volte questo richiede un po' di tempo.

**La prima regola dello sviluppo web**: Tieni sempre aperta la Developer Console nel tuo browser. In macOS, apri la console premendo `F12` o `option-cmd-i` contemporaneamente.
Su Windows o Linux, apri la console premendo `F12` o `ctrl-shift-i` contemporaneamente.
La console puo' anche essere aperta attraverso il [tasto menu](https://it.wikipedia.org/wiki/Tasto_Menu).

Ricordati di tenere <i>sempre</i> aperta la Developer Console durante lo sviluppo di applicazioni web.

La console si presenta così:

![](../../images/0/1e.png)

Assicurati che la tab <i>Network</i> sia aperta e seleziona l'opzione <i>Disable cache</i> come mostrato. Anche <i>Preserve log</i> può essere utile: salva i log stampati dall'applicazione quando la pagina viene ricaricata.

**NB:** La tab più importante è la <i>Console</i>. Tuttavia, nell'introduzione utilizzeremo un po' la tab <i>Network</i>.

### HTTP GET

Il server e il browser web comunicano tra loro utilizzando il protocollo [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP). La tab Network mostra come comunicano il browser e il server.

Quando ricarichi la pagina (premi il tasto F5 o il simbolo &#8634; sul tuo browser), la console mostra che si sono verificati due eventi:

- Il browser prende i contenuti della pagina <i>studies.cs.helsinki.fi/exampleapp</i> dal server
- E scarica l'immagine <i>kuva.png</i>

![](../../images/0/2e.png)

Su uno schermo piccolo potresti dover allargare la finestra della console per vederli.

Facendo clic sul primo evento vengono visualizzate ulteriori informazioni su ciò che sta accadendo:

![](../../images/0/3e.png)

La parte superiore, <i>General</i>, mostra che il browser ha effettuato una richiesta all'indirizzo <i>https://studies.cs.helsinki.fi/exampleapp</i> (sebbene l'indirizzo sia leggermente cambiato da quando è stata scattata questa foto) utilizzando il metodo [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) e che la richiesta è andata a buon fine, perché la risposta del server presenta lo [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 200.

La richiesta e la risposta del server hanno diversi [headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

![](../../images/0/4e.png)

La <i>Response headers</i> in alto mostra alcune informazioni come ad esempio la dimensione della risposta in byte e l'ora esatta della risposta. Un header importante [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) mostra che la risposta e' un file di testo in formato [utf-8](https://en.wikipedia.org/wiki/UTF-8), i cui contenuti sono stati formattati in HTML.
In questo modo il browser sa che la risposta è una normale pagina [HTML](https://en.wikipedia.org/wiki/HTML) che deve essere mostrata 'come una pagina web'.

La scheda <i>Response</i> mostra i dati della risposta, una normale pagina HTML. La sezione <i>body</i> determina la struttura della pagina visualizzata sullo schermo:

![](../../images/0/5e.png)

La pagina contiene un elemento [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), che a sua volta contiene un heading, un link alla pagina <i>notes</i> e un tag [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), e visualizza il numero di note create.

A causa del tag img, il browser esegue una seconda <i>richiesta HTTP</i> per ottenere l'immagine <i>kuva.png</i> dal server. I dettagli della richiesta sono i seguenti:

![](../../images/0/6e.png)

La richiesta è stata effettuata all'indirizzo <https://studies.cs.helsinki.fi/exampleapp/kuva.png> ed è di tipo HTTP GET. Gli headers di risposta dicono che la dimensione della risposta è 89350 byte e che il suo [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) è <i >image/png</i>, quindi è un'immagine png. Il browser utilizza queste informazioni per visualizzare correttamente l'immagine sullo schermo.

La catena di eventi causata dall'apertura della pagina https://studies.cs.helsinki.fi/exampleapp su un browser crea il seguente [diagramma di sequenza](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/):

![](../../images/0/7e.png)

Innanzitutto, il browser esegue una richiesta HTTP GET al server per recuperare il codice HTML della pagina. Il tag <i>img</i> nell'HTML richiede al browser di recuperare l'immagine <i>kuva.png</i>. Il browser esegue il rendering della pagina HTML e dell'immagine sullo schermo.

Anche se è difficile da notare, la pagina HTML inizia a essere visualizzata prima che l'immagine sia stata scaricata dal server.

### Applicazioni web tradizionali

La homepage dell'applicazione di esempio funziona come un' <i>applicazione web tradizionale</i>. Quando si accede alla pagina, il browser preleva dal server il documento HTML che dettaglia la struttura e il contenuto testuale della pagina.

In qualche modo, il server ha creato questo documento. Il documento può essere un file di testo <i>statico</i> salvato nella directory del server. In base al codice, il server può anche creare documenti HTML in maniera <i>dinamica</i> utilizzando, ad esempio, i dati provenienti da un database.
Il codice HTML dell'applicazione di esempio è stato formato in maniera dinamica, perché contiene informazioni sul numero di note create.

Il codice HTML della homepage è il seguente:

```js
const getFrontPageHtml = noteCount => {
  return `
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
`;
};

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length);
  res.send(page);
});
```

Per ora non e' necessario capire il codice.

Il contenuto della pagina HTML è stato salvato come stringa modello, ossia una stringa che consente di valutare, ad esempio, le variabili al suo interno. La parte della homepage che cambia dinamicamente, il numero di note salvate (nel codice <em>noteCount</em>), è sostituita dal numero di note attuale (nel codice <em>notes.length</em>) all'interno della stringa modello.

Ovviamente, scrivere HTML nel mezzo del codice non è intelligente, ma per i programmatori PHP della vecchia scuola era una pratica normale.

Nelle applicazioni web tradizionali il browser è "stupido". Semplicemente recupera i dati HTML dal server ma tutta la logica dell'applicazione rimane sul server. Un server può essere creato, ad esempio, utilizzando Java Spring come nel corso dell'Università di Helsinki [Web-palvelinohjelmointi](https://courses.helsinki.fi/fi/tkt21007/119558639), Python Flask (come nel corso [ tietokantasovellus](https://materiaalit.github.io/tsoha-18/)) o con [Ruby on Rails](http://rubyonrails.org/).

L'esempio usa[Express](https://expressjs.com/) di Node.js.
Questo corso utilizzerà Node.js ed Express per creare server web.

### Esecuzione della logica dell'applicazione nel browser

Tieni aperta la Developer Console. Svuota la console facendo clic sul simbolo 🚫 o digitando clear() nella console.
Ora, quando vai alla pagina [notes](https://studies.cs.helsinki.fi/exampleapp/notes), il browser esegue 4 richieste HTTP:

![](../../images/0/8e.png)

Tutte le richieste hanno tipi <i>diversi</i>. Il primo tipo di richiesta è <i>document</i>. È il codice HTML della pagina e ha il seguente aspetto:

![](../../images/0/9e.png)

Quando confrontiamo la pagina mostrata sul browser e il codice HTML restituito dal server, notiamo che il codice non contiene l'elenco delle note.
La sezione [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) dell'HTML contiene un tag [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) che fa sì che il browser recuperi un file JavaScript chiamato <i>main.js</i>.

Il codice JavaScript ha il seguente aspetto:

```js
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);
    console.log(data);

    var ul = document.createElement('ul');
    ul.setAttribute('class', 'notes');

    data.forEach(function(note) {
      var li = document.createElement('li');

      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content));
    });

    document.getElementById('notes').appendChild(ul);
  }
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

I dettagli del codice non sono importanti in questo momento, ma il codice è stato incluso per ravvivare le immagini e il testo. Inizieremo a programmare correttamente in [parte 1](/it/part1). In realtà, il codice di esempio in questa parte non è affatto rilevante per le tecniche di programmazione di questo corso.

> Alcuni potrebbero chiedersi perché viene utilizzato xhttp-object invece del moderno fetch. Ciò è dovuto al fatto che non si vuole ancora entrare nelle promesse (promises), e il codice ha un ruolo secondario in questa parte. Torneremo ai modi moderni per effettuare richieste al server nella parte 2.

Immediatamente dopo aver recuperato il tag <i>script</i>, il browser inizia a eseguire il codice.

Le ultime due righe fanno si che il browser esegua una richiesta HTTP GET all'indirizzo del server <i>/data.json</i>:

```js
xhttp.open('GET', '/data.json', true);
xhttp.send();
```

Questa è la richiesta più in basso mostrata nella scheda Network.

Possiamo provare ad andare all'indirizzo <https://studies.cs.helsinki.fi/exampleapp/data.json> direttamente dal browser:

![](../../images/0/10e.png)

Lì troviamo le note nel "formato grezzo" [JSON](https://it.wikipedia.org/wiki/JavaScript_Object_Notation).
Per impostazione predefinita, i browser basati su Chromium non sono molto bravi a visualizzare i dati in formato JSON. I plugin possono essere usati per gestire la formattazione. Installa, ad esempio, [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) su Chrome e ricarica la pagina. I dati ora sono ben formattati:

![](../../images/0/11e.png)

Quindi, il codice JavaScript della pagina delle note mostrato sopra scarica i dati JSON contenenti le note.

Successivamente, il seguente codice JavaScript crea un elenco puntato in base al contenuto delle note:

```js
const data = JSON.parse(this.responseText);
console.log(data);

var ul = document.createElement('ul');
ul.setAttribute('class', 'notes');

data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});

document.getElementById('notes').appendChild(ul);
```

Inizialmente, il codice crea una lista non ordinata con un tag [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)...

```js
var ul = document.createElement('ul');
ul.setAttribute('class', 'notes');
```

...e successivamente aggiunge un tag [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li) per ogni nota. Solo il campo <i>content</i> di ogni nota diventa il contenuto del tag li. I timestamp trovati nei dati grezzi non vengono nemmeno utilizzati.

```js
data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});
```

Ora apri la tab <i>Console</i> nella Developer Console:

![](../../images/0/12e.png)

Cliccando sul triangolino all'inizio della riga, è possibile espandere il testo sulla console.

![](../../images/0/13e.png)

Questo output sulla console è causato dal comando <em>console.log</em> nel codice:

```js
const data = JSON.parse(this.responseText);
console.log(data);
```

Quindi, dopo aver ricevuto i dati dal server, il codice li stampa sulla console.

La tab <i>Console</i> e il comando <em>console.log</em> ti diventeranno molto familiari durante il corso.

### Event handlers e funzioni di callback

La struttura di questo codice è un po' strana:

```js
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  // codice che si occupa della risposta del server
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

La richiesta al server viene inviata nell'ultima riga, ma il codice per gestire la risposta si trova più in alto. Cosa sta succedendo?

```js
xhttp.onreadystatechange = function () {
```

Su questa riga, è definito un <i>event handler</i> (gestore di eventi) per l'evento <i>onreadystatechange</i> per l'oggetto <em>xhttp</em> che esegue la richiesta. Quando lo stato dell'oggetto cambia, il browser chiama la funzione gestore eventi. Il codice della funzione verifica che [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) sia uguale a 4 (che rappresenta la situazione <i>L'operazione è completa</i>) e che il codice di stato della risposta HTTP sia 200.

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // code that takes care of the server response
  }
};
```

Il modo di invocare event handlers è molto comune in JavaScript. Le funzioni event handlers sono chiamate funzioni [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). Il codice dell'applicazione non richiama le funzioni in sé, ma l'ambiente di runtime, il browser, richiama la funzione al momento opportuno, quando si è verificato l'<i>evento</i>.

### Document Object Model o DOM

Possiamo pensare alle pagine HTML come strutture ad albero.

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

La stessa struttura ad albero può essere vista nella scheda della console <i>Elements</i>.

![](../../images/0/14e.png)

Il funzionamento del browser si basa sull'idea di rappresentare gli elementi HTML come un albero.

Document Object Model, o [DOM](https://en.wikipedia.org/wiki/Document_Object_Model), è un'Application Programming Interface (<i>API</i>) che consente la modifica programmatica degli <i>alberi degli elementi </i> corrispondenti alle pagine web.

Il codice JavaScript introdotto nel capitolo precedente utilizzava l'API DOM per aggiungere un elenco di note alla pagina.

Il codice seguente crea un nuovo nodo nella variabile <em>ul</em> e vi aggiunge alcuni nodi child:

```js
var ul = document.createElement('ul');

data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});
```

Infine, il ramo della variabile <em>ul</em> è collegato al suo posto nell'albero HTML dell'intera pagina:

```js
document.getElementById('notes').appendChild(ul);
```

### Manipolazione dell'oggetto documento dalla console

Il nodo più in alto dell'albero DOM di un documento HTML è chiamato oggetto <em>documento</em>. Possiamo eseguire varie operazioni su una pagina web utilizzando l'API DOM. Puoi accedere all'oggetto <em>documento</em> digitando <em>document</em> nella tab Console:

![](../../images/0/15e.png)

Aggiungiamo una nuova nota alla pagina dalla console.

Per prima cosa, otterremo l'elenco delle note dalla pagina. L'elenco è nel primo elemento ul della pagina:

```js
list = document.getElementsByTagName('ul')[0];
```

Quindi crea un nuovo elemento li e aggiungi del contenuto di testo:

```js
newElement = document.createElement('li');
newElement.textContent = 'La manipolazione della pagina dalla console è facile';
```

E aggiungi il nuovo elemento li all'elenco:

```js
list.appendChild(newElement);
```

![](../../images/0/16e.png)

Anche se la pagina viene aggiornata sul tuo browser, le modifiche non sono permanenti. Se la pagina viene ricaricata, la nuova nota scomparirà perché le modifiche non sono state inviate al server. Il codice JavaScript recuperato dal browser creerà sempre l'elenco di note basato sui dati JSON dall'indirizzo <https://studies.cs.helsinki.fi/exampleapp/data.json>.

### CSS

L'elemento <i>head</i> del codice HTML della pagina Note contiene un tag [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), che determina che il browser deve recuperare un foglio di stile [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) dall'indirizzo [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).

I Cascading Style Sheets, o CSS, sono un linguaggio di markup utilizzato per determinare l'aspetto delle pagine web.

Il file CSS recuperato ha il seguente aspetto:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

Il file definisce due [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). Questi sono usati per selezionare alcune parti della pagina e per definire le regole di stile per modellare la pagina stessa.

Una definizione di selettore di classe (class selector) inizia sempre con un punto e contiene il nome della classe.

Le classi sono [attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class), che possono essere aggiunti agli elementi HTML.

Gli attributi (attributes) CSS possono essere esaminati nella tab <i>elements</i> della console:

![](../../images/0/17e.png)

L'elemento <i>div</i> più esterno ha la classe <i>container</i>. L'elemento <i>ul</i> che contiene l'elenco delle note ha la classe <i>notes</i>.

La regola CSS definisce che gli elementi con la classe <i>container</i> saranno delineati con un [border] di un pixel di larghezza (https://developer.mozilla.org/en-US/docs/Web/CSS/border ). Imposta anche 10 pixel di [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) sull'elemento. Questo aggiunge uno spazio vuoto tra il contenuto dell'elemento e il bordo.

La seconda regola CSS imposta il colore del testo delle note come blu.

Gli elementi HTML possono anche avere altri attributi oltre alle classi. L'elemento <i>div</i> che contiene le note ha un attributo [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). Il codice JavaScript utilizza l'id per trovare l'elemento.

La scheda <i>Elements</i> della console può essere utilizzata per modificare gli stili degli elementi.

![](../../images/0/18e.png)

Le modifiche apportate sulla console non saranno permanenti. Se vuoi apportare modifiche durature, queste devono essere salvate nel foglio di stile CSS sul server.

### Caricare una pagina contenente JavaScript - review

Rivediamo cosa succede quando si apre la pagina https://studies.cs.helsinki.fi/exampleapp/notes sul browser.

![](../../images/0/19e.png)

- Il browser preleva il codice HTML che definisce il contenuto e la struttura della pagina tramite una richiesta HTTP GET verso il server.
- I link nel codice HTML fanno sì che il browser recuperi anche il foglio di stile CSS <i>main.css</i>...
- ...e un file JavaScript <i>main.js</i>
- Il browser esegue il codice JavaScript. Il codice effettua una richiesta HTTP GET all'indirizzo https://studies.cs.helsinki.fi/exampleapp/data.json, che restituisce le note nel formato JSON data.
- Quando i dati sono stati recuperati, il browser esegue un <i>gestore di eventi</i> (event handler), che restituisce le note alla pagina utilizzando l'API DOM.

### Forms and HTTP POST

Esaminiamo come viene aggiunta una nuova nota.

La pagina Note contiene un [form-element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)(elemento modulo).

![](../../images/0/20e.png)

Quando si fa clic sul pulsante nel modulo, il browser invierà l'input dell'utente al server. Apriamo la scheda <i>Network</i> e vediamo come si presenta l'invio del modulo:

![](../../images/0/21e.png)

Sorprendentemente, l'invio del form causa in tutto <i>cinque</i> richieste HTTP.
Il primo è il form di invio dell'evento. Ingrandiamolo:

![](../../images/0/22e.png)

E' una richiesta [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) all'indirizzo del server <i>new_note</i>. Il server risponde con il codice di stato HTTP 302. Si tratta di un [URL redirect](https://en.wikipedia.org/wiki/URL_redirection), con il quale il server chiede al browser di effettuare una nuova richiesta HTTP GET all'indirizzo definito nell'intestazione <i>Location</i> - l'indirizzo <i>notes</i>.

Quindi, il browser ricarica la pagina Notes. Il ricaricamento provoca altre tre richieste HTTP: il recupero del foglio di stile (main.css), il codice JavaScript (main.js) e i dati grezzi delle note (data.json).

La scheda network mostra anche i dati inviati con il modulo:

![](../../images/0/23e.png)

Il tag Form ha gli attributi <i>action</i> e <i>method</i> che definiscono che l'invio del form viene eseguito come una richiesta HTTP POST all'indirizzo <i>new_note</i>.

![](../../images/0/24e.png)

Il codice sul server responsabile della richiesta POST è abbastanza semplice (NB: questo codice è sul server e non sul codice JavaScript recuperato dal browser):

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  });

  return res.redirect('/notes');
});
```

I dati vengono inviati come [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) della richiesta POST.

Il server può accedere ai dati accedendo al campo <em>req.body</em> dell'oggetto richiesta <em>req</em>.

Il server crea un nuovo oggetto nota e lo aggiunge a un array chiamato <em>notes</em>.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
});
```

Gli oggetti Nota hanno due campi: <i>content</i> che contiene il contenuto effettivo della nota e <i>date</i> che contiene la data e l'ora in cui è stata creata la nota.

Il server non salva le nuove note in un database, quindi le nuove note scompaiono quando il server viene riavviato.

### AJAX

La pagina Note dell'applicazione segue uno stile di sviluppo web dei primi anni novanta e usa "Ajax". In quanto tale, è sulla cresta dell'onda della tecnologia web dei primi anni 2000.

[AJAX](https://it.wikipedia.org/wiki/AJAX) (Asynchronous JavaScript and XML) è un termine introdotto nel febbraio 2005 sulla scia dei progressi nella tecnologia dei browser per descrivere un nuovo approccio rivoluzionario che ha consentito il recupero di contenuti nelle pagine Web utilizzando JavaScript incluso nell'HTML, senza la necessità di eseguire nuovamente il rendering della pagina.

Prima dell'era AJAX, tutte le pagine web funzionavano come l'[applicazione web tradizionale](/it/part0/fundamentals_of_web_apps#traditional-web-applications) che abbiamo visto in precedenza in questo capitolo.
Tutti i dati mostrati nella pagina sono stati recuperati con il codice HTML generato dal server.

La pagina Note utilizza AJAX per recuperare i dati delle note. L'invio del form utilizza ancora il meccanismo tradizionale di invio di form web.

Gli URL dell'applicazione riflettono i vecchi tempi spensierati. I dati JSON vengono recuperati dall'URL <https://studies.cs.helsinki.fi/exampleapp/data.json> e le nuove note vengono inviate all'URL <https://studies.cs.helsinki.fi/exampleapp/new_note >.
Al giorno d'oggi URL come questi non sarebbero considerati accettabili, in quanto non seguono le convenzioni generalmente riconosciute delle API [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services), che esamineremo di più in [parte 3](/it/parte3)

La cosa chiamata AJAX è ora così comune da essere data per scontata. Il termine è sbiadito nell'oblio e la nuova generazione non ne ha nemmeno sentito parlare.

### Single page app

Nella nostra app di esempio, la home page funziona come una pagina Web tradizionale: tutta la logica è sul server e il browser esegue solo il rendering dell'HTML come indicato.

La pagina Notes delega parte della responsabilità al browser che genera il codice HTML per le note esistenti. Il browser affronta questo compito eseguendo il codice JavaScript che ha recuperato dal server. Il codice recupera le note dal server come dati JSON e aggiunge elementi HTML per visualizzare le note sulla pagina utilizzando [DOM-API](/it/part0/fundamentals_of_web_apps#document-object-model-or-dom).

Negli ultimi anni è emerso lo stile di creazione di applicazioni web [Single-page application](https://en.wikipedia.org/wiki/Applicazione a pagina singola) (SPA). I siti web in stile SPA non recuperano tutte le loro pagine separatamente dal server come fa la nostra applicazione di esempio, ma comprendono invece solo una pagina HTML recuperata dal server, i cui contenuti vengono manipolati con JavaScript che viene eseguito nel browser.

La pagina Notes della nostra applicazione ha alcune somiglianze con le app in stile SPA, ma non è ancora una SPA. Anche se la logica per il rendering delle note viene eseguita nel browser, la pagina utilizza ancora il modo tradizionale di aggiungere nuove note. I dati vengono inviati al server con l'invio del modulo e il server indica al browser di ricaricare la pagina Notes con un <i>reindirizzamento</i>.

Una versione dell'app a pagina singola della nostra applicazione di esempio può essere trovata da <https://studies.cs.helsinki.fi/exampleapp/spa>.
A prima vista, l'applicazione sembra esattamente la stessa della precedente.
Il codice HTML è quasi identico, ma il file JavaScript è diverso (<i>spa.js</i>) e c'è un piccolo cambiamento nel modo in cui è definito il tag form:

![](../../images/0/25e.png)

Il form non ha attributi <i>action</i> o <i>method</i> per definire come e dove inviare i dati di input.

Apri la scheda <i>Network</i> e svuotala. Quando ora crei una nuova nota, noterai che il browser invia solo una richiesta al server.

![](../../images/0/26e.png)

La richiesta POST all'indirizzo <i>new_note_spa</i> contiene la nuova nota come dati JSON contenenti sia il contenuto della nota (<i>content</i>) che il timestamp (<i>date</i >):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

Il <i>Content-Type</i> header della richiesta comunica al server che i dati inclusi sono rappresentati nel formato JSON.

![](../../images/0/27e.png)

Senza questo header, il server non saprebbe come analizzare correttamente i dati.

Il server risponde con il codice di stato [201 created](https://httpsstatuses.com/201). Questa volta il server non richiede un reindirizzamento, il browser rimane sulla stessa pagina e non invia ulteriori richieste HTTP.

La versione SPA dell'app non invia i dati del modulo in modo tradizionale, ma utilizza invece il codice JavaScript recuperato dal server.
Esamineremo un po' questo codice, anche se comprenderne tutti i dettagli non è ancora importante.

```js
var form = document.getElementById('notes_form');
form.onsubmit = function(e) {
  e.preventDefault();

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  };

  notes.push(note);
  e.target.elements[0].value = '';
  redrawNotes();
  sendToServer(note);
};
```

Il comando <em>document.getElementById('notes_form')</em> indica al codice di recuperare l'elemento form dalla pagina e di registrare un <i>event handler</i> per gestire l'evento di invio del form. Il gestore di eventi (event handler) chiama immediatamente il metodo <em>e.preventDefault()</em> per impedire la gestione predefinita dell'invio del modulo. Il metodo predefinito invierebbe i dati al server e causerebbe una nuova richiesta GET, cosa che non vogliamo che accada.

Quindi il gestore di eventi (event handler) crea una nuova nota, la aggiunge all'elenco delle note con il comando <em>notes.push(note)</em>, restituisce l'elenco delle note sulla pagina e invia la nuova nota al server.

Il codice per inviare la nota al server è il seguente:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest();
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true);
  xhttpForPost.setRequestHeader('Content-type', 'application/json');
  xhttpForPost.send(JSON.stringify(note));
};
```

Il codice determina che i dati devono essere inviati con una richiesta HTTP POST e il tipo di dati deve essere JSON. Il tipo di dati è determinato con un header <i>Content-type</i>. Quindi i dati vengono inviati come stringa JSON.

Il codice dell'applicazione è disponibile su <https://github.com/mluukkai/example_app>.
Vale la pena ricordare che l'applicazione ha il solo scopo di dimostrare i concetti del corso. Il codice segue uno stile di sviluppo inadeguato e non dovrebbe essere usato come esempio quando si creano le proprie applicazioni. Lo stesso vale per gli URL utilizzati. L'URL <i>new_note_spa</i>, a cui vengono inviate le nuove note, non aderisce alle migliori pratiche correnti.

### Librerie JavaScript

L'app di esempio viene eseguita con il cosiddetto [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/), utilizzando solo DOM-API e JavaScript per manipolare la struttura delle pagine.

Al giorno d'oggi, invece di utilizzare solo JavaScript e l'API DOM, per manipolare le pagine vengono spesso utilizzate diverse librerie contenenti strumenti con cui è più facile lavorare rispetto all'API DOM. Una di queste librerie è la popolarissima [jQuery](https://jquery.com/).

jQuery è stato sviluppato quando le applicazioni web seguivano principalmente lo stile tradizionale del server che genera pagine HTML, la cui funzionalità è stata migliorata dal lato browser utilizzando JavaScript scritto con jQuery. Uno dei motivi del successo di jQuery è stata la sua cosiddetta compatibilità cross-browser. La libreria funzionava indipendentemente dal browser o dall'azienda che la produceva, quindi non c'era bisogno di soluzioni specifiche per browser. Al giorno d'oggi l'utilizzo di jQuery non è così giustificato dato l'avanzamento di vanilla JS e i browser più popolari generalmente supportano bene le funzionalità di base.

L'ascesa delle single-page app ha portato molti modi più "moderni" di sviluppo web rispetto a jQuery. Uno dei primi preferiti e' stato [BackboneJS](http://backbonejs.org/). Dopo il suo [lancio](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) nel 2012, [AngularJS](https: //angularjs.org/) è diventato rapidamente quasi lo standard de facto dello sviluppo web moderno.

Tuttavia, la popolarità di Angular è crollata nell'ottobre 2014 dopo che [il team di Angular ha annunciato che il supporto per la versione 1 terminerà](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html) e Angular 2 non sarà retrocompatibile con la prima versione. Angular 2 e le versioni più recenti non hanno ricevuto un caloroso benvenuto.

Attualmente lo strumento più popolare per implementare la logica lato browser delle applicazioni web è la libreria [React](https://reactjs.org/) di Facebook.
Durante questo corso, acquisiremo familiarità con React e la libreria [Redux](https://github.com/reactjs/redux), che vengono spesso utilizzate insieme.

Lo stato di React sembra forte, ma il mondo di JavaScript è in continua evoluzione. Ad esempio, recentemente un nuovo arrivato - [VueJS](https://vuejs.org/) - ha suscitato un certo interesse.

### Full stack web development

Cosa significa il nome del corso, <i>Full stack web development</i>? Full stack è qualcosa di cui tutti parlano, mentre nessuno sa davvero cosa significhi. O almeno, non esiste una definizione concordata per il termine.

Praticamente tutte le applicazioni web hanno (almeno) due "livelli": il browser, essendo più vicino all'utente finale, è il livello superiore e il server quello inferiore. Spesso c'è anche un livello di database sotto il server. Possiamo quindi pensare all'<i>architettura</i> di un'applicazione web come una sorta di <i>stack</i> di livelli.

Spesso si parla anche di [frontend e backend](https://en.wikipedia.org/wiki/Front_and_back_ends). Il browser è il frontend e JavaScript che viene eseguito sul browser è codice frontend. Il server è il backend.

Nel contesto di questo corso, lo sviluppo web full stack significa che ci concentriamo su tutte le parti dell'applicazione: il frontend, il backend e il database. A volte il software sul server e il suo sistema operativo sono visti come parti dello stack, ma non li esamineremo.

Codificheremo il backend con JavaScript, utilizzando l'ambiente runtime [Node.js](https://nodejs.org/en/). L'utilizzo dello stesso linguaggio di programmazione su più livelli dello stack offre allo sviluppo web full stack una dimensione completamente nuova. Tuttavia, non è un requisito per lo sviluppo Web full stack utilizzare lo stesso linguaggio di programmazione (JavaScript) per tutti i livelli dello stack.

In passato era più comune per gli sviluppatori specializzarsi in un livello dello stack, ad esempio il backend. Le tecnologie sul backend e sul frontend erano piuttosto diverse. Con la tendenza full stack, è diventato comune per gli sviluppatori essere esperti su tutti i livelli dell'applicazione e del database. Spesso, gli sviluppatori full stack devono anche avere sufficienti capacità di configurazione e amministrazione per far funzionare la loro applicazione, ad esempio, nel cloud.

### JavaScript fatigue

Lo sviluppo web full stack è impegnativo in molti modi. Molte cose accadono in molte aree e contemporaneamente. Il debug è un po' più difficile rispetto alle normali applicazioni desktop. JavaScript non funziona sempre come ti aspetteresti (rispetto a molti altri linguaggi) e il modo asincrono in cui funzionano i suoi ambienti di runtime causa ogni tipo di sfida.

Comunicare sul web richiede la conoscenza del protocollo HTTP. È inoltre necessario gestire i database e l'amministrazione e la configurazione del server. Infine, sarebbe bene conoscere abbastanza CSS per rendere le applicazioni presentabili.

Il mondo di JavaScript si sviluppa rapidamente, il che comporta una serie di sfide. Strumenti, librerie e il linguaggio stesso sono in costante sviluppo. Alcuni stanno iniziando a stancarsi del costante cambiamento e hanno coniato un termine per descrivere questo fenomeno: <em>JavaScript fatigue</em>. Vedi [How to Manage JavaScript Fatigue on auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) o [JavaScript fatigue on Medium](https://medium.com/@ericclemmons /javascript-fatigue-48d4011b6fc4).

Durante questo corso soffrirai di JavaScript Fatigue. Fortunatamente, ci sono alcuni modi per smussare la curva di apprendimento e possiamo iniziare con la programmazione invece che con la configurazione.
Non possiamo evitare completamente la configurazione, ma possiamo tranquillamente andare avanti nelle prossime settimane evitando le parti peggiori della configurazione.

</div>

<div class="tasks"> 
  <h3>Esercizi 0.1.-0.6.</h3>

Gli esercizi vengono inviati tramite GitHub e contrassegnandoli come eseguiti nel [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Puoi inviare tutti gli esercizi nella stesso repository o utilizzare più repository diverse. Se invii esercizi da parti diverse nella stessa repository, nomina bene le tue cartelle. Se utilizzi una repository privata per inviare gli esercizi, aggiungi _mluukkai_ come collaboratore.

Un buon modo per denominare le cartelle nella repository di invio è il seguente:

```
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

Quindi, ogni parte ha la sua cartella, che contiene una cartella per ogni set di esercizi (come gli esercizi unicafe nella parte 1).

Gli esercizi vengono presentati **una parte alla volta**. Dopo aver inviato gli esercizi per una parte, non è più possibile inviare gli esercizi persi per quella parte.

  <h4>0.1: HTML</h4>

Rivedere le basi dell'HTML leggendo questo tutorial da Mozilla: [tutorial HTML](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics).

<i>Questo esercizio non è inviato a GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.2: CSS</h4>

Rivedere le basi dei CSS leggendo questo tutorial da Mozilla: [Tutorial CSS](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

<i>Questo esercizio non è inviato a GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.3: HTML forms</h4>

Scopri le basi dei forms HTML leggendo il tutorial di Mozilla [Il tuo primo modulo](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

<i>Questo esercizio non è inviato a GitHub, è sufficiente leggere il tutorial</i>

  <h4>0.4: nuova nota</h4>

Nel capitolo [Caricamento di una pagina contenente JavaScript - recensione](/it/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review) la catena di eventi causata dall'apertura della pagina <https://studies.cs .helsinki.fi/exampleapp/notes> è rappresentato come un [diagramma di sequenza](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)

Il diagramma è stato realizzato utilizzando il servizio [websequencediagrams](https://www.websequencediagrams.com) come segue:

```
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
server-->browser: HTML-code
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
server-->browser: main.css
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
server-->browser: main.js

nota sul browser:
il browser avvia l'esecuzione del codice JavaScript
che richiede i dati in formato JSON dal server
nota finale

browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

nota sul browser:
il browser esegue il gestore di eventi (event handler)
che rende le note da visualizzare
nota finale
```

**Crea un diagramma simile** raffigurante la situazione in cui l'utente crea una nuova nota sulla pagina <https://studies.cs.helsinki.fi/exampleapp/notes> scrivendo qualcosa nel campo di testo e facendo clic su <i> submit</i>.

Se necessario, mostra le operazioni sul browser o sul server come commenti sul diagramma.

Il diagramma non deve essere un diagramma di sequenza. Qualsiasi modo ragionevole di presentare gli eventi va bene.

Tutte le informazioni necessarie per farlo, e per i prossimi due esercizi, possono essere trovate nel testo di [questa parte](/it/part0/fundamentals_of_web_apps#forms-and-http-post).
L'idea di questi esercizi è di rileggere il testo ancora una volta e di pensare a cosa sta succedendo. La lettura del [codice] dell'applicazione (https://github.com/mluukkai/example_app) non è necessaria, ma è ovviamente possibile.

  <h4>0.5: Single page app</h4>

Crea un diagramma che rappresenti la situazione in cui l'utente accede alla versione [single page app](/it/part0/fundamentals_of_web_apps#app a pagina singola) dell'app per le note su <https://studies.cs.helsinki.fi/ esempioapp/spa>.

   <h4>0.6: Nuova nota</h4>

Crea un diagramma che rappresenti la situazione in cui l'utente crea una nuova nota utilizzando la versione a pagina singola dell'app.

Questo è stato l'ultimo esercizio ed è ora di inviare le tue risposte e contrassegnare gli esercizi come eseguiti nella [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
