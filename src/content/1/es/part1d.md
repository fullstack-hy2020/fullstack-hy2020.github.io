---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: es
---

<div class="content">

### Estado complejo 

En nuestro ejemplo anterior el estado de la aplicación era simple ya que estaba compuesto por un solo entero. ¿Y si nuestra aplicación requiere un estado más complejo?

En la mayoría de los casos, la manera más fácil y mejor de lograr esto es usando la función _useState_ varias veces para crear "partes" de estado separadas.

En el siguiente código creamos dos partes de estado para la aplicación llamada _left_ y _right_ que obtienen el valor inicial de 0:

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

El componente obtiene acceso a las funciones _setLeft_ y _setRight_ que puede usar para actualizar las dos partes del estado.

El estado del componente o una parte de su estado puede ser de cualquier tipo. Podríamos implementar la misma funcionalidad guardando el recuento de clics de los botones <i>left</i> y <i>right</i> en un solo objeto:
```js
{
  left: 0,
  right: 0
}
```

En este caso, la aplicación se vería así: 

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

Ahora el componente solo tiene una parte de estado y los controladores de eventos deben encargarse de cambiar el <i>estado completo de la aplicación</i>.

El controlador de eventos se ve un poco desordenado. Cuando se hace clic en el botón izquierdo, se llama a la siguiente función:
```js
const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

El siguiente objeto se establece como el nuevo estado de la aplicación:

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

El nuevo valor de la propiedad <i>left</i> ahora es el mismo que el valor de <i>left + 1</i> del estado anterior, y el valor de la propiedad <i>right</i> es el mismo que el valor de la propiedad <i>right</i> del estado anterior.

Podemos definir el nuevo objeto de estado un poco más claramente utilizando la sintaxis de [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) que se agregó a la especificación del lenguaje en el verano boreal de 2018:

```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

La sintaxis puede parecer un poco extraña al principio. En la práctica, <em>{...clicks}</em> crea un nuevo objeto que tiene copias de todas las propiedades del objeto _clicks_. Cuando especificamos una propiedad en particular, por ejemplo, <i>right</i> en <em>{...clics, right: 1}</em>, el valor de la propiedad _right_ en el nuevo objeto será 1.

En el ejemplo anterior, esto:

```js
{ ...clicks, right: clicks.right + 1 }
```

crea una copia del objeto _clicks_ donde el valor de la propiedad _right_ aumenta en uno.

No es necesario asignar el objeto a una variable en los controladores de eventos y podemos simplificar las funciones a la siguiente forma:

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

Algunos lectores podrían preguntarse por qué no actualizamos el estado directamente, así:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

La aplicación parece funcionar. Sin embargo, <i>está prohibido en React mutar el state directamente</i>, ya que puede provocar efectos secundarios inesperados. El cambio de estado siempre debe realizarse estableciendo el estado en un nuevo objeto. Si las propiedades del objeto de estado anterior no se modifican, simplemente deben copiarse, lo que se hace copiando esas propiedades en un nuevo objeto y estableciendo eso como el nuevo estado.

Almacenar todo el estado en un solo objeto de estado es una mala elección para esta aplicación en particular; no hay ningún beneficio aparente y la aplicación resultante es mucho más compleja. En este caso, almacenar los contadores de clics en estados separados es una opción mucho más adecuada.

Hay situaciones en las que puede resultar beneficioso almacenar una parte del estado de la aplicación en una estructura de datos más compleja. [La documentación oficial de React](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contiene una guía útil sobre el tema.

### Manejo de matrices

Agreguemos un fragmento de estado a nuestra aplicación que contenga un array _allClicks_ que recuerda cada clic que ha ocurrido en la aplicación.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end  

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end  

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Cada clic se almacena en una pieza de estado separada llamada _allClicks_ que se inicializa como una matriz vacía:

```js
const [allClicks, setAll] = useState([])
```

Cuando se hace clic en el botón <i>left</i>, agregamos la letra <i>L</i> a la matriz _allClicks_:

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

La parte del estado almacenada en _allClicks_ ahora está configurada para ser un array que contiene todos los elementos del array de estado anterior más la letra <i>L</i>. La adición del nuevo elemento al array se logra con el método [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), que no muta el array existente, sino que devuelve una <i>nueva copia del array</i> con el elemento agregado.

Como se mencionó anteriormente, también es posible en JavaScript agregar elementos a un array con el método [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Si agregamos el elemento empujándolo al array _allClicks_ y luego actualizando el estado, la aplicación aún parecería funcionar:

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

Sin embargo, __no__ haga esto. Como se mencionó anteriormente, el estado de los componentes de React como _allClicks_ no debe modificarse directamente. Incluso si el estado mutante parece funcionar en algunos casos, puede provocar problemas que son muy difíciles de depurar.

Echemos un vistazo más de cerca a cómo se muestra el historial de clics en la página:

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Llamamos al método [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) en el array _allClicks_ que une todos los elementos en una sola cadena, separados por la cadena pasada como parámetro de función,que en nuestro caso es un espacio vacío.

### Renderizado condicional

Modifiquemos nuestra aplicación para que el renderizado del historial de clics sea manejada por un nuevo componente <i>History</i>:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

Ahora el comportamiento del componente depende de si se ha hecho clic en cualquier botón. Si no es así, lo que significa que el array <em>allClicks</em> está vacío, el componente muestra un elemento div con algunas instrucciones en su lugar:

```js
<div>the app is used by pressing the buttons</div>
```

Y en todos los demás casos, el componente muestra el historial de clics:

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

El componente <i>History</i> representa elementos React completamente diferentes según el estado de la aplicación. Esto se llama <i>renderizado condicional</i>.

React también ofrece muchas otras formas de hacer [renderizado condicional](https://reactjs.org/docs/conditional-rendering.html). Veremos esto más de cerca en la [parte 2](/es/part2).

Hagamos una última modificación a nuestra aplicación refactorizándola para usar el componente _Button_ que definimos anteriormente:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// highlight-start
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
// highlight-end

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### Antiguo React

En este curso usamos el [state hook](https://reactjs.org/docs/hooks-state.html) para agregar estado a nuestros componentes de React, que es parte de las versiones más nuevas de React y está disponible en la versión [ 16.8.0](https://www.npmjs.com/package/react/v/16.8.0) en adelante. Antes de la adición de hooks, no había forma de agregar estado a los componentes funcionales. Los componentes que requerían el estado tenían que definirse como componentes de [clase](https://reactjs.org/docs/react-component.html), utilizando la sintaxis de clase de JavaScript.

En este curso hemos tomado la decisión un poco radical de utilizar hooks exclusivamente desde el primer día, para asegurarnos de que estamos aprendiendo el estilo futuro de React. Aunque los componentes funcionales son el futuro de React, sigue siendo importante aprender la sintaxis de clase, ya que hay miles de millones de líneas de código antiguo de React que podrías terminar manteniendo algún día. Lo mismo se aplica a la documentación y los ejemplos de React con los que puede tropezar en Internet.

Aprenderemos más sobre los componentes de clase de React más adelante en el curso.

### Depuración de aplicaciones React

Una gran parte del tiempo de un desarrollador típico se dedica a depurar y leer el código existente. De vez en cuando podemos escribir una línea o dos de código nuevo, pero una gran parte de nuestro tiempo se dedica a tratar de averiguar por qué algo está roto o cómo funciona algo. Las buenas prácticas y herramientas para depurar son extremadamente importantes por este motivo.

Por suerte para nosotros, React es una librería extremadamente amigable para los desarrolladores cuando se trata de depurar.

Antes de continuar, recordemos una de las reglas más importantes del desarrollo web.

<h4>La primera regla de desarrollo web</ h4>

> **Mantenga la consola de desarrollador del navegador abierta en todo momento.**
>
> La <i>Consola</i>, en particular, debería estar siempre abierta, a menos que haya una razón específica para ver otra pestaña.

Mantén tu código y la página web abiertos juntos **al mismo tiempo, todo el tiempo**.

Si su código falla al compilarse y su navegador se ilumina como un árbol de Navidad:

![](../../images/1/6e.png)

no escriba más código, sino busque y solucione el problema **inmediatamente**. Aún no ha habido un momento en la historia de la codificación en el que el código que no se compila comience a funcionar milagrosamente después de escribir grandes cantidades de código adicional. Dudo mucho que tal evento ocurra durante este curso tampoco.

La depuración de la vieja escuela basada en impresión siempre es una buena idea. Si el componente

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

no funciona como se esperaba, es útil comenzar a imprimir sus variables en la consola. Para hacer esto de manera efectiva, debemos transformar nuestra función en la forma menos compacta y recibir el objeto props completo sin desestructurarlo inmediatamente:

```js
const Button = (props) => { 
  console.log(props) // highlight-line
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
```

Esto revelará inmediatamente si, por ejemplo, uno de los atributos se ha escrito mal al usar el componente.

**NB** Cuando use _console.log_ para depurar, no combine _objects_ como en Java utilizando el operador más. En lugar de escribir:

```js
console.log('props value is ' + props)
```

Separe las cosas que desea imprimir en la consola con una coma:

```js
console.log('props value is', props)
```

Si usa la forma similar a Java de concatenar una cadena con un objeto, terminará con un mensaje de registro bastante poco informativo: 

```js
props value is [Object object]
```

Mientras que los elementos separados por una coma estarán disponibles en la consola del navegador para una inspección más detallada.

Imprimir en la consola no es de ninguna manera la única forma de depurar nuestras aplicaciones. Puede pausar la ejecución del código de su aplicación en el <i>depurador</i> de la consola de desarrollador de Chrome, escribiendo el comando [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) en cualquier parte de su código.

La ejecución se detendrá una vez que llegue a un punto donde se ejecuta el comando _debugger_:

![](../../images/1/7a.png)

Al ir a la pestaña <i>Console</i>, Es fácil inspeccionar el estado actual de las variables:

![](../../images/1/8a.png)

Una vez que se descubre la causa del error, puede eliminar el comando _debugger_ y actualizar la página.

El depurador también nos permite ejecutar nuestro código línea por línea con los controles que se encuentran en el lado derecho de la pestaña <i>Source</i>.

También puede acceder al depurador sin el comando _debugger_ agregando puntos de interrupción en la pestaña <i>Source</i>. La inspección de los valores de las variables del componente se puede hacer en la sección _Scope_:

![](../../images/1/9a.png)

Se recomienda encarecidamente agregar las [herramientas de desarrollo de React](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) para Chrome. Agrega una nueva pestaña _Components_ a las herramientas de desarrollo. La nueva pestaña de herramientas de desarrollador se puede usar para inspeccionar los diferentes elementos de React en la aplicación, junto con su estado y props:

![](../../images/1/10ea.png)

El estado del componente _App_ se define así: 

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

Las herramientas de desarrollo muestran el estado de los hooks en el orden de su definición:

![](../../images/1/11ea.png)

El primer <i>State</i> contiene el valor del estado <i>left</i>, el siguiente contiene el valor del estado <i>right</i> y el último contiene el valor del estado <i>allClicks</i>.

### Reglas de los Hooks

Hay algunas limitaciones y reglas que debemos seguir para asegurarnos de que nuestra aplicación utilice correctamente las funciones de estado basadas en hooks.

La función _useState_ (así como la función _useEffect_ presentada más adelante en el curso) <i>no se debe llamar</i> desde dentro de un ciclo, una expresión condicional o cualquier lugar que no sea una función que defina un componente. Esto debe hacerse para garantizar que los hooks siempre se llamen en el mismo orden o, si este no es el caso, la aplicación se comportará de manera errática.

En resumen, los hooks solo se pueden llamar desde el interior de un cuerpo de función que define un componente de React:

```js
const App = () => {
  // estos estan bien
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // esto no funciona!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // también esto no está bien
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // y esto también es ilegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Manejo de Eventos Revisitado

El manejo de eventos ha demostrado ser un tema difícil en iteraciones anteriores de este curso.

Por esta razón volveremos a tratar el tema.

Supongamos que estamos desarrollando esta sencilla aplicación: 

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)
```

Queremos hacer clic en el botón para restablecer el estado almacenado en la variable _value_.

Para que el botón reaccione a un evento de clic, tenemos que agregarle un <i>controlador de eventos</i>.

Los controladores de eventos siempre deben ser una función o una referencia a una función. El botón no funcionará si el controlador de eventos se establece en una variable de cualquier otro tipo.

Si tuviéramos que definir el controlador de eventos como una cadena:

```js
<button onClick="crap...">button</button>
```

React nos advertiría sobre esto en la consola: 

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

El siguiente intento tampoco funcionaría: 

```js
<button onClick={value + 1}>button</button>
```

Hemos intentado establecer el controlador de eventos en _value + 1_ que simplemente devuelve el resultado de la operación. React nos advertirá amablemente sobre esto en la consola:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

Este intento tampoco funcionaría: 
```js
<button onClick={value = 0}>button</button>
```

El controlador de eventos no es una función sino una asignación de variable, y React volverá a emitir una advertencia para la consola. Este intento también tiene fallas en el sentido de que nunca debemos mutar el estado directamente en React.

¿Qué pasa con lo siguiente:

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

El mensaje se imprime en la consola una vez cuando se procesa el componente, pero no sucede nada cuando hacemos clic en el botón. ¿Por qué esto no funciona incluso cuando nuestro controlador de eventos contiene una función _console.log_?

El problema aquí es que nuestro controlador de eventos está definido como una <i>llamada a función</i>, lo que significa que al controlador de eventos se le asigna realmente el valor devuelto por la función, que en el caso de _console.log_ es <i>indefinido</i>.

La llamada a la función _console.log_ se ejecuta cuando se renderiza el componente y por esta razón se imprime una vez en la consola.

El siguiente intento también tiene fallas: 
```js
<button onClick={setValue(0)}>button</button>
```

Una vez más, hemos intentado establecer una llamada a función como controlador de eventos. Esto no funciona. Este intento en particular también causa otro problema. Cuando se renderiza el componente, se ejecuta la función _setValue(0)_, lo que a su vez hace que el componente se vuelva a renderizar. La renderización a su vez llama a _setValue(0)_ de nuevo, lo que da como resultado una recursividad infinita. 

La ejecución de una llamada de función en particular cuando se hace clic en el botón se puede lograr así:

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

Ahora el controlador de eventos es una función definida con la sintaxis de función de flecha _() => console.log('clicked the button')_. Cuando el componente se renderiza, no se llama a ninguna función y solo la referencia a la función de flecha se establece en el controlador de eventos. La llamada a la función ocurre solo una vez que se hace clic en el botón.

Podemos implementar el restablecimiento del estado en nuestra aplicación con esta misma técnica: 

```js
<button onClick={() => setValue(0)}>button</button>
```

El controlador de eventos ahora es la función _( ) => setValue (0)_.

Definir controladores de eventos directamente en el atributo del botón no es necesariamente la mejor idea posible.

A menudo verá los controladores de eventos definidos en un lugar separado. En la siguiente versión de nuestra aplicación, definimos una función que luego se asigna a la variable _handleClick_ en el cuerpo de la función del componente:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

La variable _handleClick_ ahora está asignado a una referencia a la función. La referencia se pasa al botón como el atributo <i>onClick</i>:

```js
<button onClick={handleClick}>button</button>
```

Naturalmente, nuestra función de controlador de eventos puede estar compuesta por varios comandos. En estos casos, usamos la sintaxis de llaves más largas para las funciones de flecha:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### Función que devuelve una función

Otra forma de definir un controlador de eventos es utilizar una <i>función que devuelve una función</i>.

Probablemente no necesite utilizar funciones que devuelvan funciones en ninguno de los ejercicios de este curso. Si el tema parece particularmente confuso, puede omitir esta sección por ahora y volver a ella más tarde.

Hagamos los siguientes cambios en nuestro código:

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

El código funciona correctamente aunque parece complicado. 

El controlador de eventos ahora está configurado para una llamada de función:

```js
<button onClick={hello()}>button</button>
```

Anteriormente dijimos que un controlador de eventos puede no ser una llamada a una función, y que tiene que ser una función o una referencia a una función. Entonces, ¿por qué funciona una llamada a función en este caso?

Cuando se procesa el componente, se ejecuta la siguiente función:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

El <i>valor de retorno</i> de la función es otra función que se asigna a la variable _handler_.

Cuando React renderiza la línea: 

```js
<button onClick={hello()}>button</button>
```

Asigna el valor de retorno de _hello()_ al atributo onClick. Básicamente, la línea se transforma en:

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

Dado que la función _hello_ devuelve una función, el controlador de eventos ahora es una función.

¿Qué sentido tiene este concepto?

Cambiemos el código un poquito:

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

Ahora la aplicación tiene tres botones con controladores de eventos definidos por la función _hello_ que acepta un parámetro.

El primer botón se define como 

```js
<button onClick={hello('world')}>button</button>
```

El controlador de eventos se crea <i>ejecutando</i> la llamada de función _hello('world')_. La llamada a la función devuelve la función:

```js
() => {
  console.log('hello', 'world')
}
```

El segundo botón se define como: 

```js
<button onClick={hello('react')}>button</button>
```

La llamada de función _hello('react')_ que crea el controlador de eventos devuelve:

```js
() => {
  console.log('hello', 'react')
}
```

Ambos botones tienen sus propios controladores de eventos individualizados.

Las funciones que devuelven funciones se pueden utilizar para definir funciones genéricas que se pueden personalizar con parámetros. La función _hello_ que crea los controladores de eventos se puede considerar como una fábrica que produce controladores de eventos personalizados destinados a saludar a los usuarios.

Nuestra definición actual es un poco detallada: 

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Eliminemos las variables auxiliares y devuelve directamente la función creada: 

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Dado que nuestra función _hello_ se compone de un solo comando de retorno, podemos omitir las llaves y usar la sintaxis más compacta para las funciones de flecha:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Por último, escribamos todas las flechas en la misma línea: 

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

Podemos usar el mismo truco para definir controladores de eventos que establecen el estado del componente en un valor dado. Hagamos los siguientes cambios en nuestro código:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
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

Cuando se renderiza el componente, se crea el botón <i>thousand</i>:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

El controlador de eventos se establece en el valor de retorno de _setToValue(1000)_ que es la siguiente función:

```js
() => {
  setValue(1000)
}
```

El botón de aumento se declara de la siguiente manera:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

El controlador de eventos es creado por la llamada de función _setToValue(value + 1)_ que recibe como parámetro el valor actual de la variable de estado _value_ aumentado en uno. Si el valor de _value_ fuera 10, entonces el controlador de eventos creado sería la función:

```js
() => {
  setValue(11)
}
```

No es necesario utilizar funciones que devuelvan funciones para lograr esta funcionalidad. Regresemos la función _setToValue_ que es responsable de actualizar el estado, a una función normal:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
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

Ahora podemos definir el controlador de eventos como una función que llama a la función _setToValue_ con un parámetro apropiado. El controlador de eventos para restablecer el estado de la aplicación sería:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Elegir entre las dos formas presentadas de definir sus controladores de eventos es sobre todo una cuestión de gustos.

### Pasando controladores de eventos a componentes secundarios

Extraigamos el botón en su propio componente: 

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

El componente obtiene la función de controlador de eventos de la propiedad _handleClick_, y el texto del botón de la propiedad _text_.

Usar el componente <i>Button</i> es simple, aunque debemos asegurarnos de que usamos los nombres de atributos correctos al pasar accesorios al componente.

![](../../images/1/12e.png)

### No definir componentes dentro de los componentes

Empecemos a mostrar el valor de la aplicación en su propio componente <i>Display</i>.

Cambiaremos la aplicación definiendo un nuevo componente dentro del componente <i>App</i>.

```js
// Este es lugar correcto para definir un componente
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    setValue(newValue)
  }

  // No defina componentes adentro de otro componente
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

La aplicación todavía parece funcionar, pero **¡no implemente componentes como este!** Nunca defina componentes dentro de otros componentes. El método no proporciona beneficios y da lugar a muchos problemas desagradables. Los mayores problemas se deben al hecho de que React trata un componente definido dentro de otro componente como un nuevo componente en cada render. Esto hace imposible que React optimice el componente.

En su lugar, movamos la función del componente <i>Display</i> a su lugar correcto, que está fuera de la función del componente <i>App</i>: 

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

### Lectura útil

Internet está lleno de material relacionado con React. Sin embargo, utilizamos un estilo de React tan nuevo que una gran mayoría del material que se encuentra en línea está desactualizado para nuestros propósitos.

Puede encontrar útiles los siguientes enlaces:

- Vale la pena echarle un vistazo a la [documentación oficial](https://reactjs.org/docs/hello-world.html) de React en algún momento, aunque la mayor parte será relevante solo más adelante en el curso. Además, todo lo relacionado con los componentes basados en clases es irrelevante para nosotros;
- Algunos cursos en [Egghead.io](https://egghead.io) como [Start learning React](https://egghead.io/courses/start-learning-react) son de alta calidad y la actualizada recientemente [Guía para principiantes de React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) también es relativamente buena; Ambos cursos introducen conceptos que también se presentarán más adelante en este curso. **NB** El primero usa componentes de clase pero el segundo usa los nuevos funcionales.

</div> 

<div class="tasks">
  <h3> Ejercicios 1.6.-1.14.</h3>

Envíe sus soluciones a los ejercicios enviando primero su código a GitHub y luego marcando los ejercicios completados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Recuerde, envíe **todos** los ejercicios de una parte **en una sola presentación**. Una vez que haya enviado sus soluciones para una parte, **ya no podrá enviar más ejercicios a esa parte**. 

<i>Algunos de los ejercicios funcionan en la misma aplicación. En estos casos, es suficiente enviar solo la versión final de la aplicación. Si lo desea, puede realizar un commit después de cada ejercicio terminado, pero no es obligatorio.</i>

**ADVERTENCIA** create-react-app convertirá automáticamente su proyecto en un repositorio git a menos que cree su aplicación dentro de un repositorio git existente. **Lo más probable es que no desee que cada uno de sus proyectos sea un repositorio separado**, así que simplemente ejecute el comando _rm -rf .git_ en la raíz de su aplicación.

En algunas situaciones, es posible que también deba ejecutar el siguiente comando desde la raíz del proyecto:

``` 
rm -rf node_modules/ && npm i
```

  <h4>1.6: unicafe, paso 1</h4>

Como la mayoría de las empresas, [Unicafe](https://www.unicafe.fi/#/9/4) recopila comentarios de sus clientes. Su tarea es implementar una aplicación web para recopilar comentarios de los clientes. Solo hay tres opciones para los comentarios: <i>good (bueno)</i>, <i>neutral</i> y <i>bad(malo)</i>.

La aplicación debe mostrar el número total de comentarios recopilados para cada categoría. Su aplicación final podría verse así:

![](../../images/1/13e.png)

Tenga en cuenta que su aplicación debe funcionar solo durante una única sesión del navegador. Una vez que actualice la página, los comentarios recopilados pueden desaparecer.

Puede implementar la aplicación en un solo archivo <i>index.js</i>. Puede utilizar el siguiente código como punto de partida para su aplicación.

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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

ReactDOM.render(<App />, 
  document.getElementById('root')
)
```

<h4>1.7: unicafe, paso 2</h4>

Amplíe su aplicación para que muestre más estadísticas sobre los comentarios recopilados: el número total de comentarios recopilados, la puntuación promedio (buena: 1, neutral: 0, mala: -1) y el porcentaje de comentarios positivos.

![](../../images/1/14e.png)

<h4>1.8: unicafe, paso 3</h4>

Refactorice su aplicación para que la visualización de las estadísticas se extraiga en su propio componente <i>Statistics</i>. El estado de la aplicación debe permanecer en el componente raíz <i>App</i>.

Recuerde que los componentes no deben definirse dentro de otros componentes:

```js
// un lugar adecuado para definir un componente
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // no defina componentes adentro de otro componente
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe paso4</h4>

Cambie su aplicación para mostrar estadísticas solo una vez que se hayan recopilado los comentarios.

![](../../images/1/15e.png)

<h4>1.10: unicafe step5</h4> 

Continuemos refactorizando la aplicación. Extraiga los dos componentes siguientes:

- <i>Button</i> para definir los botones utilizados para enviar comentarios
- <i>Statistics</i> para mostrar una única estadística, por ejemplo, la puntuación media.

Para ser claros: el componente <i>Statistics</i> siempre muestra una única estadística, lo que significa que la aplicación utiliza varios componentes para representar todas las estadísticas:

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <Statistic text="good" value ={...} />
      <Statistic text="neutral" value ={...} />
      <Statistic text="bad" value ={...} />
      // ...
    </div>
  )
}

```

El estado de la aplicación aún debe mantenerse en el componente raíz <i>App</i>.

<h4>1.11*: unicafe, paso 6</h4> 

Muestra las estadísticas en una [tabla](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) HTML, de modo que su la aplicación se ve más o menos así:

![](../../images/1/16e.png)

Recuerde mantener la consola abierta en todo momento. Si ve esta advertencia en su consola:

![](../../images/1/17a.png)

Luego realice las acciones necesarias para que la advertencia desaparezca. Intente buscar en Google el mensaje de error si se queda atascado.

<i>Una fuente típica de un error `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` es la extensión de Chrome. Intente ir a `chrome://extensions/` e intente deshabilitarlos uno por uno y actualizar la página de la aplicación React; el error debería desaparecer eventualmente.</i>

**¡Asegúrate de que a partir de ahora no veas ninguna advertencia en tu consola!**

<h4>1.12*: anécdotes, paso 1</h4>

El mundo de la ingeniería de software está lleno con [anécdotas](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) que destilan verdades atemporales de nuestro campo en breves frases.

Expanda la siguiente aplicación agregando un botón en el que se puede hacer clic para mostrar una anécdota <i>aleatoria</i> del campo de la ingeniería de software:

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {props.anecdotes[selected]}
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
```

Google te dirá cómo generar números aleatorios en JavaScript. Recuerde que puede probar la generación de números aleatorios, por ejemplo, directamente en la consola de su navegador.

Su aplicación finalizada podría verse así 

![](../../images/1/18a.png)

**ADVERTENCIA** create-react-app convertirá automáticamente su proyecto en un repositorio git a menos que cree su aplicación dentro de un repositorio git existente. **Lo más probable es que no desee que cada uno de sus proyectos sea un repositorio separado**, así que simplemente ejecute el comando _rm -rf .git_ en la raíz de su aplicación.

<h4>1.13*: anecdotes, paso 2</h4>

Expande tu aplicación para que puedas votar por la anécdota mostrada.

![](../../images/1/19a.png)

**NB** almacene los votos de cada anécdota en una matriz u objeto en el estado del componente. Recuerde que la forma correcta de actualizar el estado almacenado en estructuras de datos complejas como objetos y matrices es hacer una copia del estado.

Puede crear una copia de un objeto como este:

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1
```

O una copia de una matriz como esta:

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1
```
El uso de una matriz podría ser la opción más sencilla en este caso. Buscar en Google te proporcionará muchos consejos sobre cómo crear una matriz llena de ceros de la longitud deseada, como [esto](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1,14*: anecdotes, paso 3</h4>

Ahora implemente la versión final de la aplicación que muestra la anécdota con el mayor número de votos 

![](../../images/1/20a.png)

Si se empatan varias anécdotas en el primer lugar, es suficiente con solo mostrar uno de ellos.

Este fue el último ejercicio de esta parte del curso y es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
