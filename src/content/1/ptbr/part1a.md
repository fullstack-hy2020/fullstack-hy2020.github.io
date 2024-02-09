---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: ptbr
---

<div class="content">

Agora, começaremos a nos familiarizar com provavelmente o tópico mais importante deste curso, a biblioteca [React](https://reactjs.org/). Vamos começar criando uma aplicação React simples, conhecendo os conceitos-chave de React.

A maneira mais simples de começar é usando uma ferramenta chamada [create-react-app](https://github.com/facebook/create-react-app). É possível (mas não necessário) instalar o <i>create-react-app</i> em sua máquina se a ferramenta <i>npm</i> instalada junto com o Node estiver na versão <i>5.3</i>, pelo menos.

<i>Durante o curo, você também pode utilizar a nova ferramenta frontend chamada [Vite](https://vitejs.dev/), se desejar. O create-react-app ainda é a ferramenta recomendada pelo time do React e é por isso que continua sendo a ferramenta padrão para configurar um projeto React neste curso. Leia [aqui](https://github.com/reactjs/reactjs.org/pull/5487#issuecomment-1409720741) como o time React enxerga o futuro das ferramentas React.</i>

Vamos criar uma aplicação chamada <i>part1</i> e navegar até o seu diretório.

```bash
npx create-react-app part1
cd part1
```

A aplicação é executada da seguinte forma:

```bash
npm start
```

Por padrão, a aplicação é executada no localhost, porta 3000, no endereço <http://localhost:3000>.

Seu navegador padrão deve ser automaticamente aberto. Abra **imediatamente** o console do navegador. Além disso, abra um editor de texto para que você possa ver o código e a página web ao mesmo tempo na tela:

![código e navegador lado a lado](../../images/1/1e.png)

O código da aplicação reside no diretório <i>src</i>. Vamos simplificar o código padrão para que o conteúdo do arquivo index.js fique assim:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

E o arquivo <i>App.js</i> fique assim:

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

Por padrão, o arquivo <i>public/index.html</i> não contém nenhum marcador HTML que seja visível para nós no navegador:

```html
<!DOCTYPE html>
<html lang="ptbr">
  <head>
      conteúdo não mostrado ...
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
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

Como você provavelmente já adivinhou, o componente será renderizado como uma tag <i>div</i>, que envolve uma tag <i>p</i> contendo o texto <i>"Olá, mundo!"</i>.

Tecnicamente, o componente é definido como uma função JavaScript. O código a seguir também é uma função (que não recebe nenhum parâmetro):

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

Existem algumas maneiras de definir funções em JavaScript. Aqui usaremos as [funções de seta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (arrow functions), que são descritas em uma versão mais recente de JavaScript conhecida como [ECMAScript 6](http://es6-features.org/#Constants), também chamada de ES6.

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

![console do navegador com uma seta mostrando o log com a mensagem "Hello from component"](../../images/1/30.png)

A primeira regra do desenvolvimento web front-end:

> <i> Mantenha o console aberto o tempo todo.</i>

Vamos repetir juntos: <i>Prometo manter o console aberto o tempo todo</i> durante este curso e pelo resto da minha vida quando estiver desenvolvendo para a web.

Também é possível renderizar conteúdo dinâmico dentro de um componente.

Modifique o componente da seguinte maneira:

```js
const App = () => {
  const hoje = new Date()
  const a = 10
  const b = 20
  console.log(hoje, a+b)

  return (
    <div>
      <p>Olá, mundo! Hoje é {hoje.toString()}</p>
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

A exportação não é mostrada na maioria dos exemplos do material do curso. Sem a exportação, o componente e a aplicação inteira desmoronam.

Você se lembrou da sua promessa de deixar o console aberto? O que foi impresso?

### JSX

Parece que os componentes React estão retornando marcações HTML. No entanto, não é esse o caso. A maior parte da estrutura de componentes React é escrita usando [JSX](https://reactjs.org/docs/introducing-jsx.html) (JavaScript Syntax Extension [Extensão de Sintaxe para JavaScript]). Embora o JSX pareça com HTML, estamos lidando com uma maneira de escrever JavaScript. Por baixo dos panos, o JSX retornado por componentes React é compilado em JavaScript.

Depois da compilação, nossa aplicação fica assim:

```js
const App = () => {
  const hoje = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Olá, mundo! Hoje é ', hoje.toString()
    ),
    React.createElement(
      'p', null, a, ' mais ', b, ' é ', a + b
    )
  )
}
```

A compilação é gerenciada pelo [Babel](https://babeljs.io/repl/). Projetos criados com *create-react-app* são configurados para compilar automaticamente. Vamos aprender mais sobre esse tópico na [Parte 7](/ptbr/part7) deste curso.

Também é possível escrever React como "JavaScript puro" sem usar JSX. Embora não seja recomendável.

Na prática, o JSX é muito parecido com HTML com a diferença de que, com o JSX, é possível inserir facilmente conteúdo dinâmico escrevendo código JavaScript dentro de chaves. A ideia do JSX é bastante semelhante a muitas linguagens de modelos, como Thymeleaf usado junto ao Java Spring, que são usadas em servidores.

JSX é "semelhante a [XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)" (Extensible Markup Language [Linguagem de Marcação Extensível]), o que significa que todas as tags precisam ser fechadas. Por exemplo, uma nova linha é um elemento vazio, que em HTML pode ser escrito da seguinte maneira:

```html
<br>
```

Mas ao escrever em JSX, a tag precisa ser fechada:

```html
<br />
```

### Múltiplos componentes

Vamos modificar o arquivo <i>App.js</i> da seguinte forma (obs.: a exportação na parte inferior é omitida nestes <i>exemplos</i>, tanto agora quanto no futuro. Ela ainda é necessária para que o código funcione):

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Olá, mundo!</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

Definimos um novo componente <i>Hello</i> e o usamos dentro do componente <i>App</i>. Naturalmente, um componente pode ser usado várias vezes:

```js
const App = () => {
  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

Escrever componentes em React é fácil, e utilizando combinação de componentes mesmo uma aplicação mais complexa pode ser mantida de forma organizada. De fato, uma das filosofias fundamentais do React é criar aplicações a partir de muitos componentes que são especializados e reutilizáveis.

Outra forte convenção é a ideia de um componente <i>root</i> chamado <i>App</i> no topo da árvore de componentes da aplicação. No entanto, como aprenderemos na [Parte 6](/ptbr/part6), há situações em que o componente <i>App</i> não é exatamente a raiz (root), mas é envolto em um componente utilitário apropriado.

### props: passando dados para componentes

É possível passar dados para componentes usando as chamadas [props](https://reactjs.org/docs/components-and-props.html) (properties [propriedades]).

Vamos modificar o componente <i>Hello</i> da seguinte maneira:

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Olá {props.nome}</p> // highlight-line
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
      <Hello nome='George' /> // highlight-line
      <Hello nome='Daisy' /> // highlight-line
    </div>
  )
}
```

É possível haver um número arbitrário de props e seus valores podem ser strings "hard-coded" (dados ou estruturas em um código que não podem ser alterados sem modificar manualmente o programa) ou resultados de expressões JavaScript. Se o valor da prop é obtido usando JavaScript, ele deve ser envolvido em chaves.

Vamos modificar o código para que o componente <i>Hello</i> use duas props:

```js
const Hello = (props) => {
  console.log(props) // highlight-line
  return (
    <div>
      <p>
        Olá {props.nome}, você tem {props.idade} anos // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const nome = 'Peter' // highlight-line
  const idade = 10       // highlight-line

  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello nome='Maya' idade={26 + 10} />   // highlight-line
      <Hello nome={nome} idade={idade} />     // highlight-line
    </div>
  )
}
```

As props enviadas pelo componente <i>App</i> são os valores das variáveis, isto é, o resultado da avaliação da expressão de soma e de uma string comum.

O componente <i>Hello</i> também registra o valor do objeto props no console.

Eu espero genuinamente que seu console esteja aberto. Se não estiver, lembre-se do que você prometeu:

>  <i>Eu prometo manter o console aberto o tempo todo durante este curso e pelo resto da minha vida quando estiver desenvolvendo para a web.</i>

Desenvolvimento de software é difícil. Fica ainda mais difícil se não estiver usando todas as ferramentas possíveis, como o console web e a impressão de depuração com _console.log_. Profissionais usam ambos <i>o tempo todo</i>, e não há razão alguma para que um iniciante não adote o uso desses métodos maravilhosos que tornam a vida muito mais fácil.

### Alguns lembretes

O React foi configurado para gerar mensagens de erro bastante claras. Mesmo assim, você deve, pelo menos no começo, avançar com **passos bem curtos** e tendo certeza de que cada mudança funciona como desejado.

**O console deve estar sempre aberto**. Se o navegador relatar erros, não é aconselhável continuar escrevendo mais código, esperando por milagres. Em vez disso, você deve tentar entender a causa do erro e, por exemplo, voltar ao estado anterior de funcionamento:

![captura de tela de um erro prop indefinido](../../images/1/2a.png)

Como já mencionamos, é possível e recompensador escrever comandos <em>console.log()</em> (que imprimem no console) ao programar em React.

Além disso, tenha em mente que **os nomes de componentes React devem estar com a primeira letra em maiúsculo**. Se você tentar definir um componente da seguinte forma:

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
      <Hello nome='Maya' idade={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

A página não vai exibir o conteúdo definido dentro do componente Footer e, em vez disso, React cria apenas um elemento [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) vazio, ou seja, o elemento HTML incorporado em vez do elemento React personalizado com o mesmo nome. Se você mudar a primeira letra do nome do componente para maiúsculo, o React cria um elemento <i>div</i> definido no componente Footer, que é renderizado na página.

Note que o conteúdo de um componente React (normalmente) precisa conter **um elemento raiz (root)**. Se, por exemplo, tentarmos definir o componente <i>App</i> sem o elemento <i>div</i> externo:

```js
const App = () => {
  return (
    <h1>Olá a todos!</h1>
    <Hello nome='Maya' idade={26 + 10} />
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
    <Hello nome='Maya' idade={26 + 10} />,
    <Footer />
  ]
}
```

Porém, definir o componente raiz da aplicação não é algo particularmente sábio a se fazer, e deixa o código com uma aparência um pouco feia.

Por conta do elemento raiz ser compulsório, temos elementos div "extras" na árvore DOM. Isso pode ser evitado usando [fragmentos](https://reactjs.org/docs/fragments.html#short-syntax), ou seja, envolvendo os elementos a serem retornados pelo componente com um elemento vazio:

```js
const App = () => {
  const nome = 'Peter'
  const idade = 10

  return (
    <>
      <h1>Olá a todos!</h1>
      <Hello nome='Maya' idade={26 + 10} />
      <Hello nome={nome} idade={idade} />
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
  const amigos = [ 
      { nome: 'Peter', idade: 4 },
      { nome: 'Maya', idade: 10 },
    ]

  return (
    <div>
      <p>{amigos[0]}</p>
      <p>{amigos[1]}</p>
    </div>
  )
}

export default App
```

No entanto, nada aparece na tela. Venho tentando encontrar o problema no código há 15 minutos, mas não consigo descobrir onde o problema poderia estar.

Eu finalmente lembro da promessa que fizemos:

> <i>Eu prometo manter o console aberto o tempo todo durante este curso e e pelo resto da minha vida quando estiver desenvolvendo para a web.</i>

O console grita em vermelho:

![](../../images/1/34new.png)

O núcleo do problema é que: <i>Objetos não são válidos como elementos-filho React</i>, isto é, a aplicação tenta renderizar <i>objetos</i> e falha novamente.

O código tenta renderizar as informações de um amigo da seguinte maneira:

```js
<p>{amigos[0]}</p>
```

E isso causa um problema, porque o item a ser renderizado dentro das chaves é um objeto.

```js
{ nome: 'Peter', idade: 4 }
```

Em React, elementos individuais renderizadas dentro das chaves devem ser valores primitivos, como números ou strings.

A solução é a seguinte:

```js
const App = () => {
  const amigos = [ 
      { nome: 'Peter', idade: 4 },
      { nome: 'Maya', idade: 10 },
    ]

  return (
    <div>
      <p>{amigos[0].nome} {amigos[0].idade}</p>
      <p>{amigos[1].nome} {amigos[1].idade}</p>
    </div>
  )
}

export default App
```

O nome do amigo é renderizado separadamente dentro das chaves:

```js
{amigos[0].nome}
```

Também a idade:

```js
{amigos[0].idade}
```

Após corrigir o erro, limpe as mensagens de erro do console clicando em 🚫 e, em seguida, recarregue o conteúdo da página e garanta que não haja mensagens de erro exibidas.

Uma adição ao lembrete anterior: React também permite que arrays sejam renderizados se conterem valores elegíveis para renderização (como números ou strings). Então, o seguinte programa funcionaria, embora o resultado não seja o que desejamos:

```js
const App = () => {
  const amigos = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{amigos}</p>
    </div>
  )
}
```

Nesta parte, nem vale a pena tentar usar a renderização direta de tabelas. Voltaremos a discutir isso na próxima parte.

</div>

<div class="tasks">
  <h3>Exercícios 1.1 a 1.2</h3>

Os exercícios são enviados via GitHub, marcando os exercícios como concluídos na guia "my submissions" do [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Os exercícios são enviados **uma parte de cada vez**. Quando você tiver enviado os exercícios para uma parte, não poderá mais enviar nenhum exercício não feito para essa parte.

Note que nesta parte há [mais exercícios](/ptbr/part1/um_estado_mais_complexo_e_depuracao_de_aplicacoes_react#exercicios-1-6-a-1-14) além dos encontrados abaixo. <i>Não envie seus exercícios</i> até que você tenha concluído todos os exercícios desta parte.

É possível colocar todos os exercícios em um mesmo repositório ou usar múltiplos repositórios diferentes. Se você enviar exercícios de diferentes partes para o mesmo repositório, dê nomes apropriados às suas pastas.

Uma boa maneira de nomear as pastas no seu repositório de envio é a seguinte:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

Veja este [exemplo de repositório de submissão](https://github.com/fullstack-hy2020/example-submission-repository)!

Para cada parte do curso, há um diretório, que se ramifica em diretórios contendo uma série de exercícios, como "unicafe" para a Parte 1.

Para cada aplicação web em uma série de exercícios, é recomendado que você envie todos os arquivos relacionados a essa aplicação, exceto o diretório <i>node_modules</i>.

<i>**Obs.:** o conteúdo dos exercícios foram deixados no idioma original da tradução (inglês) por questões de conveniência, visto a revisão que os mantenedores do curso devem fazer no código enviado ao sistema de avaliação da Universidade de Helsinque. Desta forma, escreva suas aplicações utilizando os mesmos termos usados nas variáveis, componentes, etc que estão em inglês.</i>

  <h4>1.1: course information — 1º passo</h4>

<i>A aplicação que começaremos a trabalhar neste exercício será desenvolvida em alguns dos exercícios seguintes. Neste e em outros conjuntos de exercícios futuros neste curso, é suficiente enviar apenas o estado final da aplicação. Se desejar, também pode criar um commit para cada exercício da série, mas é algo totalmente opcional.</i>

Use "create-react-app" para inicializar uma nova aplicação. Modifique o arquivo <i>index.js</i> para que fique desta forma:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

E <i>App.js</i> para:

```js
const App = () => {
  const course = 'Desenvolvimento de aplicação Half Stack'
  const part1 = 'Fundamentos da biblioteca React'
  const exercises1 = 10
  const part2 = 'Usando props para passar dados'
  const exercises2 = 7
  const part3 = 'Estado de um componente'
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

E remova arquivos extras (App.css, App.test.js, index.css, logo.svg, setupTests.js, reportWebVitals.js).

Infelizmente, toda a aplicação está no mesmo componente. Refatore o código para que consista em três novos componentes: <i>Header</i>, <i>Content</i> e <i>Total</i>. Todos os dados ainda residem no componente <i>App</i>, que passa os dados necessários a cada componente usando <i>props</i>. <i>Header</i> cuida da renderização do nome do curso, <i>Content</i> renderiza as partes e o número de exercícios e <i>Total</i> renderiza o número total de exercícios.

Defina os novos componentes no arquivo <i>App.js</i>.

O corpo do componente <i>App</i> ficará desta forma:

```js
const App = () => {
  // definições "const"

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**ATENÇÃO I** Não tente programar todos os componentes simultaneamente, pois isso quase que certamente fará com que a aplicação desmorone. Avance em pequenos passos. Programe primeiro o componente <i>Header</i>, por exemplo, e somente quando estiver funcionando corretamente, prossiga para o próximo componente.

O progresso cuidadoso e que avança em pequenos passos pode parecer lento, porém, na verdade, é <i> de longe o caminho mais rápido</i> para o progresso. O famoso desenvolvedor de software Robert "Uncle Bob" Martin afirmou:

> <i>"A única maneira de ir rápido é ir bem."</i>

Ou seja, de acordo com Martin, o progresso cuidadoso, passo a passo, é, ainda, a única maneira de ir rápido.

**ATENÇÃO II** "create-react-app" faz automaticamente com que o projeto se torne um repositório git, a menos que a aplicação seja criada dentro de um repositório já existente. É muito provável que você **não queira** que o projeto se torne um repositório, então execute o comando _rm -rf .git_ na raiz do projeto.

<h4>1.2: course information — 2º passo</h4>

Refatore o componente <i>Content</i> de tal forma que ele não renderize os nomes das partes ou seus números de exercícios por si mesmo. Em vez disso, somente renderiza três componentes <i>Part</i>, cada um dos quais renderiza o nome e o número de exercícios de uma parte.

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

No momento, nossa aplicação passa informações de uma maneira bastante primitiva, já que está baseada em variáveis individuais. Vamos corrigir isso na [Parte 2](/ptbr/part2).

</div>
