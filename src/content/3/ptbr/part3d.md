---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: ptbr
---

<div class="content">

Existem restrições que normalmente queremos aplicar aos dados armazenados no banco de dados da nossa aplicação. Nossa aplicação não deve aceitar notas que tenham uma propriedade <i>content</i> em falta ou vazia. A validade da nota é verificada no gerenciador de rota:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

Se a nota não tiver a propriedade <i>content</i>, respondemos à requisição com o código de status <i>400 bad request</i> (400 requisição inválida).

Uma maneira mais inteligente de validar o formato dos dados antes de serem armazenados no banco de dados é usar a funcionalidade de [validação](https://mongoosejs.com/docs/validation.html) (validation) disponível no Mongoose.

Podemos definir regras de validação específicas para cada campo no esquema:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

O campo <i>content</i> agora deve ter pelo menos cinco caracteres de comprimento e é definido como obrigatório, o que significa que não pode estar faltando. Não adicionamos nenhuma restrição ao campo <i>important</i>, portanto, sua definição no esquema não mudou.

Os validadores <i>minLength</i> (grosso modo, "comprimentoMínimo") e <i>required</i> são [integrados](https://mongoosejs.com/docs/validation.html#built-in-validators) (built-in) e fornecidos pelo Mongoose. A funcionalidade de [validação personalizada](https://mongoosejs.com/docs/validation.html#custom-validators) do Mongoose nos permite criar novos validadores se nenhum dos integrados atender às nossas necessidades.

Se tentarmos armazenar no banco de dados um objeto que viola uma das restrições, a operação lançará uma exceção. Vamos alterar nosso gerenciador para criar uma nova nota para que ele passe quaisquer exceções potenciais para o middleware gerenciador de erros:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```

Vamos expandir o gerenciador de erros para lidar com os erros de validação:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

Quando a validação de um objeto falha, retornamos a seguinte mensagem de erro padrão do Mongoose:

![mensagem de erro sendo exibida no postman](../../images/3/50.png)

Percebemos que o backend tem agora um problema: as validações não são executadas quando uma nota é editada.
A [documentação](https://github.com/blakehaswell/mongoose-unique-validator#find--updates) explica qual é o problema: as validações não são executadas por padrão quando <i>findOneAndUpdate</i> é executado.

É fácil a correção. Também vamos reformular um pouco o código da rota:

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body // highlight-line

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, // highlight-line
    { new: true, runValidators: true, context: 'query' } // highlight-line
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

### Implantando o backend do banco de dados para produção

A aplicação deve funcionar quase como está no Fly.io/Render. Não precisamos gerar um novo build de produção do frontend, uma vez que as alterações até agora ocorreram apenas no backend.

As variáveis de ambiente definidas em <i>dotenv</i> só serão usadas quando o backend não estiver em <i>modo de produção</i> (production mode), ou seja, no Fly.io ou Render.

Para colocar em produção, temos que definir a URL do banco de dados no serviço que está hospedando nossa aplicação.

Isso é feito no Fly.io com _fly secrets set_:

```
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Quando a aplicação está sendo desenvolvida, é mais do que provável que algo falhe. Por exemplo, quando implantei minha aplicação pela primeira vez com o banco de dados, não foi exibida uma única nota sequer:

![nenhuma nota sendo exibida na aplicação online](../../images/3/fly-problem1.png)

O console do navegador na guia Rede revelou que a busca pelas notas não teve sucesso — a requisição simplesmente permaneceu por muito tempo no estado _pendente_ (pending) até falhar e exibir o código de status 502.

O console do navegador tem que estar aberto <i>o tempo todo!</i>

Também é vital acompanhar continuamente os logs do servidor. O problema ficou óbvio quando os logs foram abertos com _fly logs_:

![logs da aplicação online no Fly.io](../../images/3/fly-problem3.png)

A URL do banco de dados estava _undefined_ (indefinida), então o comando *fly secrets set MONGODB\_URI* foi esquecido.

Ao usar o Render, a URL do banco de dados é fornecida definindo a variável de ambiente adequada no painel:

![opção da variáveis de ambiente no painel do Render](../../images/3/render-env.png)

O Painel do Render mostra os logs do servidor:

![logs da aplicação online no Render](../../images/3/r7.png)

É possível encontrar o código da nossa aplicação atual na íntegra na branch <i>part3-5</i> [neste repositório do GitHub](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Exercícios 3.19 a 3.21

#### 3.19*: Phonebook database — 7º passo

Expanda a validação para que o nome armazenado no banco de dados tenha pelo menos três caracteres.

Expanda o frontend para que seja exibido algum tipo de mensagem de erro quando ocorrer um erro de validação. O gerenciamento de erros pode ser implementado adicionando um bloco <em>catch</em> como mostrado abaixo:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // esta é a maneira de acessar a mensagem de erro
      console.log(error.response.data.error)
    })
```

Você pode exibir a mensagem de erro padrão retornada pelo Mongoose, mesmo que essas mensagens não sejam tão legíveis:

![captura de tela da lista telefônica mostrando falha na validação de uma pessoa](../../images/3/56e.png)

**Obs.:** Os validadores do mongoose são desativados por padrão nas operações de atualização. [Leia a documentação](https://mongoosejs.com/docs/validation.html) para saber como ativá-los.

#### 3.20*: Phonebook database — 8º passo

Aplique a validação à sua aplicação da lista telefônica, na qual garantirá que os números de telefone estejam no formato correto. Um número de telefone deve:

- Ter comprimento de 8 ou mais caracteres;
- Se for composto por duas partes que são separadas por "-" (hífen), a primeira parte deve ter dois ou três números e a segunda parte também é completada com o restante do número telefônico:
  - Ex.: 09-1234556 e 040-22334455 são números válidos;
  - Ex.: 1234556, 1-22334455 e 10-22-334455 são números inválidos.

Use um [Validador Personalizado](https://mongoosejs.com/docs/validation.html#custom-validators) (Custom validator) para implementar a segunda parte da validação.

Se uma requisição HTTP POST tentar adicionar uma pessoa com um número de telefone inválido, o servidor deve responder com um código de status apropriado e uma mensagem de erro.

#### 3.21 Implantação do backend do banco de dados para produção

Gere uma nova versão "full stack" da aplicação criando um novo build de produção do frontend, assim copiando-o ao repositório do backend. Verifique se tudo funciona localmente acessando a aplicação inteira no endereço <http://localhost:3001/>.

Envie a versão mais recente para o Fly.io/Render e verifique se tudo funciona lá também.

**NOTA:** você deve implantar o BACKEND no serviço em nuvem. Se estiver usando o Fly.io, os comandos devem ser executados no diretório raiz do backend (ou seja, no mesmo diretório onde está o package.json do backend). Caso esteja usando o Render, o backend deve estar na raiz do seu repositório.

Você NÃO deve implantar o frontend diretamente em nenhuma etapa desta parte. Somente o repositório do backend que é implantado nesta parte, nada mais.

</div>

<div class="content">

### Lint

Antes de prosseguirmos para a próxima parte, vamos dar uma olhada em uma ferramenta importante chamada [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). A Wikipedia diz o seguinte sobre o lint:

> <i>De forma genérica, lint ou um linter é qualquer ferramenta que detecta e sinaliza erros em linguagens de programação, incluindo erros de estilo. O termo "<i>lint-like behavior</i>" ("de um jeito lint") é às vezes aplicado ao processo de sinalização do uso suspeito da linguagem. Ferramentas semelhantes ao lint geralmente realizam análise estática do código fonte.</i>

Em linguagens compiladas de tipagem estática, como Java, IDEs (Integrated Development Environment [Ambiente de Desenvolvimento Integrado]) como o NetBeans podem apontar erros no código, inclusive aqueles que são mais do que apenas erros de compilação. Ferramentas adicionais que fazem [análise estática](https://en.wikipedia.org/wiki/Static_program_analysis) (static analysis), como [checkstyle](https://checkstyle.sourceforge.io), podem ser usadas para expandir as capacidades da IDE e apontar também problemas relacionados ao estilo, como a indentação (indentation).

No universo JavaScript, a ferramenta líder atual para análise estática, também conhecida como "linting", é o [ESlint](https://eslint.org/).

Vamos instalar o ESlint como uma dependência de desenvolvimento no projeto backend com o comando:

```bash
npm install eslint --save-dev
```

Após isso, podemos inicializar uma configuração padrão do ESlint com o comando:

```bash
npx eslint --init
```

Responderemos à todas as perguntas:

![saída do terminal proveniente do comando 'eslint --init'](../../images/3/52new.png)

A configuração será salva no arquivo _.eslintrc.js_:

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true // highlight-line
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
```

Vamos mudar imediatamente a regra relacionada à indentação, para que o nível de indentação (ou nível de recuo) seja de dois espaços.

```js
"indent": [
    "error",
    2
],
```

Inspeciona-se e valida-se um arquivo como _index.js_ da seguinte maneira:

```bash
npx eslint index.js
```

Recomenda-se criar um  _npm script_ separado para a análise estática (linting):

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ." // highlight-line
  },
  // ...
}
```

Agora o comando _npm run lint_ verificará todos os arquivos do projeto.

Também são verificados os arquivos do diretório <em>build</em> quando o comando é executado. Não queremos que isso aconteça; podemos impedir essa análise criando um arquivo [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) na raiz do projeto adicionando o seguinte:

```bash
build
```

Isso faz com que o diretório inteiro <em>build</em> não seja verificado pelo ESlint.

O lint tem bastante a dizer sobre o nosso código:

![saída de erros ESlint no terminal](../../images/3/53ea.png)

Mas não vamos corrigir esses problemas ainda.

Uma melhor forma de executar o linter a partir da linha de comando é configurar um <i>eslint-plugin</i> no editor, que executará o linter continuamente. Assim que usar o plugin, você verá erros no seu código imediatamente. É possível encontrar mais informações sobre o plugin Visual Studio ESLint [aqui](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

O plugin ESlint do VS Code sublinhará as violações de estilo com uma linha vermelha:

![captura de tela do plugin do vscode ESlint exibindo erros](../../images/3/54a.png)

Isso torna os erros fáceis de detectar e corrigir imediatamente.

O ESlint tem uma vasta variedade de [regras](https://eslint.org/docs/rules/), das quais são fáceis de usar por meio do arquivo <i>.eslintrc.js</i>.

Vamos adicionar a regra [eqeqeq](https://eslint.org/docs/rules/eqeqeq) que nos alerta se a igualdade é verificada com algo que não seja o operador de igualdade estrita. A regra é adicionada sob o campo <i>rules</i> no arquivo de configuração.

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

Já que estamos configurando essa parte, vamos fazer algumas outras mudanças nas regras.

Vamos evitar [espaços à direita (ou no final da cadeia)](https://eslint.org/docs/rules/no-trailing-spaces) (trailing spaces) ao final das linhas, exigir que [sempre haja um espaço antes e depois das chaves](https://eslint.org/docs/rules/object-curly-spacing) e também exigir um uso consistente de espaços em branco nos parâmetros de funções de seta.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
```

Nossa configuração padrão usa uma série de regras pré-determinadas da regra <i>eslint:recommended</i>:

```bash
'extends': 'eslint:recommended',
```

Isso inclui uma regra que avisa sobre comandos _console.log_. Para [desabilitar](https://eslint.org/docs/user-guide/configuring#configuring-rules) uma regra, é necessário que seu "valor" seja definido como 0 no arquivo de configuração. Vamos fazer isso para a regra <i>no-console</i> por enquanto.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ],
    'no-console': 0 // highlight-line
  },
}
```

**Obs.:** quando se faz alterações no arquivo <i>.eslintrc.js</i>, é recomendado executar o linter a partir da linha de comando. Isso irá verificar se o arquivo de configuração está formatado corretamente:

![saída do terminal como resultado do comando 'npm run lint'](../../images/3/55.png)

O plugin do lint irá se comportar incorretamente se houver algo errado em seu arquivo de configuração.

Muitas empresas definem padrões de código que são aplicados em toda a organização por meio do arquivo de configuração do ESlint. Não é recomendado reinventar a roda toda vez, e pode ser até uma boa ideia adotar uma configuração pré-pronta do projeto de outra pessoa no seu. Muitos projetos adotaram recentemente o [guia de estilo Javascript](https://github.com/airbnb/javascript) da Airbnb, adotando a [configuração do ESlint da empresa](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).

É possível encontrar o código da nossa aplicação atual na íntegra na branch <i>part3-6</i> [neste repositório do GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).
</div>

<div class="tasks">

### Exercício 3.22

#### 3.22: Configuração do Lint

Adicione o ESlint à sua aplicação e corrija todos os avisos.

Este foi o último exercício para esta parte do curso, e é hora de enviar seu código para o GitHub e marcar todos os seus exercícios concluídos na guia "my submissions" do [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
