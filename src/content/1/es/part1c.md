--- 
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: es
--- 

<div class="content"> 

Volvamos a trabajar con React.

Comenzamos con un nuevo ejemplo:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### Funciones auxiliares del componente 

Vamos a expandir nuestro componente <i>Hello</i> para que adivine el año de nacimiento de la persona que recibe la bienvenida:

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

La lógica para adivinar el año de nacimiento se divide en su propia función que se llama cuando se representa el componente. 

La edad de la persona no tiene que pasarse como parámetro a la función, ya que puede acceder directamente a todos los props que se pasan al componente.

Si examinamos nuestro código actual de cerca, notaremos que la función auxiliar está realmente definida dentro de otra función que define el comportamiento de nuestro componente. En la programación Java, definir una función dentro de otra es complejo y engorroso, por lo que no es tan común. En JavaScript, sin embargo, definir funciones dentro de funciones es una técnica de uso común.

### Desestructuración

Antes de seguir adelante, veremos una característica pequeña pero útil del lenguaje JavaScript que se agregó en la especificación ES6, que nos permite [desestructurar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) valores de objetos y matrices en la asignación.

En nuestro código anterior, teníamos que hacer referencia a los datos pasados ​​a nuestro componente como _props.name_ y _props.age_. De estas dos expresiones, tuvimos que repetir _props.age_ dos veces en nuestro código.

Dado que <i>props</i> es un objeto

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

podemos optimizar nuestro componente asignando los valores de las propiedades directamente en dos variables _name_ y _age_ que luego podemos usar en nuestro código: 

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Tenga en cuenta que también hemos utilizado la sintaxis más compacta para las funciones de flecha al definir la función _bornYear_. Como se mencionó anteriormente, si una función de flecha consta de una sola expresión, entonces no es necesario escribir el cuerpo de la función entre llaves. En esta forma más compacta, la función simplemente devuelve el resultado de la expresión única.

En resumen, las dos definiciones de función que se muestran a continuación son equivalentes: 
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

La desestructuración facilita aún más la asignación de variables, ya que podemos usarla para extraer y reunir los valores de las propiedades de un objeto en variables separadas:

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Si el objeto que estamos desestructurando tiene los valores

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

la expresión <em>const {name, age} = props</em> asigna los valores 'Arto Hellas'a _name_ y 35 a _age_.

Podemos llevar la desestructuración un paso más allá:

```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Los props que se pasan al componente ahora se desestructuran directamente en las variables _name_ y _age_. 

Esto significa que en lugar de asignar todo el objeto props a una variable llamada <i>props</i> y luego asignar sus propiedades a las variables _name_ y _age_ 

```js
const Hello = (props) => {
  const { name, age } = props
```

asignamos los valores de las propiedades directamente a las variables al desestructurar el objeto props que se pasa a la función del componente como parámetro: 

```js
const Hello = ({ name, age }) => {
```

### Re-renderizado de la página

Hasta ahora, todas nuestras aplicaciones han sido tales que su apariencia sigue siendo la misma después de la renderización inicial. ¿Qué pasaría si quisiéramos crear un contador donde el valor aumentara en función del tiempo o con el clic de un botón? 

Comencemos con lo siguiente: 

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

let counter = 1

ReactDOM.render(
  <App counter={counter} />, 
  document.getElementById('root')
)
```

El componente de la aplicación recibe el valor del contador a través del prop _counter_. Este componente muestra el valor en la pantalla. ¿Qué sucede cuando cambia el valor de _counter_? Incluso si tuviéramos que agregar lo siguiente

```js
counter += 1
```

el componente no volverá a renderizarse. Podemos hacer que el componente se vuelva a renderizar llamando al método _ReactDOM.render_ por segunda vez, por ejemplo, de la siguiente manera: 

```js
const App = (props) => {
  const { counter } = props
  return (
    <div>{counter}</div>
  )
}

let counter = 1

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, 
  document.getElementById('root'))
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

El comando de re-renderizado se ha envuelto dentro de la función _refresh_ para reducir la cantidad de código copiado y pegado. 

Ahora el componente <i>se renderiza tres veces</i>, primero con el valor 1, luego 2 y finalmente 3. Sin embargo, los valores 1 y 2 se muestran en la pantalla durante un período de tiempo tan corto que pueden no ser notados.

Podemos implementar una funcionalidad un poco más interesante volviendo a renderizar e incrementando el contador cada segundo usando [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Hacer llamadas repetidas al método _ReactDOM.render_ no es la forma recomendada de volver a renderizar componentes. A continuación, presentaremos una mejor forma de lograr este efecto.

### Componente con estado

Todos nuestros componentes hasta ahora han sido simples en el sentido de que no contienen ningún estado que pueda cambiar durante el ciclo de vida del componente.

A continuación, agreguemos estado al componente <i>App</i> de nuestra aplicación con la ayuda del [hook de estado](https://reactjs.org/docs/hooks-state.html) de React.
Cambiaremos la aplicación a lo siguiente:

```js
import React, { useState } from 'react' // highlight-line
import ReactDOM from 'react-dom'

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)
```

En la primera fila, la aplicación importa la función _useState_:

```js
import React, { useState } from 'react'
```

El cuerpo de la función que define el componente comienza con la llamada a la función:

```js
const [ counter, setCounter ] = useState(0)
```

La llamada a la función agrega <i>state</i> al componente y lo hace inicializado con el valor de cero. La función devuelve una matriz que contiene dos elementos. Asignamos los elementos a las variables _counter_ y _setCounter_ usando la sintaxis de asignación de desestructuración mostrada anteriormente.

A la variable _counter_ se le asigna el valor inicial de <i>state</i> que es cero. La variable _setCounter_ se asigna a una función que se utilizará para <i>modificar el estado</i>.

La aplicación llama a la función [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) y le pasa dos parámetros: una función para incrementar el estado del contador y un tiempo de espera de un segundo:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

La función pasada como primer parámetro a la función _setTimeout_ se invoca un segundo después de llamar a la función _setTimeout_

```js
() => setCounter(counter + 1)
```

Cuando se llama a la función de modificación de estado _setCounter_, <i>React vuelve a renderizar el componente</i>, lo que significa que el cuerpo de la función del componente se vuelve a ejecutar:

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

La segunda vez que la función del componente es ejecutado, llama a la función _useState_ y devuelve el nuevo valor del estado: 1. Al ejecutar el cuerpo de la función nuevamente, también se realiza una nueva llamada de función a _setTimeout_, que ejecuta el tiempo de espera de un segundo e incrementa el estado _counter_ nuevamente. Debido a que el valor de la variable _counter_ es 1, incrementar el valor en 1 es esencialmente lo mismo que una expresión que establece el valor de _counter_ en 2.

```js
() => setCounter(2)
```
Mientras tanto, el antiguo valor de _counter_ - "1" - se muestra en la pantalla.

Cada vez que _setCounter_ modifica el estado, hace que el componente se vuelva a renderizar. El valor del estado se incrementará nuevamente después de un segundo y esto continuará repitiéndose mientras la aplicación esté en ejecución. 

Si el componente no se procesa cuando usted cree que debería, o si se procesa en el "momento incorrecto", puede depurar la aplicación registrando los valores de las variables del componente en la consola. Si hacemos las siguientes adiciones a nuestro código: 

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

Es fácil de seguir y rastrear las llamadas realizadas a la <i>App</i> función de renderizado del componente:

![](../../images/1/4e.png)

### Manejo de eventos 

Ya hemos mencionado <i>controladores de eventos</i> algunas veces en la [parte 0](/es/part0), que están registrados para ser llamados cuando ocurren eventos específicos. Por ejemplo, la interacción de un usuario con los diferentes elementos de una página web puede provocar que se active una colección de diferentes tipos de eventos.

Cambiemos la aplicación para que aumente el contador cuando un usuario haga clic en un botón, que se implementa con el elemento [botón](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).

Los elementos de botón admiten los llamados [eventos de mouse](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), de los cuales [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) es el evento más común.

En React, registrar una función de controlador de eventos en el evento <i>click</i> [ocurre](https://reactjs.org/docs/handling-events.html) así:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

Establecemos el valor del atributo <i>onClick</i> del botón para que sea una referencia a la función _handleClick_ definida en el código.

Ahora, cada clic del botón <i>plus</i> hace que se llame a la función _handleClick_, lo que significa que cada evento de clic registrará un mensaje de <i>clicked</i> en la consola del navegador.

La función del controlador de eventos también se puede definir directamente en la asignación de valor del atributo onClick:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

Al cambiar el controlador de eventos a la siguiente forma
```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

logramos el comportamiento deseado, lo que significa que el valor de _counter_ aumenta en uno <i>y</i> el componente se vuelve a renderizar.

Agreguemos también un botón para restablecer el contador:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

Nuestra aplicación ya está lista!

### El controlador de eventos es una función

Definimos los controladores de eventos para nuestros botones donde declaramos sus atributos <i>onClick</i>:

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

¿Qué pasaría si intentáramos definir los controladores de eventos de una forma más simple? 

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

Esto rompería completamente nuestra aplicación:

![](../../images/1/5b.png)
 
¿Qué está pasando? Se supone que un controlador de eventos es una <i>función</i> o una <i>referencia de función</i>, y cuando escribimos

```js
<button onClick={setCounter(counter + 1)}>
```

el controlador de eventos es en realidad una <i>llamada a función</i>. En muchas situaciones esto está bien, pero no en esta situación particular. Al principio, el valor de la variable <i>counter</i> es 0. Cuando React renderiza el componente por primera vez, ejecuta la llamada de función <em>setCounter(0 + 1)</em> y cambia el valor del estado del componente en 1. 
Esto hará que el componente se vuelva a renderizar, react ejecutará la llamada a la función setCounter nuevamente, y el estado cambiará dando lugar a otra repetición...

Definamos los controladores de eventos como lo hicimos antes

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Ahora el atributo del botón que define lo que sucede cuando se hace clic en el botón - <i>onClick</i> - tiene el valor _() => setCounter (counter + 1)_. 
La función setCounter se llama solo cuando un usuario hace clic en el botón. 

Por lo general, definir controladores de eventos dentro de las plantillas JSX no es una buena idea.
Aquí está bien, porque nuestros controladores de eventos son muy simples.

Vamos a separar a los controladores de eventos en funciones separadas de todas formas: 

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```
Aquí los controladores de eventos se han definido correctamente. El valor del atributo <i>onClick</i> es una variable que contiene una referencia a una función:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Pasando el estado a componentes hijos

Se recomienda escribir componentes de React que sean pequeños y reutilizables en toda la aplicación e incluso en proyectos. Refactoricemos nuestra aplicación para que esté compuesta por tres componentes más pequeños, un componente para mostrar el contador y dos componentes para los botones.

Primero implementemos un componente <i>Display</i> que es responsable de mostrar el valor del contador. 

Una de las mejores prácticas en React es [levantar el estado](https://reactjs.org/docs/lifting-state-up.html) en la jerarquía de componentes. La documentación dice:

> <i>A menudo, varios componentes deben reflejar los mismos datos cambiantes. Recomendamos elevar el estado compartido a su ancestro común más cercano.</i> 

Así que coloquemos el estado de la aplicación en el componente <i>App</i> y pasémoslo al componente <i>Display</i> a través de <i>props</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Usar el componente es sencillo, ya que solo necesitamos pasarle el estado del _counter_: 

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

Todo sigue funcionando. Cuando se hace clic en los botones y la <i>App</i> se vuelve a renderizar, todos sus elementos secundarios, incluido el componente <i>Display</i>, también se vuelven a renderizar.

A continuación, creemos un componente <i>Button</i> para los botones de nuestra aplicación. Tenemos que pasar el controlador de eventos, así como el título del botón a través de los props del componente:

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

Nuestro componente <i>App</i> ahora se ve así:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />     
      <Button
        handleClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Dado que ahora tenemos un componente <i>Button</i> fácilmente reutilizable, también hemos implementado una nueva funcionalidad en nuestra aplicación agregando un botón que se puede usar para disminuir el contador.

El controlador de eventos se pasa al componente <i>Button</i> a través de la propiedad _handleClick_. El nombre del prop en sí no es tan significativo, pero nuestra elección de nombre no fue completamente aleatoria. El propio [tutorial](https://reactjs.org/tutorial/tutorial.html) oficial de React sugiere esta convención.

### Los cambios en el estado provocan re-renderizado

Repasemos los principios fundamentales de cómo funciona una aplicación una vez más.

Cuando se inicia la aplicación, se ejecuta el código en _App_. Este código usa un hook [useState](https://reactjs.org/docs/hooks-reference.html#usestate) para crear el estado de la aplicación, estableciendo un valor inicial de la variable _counter_.
Este componente contiene el componente _Display_, que muestra el valor del contador, 0, y tres componentes _Button_. Todos los botones tienen controladores de eventos, que se utilizan para cambiar el estado del contador.

Cuando se hace clic en uno de los botones, se ejecuta el controlador de eventos. El controlador de eventos cambia el estado del componente _App_ con la función _setCounter_. 
**Llamar a una función que cambia el estado hace que el componente se vuelva a procesar.**

Entonces, si un usuario hace clic en el botón <i>plus</i>, el controlador de eventos del botón cambia el valor de _counter_ a 1, y el componente _App_ se vuelve a generar.
Esto hace que sus subcomponentes _Display_ y _Button_ también se vuelvan arenderizar.
_Display_ recibe el nuevo valor del contador, 1, como prop. Los componentes _Button_ reciben controladores de eventos que pueden usarse para cambiar el estado del contador.

### Refactorización de los componentes 

El componente que muestra el valor del contador es el siguiente: 

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

El componente solo usa el campo _counter_ de sus <i>props</i>.
Esto significa que podemos simplificar el componente usando [desestructuración](/es/part1/estado_del_componente_controladores_de_eventos#desestructuracion), así:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

La función que define el componente contiene solo la declaración return, por lo que podemos definir la forma más compacta de funciones de flecha:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

También podemos simplificar el componente Button.

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

Podemos usar la desestructuración para obtener solo los campos requeridos de <i>props</i>, y usar la forma más compacta de funciones de flecha:

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```
</div>
