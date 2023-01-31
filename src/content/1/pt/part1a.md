---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: pt
---

<div class="content">

Agora, começaremos a nos familiarizar com provavelmente o tópico mais importante deste curso, a biblioteca [React](https://reactjs.org/). Vamos começar criando uma aplicação React simples, conhecendo os conceitos-chave de React.

A maneira mais simples de começar é usando uma ferramenta chamada [create-react-app](https://github.com/facebook/create-react-app). É possível (mas não necessário) instalar o <i>create-react-app</i> na sua máquina se a ferramenta <i>npm</i> instalada junto com o Node tiver na versão <i>5.3</i>, pelo menos.

Vamos criar uma aplicação chamada <i>part1</i> e navegar até o seu diretório.

```bash
npx create-react-app part1
cd part1
```

A aplicação é executada da seguinte forma:

```bash
npm start
```

Por padrão, a aplicação é executada no localhost na porta 3000 com o endereço <http://localhost:3000>

Seu navegador padrão deve ser automaticamente aberto. Abra **imediatamente** o console do navegador. Além disso, abra um editor de texto para que você possa ver o código e a página da web ao mesmo tempo na tela:

![código e navegador lado a lado](../../images/1/1e.png)

O código da aplicação reside na pasta <i>src</i>. Vamos simplificar o código padrão para que o conteúdo do arquivo index.js pareça assim:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

e o arquivo <i>App.js</i> parece assim:

```js
const App = () => (
  <div>
    <p>Olá, mundo!</p>
  </div>
)

export default App
```

Os arquivos <i>App.css</i>, <i>App.test.js</i>, <i>index.css</i>, <i>logo.svg</i>, <i>setupTests.js</i> e <i>reportWebVitals.js</i> podem ser excluídos, pois não são necessários em nossa aplicação neste momento.

### Componente

O arquivo <i>App.js</i> agora define um componente [React](https://reactjs.org/docs/components-and-props.html) com o nome <i>App</i>. O comando na linha final do arquivo <i>index.js</i>

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

renderiza seu conteúdo dentro do elemento <i>div</i>, definido no arquivo <i>public/index.html</i>, com o valor de <i>id</i> 'root'.

Por padrão, o arquivo <i>public/index.html</i> não contém nenhum marcador HTML que é visível para nós no navegador:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      conteúdo não mostrado ...
  </head>
  <body>
    <noscript>Você precisa habilitar o JavaScript para executar esta aplicação.</noscript>
    <div id="root"></div>
  </body>
</html>
```

Você pode até tentar adicionar algum HTML ao arquivo, no entanto, ao usar React, todo o conteúdo que precisa ser renderizado é geralmente definido como "componentes React".

Vamos dar uma olhada mais de perto no código que define o componente:

```js
const App = () => (
  <div>
    <p>Olá, mundo!</p>
  </div>
)
```

Como você provavelmente adivinhou, o componente será renderizado como uma tag <i>div</i>, que envolve uma tag <i>p</i> contendo o texto <i>"Olá, mundo!"</i>.

Técnicamente, o componente é definido como uma função JavaScript. O código a seguir também é uma função (que não recebe nenhum parâmetro):

```js
() => (
  <div>
    <p>Olá, mundo!</p>
  </div>
)
```

A função é, então, atribuída a uma (variável) constante <i>App</i>:

```js
const App = ...
```

Existem algumas maneiras de definir funções em JavaScript. Aqui usaremos as [funções de seta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (arrow functions), que são descritas em uma versão mais recente do JavaScript conhecida como [ECMAScript 6](http://es6-features.org/#Constants), também chamada de ES6.

Por conta da função consistir em apenas uma única expressão, usamos uma notação abreviada, que representa este trecho de código:

```js
const App = () => {
  return (
    <div>
      <p>Olá, mundo!</p>
    </div>
  )
}
```

Em outras palavras, a função retorna o valor da expressão.

A função que define o componente pode conter qualquer tipo de código JavaScript. Modifique seu componente da seguinte maneira:

```js
const App = () => {
  console.log('Olá do componente!')
  return (
    <div>
      <p>Olá, mundo!</p>
    </div>
  )
}

export default App
```

E observe o que acontece no console do navegador:

![](../../images/1/30.png)

A primeira regra do desenvolvimento web front-end:

> <i> Mantenha o console aberto o tempo todo.</i>

Vamos repetir juntos: <i>Prometo manter o console aberto o tempo todo</i> durante este curso e pelo resto da minha vida quando estiver fazendo desenvolvimento web.

Também é possível renderizar conteúdo dinâmico dentro de um componente.

Modifique o componente da seguinte maneira:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  console.log(now, a+b)

  return (
    <div>
      <p>Olá, mundo! Hoje é {now.toString()}</p>
      <p>
        {a} mais {b} é {a + b}
      </p>
    </div>
  )
}
```

Qualquer código JavaScript dentro das chaves é avaliado e o resultado desta avaliação é incorporado no lugar definido no HTML produzido pelo componente.

Note que você não deve remover a linha no final do componente:

```js
export default App
```

A exportação não é mostrada em a maioria dos exemplos do material do curso. Sem a exportação, o componente e a aplicação inteira desmoronam.

Você se lembrou da sua promessa de deixar o console aberto? O que foi mostrado?

### JSX

Parece que os componentes React estão retornando marcações HTML. No entanto, não é esse o caso. A maior parte da estrutura de componentes React é escrita usando [JSX](https://reactjs.org/docs/introducing-jsx.html) (JavaScript Syntax Extension [Extensão de Sintaxe para JavaScript]). Embora o JSX pareça com HTML, estamos lidando com uma maneira de escrever JavaScript. Por baixo dos panos, o JSX retornado por componentes React é compilado em JavaScript.

Depois da compilação, nossa aplicação fica assim:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Olá, mundo! Hoje é ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' mais ', b, ' é ', a + b
    )
  )
}
```

A compilação é gerenciada pelo [Babel](https://babeljs.io/repl/). Projetos criados com *create-react-app* são configurados para compilar automaticamente. Vamos aprender mais sobre esse tópico na [parte 7](/pt/part7) deste curso.

Também é possível escrever React como "JavaScript puro" sem usar JSX. Embora não seja recomendável.

Na prática, o JSX é muito parecido com HTML com a distinção de que, com o JSX, é possível inserir facilmente conteúdo dinâmico escrevendo JavaScript adequado dentro de chaves. A idéia do JSX é bastante semelhante a muitas linguagens de modelos, como Thymeleaf usado junto com Java Spring, que são usadas em servidores.

JSX é "semelhante a [XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)" (Extensible Markup Language [Linguagem de Marcação Extensível]), o que significa que todas as tags precisam ser fechadas. Por exemplo, uma nova linha é um elemento vazio, que em HTML pode ser escrito da seguinte maneira:

```html
<br>
```

mas ao escrever em JSX, a tag precisa ser fechada:

```html
<br />
```

### Múltiplos componentes

Vamos modificar o arquivo <i>App.js</i> da seguinte forma (N.B.: a exportação na parte inferior é omitida nestes <i>exemplos</i>, agora e no futuro. Ela ainda é necessária para que o código funcione):

```js
// começo destacado
const Hello = () => {
  return (
    <div>
      <p>Olá, mundo!</p>
    </div>
  )
}
// final destacado

const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello /> // linha destacada
    </div>
  )
}
```

Nós definimos um novo componente <i>Hello</i> e o usamos dentro do componente <i>App</i>. Naturalmente, um componente pode ser usado várias vezes:

```js
const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello />
      // começo destacado
      <Hello />
      <Hello />
      // final destacado
    </div>
  )
}
```

Escrever componentes em React é fácil, e com combinação de componentes, mesmo uma aplicação mais complexa pode ser relativamente mantível. De fato, uma das filosofias fundamentais do React é criar aplicações a partir de muitos componentes que são especializados e reutilizáveis.

Outra forte convenção é a ideia de um componente <i>root</i> chamado <i>App</i> no topo da árvore de componentes da aplicação. No entanto, como aprenderemos na [parte 6](/pt/part6), há situações em que o componente <i>App</i> não é exatamente a raiz (root), mas é envolto em um componente utilitário apropriado.

### props: passando dados para componentes

É possível passar dados para componentes usando as chamadas [props](https://reactjs.org/docs/components-and-props.html) (properties [ propriedades ]).

Vamos modificar o componente <i>Hello</i> da seguinte forma:

```js
const Hello = (props) => { // linha destacada
  return (
    <div>
      <p>Olá {props.name}</p> // linha destacada
    </div>
  )
}
```

Agora, a função que define o componente tem um parâmetro "props". Como argumento, o parâmetro recebe um objeto, que possui campos correspondentes a todas as "props" que o usuário do componente define.

As props são definidas da seguinte forma:

```js
const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello name='George' /> // linha destacada
      <Hello name='Daisy' /> // linha destacada
    </div>
  )
}
```

É possível haver um número arbitrário de props e seus valores podem ser strings "hard-coded" (dados ou estruturas em um código que não podem ser alterados sem modificar manualmente o programa) ou resultados de expressões JavaScript. Se o valor da prop é obtido usando JavaScript, ele deve ser envolvido com chaves.

Vamos modificar o código para que o componente <i>Hello</i> use duas props:

```js
const Hello = (props) => {
  console.log(props) // linha destacada
  return (
    <div>
      <p>
        Olá {props.name}, você tem {props.age} anos // linha destacada
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // linha destacada
  const age = 10       // linha destacada

  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello name='Maya' age={26 + 10} /> // linha destacada
      <Hello name={name} age={age} />     // linha destacada
    </div>
  )
}
```

As props enviadas pelo componente <i>App</i> são os valores das variáveis, isto é, o resultado da avaliação da expressão de soma e de uma string comum.

O componente <i>Hello</i> também registra o valor do objeto props no console.

Eu espero genuinamente que seu console esteja aberto. Se não estiver, lembre-se do que você prometeu:

>  <i>Eu prometo manter o console aberto o tempo todo durante este curso e pelo resto da minha vida quando estiver programando aplicações web.</i>

Desenvolvimento de software é difícil. Fica ainda mais difícil se não estiver usando todas as ferramentas possíveis, como o console web e a impressão de depuração com _console.log_. Profissionais usam ambos <i>o tempo todo</i>, e não há razão qualquer para que um iniciante não adote o uso desses métodos maravilhosos que tornarão a vida muito mais fácil.

### Alguns lembretes

O React foi configurado para gerar mensagens de erro bastante claras. Mesmo assim, você deve, pelo menos no começo, avançar com **passos bem curtos** e ter certeza de que cada mudança funciona como desejado.

**O console deve estar sempre aberto**. Se o navegador relatar erros, não é aconselhável continuar escrevendo mais código, esperando por milagres. Em vez disso, você deve tentar entender a causa do erro e, por exemplo, voltar ao estado anterior de funcionamento:

![captura de tela de um erro prop indefinido](../../images/1/2a.png)

Como já mencionamos, é possível e vantajoso escrever comandos <em>console.log()</em> (que imprimem no console) ao programar com React.

Além disso, tenha em mente que **os nomes de componentes React devem ser maiusculizados**. Se você tentar definir um componente da seguinte forma:

```js
const footer = () => {
  return (
    <div>
      Aplicação de Saudações criado por <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
```

E usá-lo desta forma:

```js
const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello name='Maya' age={26 + 10} />
      <footer /> // linha destacada
    </div>
  )
}
```

A página não vai exibir o conteúdo definido dentro do componente Footer e, em vez disso, o React cria apenas um elemento [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) vazio, ou seja, o elemento HTML incorporado em vez do elemento React personalizado com o mesmo nome. Se você mudar a primeira letra do nome do componente para maiúsculo, o React cria um elemento <i>div</i> definido no componente Footer, que é renderizado na página.

Note que o conteúdo de um componente React (geralmente) precisa conter **um elemento raiz (root)**. Se, por exemplo, tentarmos definir o componente <i>App</i> sem o elemento <i>div</i> externo:

```js
const App = () => {
  return (
    <h1>Olá a todos!</h1>
    <Hello name='Maya' age={26 + 10} />
    <Footer />
  )
}
```

o resultado é uma mensagem de erro.

![captura de tela de múltiplos erros de elementos-raiz](../../images/1/3c.png)

Usar um elemento raiz não é a única opção viável. Um <i>array</i> (vetor) de componentes também é uma solução válida:

```js
const App = () => {
  return [
    <h1>Olá a todos!</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

Porém, definir o componente raiz da aplicação não é algo particularmente sábio a se fazer, e deixa o código com uma aparência um pouco feia.

Por conta do elemento raiz ser "estipulado", temos elementos div "extras" na árvore DOM. Isso pode ser evitado usando [fragmentos](https://reactjs.org/docs/fragments.html#short-syntax), ou seja, envolvendo os elementos a serem retornados pelo componente com um elemento vazio:

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Olá a todos!</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Agora, a aplicação compila com sucesso, e a DOM gerada pelo React não contém mais o elemento "div" extra.

### Não renderize objetos

Considere uma aplicação que imprime os nomes e idades de nossos amigos na tela:

```js
const App = () => {
  const friends = [ 
        { name: 'Peter', age: 4 },
        { name: 'Maya', age: 10 },
    ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

No entanto, nada aparece na tela. Venho tentando encontrar o problema no código há 15 minutos, mas não consigo descobrir onde o problema poderia estar.

Eu finalmente lembro da promessa que fizemos:

> <i>Eu prometo manter o console aberto o tempo todo durante este curso e pelo resto da minha vida quando estiver programando aplicações web.</i>

O console grita em vermelho:

![](../../images/1/34new.png)

O núcleo do problema é que: <i>Objetos não são válidos como elementos-filho do React</i>, ou seja, a aplicação tenta renderizar <i>objetos</i> e falha novamente.

O código tenta renderizar as informações de um "friend" da seguinte forma

```js
<p>{friends[0]}</p>
```

e isso causa um problema, porque o item a ser renderizado dentro das chaves é um objeto.

```js
{ name: 'Peter', age: 4 }
```

Em React, elementos individuais renderizadas dentro das chaves devem ser valores primitivos, como números ou strings.

A solução é a seguinte:

```js
const App = () => {
  const friends = [ 
        { name: 'Peter', age: 4 },
        { name: 'Maya', age: 10 },
    ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

Agora o nome do amigo é renderizado separadamente dentro das chaves:

```js
{friends[0].name}
```

Também a idade:

```js
{friends[0].age}
```

Após corrigir o erro, limpe as mensagens de erro do console pressionando Ø e, em seguida, recarrege o conteúdo da página e garanta que não haja mensagens de erro exibidas.

Uma adição ao lembrete anterior: O React também permite que matrizes sejam renderizadas se elas contêm valores elegíveis para renderização (como números ou strings). Então, o seguinte programa funcionaria, embora o resultado pudesse não ser o que queremos:

```js
const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

Nesta parte, nem vale a pena tentar usar a renderização direta de tabelas. Voltaremos a discutir isso na próxima parte.

</div>




### SEM REVISÃO ^^^^^^^^^^




<div class="tasks">
  <h3>Exercises 1.1.-1.2.</h3>

The exercises are submitted via GitHub, and by marking the exercises as done in the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

The exercises are submitted **one part at a time**. When you have submitted the exercises for a part of the course you can no longer submit undone exercises for the same part.

Note that in this part, there are [more exercises](/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14) besides those found below. <i>Do not submit your work</i> until you have completed all of the exercises you want to submit for the part.

You may submit all the exercises of this course into the same repository, or use multiple repositories. If you submit exercises of different parts into the same repository, please use a sensible naming scheme for the directories.

One very functional file  structure for the submission repository is as follows:

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

See this [example submission repository](https://github.com/fullstack-hy2020/example-submission-repository)!

For each part of the course, there is a directory, which further branches into directories containing a series of exercises, like "unicafe" for part 1.

For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory <i>node\_modules</i>.

  <h4>1.1: course information, step1</h4>

<i>The application that we will start working on in this exercise will be further developed in a few of the following exercises. In this and other upcoming exercise sets in this course, it is enough to only submit the final state of the application. If desired, you may also create a commit for each exercise of the series, but this is entirely optional.</i>

Use create-react-app to initialize a new application. Modify <i>index.js</i> to match the following

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

and <i>App.js</i> to match the following

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

and remove extra files (App.css, App.test.js, index.css, logo.svg, setupTests.js, reportWebVitals.js)).

Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: <i>Header</i>, <i>Content</i>, and <i>Total</i>. All data still resides in the <i>App</i> component, which passes the necessary data to each component using <i>props</i>. <i>Header</i> takes care of rendering the name of the course, <i>Content</i> renders the parts and their number of exercises and <i>Total</i> renders the total number of exercises.

Define the new components in the file <i>App.js</i>.

The <i>App</i> component's body will approximately be as follows:

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**WARNING** Don't try to program all the components concurrently, because that will almost certainly break down the whole app. Proceed in small steps, first make e.g. the component <i>Header</i> and only when it works for sure, you could proceed to the next component. 

Careful, small-step progress may seem slow, but it is actually <i> by far the fastest</i> way to progress. Famous software developer Robert "Uncle Bob" Martin has stated

> <i>"The only way to go fast, is to go well"</i>

that is, according to Martin, careful progress with small steps is even the only way to be fast.

**WARNING2** create-react-app automatically makes the project a git repository unless the application is created within an already existing repository. Most likely you **do not want** the project to become a repository, so run the command _rm -rf .git_ in the root of the project.

<h4>1.2: course information, step2</h4>

Refactor the <i>Content</i> component so that it does not render any names of parts or their number of exercises by itself. Instead, it only renders three <i>Part</i> components of which each renders the name and number of exercises of one part.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. We shall fix that in the [part 2](/en/part2).

</div>
