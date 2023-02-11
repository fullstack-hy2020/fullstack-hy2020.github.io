---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: pt
---

<div class="content">

Já estamos trabalhando há um tempo apenas no "front-end", ou seja, com as funcionalidades do lado do cliente (navegador). Começaremos a trabalhar no "back-end", ou seja, com as funcionalidades do lado do servidor na [Parte 3](/pt/part3) deste curso. Contudo, agora daremos um passo nessa direção, assim familiarizando-nos com a comunicação do código executado no navegador com o back-end.

Vamos usar uma ferramenta destinada a ser usada durante a fase de desenvolvimento de software chamada [JSON Server](https://github.com/typicode/json-server), que atuará como nosso servidor.

Crie um arquivo chamado <i>db.json</i> na raiz do diretório do projeto de notas com o seguinte conteúdo:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML é fácil",
      "important": true
    },
    {
      "id": 2,
      "content": "O navegador só pode executar JavaScript",
      "important": false
    },
    {
      "id": 3,
      "content": "GET e POST são os métodos mais importantes do protocolo HTTP",
      "important": true
    }
  ]
}
```

É possível [instalar](https://github.com/typicode/json-server#getting-started) globalmente um servidor JSON na sua máquina usando o comando _npm install -g json-server_. Uma instalação global requer privilégios administrativos, o que significa que não é possível fazer isso em computadores de faculdade, etc.

Após a instalação, execute o seguinte comando para executar o json-server. O <i>json-server</i> é executado na porta 3000 por padrão; porém, como projetos criados usando o "create-react-app" reservam a porta 3000 para si, devemos definir uma porta alternativa — como a porta 3001 — para o json-server. A opção <em>--watch</em> procura automaticamente por quaisquer alterações salvas no arquivo <i>db.json</i>.
  
```js
json-server --port 3001 --watch db.json
```

Entretanto, não é necessária uma instalação global. A partir da raiz do diretório da sua aplicação, podemos executar o <i>json-server</i> usando o comando _npx_:

```js
npx json-server --port 3001 --watch db.json
```

Vamos acessar o endereço <http://localhost:3001/notes> no navegador. Vemos que o <i>json-server</i> serve as notas que escrevemos anteriormente no arquivo em formato JSON:

![](../../images/2/14new.png)

Se o seu navegador não tiver um formatador para exibir os dados JSON, instale um plugin como o [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) para facilitar sua vida.

A partir de agora, a ideia será salvar as notas no servidor, que, neste caso, significa salvá-las no json-server. O código React busca as notas do servidor e as renderiza na tela. Sempre que uma nova nota é adicionada à aplicação, o código React também a envia ao servidor para que a nova nota persista (persist — leia mais sobre persistência de dados [aqui](https://www.take.net/blog/tecnologia/persistencia-de-dados/)) na "memória".

O json-server armazena todos os dados no arquivo <i>db.json</i>, que reside no servidor. No mundo real, os dados seriam armazenados em algum tipo de banco de dados. No entanto, o json-server é uma ferramenta muito útil que permite o uso da funcionalidade de um servidor na fase de desenvolvimento sem a necessidade de programar nenhum desses outros softwares.

Nos familiarizaremos com os princípios de implementação das funcionalidades de um servidor com mais detalhes na [parte 3](/pt/part3) deste curso.

### O navegador como ambiente de execução

Nossa primeira tarefa é buscar as notas já existentes em nossa aplicação React a partir do endereço <http://localhost:3001/notes>.

Na [projeto-exemplo](/pt/part0/fundamentos_de_aplicacoes_web#executando-a-logica-da-aplicacao-no-navegador) da Parte 0, já aprendemos uma maneira de buscar dados de um servidor usando JavaScript. O código no exemplo estava buscando os dados usando [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), também conhecido como uma "requisição HTTP" feita usando um objeto XHR. Esta é uma técnica introduzida em 1999, no qual todos os navegadores têm oferecido suporte a ela já faz um bom tempo.

Já não é mais recomendado o uso do objeto XHR, e a maioria dos navegadores já suportam amplamente o método [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) ("ir buscar" ou "buscar"), que é baseado em chamadas conhecidas como [promessas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (promises), ao invés do modelo de gerenciamento de eventos utilizado pelo XHR.

Como lembrete da Parte 0 (que deve ser lembrado <i>de não ser usado</i> sem um motivo plausível), os dados foram buscados usando o XHR da seguinte maneira: 

```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // gerencia a resposta que é salva nos dados variáveis
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Desde o início, registramos um <i>gerenciador de evento</i> ao objeto <em>xhttp</em> representando a requisição HTTP, que será chamado pelo ambiente de execução JavaScript sempre que o estado do objeto <em>xhttp</em> mudar. Se a mudança no estado significa que a resposta à requisição chegou, então os dados são lidos de acordo com o que foi estabelecido.

Vale a pena notar que o código no gerenciador de eventos é definido antes da requisição ser enviada ao servidor. Mesmo assim, o código dentro do gerenciador de eventos será executado em um momento posterior. Portanto, o código não executa sincronamente "de cima para baixo", mas sim <i>assincronamente</i> (asynchronously). JavaScript chama em algum momento o gerenciador de eventos que foi registrado para a requisição.

Uma forma comum de fazer requisições sincronas em Java, por exemplo, funcionaria da seguinte maneira (N.B. (Nota Bene): este código Java não funciona):

```java
HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

Em Java, o código é executado linha a linha e é interrompido para esperar pela requisição HTTP, o que significa esperar até o comando _request.get(...)_ ser concluído. Os dados retornados pelo comando, neste caso as notas, são então armazenados em uma variável na qual podemos manipular os dados da maneira que desejarmos.

Por outro lado, os ambientes de tempo de execução JavaScript, ou "engines" (motores), seguem o [modelo assíncrono](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). Em princípio, isso requer que todas as [operações IO](https://en.wikipedia.org/wiki/Input/output) (com algumas exceções) sejam executadas como não-bloqueantes. Isso significa que a execução do código continua imediatamente após a chamada de uma função IO, sem esperar que ela termine.

Quando uma operação assíncrona é concluída, ou mais especificamente, algum tempo depois de sua conclusão, o que acontece é que o motor JavaScript chama os gerenciadores de evento registrados na operação.

Atualmente, os motores JavaScript são <i>single-threaded</i> (linha de execução única), o que significa que não podem executar código em paralelo. Como resultado, na prática, é uma exigência usar um modelo não-bloqueante para a execução de operações IO. Caso contrário, o navegador "congelaria" durante a busca de dados em um servidor, por exemplo.

Outra consequência da natureza single-threaded dos motores JavaScript é que se alguma execução de código levar muito tempo, o navegador ficará preso durante toda a execução. Se adicionássemos o seguinte código no topo de nossa aplicação...

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('fim do loop')
}, 5000)
```

... tudo funcionaria normalmente por 5 segundos. No entanto, quando a função definida como o parâmetro para <em>setTimeout</em> é executada, o navegador fica preso durante toda a execução do longo loop. Mesmo a aba do navegador não pode ser fechada durante a execução do loop, pelo menos não no Chrome.

Para o navegador permanecer <i>responsivo</i>, ou seja, ser capaz de reagir continuamente às operações do usuário com velocidade suficiente, a lógica do código precisa ser tal que nenhuma única computação tenha de levar tanto tempo para se realizar.

Existe uma série de materiais sobre o tema disponíves na internet. Uma apresentação particularmente clara do tópico é a palestra de Philip Roberts chamada [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) (disponível em português).

É possível executar código paralelizado nos navegadores de hoje em dia com a ajuda dos chamados [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). No entanto, o loop de eventos de uma única janela do navegador ainda é realizado como [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### npm

Vamos voltar ao assunto sobre obtenção de dados do servidor.

Poderíamos usar a função baseada em promessas [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), mencionada anteriormente, para puxar (pull) os dados do servidor. Fetch é uma ótima ferramenta. É padronizada e tem suporte de todos os navegadores modernos (exceto o IE [Internet Explorer]).

Dito isso, usaremos a biblioteca [axios](https://github.com/axios/axios) para fazer essa comunicação entre navegador e servidor. Ela funciona como o fetch, mas é um pouco mais agradável de se usar. Outra boa razão para usar o axios é que nos familiarizaremos com a adição de bibliotecas externas em projetos React, conhecidas como <i>pacotes npm</i> (npm packages).

Hoje em dia, praticamente todos os projetos JavaScript são definidos usando o gerenciador de pacotes do Node, conhecido como [npm](https://docs.npmjs.com/getting-started/what-is-npm) (abreviação de "Node Package Manager"). Os projetos criados usando "create-react-app" também seguem o formato npm. Um indicador claro de que um projeto usa npm é o arquivo <i>package.json</i> localizado na raiz do projeto:

```json
{
  "name": "notes-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

Neste ponto, o objeto <i>dependencies</i>, que é uma parte do documento <i>package.json</i>, é o que mais nos interessa agora, pois define quais são as <i>dependências</i> ou bibliotecas externas do projeto.

Agora queremos usar o axios. Teoricamente, poderíamos definir a biblioteca diretamente no arquivo <i>package.json</i>, mas é melhor instalá-la a partir da linha de comando.

```js
npm install axios
```

**N.B.: os comandos do _npm_ sempre devem ser executados no diretório raiz do projeto**, onde o arquivo <i>package.json</i> pode ser encontrado.

O axios agora está incluído entre as outras dependências:

```json
{
  "name": "notes-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.2.2", // highlight-line
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  // ...
}
```

Além de adicionar o axios às dependências, o comando <em>npm install</em> também <i>baixou</i> o código da biblioteca. Como outras dependências, o código pode ser encontrado no diretório <i>node\_modules</i> localizado na raiz. É possível notar que o diretório <i>node_modules</i> contém uma quantidade significativa de coisas interessantes.

Vamos fazer mais uma adição. Instale o <i>json-server</i> como uma dependência de desenvolvimento (usado apenas durante o desenvolvimento) executando o comando...

```js
npm install json-server --save-dev
```

... e fazendo uma pequena adição ao objeto <i>scripts</i> do arquivo <i>package.json</i>:

```json
{
  // ... 
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  },
}
```
^^^^^^^^^^^^
### PARTE REVISADA









We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

```js
npm run server
```

We will get more familiar with the _npm_ tool in the [third part of the course](/en/part3).

**NB** The previously started json-server must be terminated before starting a new one; otherwise, there will be trouble:

![cannot bind to port 3001 error](../../images/2/15b.png)

The red print in the error message informs us about the issue:

<i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i> 

As we can see, the application is not able to bind itself to the [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). The reason being that port 3001 is already occupied by the previously started json-server.

We used the command _npm install_ twice, but with slight differences:

```js
npm install axios
npm install json-server --save-dev
```

There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.

### Axios and promises

Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001.

NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run react-app.

The library can be brought into use the same way other libraries, e.g. React, are, i.e., by using an appropriate <em>import</em> statement.

Add the following to the file <i>index.js</i>:

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

If you open <http://localhost:3000> in the browser, this should be printed to the console

![promises printed to console](../../images/2/16new.png)

Axios' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

The documentation on Mozilla's site states the following about promises:

> <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

1. The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.
2. The promise is <i>fulfilled</i>: It means that the operation has been completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.
3. The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.

The first promise in our example is <i>fulfilled</i>, representing a successful _axios.get('http://localhost:3001/notes')_ request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
The following is printed to the console:

![json object data printed to console](../../images/2/17new.png)

The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>.

Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the <em>then</em> method call to the axios method call, so that it follows it directly:

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console.

A more readable way to format <i>chained</i> method calls is to place each call on its own line:

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see the previous image) using the <i>content-type</i> header.

We can finally begin using the data fetched from the server.

Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfully retrieve a response:

```js
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the <i>App</i> component.

What's not immediately obvious, however, is where the command <em>axios.get</em> should be placed within the component.

### Effect-hooks

We have already used [state hooks](https://reactjs.org/docs/hooks-state.html) that were introduced along with React version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), which provide state to React components defined as functions - the so-called <i>functional components</i>. Version 16.8.0 also introduces [effect hooks](https://reactjs.org/docs/hooks-effect.html) as a new feature. As per the official docs:

> <i>The Effect Hook lets you perform side effects on function components.</i>
> <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.</i>

As such, effect hooks are precisely the right tool to use when fetching data from a server.

Let's remove the fetching of data from <i>index.js</i>. Since we're gonna be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

The <i>App</i> component changes as follows:

```js
import { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

We have also added a few helpful prints, which clarify the progression of the execution.

This is printed to the console:

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

First, the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn't been fetched from the server yet.

The following function, or effect in React parlance:
```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

is executed immediately after rendering. The execution of the function results in <i>effect</i> being printed to the console, and the command <em>axios.get</em> initiates the fetching of data from the server as well as registers the following function as an <i>event handler</i> for the operation:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>.

As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen.

Finally, let's take a look at the definition of the effect hook as a whole:

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Let's rewrite the code a bit differently.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

Now we can see more clearly that the function [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation:

> <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>

So by default, the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component.

There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.

Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!

Note that we could have also written the code for the effect function this way:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the <em>then</em> method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

We still have a problem with our application. When adding new notes, they are not stored on the server.

The code for the application, as described so far, can be found in full on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4), on branch <i>part2-4</i>.

### The development runtime environment 

The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application

![diagram of composition of react app](../../images/2/18e.png)

The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. The server we query the data from - <i>json-server</i> - gets its data from the file <i>db.json</i>.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.

</div>

<div class="tasks">

<h3>Exercise 2.11.</h3>

<h4>2.11: The Phonebook Step6</h4>

We continue with developing the phonebook. Store the initial state of the application in the file <i>db.json</i>, which should be placed in the root of the project.

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}
```

Start json-server on port 3001 and make sure that the server returns the list of people by going to the address <http://localhost:3001/persons> in the browser.


If you receive the following error message:

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

it means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn't work.

Modify the application such that the initial state of the data is fetched from the server using the <i>axios</i>-library. Complete the fetching with an [Effect hook](https://reactjs.org/docs/hooks-effect.html).

</div>
