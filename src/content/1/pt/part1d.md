---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: pt
---

<div class="content">

### Um estado complexo (complex state)

Em nosso exemplo anterior, o estado da aplicação era simples, pois consistia em apenas um número inteiro. E se a nossa aplicação precisar de um estado mais complexo?

Na maioria dos casos, a maneira mais fácil e melhor de fazer isso é usando a função _useState_ múltiplas vezes para criar "pedaços" (pieces) separados de estado.

No código a seguir, criamos dois pedaços de estado para a aplicação, chamados _esquerda_ e _direita_, ambos com o valor inicial 0:

```js
const App = () => {
  const [esquerda, defEsquerda] = useState(0) // ou "definirEsquerda"
  const [direita, defDireita] = useState(0) // ou "definirDireita"

  return (
    <div>
      {esquerda}
      <button onClick={() => defEsquerda(esquerda + 1)}>
        Esquerda
      </button>
      <button onClick={() => defDireita(direita + 1)}>
        Direita
      </button>
      {direita}
    </div>
  )
}
```

O componente tem acesso às funções _defEsquerda_ e _defDireita_, que podem ser usadas para atualizar os dois pedaços de estado.

O estado ou um pedaço de estado do componente pode ser de qualquer tipo. Poderíamos implementar a mesma funcionalidade salvando a contagem de cliques tanto dos botões "<i>esquerda</i>" quanto "<i>direita</i>" em um único objeto:
```js
{
  esquerda: 0,
  direita: 0
}
```

Nesse caso, a aplicação ficaria assim:

```js
const App = () => {
  const [cliques, defCliques] = useState({ // ou "definirCliques"
    esquerda: 0, direita: 0
  })

  const manipCliqueEsquerda = () => {
    /* "handleLeftClick" pode ser traduzido, grosso modo,
    como "manipularCliqueEsquerda". Versão reduzida: "manipCliqueEsquerda". */
    const novosCliques = { 
      esquerda: cliques.esquerda + 1, 
      direita: cliques.direita 
    }
    defCliques(novosCliques)
  }

  const manipCliqueDireita = () => {
    /* A mesma lógica aplica-se à (variável) constante "handleRightClick". */
    const novosCliques = { 
      esquerda: cliques.esquerda, 
      direita: cliques.direita + 1 
    }
    defCliques(novosCliques)
  }

  return (
    <div>
      {cliques.esquerda}
      <button onClick={manipCliqueEsquerda}>Esquerda</button>
      <button onClick={manipCliqueDireita}>Direita</button>
      {cliques.direita}
    </div>
  )
}
```

Agora, o componente tem apenas um único pedaço de estado, e os manipuladores de eventos precisam cuidar da mudança do <i>estado inteiro da aplicação</i>.

O formato do manipulador de eventos parece confuso aqui. Quando o botão da esquerda é clicado, a seguinte função é chamada:
```js
const manipCliqueEsquerda = () => {
  const novosCliques = { 
    esquerda: cliques.esquerda + 1, 
    direita: cliques.direita 
  }
  defCliques(novosCliques)
}
```

O objeto a seguir é definido como o novo estado da aplicação:
```js
{
  esquerda: cliques.esquerda + 1,
  direita: cliques.direita
}
```

O novo valor da propriedade <i>esquerda</i> agora é o mesmo que o valor de <i>esquerda + 1</i> do estado anterior, e o valor da propriedade <i>direita</i> é o mesmo que o valor da propriedade <i>direita</i> do estado anterior.

Podemos definir mais claramente o novo objeto de estado usando a ([sintaxe de espalhamento](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)) (Spread syntax (...)) que foi adicionada à especificação da linguagem no verão de 2018:

```js
const manipCliqueEsquerda = () => {
  const novosCliques = { 
    ...cliques, 
    esquerda: cliques.esquerda + 1 
  }
  defCliques(novosCliques)
}

const manipCliqueDireita = () => {
  const novosCliques = { 
    ...cliques, 
    direita: cliques.direita + 1 
  }
  defCliques(novosCliques)
}
```

A sintaxe pode parecer um tanto estranha no começo. Na prática, <em>{ ...cliques }</em> cria um novo objeto que tem cópias de todas as propriedades do objeto _cliques_. Quando discriminamos uma propriedade específica — por exemplo, <i>direita</i> em <em>{ ...cliques, direita: 1 }</em>, o valor da propriedade _direita_ no novo objeto será 1.

No exemplo acima, este trecho...

```js
{ ...cliques, direita: cliques.direita + 1 }
```

... cria uma cópia do objeto _cliques_, onde o valor da propriedade _direita_ é aumentado em 1.

Não é necessário atribuir o objeto a uma variável nos manipuladores de eventos, e podemos simplificar as funções da seguinte maneira:

```js
const manipCliqueEsquerda = () =>
  defCliques({ ...cliques, esquerda: cliques.esquerda + 1 })

const manipCliqueDireita = () =>
  defCliques({ ...cliques, direita: cliques.direita + 1 })
```

A aplicação parece funcionar. Entretanto, <i> em React, é proibido mudar (mutate) o estado diretamente</i>, já que [pode resultar em efeitos colaterais inesperados](https://stackoverflow.com/a/40309023). A mudança de estado sempre tem que ser feita pela definição/atribuição do estado a um novo objeto. Se as propriedades do objeto de estado anterior não forem alteradas, podem simplesmente ser copiadas, que se dá copiando essas propriedades em um novo objeto e definindo-o como o novo estado.

Armazenar todo o estado em um único objeto de estado é uma má escolha para esta aplicação, especificamente; não há qualquer benefício aparente, e a aplicação resultante fica muito mais complexa. Neste caso, armazenar os contadores de cliques em pedaços separados de estado é uma escolha muito mais adequada.

Há situações em que pode ser benéfico armazenar um pedaço de estado da aplicação em uma estrutura de dados mais complexa. [A documentação oficial de React](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contém algumas orientações úteis sobre o assunto.

### Manipulando Arrays

Vamos adicionar um pedaço de estado à nossa aplicação contendo o array _todosOsCliques_, que lembra cada clique que ocorreu na aplicação.

```js
const App = () => {
  const [esquerda, defEsquerda] = useState(0)
  const [direita, defDireita] = useState(0)
  const [todosOsCliques, defTodos] = useState([])

  const manipCliqueEsquerda = () => {
    defTodos(todosOsCliques.concat('E'))
    defEsquerda(esquerda + 1)
  } 

  const manipCliqueDireita = () => {
    defTodos(todosOsCliques.concat('D'))
    defDireita(direita + 1)
  }

  return (
    <div>
      {esquerda}
      <button onClick={manipCliqueEsquerda}>Esquerda</button>
      <button onClick={manipCliqueDireita}>Direita</button>
      {direita}
      <p>{todosOsCliques.join(' ')}</p>
    </div>
  )
}
```
 
Cada clique é armazenado em um pedaço separado de estado chamado _todosOsCliques_, que é inicializado como um array vazio:

```js
const [todosOsCliques, defTodos] = useState([])
```

Quando o botão <i>Esquerda</i> é clicado, adicionamos a letra <i>E</i> ao array _todosOsCliques_:

```js
const manipCliqueEsquerda = () => {
  defTodos(todosOsCliques.concat('E'))
  defEsquerda(esquerda + 1)
}
```

O pedaço de estado armazenado em _todosOsCliques_ agora é definido para ser um array que contém todos os itens do array anterior mais a letra <i>E</i>. O método [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) (concatenar) adiciona o novo item ao array, que não muda o array existente, mas sim retorna uma <i>nova cópia do array</i> com o item adicionado a ele.

Como mencionado anteriormente, também é possível em JavaScript adicionar itens a um array com o método [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) (Significa, literalmente, "empurrar", "apertar", "pressionar". Porém, nestes termos, o método push() ADICIONA um ou mais elementos ao final de um array e retorna o novo comprimento desse array). Se adicionarmos o item "empurrando-o" para o array _todosOsCliques_ e então atualizando o estado, a aplicação ainda aparentará funcionar:

```js
const manipCliqueEsquerda = () => {
  todosOsCliques.push('E')
  defTodos(todosOsCliques)
  defEsquerda(esquerda + 1)
}
```

No entanto, __não__ faça isso. Como mencionado anteriormente, o estado dos componentes em React, tal como _todosOsCliques_, não devem ser mudados diretamente. Mesmo se estado mudado parecer funcionar em alguns casos, tal decisão pode levar a erros no código muito difíceis de depurar.

Vamos olhar mais de perto em como o clique é renderizado na página:

```js
const App = () => {
  // ...

  return (
    <div>
      {esquerda}
      <button onClick={manipCliqueEsquerda}>Esquerda</button>
      <button onClick={manipCliqueDireita}>Direita</button>
      {direita}
      <p>{todosOsCliques.join(' ')}</p>
    </div>
  )
}
```

Chamamos o método [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (juntar, conectar) no array _todosOsCliques_ que une todos os itens em uma única string, separados pela string passada como parâmetro da função, que em nosso caso é um espaço vazio.

### Renderização Condicional

Vamos modificar nossa aplicação para que a renderização do histórico de cliques seja gerenciada por um novo componente chamado <i>Historico</i> (*Histórico):

```js
const Historico = (props) => {
  if (props.todosOsCliques.length === 0) {
    return (
      <div>
        Clique em um dos botões para usar a aplicação!
      </div>
    )
  }

  return (
    <div>
      Histórico de cliques nos botões: {props.todosOsCliques.join(' ')}
    </div>
  )
}

const App = () => {
  // ...

  return (
    <div>
      {esquerda}
      <button onClick={manipCliqueEsquerda}>Esquerda</button>
      <button onClick={manipCliqueDireita}>Direita</button>
      {direita}
      <Historico todosOsCliques={todosOsCliques} />
    </div>
  )
}
```

Agora, o comportamento do componente depende se algum dos botões foi clicado ou não. Se não, ou seja, o array <em>todosOsCliques</em> estando vazio, o componente renderiza um elemento "div" com algumas instruções:

```js
<div>Clique em um dos botões para usar a aplicação!</div>
```

E em todos os outros casos, o componente renderiza o histórico de cliques:

```js
<div>
  Histórico de cliques nos botões: {props.todosOsCliques.join(' ')}
</div>
```

O componente <i>Historico</i> renderiza elementos React completamente diferentes dependendo do estado da aplicação. Isso é chamado de <i>renderização condicional</i> (conditional rendering).

React também oferece muitas outras formas de fazer [renderização condicional](https://reactjs.org/docs/conditional-rendering.html). Veremos isso na prática na [Parte 2](/pt/part2).

Vamos fazer mais uma modificação a nossa aplicação, refatorando-a para usar o componente _Botao_ que definimos anteriormente:

```js
const Historico = (props) => {
  if (props.todosOsCliques.length === 0) {
    return (
      <div>
        Clique em um dos botões para usar a aplicação!
      </div>
    )
  }

  return (
    <div>
      Histórico de cliques nos botões: {props.todosOsCliques.join(' ')}
    </div>
  )
}

const Botao = ({ manipClique, texto }) => (
  <button onClick={manipClique}>
    {texto}
  </button>
)

const App = () => {
  const [esquerda, defEsquerda] = useState(0)
  const [direita, defDireita] = useState(0)
  const [todosOsCliques, defTodos] = useState([])

  const manipCliqueEsquerda = () => {
    defTodos(todosOsCliques.concat('E'))
    defEsquerda(esquerda + 1)
  }

  const manipCliqueDireita = () => {
    defTodos(todosOsCliques.concat('D'))
    defDireita(direita + 1)
  }

  return (
    <div>
      {esquerda}
      <Botao manipClique={manipCliqueEsquerda} texto='Esquerda' />
      <Botao manipClique={manipCliqueDireita} texto='Direita' />
      {direita}
      <Historico todosOsCliques={todosOsCliques} />
    </div>
  )
}
```

### React antigo

Neste curso, usamos o [state hook](https://reactjs.org/docs/hooks-state.html) ("gancho de estado") para adicionar estado aos nossos componentes React, que faz parte das versões mais recentes da biblioteca e está disponível a partir da versão [16.8.0](https://www.npmjs.com/package/react/v/16.8.0) em diante. Antes da adição dos hooks, não havia maneira de adicionar estado a componentes funcionais. Componentes que precisavam de estado tinham que ser definidos como componentes de [classe](https://reactjs.org/docs/react-component.html), usando a sintaxe de classe JavaScript.

Neste curso, fizemos a decisão um pouco radical de usar exclusivamente hooks desde o primeiro dia, para garantir que estamos aprendendo as variações atuais e futuras de React. Embora os componentes funcionais sejam o futuro da biblioteca, ainda é importante aprender a sintaxe de classe, já que existem bilhões de linhas de código React legado que você pode acabar fazendo manutenção algum dia. O mesmo se aplica à documentação e exemplos de React que você pode encontrar na internet.

Vamos aprender mais sobre componentes de classe React mais tarde no curso.

### Depuração de aplicações React

Grande parte do tempo de um desenvolvedor é gasto na depuração e na leitura de códigos existentes. De vez em quando, conseguimos escrever uma ou duas linhas de código novo, mas grande parte do nosso tempo é gasto tentando descobrir por que algo está quebrado ou como algo funciona. Boas práticas e ferramentas de depuração são extremamente importantes por esta razão.

Felizmente para nós, React é uma biblioteca extremamente amigável para com os desenvolvedores quando se trata de depuração.

Antes de continuarmos, vamos nos lembrar de uma das regras mais importantes do desenvolvimento web.

<h4>A primeira regra do desenvolvimento web</h4>

>  **Mantenha o Console do navegador aberto o tempo todo.**
>
> A guia <i>Console</i> em particular deve estar sempre aberta, a menos que haja uma razão específica para visualizar outra guia.

Mantenha tanto o seu código quanto a página web abertos juntos **o tempo todo**.

Se e quando seu código não compilar e seu navegador brilhar igual uma árvore de Natal,...

![captura de tela do código](../../images/1/6x.png)

... não escreva nenhuma linha de código a mais, mas encontre e corrija **imediatamente** o problema. Ainda não aconteceu na história da programação de o código que não estivesse compilando começasse a funcionar após a adição de mais linhas de código. Duvido que tal evento ocorra durante este curso também.

A depuração (debug) "old-school", baseada na impressão no Console, é sempre uma das melhores opções. Se o componente...

```js
const Botao = ({ manipClique, texto }) => (
  <button onClick={manipClique}>
    {texto}
  </button>
)
```

... não estiver funcionando como desejado, é útil começar a imprimir suas variáveis ​​no console. Para que isso funcione, devemos transformar nossa função na forma menos compactada e receber todo o objeto "props" sem desestruturá-lo de forma imediata:

```js
const Botao = (props) => { 
  console.log(props)
  const { manipClique, texto } = props
  return (
    <button onClick={manipClique}>
      {texto}
    </button>
  )
}
```

Isso revelará imediatamente se, por exemplo, um dos atributos foi escrito incorretamente ao usar o componente.

**N.B.:** Quando você usar _console.log_ para depuração, não combine _objetos (objects)_ do jeito Java de se fazer usando o operador de adição. Em vez de escrever...

```js
console.log('o valor de props é ' + props)
```

... separe as coisas que você deseja registrar no console com uma vírgula:

```js
console.log('o valor de props é', props)
```

Se você usar do jeito Java de concatenar uma string com um objeto, aparecerá uma mensagem de log muito pouco informativa:

```js
o valor de props é [object Object]
```

Registrar a saída no console não é de maneira alguma a única forma de depurar nossas aplicações. Você pode pausar a execução do código da sua aplicação no _depurador (debugger)_ no Console do Desenvolvedor do Chrome, escrevendo o comando [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) em qualquer lugar do seu código.

A execução será pausada assim que chegar a um ponto onde o comando _debugger_ for executado:

![debugger pausado na Ferramenta do Desenvolvedor](../../images/1/7a.png)

Ao ir para a guia <i>Console</i>, é fácil inspecionar o estado atual das variáveis:

![captura de tela de inspeção de console](../../images/1/8a.png)

Uma vez que a causa do erro é descoberta, é possível remover o comando _debugger_ e atualizar a página.

O depurador também nos permite executar nosso código linha por linha com os controles encontrados na parte direita da guia <i>Fontes</i> (sources).

Você também pode acessar o depurador sem o comando _debugger_, adicionando pontos de interrupção na guia <i>Fontes</i>. Inspecionar os valores das variáveis do componente pode ser feito na seção _Escopo (Scope)_:

![exemplo de ponto de interrupção nas ferramentas do desenvolvedor](../../images/1/9a.png)

É extremamente recomendado adicionar a extensão [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) ao Chrome. Ele adiciona uma nova guia _Components_ às ferramentas de desenvolvedor. A nova guia de ferramentas de desenvolvedor pode ser usada para inspecionar os diferentes elementos React na aplicação, juntamente com seu estado e props:

![captura de tela da extensão de ferramentas de desenvolvedor React](../../images/1/10ea.png)

O estado do componente _App_ é definido assim:

```js
const [esquerda, defEsquerda] = useState(0)
const [direita, defDireita] = useState(0)
const [todosOsCliques, defTodos] = useState([])
```

As ferramentas do desenvolvedor mostram o estado dos hooks na ordem de sua definição:

![estado dos hooks nas ferramentas do desenvolvedor React](../../images/1/11ea.png)

O primeiro <i>State</i> (Estado) contém o valor do estado <i>esquerda</i>; a próxima contém o valor do estado <i>direita</i> e a última contém o valor do estado <i>todosOsCliques</i>.

### Regras dos Hooks

Há algumas limitações e regras que devemos seguir para garantir que a nossa aplicação use corretamente as funções de estado baseadas em hooks.

A função _useState_ ("usarEstado", assim como a função _useEffect_, ou "usarEfeito", introduzida mais tarde neste curso) <i>não deve ser chamada</i> dentro de um loop, uma expressão condicional ou qualquer lugar que não seja uma função que define um componente. Assim deve ser para garantir que os hooks sejam sempre chamados na mesma ordem e, se isso não acontecer, a aplicação se comportará erraticamente.

Resumindo, hooks só podem ser chamados de dentro do corpo de uma função que define um componente React:

```js
const App = () => {
  // Desta forma funciona!
  const [idade, defIdade] = useState(0)
  const [nome, defNome] = useState('Juha Tauriainen')

  if ( idade > 10 ) {
    // Desta forma não funciona!
    const [foobar, defFoobar] = useState(null)
  }

  for ( let i = 0; i < idade; i++ ) {
    // Esta forma também não é boa!
    const [formaCorreta, defFormaCorreta] = useState(false)
  }

  const bemRuim = () => {
    // E esta aqui é ilegal!
    const [x, defX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Manipulação de Eventos Revisitados

A manipulação de eventos se mostrou um tópico difícil em iterações anteriores neste curso.

Por esta razão, revisaremos o tópico.

Vamos supor que estejamos desenvolvendo essa aplicação simples com o seguinte componente <i>App</i>:
```js
const App = () => {
  const [valor, defValor] = useState(10)

  return (
    <div>
      {valor}
      <button>zerar</button>
    </div>
  )
}
```

Queremos que o clique do botão reinicialize o estado armazenado na variável _valor_.

Para fazer com que o botão reaja a um evento de clique, precisamos adicionar um <i>manipulador de eventos</i> a ele.

Os manipuladores de eventos devem sempre ser uma função ou uma referência a uma função. O botão não funcionará se o manipulador de eventos for definido como uma variável de outro tipo.

Se definíssemos o manipulador de eventos como uma string...

```js
<button onClick="lixo...">botão</button>
```

... React nos avisaria sobre isso no console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
/* index.js:2178 Aviso: Esperava-se que o ouvinte `onClick` fosse uma função, mas obteve-se um valor do tipo `string`. */
    em botão (at index.js:20)
    em div (at index.js:18)
    em App (at index.js:27)
```

O seguinte também não funcionaria:

```js
<button onClick={valor + 1}>botão</button>
```

Tentamos definir o manipulador de eventos como _valor + 1_, o que simplesmente retorna o resultado da operação. React nos avisará sobre isso no console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
/* index.js:2178 Aviso: Esperava-se que o ouvinte `onClick` fosse uma função, mas obteve-se um valor do tipo `number`. */
```

Este também não funcionaria:
```js
<button onClick={valor = 0}>botão</button>
```

O manipulador de eventos não é uma função, mas uma **atribuição de variável**, e React, mais uma vez, emitirá um aviso no console. Esta tentativa também é falha no sentido de que nunca devemos mudar o estado diretamente em React.

Vejamos o próximo exemplo:

```js
<button onClick={console.log('clicou no botão')}>
  botão
</button>
```

A mensagem é impressa no console assim que o componente é renderizado, mas nada acontece quando clicamos no botão. Por que não funciona mesmo quando nosso manipulador de eventos contém a função _console.log_?

O problema aqui é que nosso manipulador de eventos é definido como uma <i>chamada de função</i>, o que significa que o manipulador de eventos é atribuído ao valor retornado da função, que no caso de _console.log_ é <i>undefined</i> (indefinido).

A função _console.log_ é chamada quando o componente é renderizado e, por esse motivo, é impresso uma vez no console.

A tentativa a seguir também não funciona:
```js
<button onClick={setValue(0)}>botão</button>
```

Novamente, tentamos definir uma chamada de função como o manipulador de eventos. Isso não funciona. Essa tentativa específica também causa outro problema. Quando o componente é renderizado, a função _setValue(0)_ é executada, o que por sua vez faz com que o componente seja renderizado novamente. A re-renderização, por conseguinte, chama _setValue(0)_ novamente, resultando em uma recursão infinita.

A execução de uma chamada de função específica quando o botão é clicado pode ser realizada da seguinte maneira:

```js
<button onClick={() => console.log('clicou no botão')}>
  botão
</button>
```

Agora, o manipulador de eventos é uma função definida com a sintaxe de função de seta _() => console.log('clicou no botão')_. Quando o componente é renderizado, nenhuma função é chamada e apenas a referência à função de seta é definida como o manipulador de eventos. A chamada da função ocorre apenas quando o botão é clicado.

Podemos implementar a reinicialização do estado em nossa aplicação com essa mesma técnica:

```js
<button onClick={() => setValue(0)}>botão</button>
```

O manipulador de eventos agora é a função _() => setValue(0)_.

Definir manipuladores de eventos diretamente no atributo do botão nem sempre é a melhor opção a se aplicar.

Você verá frequentemente manipuladores de eventos definidos em um lugar separado. Na versão seguinte de nossa aplicação, definimos uma função que então é atribuída à variável _manipClique_ no corpo da função do componente:

```js
const Aplic = () => {
  const [valor, defValor] = useState(10)

  const manipClique = () =>
    console.log('clicou no botão')

  return (
    <div>
      {valor}
      <button onClick={manipClique}>botão</button>
    </div>
  )
}
```

Agora, a variável _manipClique_ está atribuída a uma referência à função. A referência é passada ao botão como o atributo <i>onClick</i>:

```js
<button onClick={manipClique}>botão</button>
```

Naturalmente, nossa função manipuladora de eventos pode ser composta por múltiplos comandos. Nestes casos, usamos a sintaxe de chaves mais longa para funções de seta:

```js
const Aplicacao = () => {
  const [valor, defValor] = useState(10)

  const manipClique = () => {
    console.log('clicou no botão')
    defValor(0)
  }

  return (
    <div>
      {valor}
      <button onClick={manipClique}>botão</button>
    </div>
  )
}
```

^^^^^^^^^^^
### REVISADO








### A function that returns a function

Another way to define an event handler is to use a <i>function that returns a function</i>.

You probably won't need to use functions that return functions in any of the exercises in this course.  If the topic seems particularly confusing, you may skip over this section for now and return to it later.

Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello world')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

The code functions correctly even though it looks complicated. 

The event handler is now set to a function call:

```js
<button onClick={hello()}>button</button>
```

Earlier on we stated that an event handler may not be a call to a function and that it has to be a function or a reference to a function. Why then does a function call work in this case?

When the component is rendered, the following function gets executed:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

The <i>return value</i> of the function is another function that is assigned to the _handler_ variable.

When React renders the line:

```js
<button onClick={hello()}>button</button>
```

It assigns the return value of _hello()_ to the onClick attribute. Essentially the line gets transformed into:

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

Since the _hello_ function returns a function, the event handler is now a function.

What's the point of this concept?

Let's change the code a tiny bit:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end  

  return (
    <div>
      {value}
  // highlight-start      
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end      
    </div>
  )
}
```

Now the application has three buttons with event handlers defined by the _hello_ function that accepts a parameter.

The first button is defined as

```js
<button onClick={hello('world')}>button</button>
```

The event handler is created by <i>executing</i> the function call _hello('world')_. The function call returns the function:

```js
() => {
  console.log('hello', 'world')
}
```

The second button is defined as:

```js
<button onClick={hello('react')}>button</button>
```

The function call _hello('react')_ that creates the event handler returns:

```js
() => {
  console.log('hello', 'react')
}
```

Both buttons get their individualized event handlers.

Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The _hello_ function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

Our current definition is slightly verbose:

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Let's eliminate the helper variables and directly return the created function:

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Since our _hello_ function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Lastly, let's write all of the arrows on the same line:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

We can use the same trick to define event handlers that set the state of the component to a given value. Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  // highlight-end
  
  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

When the component is rendered, the <i>thousand</i> button is created:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

The event handler is set to the return value of _setToValue(1000)_ which is the following function:

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

The increase button is declared as follows:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

The event handler is created by the function call _setToValue(value + 1)_ which receives as its parameter the current value of the state variable _value_ increased by one. If the value of _value_ was 10, then the created event handler would be the function:

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

Using functions that return functions is not required to achieve this functionality. Let's return the _setToValue_ function which is responsible for updating state into a normal function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

We can now define the event handler as a function that calls the _setToValue_ function with an appropriate parameter. The event handler for resetting the application state would be:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.

### Passing Event Handlers to Child Components

Let's extract the button into its own component:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

The component gets the event handler function from the _handleClick_ prop, and the text of the button from the _text_ prop. Lets use the new component:

```js
const App = (props) => {
  // ...
  return (
    <div>
      {value}
      <Button handleClick={setToValue(1000)} text="thousand" /> // highlight-line
      <Button handleClick={setToValue(0)} text="reset" /> // highlight-line
      <Button handleClick={setToValue(value + 1)} text="increment" /> // highlight-line
    </div>
  )
}
```

Using the <i>Button</i> component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

![using correct attribute names code screenshot](../../images/1/12e.png)

### Do Not Define Components Within Components

Let's start displaying the value of the application in its <i>Display</i> component.

We will change the application by defining a new component inside of the <i>App</i> component.

```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

The application still appears to work, but **don't implement components like this!** Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. The biggest problems are because React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.

Let's instead move the <i>Display</i> component function to its correct place, which is outside of the <i>App</i> component function:

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### Useful Reading

The internet is full of React-related material. However, we use the new style of React for which a large majority of the material found online is outdated.

You may find the following links useful:

- The [official React documentation](https://reactjs.org/docs/hello-world.html) is worth checking out at some point, although most of it will become relevant only later on in the course. Also, everything related to class-based components is irrelevant to us;
- Some courses on [Egghead.io](https://egghead.io) like [Start learning React](https://egghead.io/courses/start-learning-react) are of high quality, and the recently updated [Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) is also relatively good; both courses introduce concepts that will also be introduced later on in this course. **NB** The first one uses class components but the latter uses the new functional ones.

### Web programmers oath

Programming is hard, that is why I will use all the possible means to make it easier
- I will have my browser developer console open all the time
- I progress with small steps
- I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpointing problems
- If my code does not work, I will not write more code. Instead I start deleting the code until it works or just return to a state when everything was still working
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](http://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam) how to ask for help

</div>

<div class="tasks">

<h3>Exercises 1.6.-1.14.</h3>

Submit your solutions to the exercises by first pushing your code to GitHub and then marking the completed exercises into 
the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Remember, submit **all** the exercises of one part **in a single submission**. Once you have submitted your solutions for one part, **you cannot submit more exercises to that part anymore**.

<i>Some of the exercises work on the same application. In these cases, it is sufficient to submit just the final version of the application. If you wish, you can make a commit after every finished exercise, but it is not mandatory.</i>

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.

In some situations you may also have to run the command below from the root of the project:

``` 
rm -rf node_modules/ && npm i
```

If and <i>when</i> you encounter an error message

> <i>Objects are not valid as a React child</i>

keep in mind the things told [here](/en/part1/introduction_to_react#do-not-rended-object).

<h4> 1.6: unicafe step1</h4>

Like most companies, the student restaurant of the University of Helsinki [Unicafe](https://www.unicafe.fi) collects feedback from its customers. Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: <i>good</i>, <i>neutral</i>, and <i>bad</i>.

The application must display the total number of collected feedback for each category. Your final application could look like this:

![screenshot of feedback options](../../images/1/13e.png)

Note that your application needs to work only during a single browser session. Once you refresh the page, the collected feedback is allowed to disappear.

It is advisable to use the same structure that is used in the material and previous exercise. File <i>index.js</i> is as follows:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

You can use the code below as a starting point for the <i>App.js</i> file:

```js
import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

<h4>1.7: unicafe step2</h4>

Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (good: 1, neutral: 0, bad: -1) and the percentage of positive feedback.

![average and percentage positive screenshot feedback](../../images/1/14e.png)

<h4>1.8: unicafe step3</h4>

Refactor your application so that displaying the statistics is extracted into its own <i>Statistics</i> component. The state of the application should remain in the <i>App</i> root component.

Remember that components should not be defined inside other components:

```js
// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe step4</h4>

Change your application to display statistics only once feedback has been gathered.

![no feedback given text screenshot](../../images/1/15e.png)

<h4>1.10: unicafe step5</h4>

Let's continue refactoring the application. Extract the following two components:

- <i>Button</i> for defining the buttons used for submitting feedback
- <i>StatisticLine</i> for displaying a single statistic, e.g. the average score.

To be clear: the <i>StatisticLine</i> component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics:

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value ={...} />
      <StatisticLine text="neutral" value ={...} />
      <StatisticLine text="bad" value ={...} />
      // ...
    </div>
  )
}

```

The application's state should still be kept in the root <i>App</i> component.

<h4>1.11*: unicafe step6</h4>

Display the statistics in an HTML [table](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics), so that your application looks roughly like this:

![screenshot of statistics table](../../images/1/16e.png)

Remember to keep your console open at all times. If you see this warning in your console:

![console warning](../../images/1/17a.png)

Then perform the necessary actions to make the warning disappear. Try pasting the error message into a search engine if you get stuck.

<i>Typical source of an error `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` is Chrome extension. Try going to `chrome://extensions/` and try disabling them one by one and refreshing React app page; the error should eventually disappear.</i>

**Make sure that from now on you don't see any warnings in your console!**

<h4>1.12*: anecdotes step1</h4>

The world of software engineering is filled with [anecdotes](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) that distill timeless truths from our field into short one-liners.

Expand the following application by adding a button that can be clicked to display a <i>random</i> anecdote from the field of software engineering: 

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

Content of the file <i>index.js</i> is the same as in previous exercises. 

Find out how to generate random numbers in JavaScript, eg. via a search engine or on [Mozilla Developer Network](https://developer.mozilla.org). Remember that you can test generating random numbers e.g. straight in the console of your browser.

Your finished application could look something like this:

![random anecdote with next button](../../images/1/18a.png)

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.

<h4>1.13*: anecdotes step2</h4>

Expand your application so that you can vote for the displayed anecdote.

![anecdote app with votes button added](../../images/1/19a.png)

**NB** store the votes of each anecdote into an array or object in the component's state. Remember that the correct way of updating state stored in complex data structures like objects and arrays is to make a copy of the state.

You can create a copy of an object like this:

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1     
```

OR a copy of an array like this:

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1     
```

Using an array might be the simpler choice in this case. Searching the Internet will provide you with lots of hints on how to [create a zero-filled array of the desired length](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1.14*: anecdotes step3</h4>

Now implement the final version of the application that displays the anecdote with the largest number of votes:

![anecdote with largest number of votes](../../images/1/20a.png)

If multiple anecdotes are tied for first place it is sufficient to just show one of them.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
