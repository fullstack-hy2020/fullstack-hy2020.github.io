---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: ptbr
---

<div class="content">

Vamos continuar nosso trabalho no backend da aplicação de notas que iniciamos na [parte 3](/ptbr/part3)

### Estrutura do projeto

Antes de adentrarmos no tópico de testes, nós iremos modificar a estrutura do projeto para aderir às melhores práticas do Node.js.

Após fazer as mudanças na estrutura do diretório de nosso projeto, terminaremos com a seguinte estrutura:

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Até o momento estamos utilizando o <i>console.log</i> e <i>console.error</i> para imprimir diferentes informações do código.
No entanto, esse não é o melhor jeito de fazer as coisas.
Vamos separar todas as impressões no console em seu próprio módulo <i>utils/logger.js</i>:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

O logger que criamos tem duas funções: __info__ para imprimir mensagens normais no console; e __error__ para as mensagens de erro. 

Extrair o código de log para seu próprio módulo é uma boa ideia, por diversos motivos. Se decidirmos escrever logs em um arquivo ou enviá-los para um serviço externo de logging, como [graylog](https://www.graylog.org/) ou [papertrail](https://papertrailapp.com) só precisaremos realizar mudanças em um determinado lugar.

O conteúdo de <i>index.js</i>, arquivo usado para iniciar a aplicação, fica simplificado da seguinte forma:

```js
const app = require('./app') // atual aplicação Express
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

O arquivo <i>index.js</i> somente importa a aplicação do arquivo <i>app.js</i> e depois inicia a aplicação. A função _info_ do módulo logger é usada para imprimir no console, informando que a aplicação está sendo executada.

Agora, o app Express e o código encarregado de cuidar do servidor web estão separados, seguindo assim [as melhores](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) [práticas](https://nodejsbestpractices.com/sections/projectstructre/separateexpress). Uma das vantagens desse método é que a aplicação poderá agora ser testada a nível de chamadas de API HTTP, sem realizar chamadas via HTTP sobre a rede, o que resultará em execuções de testes mais rápidas.

O gerenciamento de variáveis de ambiente é extraído em um arquivo separado <i>utils/config.js</i>:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```
As outras partes da aplicação podem acessar as variáveis de ambiente importando o módulo de configuração (config.js)
```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

Os gerenciadores de rota também foram movidos para um módulo dedicado. Os gerenciadores de evento das rotas são normalmente chamados de <i>controllers (controladores)</i>, por esta razão nós criamos um novo diretório chamado <i>controllers</i>. Todas as rotas relacionadas às notas estão agora em <i>notes.js</i>, que é um módulo dentro do diretório <i>controllers</i>.

O conteúdo do módulo <i>notes.js</i> é o seguinte:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
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

module.exports = notesRouter
```

Essa é quase uma cópia exata do conteúdo que anteriormente estava no arquivo <i>index.js</i>

Mas há algumas mudanças significativas. No início do arquivo nós criamos um novo objeto [router](http://expressjs.com/en/api.html#router) (roteador):

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

O módulo exporta o roteador para estar disponível para todos os consumidores.

Todas as rotas estão agora definidas no objeto _router_, parecido com o que fizemos antes com o objeto que representava a aplicação inteira.

Vale ressaltar que os caminhos nos manipuladores de rotas foram encurtados. Na versão anterior, tínhamos:

```js
app.delete('/api/notes/:id', (request, response) => {
```

E agora temos:

```js
notesRouter.delete('/:id', (request, response) => {
```

O que exatamente são esses objetos _router_? O manual do Express explica o seguinte:

> <i>Um objeto router é uma instância isolada de middleware e rotas. Você pode pensar nele como uma "mini-aplicação", capaz de somente executar funções de middleware e de roteamento. Toda aplicação Express possui um app router integrado.</i>

De fato, o _router_ é um <i>middleware</i>, que pode ser utilizado para definir "rotas relacionadas" a um determinado lugar, e que tipicamente é colocado em seu próprio módulo.

O arquivo <i>app.js</i> que cria a aplicação recebe o _router_ e o utiliza da seguinte forma:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

Esse _router_ que definimos mais cedo é usado <i>se</i> a URL da requisição começar com <i>/api/notes</i>. Por este motivo, o objeto notesRouter somente deve definir rotas com caminhos relativos, por exemplo o caminho vazio <i>/</i> ou apenas o parâmetro <i>/:id</i>.

Após estas mudanças, nosso arquivo <i>app.js</i> ficará desta forma:

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

O código coloca diferentes middleware em uso, um deles é o <i>notesRouter</i> que está acoplado à rota <i>/api/notes</i>.

Nosso middleware personalizado foi movido para o novo módulo <i>utils/middleware.js</i>:

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

A responsabilidade de estabelecer a conexão com o banco de dados foi dada ao módulo <i>app.js</i>. O arquivo <i>note.js</i> que está no diretório <i>models</i> somente define o _schema_ do Mongoose para as notas:

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

Para recapitular, após estas mudanças a estrutura de diretórios estará desta forma:

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Para aplicações pequenas, a estrutura de diretórios não é muito relevante. Mas uma vez que a aplicação começa a crescer, você precisará estabelecer algum tipo de estrutura e separar diferentes responsabilidades da aplicação em módulos distintos. Isso facilitará muito o desenvolvimento da aplicação.

As aplicações Express não requerem uma estrutura de diretórios pré-determinada ou convenção de nomes para arquivos. Em contrapartida, Ruby on Rails de fato requer uma estrutura específica. Nossa estrutura atual simplesmente segue algumas das melhores práticas que você poderá encontrar na internet.

Você pode encontrar o código atual da nossa aplicação na branch <i>part4-1</i> [neste repositório GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).

Se você fizer o clone do projeto, execute o comando _npm install_ antes de iniciar a aplicação com o comando _npm start_.

### Observação sobre os exports

Nós fizemos dois diferentes tipos de exportações, isto é, _exports_, nesta parte. Em primeiro lugar, por exemplo, o arquivo <i>utils/logger.js</i> faz _export_ da seguinte forma:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

// highlight-start
module.exports = {
  info, error
}
// highlight-end
```

O código exporta <i>um objeto</i> que possui dois campos, ambos funções. As funções podem ser utilizadas de duas maneiras diferentes: a primeira maneira é requerer o objeto inteiro e referenciar cada função por meio do objeto, usando a notação de ponto:

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```

A segunda maneira é desestruturar as funções para variáveis no momento do <i>require</i>:

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

A segunda maneira pode ser mais indicada caso somente uma pequena parte das funções exportadas forem utilizadas no código.

No arquivo <i>controller/notes.js</i> a exportação funciona assim:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter // highlight-line
```

Neste caso, há somente uma "coisa" sendo exportada, logo a única maneira de usá-la é assim:

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

Agora o "objeto" exportado (neste caso um objeto router) é atribuído a uma variável e usado como tal.

</div>

<div class="tasks">

### Exercícios 4.1.-4.2.

Nos exercícios desta parte, iremos construir uma <i>aplicação de listagem de blogs</i>, que permitirá a usuários salvarem informações sobre blogs interessantes que encontrem pela internet. Para cada blog listado. iremos salvar o autor, o título, a URL e a quantidade de votos positivos de usuários da aplicação.

#### 4.1 Blog list, passo 1

Vamos imaginar um cenário onde você receba um email contendo o seguinte código da aplicação:

```js
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Transforme a aplicação em um projeto <i>npm</i> funcional. Para manter seu desenvolvimento produtivo, configure a aplicação para ser executada com o <i>nodemon</i>. Você pode criar um novo banco de dados para sua aplicação utilizando o MongoDB Atlas ou usar algum banco de dados dos exercícios anteriores.

Verifique se é possível adicionar blogs à lista usando o Postman ou o VS Code REST Client e se a aplicação retorna o blog adicionado no _endpoint_ correto.

#### 4.2 Blog list, passo 2

Refatore a aplicação em módulos separados como demonstrado anteriormente nesta parte do curso.

**Obs.:** refatore sua aplicação dando pequenos passos (baby steps) e verifique a aplicação após cada mudança. Se você tentar "pegar atalhos" refatorando muita coisa de uma vez, a [lei de Murphy](https://en.wikipedia.org/wiki/Murphy%27s_law) irá te acertar e alguma coisa provavelmente quebrará na sua aplicação. O "atalho" vai acabar causando mais lentidão do que avançar em passos pequenos e sistemáticos.

Uma boa prática é realizar _commits_ do seu código periodicamente, sempre que alcançar um estado estável. Isso possibilita fazer retornos (_rollbacks_) para momentos em que aplicação ainda funcionava.

</div>

<div class="content">

### Testando aplicações Node

Nós negligenciamos completamente uma área essencial no desenvolvimento de software chamada de testes.

Vamos iniciar nossa jornada nos testes dando uma olhada nos testes unitários (_unit tests_). A lógica de nossa aplicação é tão simples, que não faz muito sentido os testes unitários. Vamos criar um novo arquivo <i>utils/for_testing.js</i> e escrever algumas funções simples para praticarmos a escrita de testes:

```js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

> A função _average_ utiliza o método de array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). Se você ainda não está familiarizado com este método, agora é uma boa oportunidade para assistir os três primeiros vídeos da série [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) no YouTube. (**Nota dos tradutores**: o vídeo está em inglês, mas você pode ativar as legendas ocultas e escolher o idioma português).

Existem muitas bibliotecas para testes ou <i>test runners</i> disponíveis para JavaScript. Neste curso, nós vamos utilizar uma biblioteca de testes desenvolvida e usada internamente pelo Facebook, chamada [jest](https://jestjs.io/), que se assemelha à antiga principal biblioteca de testes JavaScript [Mocha](https://mochajs.org/).

Jest é uma escolha natural para este curso, pois trabalha bem com tests de backend, e brilha quando chega o momento de testar aplicações React.

> <i>**Usuários de Windows:**</i> Jest pode não funcionar se o diretório do projeto estiver em um caminho com espaço no nome.

Já que os testes somente são executados durante a etapa de desenvolvimento da aplicação, iremos instalar o <i>jest</i> como uma dependência de desenvolvimento:

```bash
npm install --save-dev jest
```

Vamos definir um script para os testes com o comando <i>npm script _test_</i> que servirá para executar os testes com o Jest e relatar a execução em um estilo <i>verboso</i>:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "jest --verbose" // highlight-line
  },
  //...
}
```

O Jest requer a especificação de que o ambiente de execução é o Node. Isso pode ser feito adicionando as seguintes linhas ao final do arquivo <i>package.json</i>:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Vamos criar um diretório separado, chamado de <i>tests</i>, e nele vamos criar um novo arquivo chamado <i>reverse.test.js</i> contendo o seguinte:

```js
const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})
```

A configuração do ESLint que adicionamos ao projeto na parte anterior está reclamando sobre os comandos _test_ e _expect_ em nosso arquivo de teste, já que a configuração não permite <i>globals</i>. Vamos nos livrar disso adicionando <i>"jest": true</i> na propriedade <i>env</i> do arquivo <i>.eslintrc.js</i>.

```js
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true, // highlight-line
  },
  // ...
}
```

Na primeira linha, o código de teste importa a função que será testada e a atribui a uma variável chamada _reverse_:

```js
const reverse = require('../utils/for_testing').reverse
```

Testes individuais são definidos com a função _test_. O primeiro parâmetro desta função é a descrição do teste como uma string. O segundo parâmetro, é a <i>função</i> que define a funcionalidade para o caso de teste. A funcionalidade para o segundo caso de teste é a seguinte:

```js
() => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
}
```

Primeiro, nós executamos o código que será testado, o que significa que geraremos a string reversa de <i>react</i>. Após, verificamos o resultado com a função [expect](https://jestjs.io/docs/expect#expectvalue). Expect envolve o resultado em um objeto que suporta uma coleção de funções de <i>comparadores (matcher)</i>, que podem ser usadas durante a checagem de resultados. Já que neste caso de teste nós estamos comparando duas strings, podemos usar o matcher [toBe](https://jestjs.io/docs/expect#tobevalue). (**Nota dos tradutores**: No contexto de testes em programação, um "matcher" seria um método que realiza uma comparação entre valores esperados e valores obtidos durante a execução dos testes, com o objetivo de verificar se o comportamento do código está correto).

Como esperado, todos os testes passaram:

![terminal output from npm test](../../images/4/1x.png)

Por padrão, o Jest espera que os nomes dos arquivos de teste contenham  <i>.test</i>. Neste curso, seguiremos a convenção de nomes em nossos arquivos de teste com a extensão <i>.test.js</i>.

Jest possui excelentes mensagens de erro. Vamos quebrar o teste para demonstrar isso:

```js
test('palindrome of react', () => {
  const result = reverse('react')

  expect(result).toBe('tkaer')
})
```

Executando o teste acima, resultará na seguinte mensagem de erro:

![terminal output shows failure from npm test](../../images/4/2x.png)

Vamos adicionar alguns poucos testes para a função _average_, em um novo arquivo <i>tests/average.test.js</i>.

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```

O teste revela que a função não funciona corretamente com um array vazio (isso se deve ao fato da divisão por zero no JavaScript resultar em <i>NaN</i>):

![terminal output showing empty array fails with jest](../../images/4/3.png)

Ajustar a função é fácil:

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```

Se o length (largura) do array é 0, então retorna 0, em todos os outros casos, usamos o método _reduce_ para calcular a média.

Existem algumas pequenas coisas para observar sobre os testes que escrevemos. Definimos um bloco <i>describe</i> em volta dos testes que recebe o nome _average_:

```js
describe('average', () => {
  // tests
})
```

Os blocos de descrição (describe blocks) são utilizados para agrupar testes em uma coleção lógica. A saída do teste no Jest também usa o nome do bloco de descrição:

![screenshot of npm test showing describe blocks](../../images/4/4x.png)

Como veremos mais tarde, os blocos <i>describe</i> são necessários quando queremos executar alguma configuração compartilhada ou operações de encerramento (teardown) para um grupo de testes.

Outra coisa a se observar é que escrevemos testes de maneira compacta, sem atribuir a saída da função testada a uma variável:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">

### Exercícios 4.3.-4.7.

Vamos criar uma coleção de funções auxiliares que ajudarão a lidar com a lista de blogs. Crie as funções no arquivo chamado <i>utils/list_helper.js</i>. Escreva seus testes em arquivos nomeados de forma apropriada dentro do diretório <i>tests</i>.

#### 4.3: funções auxiliares e testes unitários, passo 1

Primeiro, defina uma função _dummy_ que recebe um array de posts de blog como parâmetro e sempre retorna o valor 1. O conteúdo do arquivo <i>list_helper.js</i> neste momento deve ser o seguinte:

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Verifique se sua configuração de teste funciona com o seguinte teste:

```js
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
```

#### 4.4: funções auxiliares e testes unitários, passo 2

Defina uma nova função _totalLikes_ que recebe uma lista de posts de blog como parâmetro. A função retorna o total da soma de <i>likes</i> em todos os posts.

Escreva os testes apropriados para a função. É recomendado colocar os testes dentro de um bloco <i>describe</i> para que a saída do relatório de testes seja agrupada de forma eficiente:

![npm test passing for list_helper_test](../../images/4/5.png)

Definir inputs para testar as funções pode ser feito desta forma:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

Se definir seus próprios inputs para testes for muito trabalhoso, você pode usar uma lista pronta [aqui](https://raw.githubusercontent.com/fullstack-hy2020/misc/master/blogs_for_test.md).

Você vai enfrentar problemas ao escrever testes. Lembre-se das coisas que aprendemos sobre [depuração](/ptbr/part3/salvando_dados_no_mongo_db#depurando-aplicacoes-node) na parte 3. Você pode imprimir coisas no console com _console.log_ mesmo durante a execução de testes. É possível até mesmo utilizar o depurador (debugger) enquanto estiver rodando os testes, veja como fazer isso [aqui](https://jestjs.io/docs/en/troubleshooting).

**Obs.::** se algum teste estiver falhando, então é recomendado executar somente este teste enquanto você estiver resolvendo o problema. Você pode executar um único teste com o método [only](https://jestjs.io/docs/api#testonlyname-fn-timeout).

Uma outra forma de executar um único teste (ou um bloco <i>describe</i>) é especificar o nome do teste que será executado com a flag [-t](https://jestjs.io/docs/en/cli.html):

```js
npm test -- -t 'when list has only one blog, equals the likes of that'
```

#### 4.5*: funções auxiliares e testes unitários, passo 3 

Crie uma nova função _favoriteBlog_ que recebe uma lista de blogs como parâmetro. A função descobre o blog com mais likes. Se acaso houver empate, é suficiente retornar apenas um deles.

O retorno da função pode estar no seguinte formato:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**Obs.:** quando estiver comparando objetos, o método [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) provavelmente será o que você deverá usar, já que o método [toBe](https://jestjs.io/docs/en/expect#tobevalue) tenta verificar se os dois valores são o mesmo valor, e não apenas se eles possuem as mesmas propriedades.

Escreva os testes para este exercício dentro de um novo bloco <i>describe</i>. Faça o mesmo para os demais exercícios.

#### 4.6*: funções auxiliares e testes unitários, passo 4

Esse e o próximo exercício são um pouco mais desafiadores. Terminar esses dois exercício não é um requisito para avançar pelo material do curso, então pode ser uma boa ideia retornar a estes exercícios quando você passar pelo material desta parte completamente.

A conclusão deste exercício pode se dá sem o uso de bibliotecas adicionais. No entanto, esse exercício é uma grande oportunidade para aprender a utilizar a biblioteca [Lodash](https://lodash.com/).

Crie uma função chamada _mostBlogs_ que recebe um array de blogs como parâmetro. A função retorna o <i>author</i> (autor) com o maior número de blogs. O retorno também deverá conter a quantidade de blogs que este autor possui:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

Se houver empate, é suficiente retornar apenas um dos autores.

#### 4.7*: funções auxiliares e testes unitários, passo 5

Crie uma função _mostLikes_ que recebe um array de blogs como parâmetro. A função retorna o autor cujos posts têm a maior quantidade de likes. O valor retornado também deve conter o número total de likes que o autor recebeu:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

Se houver empate, é suficiente mostrar qualquer um deles.

</div>
