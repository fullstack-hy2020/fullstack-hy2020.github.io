---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: ptbr
---

<div class="content">

Antes de começar esta nova parte, vamos revisar alguns dos tópicos que, ano passado, se provaram difíceis para alguns estudantes.

### console.log

*** Qual é a diferença entre um programador de JavaScript experiente e um iniciante? O experiente usa o console.log 10, 100 vezes mais. ***

Paradoxalmente, isso parece ser verdade, mesmo que um programador iniciante precise do <i>console.log</i> (ou de qualquer outro método de depuração) mais do que um experiente.

Quando algo não funciona, não tente adivinhar o que está errado. Em vez disso, faça o log ou use outra forma de depuração.

**Obs.:** Como explicado na Parte 1, ao usar o comando _console.log_ para depuração, não concatene coisas "do jeito Java" com o sinal de adição (+). Em vez de escrever

```js
console.log('valor de props é ' + props)
```

separe os valores a serem impressos com uma vírgula:

```js
console.log('valor de props é', props)
```

Se você concatenar um objeto com uma string e fazer o registro (log) no console (como demonstrado em nosso primeiro exemplo), o resultado será bem inútil:

```js
valor de props é [object Object]
```

Pelo contrário, quando você passa objetos como argumentos distintos separados por vírgulas para o _console.log_, como no nosso segundo exemplo acima, o conteúdo do objeto é impresso no console do desenvolvedor como strings que são informativas.
Se necessário, leia mais sobre [depuração de aplicações React](/ptbr/part1/um_estado_mais_complexo_e_depuracao_de_aplicacoes_react#depuracao-de-aplicacoes-react).

### Dica: Atalhos (Snippets) do Visual Studio Code

Com o Visual Studio Code, é fácil criar "snippets", ou seja, "atalhos" para gerar rapidamente porções de código que são reutilizadas diversas vezes, assim como o "sout" no Netbeans.

As instruções para criar atalhos podem ser encontradas [aqui](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

Atalhos úteis pré-prontos também podem ser encontrados como plugins do VS Code, no [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).

O atalho mais importante é o do comando <em>console.log()</em>, por exemplo, <em>clog</em>. Ele pode ser criado assim: 

```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Registra saída no console"
  }
}
```

Depurar seu código usando _console.log()_ é algo tão trivial que o Visual Studio Code já tem esse atalho embutido. Para usá-lo, digite _log_ e aperte Tab para autocompletar. Extensões do atalho _console.log()_ mais completas podem ser encontradas no [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).

### Arrays em JavaScript

A partir daqui, usaremos os operadores de programação funcional do [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (matriz) JavaScript, como _find_, _filter_ e _map_ o tempo todo.

Se operar arrays com operadores funcionais parecer estranho para você, vale a pena assistir pelo menos os primeiros três vídeos da série [Programação Funcional em JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) no YouTube:

- [Funções de ordem superior](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Básico do método Reduce](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Revisão sobre Gerenciadores de Evento

Baseado no curso do ano passado, o gerenciamento de eventos provou ser algo difícil. 

Vale a pena ler o capítulo de revisão no final da parte anterior — [Revisão sobre Gerenciamento de Eventos](/ptbr/part1/um_estado_mais_complexo_e_depuracao_de_aplicacoes_react#revisao-sobre-gerenciamento-de-eventos) — caso ainda ache que precise estudar mais sobre o assunto.

A passagem de gerenciadores de eventos para os componentes-filho do componente <i>App</i> levantou algumas questões. Uma pequena revisão sobre o tópico pode ser encontrada [aqui](/ptbr/part1/um_estado_mais_complexo_e_depuracao_de_aplicacoes_react#passando-gerenciadores-de-evento-para-componentes-filho).

### Renderização de Coleções

<i>**Nota dos tradutores:** A partir deste momento, os códigos utilizados como exemplo permanecerão no idioma original (inglês), visto que é disponibilizado ao final de cada sessão o repositório onde o código-exemplo pode ser encontrado na íntegra. É muito provável que o estudante se confunda caso os nomes de variáveis, funções, componentes, etc estejam em português, dado que estaria diferente do código disponibilizado no repositório do GitHub, que está em inglês.</i>

Faremos neste momento a lógica da aplicação do lado do cliente (navegador), ou o "front-end", em React, para uma aplicação semelhante à aplicação de exemplo da [Parte 0](/ptbr/part0).

Comecemos com o seguinte (arquivo <i>App.js</i>):

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App
```

O arquivo <i>index.js</i> fica assim:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const notes = [


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

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
```

Cada nota contém seu conteúdo textual, um valor _booleano_ para marcar se a nota foi categorizada como importante ou não e também um <i>id</i> (identificador) único.

O exemplo acima funciona devido ao fato de haver exatamente três notas no array.

Uma única nota é renderizada acessando os objetos no array, referindo-se a um número de índice no "código de teste":

```js
<li>{notes[1].content}</li>
```

Isso, obviamente, não é algo prático. Podemos melhorar nosso código gerando elementos React a partir dos objetos do array usando a função [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (mapear).

```js
notes.map(note => <li>{note.content}</li>)
```

O resultado é um array de elementos <i>li</i>...

```js
[
  <li>HTML é fácil</li>,
  <li>O navegador só pode executar JavaScript</li>,
  <li>GET e POST são os métodos mais importantes do protocolo HTTP</li>,
]
```

... que então podem ser colocados dentro de tags <i>ul</i>:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

Como o código que gera as tags <i>li</i> é JavaScript, ele deve ser envolto em chaves no modelo JSX, assim como todo código JavaScript.

Também faremos com que o código fique mais legível separando a declaração da função de seta em várias linhas:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### O atributo "key" (chave)

Mesmo que a aplicação pareça estar funcionando, há um aviso no console:

![erro da propriedade de chave única no console](../../images/2/1a.png)

Como sugere a [página React](https://reactjs.org/docs/lists-and-keys.html#keys) vinculada na mensagem de erro, os itens da lista, ou seja, os elementos gerados pelo método _map_, devem ter cada qual um valor único que os permite serem identificados: um atributo chamado <i>key</i> (chave).

Vamos adicionar as keys:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}> // highlight-line
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

E então, a mensagem de erro desaparece.

React usa os atributos "key" (ou atributos-chave) dos objetos em um array para determinar como atualizar a visualização gerada por um componente quando o componente é re-renderizado. Leia mais sobre esse assunto na [documentação React](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### Map

Entender como funciona o método de array [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) é crucial para fazer o restante do curso.

A aplicação contém um array chamado _notes_:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
```

Vamos parar por um momento e examinar como o _map_ funciona.

Se o código a seguir for adicionado, digamos, ao final do arquivo:

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i> será impresso no console.
O método _map_ sempre cria um array novo, cujos elementos foram criados a partir dos elementos do array original por meio do <i>mapping</i> (mapeamento): usa-se a função fornecida como um parâmetro para o método _map_. 

A função é esta:

```js
note => note.id
```

Que, neste caso, é uma _arrow function_ escrita de forma compacta. A forma completa seria:

```js
(note) => {
  return note.id
}
```

A função recebe um objeto "note" como parâmetro e retorna o valor de seu campo <i>id</i>.

Se mudarmos a instrução para:

```js
const result = notes.map(note => note.content)
```

o resultado será um array contendo as notas.

Essa forma está bem parecida com o código React que usamos:

```js
notes.map(note =>
  <li key={note.id}>
    {note.content}
  </li>
)
```

o qual gera uma tag <i>li</i> contendo o conteúdo da nota de cada objeto de nota. 

Por conta do parâmetro da função passado para o método _map_ — 

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp;— ser usado para criar elementos de visualização, o valor da variável deve ser renderizado dentro de chaves. Tente ver o que acontece se as chaves forem removidas. 

O uso constante de chaves pode gerar algum desconforto no início, mas você se acostumará rapidamente com elas. O feedback visual em React é imediato.

### Antipadrão: Índices de Array como Keys

Poderíamos ter feito a mensagem de erro em nosso console desaparecer usando os índices do array como keys. Os índices podem ser recuperados passando um segundo parâmetro para a função de retorno do método _map_:

```js
notes.map((note, i) => ...)
```

Quando chamado desta forma, é atribuído ao _i_ o valor do índice da posição no array onde a nota reside.

Como tal, uma forma de definir a criação de linhas (_row_) sem gerar erros é esta:

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

Entretanto, **isso não é recomendado** visto que pode criar problemas indesejados mesmo se parecer estar funcionando bem.

Leia mais sobre isso neste [artigo](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Refatorando módulos

Vamos arrumar um pouco nosso código. Estamos interessados apenas no campo _notes_ das props, então vamos recuperá-lo diretamente usando [desestruturação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```js
const App = ({ notes }) => {//highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

Se você esqueceu o que significa desestruturação e como essa ferramenta funciona, por favor, revise a [seção sobre desestruturação](/ptbr/part1/estado_de_componente_e_gerenciadores_de_eventos#desestruturacao-destructuring).

Vamos separar a exibição de uma única nota em seu próprio componente <i>Note</i>: 

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Note que o atributo <i>key</i> agora deve ser definido para os componentes <i>Note</i>, e não para as tags <i>li</i> como antes. 

Uma aplicação React pode ser escrita inteiramente em um único arquivo, embora fazer isso não seja muito prático. O ideal é declarar cada componente em seu próprio arquivo como um <i>módulo ES6</i>.

Estamos utilizando módulos o tempo todo. As primeiras linhas do arquivo <i>index.js</i>:

```js
import ReactDOM from "react-dom/client"

import App from "./App"
```

[importam](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) dois módulos, habilitando-os a serem usados ​​nessa pasta. É importado o módulo <i>react-dom/client</i> para a variável _ReactDOM_ e o módulo que define o componente principal da aplicação é atribuído à variável _App_.

Vamos separar nosso componente <i>Note</i> em um módulo próprio.

Em aplicações menores, os componentes geralmente são colocados em uma pasta chamada <i>components</i>, que por sua vez é colocada dentro da pasta <i>src</i>. A convenção é nomear o arquivo com o nome do componente.

Agora, criaremos uma pasta chamada <i>components</i> para nossa aplicação e criaremos dentro dela um arquivo chamado <i>Note.js</i>.
O conteúdo do arquivo Note.js é o seguinte: 

```js
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

A última linha do código [exporta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) o módulo declarado, a variável <i>Note</i>.

Agora, o arquivo que está usando o componente — <i>App.js</i> — pode [importar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) o módulo: 

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

O componente exportado pelo módulo passa a ficar disponível para uso na variável <i>Note</i>, assim como antes.

Observe que ao importar nossos próprios componentes, sua localização deve ser dada <i>em relação ao arquivo importador</i>:

```js
'./components/Note'
```

O ponto — <i>.</i> — no começo se refere ao diretório atual, então a localização do módulo é um arquivo chamado <i>Note.js</i> no subdiretório de componentes do diretório atual. A extensão de arquivo _.js_ pode ser omitida.

Módulos têm muitas outras utilidades além de permitir que as declarações de componentes sejam separadas em suas próprias instâncias. Voltaremos a falar sobre eles mais tarde neste curso.

O código atual da aplicação pode ser encontrado [neste repositório GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).

Note que a branch <i>main</i> do repositório contém o código para uma versão posterior da aplicação. O código atual está na branch [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):

![captura de tela da branch do GitHub](../../images/2/2e.png)

Caso deseje clonar o projeto, execute o comando _npm install_ antes de iniciar a aplicação com _npm start_.

### Quando a Aplicação Quebra

Logo cedo em sua carreira em programação (e até mesmo após 30 anos de programação como esta pessoa que vos escreve), o que acontece com frequência é que a aplicação simplesmente quebra, completamente. Isso é ainda mais verídico quando se trata de linguagens dinamicamente tipadas, como JavaScript, onde o compilador não verifica o tipo do dado declarado. Por exemplo, variáveis de função ou valores de retorno.

Uma "explosão React" pode parecer assim, por exemplo:

![exemplo de erro em React](../../images/2/3b.png)

Nessas situações, sua melhor saída é utilizar o método <em>console.log</em>.

O pedaço de código que está causando a explosão é este: 

```js
const Course = ({ course }) => (
  // "Course" traduz-se como "Curso"
  // "Header" traduz-se como "Cabeçalho"
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```

Vamos nos aprofundar investigando a razão do problema adicionando algumas linhas de <em>console.log</em> ao código. Por conta do componente <i>App</i> ser a primeira entidade a ser renderizada, vale a pena colocar o primeiro <em>console.log</em> lá: 

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

Para ver a impressão no console, devemos rolar por toda a longa parede vermelha de erros até chegar lá em cima.

![impressão inicial do console](../../images/2/4b.png)

Quando se encontra alguma parte do código que está funcionando, é o momento exato para se aprofundar na impressão. Fica mais difícil de se imprimir no console se o componente foi declarado como uma única instrução ou uma função que não retorna nada.

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

O componente deve ser alterado para sua forma mais extensa, no qual poderemos adicionar a impressão desejada:

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Muitas vezes, a raiz do problema é que espera-se que as propriedades sejam de um tipo diferente, ou que sejam chamadas com um nome diferente do que realmente são, e a desestruturação falha como resultado. O problema começa a revelar-se quando a desestruturação é removida e vemos o que as <em>props</em> armazenam. 

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Se o problema ainda não foi resolvido, infelizmente não há muito o que fazer, a não ser continuar a busca por erros adicionando mais comandos _console.log_ ao seu código.

Adicionei este capítulo ao material após a resposta do modelo da próxima pergunta explodir completamente (devido as props estarem armazenando o tipo errado de dados), e precisei depurá-lo usando <em>console.log</em>.

### Juramento do Programador Web

Antes de fazer os exercícios, deixe-me lembrá-lo do que havia jurado no final da parte anterior.

Programar é difícil, e é por isso que eu usarei todos os meios possíveis para ser mais fácil:

- Eu manterei meu Console do navegador aberto o tempo todo;
- Eu vou progredir aos poucos, passo a passo;
- Eu escreverei muitas instruções _console.log_ para ter certeza de que estou entendendo como o código se comporta e para me ajudar a identificar os erros;
- Se meu código não funcionar, não escreverei mais nenhuma linha no código. Em vez disso, começarei a excluir o código até que funcione ou retornarei ao estado em que tudo ainda estava funcionando; e
- Quando eu pedir ajuda no canal do Discord ou Telegram do curso ou em outro lugar, formularei minhas perguntas de forma adequada. Veja [aqui](/ptbr/part0/informacoes_gerais#como-pedir-ajuda-no-discord-telegam) como pedir ajuda.

</div>

<div class="tasks">

<h3>Exercícios 2.1 a 2.5</h3>

Envie suas soluções aos exercícios dando "push" para seu repositório no GitHub e, em seguida, marque os exercícios concluídos na guia "my submissions" no [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Lembre-se: envie **todos** os exercícios de uma parte **de uma única vez**; isto é, envie todas as suas soluções de uma vez para seu repositório. Uma vez que você tenha enviado suas soluções para uma parte, **não é mais possível enviar mais exercícios para essa parte**.

<i> Alguns dos exercícios funcionam na mesma aplicação. Nestes casos, é suficiente enviar apenas a versão final da aplicação. Se desejar, você pode fazer um "commit" após cada exercício concluído, mas isso não é obrigatório.</i>

**AVISO**: "create-react-app" transformará automaticamente seu projeto em um repositório git, a menos que você crie sua aplicação dentro de um repositório git já existente. **Você muito provavelmente não quer que cada um de seus projetos seja um repositório separado**, então basta executar o comando _rm -rf .git_ na raiz de sua aplicação para aplicar as modificações.

**Obs.:** o conteúdo dos exercícios foram deixados no idioma original da tradução (inglês) por questões de conveniência, visto a revisão que os mantenedores do curso devem fazer no código enviado ao sistema de avaliação da Universidade de Helsinque. Desta forma, escreva suas aplicações utilizando os mesmos termos usados nas variáveis, componentes, etc que estão em inglês.

<h4>2.1: Course information — 6º passo</h4>

Vamos finalizar o código para que possamos renderizar os conteúdos do curso dos exercícios 1.1 a 1.5. Você pode começar com o código das respostas-modelo. As respostas-modelo da Parte 1 podem ser encontradas no [sistema de envio de exercícios]https://studies.cs.helsinki.fi/stats/courses/fullstackopen), clicando em <i>"my submissions"</i> em cima; vá até a linha correspondente à Parte 1 na coluna <i>"solutions"</i> e clique em <i>show</i>. Para ver a solução para o exercício <i>course info</i>, clique em _index.js_ abaixo de <i>kurssitiedot</i> ("kurssitiedot" significa "course info" ou "informações do curso").

**Note que se você copiar um projeto de um lugar para outro, é provável que terá de excluir o diretório <i>node\_modules</i> e instalar as dependências novamente com o comando _npm install_ antes de iniciar a aplicação.** Em geral, não é recomendado que você copie todo o conteúdo de um projeto e/ou adicione o diretório <i>node\_modules</i> ao sistema de controle de versão.

Vamos modificar o componente <i>App</i> desta maneira:

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
```

Crie um componente chamado <i>Course</i> que será responsável por formatar/exibir um único curso.

A estrutura do componente da aplicação pode ser a seguinte, por exemplo:

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

Desta forma, o componente <i>Course</i> conterá os componentes definidos na parte anterior, responsáveis por renderizar o nome do curso e suas partes.

O resultado da página pode ficar assim, por exemplo: 

![captura de tela de um app chamado half stack application](../../images/teht/8e.png)

Você ainda não precisa da soma do número de exercícios. 

A aplicação deve funcionar <i>independentemente do número de partes de um curso</i>, então certifique-se de que a aplicação funcione se você adicionar ou remover partes de um curso. 

Certifique-se de que o console não esteja mostrando erros!

<h4>2.2: Course information — 7º passo</h4>

Mostre também a soma (ou total) dos exercícios do curso.

![recurso de soma de exercícios](../../images/teht/9e.png)

<h4>2.3*: Course information — 8º passo</h4>

Se você ainda não o fez, calcule a soma dos exercícios com o método de array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) (reduzir).

**Dica I:** quando seu código fica assim:

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```
  
e ao mesmo tempo que não funciona, vale a pena usar o <i>console.log</i>, o que requer que a função de seta seja escrita em sua forma mais longa:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```
 
**Não está funcionando? :** Pesquise na internet como `reduce` é usado em um **Array de Objetos**.

**Dica II:** Existe um [plugin para o VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer) que altera automaticamente as _arrow functions_ da forma curta para sua forma mais longa e vice-versa. 

![vscode sample suggestion for arrow function](../../images/2/5b.png)

<h4>2.4: Course information — 9º passo</h4>

Vamos estender nossa aplicação para que permita um número <i>arbitrário</i> de cursos:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

A aplicação pode, por exemplo, ficar assim: 

![recurso que mostra o número arbitrário de cursos](../../images/teht/10e.png)

<h4>2.5: um módulo separado</h4>

Crie o componente <i>Course</i> como um módulo separado, que é importado pelo componente <i>App</i>. Você pode incluir todos os subcomponentes do curso no mesmo módulo (Course).

</div>
