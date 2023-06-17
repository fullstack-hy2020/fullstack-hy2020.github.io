---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: ptbr
---

<div class="content">

Começaremos agora a escrever testes para o backend. Já que o backend não contém nenhuma lógica complicada, não faz sentido escrever [testes de unidade (unit tests)](https://pt.wikipedia.org/wiki/Teste_de_unidade) para ele. A única coisa que provavelmente poderíamos testar com unit test seria o método _toJSON_ que é utilizado para formatar as notas.

Em algumas situações, pode ser vantajoso implementar alguns dos testes de backend fazendo um <i>mock</i> do banco de dados ao invés de utilizar um banco de dados real. Uma biblioteca que poderia ser utilizada para isso é a [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Já que o backend de nossa aplicação ainda é relativamente simples, nós iremos testar a aplicação inteira por meio de sua API REST, o que inclui o banco de dados. Esse tipo de teste no qual múltiplos componentes do sistema estão sendo testados em grupo é chamado de [teste de integração](https://pt.wikipedia.org/wiki/Teste_de_integra%C3%A7%C3%A3o).

### Ambiente de teste

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

Vamos escrever nosso primeiro teste no arquivo <i>tests/note_api.test.js</i>:

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

O valor desejado foi definido por meio de uma [expressão regular](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions), ou simplesmente regex. Uma regex inicia e termina com uma barra /; já que a string que desejamos também possui em seu conteúdo a mesma barra (<i>application/json</i>) precisamos inserir antes dela uma contra-barra \ para que ela não seja entendida como um caractere de encerramento de nossa regex.

Em princípio, poderíamos definir o parâmetro para o teste como uma string:

```js
.expect('Content-Type', 'application/json')
```

O problema aqui, no entanto, é que ao utilizar uma string, o valor do cabeçalho deve ser exatamente o mesmo. Para a regex que criamos, é aceitável que o cabeçalho <i>contenha</i> a string em questão. O valor atual do cabeçalho é <i>application/json; charset=utf-8</i>, pois ele também contém informação sobre a codificação dos caracteres. No entanto, nosso teste não está interessado nisso, motivo pelo qual é melhor usar neste caso uma regex ao invés de uma string.

O teste contém alguns detalhes que vamos explorar [um pouco mais tarde](/ptbr/part4/testando_o_backend#async-await). A <i>arrow function</i> que define o teste é precedida pela palavra-chave <i>async</i> e a chamada dos métodos no objeto <i>api</i> está precedida da palavra-chave <i>await</i>. Nós iremos escrever alguns testes e depois daremos uma olhada nessa mágica async/await. Não se preocupe com isso agora, apenas assegure que os testes do exemplo funcionem corretamente. A sintaxe async/await está relacionada ao fato de fazer requisições para a API em uma operação <i>assíncrona</i>. A [sintaxe async/await](https://jestjs.io/pt-BR/docs/asynchronous) pode ser utilizada para escrever código assíncrono com aparência de código síncrono.

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

Isso significa que para os exemplos anteriores funcionarem, é preciso que estejam em funções assíncronas. Note a primeira linha da definição da <i>arrow function</i>:

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

Vamos começar a alterar o backend para usar async/await. Como todas as operações assíncronas atualmente são feitas dentro de uma função, basta mudar as funções que gerenciam a rota. 

O código da rota para buscar todas as notas deve se alterado  como segue:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Podemos verificar que nosso refatoramento foi bem sucedido testando o endpoint pelo navegador e executando os testes que escrevemos mais cedo.

Você pode encontrar o código para da aplicação atual na branch da <i>part4-3</i> [nesse repositório GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### Mais testes e refatoração do backend

Quando o código é refatorado, sempre existe o risco de[regressão](https://pt.wikipedia.org/wiki/Teste_de_regress%C3%A3o), o que significa que funcionalidades existentes podem quebrar. Vamos refatorar as operações primeiramente restantes escrevendo um teste para cada rota da API.

Vamos começar com a operação que adiciona uma nova nota. Vamos escrever um teste que adiciona uma nova nota e verifica que se o número de notas retornadas pela API aumenta e se a nova nota adicionada está na lista.

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

O teste falha já que nós estamos acidentalmente retornando o códio de status <i>200 OK</i> quando uma nova nota é criada. Vamos mudar para <i>201 CRIADO(CREATED)</i>:

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

Vamos também escrever um teste que verifica que uma nota sem conteúdo não será salva no banco de dados.

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

Ambos os testes checam o estado armazenado no banco de dados após a operação salvar, buscando todas as notas da aplicação.

```js
const response = await api.get('/api/notes')
```

Os mesmos passos de verificação serão repetidos posteriormente em outros testes, então é uma boa ideia extrair esses passos em uma função auxiliadora. Vamos adicionar a função em um novo arquivo chamado <i>tests/test_helper.js</i> que está no mesmo diretório do arquivo de teste.

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

O módulo define a função _notesInDb_ que pode ser utilizada para checar as notas armazenadas no banco de dados. O array _inicialNotes_ contendo o estado inicial do banco de dados também está no módulo. Além disso, definimos a futura função _noExistingId_. que pode ser utilizada para criar um objeto ID de banco de dados que não pertence a nenhum objeto nota no banco de dados.

Nossos testes agora podem usar o módulo auxiliador (helper): 

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

O código usando promessas funciona e os testes passam. Estamos prontos para refatorar nosso código para usar a sintaxe async/await

Nós fizemos as seguintes alterações no código que cuida de adicionar uma nova nota (note que a definição do gerenciador de rota está precedida pela palavra-chave _async_):

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

Existe um pequeno problema no código: nós não estamos tratando erros. Como deveríamos lidar com eles?

### Tratamento de erro e async/await

Se ocorrer uma exceção durante a requisição POST, enfrentaremos uma situação familiar: 

![terminal mostrando alertas de rejeições não tratadas de promessas](../../images/4/6.png)

Em outras palavras, acabamos com uma rejeição de promessa que não foi tratada e a solicitação nunca recebe uma resposta.

Com o async/await, o recomendado no tratamento de exceções é o mecanismo familiar _try/catch_:

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

O bloco <i>catch</i> simplesmente chama a função <i>next</i>, que passa o tratamento da requisição para o <i>middleware</i> de tratamento de erro.

Depois de fazer essa alteração, todos os nossos testes passarão novamente.

Em seguida, vamos escrever testes para buscar e apagar uma nota individual:

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

Ambos os testes compartilham uma estrutura semelhante. Na fase de inicialização, eles buscam uma nota no banco de dados. Depois disso, os testes chamam a operação que está sendo testada, que é destacada no bloco de código. Por último, os testes verificam se o resultado da operação está de acordo com o esperado.

Os testes passam e podemos seguramente refatorar as rotas testadas para usar async/await:

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

Você encontrará o código de nossa aplicação atual na branch <i>part4-4</i>[nesse repositório GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Eliminando o try-catch

Async/await simplifica um pouco o código, mas o 'preço' a se pagar é a estrutura <i>try/catch</i> necessária ao tratamento de exceções.
Todos os gerenciadores de rotas seguem a mesma estrutura:

```js
try {
  // faça as operações assíncronas aqui
} catch(exception) {
  next(exception)
}
```

Talvez você esteja se perguntando se é possível refatorar o código para eliminar o <i>try/catch</i> dos métodos.

A biblioteca [express-async-errors](https://github.com/davidbanham/express-async-errors) traz uma solução para isso.

Vamos instalar a biblioteca:

```bash
npm install express-async-errors
```

Utilizar essa biblioteca é <i>muito</i> fácil.
Você deve usar a biblioteca no arquivo <i>app.js</i>:

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

A 'mágica' aqui é eliminar completamente os blocos try-catch. Por exemplo, a rota para deletar notas:

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

fica assim:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

Por causa da biblioteca, não precisamos mais chamar _next(exception)_.
A biblioteca cuida de gerenciar tudo por baixo dos panos. Se uma exceção ocorre em uma rota <i>async</i>, ela é automaticamente passada para o <i>middleware</i> de tratamento de exceção.

As outras rotas ficam assim:

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

### Otimizando a função beforeEach

Vamos retornar a escrita de nossos testes a dar uma olhada mais de perto na função _beforeEach_ que configura os testes:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

A função armazena no banco de dados as primeiras duas notas do array _helper.initialNotes_ em duas operações separadas. A solução está correta, mas há uma forma melhor de salvar múltiplos objetos no banco de dados:

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

Nós salvamos no banco dedados as notas armazenadas no array por meio de um <i>loop</i> _forEach_. No entanto, os testes não parecem funcionar, então precisamos adicionar alguns logs no console para nos ajudar a encontrar o problema.

O console mostra a seguinte saída:

<pre>
cleared
done
entered test
saved
saved
</pre>

Apesar de usarmos a sintaxe async/await, nossa solução não funciona como esperávamos. A execução do teste começa antes que o banco de dados seja inicializado!

O problema é que cada iteração do loop forEach gera uma operação assíncrona e o _beforeEach_ não aguardará até que elas terminem de ser executadas. Em outras palavras, os comandos _await_ definidos dentro do loop _forEach_ não estão na função _beforeEach_, mas em funções separadas cujas execuções _beforeEach_ não aguardará chegar ao fim.

Como a execução dos testes começa imediatamente após o _beforeEach_ ter sido concluído, a execução dos testes começa antes que o estado do banco de dados seja inicializado.

Uma maneira de corrigir isso é aguardar que todas as operações assíncronas terminem de ser executadas com o método [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

A solução é bastante avançada, apesar de sua aparência compacta. A variável _noteObjects_ é atribuída a um array de objetos Mongoose que são criados com o construtor _Note_ para cada uma das notas no array _helper.initialNotes_. A próxima linha de código cria um novo array <i>de promessas</i>, que são criadas chamando o método _save_ de cada item no array _noteObjects_. Em outras palavras, é um array de promessas para salvar cada um dos itens no banco de dados.

O método [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) pode ser usado para transformar um array de promessas em uma única promessa, que será <i>cumprida (fulfilled)</i> assim que todas as promessas no array passado como parâmetro forem resolvidas. A última linha de código <em>await Promise.all(promiseArray)</em> espera até que todas as promessas para salvar uma nota sejam concluídas, o que significa que o banco de dados foi inicializado.

> Os valores retornados por cada promessa do array ainda podem ser acessados ao usar o método Promise.all. Se esperarmos pelas promessas serem resolvidas com a sintaxe _await_ <em>const results = await Promise.all(promiseArray)</em>, a operação retornará um array que contém os valores resultantes de cada promessa em _promiseArray_, e elas aparecem na mesma ordem das promessas no array.

O método Promise.all executa as promessas que recebe em paralelo. Se as promessas precisam ser executadas em uma ordem específica, isso será um problema. Nestas situações, as operações podem ser executadas dentro de um bloco [for...of](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for...of) que garante uma ordem específica de execução:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

A natureza assíncrona do JavaScript pode conduzir em comportamentos surpreendentes, por esta razão é importante prestar atenção na utilização da sintaxe async/await. Mesmo que a sintaxe facilite lidar com promessas, ainda é necessário entender como as promessas funcionam!

O código de nossa aplicação pode ser encontrado no [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), na branch <i>part4-5</i>.

### O juramento de um verdadeiro desenvolvedor full stack

Incluir testes traz mais um desafio à programação. Precisamos atualizar nosso juramento de desenvolvedor full stack para lembrar que a sistemática também é fundamental ao desenvolver testes.

Então devemos estender nosso juramento novamente:

O desenvolvimento full stack é extremamente difícil, por isso usarei todos os meios possíveis para torná-lo mais fácil.

- Vou manter sempre aberto o console do desenvolvedor do meu navegador
- Usarei a guia de rede das ferramentas de desenvolvimento do navegador para garantir que o frontend e o backend estejam se comunicando como esperado
- Vou constantemente monitorar o estado do servidor para ter certeza que o dado enviado pelo frontend foi salvo conforme esperado
- Vou monitorar o banco de dados: o backend está salvando os dados no formato adequado?
- Eu progredirei em pequenos passos
- <i>Vou escrever muitos comandos console.log para entender o comportamento do código e dos testes e auxiliar na identificação de problemas</i>
- Se meu código não funcionar, não escreverei mais código. Em vez disso, voltarei a apagar o código até que funcione ou simplesmente retorne a um estado anterior em que tudo ainda estava funcionando.
- <i>Se um teste falhar, eu vou me certificar de que a funcionalidade testada realmente funcione na aplicação</i>
- Quando pedir ajuda no canal Discord ou Telegram do curso ou em outro lugar, formularei corretamente minhas perguntas. Veja [aqui](https://fullstackopen.com/ptbr/part0/informacoes_gerais#canal-do-curso-no-discord-e-telegram) como pedir ajuda.

</div>

<div class="tasks">

### Exercícios 4.8.-4.12.

**Obs.:** o material utiliza o comparador [toContain](https://jestjs.io/pt-BR/docs/expect#tocontainitem) em vários lugares para verificar se um array contém um elemento específico. Vale ressaltar que o método utiliza o operador === para comparar a correspondência de elementos, o que significa que nem sempre é apropriado para comparar objetos. Em muitos casos, o método mais adequado para verificação de objetos em um array é o comparador [toContainEqual](https://jestjs.io/pt-BR/docs/expect#tocontainequalitem). No entanto, as soluções-modelo não checam os objetos do array com comparadores, logo utilizar o método não é necessário para resolver os exercícios.

**Atenção:** Se você estiver utilizando async/await e métodos <i>then</i> no mesmo código, é quase certo de que você esteja fazendo algo errado. Use um ou outro, mas não misture ambos.

#### 4.8: Testes para lista de Blog, passo1

Utilize o pacote supertest para escrever um teste que faça uma requisição HTTP GET para a URL <i>/api/blogs</i>. Verifica se a aplicação de lista de blog retorna a quantidade correta de posts de blog em formato JSON.

Uma vez que os testes estejam concluídos, refatore o gerenciador de rotas para utilizar a sintaxe async/await ao invés de promises.

Note que você terá que fazer mudanças no código parecidas com as que fizemos [no material](/ptbr/part4/testando_o_back_end#ambiente-de-teste), como definir o ambiente de teste de forma que você possa escrever os testes em banco de dados separados.

**Obs.:** Quando estiver executando os testes, você pode se deparar com os seguintes alertas:

![Alerta sobre a documentação enquanto conectando ao mongoose pelo jest](../../images/4/8a.png)

[Uma forma](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de se livrar disso é adicionar no diretório de <i>tests</i> um arquivo de desmontagem chamado <i>teardown.js</i> com o seguinte conteúdo:

```js
module.exports = () => {
  process.exit(0)
}
```

e incluir nas definições do Jest no <i>package.json</i> o seguinte:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
   "globalTeardown": ".test/teardown.js" // highlight-line
 }
}
```

**Obs.:** quando estiver escrevendo seus testes **<i>é melhor não executar todos os testes de uma vez</i>**, somente execute aqueles em que estiver trabalhando no momento. Leia mais sobre isso [aqui](/ptbr/part4/testando_o_back_end#executando-os-testes-um-por-um).

#### 4.9: Testes para lista de Blog, passo2

Escreva um teste que verifique se a propriedade para o identificador único dos posts de blog tem o nome de <i>id</i>, por padrão o banco de dados nomeia a propriedade como <i>_id</i>. Verificar a existência de uma propriedade é fácil com o comparador [toBeDefined](https://jestjs.io/pt-BR/docs/expect#tobedefined) do Jest.

Faça as mudanças necessárias no código a fim de que os testes passem. O método [toJSON](/ptbr/part3/salvando_dados_no_mongo_db#conectando-o-backend-a-um-banco-de-dados) discutido na parte 3 é o mais apropriado para definir o parâmetro <i>id</i>.

#### 4.10: Testes para lista de Blog, passo3

Escreva um teste que verifica se ao fazer uma requisição HTTP POST para a URL <i>/api/blogs</i> um novo post de blog é criado. Ao fim, verifica se o número total de blogs no sistema aumentou para mais um. Você também pode verificar se o conteúdo do post de blog está salvo no banco de dados.

Uma vez que o teste estiver finalizado, refatore-o utilizando a sintaxe async/await ao invés de promises.

#### 4.11*: Testes para lista de Blog, passo4

Escreva um teste que verifica se a propriedade <i>likes</i> está faltando na requisição e se estiver, defina como padrão o valor 0 para esta propriedade.

Faça as mudanças necessárias no código para que o teste passe.

#### 4.12*: Testes para lista de Blog, passo5

Escreva testes relacionados a criação de um novo blog pelo endpoint <i>/api/blogs</i>, que verifique se as propriedades <i>title</i> ou <i>url</i> estão faltando nos dados da requisição, o backend deve responder a requisição com código de status <i>400 Bad Request</i>.

Faça as mudanças necessárias no código para que o teste passe.

</div>

<div class="content">

### Refatorando os testes

Atualmente, nossa cobertura de testes é insuficiente. Algumas requisições como <i>GET /api/notes/:id</i> e <i>DELETE /api/notes/:id</i> não foram testadas quando uma requisição é feita com um id inválido. O agrupamento e a organização dos testes também podem melhorar, já que todos os testes estão "no mesmo nível" no arquivo de testes. A legibilidade dos testes aumentaria se agrupássemos os testes relacionados com blocos <i>describe</i>.

Abaixo está um exemplo do arquivo de teste após pequenas melhorias:

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

A saída é agrupada de acordo com os blocos <i>describe</i>:

![saídas do jest mostrando blocos describe agrupados](../../images/4/7.png)

Ainda há espaço para melhorias, mas precisamos seguir adiante.

Essa forma de testar a API, fazendo solicitações HTTP e inspecionando o banco de dados com o Mongoose, não é de forma alguma a única nem a melhor maneira de conduzir testes de integração em nível de API para aplicações de servidor. Não há uma melhor maneira universal de escrever testes, pois tudo depende da aplicação sendo testada e dos recursos disponíveis.

Você encontrará o código atual de nossa aplicação na branch <i>part4-6</i> do [repositório GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Exercises 4.13.-4.14.

#### 4.13 Expansões na lista de Blog, passo1

Implemente a funcionalidade de deletar um post de blog.

Utilize a sintaxe async/await. Siga a convenção [RESTful](ptbr/part3/node_js_e_express#rest) quando estiver definindo a API HTTP.

Implemente os testes para a funcionalidade.

#### 4.14 Expansões na lista de Blog, passo2

Implemente a funcionalidade de atualizar informações individuais de um post de blog.

Use async/await.

A aplicação necessita atualizar o número de <i>likes</i> de um post de blog. Você pode implementar esta funcionalidade da mesma forma que fizemos para atualizar as notas na [parte 3](/ptbr/part3/salvando_dados_no_mongo_db#outras-operacoes).

Implemente os testes para a funcionalidade.

</div>
