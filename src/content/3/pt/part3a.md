---
mainImage: ../../../images/part-3.svg
part: 3
letter: a
lang: pt
---

<div class="content">

Vamos focar no backend nesta parte: ou seja, na implementação de funcionalidades no lado do servidor da pilha.

Estaremos construindo nosso back-end utilizando [NodeJS](https://nodejs.org/en/), que é um ambiente de execução JavaScript baseado no motor JavaScript [Chrome V8](https://developers.google.com/v8/) do Google.

O conteúdo desta parte do curso foi escrita com base na versão <i>v18.13.0</i> do Node.js. Certifique-se de que a versão do seu Node é pelo menos tão nova quanto a versão utilizada aqui (você pode verificar a versão executando _node -v_ na linha de comando).

Como mencionado na [Parte 1](/pt/part1/java_script), os navegadores ainda não suportam as novas funcionalidades de JavaScript, e é por isso que o código em execução no navegador deve ser <i>transpilado</i> com o [babel](https://babeljs.io/), por exemplo. Mas a situação é diferente com JavaScript em execução no back-end. A versão mais recente do Node suporta a maioria das últimas funcionalidades de JavaScript, então podemos usar as últimas funcionalidades sem ter que transpilar nosso código.

Nosso objetivo é implementar um back-end que funcione com a aplicação de notas da [Parte 2](/pt/part2/). No entanto, vamos começar com o básico implementando um clássico programa "Olá, mundo!".

**Note** que nem todas as aplicações e exercícios nesta parte são aplicações React, e não usaremos o utilitário <i>create-react-app</i> para inicializar o projeto para esta aplicação.

Já tínhamos mencionado o [npm](/en/part2/getting_data_from_server#npm) na Parte 2, que é uma ferramenta usada para gerenciar pacotes JavaScript. Na verdade, o npm é originário do ecossistema Node.

Vamos navegar até um diretório apropriado e criar um novo modelo para nossa aplicação com o comando _npm init_. Vamos responder as perguntas apresentadas pelo utilitário, e o resultado será um arquivo <i>package.json</i> gerado automaticamente na raiz do projeto que contém as informações do projeto.

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

O arquivo define, por exemplo, que o ponto de entrada da aplicação é o arquivo <i>index.js</i>.

Vamos fazer uma pequena alteração no objeto <i>scripts</i>:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js", // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Agora, vamos criar a primeira versão da nossa aplicação adicionando um arquivo <i>index.js</i> à raiz do projeto com o seguinte código:

```js
console.log('hello world')
```

Podemos executar o programa diretamente com o Node a partir da linha de comando:

```bash
node index.js
```

Ou podemos executá-lo como um [script npm](https://docs.npmjs.com/misc/scripts):

```bash
npm start
```

O script npm <i>start</i> funciona porque o definimos no arquivo <i>package.json</i>:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Embora a execução do projeto funcione quando ele é iniciado chamando _node index.js_ a partir da linha de comando, é costume dos projetos npm executar tarefas como scripts npm.

Por padrão, o arquivo <i>package.json</i> também define outro script npm comumente usado chamado <i>npm test</i>. Como nosso projeto ainda não possui uma biblioteca de testes, o comando _npm test_ apenas executa o seguinte comando:

```bash
echo "Error: no test specified" && exit 1
```

### Um servidor web simples

Vamos transformar a aplicação em um servidor web editando o arquivo _index.js_ da seguinte maneira:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port (Servidor em execução na porta) ${PORT}`)
```

Uma vez que a aplicação está em execução, a seguinte mensagem é impressa no console:

```bash
Server running on port (Servidor em execução na porta) 3001
```

Podemos abrir nossa humilde aplicação no navegador entrando no endereço <http://localhost:3001>:

![captura de tela do programa 'hello world'](../../images/3/1.png)

O servidor funciona da mesma maneira independentemente da última parte da URL. Além disso, o endereço <http://localhost:3001/foo/bar> exibirá o mesmo conteúdo.

**N.B.:** se a porta 3001 já estiver sendo usada por alguma outra aplicação, iniciar o servidor resultará na seguinte mensagem de erro:

```bash
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```

Você tem duas opções: ou encerre a aplicação usando a porta 3001 (o json-server na última parte do material estava usando a porta 3001), ou use uma porta diferente para esta aplicação.

Vamos olhar mais de perto na primeira linha do código:

```js
const http = require('http')
```

Na primeira linha, a aplicação importa o módulo integrado [web server](https://nodejs.org/docs/latest-v8.x/api/http.html) do Node. Isso é praticamente o que já estávamos fazendo em nosso código no lado do navegador, mas com uma sintaxe um pouco diferente:

```js
import http from 'http'
```

Hoje em dia, o código que roda no navegador usa módulos ES6. Os módulos são definidos com um [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) e usados com um [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

No entanto, Node.js usa módulos chamados [CommonJS](https://en.wikipedia.org/wiki/CommonJS). A razão para isso é que o ecossistema Node teve a necessidade de usar módulos muito antes de JavaScript os suportar na especificação da linguagem. Node agora também suporta o uso de módulos ES6, mas como o suporte ainda [não é totalmente perfeito](https://nodejs.org/api/esm.html#modules-ecmascript-modules), vamos aderir aos módulos CommonJS.

Os módulos CommonJS funcionam quase exatamente como os módulos ES6, pelo menos no que diz respeito às nossas necessidades neste curso.

O próximo trecho em nosso código é assim:

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World (Olá, mundo!)')
})
```

O código usa o método _createServer_ ("criarServidor") do módulo [http](https://nodejs.org/docs/latest-v8.x/api/http.html) para criar um novo servidor web. Um <i>gerenciador de evento</i> é registrado no servidor que é chamado <i>sempre</i> que uma requisição HTTP é feita para o endereço http://localhost:3001 do servidor.

A requisição é respondida com o código de status 200, com o cabeçalho <i>Content-Type</i> definido como <i>text/plain</i>, e o conteúdo do site a ser retornado definido como <i>Hello World</i>.

As últimas linhas vinculam o servidor http atribuído à variável _app_ para ouvir as requisições HTTP enviadas à porta 3001:

```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port (Servidor em execução na porta) ${PORT}`)
```

O objetivo principal do servidor back-end neste curso é oferecer dados brutos em formato JSON para o front-end. Por esse motivo, vamos imediatamente alterar nosso servidor para retornar uma lista codificada de notas no formato JSON:

```js
const http = require('http')

// highlight-start
let notes = [
  {
    id: 1,
    content: 'HTML é fácil',
    important: true
  },
  {
    id: 2,
    content: 'O navegador só pode executar JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET e POST são os métodos mais importantes do protocolo HTTP',
    important: true
  }
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
// highlight-end

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port (Servidor em execução na porta) ${PORT}`)
```

Vamos reiniciar o servidor (você pode encerrá-lo pressionando _Ctrl + C_ no console) e atualizar o navegador.

O valor <i>application/json</i> no cabeçalho <i>Content-Type</i> informa o receptor de que os dados estão no formato JSON. O array _notes_ é transformado em JSON com o método <em>JSON.stringify(notes)</em>.

Quando abrimos o navegador, o formato de exibição das notas é o mesmo que vimos na [Parte 2](/pt/part2/obtendo_dados_do_servidor) quando usamos o [json-server](https://github.com/typicode/json-server) para servir a lista de notas:

![dados das notas JSON formatados](../../images/3/2new.png)

### Express

É possível implementar nosso código do servidor diretamente com o servidor web [http](https://nodejs.org/docs/latest-v8.x/api/http.html) integrado do Node. No entanto, isso é cansativo, especialmente quando a aplicação fica maior.

Muitas bibliotecas foram desenvolvidas para facilitar o desenvolvimento do lado do servidor com Node, oferecendo uma interface mais agradável para trabalhar com o módulo integrado http. Essas bibliotecas visam fornecer uma melhor abstração para casos de uso geral que normalmente exigimos para construir um servidor back-end. De longe, a biblioteca mais popular destinada a esse fim é o [Express](http://expressjs.com).

Vamos usar o Express definindo-o como uma dependência do projeto com o comando:

```bash
npm install express
```

A dependência também é adicionada ao nosso arquivo <i>package.json</i>:

```json
{
  // ...
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

O código-fonte da dependência é instalado no diretório <i>node_modules</i> localizado na raiz do projeto. Além do Express, você pode encontrar uma grande quantidade de outras dependências no diretório:

![listagem 'ls' das dependências no diretório](../../images/3/4.png)

Essas são as dependências da biblioteca Express e as dependências de todas as suas dependências e assim por diante. Elas são chamadas de [dependências transitivas](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) (transitive dependencies) do nosso projeto.

A versão 4.18.2 da biblioteca Express foi instalada em nosso projeto. O que significa esse acento circunflexo na frente do número de versão em <i>package.json</i>?

```json
"express": "^4.18.2"
```

O modelo de versionamento usado no npm é chamado de [versionamento semântico](https://docs.npmjs.com/getting-started/semantic-versioning) (semantic versioning).

O acento circunflexo na frente de <i>^4.18.2</i> significa que se e quando as dependências de um projeto forem atualizadas, a versão instalada do Express será pelo menos <i>4.18.2</i>. No entanto, a versão instalada do Express também pode ter um número de <i>patch</i> maior (o último número) ou um número <i>minor</i> maior (o número do meio). A versão principal da biblioteca indicada pelo primeiro número <i>major</i> deve ser a mesma.

Podemos atualizar as dependências do projeto com o comando:

```bash
npm update
```

Igualmente, se começarmos a trabalhar no projeto em outro computador, podemos instalar todas as dependências atualizadas do projeto definidas em <i>package.json</i> executando comando a seguir no diretório raiz do projeto:

```bash
npm install
```

Se o número <i>major</i> de uma dependência não mudar, então as novas versões devem ser [compatíveis com versões anteriores](https://en.wikipedia.org/wiki/Backward_compatibility). Isso significa que se nossa aplicação vier a usar a versão 4.99.175 do Express no futuro, então todo o código implementado nesta parte ainda terá que funcionar sem a necessidade de alterações no código. Em contraste, a futura versão 5.0.0 do express [pode conter](https://expressjs.com/en/guide/migrating-5.html) alterações que farão com que nossa aplicação não funcione mais.

### Web e Express

Vamos voltar à nossa aplicação e fazer as seguintes alterações:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port (Servidor em execução na porta) ${PORT}`)
})
```

Para colocar a nova versão de nossa aplicação em uso, temos que reiniciar a aplicação.

A aplicação não mudou muito. Logo no início do nosso código, importamos o _express_ que desta vez é uma <i>função</i> usada para criar uma aplicação express armazenada na variável _app_:

```js
const express = require('express')
const app = express()
```

Em seguida, definimos duas <i>rotas</i> para a aplicação. A primeira define um gerenciador de evento que é usado para lidar com requisições HTTP GET feitas na raiz <i>/</i> da aplicação:

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```

A função de gerência de evento aceita dois parâmetros. O primeiro parâmetro [request](http://expressjs.com/en/4x/api.html#req) (requisitar) contém todas as informações da requisição HTTP, e o segundo parâmetro [response](http://expressjs.com/en/4x/api.html#res) (resposta) é usado para definir como a requisição é respondida.

Em nosso código, a requisição é respondida usando o método [send](http://expressjs.com/en/4x/api.html#res.send) (enviar) do objeto _response_. Ao chamar o método, o servidor responde à requisição HTTP enviando uma resposta contendo a string <code>\<h1>Hello World!\</h1></code> que foi passada para o método _send_. Como o parâmetro é uma string, o express define automaticamente o valor do cabeçalho <i>Content-Type</i> como <i>text/html</i>. O código de status da resposta é definido como 200 por padrão.

Podemos verificar isso na guia <i>Rede</i> nas Ferramentas do Desenvolvedor:

![guia Rede nas Ferramentas do Desenvolvedor](../../images/3/5.png)

A segunda rota define um gerenciador de evento que lida com requisições HTTP GET feitas no caminho <i>notes</i> da aplicação:

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```

A requisição é respondida com o método [json](http://expressjs.com/en/4x/api.html#res.json) do objeto _response_. Quando chamado, o método enviará o array __notes__ que foi passado como uma string formatada em JSON. O express define automaticamente o cabeçalho <i>Content-Type</i> com o valor apropriado de <i>application/json</i>.

![api/notes fornece os dados JSON formatados novamente](../../images/3/6new.png)

Em seguida, vamos dar uma olhada rápida nos dados enviados no formato JSON.

Na versão anterior do código em que estávamos usando apenas Node, tivemos que transformar os dados no formato JSON com o método _JSON.stringify_:

```js
response.end(JSON.stringify(notes))
```

Com Express isso se torna desnecessário, porque essa transformação acontece automaticamente.

Vale ressaltar que [JSON](https://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation [Notação de Objeto JavaScript]) é uma string e não um objeto JavaScript como o valor que foi atribuído a _notes_.

O experimento mostrado abaixo ilustra esse ponto:

![terminal do node demonstrando que 'json' é do tipo string](../../assets/3/5.png)

O experimento acima foi feito no [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html) interativo. Você pode iniciar o node-repl interativo digitando _node_ no terminal. O repl é particularmente útil para testar como os comandos funcionam enquanto você está escrevendo o código da aplicação. Eu mais que recomendo o uso dessa ferramenta!

### nodemon

Se fizermos alterações no código da aplicação, precisamos reiniciá-la para ver as alterações. Reiniciamos a aplicação primeiro encerrando-a pressionando _Ctrl + C_ e depois reiniciando-a. Se compararmos isso ao conveniente fluxo de trabalho em React, em que o navegador é recarregado automaticamente após as alterações serem feitas, parece até um pouco trabalhoso.

A solução para esse problema é o [nodemon](https://github.com/remy/nodemon):

> <i>nodemon irá monitorar os arquivos no diretório em que ele foi iniciado, e se houver alguma alteração nos arquivos, o nodemon reiniciará automaticamente sua aplicação node.</i>

Vamos instalar o nodemon definindo-o como uma <i>dependência de desenvolvimento</i> (development dependency) com o comando:

```bash
npm install --save-dev nodemon
```

O conteúdo do arquivo <i>package.json</i> também foi alterado:

```json
{
  //...
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

Se você usou acidentalmente o comando errado e a dependência nodemon foi adicionada em "dependencies" em vez de "devDependencies", altere manualmente o conteúdo de <i>package.json</i> para que corresponda ao que é mostrado acima.

Por dependências de desenvolvimento, estamos nos referindo a ferramentas que são necessárias apenas durante o desenvolvimento da aplicação, por exemplo, para testar ou reiniciar automaticamente a aplicação, como o <i>nodemon</i>.

Essas dependências de desenvolvimento não são necessárias quando a aplicação é executada na fase de produção em um servidor de produção (Fly.io ou Heroku, por exemplo).

Podemos iniciar nossa aplicação com o <i>nodemon</i> assim:

```bash
node_modules/.bin/nodemon index.js
```

Alterações no código da aplicação agora fazem com que o servidor seja reiniciado automaticamente. Vale ressaltar que, embora o servidor back-end seja reiniciado automaticamente, o navegador ainda deve ser atualizado manualmente. Isso ocorre porque, ao contrário do que acontece ao trabalhar em React, não temos a funcionalidade [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) (grosso modo, "recarga rápida") necessária para recarregar automaticamente o navegador.

O comando é longo e bastante desagradável, portanto, vamos definir um <i>script npm</i> dedicado para ele no arquivo <i>package.json</i>:

```bash
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",  // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

Não é necessário especificar  no script o caminho <i>node\_modules/.bin/nodemon</i> para o nodemon, pois o npm pesquisa automaticamente pelo arquivo nesse diretório.

Agora podemos iniciar o servidor no modo de desenvolvimento com o comando:

```bash
npm run dev
```

Ao contrário dos scripts <i>start</i> e <i>test</i>, também temos que adicionar <i>run</i> ao comando.

### REST

Vamos expandir nossa aplicação para que ela forneça a mesma API HTTP RESTful do [json-server](https://github.com/typicode/json-server#routes).

<i>Representational State Transfer</i>, também conhecido como REST, foi introduzido em 2000 na [dissertação de PhD](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) de Roy Fielding. REST é um estilo arquitetural destinado a construir aplicações web escaláveis.

Não vamos aprofundar a definição de REST de Fielding ou gastar tempo ponderando sobre o que é ou não RESTful. Em vez disso, adotamos uma visão mais [restrita](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services), preocupando-nos apenas com a típica compreensão de APIs RESTful em aplicações web. A definição original de REST não se limita somente à aplicações web.

Mencionamos na [parte anterior](/en/part2/altering_data_in_server#rest) que coisas singulares, como as notas no caso da nossa aplicação, são chamadas de <i>recursos</i> no modo RESTful de pensar. Cada recurso tem uma URL associada que é o endereço exclusivo do recurso.

Uma convenção para criar endereços exclusivos é combinar o nome do tipo de recurso com o identificador exclusivo do recurso.

Vamos assumir que a URL raiz do nosso serviço é <i>www.example.com/api</i>.

Se definirmos o tipo de recurso da nota como <i>notes</i>, então o endereço de um recurso de "note" com o identificador 10 tem o endereço exclusivo <i>www.example.com/api/notes/10</i>.

A URL para toda a coleção de todos os recursos de <i>notes</i> é <i>www.example.com/api/notes</i>.

Podemos executar diferentes operações em recursos. A operação a ser executada é definida pelo <i>verbo</i> HTTP:

| URL                   | verbo               | funcionalidade                                                       |
| --------------------- | ------------------- | ---------------------------------------------------------------------|
| notes/10              | GET                 | busca um único recurso                                               |
| notes                 | GET                 | busca todos os recursos na coleção                                   |
| notes                 | POST                | cria um novo recurso baseado nos dados requisitados                  |
| notes/10              | DELETE              | exclui um recurso identificado                                       |
| notes/10              | PUT                 | substitui todo o recurso identificado com os dados requisitados      |
| notes/10              | PATCH               | substitui uma parte do recurso identificado com os dados requisitados|
|                       |                     |                                                                      |

É assim que conseguimos definir aproximadamente o que REST chama de [interface uniforme](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints) (uniform interface), que significa uma maneira consistente de definir interfaces que tornam possível a cooperação entre sistemas.

Essa forma de interpretação do modelo REST se enquadra no [segundo nível de maturidade RESTful](https://martinfowler.com/articles/richardsonMaturityModel.html) (second level of RESTful maturity) no Modelo de Maturidade de Richardson. De acordo com a definição fornecida por Roy Fielding, ainda não definimos o que é uma [API REST](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). Na verdade, a grande maioria das APIs "REST" do mundo não atende aos critérios originais de Fielding delineados em sua dissertação.

Em alguns lugares (ver, por exemplo, [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) você verá nosso modelo para uma API [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) simples sendo referido como um exemplo de [arquitetura orientada a recursos](https://en.wikipedia.org/wiki/Resource-oriented_architecture) (resource-oriented architecture) em vez de REST. Vamos evitar ficar presos discutindo semântica e, em vez disso, voltar a trabalhar em nossa aplicação.

### Buscando um único recurso

Vamos expandir nossa aplicação para que ela ofereça uma interface REST para operar em notas individuais. Primeiro, vamos criar uma [rota](http://expressjs.com/en/guide/routing.html) para buscar um único recurso.

O endereço único que usaremos para uma nota individual é da forma <i>notes/10</i>, onde o número no final refere-se ao número de identificação único da nota.

Podemos definir [parâmetros](http://expressjs.com/en/guide/routing.html#route-parameters) para rotas no Express usando a sintaxe de dois-pontos:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

Agora, <code>app.get('/api/notes/:id', ...)</code> gerenciará todas as requisições HTTP GET que estão na forma <i>/api/notes/X</i>, onde <i>X</i> é uma string arbitrária.

O parâmetro <i>id</i> na rota de uma requisição pode ser acessado por meio do objeto [request](http://expressjs.com/en/api.html#req):

```js
const id = request.params.id
```

O agora familiar método de arrays _find_ é usado para encontrar a nota com um ID que corresponde ao parâmetro. A nota é então retornada ao remetente da requisição.

Quando testamos nossa aplicação acessando <http://localhost:3001/api/notes/1> em nosso navegador, percebemos que ela não parece funcionar, pois o navegador exibe uma página vazia. Isso não é surpresa para nós, desenvolvedores de software, pois é hora de depurar.

^^^^^^^^^^^
### REVISADO







Adding _console.log_ commands into our code is a time-proven trick:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```

When we visit <http://localhost:3001/api/notes/1> again in the browser, the console - which is the terminal (in this case) - will display the following:

![terminal displaying 1 then undefined](../../images/3/8.png)

The id parameter from the route is passed to our application but the _find_ method does not find a matching note.

To further our investigation, we also add a console log inside the comparison function passed to the _find_ method. To do this, we have to get rid of the compact arrow function syntax <em>note => note.id === id</em>, and use the syntax with an explicit return statement:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```

When we visit the URL again in the browser, each call to the comparison function prints a few different things to the console. The console output is the following:

<pre>
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
</pre>

The cause of the bug becomes clear. The _id_ variable contains a string '1', whereas the ids of notes are integers. In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'. 

Let's fix the issue by changing the id parameter from a string into a [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number):

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // highlight-line
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

Now fetching an individual resource works.

![api/notes/1 gives a single note as JSON](../../images/3/9new.png)

However, there's another problem with our application.

If we search for a note with an id that does not exist, the server responds with:

![network tools showing 200 and content-length 0](../../images/3/10ea.png)

The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the <i>content-length</i> header is 0, and the same can be verified from the browser. 

The reason for this behavior is that the _note_ variable is set to _undefined_ if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code [404 not found](https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found) instead of 200.

Let's make the following change to our code:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  // highlight-start
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // highlight-end
})
```

Since no data is attached to the response, we use the [status](http://expressjs.com/en/4x/api.html#res.status) method for setting the status and the [end](http://expressjs.com/en/4x/api.html#res.end) method for responding to the request without sending any data.

The if-condition leverages the fact that all JavaScript objects are [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), meaning that they evaluate to true in a comparison operation. However, _undefined_ is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) meaning that it will evaluate to false.

Our application works and sends the error status code if no note is found. However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.
  
Anyway, it's possible to give a clue about the reason for sending a 404 error by [overriding the default NOT FOUND message](https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614).

### Deleting resources

Next, let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the URL of the resource:

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

If deleting the resource is successful, meaning that the note exists and is removed, we respond to the request with the status code [204 no content](https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content) and return no data with the response.

There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. The only two options are 204 and 404. For the sake of simplicity, our application will respond with 204 in both cases.

### Postman

So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation.

Many tools exist for making the testing of backends easier. One of these is a command line program [curl](https://curl.haxx.se). However, instead of curl, we will take a look at using [Postman](https://www.postman.com) for testing the application.

Let's install the Postman desktop client [from here](https://www.postman.com/downloads/)  and try it out:

![postman screenshot on api/notes/2](../../images/3/11x.png)

Using Postman is quite easy in this situation. It's enough to define the URL and then select the correct request type (DELETE).

The backend server appears to respond correctly. By making an HTTP GET request to <http://localhost:3001/api/notes> we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful. 

Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application.

### The Visual Studio Code REST client

If you use Visual Studio Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman.

Once the plugin is installed, using it is very simple. We make a directory at the root of the application named <i>requests</i>. We save all the REST client requests in the directory as files that end with the <i>.rest</i> extension.

Let's create a new <i>get\_all\_notes.rest</i> file and define the request that fetches all notes.

![get all notes rest file with get request on notes](../../images/3/12ea.png)

By clicking the <i>Send Request</i> text, the REST client will execute the HTTP request and the response from the server is opened in the editor.

![response from vs code from get request](../../images/3/13new.png)

### The WebStorm HTTP Client

If you use *IntelliJ WebStorm* instead, you can use a similar procedure with its built-in HTTP Client. Create a new file with extension `.rest` and the editor will display your options to create and run your requests. You can learn more about it by following [this guide](https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html).

### Receiving data

Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request [body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) in JSON format.

To access the data easily, we need the help of the express [json-parser](https://expressjs.com/en/api.html) that is taken to use with command _app.use(express.json())_.

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```js
const express = require('express')
const app = express()

app.use(express.json())  // highlight-line

//...

// highlight-start
app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
// highlight-end
```

The event handler function can access the data from the <i>body</i> property of the _request_ object.

Without the json-parser, the <i>body</i> property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the <i>body</i> property of the _request_ object before the route handler is called.

For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.

Before we implement the rest of the application logic, let's verify with Postman that the data is in fact received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the <i>body</i>:

![postman post on api/notes with post content](../../images/3/14new.png)

The application prints the data that we sent in the request to the console:

![terminal printing content provided in postman](../../images/3/15new.png)

**NB** <i>Keep the terminal running the application visible at all times</i> when you are working on the backend. Thanks to Nodemon any changes we make to the code will restart the application. If you pay attention to the console, you will immediately be able to pick up on errors that occur in the application:

![nodemon error as typing requre not defined](../../images/3/16.png)

Similarly, it is useful to check the console for making sure that the backend behaves as we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of <em>console.log</em> commands to the code while the application is still being developed.

A potential cause for issues is an incorrectly set <i>Content-Type</i> header in requests. This can happen with Postman if the type of body is not defined correctly:

![postman having text as content-type](../../images/3/17new.png)

The <i>Content-Type</i> header is set to <i>text/plain</i>:

![postman showing headers and content-type as text/plain](../../images/3/18new.png)

The server appears to only receive an empty object:

![nodemon output showing empty curly braces](../../images/3/19.png)

The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data since there's a [massive amount](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of potential <i>Content-Types</i>.

If you are using VS Code, then you should install the REST client from the previous chapter <i>now, if you haven't already</i>. The POST request can be sent with the REST client like this:

![sample post request in vscode with JSON data](../../images/3/20new.png)

We created a new <i>create\_note.rest</i> file for the request. The request is formatted according to the [instructions in the documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).

One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using `###` separators:

```
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects.

> **Important sidenote**
>
> Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the [get](http://expressjs.com/en/4x/api.html#req.get) method of the _request_ object, that can be used for getting the value of a single header. The _request_ object also has the <i>headers</i> property, that contains all of the headers of a specific request.
>

> Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.
>

You will be able to spot this missing <i>Content-Type</i> header if at some point in your code you print all of the request headers with the _console.log(request.headers)_ command.

Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:

```js
app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```

We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the _maxId_ variable. The id of the new note is then defined as _maxId + 1_. This method is not recommended, but we will live with it for now as we will replace it soon enough.

The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the <i>content</i> property may not be empty. The <i>important</i> property will be given default value false. All other properties are discarded:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

The logic for generating the new id number for notes has been extracted into a separate _generateId_ function.

If the received data is missing a value for the <i>content</i> property, the server will respond to the request with the status code [400 bad request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request):

```js
if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
```

Notice that calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.

If the content property has a value, the note will be based on the received data.
If the <i>important</i> property is missing, we will default the value to <i>false</i>. The default value is currently generated in a rather odd-looking way:

```js
important: body.important || false,
```

If the data saved in the _body_ variable has the <i>important</i> property, the expression will evaluate to its value. If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines.


> To be exact, when the <i>important</i> property is <i>false</i>, then the <em>body.important || false</em> expression will in fact return the <i>false</i> from the right-hand side...


You can find the code for our current application in its entirety in the <i>part3-1</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).


The code for the current state of the application is specified in branch [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).

![GitHub screenshot of branch 3-1](../../images/3/21.png)


If you clone the project, run the _npm install_ command before starting the application with _npm start_ or _npm run dev_.


One more thing before we move on to the exercises. The function for generating IDs looks currently like this:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```


The function body contains a row that looks a bit intriguing:

```js
Math.max(...notes.map(n => n.id))
```

What exactly is happening in that line of code? <em>notes.map(n => n.id)</em> creates a new array that contains all the ids of the notes. [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) returns the maximum value of the numbers that are passed to it. However, <em>notes.map(n => n.id)</em> is an <i>array</i> so it can't directly be given as a parameter to _Math.max_. The array can be transformed into individual numbers by using the "three dot" [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax <em>...</em>.

</div>

<div class="tasks">


### Exercises 3.1.-3.6.

**NB:** It's recommended to do all of the exercises from this part into a new dedicated git repository, and place your source code right at the root of the repository. Otherwise, you will run into problems in exercise 3.10.


**NB:** Because this is not a frontend project and we are not working with React, the application <strong>is not created</strong> with create-react-app. You initialize this project with the <em>npm init</em> command that was demonstrated earlier in this part of the material.


**Strong recommendation:** When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.


#### 3.1: Phonebook backend step1


Implement a Node application that returns a hardcoded list of phonebook entries from the address <http://localhost:3001/api/persons>.
  

Data:
  
```js
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
```

Output in the browser after GET request:
  
![JSON data of 4 poeple in browser from api/persons](../../images/3/22e.png)

Notice that the forward slash in the route <i>api/persons</i> is not a special character, and is just like any other character in the string. 

The application must be started with the command _npm start_.

The application must also offer an _npm run dev_ command that will run the application and restart the server whenever changes are made and saved to a file in the source code.
 
#### 3.2: Phonebook backend step2

Implement a page at the address <http://localhost:3001/info> that looks roughly like this:

![Screenshot for 3.2](../../images/3/23x.png)


The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.

#### 3.3: Phonebook backend step3


Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be <http://localhost:3001/api/persons/5>

If an entry for the given id is not found, the server has to respond with the appropriate status code.

#### 3.4: Phonebook backend step4


Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.


Test that your functionality works with either Postman or the Visual Studio Code REST client.


#### 3.5: Phonebook backend step5


Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address <http://localhost:3001/api/persons>.


Generate a new id for the phonebook entry with the [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.


#### 3.6: Phonebook backend step6




Implement error handling for creating new entries. The request is not allowed to succeed, if:
- The name or number is missing 
- The name already exists in the phonebook


Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:

```js
{ error: 'name must be unique' }
```

</div>

<div class="content">


### About HTTP request types

[The HTTP standard](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties) talks about two properties related to request types, **safety** and **idempotency**.

The HTTP GET request should be <i>safe</i>:

> <i>In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".</i>


Safety means that the executing request must not cause any <i>side effects</i> on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.


Nothing can ever guarantee that a GET request is <i>safe</i>, this is just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are always used in a way that they are <i>safe</i>.


The HTTP standard also defines the request type [HEAD](https://www.rfc-editor.org/rfc/rfc9110.html#name-head), which ought to be safe. In practice, HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.


All HTTP requests except POST should be <i>idempotent</i>:

> <i>Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property</i>


This means that if a request does not generate side effects, then the result should be the same regardless of how many times the request is sent.


If we make an HTTP PUT request to the URL <i>/api/notes/10</i> and with the request we send the data <em>{ content: "no side effects!", important: true }</em>, the result is the same regardless of how many times the request is sent.


Like <i>safety</i> for the GET request, <i>idempotence</i> is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.


POST is the only HTTP request type that is neither <i>safe</i> nor <i>idempotent</i>. If we send 5 different HTTP POST requests to <i>/api/notes</i> with a body of <em>{content: "many same", important: true}</em>, the resulting 5 notes on the server will all have the same content.


### Middleware

The express [json-parser](https://expressjs.com/en/api.html) we took into use earlier is a so-called [middleware](http://expressjs.com/en/guide/using-middleware.html).


Middleware are functions that can be used for handling _request_ and _response_ objects.

The json-parser we used earlier takes the raw data from the requests that are stored in the _request_ object, parses it into a JavaScript object and assigns it to the _request_ object as a new property <i>body</i>.


In practice, you can use several middlewares at the same time. When you have more than one, they're executed one by one in the order that they were taken into use in express.


Let's implement our own middleware that prints information about every request that is sent to the server.


Middleware is a function that receives three parameters:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

At the end of the function body, the _next_ function that was passed as a parameter is called. The _next_ function yields control to the next middleware.

Middleware is taken into use like this:

```js
app.use(requestLogger)
```

Middleware functions are called in the order that they're taken into use with the express server object's _use_ method. Notice that json-parser is taken into use before the _requestLogger_ middleware, because otherwise <i>request.body</i> will not be initialized when the logger is executed!


Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.


Let's add the following middleware after our routes. This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```


You can find the code for our current application in its entirety in the <i>part3-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).

</div>

<div class="tasks">

### Exercises 3.7.-3.8.

#### 3.7: Phonebook backend step7

Add the [morgan](https://github.com/expressjs/morgan) middleware to your application for logging. Configure it to log messages to your console based on the <i>tiny</i> configuration.

The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case.

Morgan is installed just like all other libraries with the _npm install_ command. Taking morgan into use happens the same way as configuring any other middleware by using the _app.use_ command.

#### 3.8*: Phonebook backend step8

Configure morgan so that it also shows the data sent in HTTP POST requests:

![terminal showing post data being sent](../../images/3/24.png)

Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data.

This exercise can be quite challenging, even though the solution does not require a lot of code.

This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques:
- [creating new tokens](https://github.com/expressjs/morgan#creating-new-tokens)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

</div>
