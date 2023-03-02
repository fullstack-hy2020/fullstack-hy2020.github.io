---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: ptbr
---

<div class="content">

### Um estado complexo (complex state)

Em nosso exemplo anterior, o estado da aplicação era simples, pois consistia em apenas um número inteiro. E se a nossa aplicação precisar de um estado mais complexo?

Na maioria dos casos, a maneira mais fácil e melhor de fazer isso é usando a função _useState_ múltiplas vezes para criar "pedaços" separados de estado.

No código a seguir, criamos dois pedaços de estado para a aplicação, chamados _esquerda_ e _direita_, ambos com o valor inicial 0:

```js
const App = () => {
  const [esquerda, setEsquerda] = useState(0) 
  const [direita, setDireita] = useState(0) 

  return (
    <div>
      {esquerda}
      <button onClick={() => setEsquerda(esquerda + 1)}>
        Esquerda
      </button>
      <button onClick={() => setDireita(direita + 1)}>
        Direita
      </button>
      {direita}
    </div>
  )
}
```

O componente têm acesso às funções _setEsquerda_ e _setDireita_, que podem ser usadas para atualizar os dois pedaços de estado.

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
  const [cliques, setCliques] = useState({ 
    esquerda: 0, direita: 0
  })

  const handleCliqueEsquerda = () => {
    const novosCliques = { 
      esquerda: cliques.esquerda + 1, 
      direita: cliques.direita 
    }
    setCliques(novosCliques)
  }

  const handleCliqueDireita = () => {
    const novosCliques = { 
      esquerda: cliques.esquerda, 
      direita: cliques.direita + 1 
    }
    setCliques(novosCliques)
  }

  return (
    <div>
      {cliques.esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
    </div>
  )
}
```

Agora, o componente tem apenas um único pedaço de estado, e os gerenciadores de eventos precisam cuidar da mudança do <i>estado inteiro da aplicação</i>.

O formato do gerenciador de evento parece confuso aqui. Quando o botão da esquerda é clicado, a seguinte função é chamada:
```js
const handleCliqueEsquerda = () => {
  const novosCliques = { 
    esquerda: cliques.esquerda + 1, 
    direita: cliques.direita 
  }
  setCliques(novosCliques)
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
const handleCliqueEsquerda = () => {
  const novosCliques = { 
    ...cliques, 
    esquerda: cliques.esquerda + 1 
  }
  setCliques(novosCliques)
}

const handleCliqueDireita = () => {
    ...cliques, 
    direita: cliques.direita + 1 
  }
  setCliques(novosCliques)
}
```

A sintaxe pode parecer um tanto estranha no começo. Na prática, <em>{ ...cliques }</em> cria um novo objeto que tem cópias de todas as propriedades do objeto _cliques_. Quando discriminamos uma propriedade específica — por exemplo, <i>direita</i> em <em>{ ...cliques, direita: 1 }</em>, o valor da propriedade _direita_ no novo objeto será 1.

No exemplo acima, este trecho:

```js
{ ...cliques, direita: cliques.direita + 1 }
```

cria uma cópia do objeto _cliques_, onde o valor da propriedade _direita_ é aumentado em 1.

Não é necessário atribuir o objeto a uma variável nos gerenciadores de eventos, e podemos simplificar as funções da seguinte maneira:

```js
const handleCliqueEsquerda = () =>
  setCliques({ ...cliques, esquerda: cliques.esquerda + 1 })

const handleCliqueDireita = () =>
```
Alguns leitores podem estar se perguntando o motivo de não termos atualizado o estado diretamente, desta forma:

```js
const handleCliqueEsquerda = () => {
  cliques.esquerda++
  setCliques(cliques)
}
```

A aplicação parece funcionar. Entretanto, <i> em React, é proibido mudar (mutate) diretamente o estado</i>, já que [pode resultar em efeitos colaterais inesperados](https://stackoverflow.com/a/40309023). A mudança de estado sempre tem que ser feita pela definição/atribuição do estado a um novo objeto. Se as propriedades do objeto de estado anterior não forem alteradas, podem simplesmente ser copiadas, o que se faz copiando essas propriedades em um novo objeto e definindo-o como o novo estado.

Armazenar todo o estado em um único objeto de estado é uma má escolha para esta aplicação, especificamente; não há qualquer benefício aparente, e a aplicação resultante fica muito mais complexa. Neste caso, armazenar os contadores de cliques em pedaços separados de estado é uma escolha muito mais adequada.

Há situações em que pode ser benéfico armazenar um pedaço de estado da aplicação em uma estrutura de dados mais complexa. [A documentação oficial de React](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contém algumas orientações úteis sobre o assunto.

### Gerenciando Arrays

Vamos adicionar um pedaço de estado à nossa aplicação contendo o array _todosOsCliques_, que lembra cada clique que ocorreu na aplicação.

```js
const App = () => {
  const [esquerda, setEsquerda] = useState(0)
  const [direita, setDireita] = useState(0)
  const [todosOsCliques, setTodos] = useState([]) // highlight-line

// highlight-start
  const handleCliqueEsquerda = () => {
    setTodos(todosOsCliques.concat('E'))
    setEsquerda(esquerda + 1)
  } 
// highlight-end

// highlight-start
  const handleCliqueDireita = () => {
    setDireita(direita + 1)
  }
// highlight-end

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      <p>{todosOsCliques.join(' ')}</p> // highlight-line
    </div>
  )
}
```
 
Cada clique é armazenado em um pedaço separado de estado chamado _todosOsCliques_, que é inicializado como um array vazio:

```js
const [todosOsCliques, setTodos] = useState([])
```

Quando o botão <i>Esquerda</i> é clicado, adicionamos a letra <i>E</i> ao array _todosOsCliques_:

```js
const handleCliqueEsquerda = () => {
  setTodos(todosOsCliques.concat('E'))
  setEsquerda(esquerda + 1)
}
```

O pedaço de estado armazenado em _todosOsCliques_ agora é definido para ser um array que contém todos os itens do array anterior mais a letra <i>E</i>. O método [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) (concatenar) adiciona o novo item ao array, que não muda o array existente, mas sim retorna uma <i>nova cópia do array</i> com o item adicionado a ele.

Como mencionado anteriormente, também é possível em JavaScript adicionar itens a um array com o método [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) (Significa, literalmente, "empurrar", "apertar", "pressionar". Porém, nestes termos, o método push() ADICIONA um ou mais elementos ao final de um array e retorna o novo comprimento desse array). Se adicionarmos o item "empurrando-o" para o array _todosOsCliques_ e então atualizando o estado, a aplicação ainda aparentará funcionar:

```js
const handleCliqueEsquerda = () => {
  todosOsCliques.push('E')
  setTodos(todosOsCliques)
  setEsquerda(esquerda + 1)
}
```

No entanto, __não__ faça isso. Como mencionado anteriormente, o estado dos componentes em React, tal como _todosOsCliques_, não devem ser mudados diretamente. Mesmo se mudando o estado parecer funcionar em alguns casos, tal decisão pode levar a erros no código muito difíceis de depurar.

Vamos olhar mais de perto em como o clique é renderizado na página:

```js
const App = () => {
  // ...

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      {direita}
      <p>{todosOsCliques.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Chamamos o método [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) (juntar, conectar) no array _todosOsCliques_ que une todos os itens em uma única string, separados pela string passada como parâmetro da função, que no caso é um espaço vazio.

### A atualização do estado é assíncrona

Vamos expandir a aplicação para que ela mantenha o controle do número total de cliques nos botões no estado _total_, cujo valor é sempre atualizado quando os botões são pressionados:

```js
const App = () => {
  const [esquerda, setEsquerda] = useState(0)
  const [direita, setDireita] = useState(0)
  const [todosOsCliques, setTodos] = useState([])
  const [total, setTotal] = useState(0) // highlight-line

  const handleCliqueEsquerda = () => {
    setTodos(todosOsCliques.concat('E'))
    setEsquerda(esquerda + 1)
    setTotal(esquerda + direita)  // highlight-line
  }

  const handleCliqueDireita = () => {
    setDireita(direita + 1)
    setTotal(esquerda + direita)  // highlight-line
  }

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      <p>{todosOsCliques.join(' ')}</p>
      <p>Total {total}</p>  // highlight-line
    </div>
  )
}
```

A solução não funciona corretamente:

![o navegador mostrando 2 left|right 1, RLL total 2](../../images/1/33.png)

Por alguma razão, o total de cliques nos botões está sempre um clique atrás do valor real.

Vamos adicionar alguns comandos ```console.log``` ao gerenciador de eventos:

```js
const App = () => {
  // ...
  const handleCliqueEsquerda = () => {
    setTodos(todosOsCliques.concat('E'))
    console.log('clique esquerdo anterior', esquerda)  // highlight-line
    setEsquerda(esquerda + 1)
    console.log('clique esquerdo posterior', esquerda)  // highlight-line
    setTotal(esquerda + direita)
  }

  // ...
}
```

O console revela o problema:

![o console das ferramentas do desenvolvedor exibe left before 4 and left after 4](../../images/1/32.png)

Embora um novo valor tenha sido definido para _esquerda_ chamando _setEsquerda(esquerda + 1)_, o valor antigo ainda está lá, apesar da atualização! Por causa disso, a tentativa de contar o número de cliques nos botões produz um resultado menor do que o correto:

```js
setTotal(esquerda + direita) 
```

O motivo para isso é que uma atualização de estado no React acontece [assincronicamente](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous) (asynchronously), ou seja, não imediatamente, mas "em algum momento" antes que o componente seja renderizado novamente.

Podemos consertar a aplicação da seguinte forma:

```js
const App = () => {
  // ...
  const handleCliqueEsquerda = () => {
    setTodos(todosOsCliques.concat('E'))
    const atualizaEsquerda = esquerda + 1
    setEsquerda(atualizaEsquerda)
    setTotal(atualizaEsquerda + direita)
  }

  // ...
}
```

Assim, o número de cliques nos botões é agora, de forma definitiva, baseado no número correto de cliques no botão esquerdo.

### Renderização Condicional

Vamos modificar nossa aplicação para que a renderização do histórico de cliques seja gerenciada por um novo componente chamado <i>Historico</i>:

```js
// highlight-start
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
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      {direita}
      <Historico todosOsCliques={todosOsCliques} /> // highlight-line
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

React também oferece muitas outras formas de fazer [renderização condicional](https://reactjs.org/docs/conditional-rendering.html). Veremos isso na prática na [Parte 2](/ptbr/part2).

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

// highlight-start
const Botao = ({ handleClique, texto }) => (
  <button onClick={handleClique}>
    {texto}
  </button>
)
// highlight-end

const App = () => {
  const [esquerda, setEsquerda] = useState(0)
  const [direita, setDireita] = useState(0)
  const [todosOsCliques, setTodos] = useState([])

  const handleCliqueEsquerda = () => {
    setTodos(todosOsCliques.concat('E'))
    setEsquerda(esquerda + 1)
  }

  const handleCliqueDireita = () => {
    setDireita(direita + 1)
  }

  return (
    <div>
      {esquerda}
      // highlight-start
      <Botao handleClique={handleCliqueEsquerda} texto='Esquerda' />
      <Botao handleClique={handleCliqueDireita} texto='Direita' />
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

Se e quando seu código não compilar e seu navegador brilhar igual uma árvore de Natal:

![captura de tela do código](../../images/1/6x.png)

não escreva nenhuma linha de código a mais, mas encontre e corrija **imediatamente** o problema. Ainda não aconteceu na história da programação de o código que não estivesse compilando começasse a funcionar após a adição de mais linhas de código. Duvido que tal evento ocorra durante este curso também.

A depuração (_debug_) "old-school", baseada na impressão no Console, é sempre uma das melhores opções. Se o componente

```js
const Botao = ({ handleClique, texto }) => (
  <button onClick={handleClique}>
    {texto}
  </button>
)
```

não estiver funcionando como desejado, é útil começar a imprimir suas variáveis ​​no console. Para que isso funcione, devemos transformar nossa função na forma menos compactada e receber todo o objeto "props" sem desestruturá-lo de forma imediata:

```js
const Botao = (props) => { 
  console.log(props) // highlight-line
  const { handleClique, texto } = props
  return (
    <button onClick={handleClique}>
      {texto}
    </button>
  )
}
```

Isso revelará imediatamente se, por exemplo, um dos atributos foi escrito incorretamente ao usar o componente.

**Obs.:** Quando você usar _console.log_ para depuração, não combine _objetos (objects)_ do jeito Java de se fazer usando o operador de adição. Em vez de escrever

```js
console.log('o valor de props é ' + props)
```

separe as coisas que você deseja registrar no console com uma vírgula:

```js
console.log('o valor de props é', props)
```

Se você usar o jeito Java de concatenar uma string com um objeto, aparecerá uma mensagem de log muito pouco informativa:

```js
o valor de props é [object Object]
```

Registrar a saída no console não é de maneira alguma a única forma de depurar nossas aplicações. Você pode pausar a execução do código da sua aplicação no _depurador (debugger)_ no Console do Desenvolvedor do Chrome, escrevendo o comando [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) em qualquer lugar do seu código.

A execução será pausada assim que chegar a um ponto onde o comando _debugger_ for executado:

![debugger pausado na Ferramenta do Desenvolvedor](../../images/1/7a.png)

Ao ir para a guia <i>Console</i>, é fácil inspecionar o estado atual das variáveis:

![captura de tela de inspeção de console](../../images/1/8a.png)

Uma vez que a causa do erro é descoberta, é possível remover o comando _debugger_ e atualizar a página.

O depurador também nos permite executar nosso código linha por linha com os controles encontrados na parte direita da guia <i>Fontes (Sources)</i>.

Você também pode acessar o depurador sem o comando _debugger_, adicionando pontos de interrupção na guia <i>Fontes (Sources)</i>. Inspecionar os valores das variáveis do componente pode ser feito na seção _Escopo (Scope)_:

![exemplo de ponto de interrupção nas ferramentas do desenvolvedor](../../images/1/9a.png)

É extremamente recomendado adicionar a extensão [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) ao Chrome. Ele adiciona uma nova guia _Components_ às ferramentas de desenvolvedor. A nova guia de ferramentas de desenvolvedor pode ser usada para inspecionar os diferentes elementos React na aplicação, juntamente com seu estado e props:

![captura de tela da extensão de ferramentas de desenvolvedor React](../../images/1/10ea.png)

O estado do componente _App_ é definido assim:

```js
const [esquerda, setEsquerda] = useState(0)
const [direita, setDireita] = useState(0)
const [todosOsCliques, setTodos] = useState([])
```

As ferramentas do desenvolvedor mostram o estado dos hooks na ordem de sua definição:

![estado dos hooks nas ferramentas do desenvolvedor React](../../images/1/11ea.png)

O primeiro <i>State</i> (Estado) contém o valor do estado <i>esquerda</i>; o próximo contém o valor do estado <i>direita</i> e o último contém o valor do estado <i>todosOsCliques</i>.

### Regras dos Hooks

Há algumas limitações e regras que devemos seguir para garantir que a nossa aplicação use corretamente as funções de estado baseadas em hooks.

A função _useState_ ("usarEstado", assim como a função _useEffect_, ou "usarEfeito", introduzida mais tarde neste curso) <i>não deve ser chamada</i> dentro de um loop, uma expressão condicional ou qualquer lugar que não seja uma função que define um componente. Assim deve ser para garantir que os hooks sejam sempre chamados na mesma ordem e, se isso não acontecer, a aplicação se apresentará erros.

Resumindo, hooks só podem ser chamados de dentro do corpo de uma função que define um componente React:

```js
const App = () => {
  // Desta forma funciona!
  const [idade, setIdade] = useState(0)
  const [nome, setNome] = useState('Juha Tauriainen')

  if ( idade > 10 ) {
    // Desta forma não funciona!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < idade; i++ ) {
    // Não faça deste jeito também!
    const [formaCorreta, setFormaCorreta] = useState(false)
  }

  const bemRuim = () => {
    // Isso também não é permitido!
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Revisão sobre Gerenciamento de Eventos (_Event Handling_)

O gerenciamento de eventos se mostrou um tópico difícil em iterações anteriores neste curso.

Por essa razão, revisaremos o tópico.

Vamos supor que estejamos desenvolvendo essa aplicação simples com o seguinte componente <i>App</i>:
```js
const App = () => {
  const [valor, setValor] = useState(10)

  return (
    <div>
      {valor}
      <button>zerar</button>
    </div>
  )
}
```

Queremos que o clique do botão reinicialize o estado armazenado na variável _valor_.

Para fazer com que o botão reaja a um evento de clique, precisamos adicionar um <i>gerenciador de evento</i> a ele.

Os gerenciadores de eventos devem sempre ser uma função ou uma referência a uma função. O botão não funcionará se o gerenciador de evento for definido como uma variável de outro tipo.

Se definíssemos o gerenciador de evento como uma string:

```js
<button onClick="lixo...">botão</button>
```

o React nos avisaria sobre isso no console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```
A mensagem de erro diz: index.js:2178 Aviso: Esperava-se que o ouvinte `onClick` fosse uma função, mas obteve-se um valor do tipo `string`.

O seguinte também não funcionaria:

```js
<button onClick={valor + 1}>botão</button>
```

Tentamos definir o gerenciador de evento como _valor + 1_, o que simplesmente retorna o resultado da operação. React nos avisará sobre isso no console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```
A mensagem de erro diz: index.js:2178 Aviso: Esperava-se que o ouvinte `onClick` fosse uma função, mas obteve-se um valor do tipo `number`.

Este também não funcionaria:
```js
<button onClick={valor = 0}>botão</button>
```

O gerenciador de evento não é uma função, mas uma **atribuição de variável**, e React, mais uma vez, emitirá um aviso no console. Esta tentativa também é falha no sentido de que nunca devemos mudar diretamente o estado em React.

Vejamos o próximo exemplo:

```js
<button onClick={console.log('clicou no botão')}>
  botão
</button>
```

A mensagem é impressa no console assim que o componente é renderizado, mas nada acontece quando clicamos no botão. Por que não funciona mesmo quando nosso gerenciador de evento contém a função _console.log_?

O problema aqui é que nosso gerenciador de evento é definido como uma <i>chamada de função</i>, o que significa que o gerenciador de evento é atribuído ao valor retornado da função, que no caso de _console.log_ é <i>undefined</i> (indefinido).

A função _console.log_ é chamada quando o componente é renderizado e, por esse motivo, é impresso uma vez no console.

A tentativa a seguir também não funciona:

```js
<button onClick={setValue(0)}>botão</button>
```

Novamente, tentamos definir uma chamada de função como o gerenciador de evento. Isso não funciona. Essa tentativa específica também causa outro problema: quando o componente é renderizado, a função _setValue(0)_ é executada, o que por sua vez faz com que o componente seja renderizado novamente. A re-renderização, por conseguinte, chama _setValue(0)_ novamente, resultando em uma recursão infinita.

A execução de uma chamada de função específica quando o botão é clicado pode ser realizada da seguinte maneira:

```js
<button onClick={() => console.log('clicou no botão')}>
  botão
</button>
```

Agora, o gerenciador de evento é uma função definida com a sintaxe de uma _arrow function_, isto é, ```() => console.log('clicou no botão')```. Quando o componente é renderizado, nenhuma função é chamada e apenas a referência à _arrow function_ é definida como o gerenciador de evento. A chamada da função ocorre apenas quando o botão é clicado.

Podemos implementar a reinicialização do estado em nossa aplicação com essa mesma técnica:

```js
<button onClick={() => setValue(0)}>botão</button>
```

O gerenciador de evento agora é a função ```() => setValue(0)```.

Definir gerenciadores de eventos diretamente no atributo do botão nem sempre é a melhor opção a se aplicar.

Você verá frequentemente gerenciadores de eventos definidos em um lugar separado. Na versão seguinte de nossa aplicação, definimos uma função que então é atribuída à variável _handleClique_ no corpo da função do componente:

```js
const App = () => {
  const [valor, setValor] = useState(10)

  const handleClique = () =>
    console.log('clicou no botão')

  return (
    <div>
      {valor}
      <button onClick={handleClique}>botão</button>
    </div>
  )
}
```

Agora, a variável _handleClique_ está atribuída a uma referência à função. A referência é passada ao botão como o atributo <i>onClick</i>:

```js
<button onClick={handleClique}>botão</button>
```

Naturalmente, nossa função gerenciadora de eventos pode ser composta por múltiplos comandos. Nestes casos, usamos a sintaxe de chaves mais longa para _arrow functions_: 

```js
const App = () => {
  const [valor, setValor] = useState(10)

// highlight-start
  const handleClique = () => {
    console.log('clicou no botão')
    setValor(0)
  }
// highlight-end

  return (
    <div>
      {valor}
      <button onClick={handleClique}>botão</button>
    </div>
  )
}
```

### Uma função que retorna outra função

Outra maneira de definir um gerenciador de evento é usar uma <i>função que retorna outra função</i>.

Provavelmente, você não precisará usar funções que retornam funções em nenhum dos exercícios deste curso. Se o tópico parecer confuso demais, você pode pular esta seção por enquanto e retornar a ela mais tarde.

Vamos fazer as seguintes alterações em nosso código:

```js
const App = () => {
  const [valor, setValor] = useState(10)

  // highlight-start
  const ola = () => {
    const gerenciador = () => console.log('Olá, mundo!')

    return gerenciador
  }
  // highlight-end

  return (
    <div>
      {valor}
      <button onClick={ola()}>botão</button>
    </div>
  )
}
```

O código funciona corretamente, apesar de parecer complicado. 

O gerenciador de evento agora está definido como uma chamada de função:

```js
<button onClick={ola()}>botão</button>
```

Anteriormente, afirmamos que um gerenciador de evento não pode ser uma chamada de função e que precisa ser ou uma função ou uma referência a uma função. Então, por que uma chamada de função funciona neste caso?

Quando o componente é renderizado, a seguinte função é executada:

```js
const ola = () => {
  const gerenciador = () => console.log('Olá, mundo!')

  return gerenciador
}
```

O <i>valor de retorno</i> da função é outra função que é atribuída à variável _gerenciador_.

Quando o React renderiza a linha:

```js
<button onClick={ola()}>botão</button>
```

Ele atribui o valor de retorno de _ola()_ ao atributo onClick. Essencialmente, a linha se transforma em:

```js
<button onClick={() => console.log('Olá, mundo!')}>
  botão
</button>
```

Como a função _ola_ retorna uma função, o gerenciador de evento passa, agora, a ser uma função.

Qual é o objetivo deste conceito?

Vamos mudar um pouco o código:

```js
const App = () => {
  const [valor, setValor] = useState(10)

  // highlight-start
  const ola = (quem) => {
    const gerenciador = () => {
      console.log('Olá', quem)
    }

    return gerenciador
  }
  // highlight-end

  return (
    <div>
      {valor}
      // highlight-start
      <button onClick={ola('mundo')}>botão</button>
      <button onClick={ola('react')}>botão</button>
      <button onClick={ola('função')}>botão</button>
      // highlight-end 
    </div>
  )
}
```

Agora, a aplicação têm três botões com gerenciadores de eventos definidos pela função _ola_ que aceita um único parâmetro.

O primeiro botão é definido como:

```js
<button onClick={ola('mundo')}>botão</button>
```

O gerenciador de evento é criado <i>executando</i> a chamada da função _ola('mundo')_. A chamada da função retorna a função:

```js
() => {
  console.log('Olá', 'mundo')
}
```

O segundo botão é definido como:

```js
<button onClick={ola('react')}>botão</button>
```

A chamada da função _ola('react')_ que cria o gerenciador de evento retorna:

```js
() => {
  console.log('Olá', 'react')
}
```

Ambos os botões obtêm seus gerenciadores de eventos individualizados.

Funções que retornam funções podem ser utilizadas na definição de funcionalidades genéricas que podem ser personalizadas com parâmetros. A função _ola_ que cria os gerenciadores de eventos pode ser analisada como uma fábrica que produz gerenciadores de eventos personalizados destinados a saudar usuários.

Nossa definição atual é um tanto verbosa:

```js
const ola = (quem) => {
  const gerenciador = () => {
    console.log('Olá', quem)
  }

  return gerenciador
}
```

Vamos excluir as variáveis de ajuda e retornar diretamente a função criada:

```js
const ola = (quem) => {
  return () => {
    console.log('Olá', quem)
  }
}
```

Por conta de nossa função _ola_ ser composta por um único comando de retorno, podemos omitir as chaves e usar a sintaxe mais compacta para funções de seta:

```js
const ola = (quem) =>
  () => {
    console.log('Olá', quem)
  }
```

Por fim, vamos escrever todas as setas na mesma linha:

```js
const ola = (quem) => () => {
  console.log('Olá', quem)
}
```

Podemos usar o mesmo "macete" para definir gerenciadores de eventos que definem o estado do componente para um determinado valor. Vamos fazer as seguintes alterações em nosso código:

```js
const App = () => {
  const [valor, setValor] = useState(10)
  
  // highlight-start
  const setNoValor = (novoValor) => () => {
    console.log('setValor atual', novoValor)  // Imprime o novo valor no console
    setValor(novoValor)
  }
  // highlight-end
  
  return (
    <div>
      {valor}
      // highlight-start
      <button onClick={setNoValor(1000)}>mil</button>
      <button onClick={setNoValor(0)}>zerar</button>
      <button onClick={setNoValor(valor + 1)}>incrementar</button>
      // highlight-end
    </div>
  )
}
```

Quando o componente é renderizado, é criado o botão <i>mil</i>:

```js
<button onClick={setNoValor(1000)}>mil</button>
```

O gerenciador de evento é definido como o valor retornado de _setNoValor(1000)_, que é a seguinte função:

```js
() => {
  console.log('setValor atual', 1000)
  setValor(1000)
}
```

O botão de incremento é declarado da seguinte forma:

```js
<button onClick={setNoValor(valor + 1)}>incrementar</button>
```

O gerenciador de evento é criado pela chamada da função _setNoValor(valor + 1)_, que recebe como parâmetro o valor atual da variável de estado _valor_ incrementado em 1 (um). Se o conteúdo de _valor_ fosse 10, então o gerenciador de evento criado seria a seguinte função:

```js
() => {
  console.log('setValor atual', 11)
  setValor(11)
}
```

Não é necessário usar funções que retornam funções para alcançar esta funcionalidade. Vamos retornar a função _setNoValor_, responsável por atualizar o estado, como uma função normal:

```js
const App = () => {
  const [valor, setValor] = useState(10)

  const setNoValor = (novoValor) => {
    console.log('setValor atual', novoValor)
    setValor(novoValor)
  }

  return (
    <div>
      {valor}
      <button onClick={() => setNoValor(1000)}>
        mil
      </button>
      <button onClick={() => setNoValor(0)}>
        zerar
      </button>
      <button onClick={() => setNoValor(valor + 1)}>
        incrementar
      </button>
    </div>
  )
}
```

Agora, podemos definir o gerenciador de evento como uma função que chama a função _setNoValor_ com um parâmetro apropriado. O gerenciador de evento utilizado para redefinir o estado da aplicação seria:

```js
<button onClick={() => setNoValor(0)}>zerar</button>
```

Escolher entre as duas formas apresentadas de definir seus gerenciadores de eventos é, em grande parte, uma questão de gosto.

### Passando Gerenciadores de Evento para Componentes-filho

Vamos extrair o botão para seu próprio componente:

```js
const Botao = (props) => (
  <button onClick={props.handleClique}>
    {props.texto}
  </button>
)
```

O componente obtém a função de gerência de evento da propriedade _handleClique_, e o texto do botão da propriedade _texto_. Vamos usar o novo componente:

```js
const App = (props) => {
  // ...
  return (
    <div>
      {valor}
      <Botao handleClique={setNoValor(1000)} texto="mil" /> // highlight-line
      <Botao handleClique={setNoValor(0)} texto="zerar" /> // highlight-line
      <Botao handleClique={setNoValor(valor + 1)} texto="incrementar" /> // highlight-line
    </div>
  )
}
```

Usar o componente <i>Botao</i> é simples, embora tenhamos que nos certificar de usar os nomes corretos de atributo ao passar props para o componente.

![captura de tela do código de nomes de atributos corretos](../../images/1/12e.png)
<i>Nota dos tradutores: ao longo do texto, apresentamos os códigos contendo termos traduzidos para o português, os quais não aparecem na imagem acima, pois esta traz o código escrito com os termos em inglês.</i>

### Não defina Componentes dentro de Componentes

Vamos começar a exibir o valor da aplicação em seu componente <i>Exibir</i>.

Vamos mudar a aplicação definindo um novo componente dentro do componente <i>App</i>.

```js
// Este é o lugar correto para definir um componente
const Botao = (props) => (
  <button onClick={props.handleClique}>
    {props.texto}
  </button>
)

const App = () => {
  const [valor, setValor] = useState(10)

  const setNoValor = novoValor => {
    console.log('setValor atual', novoValor)
    setValor(novoValor)
  }

  // Não defina um componente dentro de outro componente
  const Exibir = props => <div>{props.valor}</div> // highlight-line

  return (
    <div>
      <Exibir valor={valor} />
      <Botao handleClique={() => setNoValor(1000)} texto="mil" />
      <Botao handleClique={() => setNoValor(0)} texto="zerar" />
      <Botao handleClique={() => setNoValor(valor + 1)} texto="incrementar" />
    </div>
  )
}
```

A aplicação ainda parece funcionar, porém, **não implemente componentes desta forma!**
Nunca defina componentes dentro de outros componentes. O método não oferece nenhum benefício e leva a muitos problemas desagradáveis. Os maiores problemas acontecem devido ao React tratar um componente definido dentro de outro componente como um novo componente em cada renderização. Isso torna impossível para o React otimizar o componente.

Em vez disso, vamos mover a função do componente <i>Exibir</i> para o seu lugar correto, que fica fora da função do componente <i>App</i>:

```js
const Exibir = props => <div>{props.valor}</div>

const Botao = (props) => (
  <button onClick={props.handleClique}>
    {props.texto}
  </button>
)

const App = () => {
  const [valor, setValor] = useState(10)

  const setNoValor = novoValor => {
    console.log('setValor atual', novoValor)
    setValor(novoValor)
  }

  return (
    <div>
      <Exibir valor={valor} />
      <Botao handleClique={() => setNoValor(1000)} texto="mil" />
      <Botao handleClique={() => setNoValor(0)} texto="zerar" />
      <Botao handleClique={() => setNoValor(valor + 1)} texto="incrementar" />
    </div>
  )
}
```

### Leitura Recomendada

A internet está cheia de material relacionado à biblioteca React. No entanto, usamos o novo estilo de programação em React para o qual a grande maioria do material encontrado online está desatualizado.

Estes links talvez possam lhe ser úteis:

- Vale a pena dar uma olhada em algum momento na [documentação oficial React](https://reactjs.org/docs/hello-world.html), embora a maior parte dela só se torne relevante mais para frente no curso. Além disso, tudo relacionado a componentes baseados em classe é irrelevante para nós;
- Alguns cursos no [Egghead.io](https://egghead.io), como o [Start learning React](https://egghead.io/courses/start-learning-react), são de altíssima qualidade; e o recentemente atualizado [Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) também é relativamente bom; ambos os cursos introduzem conceitos que também serão introduzido no decorrer deste curso. **Obs.: O primeiro curso usa componentes de classe, mas o segundo usa a nova abordagem baseada em funções.**

### Juramento do Programador Web

Programar é difícil, e é por isso que eu usarei todos os meios possíveis para ser mais fácil:

- Eu manterei meu Console do navegador aberto o tempo todo;
- Eu vou progredir aos poucos, passo a passo;
- Eu escreverei muitas instruções _console.log_ para ter certeza de que estou entendendo como o código se comporta e para me ajudar a identificar os erros;
- Se meu código não funcionar, não escreverei mais nenhuma linha no código. Em vez disso, começarei a excluir o código até que funcione ou retornarei ao estado em que tudo ainda estava funcionando; e
- Quando eu pedir ajuda no canal do Discord ou Telegram do curso ou em outro lugar, formularei minhas perguntas de forma adequada. Veja [aqui](/ptbr/part0/informacoes_gerais#como-pedir-ajuda-no-discord-telegam) como pedir ajuda.

</div>

<div class="tasks">

<h3>Exercícios 1.6 a 1.14</h3>

Envie suas soluções aos exercícios dando "push" para seu repositório no GitHub e, em seguida, marque os exercícios concluídos na guia "my submissions" no [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Lembre-se: envie **todos** os exercícios de uma parte **de uma única vez**; isto é, envie todas as suas soluções de uma vez para seu repositório. Uma vez que você tenha enviado suas soluções para uma parte, **não é mais possível enviar mais exercícios para essa parte**.

<i> Alguns dos exercícios funcionam na mesma aplicação. Nestes casos, é suficiente enviar apenas a versão final da aplicação. Se desejar, você pode fazer um "commit" após cada exercício concluído, mas isso não é obrigatório.</i>

**AVISO**: "create-react-app" transformará automaticamente seu projeto em um repositório git, a menos que você crie sua aplicação dentro de um repositório git já existente. **Você muito provavelmente não quer que cada um de seus projetos seja um repositório separado**, então basta executar o comando _rm -rf .git_ na raiz de sua aplicação para aplicar as modificações.

Algumas vezes você terá que executar na raiz do projeto o comando abaixo:

```bash
rm -rf node_modules/ && npm i
```

Se e <i>quando</i> você encontrar uma mensagem de erro

> <i>Objects are not valid as a React child</i>

lembre-se do que foi explicado [aqui](/ptbr/part1/introducao_a_biblioteca_react#nao-renderize-objetos).

<i>**Obs.:** o conteúdo dos exercícios foram deixados no idioma original da tradução (inglês) por questões de conveniência, visto a revisão que os mantenedores do curso devem fazer no código enviado ao sistema de avaliação da Universidade de Helsinque. Desta forma, escreva suas aplicações utilizando os mesmos termos usados nas variáveis, componentes, etc que estão em inglês.</i>

<h4> 1.6: unicafe — 1º passo</h4>

Como a maioria das empresas, o restaurante universitário da Universidade de Helsinque, [Unicafe](https://www.unicafe.fi), coleta o feedback de seus clientes. Sua tarefa é implementar uma aplicação web que colete o feedback dos clientes. Existem apenas três opções para feedback: <i>good</i> (bom), <i>neutral</i> (neutro) e <i>bad</i> (ruim).

A aplicação deve exibir o número total de feedbacks coletados para cada categoria. Sua aplicação final pode ficar assim:

![captura de tela das opções de feedback](../../images/1/13e.png)

Note que sua aplicação precisa funcionar apenas durante uma única sessão de navegação.  É permitido que, assim que você atualizar a página, o feedback coletado desapareça.

É aconselhável usar a mesma estrutura que é usada no material e no exercício anterior. O arquivo <i>index.js</i> fica assim:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Você pode usar o código abaixo como ponto de partida para o arquivo <i>App.js</i>:

```js
import { useState } from 'react'

const App = () => {
  // salve os cliques de cada botão em seu próprio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      Programe aqui!
    </div>
  )
}

export default App
```

<h4>1.7: unicafe — 2º passo</h4>

Expanda sua aplicação para que ela mostre mais estatísticas sobre o feedback coletado: o número total de feedback coletados, a pontuação média (good: 1, neutral: 0, bad: -1) e a porcentagem de feedback positivo.

![captura de tela do feedback positivo, médio e percentual](../../images/1/14e.png)

<h4>1.8: unicafe — 3º passo</h4>

Refatore sua aplicação de maneira que a exibição de estatísticas seja extraída para seu próprio componente <i>Statistics</i>. O estado da aplicação deve permanecer no componente raiz <i>App</i>.

Lembre-se de que componentes não devem ser definidos dentro de outros componentes:

```js
// lugar adequado para definir um componente
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // não defina um componente dentro de outro componente
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe — 4º passo</h4>

Modifique sua aplicação para exibir as estatísticas somente após o feedback ter sido coletado.

![nenhum feedback dado texto screenshot](../../images/1/15e.png)

<h4>1.10: unicafe — 5º etapa</h4>

Continuemos refatorando a aplicação. Extraia esses dois componentes:

- <i>Button</i> para definir os botões usados para enviar feedback; e
- <i>StatisticLine</i> para exibir uma única estatística, por exemplo, a pontuação média.

Deixando claro: o componente <i>StatisticLine</i> sempre exibe uma única estatística, o que significa que a aplicação usa vários componentes para renderizar todas as estatísticas:

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

O estado da aplicação deve ser mantido no componente raiz <i>App</i>.

<h4>1.11*: unicafe — 6º passo</h4>

Exiba as estatísticas em uma [tabela HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics), para que sua aplicação pareça mais ou menos assim:

![captura de tela da tabela de estatísticas](../../images/1/16e.png)

Lembre-se de manter seu console aberto o tempo todo. Se você ver este aviso no seu console

![aviso do console](../../images/1/17a.png)

faça o necessário para fazer o aviso desaparecer. Tente colar a mensagem de erro em um buscador (Google, Bing, etc) se ficar preso.

<i>A origem típica de um erro `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` vem de alguma extensão do Chrome. Vá até `chrome://extensions/` e desative uma por uma e atualize a página da aplicação React; o erro deve por fim desaparecer.</i>

**Certifique-se de que, a partir de agora, você não verá mais avisos no seu console!**

<h4>1.12*: anecdotes — 1º passo</h4>

O mundo da engenharia de software é cheio de [anedotas](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) que distilam verdades atemporais de nosso campo em frases curtas.

Expanda a aplicação a seguir, adicionando um botão que, ao ser clicado, exiba uma anedota aleatória da área da engenharia de software:

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'Se fazer algo dói, faça isso com mais frequência.',
    'Contratar mão de obra para um projeto de software que já está atrasado, faz com que se atrase mais ainda!',
    'Os primeiros 90% do código correspondem aos primeiros 10% do tempo de desenvolvimento... Os outros 10% do código correspondem aos outros 90% do tempo de desenvolvimento.',
    'Qualquer tolo escreve código que um computador consegue entender. Bons programadores escrevem código que humanos conseguem entender.',
    'Otimização prematura é a raiz de todo o mal.',
    'Antes de mais nada, depurar é duas vezes mais difícil do que escrever o código. Portanto, se você escrever o código da forma mais inteligente possível, você, por definição, não é inteligente o suficiente para depurá-lo.',
    'Programar sem o uso extremamente intenso do console.log é o mesmo que um médico se recusar a usar raio-x ou testes sanguíneos ao diagnosticar pacientes.',
    'A única maneira de ir rápido é ir bem.'
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

O conteúdo do arquivo <i>index.js</i> é o mesmo dos exercícios anteriores.

Descubra como gerar números aleatórios (_random numbers_) em JavaScript, por exemplo, pesquisando na internet ou lendo o [Mozilla Developer Network](https://developer.mozilla.org). Lembre-se de que você pode testar a criação de números aleatórios diretamente no console do seu navegador, por exemplo.

Sua aplicação no estado final pode ficar mais ou menos assim:

![anedota aleatória com botão "próximo"](../../images/1/18a.png)

**AVISO**: "create-react-app" transformará automaticamente seu projeto em um repositório git, a menos que você crie sua aplicação dentro de um repositório git já existente. **Você muito provavelmente não quer que cada um de seus projetos seja um repositório separado**, então basta executar o comando _rm -rf .git_ na raiz de sua aplicação para aplicar as modificações.

<h4>1.13*: anecdotes — 2º passo</h4>

Amplie sua aplicação para que você possa votar na anedota exibida.

![aplicação de anedotas com botão de votos adicionado](../../images/1/19a.png)

**Obs.:** armazene os votos de cada anedota em um array ou objeto no estado do componente. Lembre-se de que a forma correta de atualizar o estado armazenado em estruturas de dados complexas, como objetos e arrays, é fazer uma cópia do estado.

Você pode criar uma cópia de um objeto assim:

```js
const pontos = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copia = { ...pontos }
// incrementa o valor da propriedade 2 (dois) por 1 (um)
copia[2] += 1     
```

Ou uma cópia de um array assim:

```js
const pontos = [1, 4, 6, 3]

const copia = [...pontos]
// incrementa o valor na posição 2 (dois) por 1 (um)
copia[2] += 1     
```

Utilizar um array pode ser a escolha mais simples neste caso. Uma pesquisa na Internet vai te mostrar muitas formas de como [criar um array preenchido com zeros com um comprimento arbitrário](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1.14*: anecdotes — 3º passo</h4>

Agora, implemente a versão final da aplicação que exibe a anedota com o maior número de votos:

![anedota com o maior número de votos](../../images/1/20a.png)

Se múltiplas anedotas estiverem empatadas no primeiro lugar, exiba apenas uma delas.

Este foi o último exercício para esta parte do curso, e é hora de enviar seu código para o GitHub e marcar todos os seus exercícios concluídos na guia "my submissions" do [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
