---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: ptbr
---

<div class="content">

Teremos, durante o curso, o objetivo e a necessidade de aprender certa quantidade de JavaScript, além de desenvolvimento web.

JavaScript evoluiu rapidamente nos últimos anos e, neste curso, usamos as funcionalidades das versões mais recentes. O nome oficial do padrão de JavaScript é [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Atualmente, a versão mais recente é a lançada em junho de 2022 com o nome de [ECMAScript®2022](https://www.ecma-international.org/ecma-262/), também conhecido como ES13.

Os navegadores ainda não suportam todas as funcionalidades mais recentes de JavaScript e devido a esse fato, muito código executado em navegadores é <i>transpilado</i> de uma versão mais recente de JavaScript para uma versão mais antiga e compatível.

Hoje em dia, a maneira mais popular de fazer a transpilação é usando o transcompilador [Babel](https://babeljs.io/). A transpilação é configurada automaticamente em aplicações React criadas com create-react-app. Vamos olhar mais de perto a configuração de transpilação na [Parte 7](/ptbr/part7) deste curso.

[Node.js](https://nodejs.org/en/) é um ambiente de tempo de execução JavaScript baseado no motor JavaScript [Chrome V8](https://developers.google.com/v8/) da Google e funciona praticamente em qualquer lugar, desde servidores até telefones celulares. Vamos praticar a escrita de código JavaScript usando Node. As versões mais recentes do Node são compatíveis com as versões mais recentes de JavaScript, então o código não precisa ser transpilado.

O código é escrito em arquivos com extensão <i>.js</i> que são executados ao emitir o comando <em>node nome\_do\_arquivo.js</em>

Também é possível escrever código JavaScript na console do Node.js, que pode ser aberta digitando "node" na linha de comando, bem como na aba Console nas Ferramentas do Desenvolvedor do navegador. [As revisões mais recentes do Chrome lidam bem com as novas funcionalidades de JavaScript](http://kangax.github.io/compat-table/es2016plus/) sem precisar transpilar o código. Alternativamente, você pode usar uma ferramenta como [JS Bin](https://jsbin.com/?js,console).

JavaScript lembra mais ou menos o Java, tanto no nome quanto na sintaxe. Porém, quando se trata do mecanismo central da linguagem, eles não poderiam ser mais diferentes. Da perspectiva de alguém que vem de um background em Java, a forma como JavaScript se comporta pode parecer um pouco estranho, principalmente se não for feito algum esforço para entender suas características.

Em determinados círculos, tem se popularizado tentar "simular" funcionalidades e padrões de _design_ de Java em JavaScript. Não recomendamos fazer isso, já que as linguagens e seus respectivos ecossistemas são, no final das contas, muito diferentes.

### Variáveis

Em JavaScript, existem algumas maneiras de definir variáveis:

```js
const x = 1
let y = 5

console.log(x, y)   // 1, 5 são impressos
y += 10
console.log(x, y)   // 1, 15 são impressos
y = 'algum texto'
console.log(x, y)   // 1, algum texto são impressos
x = 4               // causará um erro
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) não define uma variável, mas uma <i>constante</i> no qual o valor não pode mais ser alterado. Por outro lado, [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) define uma variável padrão.

No exemplo acima, também vemos que o tipo de dados da variável pode mudar durante a execução. No início, _y_ armazena um inteiro; no final, armazena uma string.

Também é possível definir variáveis em JavaScript usando a palavra-chave [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var), que foi, por muito tempo, a única maneira de definir variáveis. const e let foram adicionadas recentemente na versão ES6. Em situações específicas, var funciona de maneira diferente em comparação com as definições de variáveis na maioria das linguagens. Visite [JavaScript Variables - Should You Use let, var or const? on Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) ou [Keyword: var vs. let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) para mais informações. Durante este curso, o uso de var não é recomendado, devendo-se privilegiar const e let!
Você pode ver mais sobre este assunto no YouTube, por exemplo, [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

### Arrays

Um [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) e alguns exemplos de seu uso:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 é impresso
console.log(t[1])     // -1 é impresso

t.forEach(value => {
  console.log(value)  // os números 1, -1, 3, 5 são impressos, cada um em sua própria linha
})                    
```

O importante neste exemplo é o fato de que o conteúdo do array pode ser modificado mesmo que seja definido como uma _const_. Por conta do array ser um objeto, a variável sempre aponta para o mesmo objeto. No entanto, o conteúdo do array muda à medida que novos itens são adicionados a ele.

Uma forma de iterar através dos itens do array é usando _forEach_, como visto no exemplo. _forEach_ recebe uma <i>função</i> definida usando a sintaxe de seta como parâmetro.

```js
value => {
  console.log(value)
}
```

forEach chama a função <i>para cada um dos itens no array</i>, sempre passando o item individual como argumento. A função como argumento de forEach também pode receber [outros argumentos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

No exemplo anterior, um novo item foi adicionado ao array usando o método [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Quando se usa React, técnicas de programação funcional são comumente usadas. Uma característica do paradigma de programação funcional é o uso de estruturas de dados [imutáveis](https://en.wikipedia.org/wiki/Immutable_object). No código React, é preferível usar o método [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), que não adiciona o item ao array, mas cria um array novo no qual o conteúdo do antigo array e o novo item são ambos incluídos.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] é impresso
console.log(t2) // [1, -1, 3, 5] é impresso
```

A chamada de método _t.concat(5)_ não adiciona um novo item ao array antigo, mas retorna um array novo que, além de conter os itens do array antigo, também contém o novo item.

Há muitos métodos úteis definidos para arrays. Vamos dar uma olhada em um pequeno exemplo de uso do método [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
const t = [1, 2, 3]

const m1 = t.map(valor => valor * 2)
console.log(m1)   // [2, 4, 6] é impresso
```

Com base no array antigo, o map cria um <i>array novo</i>, para o qual a função dada como parâmetro é usada para criar os itens. No caso deste exemplo, o valor original é multiplicado por dois.

O map também pode transformar o array em algo completamente diferente:

```js
const m2 = t.map(valor => '<li>' + valor + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] é impresso
```

Aqui, um array preenchido com valores inteiros é transformado em um array contendo strings de HTML usando o método map. Na [parte 2](/ptbr/part2) deste curso, veremos que o map é usado com frequência em React.

Itens individuais de um array são fáceis de atribuir a variáveis com a ajuda da [atribuição via desestruturação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) (_destructuring assignment_).

```js
const t = [1, 2, 3, 4, 5]

const [primeiro, segundo, ...resto] = t

console.log(primeiro, segundo)  // 1, 2 é impresso
console.log(resto)          // [3, 4, 5] é impresso
```

Graças à atribuição, as variáveis _primeiro_ e _segundo_ receberão os dois primeiros inteiros do array como seus valores. Os inteiros restantes são "coletados" em um array próprio que é então atribuído à variável _resto_.

### Objetos

Existem algumas formas diferentes de se definir objetos em JavaScript. Um método muito comum é usar [objetos literais](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals) (_object literals_), que ocorre listando suas propriedades dentro de chaves:

```js
const objeto1 = {
  nome: 'Arto Hellas',
  idade: 35,
  educacao: 'PhD',
}

const objeto2 = {
  nome: 'Desenvolvimento de aplicações web Full Stack',
  nivel: 'Estudos intermediários',
  tamanho: 5,
}

const objeto3 = {
  nome: {
    primeiro: 'Dan',
    ultimo: 'Abramov',
  },
  notas: [2, 3, 5, 3],
  departamento: 'Universidade Stanford',
}
```

Os valores das propriedades podem ser de qualquer tipo, como inteiros, strings, arrays, objetos...

As propriedades de um objeto são referenciadas usando a notação de "ponto", ou usando colchetes:

```js
console.log(objeto1.nome)         // Arto Hellas é impresso
const nomePropriedade = 'idade' 
console.log(objeto1[nomePropriedade])    // 35 é impresso
```

Você também pode adicionar propriedades a um objeto em tempo de execução usando a notação de ponto ou colchetes:

```js
objeto1.endereco = 'Helsinque' // *endereço
objeto1['numero secreto'] = 12341
```

A última adição representada acima tem que ser feita usando colchetes porque, quando se usa a notação de ponto, <i>numero secreto</i> não é um nome de propriedade válido devido ao caractere de espaço separando as duas palavras.

Naturalmente, os objetos em JavaScript também podem ter métodos. No entanto, durante este curso, não precisaremos definir objetos com métodos próprios. É por isso que eles só são discutidos rapidamente durante o curso.

Objetos também podem ser definidos usando funções construtoras, o que resulta em um mecanismo semelhante a muitas outras linguagens de programação, como Java. Apesar desta semelhança, o JavaScript não tem classes tal qual outras linguagens de programação orientadas a objetos. No entanto, a partir da versão ES6, foi adicionada a sintaxe para <i>classes</i>, o que em alguns casos ajuda a estruturar classes orientadas a objetos.

### Funções

Já nos familiarizamos com a definição de _arrow functions_ (funções de seta). O processo completo, sem atalhos, para definir uma _arrow function_ é o seguinte:

```js
const soma = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

E a função é chamada:

```js
const resultado = soma(1, 5)
console.log(resultado)
```

Se houver apenas um parâmetro, podemos excluir os parênteses da definição:

```js
const quadrado = p => {
  console.log(p)
  return p * p
}
```

Se a função contiver apenas uma expressão, então as chaves não são necessárias. Neste caso, a função retorna apenas o resultado de sua única expressão. Agora, se removermos a impressão do console, podemos encurtar ainda mais a definição da função:

```js
const quadrado = p => p * p
```

Este formato é particularmente útil ao manipular arrays, como quando usamos o método "map":

```js
const t = [1, 2, 3]
const tAoQuadrado = t.map(p => p * p)
// tAoQuadrado agora é [1, 4, 9]
```

A funcionalidade da _arrow function_ foi adicionada ao JavaScript há apenas alguns anos, com a versão [ES6](http://es6-features.org/). Antes disso, a única maneira de definir funções era usando a palavra-chave _function_.

Existem duas maneiras de se referenciar uma função; uma é atribuir um nome em uma [declaração de função](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) (_function declaration_).

```js
function produto(a, b) {
  return a * b
}

const resultado = produto(2, 6)
// resultado agora é 12
```

Outra maneira de definir uma função é usando uma [expressão de função](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function) (_function expression_). Neste caso, não é necessário atribuir um nome à função, e a definição pode residir dentro do restante do código:

```js
const media = function(a, b) { // *média
  return (a + b) / 2
}

const resultado = media(2, 5)
// resultado agora é 3.5
```

Durante este curso, todas as funções serão definidas usando a sintaxe de seta.

</div>

<div class="tasks">

  <h3>Exercícios 1.3 a 1.5</h3>

<i>Vamos continuar construindo a aplicação que começamos a trabalhar nas exercícios anteriores. Você pode escrever o código no mesmo projeto, pois estamos interessados apenas no estado final da aplicação.</i>

**DICA PRO:** você pode ter problemas com a estrutura das <i>props</i> que os componentes recebem. Uma boa maneira de tornar as coisas mais claras é imprimindo as props no console, como por exemplo:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

Se e <i>quando</i> você encontrar a mensagem de erro:

> <i>Objetos não são válidos como elementos-filho React.</i>

... tenha em mente o explicado [aqui](/ptbr/part1/introducao_a_biblioteca_react#nao-renderize-objetos).

**Obs.:** o conteúdo dos exercícios foram deixados no idioma original da tradução (inglês) por questões de conveniência, visto a revisão que os mantenedores do curso devem fazer no código enviado ao sistema de avaliação da Universidade de Helsinque. Desta forma, escreva suas aplicações utilizando os mesmos termos usados nas variáveis, componentes, etc que estão em inglês.

  <h4>1.3: course information — 3º passo</h4>

Vamos avançar para o uso de objetos em nossa aplicação. Modifique as definições de variáveis do componente <i>App</i> da forma a seguir e também refatore a aplicação para que continue funcionando:

```js
const App = () => {
  const course = 'Desenvolvimento de aplicação Half Stack'
  const part1 = {
    name: 'Fundamentos da biblioteca React',
    exercises: 10
  }
  const part2 = {
    name: 'Usando props para passar dados',
    exercises: 7
  }
  const part3 = {
    name: 'Estado de um componente',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: course information — 4º passo</h4>

Agora, coloque os objetos em um array. Modifique as definições de variáveis do componente <i>App</i> da seguinte maneira e modifique igualmente as outras partes da aplicação:

```js
const App = () => {
  const course = 'Desenvolvimento de aplicação Half Stack'
  const parts = [
    {
      name: 'Fundamentos da biblioteca React',
      exercises: 10
    },
    {
      name: 'Usando props para passar dados',
      exercises: 7
    },
    {
      name: 'Estado de um componente',
      exercises: 14
    }
  ]


  return (
    <div>
      ...
    </div>
  )
}
```

**Obs.:** Neste ponto, <i>presume-se que há sempre três itens</i>, então não é necessário percorrer os arrays usando _loops_. Voltaremos ao tema de renderização de componentes com base em itens de arrays em uma abordagem minuciosa na [próxima parte do curso](../part2).

De qualquer forma, não passe objetos diferentes como propriedades separadas do componente <i>App</i> para os componentes <i>Content</i> e <i>Total</i>. Em vez disso, passe-os diretamente como um array:

```js
const App = () => {
  // definições "const"

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: course information — 5º passo</h4>

Vamos dar um passo a frente com as mudanças. Transforme a constante "course" (curso) e suas "parts" (partes) em um único objeto JavaScript. Corrija tudo que venha a quebrar.

```js
const App = () => {
  const course = {
    name: 'Desenvolvimento de aplicação Half Stack',
    parts: [
      {
        name: 'Fundamentos da biblioteca React',
        exercises: 10
      },
      {
        name: 'Usando props para passar dados',
        exercises: 7
      },
      {
        name: 'Estado de um componente',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Métodos de objetos e "this"

Como este curso usa uma versão de React que contém React Hooks, não é necessário definir objetos com métodos. **O conteúdo deste capítulo não é relevante para o curso**, mas certamente é bom conhecer. Em particular, ao usar versões antigas de React, é necessário compreender os tópicos deste capítulo.

_Arrow functions_ e funções definidas usando a palavra-chave _function_ variam substancialmente em relação ao comportamento da palavra-chave [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), que se refere ao próprio objeto.

Podemos atribuir métodos a um objeto definindo propriedades que são funções:

```js
const arto = {
  nome: 'Arto Hellas',
  idade: 35,
  educacao: 'PhD', // *educação
  // highlight-start
  cumprimentar: function() { // *saudação
    console.log('olá, meu nome é ' + this.nome)
  },
  // highlight-end
}

arto.cumprimentar()  // "olá, meu nome é Arto Hellas" é impresso
```

Métodos podem ser atribuídos a objetos mesmo após a criação do objeto:

```js
const arto = {
  nome: 'Arto Hellas',
  idade: 35,
  educacao: 'PhD',
  cumprimentar: function() {
    console.log('olá, meu nome é ' + this.nome)
  },
}

// highlight-start
arto.envelhecer = function() {
  this.idade += 1
}
// highlight-end

console.log(arto.idade)   // 35 é impresso
arto.envelhecer()
console.log(arto.idade)   // 36 é impresso
```

Vamos modificar um pouco o objeto:

```js
const arto = {
  nome: 'Arto Hellas',
  idade: 35,
  educacao: 'PhD',
  cumprimentar: function() {
    console.log('olá, meu nome é ' + this.nome)
  },
  // highlight-start
  fazerAdicao: function(a, b) { // *fazerAdição
    console.log(a + b)
  },
  // highlight-end
}

arto.fazerAdicao(1, 4)        // 5 é impresso

const referenciaParaAdicao = arto.fazerAdicao
referenciaParaAdicao(10, 15)   // 25 é impresso
```

Agora, o objeto tem o método _fazerAdicao_, que calcula a soma dos números dados a ele como parâmetros. O método é chamado da maneira tradicional, usando o objeto <em>arto.fazerAdicao(1, 4)</em> ou armazenando uma <i>referência ao método</i> em uma variável e chamando o método através da variável: <em>referenciaParaAdicao(10, 15)</em>.

Se tentarmos fazer o mesmo com o método _cumprimentar_, deparamo-nos com um problema:

```js
arto.cumprimentar()       // "olá, meu nome é Arto Hellas" é impresso

const referenciaParaCumprimentar = arto.cumprimentar
referenciaParCumprimentar() // "olá, meu nome é undefined" é impresso
```

Ao chamar o método através de uma referência, o método perde o conhecimento do que era o _this_ original. Ao contrário de outras linguagens, em JavaScript, o valor de [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) é definido com base <i>em como o método é chamado</i>. Ao chamar o método através de uma referência, o valor de _this_ se torna o chamado [objeto global](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) (_global object_) e o resultado final sai geralmente diferente do que o desenvolvedor originalmente pretendeu.

Perder o rastro do _this_ ao escrever código JavaScript traz alguns problemas eventuais. Algumas situações frequentemente surgem onde React ou o Node (ou mais especificamente o motor JavaScript do navegador) precisa chamar algum método em um objeto que o desenvolvedor tenha definido. No entanto, neste curso, evitamos esses problemas usando o JavaScript "sem this".

Uma situação que leva ao "desaparecimento" do _this_ ocorre quando definimos um tempo limite para chamar a função _cumprimentar_ no objeto _arto_, usando a função [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

```js
const arto = {
  nome: 'Arto Hellas',
  cumprimentar: function() {
    console.log('olá, meu nome é ' + this.nome)
  },
}

setTimeout(arto.cumprimentar, 1000)  // highlight-line
```

Como mencionado, o valor de _this_ em JavaScript é definido com base na forma como o método é chamado. Quando o <em>setTimeout</em> está chamando o método, é o motor JavaScript que realmente chama o método e, nesse ponto, _this_ se refere ao objeto global.

Existem vários mecanismos pelos quais o _this_ original pode ser preservado. Um desses é usando um método chamado [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) (significa amarrar ou atar):

```js
setTimeout(arto.cumprimentar.bind(arto), 1000)
```

Chamar <em>arto.cumprimentar.bind(arto)</em> cria uma nova função onde _this_ é obrigado a apontar para Arto, independentemente de onde e como o método está sendo chamado.

Usando [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) é possível resolver alguns dos problemas relacionados ao _this_. No entanto, eles não devem ser usados como métodos para objetos, pois o _this_ não funciona de forma alguma. Mais tarde, voltaremos a discutir o comportamento da palavra-chave _this_ em relação às _arrow functions_.

Se deseja compreender de fato como _this_ funciona em JavaScript, a Internet está cheia de material sobre o assunto como, por exemplo, a série _screencast_ [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) por [egghead.io](https://egghead.io), que é extremamente recomendada!

### Classes

Como mencionado anteriormente, não há um "mecanismo" de classes em JavaScript como os de linguagens de programação orientadas a objetos. No entanto, há funcionalidades para tornar possível a "simulação" de [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) orientadas a objetos.

Vamos dar uma olhada na <i>sintaxe para classes</i> que foi introduzida ao JavaScript com o ES6, o que simplifica substancialmente a definição de classes (ou estruturas semelhantes a classes) em JavaScript.

No exemplo a seguir, definimos uma "classe" chamada Pessoa e dois objetos Pessoa:

```js
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome
    this.idade = idade
  }
  cumprimentar() {
    console.log('olá, meu nome é ' + this.nome)
  }
}

const adam = new Pessoa('Adam Ondra', 29)
adam.cumprimentar()

const janja = new Pessoa('Janja Garnbret', 23)
janja.cumprimentar()
```

Quanto à sintaxe, as classes e os objetos criados a partir delas são muito semelhantes às classes e objetos Java. Seu comportamento também é bastante semelhante aos objetos Java. Mas em seu mecanismo interno, ainda são objetos baseados na [herança prototipal](https://developer.mozilla.org/en/docs/Learn/JavaScript/Objects/Inheritance) de JavaScript. O tipo de ambos os objetos é, na verdade, _Object_, uma vez que o JavaScript essencialmente define apenas os tipos [Boolean, Null, Undefined, Number, String, Symbol, BigInt e Object](https://developer.mozilla.org/en/docs/Web/JavaScript/Data_structures).

A inserção da sintaxe para classes foi uma adição controversa. Confira [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) ou [Is “Class” In ES6 The New “Bad” Part? on Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) para mais detalhes.

A sintaxe para classe ES6 é muito utilizada no "antigo" React e também no Node.js, portanto, é benéfico ter compreensão dela mesmo neste curso. Entretanto, como estaremos usando a nova funcionalidade [Hooks](https://reactjs.org/docs/hooks-intro.html) do React ao longo deste curso, não teremos uso concreto da sintaxe para classes de JavaScript.

### Materiais de JavaScript

Existem guias bons e ruins para JavaScript na Internet. A maioria dos links nesta página relacionados às funcionalidades de JavaScript referem-se ao [Guia JavaScript da Mozilla](https://developer.mozilla.org/en/docs/Web/JavaScript).

É recomendado ler imediatamente o artigo [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Overview) no site da Mozilla.

Se deseja conhecer profundamente JavaScript, há uma ótima série de livros gratuitos na Internet chamada [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

Outra ótima fonte para aprender JavaScript é [javascript.info](https://javascript.info).
  
O extremamente cativante e gratuito [Eloquent JavaScript](https://eloquentjavascript.net) te leva rapidamente dos conceitos básicos à construção de aplicações muito interessantes. É uma mistura de teoria, projetos e exercícios, e cobre tanto a teoria geral de programação quanto a linguagem JavaScript.

[egghead.io](https://egghead.io) possui muitos _screencasts_ de qualidade sobre JavaScript, React e outros tópicos interessantes. Infelizmente, alguns dos materiais só são acessíveis na versão paga.

</div>
