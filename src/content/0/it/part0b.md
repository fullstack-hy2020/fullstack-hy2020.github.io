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

### Loading a page containing JavaScript - review

Let's review what happens when the page https://studies.cs.helsinki.fi/exampleapp/notes is opened on the browser.

![](../../images/0/19e.png)

- The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request.
- Links in the HTML code cause the browser to also fetch the CSS style sheet <i>main.css</i>...
- ...and a JavaScript code file <i>main.js</i>
- The browser executes the JavaScript code. The code makes an HTTP GET request to the address https://studies.cs.helsinki.fi/exampleapp/data.json, which
  returns the notes as JSON data.
- When the data has been fetched, the browser executes an <i>event handler</i>, which renders the notes to the page using the DOM-API.

### Forms and HTTP POST

Next let's examine how adding a new note is done.

The Notes page contains a [form-element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

![](../../images/0/20e.png)

When the button on the form is clicked, the browser will send the user input to the server. Let's open the <i>Network</i> tab and see what submitting the form looks like:

![](../../images/0/21e.png)

Surprisingly, submitting the form causes altogether <i>five</i> HTTP requests.
The first one is the form submit event. Let's zoom into it:

![](../../images/0/22e.png)

It is an [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request to the server address <i>new_note</i>. The server responds with HTTP status code 302. This is a [URL redirect](https://en.wikipedia.org/wiki/URL_redirection), with which the server asks the browser to do a new HTTP GET request to the address defined in the header's <i>Location</i> - the address <i>notes</i>.

So, the browser reloads the Notes page. The reload causes three more HTTP requests: fetching the style sheet (main.css), the JavaScript code (main.js), and the raw data of the notes (data.json).

The network tab also shows the data submitted with the form:

![](../../images/0/23e.png)

The Form tag has attributes <i>action</i> and <i>method</i>, which define that submitting the form is done as an HTTP POST request to the address <i>new_note</i>.

![](../../images/0/24e.png)

The code on the server responsible for the POST request is quite simple (NB: this code is on the server, and not on the JavaScript code fetched by the browser):

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  });

  return res.redirect('/notes');
});
```

Data is sent as the [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) of the POST-request.

The server can access the data by accessing the <em>req.body</em> field of the request object <em>req</em>.

The server creates a new note object, and adds it to an array called <em>notes</em>.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
});
```

The Note objects have two fields: <i>content</i> containing the actual content of the note, and <i>date</i> containing the date and time the note was created.

The server does not save new notes to a database, so new notes disappear when the server is restarted.

### AJAX

The Notes page of the application follows an early-nineties style of web development and "uses Ajax". As such, it's on the crest of the wave of early 2000's web technology.

[AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) is a term introduced in February 2005 on the back of advancements in browser technology to describe a new revolutionary approach that enabled the fetching of content to web pages using JavaScript included within the HTML, without the need to rerender the page.

Prior to the AJAX era, all web pages worked like the [traditional web application](/en/part0/fundamentals_of_web_apps#traditional-web-applications) we saw earlier in this chapter.
All of the data shown on the page was fetched with the HTML-code generated by the server.

The Notes page uses AJAX to fetch the notes data. Submitting the form still uses the traditional mechanism of submitting web-forms.

The application URLs reflect the old, carefree times. JSON data is fetched from the url <https://studies.cs.helsinki.fi/exampleapp/data.json> and new notes are sent to the URL <https://studies.cs.helsinki.fi/exampleapp/new_note>.  
Nowadays URLs like these would not be considered acceptable, as they don't follow the generally acknowledged conventions of [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services) APIs, which we'll look into more in [part 3](/en/part3)

The thing termed AJAX is now so commonplace that it's taken for granted. The term has faded into oblivion, and the new generation has not even heard of it.

### Single page app

In our example app, the home page works like a traditional web-page: All of the logic is on the server, and the browser only renders the HTML as instructed.

The Notes page gives some of the responsibility, generating the HTML code for existing notes, to the browser. The browser tackles this task by executing the JavaScript code it fetched from the server. The code fetches the notes from the server as JSON-data and adds HTML elements for displaying the notes to the page using the [DOM-API](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom).

In recent years, the [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) style of creating web-applications has emerged. SPA-style websites don't fetch all of their pages separately from the server like our sample application does, but instead comprise only one HTML page fetched from the server, the contents of which are manipulated with JavaScript that executes in the browser.

The Notes page of our application bears some resemblance to SPA-style apps, but it's not quite there yet. Even though the logic for rendering the notes is run on the browser, the page still uses the traditional way of adding new notes. The data is sent to the server with form submit, and the server instructs the browser to reload the Notes page with a <i>redirect</i>.

A single page app version of our example application can be found from <https://studies.cs.helsinki.fi/exampleapp/spa>.
At first glance, the application looks exactly the same as the previous one.
The HTML code is almost identical, but the JavaScript file is different (<i>spa.js</i>) and there is a small change in how the form-tag is defined:

![](../../images/0/25e.png)

The form has no <i>action</i> or <i>method</i> attributes to define how and where to send the input data.

Open the <i>Network</i>-tab and empty it. When you now create a new note, you'll notice that the browser sends only one request to the server.

![](../../images/0/26e.png)

The POST request to the address <i>new_note_spa</i> contains the new note as JSON-data containing both the content of the note (<i>content</i>) and the timestamp (<i>date</i>):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

The <i>Content-Type</i> header of the request tells the server that the included data is represented in the JSON format.

![](../../images/0/27e.png)

Without this header, the server would not know how to correctly parse the data.

The server responds with status code [201 created](https://httpstatuses.com/201). This time the server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP requests.

The SPA version of the app does not send the form data in the traditional way, but instead uses the JavaScript code it fetched from the server.
We'll look into this code a bit, even though understanding all the details of it is not important just yet.

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

The command <em>document.getElementById('notes_form')</em> instructs the code to fetch the form-element from the page, and to register an <i>event handler</i> to handle the form submit event. The event handler immediately calls the method <em>e.preventDefault()</em> to prevent the default handling of form submit. The default method would send the data to the server and cause a new GET request, which we don't want to happen.

Then the event handler creates a new note, adds it to the notes list with the command <em>notes.push(note)</em>, rerenders the note list on the page and sends the new note to the server.

The code for sending the note to the server is as follows:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest();
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true);
  xhttpForPost.setRequestHeader('Content-type', 'application/json');
  xhttpForPost.send(JSON.stringify(note));
};
```

The code determines that the data is to be sent with an HTTP POST request and the data type is to be JSON. The data type is determined with a <i>Content-type</i> header. Then the data is sent as JSON-string.

The application code is available at <https://github.com/mluukkai/example_app>.
It's worth remembering that the application is only meant to demonstrate the concepts of the course. The code follows a poor style of development in some measure, and should not be used as an example when creating your own applications. The same is true for the URLs used. The URL <i>new_note_spa</i>, which new notes are sent to, does not adhere to current best practices.

### JavaScript-libraries

The sample app is done with so called [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/), using only the DOM-API and JavaScript to manipulate the structure of the pages.

Instead of using JavaScript and the DOM-API only, different libraries containing tools that are easier to work with compared to the DOM-API are often used to manipulate pages. One of these libraries is the ever-so-popular [jQuery](https://jquery.com/).

jQuery was developed back when web applications mainly followed the traditional style of the server generating HTML pages, the functionality of which was enhanced on the browser side using JavaScript written with jQuery. One of the reasons for the success of jQuery was its so-called cross-browser compatibility. The library worked regardless of the browser or the company that made it, so there was no need for browser-specific solutions. Nowadays using jQuery is not as justified given the advancement of vanilla JS, and the most popular browsers generally support basic functionalities well.

The rise of the single page app brought several more "modern" ways of web development than jQuery. The favorite of the first wave of developers was [BackboneJS](http://backbonejs.org/). After its [launch](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) in 2012, Google's [AngularJS](https://angularjs.org/) quickly became almost the de facto standard of modern web development.

However, the popularity of Angular plummeted in October 2014 after the [Angular team announced that support for version 1 will end](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html), and Angular 2 will not be backwards compatible with the first version. Angular 2 and the newer versions have not gotten too warm of a welcome.

Currently the most popular tool for implementing the browser-side logic of web-applications is Facebook's [React](https://reactjs.org/) library.
During this course, we will get familiar with React and the [Redux](https://github.com/reactjs/redux) library, which are frequently used together.

The status of React seems strong, but the world of JavaScript is ever changing. For example, recently a newcomer - [VueJS](https://vuejs.org/) - has been capturing some interest.

### Full stack web development

What does the name of the course, <i>Full stack web development</i>, mean? Full stack is a buzzword that everyone talks about, while no one really knows what it means. Or at least, there is no agreed-upon definition for the term.

Practically all web applications have (at least) two "layers": the browser, being closer to the end-user, is the top layer, and the server the bottom one. There is often also a database layer below the server. We can therefore think of the <i>architecture</i> of a web application as a kind of <i>stack</i> of layers.

Often, we also talk about the [frontend and the backend](https://en.wikipedia.org/wiki/Front_and_back_ends). The browser is the frontend, and JavaScript that runs on the browser is frontend code. The server on the other hand is the backend.

In the context of this course, full stack web development means that we focus on all parts of the application: the frontend, the backend, and the database. Sometimes the software on the server and its operating system are seen as parts of the stack, but we won't go into those.

We will code the backend with JavaScript, using the [Node.js](https://nodejs.org/en/) runtime environment. Using the same programming language on multiple layers of the stack gives full stack web development a whole new dimension. However, it's not a requirement of full stack web development to use the same programming language (JavaScript) for all layers of the stack.

It used to be more common for developers to specialize in one layer of the stack, for example the backend. Technologies on the backend and the frontend were quite different. With the Full stack trend, it has become common for developers to be proficient on all layers of the application and the database. Oftentimes, full stack developers must also have enough configuration and administration skills to operate their application, for example, in the cloud.

### JavaScript fatigue

Full stack web development is challenging in many ways. Things are happening in many places at once, and debugging is quite a bit harder than with regular desktop applications. JavaScript does not always work as you'd expect it to (compared to many other languages), and the asynchronous way its runtime environments work causes all sorts of challenges. Communicating on the web requires knowledge of the HTTP protocol. One must also handle databases and server administration and configuration. It would also be good to know enough CSS to make applications at least somewhat presentable.

The world of JavaScript develops fast, which brings its own set of challenges. Tools, libraries and the language itself are under constant development. Some are starting to get tired of the constant change, and have coined a term for it: <em>JavaScript fatigue</em>. See [How to Manage JavaScript Fatigue on auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) or [JavaScript fatigue on Medium](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).

You will suffer from JavaScript fatigue yourself during this course. Fortunately for us, there are a few ways to smooth the learning curve, and we can start with coding instead of configuration. We can't avoid configuration completely, but we can merrily push ahead in the next few weeks while avoiding the worst of configuration hells.

</div>

<div class="tasks"> 
  <h3>Exercises 0.1.-0.6.</h3>

The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well. If you use a private repository to submit the exercises, add _mluukkai_ as a collaborator to it.

One good way to name the directories in your submission repository is as follows:

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

So, each part has its own directory, which contains a directory for each exercise set (like the unicafe exercises in part 1).

The exercises are submitted **one part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.

  <h4>0.1: HTML</h4>

Review the basics of HTML by reading this tutorial from Mozilla: [HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics).

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

  <h4>0.2: CSS</h4>

Review the basics of CSS by reading this tutorial from Mozilla: [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

  <h4>0.3: HTML forms</h4>

Learn about the basics of HTML forms by reading Mozilla's tutorial [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

  <h4>0.4: new note</h4>

In chapter [Loading a page containing JavaScript - review](/en/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review) the chain of events caused by opening the page <https://studies.cs.helsinki.fi/exampleapp/notes> is depicted as a [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)

The diagram was made using [websequencediagrams](https://www.websequencediagrams.com) service as follows:

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

**Create a similar diagram** depicting the situation where the user creates a new note on page <https://studies.cs.helsinki.fi/exampleapp/notes> by writing something into the text field and clicking the <i>submit</i> button.

If necessary, show operations on the browser or on the server as comments on the diagram.

The diagram does not have to be a sequence diagram. Any sensible way of presenting the events is fine.

All necessary information for doing this, and the next two exercises, can be found from the text of [this part](/en/part0/fundamentals_of_web_apps#forms-and-http-post).
The idea of these exercises is to read the text through once more, and to think through what is going on there. Reading the application [code](https://github.com/mluukkai/example_app) is not necessary, but it is of course possible.

  <h4>0.5: Single page app</h4>

Create a diagram depicting the situation where the user goes to the [single page app](/en/part0/fundamentals_of_web_apps#single-page-app) version of the notes app at <https://studies.cs.helsinki.fi/exampleapp/spa>.

  <h4>0.6: New note</h4>

Create a diagram depicting the situation where the user creates a new note using the single page version of the app.

This was the last exercise, and it's time to push your answers to GitHub and mark the exercises as done in the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
