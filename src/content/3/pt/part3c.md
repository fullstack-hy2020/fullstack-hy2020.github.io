---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: pt
---

<div class="content">

Antes de irmos ao assunto principal sobre persistência de dados em um banco de dados, vamos dar uma olhada em algumas maneiras diferentes de depurar aplicações Node.

### Depurando aplicações Node

A depuração de aplicações Node é um tanto mais difícil do que depurar JavaScript em execução no navegador. A impressão de dados no console é um método testado e comprovado, e sempre vale a pena utilizá-lo. Algumas pessoas acham que métodos mais sofisticados devem ser usados ​​em vez do console, mas eu discordo. Até os melhores desenvolvedores de código aberto do mundo [usam](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) esse [método](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).

#### Visual Studio Code

O depurador do Visual Studio Code pode ser útil em algumas situações. Você pode iniciar a aplicação no modo de depuração assim:

![captura de tela mostrando a forma de iniciar o depurador no VS Code](../../images/3/35x.png)

Observe que a aplicação não deve estar em execução em outro console, caso contrário, a porta já estará em uso.

__N.B.:__ Uma versão mais recente do Visual Studio Code pode ter _Run_ em vez de _Debug_. Além disso, talvez você precise configurar seu arquivo _launch.json_ para iniciar a depuração. Isso pode ser feito escolhendo _Add Configuration..._ no menu, que está localizado ao lado do botão verde de reprodução e acima do menu _VARIABLES_, selecionando _Run "npm start" in a debug terminal_. Para instruções de configuração mais detalhadas, leia a [documentação sobre depuração](https://code.visualstudio.com/docs/editor/debugging) do Visual Studio Code.

Abaixo você pode ver uma captura de tela onde a execução do código foi interrompida no meio do salvamento uma nova nota:

![captura de tela do vscode mostrando a execução em um ponto de interrupção](../../images/3/36x.png)

A execução parou no <i>ponto de interrupção</i> na linha 69. É possível ver no console o valor da variável <i>note</i>. Na janela superior esquerda, é possível ver outras coisas relacionadas ao estado da aplicação.

As setas na parte superior podem ser usadas para controlar o fluxo do depurador.

Por algum razão, eu não uso muito o depurador do Visual Studio Code.

#### As Ferramentas do Desenvolvedor do Chrome

Também é possível depurar o código com o Console do Desenvolvedor do Chrome, iniciando a aplicação com o comando:

```bash
node --inspect index.js
```

Você pode acessar o depurador clicando no ícone verde — o logotipo do Node — que aparece no console de desenvolvedor do Chrome:

![ferramentas do desenvolvedor com o logotipo verde do node](../../images/3/37.png)

A visualização da depuração funciona da mesma maneira quando fazíamos com as aplicações React. A guia <i>Fontes</i> pode ser usada para definir pontos de interrupção onde a execução do código será pausada.

![ferramentas do desenvolvedor - ponto de interrupção na guia fontes e variáveis sendo monitoradas](../../images/3/38eb.png)

Todas as mensagens do <i>console.log</i> da aplicação aparecerão na guia <i>Console</i> do depurador. Também é possível inspecionar valores de variáveis e executar seu próprio código JavaScript.

![ferramentas do desenvolvedor - guia console mostrando o objeto de nota digitado](../../images/3/39ea.png)

#### Questione tudo

Depurar aplicações Full Stack pode parecer complicado no início. Em breve, nossa aplicação também terá um banco de dados além do front-end e back-end, e haverá muitas áreas potenciais para erros na aplicação.

Quando a aplicação "não funciona", primeiro precisamos descobrir onde o problema realmente está. É muito comum que o problema exista em um lugar onde você não esperava, e pode levar minutos, horas ou até mesmo dias antes de encontrar a fonte do problema.

A resposta é ser sistemático. Como o problema pode existir em qualquer lugar, <i>você deve questionar tudo</i> e eliminar todas as possibilidades uma por uma. Impressão de logs no console, Postman, depuradores e experiência ajudarão.

Quando bugs acontecem, <i>a pior de todas as estratégias possíveis</i> é continuar escrevendo código. Isso garantirá que seu código gere ainda mais bugs em breve, e depurá-los será ainda mais difícil. O princípio [pare e corrija](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/) do Toyota Production Systems também é muito eficaz nessa situação.

### MongoDB

Para armazenar indefinidamente nossas notas que estão sendo salvas, precisamos de um banco de dados. A maioria dos cursos ministrados na Universidade de Helsinque usa bancos de dados relacionais. Usaremos na maior parte deste curso o [MongoDB](https://www.mongodb.com/), que é um tipo de [banco de dados de documentos](https://en.wikipedia.org/wiki/Document-oriented_database) (document database).

A razão para usar o Mongo como banco de dados é devido a sua menor complexidade em comparação com um banco de dados relacional. A [Parte 13](/pt/part13) do curso mostra como construir back-ends node.js que usam um banco de dados relacional.

Bancos de dados de documentos diferem de bancos de dados relacionais em como eles organizam dados, bem como nas linguagens de consulta (query languages) que suportam. Bancos de dados de documentos são geralmente categorizados sob o termo genérico [NoSQL](https://en.wikipedia.org/wiki/NoSQL) (Not Only SQL [Não Somente SQL]).

É possível ler mais sobre bancos de dados de documentos e NoSQL no material do curso para a [7ª semana](https://tikape-s18.mooc.fi/part7/) do curso de Introdução a Bancos de Dados. Infelizmente, o material está atualmente disponível apenas em finlandês.

Leia agora os capítulos sobre [coleções](https://docs.mongodb.com/manual/core/databases-and-collections/) (collections) e [documentos](https://docs.mongodb.com/manual/core/document/) (documents) do manual do MongoDB para ter uma ideia básica de como um banco de dados de documentos armazena dados.

Naturalmente, é possível instalar e executar o MongoDB em seu computador. Porém, a internet também está cheia de serviços de banco de dados Mongo que você pode usar. O provedor MongoDB preferido neste curso será o [MongoDB Atlas](https://www.mongodb.com/atlas/database).

Depois de criar e fazer login em sua conta, vamos começar selecionando o plano gratuito:

![implantação no mongodb um banco de dados em nuvem gratuito compartilhado](../../images/3/mongo1.png)

Escolha o provedor de nuvem e a localização e crie o <i>cluster</i> (grupo, aglomerado):

![escolha compartilhada do mongodb, aws e região](../../images/3/mongo2.png)

Vamos esperar o cluster ficar pronto para uso. Isso pode levar alguns minutos.

**N.B.:** não continue antes que o cluster esteja pronto.

Vamos usar a aba <i>security</i> (segurança) para criar credenciais de usuário para o banco de dados. Observe que essas não são as mesmas credenciais que você usa para fazer login no MongoDB Atlas. Essas serão usadas para que sua aplicação se conecte ao banco de dados.

![início rápido de segurança do mongodb](../../images/3/mongo3.png)

Em seguida, temos que definir os endereços IP que têm permissão de acesso ao banco de dados. Visando simplicidade, permitiremos o acesso de todos os endereços IP:

![acesso à rede mongodb/adicionar lista de acesso ip](../../images/3/mongo4.png)

Por fim, estamos prontos para nos conectar ao nosso banco de dados. Comece clicando em <i>connect</i> (conectar)...

![mongodb database deployment connect](../../images/3/mongo5.png)

... e escolha: <i>Connect your application</i> (Conecte sua aplicação):

![conexão à aplicação do mongodb](../../images/3/mongo6.png)

A visualização exibe o <i>URI do MongoDB</i>, que é o endereço do banco de dados que forneceremos à biblioteca-cliente do MongoDB que adicionaremos à nossa aplicação.

O endereço se parece com isso:

```js
mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

Estamos prontos para usar o banco de dados.

Poderíamos usar o banco de dados diretamente do nosso código JavaScript com a biblioteca oficial [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/), mas ela é bastante complicada de usar. Em vez disso, usaremos a biblioteca [Mongoose](http://mongoosejs.com/index.html), que oferece uma API de alto nível.

Mongoose poderia ser descrito como um <i>mapeador de documento-objeto</i> (ODM [object document mapper]), onde é possível salvar diretamente objetos JavaScript como documentos Mongo com esta biblioteca.

Vamos instalar o Mongoose:

```bash
npm install mongoose
```

Ainda não vamos adicionar nenhum código relacionado ao Mongo em nosso back-end. Em vez disso, vamos fazer uma aplicação prática criando um novo arquivo, <i>mongo.js</i>:

```js
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument (insira a senha como argumento)')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved! (nota salva!)')
  mongoose.connection.close()
})
```

**N.B.:** Dependendo da região que você selecionou ao criar seu cluster, o <i>URI do MongoDB</i> pode ser diferente do exemplo fornecido acima. Você deve verificar e usar o URI correto que foi gerado pelo MongoDB Atlas.

O código também assume que será passada a senha das credenciais que criamos no MongoDB Atlas como um parâmetro de linha de comando. Podemos acessar o parâmetro da linha de comando assim:

```js
const password = process.argv[2]
```

Quando o código é executado com o comando <i>node mongo.js password</i>, o Mongo adicionará um novo documento ao banco de dados.

**N.B.:** Observe que a senha usada é a senha criada para o usuário do banco de dados, não a senha do MongoDB Atlas. Além disso, se criou uma senha com caracteres especiais, então você precisará [codificar por cento sua senha](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password) (URL encoding).

Podemos visualizar o estado atual do banco de dados do MongoDB Atlas a partir da guia <i>Browse collections</i>, na opção <i>Databases</i>.

![botão de navegação de coleções de bancos de dados mongodb](../../images/3/mongo7.png)

Como a visualização indica, o <i>document</i> (documento) correspondente à nota foi adicionado à coleção <i>notes</i> no banco de dados <i>myFirstDatabase</i>.

![guia de coleções do mongodb - 'notes' no banco de dados 'myFirstDatabase'](../../images/3/mongo8new.png)

Vamos excluir o banco de dados padrão <i>test</i> e mudar o nome do banco de dados referenciado em nossa string de conexão para <i>noteApp</i>, modificando a URI:

```js
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
```

Vamos executar novamente nosso código:

![guia de coleções mongodb - 'noteApp notes'](../../images/3/mongo9.png)

Os dados agora estão armazenados no banco de dados correto. A visualização também oferece a funcionalidade <i>create database</i> (criar banco de dados), que pode ser usada para criar novos bancos de dados a partir da plataforma. Não é necessário criar um banco de dados dessa forma, pois o MongoDB Atlas cria automaticamente um novo banco de dados quando uma aplicação tenta se conectar a um banco de dados que ainda não existe.

### Esquema (Schema)

Depois de estabelecer a conexão com o banco de dados, definimos o [esquema](http://mongoosejs.com/docs/guide.html) (schema) para uma nota e o [modelo](http://mongoosejs.com/docs/models.html) (model) correspondente:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Primeiro, definimos o [esquema](http://mongoosejs.com/docs/guide.html) de uma nota que é armazenada na variável _noteSchema_. O esquema informa ao Mongoose como os objetos de nota devem ser armazenados no banco de dados.

Na definição do modelo _Note_, o primeiro parâmetro <i>"Note"</i> é o nome singular do modelo. O nome da coleção será o plural em minúsculo <i>notes</i>, porque a [convenção do Mongoose](http://mongoosejs.com/docs/models.html) é nomear automaticamente as coleções como o plural (por exemplo, <i>notes</i>) quando o esquema se refere a elas no singular (por exemplo, <i>Note</i>).

Bancos de dados de documentos como o Mongo são <i>schemaless</i> (sem esquema), o que significa que o banco de dados em si não se importa com a estrutura dos dados armazenados no banco de dados. É possível armazenar documentos com campos completamente diferentes na mesma coleção.







^^^^
### NÃO REVISADO








The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection.

### Creating and saving objects

Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html):

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named _save_ method, which can be provided with an event handler with the _then_ method:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution.

The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object in the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.

Let's also save a few more notes by modifying the data in the code and by executing the program again.

**NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy and paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended. 

### Fetching objects from the database

Let's comment out the code for generating new notes and replace it with the following:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

When the code is executed, the program prints all the notes stored in the database:

![node mongo.js outputs notes as JSON](../../images/3/70new.png)

The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the  _notes_ collection.

The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/).

We could restrict our search to only include important notes like this:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Exercise 3.12.

#### 3.12: Command-line database

Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas. 

Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.

**NB:** Do not include the password in the file that you commit and push to GitHub! 

The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:

```bash
node mongo.js yourpassword Anna 040-1234556
```

As a result, the application will print:

```bash
added Anna number 040-1234556 to phonebook
```

The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

If the password is the only parameter given to the program, meaning that it is invoked like this:

```bash
node mongo.js yourpassword
```

Then the program should display all of the entries in the phonebook:

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv) variable.

**NB: do not close the connection in the wrong place**. E.g. the following code will not work:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called.

The correct place for closing the database connection is at the end of the callback function:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**NB:** If you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>.

</div>

<div class="content">

### Connecting the backend to a database

Now we have enough knowledge to start using Mongo in our application.

Let's get a quick start by copy-pasting the Mongoose definitions to the <i>index.js</i> file:

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Let's change the handler for fetching all notes to the following form:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

We can verify in the browser that the backend works for displaying all of the documents:

![api/notes in browser shows notes in JSON](../../images/3/44ea.png)

The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend.

One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema.
  
To modify the method we need to change the configurable options of the schema, options can be changed using the set method of the schema, see here for more info on this method: https://mongoosejs.com/docs/guide.html#options. See https://mongoosejs.com/docs/guide.html#toJSON and  https://mongoosejs.com/docs/api.html#document_Document-toObject for more info on the toJSON option.
  
see https://mongoosejs.com/docs/api.html#transform for more info on the transform function.

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests.

No changes are needed in the handler:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

the code uses automatically the defined _toJSON_ when formatting notes to the response.

### Database configuration into its own module

Before we refactor the rest of the backend to use the database, let's extract the Mongoose-specific code into its own module.

Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url)
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2.

The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module.

Importing the module happens by adding the following line to <i>index.js</i>:

```js
const Note = require('./models/note')
```

This way the _Note_ variable will be assigned to the same object that the module defines.

The way that the connection is made has changed slightly:

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable.

The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status:

![node output when wrong username/password](../../images/3/45e.png)

There are many ways to define the value of an environment variable. One way would be to define it when the application is started:

```bash
MONGODB_URI=address_here npm run dev
```

A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command:

```bash
npm install dotenv
```

To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

We also added the hardcoded port of the server into the <em>PORT</em> environment variable.

**The <i>.env</i> file should be gitignored right away since we do not want to publish any confidential information publicly online!**

![.gitignore in vscode with .env line added](../../images/3/45ae.png)

The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the familiar <em>process.env.MONGODB_URI</em> syntax.

Let's change the <i>index.js</i> file in the following way:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported.

### Important note to Fly.io users 

Because GitHub is not used with Fly.io, also the file .env gets to the Fly.io servers when the app is deployed. Because of this also the env variables defined in the file will be available there.

However, a [better option](https://community.fly.io/t/clarification-on-environment-variables/6309) is to prevent .env from being copied to Fly.io by creating to the project root the file _.dockerignore_, with the following contents

```bash
.env
```

and set the env value from the command line with the command:

```
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Since also the PORT is defined in our .env it is actually essential to ignore the file in Fly.io since otherways the app starts in the wrong port.

When using Render, the database url is given by defining the proper env in the dashboard:

![](../../images/3/render-env.png)

### Using database in route handlers

Next, let's change the rest of the backend functionality to use the database.

Creating a new note is accomplished like this:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.

The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created automatically with the _toJSON_ method:

```js
response.json(savedNote)
```

Using Mongoose's [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) method, fetching an individual note gets changed into the following:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration

When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use:

![VS code rest client doing a post](../../images/3/46new.png)

Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.

It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to be working, we would move on to the next feature.

Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development.

You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

</div>

<div class="tasks">

### Exercises 3.13.-3.14.

The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting. 

#### 3.13: Phonebook database, step1

Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>.

Verify that the frontend works after the changes have been made.

In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).

#### 3.14: Phonebook database, step2

Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes.

At this stage, you can ignore whether there is already a person in the database with the same name as the person you are adding.

</div>

<div class="content">

### Error handling

If we try to visit the URL of a note with an id that does not exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_.

Let's change this behavior so that if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If a promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error.

On top of the non-existing note, there's one more error situation that needs to be handled. In this situation, we are trying to fetch a note with the wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format.

If we make the following request, we will get the error message shown below:

<pre>
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Given a malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called. 

Let's make some small adjustments to the response in the <em>catch</em> block:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1) because the situation fits the description perfectly:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>

We have also added some data to the response to shed some light on the cause of the error.

When dealing with Promises, it's almost always a good idea to add error and exception handling. Otherwise, you will find yourself dealing with strange bugs.

It's never a bad idea to print the object that caused the exception to the console in the error handler:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one.

Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background:

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

### Moving error handling into middleware

We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we want to report data related to errors to an external error-tracking system like [Sentry](https://sentry.io/welcome/) later on.

Let's change the handler for the <i>/api/notes/:id</i> route so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

The error that is passed forwards is given to the <em>next</em> function as a parameter. If <em>next</em> was called without a parameter, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with a parameter, then the execution will continue to the <i>error handler middleware</i>.

Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation, the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler. 

Note that the error-handling middleware has to be the last loaded middleware!

### The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason, it is important to be careful when defining middleware.

The correct order is the following:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following:

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the _request.body_ would be _undefined_ at that point.

It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

For example, the following loading order would cause an issue:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Now the handling of unknown endpoints is ordered <i>before the HTTP request handler</i>. Since the unknown endpoint handler responds to all requests with <i>404 unknown endpoint</i>, no routes or middleware will be called after the response has been sent by unknown endpoint middleware. The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler.

### Other operations

Let's add some missing functionality to our application, including deleting and updating an individual note.

The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndRemove) method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource was actually deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler.

The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate) method.

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

In the code above, we also allow the content of the note to be edited.

Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function.

There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original.

After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database. 

You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

### A true full stack developer's oath

It is again time for the exercises. The complexity of our app is now taken another step since besides frontend and backend we also have a database. 
There are indeed really many potential sources of error.

So we should once more extend our oath:

Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- <i>I will keep an eye on the database: does the backend save data there in the right format</i>
- I progress with small steps
- I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam) how to ask for help

</div>

<div class="tasks">

### Exercises 3.15.-3.18.

#### 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

#### 3.16: Phonebook database, step4

Move the error handling of the application to a new error handler middleware. 

#### 3.17*: Phonebook database, step5

If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

#### 3.18*: Phonebook database step6

Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:

![screenshot of browser showing one person with api/persons/their_id](../../images/3/49.png)

</div>
