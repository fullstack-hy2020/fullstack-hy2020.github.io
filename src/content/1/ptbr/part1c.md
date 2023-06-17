---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: ptbr
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
  // highlight-start
  const anoDeNascimento = () => {
    const anoDeHoje = new Date().getFullYear()
    return anoDeHoje - props.idade
  }
  // highlight-end

  return (
    <div>
      <p>
        Olá {props.nome}, você tem {props.idade} anos.
      </p>
      <p>Então, você nasceu provavelmente em {anoDeNascimento()}.</p> // highlight-line
    </div>
  )
}
```

A lógica para achar o ano de nascimento é separada em uma função que é chamada quando o componente é renderizado.

A idade da pessoa não precisa ser passada como parâmetro para a função, já que ela pode acessar diretamente todas as propriedades que são passadas para o componente.

Se examinarmos nosso código atual de perto, vamos perceber que a função "auxiliadora" é definida dentro de outra função que define o comportamento de nosso componente. Em Java, definir uma função dentro de outra é algo complexo e incômodo, portanto, não é algo muito comum. Em JavaScript, entretanto, definir funções dentro de funções é uma técnica amplamente usada.

### Desestruturação (Destructuring)

Antes de avançarmos, vamos dar uma olhada em uma pequena, porém útil, funcionalidade da linguagem JavaScript que foi adicionada na especificação ES6, que nos permite [desestruturar](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) (_destructuring assignment_ [atribuição via desestruturação]) valores de objetos e arrays por atribuição.

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
  // highlight-start
  const nome = props.nome
  const idade = props.idade
  // highlight-end

  const anoDeNascimento = () => new Date().getFullYear() - idade

  return (
    <div>
      <p>Olá {nome}, você tem {idade} anos</p> // highlight-line
      <p>Então, você nasceu provavelmente em {anoDeNascimento()}.</p>
    </div>
  )
}
```

Note que também utilizamos a sintaxe mais compacta para as _arrow functions_ ao definir a função _anoDeNascimento_. Como mencionado anteriormente, se uma _arrow function_ consiste em uma única expressão, então o corpo da função não precisa ser escrito dentro de chaves. Nesta forma mais compacta, a função simplesmente retorna o resultado da única expressão.

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
  const { nome, idade } = props // highlight-line
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
const Hello = ({ nome, idade }) => { // highlight-line
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

Até agora, todas as nossas aplicações foram escritas de tal forma que sua aparência permanece a mesma após a renderização inicial. E se quiséssemos criar um contador onde o valor aumentasse em função do tempo ou com um clique em um botão?

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

Fazer repetidas chamadas ao método _render_ não é a forma recomendada de re-renderização de componentes. A seguir, apresentaremos uma forma melhor para fazer essa re-renderização.

### Componente "Stateful" (ou Componente com Estado)

Todos os nossos componentes até agora foram simples no sentido de que não continham nenhum estado que pudesse mudar durante o ciclo de vida do componente.

Então, vamos adicionar um "estado" ao componente <i>App</i> com a ajuda do [state hook](https://reactjs.org/docs/hooks-state.html) (Grosso modo, "gancho de estado", isto é, são funções que permitem a você “ligar-se” aos recursos de estado (state) e ciclo de vida do React a partir de componentes funcionais) do React.

A aplicação será alterada da seguinte forma. O código de <i>index.js</i> retorna para:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

E o código de <i>App.js</i> muda para o seguinte:

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ contador, setContador ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setContador(contador + 1),
    1000
  )
// highlight-end

  return (
    <div>{contador}</div>
  )
}

export default App
```

Na primeira linha, o arquivo importa a função _useState:_

```js
import { useState } from 'react'
```

O corpo da função que define o componente começa com a chamada da função:

```js
const [ contador, setContador ] = useState(0)
```

A chamada da função adiciona <i>estado</i> (state) ao componente e o renderiza inicializado com o valor 0 (zero). A função retorna um array que contém dois itens. Atribuímos os itens às variáveis _contador_ e _setContador_ usando a sintaxe de atribuição via desestruturação mostrada anteriormente.

A variável _contador_ é atribuída ao valor inicial de <i>estado</i>, que é zero. A variável _setContador_ é atribuída a uma função que será usada para <i>modificar o estado</i>.

A aplicação chama a função [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) ("definir intervalo") e passa dois parâmetros: uma função para incrementar o estado do contador e um tempo de espera de 1000 milissegundos, que é o mesmo que 1 segundo:

```js
setTimeout(
  () => setContador(contador + 1),
  1000
)
```

A função passada como primeiro parâmetro na função _setTimeout_ é executada 1 segundo depois de ser executada a função _setContador_

```js
() => setContador(contador + 1)
```

Quando a função de modificação de estado _setContador_ é chamada, <i>o React re-renderiza o componente</i>, o que significa que o corpo da função do componente é reexecutado:

```js
() => {
  const [ contador, setContador ] = useState(0)

  setTimeout(
    () => setContador(contador + 1),
    1000
  )

  return (
    <div>{contador}</div>
  )
}
```

A segunda vez que a função do componente é executada, ela chama a função _useState_ e retorna o novo valor do estado: 1. Executar o corpo da função novamente também faz uma nova chamada de função para _setTimeout_, que executa o tempo de espera de um segundo e incrementa novamente o estado do _contador_. Por conta do valor da variável _contador_ ser 1, incrementar o valor em 1 é essencialmente a mesma coisa de uma expressão que define o valor de _contador_ para 2.

```js
() => setContador(2)
```

Enquanto isso, o antigo valor de _contador_ — "1" — é renderizado na tela.

Toda vez que o _setContador_ modifica o estado, ele faz com que o componente seja renderizado novamente. O valor do estado será incrementado novamente após um segundo, e esse evento continuará a se repetir enquanto a aplicação estiver em execução.

Se o componente não for renderizado quando você acha que deveria, ou se for renderizado no "momento errado", é possível depurar a aplicação registrando os valores das variáveis do componente no console. Se fizermos as seguintes adições ao nosso código:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

  setTimeout(
    () => setContador(contador + 1),
    1000
  )

  console.log('renderizando...', contador) // highlight-line

  return (
    <div>{contador}</div>
  )
}
```

É fácil seguir e acompanhar as chamadas feitas à função de renderização do componente <i>App</i>:

![captura de tela da função de renderização nas Ferramentas de Desenvolvimento](../../images/1/4e.png)

O console do seu navegador estava aberto? Se não estava, prometa que essa foi a última vez que precisou ser lembrado disso.

### Gerenciamento de eventos (Event handling)

Na [Parte 0](/ptbr/part0), falamos rapidamente sobre os <i>gerenciadores de eventos</i>, que são registrados para serem chamados quando eventos específicos ocorrem várias vezes. A interação de um usuário com os diferentes elementos de uma página web pode causar uma coleção de vários tipos de eventos a serem acionados.

Vamos mudar a aplicação para que o aumento do contador aconteça quando um usuário clicar em um botão, que é implementado com o elemento [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (botão).

Os elementos de botão suportam os chamados [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (Eventos de Mouse), dos quais [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) é o evento mais comum. O evento click em um botão também pode ser acionado com o teclado ou com uma tela touch screen, apesar de serem "<i>evento de mouse</i>".

Em React, registra-se uma [event handler function](https://reactjs.org/docs/handling-events.html) (função gerenciadora de eventos) para o evento <i>click</i> desta forma:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)
  
  // highlight-start
  const handleClique = () => {
    console.log('clicado')
  }
  // highlight-end

  return (
    <div>
      <div>{contador}</div>
      // highlight-start
      <button onClick={handleClique}>
        mais+
      </button>
      // highlight-end
    </div>
  )
}
```

Definimos o valor do atributo <i>onClick</i> do botão como uma referência à função _handleClique_ definida no código. 

A cada clique no botão <i>mais+</i>, a função _handleClique_ é chamada, o que significa que a cada evento de clique uma mensagem <i>clicado</i> será registrada no console do navegador.

A função gerenciadora de eventos também pode ser definida diretamente na atribuição de valor do atributo "onClick":

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

  return (
    <div>
      <div>{contador}</div>
      <button onClick={() => console.log('clicado')}> // highlight-line
        mais+
      </button>
    </div>
  )
}
```

Ao mudar a função gerenciadora de eventos para a seguinte forma:
```js
<button onClick={() => setContador(contador + 1)}>
  mais+
</button>
```

atingimos o comportamento desejado, ou seja, o valor de _contador_ é incrementado em 1 <i>e</i> o componente é re-renderizado.

Vamos também adicionar um botão para redefinir o contador:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

  return (
    <div>
      <div>{contador}</div>
      <button onClick={() => setContador(contador + 1)}>
        mais+
      </button>
      // highlight-start
      <button onClick={() => setContador(0)}> 
        zerar
      </button>
      // highlight-end
    </div>
  )
}
```

Nossa aplicação está pronta!

### Um gerenciador de evento é uma função

Definimos os gerenciadores de eventos para os nossos botões, onde declaramos seus atributos <i>onClick</i>:

```js
<button onClick={() => setContador(contador + 1)}> 
  mais+
</button>
```

E se tentássemos definir os gerenciadores de eventos de uma forma mais simples? O que aconteceria?

```js
<button onClick={setContador(contador + 1)}> 
  mais+
</button>
```

Quebraria completamente nossa aplicação:

![captura de tela de erro de re-renderizadores](../../images/1/5c.png)

O que está acontecendo? Um gerenciador de evento deve ser uma <i>função</i> ou uma <i>referência de função</i>. Quando escrevemos:

```js
<button onClick={setContador(contador + 1)}>
```

O gerenciador de evento é, neste caso, uma <i>chamada de função</i> (_function call_). Em muitos casos isso pode até estar ok, mas não nesta situação específica. No começo, o valor da variável <i>contador</i> é 0. Quando React renderiza o componente pela primeira vez, ele executa a chamada de função <em>setContador(0+1)</em>, e muda o valor do estado do componente para 1. 
Isso fará com que o componente seja re-renderizado, React executará a chamada da função setContador novamente e o estado mudará levando a outra re-renderização...

Vamos definir os gerenciadores de eventos como fizemos antes:

```js
<button onClick={() => setContador(contador + 1)}> 
  mais+
</button>
```

Agora, o atributo do botão que define o que acontece quando o botão é clicado — <i>onClick</i> — tem o valor _() => setContador(contador + 1)_.
A função setContador é chamada somente quando um usuário clica no botão. 

Em geral, definir gerenciadores de eventos dentro de templates JSX não é uma boa ideia. 
Aqui está ok, porque nossos gerenciadores de eventos são bem simples. 

De qualquer jeito, vamos colocar os gerenciadores de eventos em funções separadas: 

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

// highlight-start
  const aumentarEmUm = () => setContador(contador + 1)
  
  const zerarContador = () => setContador(0)
// highlight-end

  return (
    <div>
      <div>{contador}</div>
      <button onClick={aumentarEmUm}> // highlight-line
        mais+
      </button>
      <button onClick={zerarContador}> // highlight-line
        zerar
      </button>
    </div>
  )
}
```
Aqui, os gerenciadores de eventos foram definidos corretamente. O valor do atributo <i>onClick</i> é uma variável que contém referência a uma função:

```js
<button onClick={aumentarEmUm}> 
  mais+
</button>
```

### Passagem de Estado para Componentes-filho

Recomenda-se escrever componentes React pequenos e reutilizáveis ​​em toda a aplicação, e até mesmo em projetos. Vamos refatorar nossa aplicação para que seja composta por três componentes menores: um componente para exibir o contador e dois componentes para os botões.

Vamos implementar primeiro um componente <i>Exibir</i>, que é responsável pela exibição do valor do contador.

Uma boa prática em React é [elevar o estado](https://reactjs.org/docs/lifting-state-up.html) (_lift the state up_) na hierarquia de componentes. A documentação diz:

> <i>Com frequência, a modificação de um dado tem que ser refletida em vários componentes. Recomendamos elevar o estado compartilhado ao elemento pai comum mais próximo.</i>

Vamos colocar o estado da aplicação no componente <i>App</i> e passá-lo para o componente <i>Exibir</i> através de <i>props</i>:

```js
const Exibir = (props) => {
  return (
    <div>{props.contador}</div>
  )
}
```

O uso do componente é direto, objetivo, já que precisamos apenas passar o estado do _contador_ para ele:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

  const aumentarEmUm = () => setContador(contador + 1)
  const zerarContador = () => setContador(0)

  return (
    <div>
      <Exibir contador={contador}/> // highlight-line
      <button onClick={aumentarEmUm}>
        mais+
      </button>
      <button onClick={zerarContador}> 
        zerar
      </button>
    </div>
  )
}
```

Tudo ainda está funcionando. Quando os botões são clicados e o <i>App</i> é re-renderizado, todos os seus filhos, incluindo o componente <i>Exibir</i>, também são re-renderizados.

Agora, vamos criar um componente <i>Botao</i> para os botões da nossa aplicação. Temos que passar o gerenciador de evento, bem como o título do botão, através das props do componente:

```js
const Botao = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.texto}
    </button>
  )
}
```

O nosso componente <i>App</i> fica assim:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)

  const aumentarEmUm = () => setContador(contador + 1)
  //highlight-start
  const diminuirEmUm = () => setContador(contador - 1) 
  //highlight-end
  const zerarContador = () => setContador(0)

  return (
    <div>
      <Exibir contador={contador}/>
      // highlight-start
      <Botao
        onClick={aumentarEmUm}
        texto='mais+'
      />
      <Botao
        onClick={zerarContador}
        texto='zerar'
      />     
      <Botao
        onClick={diminuirEmUm}
        texto='menos-'
      />
      // highlight-end           
    </div>
  )
}
```

Por conta de agora termos disponível um componente <i>Botao</i> facilmente reutilizável, também implementamos uma nova funcionalidade em nossa aplicação, adicionando um botão que pode ser usado para decrementar o contador.

O gerenciador de evento é passado para o componente <i>Botao</i> através da prop _onClick_. O nome da prop em si não é algo tão significativo, mas a escolha do nome que colocamos não foi de todo aleatória. O próprio [tutorial oficial do React](https://reactjs.org/tutorial/tutorial.html) sugere essa convenção.

### Alterações no estado causam re-renderização

Vamos revisar, mais uma vez, os princípios mais importantes de como uma aplicação funciona.

Quando a aplicação inicia, o código em _App_ é executado. Este código usa um hook [useState](https://reactjs.org/docs/hooks-reference.html#usestate) para criar o estado da aplicação, definindo um valor inicial da variável _contador_.
Este componente contém o componente _Exibir_ — que exibe o valor do contador, 0 — e três componentes _Botao_. Os botões possuem gerenciadores de eventos, que são usados para mudar o estado do contador.

Quando um dos botões é clicado, o gerenciador de evento é executado. O gerenciador de evento muda o estado do componente _App_ com a função _setContador_. 
**Chamar uma função que muda o estado faz com que o componente seja re-renderizado.**

Então, se um usuário clicar no botão <i>mais+</i>, o gerenciador de evento do botão muda o valor de _contador_ para 1, e o componente _App_ é re-renderizado. 
Isso faz com que seus subcomponentes _Exibir_ e _Botao_ também sejam re-renderizados. 
_Exibir_ recebe o novo valor do contador, 1, como props. Os componentes _Botao_ recebem gerenciadores de eventos que podem ser usados para mudar o estado do contador.

Para ter certeza de que você entendeu como o programa funciona, vamos adicionar algumas declarações _console.log_ a ele:

```js
const App = () => {
  const [ contador, setContador ] = useState(0)
  console.log('renderizando com o valor do contador em', contador) // highlight-line

  const aumentarEmUm = () => {
    console.log('aumentando, valor anterior', contador) // highlight-line
    setContador(contador + 1)
  }

  const diminuirEmUm = () => { 
    console.log('diminuindo, valor anterior', contador) // highlight-line
    setContador(contador - 1)
  }

  const zerarContador = () => {
    console.log('zerando, valor anterior', contador) // highlight-line
    setContador(0)
  }

  return (
    <div>
      <Exibir contador={contador} />
      <Botao handleClique={aumentarEmUm} texto="mais+" />
      <Botao handleClique={zerarContador} texto="zerar" />
      <Botao handleClique={diminuirEmUm} texto="menos-" />
    </div>
  )
} 
```

Vejamos agora o que é renderizado no console quando os botões "mais+", "zerar" e "menos-" são clicados:

![navegador mostrando o console com a renderização de valores em destaque](../../images/1/31.png)

Nunca tente adivinhar o que o seu código faz. É melhor usar _console.log_ e <i>ver com seus próprios olhos</i> o que ele faz.

### Refatorando os Componentes

O componente que exibe o valor do contador é o seguinte:

```js
const Exibir = (props) => {
  return (
    <div>{props.contador}</div>
  )
}
```

O componente só usa o campo _contador_ de suas <i>props</i>.
Isso significa que podemos simplificar o componente usando [desestruturação](/ptbr/part1/estado_do_componente_gerenciadores_de_eventos#desestruturacao-destructuring), desta forma:

```js
const Exibir = ({ contador }) => {
  return (
    <div>{contador}</div>
  )
}
```

A função que define o componente contém apenas a instrução de retorno, então
podemos definir a função usando a forma mais compacta das _arrow functions_:

```js
const Exibir = ({ contador }) => <div>{contador}</div>
```

Também podemos simplificar o componente <i>Botao</i>:

```js
const Botao = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.texto}
    </button>
  )
}
```

Podemos usar a desestruturação para obter apenas os campos necessários de <i>props</i> e usar a forma mais compacta de arrow functions:

```js
const Botao = ({ onClick, texto }) => (
  <button onClick={onClick}>
    {texto}
  </button>
)
```

Podemos simplificar ainda mais o componente Botao, fazendo com que a declaração de retorno caiba em apenas uma linha:

```js
const Botao = ({ onClick, texto }) => <button onClick={onClick}>{texto}</button>
```

Porém, tenha cuidado para não simplificar demais seus componentes, porque pode ficar mais difícil lidar com a complexidade do código à medida em que ele for crescendo em tamanho.

</div>
