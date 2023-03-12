---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: ptbr
---

<div class="content">

Nós começaremos agora a escrever testes para o backend. Já que o backend não contém nenhuma lógica complicada, não faz sentido escrever [testes de unidade (unit tests)](https://pt.wikipedia.org/wiki/Teste_de_unidade) para ele. A única coisa que provavelmente poderíamos testar com unit test seria o método _toJSON_ que é utilizado para formatar as notas.

Em algumas situações, pode ser vantajoso implementar alguns dos testes de backend fazendo um <i>mock</i> do banco de dados ao invés de utilizar um banco de dados real. Uma biblioteca que poderia ser utilizada para isso é a [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Já que o backend de nossa aplicação ainda é relativamente simples, nós iremos testar a aplicação inteira por meio de sua API REST, o que inclui o banco de dados. Esse tipo de teste no qual múltiplos componentes do sistema estão sendo testados em grupo é chamado de [teste de integração](https://pt.wikipedia.org/wiki/Teste_de_integra%C3%A7%C3%A3o).

### Teste de ambiente

Em um dos capítulos anteriores do curso, nós mencionamos que quando o seu backend está rodando no Fly.io ou no Render, ele está em modo de <i>produção</i>.

A convenção no Node é definir o modo de execução da aplicação com a variável de ambiente <i>NODE\_ENV</i>. Em nossa aplicação atual, nós apenas carregamos as variáveis de ambiente que estão definidas no arquivo  <i>.env</i> se a aplicação <i>não</i> está no modo de produção.

Uma prática comum é definir modos separados para desenvolvimento e testes.

A seguir, vamos alterar os scripts no nosso <i>package.json</i> de forma que ao executar os testes, a variável de ambiente <i>NODE\_ENV</i> receberá o valor <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

Nós também acrescentamos a opção [runInBand](https://jestjs.io/docs/cli#--runinband) no script npm que executa os testes. Essa opção previne que o Jest execute testes em paralelo; nós iremos discutir a importância disso quando nossos testes começarem a utilizar o banco de dados.

Especificamos que o modo da aplicação será <i>desenvolvimento (<i>development</i>)</i> no script _npm run dev_ que utiliza o nodemon. Nós também especificamos que o comando padrão _npm start_ irá definir o modo como sendo produção (<i>production</i>).

Ainda há um pequeno problema na forma como especificamos o modo da aplicação em nossos scripts: não funcionará no Windows. Podemos corrigir isso instalando o pacote [cross-env](https://www.npmjs.com/package/cross-env) como uma dependência de desenvolvimento, por meio do comando:

```bash
npm install --save-dev cross-env
```

Feito, conseguiremos obter compatibilidade entre plataformas (<i>cross-platform</i>), utilizando a biblioteca cross-env em nossos scripts npm definidos no <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

**Obs.:**: Se você fez o deploy de sua aplicação no Fly.io/Render, tenha em mente que se cross-env estiver salvo como dependência de desenvolvimento, isso poderá causar um erro de aplicação no seu servidor web. Para corrigir isso, altere cross-env para dependência de produção, executando o seguinte comando:

```bash
npm install cross-env
```

Agora nós podemos modificar a forma como nossa aplicação roda em diferentes modos. Como um exemplo, nós configuraremos a aplicação para usar um banco de dados separado quando estiver executando testes.

Podemos criar um banco de dados separado para testes no MongoDB Atlas. Essa não é a melhor solução quando muitas pessoas estão desenvolvimento a mesma aplicação. Execução de testes normalmente requer uma única instância de banco de dados que não é usada por testes em execução simultânea.

Seria melhor rodar nossos testes usando um banco de dados que estivesse instalado e sendo executado localmente na máquina do desenvolvedor. A solução ideal seria que cada execução de teste usasse um banco de dados separado. Isso é "relativamente simples" de alcançar [executando Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) ou <i>containers</i> do [Docker](https://www.docker.com). Não iremos complicar as coisas, mas ao invés continuaremos a usar o banco de dados do MongoDB Atlas.

Vamos fazer algumas mudanças no módulo que define a configuração da aplicação:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

O arquivo <i>.env</i> tem <i>variáveis separadas</i> para os endereços do banco de dados dos ambientes de desenvolvimento e testes:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

O módulo _config_ que implementamos se assemelha ligeiramente ao pacote [node-config](https://github.com/lorenwest/node-config). Escrever nossa própria implementação é justificável, uma vez que nossa aplicação é simples e também porque isso nos ensina lições valiosas.

Essas são as únicas mudanças que precisamos fazer no código de nossa aplicação.

Você pode encontrar o código para nossa aplicação atual na íntegra no branch <i>part4-2</i> [deste repositório do GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

### supertest

Vamos utilizar o pacote [supertest](https://github.com/visionmedia/supertest) para nos ajudar a escrever os testes para nossa API.

Vamos instalar o pacote como uma dependência de desenvolvimento:

```bash
npm install --save-dev supertest
```

Let's write our first test in the <i>tests/note_api.test.js</i> file:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

O teste importa a aplicação Express do módulo <i>app.js</i> e o envolve com a função <i>supertest</i> em um objeto chamado [superagent](https://github.com/visionmedia/superagent). Esse objeto é atribuído à variável <i>api</i>, usada nos testes para fazer requisições HTTP para o backend.

Nosso teste faz uma requisição HTTP GET na url <i>api/notes</i> e verifica se a requisição é respondida com o código de status 200. O teste também verifica se o cabeçalho <i>Content-Type</i> está configurado como <i>application/json</i>, o que indica que os dados estão no formato desejado.

A checagem do valor do cabeçalho possui uma sintaxe estranha:

```js
.expect('Content-Type', /application\/json/)
```

O valor desejado foi definido por meio de uma [expressão regular](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions), ou simplesmente regex. Uma regex inicia e termina com uma barra /; já que a string que desejamos também possui em seu conteúdo a mesma barra (<i>application/json</i>) precisamos inserir antes dela uma contra-barra \ para que ela não seja entendida como um caracter de encerramento de nossa regex.

Em princípio, poderíamos definir o parâmetro para o teste como uma string:

```js
.expect('Content-Type', 'application/json')
```

O problema aqui, no entanto, é que ao utilizar uma string, o valor do cabeçalho deve ser exatamente o mesmo. Para a regex que criamos, é aceitável que o cabeçalho <i>contenha</i> a string em questão. O valor atual do cabeçalho é <i>application/json; charset=utf-8</i>, pois ele também contém informação sobre a codificação dos caracteres. No entanto, nosso teste não está interessado nisso, motivo pelo qual é melhor usar neste caso uma regex ao invés de uma string.

O teste contém alguns detalhes que vamos explorar [um pouco mais tarde](/ptbr/part4/testando_o_backend#async-await). A <i>arrow function</i> que define o teste é precedida pela palavra-chave <i>async</i> e a chamada dos métodos no objeto <i>api</i> está precedida da palavra-chave <i>await</i>. Nós iremos escrever alguns testes e depois daremos uma olhada nessa mágica async/await. Não se preocupe com isso agora, apenas assegure que os testes do exemplo funcionem corretamente. A sintax async/await está relacionada ao fato de fazer requisições para a API em uma operação <i>assíncrona</i>. A [sintaxe async/await](https://jestjs.io/pt-BR/docs/asynchronous) pode ser utilizada para escrever código assíncrono com aparência de código síncrono.

Assim que todos os testes (atualmente existe apenas um) terminarem a execução, temos que encerrar a conexão usada pelo Mongoose. Isso pode ser facilmente feito com o método [afterAll](https://jestjs.io/pt-BR/docs/api#afterallfn-timeout):

```js
afterAll(async () => {
  await mongoose.connection.close()
})
```

Ao executar os testes você pode se deparar com o seguinte alerta no console:

![jest console warning about not exiting](../../images/4/8.png)

O problema é causado pela versão 6.x do Mongoose; esse problema não acontece quando a versão 5.x é utilizada [A documentação do Mongoose](https://mongoosejs.com/docs/jest.html) não recomenda testar aplicações Mongoose com Jest.

[Uma forma](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de contornar esse problema é adicionar ao diretório <i>tests</i> um arquivo <i>teardown.js</i> contendo o seguinte:

```js
module.exports = () => {
  process.exit(0)
}
```

e acrescentar nas definições do Jest no <i>package.json</i> o seguinte:

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

Outro erro que pode aparecer para você nos seus testes é se a execução deles demorar mais do que 5 segundos (5000ms), que é o tempo padrão do Jest para <i>timeout</i>. Isso pode ser resolvido adicionando um terceiro parâmetro na função test:
  
```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```
  
Esse terceiro parâmetro configura o <i>timeout</i> para 100 segundos (100000ms). Um tempo longo garantirá que seu teste não falhe em razão do tempo que ele leva para executar. (Um <i>timeout</i> muito longo talvez não seja o que você queira para testes baseados em performance ou velocidade, mas para este nosso exemplo é ok).

Um detalhe importante é o seguinte: no [começo](/ptbr/part4/estrutura_de_uma_aplicacao_back_end_introducao_a_testes#estrutura-do-projeto) dessa parte, nós extraímos a aplicação Express no arquivo <i>app.js</i>, e o papel do arquivo <i>index.js</i> foi alterado para iniciar a aplicação na porta especificada com o objeto  <i>http</i> integrado do Node:

```js
const app = require('./app') // the actual Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Os testes somente utilizam a aplicação express definida no arquivo <i>app.js</i>:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

A documentação do <i>supertest</i> informa o seguinte:

> <i>se o servidor ainda não estiver ouvindo as conexões, então ele estará ligado em uma porta efêmera, logo não há necessidade de acompanhar as portas.</i>

Em outras palavras, o <i>supertest</i> se responsabiliza de iniciar a aplicação que está sendo testada na porta que está em uso internamente.

Vamos adicionar duas notas no banco de dados de teste, usando o _mongo.js_ (lembre-se de mudar para a url correta do banco de dados).

Vamos escrever alguns testes a mais:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Ambos os testes armazenam a resposta da requisição na variáveis _response_, e diferente da versão anterior do teste que utilizava o método provido pelo _supertest_ para verificar o código de status e o cabeçalho, desta vez nós estamos inspecionando os dados de resposta armazenados na propriedade <i>response.body</i>. Nossos testes verificam o formato e o conteúdo dos dados da resposta com o método do Jest [expect](https://jestjs.io/pt-BR/docs/expect).

O benefício de usar a sintaxe async/await começa a ficar evidente. Normalmente, teríamos que usar funções de retorno de chamada para acessar os dados retornados pelas promessas, mas, com a nova sintaxe, as coisas estão muito mais simples:

```js
const response = await api.get('/api/notes')

// a execução chega aqui somente após a requisição HTTP estar completa
// o resultado da requisição HTTP é salva na variável response
expect(response.body).toHaveLength(2)
```

O <i>middleware</i> que exibe informações sobre as solicitações HTTP está obstruindo a saída da execução do teste. Vamos modificar o logger para que ele não imprima no console no modo de teste:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### Inicializando o banco de dados antes dos testes

Testar parece ser fácil e atualmente nossos testes estão passando. No entanto, nossos testes são ruins, uma vez que dependem do estado do banco de dados, que agora tem duas notas. Para tornar nossos testes mais robustos, devemos redefinir o banco de dados e gerar os dados de teste necessários de maneira controlada antes de executarmos os testes.

Nosso código já está utilizando a função do Jest [afterAll](https://jestjs.io/pt-BR/docs/api#afterallfn-timeout) para encerrar a conexão com o banco de dados após a conclusão da execução dos testes. O Jest oferece muitas outras [funções](https://jestjs.io/pt-BR/docs/setup-teardown) que podem ser utilizadas para executar operações uma vez antes de executar qualquer teste ou antes da execução de cada teste.

Vamos inicializar o banco de dados <i>antes de cada teste</i> com a função [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout):

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')
// highlight-end

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

O banco de dados é apagado logo no início, após isso salvamos no banco as duas notas armazenadas no <i>array</i> initialNotes. Fazendo isso, garantimos que o banco de dados esteja no mesmo estado antes da execução de cada teste.

Vamos fazer também algumas alterações nos dois últimos testes:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
  // highlight-end
})
```

Dê uma atenção especial no expect do último teste. O comando <code>response.body.map(r => r.content)</code> é utilizado para criar um array contendo o que está no <i>content</i> de cada nota retornada pela API. O método [toContain](https://jestjs.io/docs/expect#tocontainitem) é utilizado para checar se a nota passada como parâmetro está na lista de notas retornada pela API.

### Executando os testes um por um

O comando _npm test_ executa todos os testes da aplicação. Quando estamos escrevendo testes, normalmente é sábio executar um ou dois testes. O Jest oferece algumas formas diferentes de fazer isso, uma delas é o método [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout). Se os testes estiverem escritos em vários arquivos, esse método não é muito bom.

Uma opção melhor é especificar os testes que precisam ser executados como parâmetros do comando <i>npm test</i>.

O comando a seguir somente executa os testes encontrados no arquivo <i>tests/note_api.test.js</i>:

```js
npm test -- tests/note_api.test.js
```

A opção <i>-t</i> pode ser utilizada para executar testes com um nome específico:


```js
npm test -- -t "a specific note is within the returned notes"
```

O parâmetros informado pode referenciar o nome do teste ou o bloco <i>describe</i>. O parâmetro também pode conter somente parte do nome. O comando a seguir vai executar todos os testes que contenha <i>notes</i> em seu nome

```js
npm test -- -t 'notes'
```

**Obs.:**: Ao executar um único teste, a conexão mongoose pode permanecer aberta se nenhum teste usando a conexão for executado. O problema pode ser porque o <i>supertest</i> prepara a conexão, mas o Jest não executa a parte <i>afterAll</i> do código.

### async/await

Antes de escrevermos mais testes, vamos dar uma olhada nas palavras-chave _async_ e _await_.

A sintaxe async/await que foi introduzida no ES7, torna possível o uso de <i>funções assíncronas que retornam uma promessa</i> de um jeito que parece com código síncrono.

Como um exemplo, a busca das notas do banco de dados utilizando promessas é assim:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

O método _Note.find()_ retorna uma promessa e podemos acessar o resultado da operação registrando a função <i>callback</i> com o método _then()_.

Todo o código que queremos executar quando a operação termina está escrito na função <i>callback</i>. Se quisermos fazer diversas chamadas de funções assíncronas em sequência, a situação logo ficará complicada. As chamadas assíncronas seriam feitas na função <i>callback</i>. Isso resultaria em um código complicado e provavelmente surgiria o chamado [callback hell](http://callbackhell.com/).

[Encadeando promessas](https://javascript.info/promise-chaining), nós conseguiríamos manter a situação sob controle e evitar o <i>callback hell</i> ao criar uma cadeia bem limpa de chamadas de métodos _then()_. Vimos alguns desses durante o curso. Para ilustrar, você pode ver um exemplo de uma função que busca todas as notas e, em seguida, exclui a primeira delas:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // mais código aqui
  })
```

A cadeia de métodos _then()_ é ok, mas podemos fazer melhor do que isso. As [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduzidas no ES6 trazem um [jeito inteligente](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) de escrever código assíncrono de uma forma que "parece síncrono". A sintaxe é um pouco estranha e não é muito utilizada.

As palavras-chave _async_ e _await_  introduzidas no ES7 trazem a mesma funcionalidade dos <i>generators</i>, mas de uma maneira compreensível e sintaticamente mais limpa para todos os cidadãos do mundo JavaScript.

Poderíamos buscar todas as notas no banco de dados utilizando o operador [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) dessa forma:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

O código parece idêntico a um código síncrono. A execução do código pausa em <em>const notes = await Note.find({})</em> e aguarda até que a promessa seja <i>completada (fulfilled)</i>, então continua a sua execução na próxima linha. Quando a execução continua, o resultado da operação que retornou a promessa é atribuído à variável _notes_.

O exemplo um pouco complicado apresentado acima poderia ser implementado usando <i>await</i> assim:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Graças à nova sintaxe, o código é muito mais simples do que a cadeia de _then()_ anterior.

Existem alguns detalhes importantes para prestar atenção ao usar a sintaxe async/await. Para usar o operador await com operações assíncronas, elas precisam retornar uma promessa. Isso não é um problema em si, já que as funções assíncronas regulares que usam <i>callbacks</i> são fáceis de envolver em promessas.

A palavra-chave await não pode ser utilizada em qualquer lugar do código JavaScript. Somente é possível usar o await dentro de uma função [assíncrona (async)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

Isso significa que para os exemplos anteriores funcionarem, é preciso que estejam em funcções assíncronas. Note a primeira linha da definição da <i>arrow function</i>:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

O código declara que a função atribuída a _main_ é assíncrona. Após isso, o código chama a função com <code>main()</code>.

### async/await in the backend

Let's start to change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions.

The route for fetching all notes gets changed to the following:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.

You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### More tests and refactoring the backend

When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API.

Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the number of notes returned by the API increases and that the newly added note is in the list.

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

Test fails since we are by accident returning the status code <i>200 OK</i> when a new note is created. Let us change that to <i>201 CREATED</i>:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

Let's also write a test that verifies that a note without content will not be saved into the database.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})
```

Both tests check the state stored in the database after the saving operation, by fetching all the notes of the application.  

```js
const response = await api.get('/api/notes')
```

The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called <i>tests/test_helper.js</i> which is in the same directory as the test file.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, which can be used for creating a database object ID that does not belong to any note object in the database.

Our tests can now use the helper module and be changed like this:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax.

We make the following changes to the code that takes care of adding a new note(notice that the route handler definition is preceded by the _async_ keyword):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

There's a slight problem with our code: we don't handle error situations. How should we deal with them?

### Error handling and async/await

If there's an exception while handling the POST request we end up in a familiar situation:

![terminal showing unhandled promise rejection warning](../../images/4/6.png)

In other words, we end up with an unhandled promise rejection, and the request never receives a response.

With async/await the recommended way of dealing with exceptions is the old and familiar _try/catch_ mechanism:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  // highlight-start
  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

The catch block simply calls the _next_ function, which passes the request handling to the error handling middleware.

After making the change, all of our tests will pass once again.

Next, let's write tests for fetching and removing an individual note:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

Both tests share a similar structure. In the initialization phase, they fetch a note from the database. After this, the tests call the actual operation being tested, which is highlighted in the code block. Lastly, the tests verify that the outcome of the operation is as expected.

The tests pass and we can safely refactor the tested routes to use async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
```

You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Eliminating the try-catch

Async/await unclutters the code a bit, but the 'price' is the <i>try/catch</i> structure required for catching exceptions.
All of the route handlers follow the same structure

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

One starts to wonder if it would be possible to refactor the code to eliminate the <i>catch</i> from the methods?

The [express-async-errors](https://github.com/davidbanham/express-async-errors) library has a solution for this.

Let's install the library

```bash
npm install express-async-errors
```

Using the library is <i>very</i> easy.
You introduce the library in <i>app.js</i>:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

The 'magic' of the library allows us to eliminate the try-catch blocks completely.
For example the route for deleting a note

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

becomes

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

Because of the library, we do not need the _next(exception)_ call anymore.
The library handles everything under the hood. If an exception occurs in an <i>async</i> route, the execution is automatically passed to the error handling middleware.

The other routes become:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

### Optimizing the beforeEach function

Let's return to writing our tests and take a closer look at the _beforeEach_ function that sets up the tests:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

The function saves the first two notes from the _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there's a better way of saving multiple objects to the database:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

We save the notes stored in the array into the database inside of a _forEach_ loop. The tests don't quite seem to work however, so we have added some console logs to help us find the problem.

The console displays the following output:

<pre>
cleared
done
entered test
saved
saved
</pre>

Despite our use of the async/await syntax, our solution does not work as we expected it to. The test execution begins before the database is initialized!

The problem is that every iteration of the forEach loop generates an asynchronous operation, and _beforeEach_ won't wait for them to finish executing. In other words, the _await_ commands defined inside of the _forEach_ loop are not in the _beforeEach_ function, but in separate functions that _beforeEach_ will not wait for.

Since the execution of tests begins immediately after _beforeEach_ has finished executing, the execution of tests begins before the database state is initialized.

One way of fixing this is to wait for all of the asynchronous operations to finish executing with the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

The solution is quite advanced despite its compact appearance. The _noteObjects_ variable is assigned to an array of Mongoose objects that are created with the _Note_ constructor for each of the notes in the _helper.initialNotes_ array. The next line of code creates a new array that <i>consists of promises</i>, that are created by calling the _save_ method of each item in the _noteObjects_ array. In other words, it is an array of promises for saving each of the items to the database.

The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as a parameter is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits until every promise for saving a note is finished, meaning that the database has been initialized.

> The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the _await_ syntax <em>const results = await Promise.all(promiseArray)</em>, the operation will return an array that contains the resolved values for each promise in the _promiseArray_, and they appear in the same order as the promises in the array.

Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) block, that guarantees a specific execution order.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

The asynchronous nature of JavaScript can lead to surprising behavior, and for this reason, it is important to pay careful attention when using the async/await syntax. Even though the syntax makes it easier to deal with promises, it is still necessary to understand how promises work!

The code for our application can be found on [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>.

### A true full stack developer's oath

Making tests brings yet another layer of challenge to programming. We have to update our full stack developer oath to remind you that systematicity is also key when developing tests.

So we should once more extend our oath:

Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- I will keep an eye on the database: does the backend save data there in the right format
- I will progress in small steps
- <i>I will write lots of _console.log_ statements to make sure I understand how the code and the tests behave and to help pinpoint problems</i>
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
- <i>If a test does not pass, I make sure that the tested functionality for sure works in the application</i>
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help

</div>

<div class="tasks">

### Exercises 4.8.-4.12.

**NB:** the material uses the [toContain](https://jestjs.io/docs/expect#tocontainitem) matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the [toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem) matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises.

**Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.

#### 4.8: Blog list tests, step1

Use the supertest package for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> URL. Verify that the blog list application returns the correct amount of blog posts in the JSON format.

Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.

Notice that you will have to make similar changes to the code that were made [in the material](/en/part4/testing_the_backend#test-environment), like defining the test environment so that you can write tests that use separate databases.

**NB:** When running the tests, you may run into the following warning:

![Warning to read docs on connecting mongoose to jest](../../images/4/8a.png)

[One way](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) to get rid of this is to
add to the <i>tests</i> directory a file <i>teardown.js</i> with the following content

```js
module.exports = () => {
  process.exit(0)
}
```

and by extending the Jest definitions in the <i>package.json</i> as follows

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
   "globalTeardown": ".test/teardown.js" // highlight-line
 }
}
```

**NB:** when you are writing your tests **<i>it is better to not execute all of your tests</i>**, only execute the ones you are working on. Read more about this [here](/en/part4/testing_the_backend#running-tests-one-by-one).

#### 4.9: Blog list tests, step2

Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>. Verifying the existence of a property is easily done with Jest's [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) matcher.

Make the required changes to the code so that it passes the test. The [toJSON](/en/part3/saving_data_to_mongo_db#backend-connected-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter.

#### 4.10: Blog list tests, step3

Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> URL successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.

Once the test is finished, refactor the operation to use async/await instead of promises.

#### 4.11*: Blog list tests, step4

Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

Make the required changes to the code so that it passes the test.

#### 4.12*: Blog list tests, step5

Write tests related to creating new blogs via the <i>/api/blogs</i> endpoint, that verify that if the <i>title</i> or <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>.

Make the required changes to the code so that it passes the test.

</div>

<div class="content">

### Refactoring tests

Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren't tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks.

Below is an example of the test file after making some minor improvements:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only JavaScript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

The test output is grouped according to the <i>describe</i> blocks:

![jest output showing grouped describe blocks](../../images/4/7.png)

There is still room for improvement, but it is time to move forward.

This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources.

You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Exercises 4.13.-4.14.

#### 4.13 Blog list expansions, step1

Implement functionality for deleting a single blog post resource.

Use the async/await syntax. Follow [RESTful](/en/part3/node_js_and_express#rest) conventions when defining the HTTP API.

Implement tests for the functionality.

#### 4.14 Blog list expansions, step2

Implement functionality for updating the information of an individual blog post.

Use async/await.

The application mostly needs to update the number of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [part 3](/en/part3/saving_data_to_mongo_db#other-operations).

Implement tests for the functionality.

</div>
