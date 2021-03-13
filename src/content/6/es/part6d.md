---
mainImage: ../../../images/part-5.svg
part: 6
letter: d
lang: es
---

<div class="content">

Hasta ahora hemos utilizado nuestro redux-store con la ayuda de la api de [hooks](https://react-redux.js.org/api/hooks) de react-redux. Prácticamente esto ha significado utilizar las funciones [useSelector](https://react-redux.js.org/api/hooks#useselector) y [useDispatch](https://react-redux.js.org/api/hooks#usedispatch).

Para terminar esta parte, veremos otra forma más antigua y complicada de usar redux, la función [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) proporcionada por react-redux.

En aplicaciones nuevas, debe usar la api hook, pero saber cómo usar connect es útil cuando se mantienen proyectos antiguos usando redux.


### Uso de la función connect para compartir el store redux con los componentes

Modifiquemos el componente <i>Notes</i> para que en lugar de usar la api hook (las funciones _useDispatch_ y  _useSelector_) use la función _connect_. Tenemos que modificar las siguientes partes del componente:

````js
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // highlight-start
  const dispatch = useDispatch() 
  const notes = useSelector(({filter, notes}) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter  === 'IMPORTANT' 
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })
  // highlight-end

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}

export default Notes
````

La función _connect_ se puede utilizar para transformar componentes React "normales" de modo que el estado del store Redux pueda "mapearse" en los props del componente.

Primero usemos la función de conexión para transformar nuestro componente <i>Notes</i>  en un <i>componente conectado</i>:

```js
import React from 'react'
import { connect } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // ...
}

const ConnectedNotes = connect()(Notes) // highlight-line
export default ConnectedNotes           // highlight-line
```

El módulo exporta el <i>componente conectado</i> que funciona exactamente como el componente regular anterior por ahora.

El componente necesita la lista de notas y el valor del filtro del store Redux. La función _connect_ acepta una función denominada [mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object) como su primer parámetro. La función se puede utilizar para definir los props del <i>componente conectado</i> que se basan en el estado del store Redux.

Si definimos:

```js
const Notes = (props) => { // highlight-line
  const dispatch = useDispatch()

// highlight-start
  const notesToShow = () => {
    if ( props.filter === 'ALL ') {
      return props.notes
    }
    
    return props.filter  === 'IMPORTANT' 
      ? props.notes.filter(note => note.important)
      : props.notes.filter(note => !note.important)
  }
  // highlight-end

  return(
    <ul>
      {notesToShow().map(note => // highlight-line
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes) // highlight-line

export default ConnectedNotes
```


El componente <i>Notes</i> puede acceder al estado del store directamente, por ejemplo, a través de <i>props.notes</i> que contiene la lista de notas. Del mismo modo, <i>props.filter</i> hace referencia al valor del filtro.

La situación que resulta de usar <i>connect</i> con la función <i>mapStateToProps</i> que definimos se puede visualizar así:

![](../../images/6/24c.png)


El componente <i>Notes</i> tiene "acceso directo" a través de <i>props.notes</i> y <i>props.filter</i> para inspeccionar el estado del store Redux.

El componente _NoteList_ en realidad no necesita la información sobre qué filtro está seleccionado, por lo que podemos mover la lógica de filtrado a otra parte. Solo tenemos que darle notas correctamente filtradas en el prop de _notes_:

```js
const Notes = (props) => { // highlight-line
  const dispatch = useDispatch()

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

// highlight-start
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
    )
  }
}
// highlight-end

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes  
 ```

### mapDispatchToProps

Ahora nos hemos deshecho de _useSelector_, pero <i>Notes</i> todavía usa el hook _useDispatch_ y la función _dispatch_ que lo retorna:

```js
const Notes = (props) => {
  const dispatch = useDispatch() // highlight-line

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}
```

El segundo parámetro de la función _connect_ se puede utilizar para definir [mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object), que es un grupo de funciones creadoras de acciones que se pasan al componente conectado como props. Hagamos los siguientes cambios en nuestra operación de conexión existente:

```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

// highlight-start
const mapDispatchToProps = {
  toggleImportanceOf,
}
// highlight-end

const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps // highlight-line
)(Notes)

export default ConnectedNotes
```

Ahora el componente puede enviar directamente la acción definida por el creador de la acción t_toggleImportanceOf_ invocando a la función a través de sus props:

```js
const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}
```

Esto significa que en lugar de enviar la acción de esta manera:


```js
dispatch(toggleImportanceOf(note.id))
```

Cuando usamos _connect_ podemos simplemente hacer esto:

```js
props.toggleImportanceOf(note.id)
```

No es necesario llamar a la función _dispatch_ por separado, ya que _connect_ ya ha modificado el creador de la acción _toggleImportanceOf_ en un formulario que contiene el envío.

Puede tomar algo de tiempo entender cómo funciona _mapDispatchToProps_, especialmente una vez que echemos un vistazo a una [forma alternativa de usarlo](/es/part6/connect#alternative-way-of-using-map-dispatch-to-props).

La situación resultante del uso de _connect_ se puede visualizar así:

![](../../images/6/25b.png)

Además de acceder al estado del store a través de <i>props.notes</i> y <i>props.filter</i>, el componente también hace referencia a una función que se puede usar para enviar acciones de tipo <i>TOGGLE\_IMPORTANCE</i> a través de su prop <i>toggleImportanceOf</i>.

El código para el componente <i>Notes</i> recientemente refactorizado se ve así:

```js
import React from 'react'
import { connect } from 'react-redux' 
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

Usemos también _connect_ para crear nuevas notas:

```js
import React from 'react'
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => { // highlight-line
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

// highlight-start
export default connect(
  null, 
  { createNote }
)(NewNote)
// highlight-end
```

Dado que el componente no necesita acceder al estado del store, simplemente podemos pasar <i>null</i> como el primer parámetro de _connect_.


Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama part6-5 de [este repositorio de Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5).


### Hacer referencia a los creadores de acciones pasados ​​como props

Dirijamos nuestra atención a un detalle interesante en el componente <i>NewNote</i>:

```js
import React from 'react'
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'  // highlight-line

const NewNote = (props) => {
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)  // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null, 
  { createNote }  // highlight-line
)(NewNote)
```

Los desarrolladores que son nuevos a _connect_ pueden encontrar desconcertante que haya dos versiones del creador de acciones <i>createNote</i> en el componente.


La función debe ser referenciada como <i>props.createNote</i> a través de los props del componente, ya que esta es la versión que <i>contiene el envío automático</i> agregado por _connect_.


Debido a la forma en que se importa el creador de acciones:

```js
import { createNote } from './../reducers/noteReducer'
```

También se puede hacer referencia al creador de la acción directamente invocando a _createNote_. No debe hacer esto, ya que esta es la versión no modificada del creador de acciones que no contiene el envío automático agregado.

Si imprimimos las funciones en la consola desde el código (todavía no hemos visto este útil truco de debugging):

```js
const NewNote = (props) => {
  console.log(createNote)
  console.log(props.createNote)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  // ...
}
```

Podemos ver la diferencia entre las dos funciones:

![](../../images/6/10.png)

La primera función es un <i>creador de acciones</i> normal, mientras que la segunda función contiene el envío adicional al store que se agregó mediante connect.

Connect es una herramienta increíblemente útil, aunque puede parecer difícil al principio debido a su nivel de abstracción.

### Manera alternativa de usar mapDispatchToProps

Definimos la función para enviar acciones desde el componente <i>NewNote</i>conectado de la siguiente manera:

```js
const NewNote = () => {
  // ...
}

export default connect(
  null,
  { createNote }
)(NewNote)
```


La expresión de conexión anterior permite que el componente distribuya acciones para crear nuevas notas con el comando <code>props.createNote('a new note')</code>.


Las funciones pasadas en <i>mapDispatchToProps</i> deben ser <i>creadoras de acciones</i>, es decir, funciones que devuelven acciones de Redux.


Vale la pena señalar que el parámetro <i>mapDispatchToProps</i> es un <i>objeto JavaScript</i>, como la definición:

```js
{
  createNote
}
```

Es solo una abreviatura para definir el objeto literal:

```js
{
  createNote: createNote
}
```

Que es un objeto que tiene una sola propiedad <i>createNote</i> con la función <i>createNote</i> como su valor.

Alternativamente, podríamos pasar la siguiente definición de <i>función</i> como el segundo parámetro para _connect_:

```js
const NewNote = (props) => {
  // ...
}

// highlight-start
const mapDispatchToProps = dispatch => {
  return {
    createNote: value => {
      dispatch(createNote(value))
    },
  }
}
// highlight-end

export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```


En esta definición alternativa, <i>mapDispatchToProps</i> es una función que _connect_ invocará pasándole la función _dispatch_ como parámetro. El valor de retorno de la función es un objeto que define un grupo de funciones que se pasan al componente conectado como props. Nuestro ejemplo define la función pasada como la prop <i>createNote</i>:

```js
value => {
  dispatch(createNote(value))
}
```

Que simplemente envía la acción creada con el creador de acciones <i>createNote</i>.

El componente luego hace referencia a la función a través de sus props llamando a <i>props.createNote</i>:

```js
const NewNote = (props) => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

El concepto es bastante complejo y describirlo a través del texto es un desafío. En la mayoría de los casos, es suficiente utilizar la forma más simple de <i>mapDispatchToProps</i>. Sin embargo, hay situaciones en las que es necesaria una definición más complicada, como si las <i>acciones despachadas</i> necesitaran hacer referencia a [los props del componente](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).

El creador de Redux Dan Abramov ha creado un maravilloso tutorial llamado [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) que puedes encontrar en Egghead.io. Recomiendo el tutorial a todos. Los últimos cuatro videos discuten el método _connect_, la forma más "complicada" de usarlo.



### Presentacional / Contenedor revisitado

El componente <i>Notes</i> refactorizado se centra casi por completo en la representación de notas y está bastante cerca de ser un [componente presentacional](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). Según la [descripción](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) proporcionada por Dan Abramov, componentes presentacionales:

- Les preocupa cómo se ven las cosas.
- Puede contener componentes tanto presentacionales como contenedores en su interior y, por lo general, tienen algunos estilos y marcas DOM propios.
- A menudo permiten la contención a través de props.children.
- No dependa del resto de la aplicación, como acciones o stores de Redux.
- No especifican cómo se cargan o se modifican los datos.
- Reciben datos y callbacks exclusivamente a través de props.
- Rara vez tienen su propio estado (cuando lo tienen, es el estado de la interfaz de usuario en lugar de los datos).
- Se escriben como componentes funcionales a menos que necesiten estados, hooks de ciclo de vida u optimizaciones de rendimiento.

El _componente conectado_ que se crea con la función _connect_:

```js
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

Se ajusta a la descripción de un componente <i>contenedor</i>. Según la [descripción](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) proporcionada por Dan Abramov, los componentes contenedores:

- Se preocupan por cómo funcionan las cosas.
- Puede contener componentes presentacionales y contenedores en su interior, pero generalmente no tienen ningún marcado DOM propio, excepto algunos divs de envoltura, y nunca tienen estilos.
- Proporcionan los datos y el comportamiento a los componentes presentacionales u otros componentes contenedores.
- Invocan a las acciones de Redux y las proporciona como callbacks a los componentes presentacionales.
- Suelen tener estado, ya que tienden a servir como fuentes de datos.
- Por lo general, se generan utilizando componentes de orden superior, como connect de React Redux, en lugar de escribirlos a mano.

Dividir la aplicación en componentes presentacionales y contenedores es una forma de estructurar las aplicaciones de React que se ha considerado beneficiosa. La división puede ser una buena elección de diseño o no, depende del contexto.

Abramov atribuye los siguientes [beneficios](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) a la división:

- Mejor separación de preocupaciones. Uno comprende mejor su aplicación y su interfaz de usuario escribiendo componentes de esta manera.
- Mejor reutilización. Puede usar el mismo componente presentacional con fuentes de estado completamente diferentes y convertirlas en componentes contenedores separados que se pueden seguir reutilizando.
- Los componentes presentacionales son esencialmente la "paleta" de su aplicación. Puede ponerlos en una sola página y dejar que el diseñador modifique todas sus variaciones sin tocar la lógica de la aplicación. Puede ejecutar pruebas de regresión de captura de pantalla en esa página.


Abramov menciona el término [componente de orden superior](https://reactjs.org/docs/higher-order-components.html). El componente <i>Notes</i> es un ejemplo de un componente regular, mientras que el método <i>connect</i> proporcionado por React-Redux es un ejemplo de un <i>componente de orden superior</i>. Esencialmente, un componente de orden superior es una función que acepta un componente "regular" como parámetro, que luego devuelve un nuevo componente "regular" como valor de retorno.

Los componentes de orden superior, o HOC, son una forma de definir la funcionalidad genérica que se puede aplicar a los componentes. Este es un concepto de programación funcional que se parece muy ligeramente a la herencia en la programación orientada a objetos.

Los HOC son de hecho una generalización del concepto de [función de orden superior](https://en.wikipedia.org/wiki/Higher-order_function) (HOF). Los HOF son funciones que aceptan funciones como parámetros o devuelven funciones. De hecho, hemos estado utilizando HOF a lo largo del curso, por ejemplo, todos los métodos utilizados para tratar con arrays como _map, filter y find_ son HOF.

Después de la publicación de React hook-api, los HOC se han vuelto cada vez menos populares. Casi todas las bibliotecas que solían estar basadas en HOC ahora se han modificado para utilizar hooks. La mayoría de las veces, las apis basadas en hooks son mucho más simples que las basadas en HOC, como también es el caso de redux.


### Redux y el estado del componente

Hemos recorrido un largo camino en este curso y, finalmente, hemos llegado al punto en el que estamos usando React "de la manera correcta", lo que significa que React solo se enfoca en generar las vistas, y el estado de la aplicación está completamente separado de los componentes de React y pasó a Redux, con sus acciones y sus reducers.

¿Qué pasa con el hook _useState_, que proporciona componentes con su propio estado? ¿Tiene alguna función si una aplicación utiliza Redux o alguna otra solución de gestión de estado externa? Si la aplicación tiene formularios más complicados, puede ser beneficioso implementar su estado local utilizando el estado proporcionado por la función _useState_. Por supuesto, se puede hacer que Redux administre el estado de los formularios, sin embargo, si el estado del formulario solo es relevante al completar el formulario (por ejemplo, para la validación), puede ser conveniente dejar la administración del estado al componente responsable del formulario.

¿Deberíamos usar siempre redux? Probablemente no. Dan Abramov, el desarrollador de redux, analiza esto en su artículo [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).

Hoy en día es posible implementar una administración de estado similar a redux sin redux usando la api de [context](https://reactjs.org/docs/context.html) de React y el hook [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer). Más sobre esto [aquí](https://www.simplethread.com/cant-replace-redux-with-hooks/) y [aquí](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). También practicaremos esto en la [parte 9](/es/part9).

</div>

<div class="tasks">

### Ejercicios 6.19.-6.21.

#### 6.19 anécdotas y connect, paso 1

Los componentes acceden actualmente al <i>store de Redux</i> a través de los hooks <em>useSelector</em> y <em>useDispatch</em>.

Modifique el componente <i>AnecdoteList</i> para que utilice la función _connect_ en lugar de los hooks. Es posible que deba implementar sus propias funciones <i>mapStateToProps</i> y <i>mapDispatchToProps</i>.

#### 6.20 anécdotas y connect, paso 2

Haga lo mismo con los componentes <i>Filter</i> y <i>AnecdoteForm</i>.

#### 6.21 anécdotas, el gran final

(Probablemente) tenga un error desagradable en su aplicación. Si el usuario hace clic en el botón de voto varias veces seguidas, la notificación se muestra de forma rara. Por ejemplo, si un usuario vota dos veces en tres segundos, la última notificación solo se muestra durante dos segundos (asumiendo que la notificación normalmente se muestra durante 5 segundos). Esto sucede porque la eliminación de la primera notificación elimina accidentalmente la segunda notificación.

Solucione el error para que después de varios votos seguidos, la notificación del último voto se muestre durante cinco segundos. Esto se puede hacer cancelando la eliminación de la notificación anterior cuando se muestra una nueva notificación cuando sea necesario. La [documentación](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) de la función setTimeout también puede ser útil para esto.

Este fue el último ejercicio de esta parte del curso y es hora de enviar su código a GitHub y marcar todos los ejercicios completados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
