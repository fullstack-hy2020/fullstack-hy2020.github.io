---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: pt
---

<div class="content">

Vamos voltar a trabalhar com React.

Comecemos com um novo exemplo:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Olá {props.nome}, você tem {props.idade} anos.
      </p>
    </div>
  )
}

const App = () => {
  const nome = 'Peter'
  const idade = 10

  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello nome="Maya" idade={26 + 10} />
      <Hello nome={nome} idade={idade} />
    </div>
  )
}
```

### Funções auxiliares de componentes

Vamos expandir nosso componente <i>Hello</i> para que ele adivinhe o ano de nascimento da pessoa que está sendo saudada:

```js
const Hello = (props) => {
  const anoDeNascimento = () => {
    const anoDeHoje = new Date().getFullYear()
    return anoDeHoje - props.idade
  }

  return (
    <div>
      <p>
        Olá {props.nome}, você tem {props.idade} anos.
      </p>
      <p>Então, você nasceu provavelmente em {anoDeNascimento()}.</p>
    </div>
  )
}
```

A lógica para achar o ano de nascimento é separada em uma função que é chamada quando o componente é renderizado.

A idade da pessoa não precisa ser passada como parâmetro para a função, já que ela pode acessar diretamente todas as propriedades que são passadas para o componente.

Se examinarmos nosso código atual de perto, vamos perceber que a função "auxiliadora" é definida dentro de outra função que define o comportamento de nosso componente. Em Java, definir uma função dentro de outra é algo complexo e incômodo, portanto, não é algo muito comum. Em JavaScript, entretanto, definir funções dentro de funções é uma técnica amplamente usada.

### Desestruturação

Antes de avançarmos, vamos dar uma olhada em uma pequena, porém útil, funcionalidade da linguagem JavaScript que foi adicionada na especificação ES6, que nos permite [desestruturar](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) (destructuring assignment [atribuição via desestruturação]) valores de objetos e arrays por atribuição.

Em nosso código anterior, tivemos que referenciar os dados passados para nosso componente como _props.nome_ e _props.idade_. Dessas duas expressões, tivemos que repetir _props.idade_ duas vezes em nosso código.

Já que <i>props</i> é um objeto...

```js
props = {
  nome: 'Arto Hellas',
  idade: 35,
}
```

... podemos simplificar nosso componente atribuindo os valores das propriedades diretamente em duas variáveis _nome_ e _idade_ que podemos utilizar em nosso código:

```js
const Hello = (props) => {
  const nome = props.nome
  const idade = props.idade

  const anoDeNascimento = () => new Date().getFullYear() - idade

  return (
    <div>
      <p>Olá {nome}, você tem {idade} anos</p>
      <p>Então, você nasceu provavelmente em {anoDeNascimento()}.</p>
    </div>
  )
}
```

Note que também utilizamos a sintaxe mais compacta para as funções de seta ao definir a função _anoDeNascimento_. Como mencionado anteriormente, se uma função de seta consiste em uma única expressão, então o corpo da função não precisa ser escrito dentro de chaves. Nesta forma mais compacta, a função simplesmente retorna o resultado da única expressão.

Resumindo, as duas definições de função mostradas abaixo são equivalentes:

```js
const anoDeNascimento = () => new Date().getFullYear() - idade

const anoDeNascimento = () => {
  return new Date().getFullYear() - idade
}
```

A desestruturação torna a atribuição de variáveis ainda mais fácil, já que podemos usá-la para extrair e reunir os valores das propriedades de um objeto em variáveis separadas:

```js
const Hello = (props) => {
  const { nome, idade } = props
  const anoDeNascimento = () => new Date().getFullYear() - idade

  return (
    <div>
      <p>Olá {nome}, você tem {idade} anos.</p>
      <p>Então, você provavelmente nasceu em {anoDeNascimento()}.</p>
    </div>
  )
}
```

Se o objeto que estamos desestruturando tem os valores...

```js
props = {
  nome: 'Arto Hellas',
  idade: 35,
}
```

... a expressão <em>const { nome, idade } = props</em> atribui os valores 'Arto Hellas' para _nome_ e 35 para _idade_.

Podemos levar a desestruturação um passo adiante:

```js
const Hello = ({ nome, idade }) => {
  const anoDeNascimento = () => new Date().getFullYear() - idade

  return (
    <div>
      <p>
        Olá {nome}, você tem {idade} anos.
      </p>
      <p>Então, você provavelmente nasceu em {anoDeNascimento()}.</p>
    </div>
  )
}
```

As props que são passadas para o componente agora são diretamente desestruturadas nas variáveis _nome_ e _idade_.

Isso significa que, em vez de atribuir o objeto props inteiro a uma variável chamada <i>props</i> e, em seguida, atribuir suas propriedades às variáveis _nome_ e _idade_...

```js
const Hello = (props) => {
  const { nome, idade } = props
```

... nós atribuímos os valores das propriedades diretamente para variáveis ​​por meio da desestruturação do objeto props que é passado como parâmetro à função do componente:

```js
const Hello = ({ nome, idade }) => {
```

### Re-renderização da página

Até agora, todas as nossas aplicações foram escritas de tal forma que sua aparência permanece a mesma após a renderização inicial. E se quiséssemos criar um contador onde o valor aumentasse como função de tempo ou com um clique em um botão?

Vamos começar com o seguinte. O arquivo <i>App.js</i> fica assim:

```js
const App = (props) => {
  const {contador} = props
  return (
    <div>{contador}</div>
  )
}

export default App
```

E o arquivo <i>index.js</i> fica desta forma:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

let contador = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App contador={contador} />
)
```

É dado ao componente "App" o valor do contador via a prop _contador_. Este componente renderiza o valor na tela. O que acontece quando o valor de _contador_ muda? Mesmo se adicionarmos o seguinte...

```js
contador += 1
```

... o componente não será re-renderizado. Podemos fazer com que o componente seja re-renderizado chamando o método _render_ uma segunda vez, por exemplo, da seguinte maneira:

```js
let contador = 1

const recarregar = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App contador={contador} />
  )
}

recarregar()
contador += 1
recarregar()
contador += 1
recarregar()
```

O comando de re-renderização foi embalado dentro da função _recarregar_ para diminuir a quantidade de código copiado e colado.

Agora, o componente <i>renderiza três vezes</i>: primeiro com o valor 1; depois 2 e finalmente 3. Porém, os valores 1 e 2 são exibidos na tela por um período tão curto de tempo que não podem nem ser notados.

Podemos implementar uma funcionalidade um pouco mais interessante re-renderizando e incrementando o contador a cada segundo usando [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) ("definir intervalo"):

```js
setInterval(() => {
  recarregar()
  contador += 1
}, 1000)
```

Fazer repitidas chamadas ao método _render_ não é a forma recomendada de re-renderização de componentes. A seguir, apresentaremos uma forma melhor para fazer essa re-renderização.

### Componente "Stateful"

Todos os nossos componentes até agora foram simples no sentido de que não continham nenhum estado que pudesse mudar durante o ciclo de vida do componente.

Então, vamos adicionar um "estado" ao componente <i>App</i> com a ajuda do [state hook](https://reactjs.org/docs/hooks-state.html) (Grosso modo, "gancho de estado", isto é, são funções que permitem a você “ligar-se” aos recursos de estado (state) e ciclo de vida do React a partir de componentes funcionais) do React.

A aplicação será alterada da seguinte forma. <i>index.js</i> retorna à sua configuração original...

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

... e <i>App.js</i> muda para o seguinte:

```js
import { useState } from 'react'

const App = () => {
  const [ contador, defContador ] = useState(0)
  // * "setCounter" pode ser traduzido como "definirContador", que fica
  // como "defContador" em sua forma reduzida.

  setTimeout(
    () => defContador(contador + 1),
    1000
  )

  return (
    <div>{contador}</div>
  )
}

export default App
```

Na primeira linha, o arquivo importa a função _useState_:

```js
import { useState } from 'react'
```

O corpo da função que define o componente começa com a chamada da função:

```js
const [ contador, defContador ] = useState(0)
```

A chamada da função adiciona <i>estado</i> (state) ao componente e o renderiza inicializado com o valor zero. A função retorna um array que contém dois itens. Atribuímos os itens às variáveis _contador_ e _defContador_ usando a sintaxe de atribuição via desestruturação mostrada anteriormente.

A variável _contador_ é atribuída ao valor inicial de <i>estado</i>, que é zero. A variável _defContador_ é atribuída a uma função que será usada para <i>modificar o estado</i>.

A aplicação chama a função [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) ("definir intervalo") e passa dois parâmetros: uma função para incrementar o estado do contador e um tempo de espera de um 1 (um) segundo:

```js
setTimeout(
  () => defContador(contador + 1),
  1000
)
```

A função passada como primeiro parâmetro à função _defContador_ é chamada 1 (um) segundo depois de chamar a função _defContador_

```js
() => defContador(contador + 1)
```

Quando a função de modificação de estado _defContador_ é chamada, <i>o React re-renderiza o componente</i>, o que significa que o corpo da função do componente é reexecutado:

```js
() => {
  const [ contador, defContador ] = useState(0)

  setTimeout(
    () => defContador(contador + 1),
    1000
  )

  return (
    <div>{contador}</div>
  )
}
```

A segunda vez que a função do componente é executada, ela chama a função _useState_ e retorna o novo valor do estado: 1. Executar o corpo da função novamente também faz uma nova chamada de função para _setTimeout_, que executa o tempo de espera de um segundo e incrementa novamente o estado do _contador_. Por conta do valor da variável _contador_ ser 1, incrementar o valor em 1 é essencialmente a mesma coisa de uma expressão que define o valor de _contador_ para 2.

```js
() => defContador(2)
```
Enquanto isso, o antigo valor de _contador_ — "1" — é renderizado na tela.

Toda vez que o _defContador_ modifica o estado, ele faz com que o componente seja renderizado novamente. O valor do estado será incrementado novamente após um segundo, e esse evento continuará a se repetir enquanto a aplicação estiver em execução.

Se o componente não for renderizado quando você acha que deveria, ou se for renderizado no "momento errado", é possível depurar a aplicação registrando os valores das variáveis do componente no console. Se fizermos as seguintes adições ao nosso código:

```js
const App = () => {
  const [ contador, defContador ] = useState(0)

  setTimeout(
    () => defContador(contador + 1),
    1000
  )

  console.log('renderizando...', contador)

  return (
    <div>{contador}</div>
  )
}
```

É fácil seguir e acompanhar as chamadas feitas à função de renderização do componente <i>App</i>:

![captura de tela da função de renderização nas Ferramentas de dDsenvolvimento](../../images/1/4e.png)

O console do seu navegador estava aberto? Se não estava, prometa que essa foi a última vez que precisou ser lembrado disso.

### Tratamento de eventos (Event handling)

Já mencionamos, na [Parte 0](/en/part0), <i>manipuladores de eventos</i> que são registrados para serem chamados quando eventos específicos ocorrem várias vezes. A interação de um usuário com os diferentes elementos de uma página web pode causar uma coleção de vários tipos de eventos a serem acionados.

Vamos mudar a aplicação para que o aumento do contador aconteça quando um usuário clicar em um botão, que é implementado com o elemento [botão](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (button).

Os elementos de botão suportam os chamados [Eventos de Mouse](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (MouseEvent), dos quais [clique](https://developer.mozilla.org/en-US/docs/Web/Events/click) (click) é o evento mais comum. O evento de clique em um botão também pode ser acionado com o teclado ou com uma tela touch screen, apesar de ser "<i>eventos de mouse</i>".

Em React, se [registra uma função manipuladora de eventos](https://reactjs.org/docs/handling-events.html) (event handler function) para o evento <i>click</i> desta forma:

```js
const App = () => {
  const [ contador, defContador ] = useState(0)

  const handleClick = () => {
    // *"handleClick" pode ser traduzido, grosso modo, como "manipularClique"
    console.log('clicado')
  }

  return (
    <div>
      <div>{contador}</div>
      <button onClick={handleClick}>
        mais+
      </button>
    </div>
  )
}
```

Definimos o valor do atributo <i>onClick</i> do botão como uma referência à função _handleClick_ definida no código.

Agora, a cada clique no botão <i>mais+</i>, a função _handleClick_ é chamada, o que significa que a cada evento de clique uma mensagem <i>clicado</i> será registrada no console do navegador.

A função manipuladora de eventos também pode ser definida diretamente na atribuição de valor do atributo "onClick":

```js
const App = () => {
  const [ contador, defContador ] = useState(0)

  return (
    <div>
      <div>{contador}</div>
      <button onClick={() => console.log('clicado')}>
        mais+
      </button>
    </div>
  )
}
```

Ao mudar a função manipuladora de eventos para a seguinte forma...
```js
<button onClick={() => defContador(contador + 1)}>
  mais+
</button>
```

... atingimos o comportamento desejado, ou seja, o valor de _counter_ é incrementado em 1 (um) <i>e</i> o componente é re-renderizado.

Vamos também adicionar um botão para redefinir o contador:

```js
const App = () => {
  const [ contador, defContador ] = useState(0)

  return (
    <div>
      <div>{contador}</div>
      <button onClick={() => defContador(contador + 1)}>
        mais+
      </button>
      <button onClick={() => defContador(0)}> 
        zerar
      </button>
    </div>
  )
}
```

Nossa aplicação está pronta!

### Um manipulador de evento é uma função

Definimos os manipuladores de eventos para os nossos botões, onde declaramos seus atributos <i>onClick</i>:

```js
<button onClick={() => defContador(contador + 1)}> 
  mais+
</button>
```

E se tentássemos definir os manipuladores de eventos de uma forma mais simples? O que aconteceria?

```js
<button onClick={defContador(contador + 1)}> 
  mais+
</button>
```

Quebraria completamente nossa aplicação:

![captura de tela de erro de re-renderizadores](../../images/1/5c.png)

O que está acontecendo? Um manipulador de eventos deve ser uma <i>função</i> ou uma <i>referência de função</i>. Quando escrevemos:

```js
<button onClick={defContador(contador + 1)}>
```

O manipulador de eventos é, neste caso, uma <i>chamada de função</i> (function call). Em muitos casos isso pode até estar ok, mas não nesta situação específica. No começo, o valor da variável <i>contador</i> é 0. Quando React renderiza o componente pela primeira vez, ele executa a chamada de função <em>defContador(0+1)</em>, e muda o valor do estado do componente para 1. 
Isso fará com que o componente seja re-renderizado, React executará a chamada da função defContador novamente e o estado mudará levando a outra re-renderização...

Vamos definir os manipuladores de eventos como fizemos antes:

```js
<button onClick={() => defContador(contador + 1)}> 
  mais+
</button>
```

Agora, o atributo do botão que define o que acontece quando o botão é clicado — <i>onClick</i> — tem o valor _() => defContador(contador + 1)_.
A função defContador é chamada somente quando um usuário clica no botão. 

Em geral, definir manipuladores de eventos dentro de templates JSX não é uma boa ideia. 
Aqui está ok, porque nossos manipuladores de eventos são bem simples. 

De qualquer jeito, vamos separar os manipuladores de eventos em funções separadas: 

```js
const App = () => {
  const [ contador, defContador ] = useState(0)

  const aumentarEmUm = () => defContador(contador + 1)
  
  const zerarContador = () => defContador(0)

  return (
    <div>
      <div>{contador}</div>
      <button onClick={aumentarEmUm}>
        mais+
      </button>
      <button onClick={zerarContador}>
        zero
      </button>
    </div>
  )
}
```




^^^^^^^^^^^
### SEM REVISÃO





Here, the event handlers have been defined correctly. The value of the <i>onClick</i> attribute is a variable containing a reference to a function:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Passing state - to child components

It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.

Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter.

One best practice in React is to [lift the state up](https://reactjs.org/docs/lifting-state-up.html) in the component hierarchy. The documentation says:

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>

So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Using the component is straightforward, as we only need to pass the state of the _counter_ to it:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

Everything still works. When the buttons are clicked and the <i>App</i> gets re-rendered, all of its children including the <i>Display</i> component are also re-rendered.

Next, let's make a <i>Button</i> component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Our <i>App</i> component now looks like this:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Since we now have an easily reusable <i>Button</i> component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.

The event handler is passed to the <i>Button</i> component through the _onClick_ prop. The name of the prop itself is not that significant, but our naming choice wasn't completely random. React's own official [tutorial](https://reactjs.org/tutorial/tutorial.html) suggests this convention.

### Changes in state cause rerendering

Let's go over the main principles of how an application works once more.

When the application starts, the code in _App_ is executed. This code uses a [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook to create the application state, setting an initial value of the variable _counter_.
This component contains the _Display_ component - which displays the counter's value, 0 - and three _Button_ components. The buttons all have event handlers, which are used to change the state of the counter.

When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function. 
**Calling a function that changes the state causes the component to rerender.**

So, if a user clicks the <i>plus</i> button, the button's event handler changes the value of _counter_ to 1, and the _App_ component is rerendered. 
This causes its subcomponents _Display_ and _Button_ to also be re-rendered. 
_Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter.

To be sure to understand how the program works, let us add some _console.log_ statements to it

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter) // highlight-line

  const increaseByOne = () => {
    console.log('increasing, value before', counter) // highlight-line
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 
    console.log('decreasing, value before', counter) // highlight-line
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter) // highlight-line
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button handleClick={increaseByOne} text="plus" />
      <Button handleClick={setToZero} text="zero" />
      <Button handleClick={decreaseByOne} text="minus" />
    </div>
  )
} 
```

Let us now see what gets rendered to the console when the buttons plus, plus, zero and minus are pressed:

![](../../images/1/31.png)

Do not ever try to guess what your code does. It is just better to use _console.log_ and <i>see with your own eyes</i> what it does.

### Refactoring the components

The component displaying the value of the counter is as follows:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

The component only uses the _counter_ field of its <i>props</i>. 
This means we can simplify the component by using [destructuring](/en/part1/component_state_event_handlers#destructuring), like so:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

The function defining the component contains only the return statement, so
we can define the function using the more compact form of arrow functions:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

We can simplify the Button component as well.

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

We can use destructuring to get only the required fields from <i>props</i>, and use the more compact form of arrow functions:

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

We can simplify the Button component once more by declaring the return statement in just one line:

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

However, be careful to not oversimplify your components, as this makes adding complexity a more tedious task down the road.

</div>
