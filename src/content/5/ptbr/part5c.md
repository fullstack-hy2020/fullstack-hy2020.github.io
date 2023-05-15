---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: ptbr

---

<div class="content">

Existem algumas formas de testar aplicações React. Vamos dar uma olhada em algumas delas a frente. 

Testes serão implementados com a mesma [Jest](http://jestjs.io/) biblioteca de teste desenvolvida pelo Facebook que foi usada na parte anterior. Jest é configurado por padrão para aplicações criadas com o create-react-app.

Além do JEST, também precisamos de outra biblioteca de testes que nos ajude a renderizar componentes para fins de teste. A melhor opção atual para isso é [react-test-library](https://github.com/testing-library/react-testing-library) que sofreu um rápido crescimento de popularidade nos últimos tempos.

Vamos instalar a biblioteca com o comando:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Também instalamos [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/), que fornece alguns métodos auxiliares relacionados a Jest.

Vamos primeiro escrever testes para o componente responsável por renderizar uma nota:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Observe que o elemento <i>li</i> possui o [CSS](https://reactjs.org/docs/dom-elements.html#classname) className <i>note</i> , que poderia ser usado para acessar o componente em nossos testes.

### Renderizando o componente para testes

Escreveremos nosso teste no arquivo <i>src/components/note.test.js</i> , que está no mesmo diretório que o próprio componente.

O primeiro teste verifica que o componente renderiza o conteúdo da nota:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

Após a configuração inicial, o teste renderiza o componente com o [render](https://testing-library.com/docs/react-testing-library/api#render) que é uma função fornecida pela react-testing-library:

```js
render(<Note note={note} />)
```

Normalmente, os componentes React são renderizados no <i>DOM</i> . O método de renderização que usamos renderiza os componentes em um formato adequado para testes sem renderizá-los ao DOM.

Podemos usar o objeto [screen](https://testing-library.com/docs/queries/about#screen) para acessar o componente renderizado. Usamos o método da Screen [getByText](https://testing-library.com/docs/queries/bytext) para procurar um elemento que tenha o conteúdo da nota e garantir que ele exista:

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

### Testes de execução

Create-react-app configura os testes a serem executados no modo Watch por padrão, o que significa que o comando _npm test_ não terminará assim que os testes terminarem e, em vez disso, aguardará as alterações a serem feitas no código. Depois que novas alterações no código são salvas, os testes são executados automaticamente, depois disso Jest volta a aguardar que novas alterações sejam feitas.

Se você deseja executar testes "normalmente", pode fazê-lo com o comando:

```js
CI=true npm test
```

Para usuários do Windows (PowerShell)

```js
$env:CI=$true; npm test
```

**Obs:** O console pode emitir um aviso se você não tiver instalado o Watchman. O Watchman é uma aplicação desenvolvida pelo Facebook que observa as alterações feitas nos arquivos. O programa acelera a execução dos testes e pelo menos a partir do MacOS Sierra, executando testes no modo watch emite alguns avisos no console, que podem ser removidos instalando o Watchman.

As instruções para instalar o Watchman em diferentes sistemas operacionais podem ser encontradas no site oficial do Watchman: <https://facebook.github.io/watchman/>

### Localização do arquivo de teste

No React, existem (pelo menos) [duas convenções diferentes](https://medium.com/@jefflombardjr/organizing-tests-in-jest-17fc431ff850) para a localização do arquivo de teste. Criamos nossos arquivos de teste de acordo com o padrão atual, colocando -os no mesmo diretório que o componente que está sendo testado.

A outra convenção é armazenar os arquivos de teste "normalmente" em um diretório _test_ separado. Qualquer que seja a convenção que escolhemos, é quase garantido que esteja errado de acordo com a opinião de alguém.

Não gosto dessa maneira de armazenar testes e código de aplicações no mesmo diretório. O motivo pelo qual escolhemos seguir esta convenção é que ela é configurada por padrão em aplicações criados pelo Create-React-App.

### Procurando conteúdo em um componente

O pacote react-testing-library oferece muitas maneiras diferentes de investigar o conteúdo do componente que está sendo testado. Na realidade, o _expect_ em nosso teste não é necessário.

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  expect(element).toBeDefined() // highlight-line
})
```

O teste falha se _getByText_ não encontrar o elemento que está procurando.

Também poderíamos usar [CSS-selectors](https://developer.mozilla.org/pt-BR/docs/web/css/css_selectors) para encontrar elementos renderizados usando o método [queryselector](https: // desenvolvedor. mozilla.org/en-us/docs/web/api/document/queryselector) do objeto [container](https://testing-library.com/docs/react-testing-library/api/#container-1) que é um dos campos retornados pela renderização:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />) // highlight-line

// highlight-start
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  // highlight-end
})
```

Existem também outros métodos, por exemplo, [getByTestId](https://testing-library.com/docs/queries/bytestid/), que procuram elementos com base em id-attributes que são inseridos no código especificamente para fins de teste.

### Testes de depuração

Normalmente, encontramos muitos tipos diferentes de problemas ao escrever nossos testes.

Objeto _screen_ possui método [debug](https://testing-library.com/docs/queries/about/#screendebug) que pode ser usado para imprimir o HTML de um componente para o terminal. Se alterarmos o teste da seguinte forma:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug() // highlight-line

  // ...

})
```

O HTML é impresso no console:

```js
console.log
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

Também é possível usar o mesmo método para imprimir um elemento procurado para consolar:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)  // highlight-line

  expect(element).toBeDefined()
})
```

Agora o HTML do elemento procurado é impresso:

```js
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Botões de clique em testes

Além de exibir conteúdo, o componente <i>Nota</i> também garante que, quando o botão associado à nota é pressionado, a função que manipula eventos (event handler) _toggleImportance_ é chamada.

Vamos instalar uma biblioteca [user-event](https://testing-library.com/docs/user-event/intro) que facilita a simulação de entrada do usuário:

```bash
npm install --save-dev @testing-library/user-event
```

Testando essa funcionalidade pode ser realizada assim:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

Existem algumas coisas interessantes relacionadas a este teste. O event handler é uma função [mock](https://jestjs.io/pt-BR/docs/mock-functions) definida com jest:

```js
const mockHandler = jest.fn()
```

Uma [sessão](https://testing-library.com/docs/user-event/setup/) é iniciada para interagir com o componente renderizado:

```js
const user = userEvent.setup()
```

O teste encontra o botão com <i>base no texto</i> do componente renderizado e clica no elemento:

```js
const button = screen.getByText('make not important')
await user.click(button)
```

Clicar acontece com o método [click](https://testing-library.com/docs/user-event/convenience/#click) da biblioteca userevent-library.

A expectativa do teste verifica que a <i>função mock</i> foi chamada exatamente uma vez.

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

[Objetos e funções mock](https://pt.wikipedia.org/wiki/Objeto_mock) são componentes omumente usados nos testes para substituir as dependências dos componentes que estão sendo testados. Mocks possibilitam retornar respostas codificadas e verificar o número de vezes que as funções mocks são chamadas e com quais parâmetros.

Em nosso exemplo, a função mock é uma escolha perfeita, desde que ela  possa ser facilmente usada para verificar se o método é chamado exatamente uma vez.

### Testes para o componente <i>Togglable</i>

Vamos escrever alguns testes para o componente <i>Togglable</i>. Vamos adicionar o o nome de classe de css <i>togglableContent</i>  ao DIV que retorna os componentes filhos.

```js
const Togglable = forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent"> // highlight-line
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

Os testes são mostrados abaixo:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})
```

A função _beforeEach_ é chamada antes de cada teste, o que renderiza o componente <i>Togglable</i> e salva o campo _container_ do valor de retorno.

O primeiro teste verifica que o componente <i>Togglable</i> renderiza seu componente filho

```js
<div className="testDiv">
  conteúdo alternável
</div>
```

Os testes restantes usam o método [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) para verificar se o componente filho do componente <i>Togglable</i> não é visível inicialmente, verificando se o estilo do elemento <i>div</i> contém _{ display: 'none' }_. Outro teste verifica que, quando o botão é pressionado, o componente é visível, o que significa que o estilo para ocultar o componente <i>não é mais</i> atribuído ao componente.

Vamos também adicionar um teste que pode ser usado para verificar se o conteúdo visível pode ser oculto clicando no segundo botão do componente:

```js
describe('<Togglable />', () => {

  // ...

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
```

### Testando os formulários

Já usamos a função Click do [user-event](https://testing-library.com/docs/user-event/intro) em nossos testes anteriores para clicar em botões.

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

Também podemos simular a entrada de texto com <i>userEvent</i>.

Vamos fazer um teste para o componente <i>NoteForm</i>. O código do componente é o seguinte.

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

O formulário funciona chamando a função _createNote_ que ele recebeu como adereços com os detalhes da nova nota.

O teste é o seguinte:

```js
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

Os testes têm acesso ao campo de entrada usando a função [getByRole](https://testing-library.com/docs/queries/byrole).

O método [type](https://testing-library.com/docs/user-event/utility#type) do userEvent é usado para escrever texto no campo de entrada.

A primeira expectativa de teste garante que o envio do formulário chama o método _createNote_.
A segunda expectativa verifica, que o event handler é chamado com os parâmetros corretos - que uma nota com o conteúdo correta é criada quando o formulário é preenchido.

### Sobre encontrar os elementos

Vamos supor que o formulário tenha dois campos de entrada

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Agora a abordagem que nosso teste usa para encontrar o campo de entrada

```js
const input = screen.getByRole('textbox')
```
  
causaria um erro:

![Erro do nó que mostra dois elementos com caixa de texto, já que usamos getByRole](../../images/5/40.png)

A mensagem de erro sugere usar <i>getAllByRole</i>. O teste pode ser corrigido da seguinte maneira:

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

Método <i>getAllByRole</i> agora retorna uma matriz e o campo de entrada correto é o primeiro elemento da matriz. No entanto, essa abordagem é um pouco suspeita, pois se baseia na ordem dos campos de entrada.

Muitas vezes, os campos de entrada têm um <i>placeholder</i> que sugere o usuário que tipo de entrada é esperada. Vamos adicionar um espaço reservado ao nosso formulário:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write note content here' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Agora, encontrar o campo de entrada certo é fácil com o método [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext):

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write here note content') // highlight-line 
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

A maneira mais flexível de encontrar elementos nos testes é o método <i>querySelector</i> do objeto _container_, que é retornado por _render_, como foi mencionado [anteriormente nesta parte](/ptbr/part5/testando_aplicacoes_react#procurando-por-conteudo-em-um-componente). Qualquer seletor de CSS pode ser usado com esse método para pesquisar elementos nos testes.

Considere por exemplo. que definiríamos um _id _id único para o campo de entrada:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          id='note-input' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

O elemento input agora pode ser encontrado no teste da seguinte forma:

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

No entanto, seguiremos a abordagem de usar _getByPlaceholderText_ no teste.

Vejamos alguns detalhes antes de seguir em frente. Vamos supor que um componente renderia o texto para um elemento HTML da seguinte maneira:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      Your awesome note: {note.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
```

O comando _getByText_ que o teste usa faz <i>não</i> Encontre o elemento

```js
test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(')

  expect(element).toBeDefined()
})
```

Command _getByText_ procura um elemento que tenha o **mesmo texto**  que possui como parâmetro e nada mais. Se quisermos procurar um elemento que <i>contém</i> o texto, poderíamos usar uma opção extra:

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

ou poderíamos usar o comando _findByText_:

```js
const element = await screen.findByText('Does not work anymore :(')
```

É importante notar que, diferentemente dos outros comandos _ByText_, _findByText_ retorna uma promessa!

Existem situações em que mais uma forma do comando _queryByText_ é útil. O comando retorna o elemento, mas <i>não causa uma exceção</i> se o elemento não for encontrado.

Nós poderíamos por exemplo. Use o comando para garantir que algo <i>não seja renderizado</i> ao componente:

```js
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

### Cobertura de teste

Podemos descobrir facilmente a [cobertura](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) de nossos testes executando-os com o comando.

```js
CI=true npm test -- --coverage
```

![saída do terminal da cobertura de teste](../../images/5/18ea.png)

Um relatório HTML bastante primitivo será gerado para o diretório <i>coverage/lcov-report</i>.
O relatório nos dirá as linhas de código não testado em cada componente:

![Relatório HTML da cobertura do teste](../../images/5/19ea.png)

Você pode encontrar o código para nossa aplicação atual na íntegra em  <i>part5-8</i> deste [repositório do github](https://github.com/fullstack-hy2020/part2-notes/tree/parte5-8).
</div>

<div class="tasks">

### Exercícios 5.13.-5.16.

#### 5.13: Testes da lista de blogs, Etapa1

Faça um teste, que verifica se o componente que exibe um blog renderiza o título e o autor do blog, mas não renderiza sua URL ou número de curtidas por padrão.

Adicione as classes CSS ao componente para ajudar o teste conforme necessário.

#### 5.14: Testes da lista de blogs, Etapa2

Faça um teste, que verifica se a URL do blog e o número de curtidas são mostrados quando o botão que controla os detalhes mostrado foi clicado.

#### 5.15: Testes da lista de blogs, Etapa3

Faça um teste, que garante que, se o botão como foi clicado duas vezes, o componente event handlerrecebido é chamado duas vezes.

#### 5.16: Testes da lista de blogs, Etapa4

Faça um teste para o novo formulário do blog. O teste deve verificar se o formulário chama o event handler que recebeu como parâmetro com os detalhes certos quando um novo blog for criado.

</div>

<div class="content">

### Testes de integração de front -end

Na parte anterior do material do curso, escrevemos testes de integração para o back-end que testou sua lógica e conectou o banco de dados através da API fornecida pelo back-end. Ao escrever esses testes, tomamos a decisão consciente de não escrever testes de unidade, pois o código para esse back-end é bastante simples, e é provável que os bugs em nossa aplicação ocorram em cenários mais complicados do que os testes de unidade adequados.

Até agora, todos os nossos testes para o frontend foram testes de unidade que validaram o funcionamento correto de componentes individuais. Às vezes, o teste de unidade é útil, mas mesmo um conjunto abrangente de testes de unidade não é suficiente para validar que o aplicação funciona como um todo.

Também poderíamos fazer testes de integração para o front-end. Testes de integração testa a colaboração de vários componentes. É consideravelmente mais difícil do que os testes de unidade, pois teríamos que, por exemplo, por exemplo mockar dados do servidor.
Optamos por nos concentrar em fazer testes de ponta a ponta para testar todo a aplicação. Trabalharemos nos testes de ponta a ponta no último capítulo desta parte.

### Teste de Snapshot 

O JEST oferece uma alternativa completamente diferente aos chamados testes "tradicionais" [snapshot](https://jestjs.io/pt-BR/docs/snapshot-testing). A característica interessante dos snapshots é que os desenvolvedores não precisam definir nenhum teste, é simples o suficiente para adotar testes snapshot.

O princípio fundamental é comparar o código HTML definido pelo componente depois de alterar para o código HTML que existia antes de ser alterado.

Se o snapshot perceber alguma alteração no HTML definido pelo componente, será uma nova funcionalidade ou um "bug" causado por acidente. Os testes de snapshot notificam o desenvolvedor se o código HTML do componente mudar. O desenvolvedor deve dizer a JEST se a alteração foi desejada ou indesejada. Se a alteração no código HTML for inesperada, ela implicará fortemente um bug, e o desenvolvedor poderá tomar conhecimento desses problemas em potencial, graças facilmente aos testes de snapshot.

</div>
