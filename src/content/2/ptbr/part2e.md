---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: ptbr
---

<div class="content">

A aparência atual da nossa aplicação está bastante modesta. No [exercício 0.2](/ptbr/part0/fundamentos_de_aplicacoes_web#exercicios-0-1-a-0-6), o objetivo era passar pelo tutorial [CSS da Mozilla](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

Vamos dar uma olhada em como podemos adicionar estilos a uma aplicação React. Existem várias maneiras diferentes de fazer isso e veremos os outros métodos mais tarde. Primeiro, adicionaremos o CSS à nossa aplicação da maneira antiga; em um único arquivo sem usar um [pré-processador CSS](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (embora isso não seja inteiramente verdade, como aprenderemos mais tarde).

Vamos criar um novo arquivo chamado <i>index.css</i> no diretório <i>src</i> e vamos adicioná-lo à aplicação importando-o no arquivo <i>index.js</i>:

```js
import './index.css'
```

Vamos adicionar a seguinte regra CSS ao arquivo <i>index.css</i>:

```css
h1 {
  color: green;
}
```

As regras CSS consistem em <i>seletores</i> (selectors) e <i>declarações</i> (declarations). O seletor define a quais elementos a regra deve ser aplicada. O seletor acima é <i>h1</i>, que corresponderá a todas as tags de cabeçalho <i>h1</i> em nossa aplicação.

A declaração define a propriedade _color_ com o valor <i>green</i> (verde).

Uma regra CSS pode conter um número arbitrário de propriedades. Vamos modificar a regra anterior para tornar o texto cursivo, definindo o estilo da fonte como <i>italic</i> (itálico):

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

Existem muitas maneiras de corresponder a elementos usando [diferentes tipos de seletores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

Se quiséssemos direcionar, digamos, cada uma das notas com nossos estilos, poderíamos usar o seletor <i>li</i>, já que todas as notas estão envolvidas em tags <i>li</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Vamos adicionar a seguinte regra à nossa folha de estilo (já que meu conhecimento em web design moderno elegante é próximo a zero, os estilos aqui adicionados não fazem muito sentido):

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

Usar tipos de elementos para definir regras CSS é um tanto problemático. Se nossa aplicação contiver outras tags <i>li</i>, a mesma regra de estilo também será aplicada a elas.

Se quisermos aplicar nosso estilo especificamente às notas, a melhor opção é usar [seletores de classe](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

Em HTML comum, as classes são definidas como o valor do atributo <i>class</i>:

```html
<li class="note">algum texto...</li>
```

Em React, temos que usar o atributo [className](https://reactjs.org/docs/dom-elements.html#classname) em vez do atributo <i>class</i>. Com isso em mente, façamos as seguintes alterações em nosso componente <i>Note</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li className='note'> // highlight-line
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Os seletores de classe são definidos com a sintaxe _.className_:

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

Se você adicionar outros elementos <i>li</i> à aplicação agora, eles não serão afetados pela regra de estilo acima.

### Uma mensagem de erro aprimorada

Anteriormente, implementamos a mensagem de erro que era exibida quando o usuário tentava alternar a importância de uma nota excluída com o método <em>alert</em>. Vamos implementar a mensagem de erro como seu próprio componente React.

O componente é bastante simples:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
```

Se o valor da prop <em>message</em> for <em>null</em>, nada é renderizado na tela e, em outros casos, a mensagem é renderizada dentro de um elemento div.

Vamos adicionar um novo pedaço de estado chamado <i>errorMessage</i> ao componente <i>App</i>. Vamos inicializá-lo com alguma mensagem de erro para que possamos testar imediatamente nosso componente:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Vamos adicionar uma regra de estilo que sirva para uma mensagem de erro:

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

Agora estamos prontos para adicionar a lógica para exibir a mensagem de erro. Vamos mudar a função <em>toggleImportanceOf</em> da seguinte maneira:

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

Quando o erro acontece, adicionamos uma mensagem de erro descritiva ao estado <em>errorMessage</em>. Ao mesmo tempo, iniciamos um temporizador, que definirá o estado <em>errorMessage</em> como <em>null</em> após 5 (cinco) segundos.

O resultado fica assim:

![captura de tela de erro: removido do servidor da aplicação](../../images/2/26e.png)

O código para o estado atual da nossa aplicação pode ser encontrado na branch <i>part2-7</i> no [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7).

### Estilos inline

React também possibilita escrever estilos diretamente no código com o chamados [estilos inline](https://reactjs.org/docs/dom-elements.html#style) (ou "estilos em linha").

A ideia por trás da definição de estilos inline é extremamente simples. É possível fornecer a qualquer componente ou elemento React um conjunto de propriedades CSS como um objeto JavaScript através do atributo [style](https://reactjs.org/docs/dom-elements.html#style) (estilo).

As regras CSS são definidas de forma um tanto diferente em JavaScript se comparadas com as de arquivos CSS comuns. Digamos que quiséssemos dar a um elemento a cor verde e uma fonte itálica de 16 pixels de tamanho. Em CSS, ficaria assim:

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

Mas como se trata de um objeto de estilo inline React, ficaria assim:

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Cada propriedade CSS é definida como uma propriedade separada do objeto JavaScript. Valores numéricos em pixels podem ser definidos com simples números inteiros. Uma das principais diferenças em comparação ao CSS comum é que propriedades CSS com hífen (kebab case) são escritas em camelCase.

Em seguida, poderíamos adicionar um "bloco inferior" à nossa aplicação criando um componente <i>Footer</i> e definindo-o com os seguintes estilos inline:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer /> // highlight-line
    </div>
  )
}
```

Estilos inline possuem certas limitações. Por exemplo, não é possível usar as chamadas [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) diretamente neles.

Estilos inline e algumas outras maneiras de adicionar estilos aos componentes React vão completamente contra a corrente das antigas convenções. Tradicionalmente, tem sido considerada a melhor prática separar completamente o CSS do conteúdo (HTML) e da funcionalidade (JavaScript). De acordo com essa antiga escola de pensamento, o objetivo era escrever o CSS, o HTML e o JavaScript em arquivos separados.

A filosofia do React é, na verdade, o oposto disso. Como a separação de CSS, HTML e JavaScript em arquivos separados não parecia ter escalabilidade em aplicativos maiores, o React baseia a divisão do aplicativo ao longo das linhas de suas entidades funcionais lógicas.

As unidades estruturais que compõem as entidades funcionais da aplicação são os componentes React. Um componente React define o HTML para estruturar o conteúdo, as funções JavaScript para determinar a funcionalidade e também o estilo do componente; tudo em um só lugar. Isso é para criar componentes individuais que sejam o mais independentes e reutilizáveis possível.

O código da versão final da nossa aplicação pode ser encontrado na branch <i>part2-8</i> no [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8).

</div>

<div class="tasks">

<h3>Exercícios 2.16 a 2.17</h3>

<h4>2.16: The Phonebook — 11º passo</h4>

Use como guia o exemplo da [mensagem de erro aprimorada](/ptbr/part2/adicionando_estilos_a_aplicacao_react#uma-mensagem-de-erro-aprimorada) da Parte 2 para exibir uma notificação que dure alguns segundos depois que uma operação bem-sucedida for executada (uma pessoa é adicionada ou um número é alterado):

![captura de tela: 'adicionado com sucesso' em verde](../../images/2/27e.png)

<h4>2.17*: The Phonebook — 12º passo</h4>

Abra sua aplicação em dois navegadores. **Se você excluir uma pessoa no navegador 1** um pouco antes de tentar <i>alterar o número de telefone da pessoa</i> no navegador 2, você receberá a seguinte mensagem de erro:

![mensagem de erro "404 not found" quando se altera a aplicação em múltiplos navegadores](../../images/2/29b.png)

Corrija o problema de acordo com o exemplo mostrado em [promessas e erros](/ptbr/part2/alterando_dados_no_servidor#promessas-e-erros) na Parte 2. Modifique o exemplo para que uma mensagem seja mostrada ao usuário quando a operação for mal-sucedida. As mensagens exibidas para eventos bem e mal sucedidos devem ser diferentes:

![mensagem de erro exibida na tela em vez do console - recurso complementar](../../images/2/28e.png)

**Observe** que mesmo se você gerenciar (handle) a exceção, a mensagem de erro ainda é impressa no console.

</div>

<div class="content">

### Algumas observações importantes

Há alguns exercícios mais desafiadores no final desta parte. Você pode pular os exercícios se eles forem muito complicados, pois nós voltaremos aos mesmos temas mais tarde; porém, vale a pena ler o conteúdo, de qualquer forma.

Fizemos uma coisa em nossa aplicação que "mascara" uma fonte muito típica de erro.

Definimos o estado _notes_ com um valor inicial de um array vazio:

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

Esse é um valor inicial bem lógico, uma vez que as notas são um conjunto, isto é, há muitas notas que o estado irá armazenar.

Se o estado estivesse salvando apenas "uma coisa", um valor inicial mais adequado seria _null_, indicando que não há <i>nada</i> no início do estado. Vamos ver o que acontece se usarmos esse valor inicial:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

A aplicação quebra:

![console com erro de tipo: typerror cannot read properties of null](../../images/2/31a.png)

A mensagem de erro fornece a razão e a localização do erro. O código que causou o problema é o seguinte:

```js
  // notesToShow gets the value of notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // ...

  {notesToShow.map(note =>  // highlight-line
    <Note key={note.id} note={note} />
  )}
```

A mensagem de erro é:

```
Cannot read properties of null (reading 'map')
```

A variável _notesToShow_ recebe primeiro o valor do estado _notes_ e depois o código tenta chamar o método _map_ em um objeto inexistente, ou seja, _null_.

Qual é a razão disso?

O hook de efeito (effect hook) utiliza a função _setNotes_ para definir que _notes_ terá as notas que o back-end está retornando:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

No entanto, o problema é que o efeito é executado somente <i>após a primeira renderização</i>.
E por conta de _notes_ ter o valor inicial _null_:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

o código a seguir é executado na primeira renderização:

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

e isso faz com que a aplicação quebre, já que não podemos chamar o método _map_ no valor _null_.

Não há erro quando definimos _notes_ para ser inicialmente um array vazio, já que é permitido chamar o método _map_ em um array vazio.

Assim, a inicialização do estado "mascarou" o problema que é causado pelo fato de que os dados ainda não foram buscados no back-end.

Outra maneira de contornar o problema é usar a renderização condicional e retornar um valor nulo se o estado do componente não estiver adequadamente inicializado:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line
  // ... 

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // do not render anything if notes is still null
  // highlight-start
  if (!notes) { 
    return null 
  }
  // highlight-end

  // ...
} 
```

Assim, nada é renderizado na primeira renderização. Quando as notas chegam do servidor, o efeito usa a função _setNotes_ que define o valor do estado _notes_. Isso faz com que o componente seja renderizado novamente e, na segunda renderização, as notas são exibidas na tela.

O método baseado na renderização condicional é adequado em casos em que é impossível definir o estado para o qual a renderização inicial seja possível.

Um outro detalhe que ainda precisamos examinar mais de perto é o segundo parâmetro de useEffect:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  
      })
  }, []) // highlight-line
```

O segundo parâmetro de <em>useEffect</em> é utilizado para [especificar com que frequência o efeito é executado](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).
O princípio é que o efeito é sempre executado após a primeira renderização do componente <i>e</i> quando o valor do segundo parâmetro muda.

Se o segundo parâmetro for um array vazio <em>[]</em>, seu conteúdo nunca muda e o efeito é executado somente após a primeira renderização do componente. Isso é exatamente o que queremos quando estamos inicializando o estado da aplicação a partir do servidor.

No entanto, há situações em que queremos executar o efeito em outros momentos, por exemplo, quando o estado do componente muda de uma maneira específica.

Considere a aplicação simples a seguir que consulta as taxas de câmbio da [Exchange rate API](https://www.exchangerate-api.com/):

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>
    </div>
  )
}
```

A interface de usuário da aplicação possui um formulário, onde no campo de entrada é escrito o nome da moeda (currency) desejada. Se a moeda existir, a aplicação renderiza as taxas de câmbio da moeda inserida para outras moedas:

![Navegador exibindo taxas de câmbio com "eur" digitado e console dizendo "buscando as taxas de câmbio..."](../../images/2/32new.png)

Quando o botão é clicado, a aplicação pega o nome da moeda inserido no formulário e faz o set no estado _currency_.

Quando _currency_ recebe um novo valor, a aplicação busca suas taxas de câmbio da API na função de efeito:

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency]) // highlight-line
  // ...
}
```

O hook useEffect agora tem _[currency]_ como segundo parâmetro. A função de efeito é, portanto, executada após a primeira renderização e <i>sempre</i> depois que a tabela que é definida no segundo parâmetro _[currency]_ muda. Ou seja, quando o estado _currency_ recebe um novo valor, o conteúdo da tabela muda e a função de efeito é executada.

O efeito tem esta condição:

```js
if (currency) { 
  // exchange rates are fetched
}
```

que impede a requisição das taxas de câmbio logo após a primeira renderização, quando a variável _currency_ ainda tem o valor inicial, ou seja, um valor nulo.

Portanto, se o usuário escrever, por exemplo, <i>eur</i> no campo de pesquisa, a aplicação usa a biblioteca Axios para fazer uma requisição HTTP GET ao endereço https://open.er-api.com/v6/latest/eur e armazena a resposta no estado _rates_.

Quando o usuário inserir outro valor no campo de pesquisa, por exemplo, <i>usd</i>, a função de efeito é executada novamente e as taxas de câmbio da nova moeda são requisitadas da API.

A forma apresentada aqui para fazer requisições à API pode parecer um pouco estranha.
Esta aplicação em específico poderia ter sido completamente construída sem a necessidade de usar o hook useEffect, por meio de requisições feitas à API diretamente na função de gerência de envio do formulário:

```js
  const onSearch = (event) => {
    event.preventDefault()
    axios
      .get(`https://open.er-api.com/v6/latest/${value}`)
      .then(response => {
        setRates(response.data.rates)
      })
  }
```

No entanto, existem situações em que essa técnica não funcionaria. Por exemplo, é <i>possível</i> que você encontre uma situação dessas no exercício 2.20, onde o uso do hook useEffect possa fornecer uma solução. Observe que isso depende muito da abordagem selecionada; por exemplo, a solução do modelo não usa esse truque.

</div>

<div class="tasks">

<h3>Exercícios 2.18 a 2.20</h3>

<h4>2.18*: Data for countries — 1º passo</h4>

A API [https://restcountries.com](https://restcountries.com) fornece dados de diferentes países em um formato legível por máquina (machine-readable format), uma chamada API REST.

<i>**Nota dos tradutores:** A API recebe consultas somente em inglês.</i>

Crie uma aplicação onde se possa ver os dados de vários países. A aplicação vai provavelmente obter os dados do <i>endpoint</i> [all](https://restcountries.com/v3.1/all).

Se o serviço não estiver disponível, você pode usar o serviço alternativo em https://studies.cs.helsinki.fi/restcountries/

A interface de usuário é muito simples. O país a ser exibido deve ser encontrado através de uma consulta em um campo de pesquisa.

Se houver muitos países (mais de 10) que correspondam à consulta, é solicitado ao usuário que seja mais específico na consulta:

![captura de tela com a resposta 'too many matches'](../../images/2/19b1.png)

Se houver dez ou menos países, porém mais de um, todos os países que correspondem à consulta são exibidos:

![captura de tela dos países correspondentes em uma lista](../../images/2/19b2.png)

Quando houver apenas um país que corresponda à consulta, os dados básicos do país (capital e área, por exemplo), sua bandeira e os idiomas falados no país são exibidos:

![captura de tela da bandeira e dos atributos adicionais](../../images/2/19c3.png)

**Obs.:**: Já é suficiente que sua aplicação funcione para a maioria dos países. Alguns países, como o <i>Sudan</i> (Sudão), podem ser difíceis de ajustar, já que o nome do país faz parte do nome de outro país, <i>South Sudan</i> (Sudão do Sul). Você não precisa se preocupar com esses casos extremos.

**AVISO**: "create-react-app" transformará automaticamente seu projeto em um repositório git, a menos que você crie sua aplicação dentro de um repositório git já existente.**Você muito provavelmente não quer que cada um de seus projetos seja um repositório separado**, então basta executar o comando _rm -rf .git_ na raiz de sua aplicação para aplicar as modificações.

<h4>2.19*: Data for countries — 2º passo</h4>

**Ainda há muito o que fazer nesta parte, então não fique preso neste exercício!**

Melhore a aplicação do exercício anterior de modo que quando os nomes de vários países são exibidos na página, haja um botão ao lado do nome do país que, ao ser clicado, exiba as informações desse país:

![funcionalidade atrelada que exibe botões para cada país](../../images/2/19b4.png)

Neste exercício, é suficiente que sua aplicação funcione para a maioria dos países. Países cujo nome aparece no nome de outro país, como o <i>Sudão</i>, podem ser ignorados.

<h4>2.20*: Data for countries — 3º passo</h4>

**Ainda há muito o que fazer nesta parte, então não fique preso neste exercício!**

Adicione à funcionalidade que exibe os dados de um único país o relatório meteorológico para a capital desse país. Existem dezenas de provedores de dados meteorológicos. Uma API sugerida é a [https://openweathermap.org](https://openweathermap.org). Observe que pode levar alguns minutos até que a chave gerada da API seja validada.

![funcionalidade adicionada que exibe os dados meteorológicos](../../images/2/19x.png)

Se você usar o Open Weather map, a descrição de como obter os ícones climáticos encontra-se [aqui](https://openweathermap.org/weather-conditions#Icon-list).

**Obs.::** Em alguns navegadores (como o Firefox), a API escolhida pode enviar uma resposta de erro, o que indica que a criptografia HTTPS não é suportada, mesmo que a URL da requisição comece com _http://_. Esse problema pode ser corrigido concluindo o exercício usando o Chrome.

**Obs.::** Quase todos os serviços meteorológicos exigem que você use uma chave de API. Não salve a chave de API no controle de versão (Git)! Nem programe usando a chave de API em seu código-fonte. Em vez disso, use uma [variável de ambiente](https://create-react-app.dev/docs/adding-custom-environment-variables/) (environment variable) para salvar a chave.

Supondo que a chave de API seja <i>t0p53cr3t4p1k3yv4lu3</i>, quando a aplicação é iniciada desta forma:

```bash
REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 npm start // Para o Bash do Linux/macOS
($env:REACT_APP_API_KEY="t0p53cr3t4p1k3yv4lu3") -and (npm start) // Para o PowerShell do Windows
set "REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3" && npm start // Para o cmd.exe do Windows
```

é possível acessar o valor da chave através do objeto _process.env_:

```js
const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup
```

Observe que, se você criou a aplicação usando _npx create-react-app ..._ e deseja usar um nome diferente para sua variável de ambiente, o nome da variável de ambiente ainda deve começar com *REACT\_APP_*. Também é possível usar um arquivo `.env` em vez de defini-la na linha de comando todas a vezes, criando um arquivo chamado '.env' na raiz do projeto e adicionando o seguinte:

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

Observe que você precisará reiniciar o servidor para aplicar as alterações.

Este foi o último exercício para esta parte do curso, e é hora de enviar seu código para o GitHub e marcar todos os seus exercícios concluídos na guia "my submissions" do [sistema de envio de exercícios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
