---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: es
---

<div class="content">

Hasta ahora, hemos probado el backend como un todo a nivel de API usando pruebas de integración, y probado algunos componentes frontend usando pruebas unitarias.

A continuación, veremos una forma de probar el [sistema como un todo](https://en.wikipedia.org/wiki/System_testing) usando pruebas <i>End to End</i>

Podemos hacer pruebas E2E de una aplicación web usando un navegador y una librería de pruebas. Hay varias librerías disponibles, por ejemplo [Selenium](http://www.seleniumhq.org/) que se puede utilizar con casi cualquier navegador.
Otra opción de navegador son los denominados [navegadores sin cabeza](https://en.wikipedia.org/wiki/Headless_browser), que son navegadores sin interfaz gráfica de usuario.
Por ejemplo, Chrome se puede utilizar en modo sin cabeza.

Las pruebas E2E son potencialmente la categoría de pruebas más útil, porque prueban el sistema a través de la misma interfaz que usan los usuarios reales.

También tienen algunos inconvenientes. Configurar las pruebas E2E es más complicado que las pruebas unitarias o de integración. También tienden a ser bastante lentas y, con un sistema grande, su tiempo de ejecución puede ser de minutos, incluso horas. Esto es malo para el desarrollo, porque durante la codificación es beneficioso poder ejecutar pruebas con la mayor frecuencia posible en caso de [regresiones](https://en.wikipedia.org/wiki/Regression_testing) de código .

Las pruebas E2E también pueden ser [inestables](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).
Algunas pruebas pueden pasar una vez y fallar en otra, incluso si el código no cambia en absoluto.

### Cypress

La biblioteca E2E [Cypress](https://www.cypress.io/) se ha vuelto popular durante el último año. Cypress es excepcionalmente fácil de usar y, en comparación con el Selenium, por ejemplo, requiere mucha menos molestia y dolor de cabeza.
Su principio operativo es radicalmente diferente al de la mayoría de las librerías de prueba E2E, porque las pruebas Cypress se ejecutan completamente dentro del navegador.
Otras librerías ejecutan las pruebas en un proceso de nodo, que está conectado al navegador a través de una API.

Hagamos algunas pruebas de extremo a extremo para nuestra aplicación de notas.

Comenzamos instalando Cypress en el <i>frontend </i> como dependencia de desarrollo

```js
npm install --save-dev cypress
```

y agregando un script npm para ejecutarlo:

```js
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

A diferencia de las pruebas unitarias del frontend, las pruebas de Cypress pueden estar en el repositorio frontend o backend, o incluso en su propio repositorio separado.

Las pruebas requieren que el sistema probado esté funcionando. A diferencia de nuestras pruebas de integración de backend, las pruebas de Cypress <i>no inician</i> el sistema cuando se ejecutan.

Agreguemos un script npm al <i>backend </i> que lo inicia en modo de prueba, o para que <i>NODE\\_ENV </i> sea <i>test</i>.

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    "start:test": "cross-env NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

Cuando tanto el backend como el frontend están ejecutándose, podemos iniciar Cypress con el comando

```js
npm run cypress:open
```

Cuando ejecutamos Cypress por primera vez, crea un directorio <i>cypress</i>. Contiene un subdirectorio <i> integration </i>, donde colocaremos nuestras pruebas. Cypress crea un montón de pruebas de ejemplo para nosotros en el directorio <i>integration/examples</i>. Podemos eliminar el directorio <i>examples</i> y hacer nuestra propia prueba en el archivo <i>note\\_app.spec.js</i>:

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
})
```

Comenzamos la prueba desde la ventana abierta:

![](../../images/5/40ea.png)

La ejecución de la prueba abre su navegador y muestra cómo se comporta la aplicación cuando se ejecuta la prueba:

![](../../images/5/32ae.png)

La estructura de la prueba debe parecer familiar. Usan bloques <i>describe</i> para agrupar diferentes casos de prueba como lo hace Jest. Los casos de prueba se han definido con el método <i>it</i>.
Cypress tomó prestadas estas partes de la librería de pruebas [Mocha](https://mochajs.org/) que usa bajo el capó.

[cy.visit](https://docs.cypress.io/api/commands/visit.html) y [cy.contains](https://docs.cypress.io/api/commands/contains.html) son comandos de Cypress y su propósito es bastante obvio.
[cy.visit](https://docs.cypress.io/api/commands/visit.html) abre la dirección web que se le asigna como parámetro en el navegador utilizado por la prueba. [cy.contains](https://docs.cypress.io/api/commands/contains.html) busca la cadena que recibió como parámetro de la página.

Podríamos haber declarado la prueba usando una función de flecha

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
})
```


Sin embargo, Mocha [recomienda](https://mochajs.org/#arrow-functions) que las funciones de flecha no se utilicen, porque pueden causar algunos problemas en determinadas situaciones.

Si <i>cy.contains</i> no encuentra el texto que está buscando, la prueba no pasa.
Entonces, si ampliamos nuestra prueba como

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:3000')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

la prueba falla

![](../../images/5/33ea.png)

Eliminemos el código defectuoso de la prueba.

### Escribiendo en un formulario

Extendamos nuestras pruebas para que la prueba intente iniciar sesión en nuestra aplicación.
Suponemos que nuestro backend contiene un usuario con el nombre de usuario <i>mluukkai</i> y la contraseña <i>salainen</i>.

La prueba comienza abriendo el formulario de inicio de sesión.

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('login').click()
  })
})
```

La prueba primero busca el botón de inicio de sesión por su texto y hace clic en el botón con el comando [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).

Nuestras dos pruebas comienzan de la misma manera, abriendo la página <i>http://localhost:3000</i>, por lo que debemos separar la parte compartida en un bloque <i>beforeEach</i> que se ejecuta antes de cada prueba:

```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })
})
```

El campo de inicio de sesión contiene dos campos de <i>entrada</i>, en los que la prueba debe escribir.

El comando [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) permite buscar elementos mediante selectores CSS.

Podemos acceda al primer y último campo de entrada de la página, y escríbalos con el comando [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) así:

```js
it('user can login', function () {
  cy.contains('login').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})  
```

La prueba funciona. El problema es que si luego agregamos más campos de entrada, la prueba se interrumpirá porque espera que los campos que necesita sean el primero y el último en la página.

Sería mejor dar a nuestras entradas <i>ids</i> únicos y usarlos para encontrarlos.
Cambiamos nuestro formulario de inicio de sesión así

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit"> // highlight-line
          login
        </button>
      </form>
    </div>
  )
}
```

También agregamos una identificación a nuestro botón de envío para que podamos acceder a él en nuestras pruebas.

La prueba se convierte en

```js
describe('Note app',  function() {
  // ..
  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')  // highlight-line    
    cy.get('#password').type('salainen')  // highlight-line
    cy.get('#login-button').click()  // highlight-line

    cy.contains('Matti Luukkainen logged in') // highlight-line
  })
})
```

La última fila asegura que el inicio de sesión fue exitoso.

Tenga en cuenta que el CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) es #, así que si queremos buscar un elemento con el id <i>username</i> el selector de CSS es <i>#username</i>.

### Algunas cosas a tener en cuenta

La prueba primero hace clic en el botón que abre el formulario de inicio de sesión como

```js
cy.contains('login').click()
```

Cuando el formulario se ha llenado, el formulario se envía haciendo clic en el botón submit

```js
cy.get('#login-button').click()
```

Ambos botones tienen el texto <i>login</i>, pero son dos botones separados.
En realidad, ambos botones están en el DOM de la aplicación todo el tiempo, pero solo uno es visible a la vez debido al estilo <i>display: none</i> en uno de ellos.

Si buscamos un botón por su texto, [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) devolverá el primero de ellos, o el que abre el formulario de inicio de sesión.
Esto sucederá incluso si el botón no está visible.
Para evitar conflictos de nombres, le dimos al botón de enviar la identificación <i>login-button</i> que podemos usar para acceder a él.

Ahora notamos que la variable _cy_ que usan nuestras pruebas nos da un desagradable error de Eslint

![](../../images/5/30ea.png)

Podemos deshacernos de él instalando [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) como una dependencia de desarrollo

```js
npm install eslint-plugin-cypress --save-dev
```

y cambiando la configuración en <i>.eslintrc.js</i> así:

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true // highlight-line
    },
    "extends": [ 
      // ...
    ],
    "parserOptions": {
      // ...
    },
    "plugins": [
        "react", "jest", "cypress" // highlight-line
    ],
    "rules": {
      // ...
    }
}
```

### Probando un nuevo formulario de nota

A continuación, agreguemos pruebas que prueben la funcionalidad de la nueva nota:

```js
describe('Note app', function() {
  // ..
  // highlight-start
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })
    // highlight-end

    // highlight-start
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })
  })
  // highlight-end
})
```

La prueba se ha definido en su propio bloque <i>describe</i>.
Solo los usuarios registrados pueden crear nuevas notas, por lo que agregamos el inicio de sesión en la aplicación a un bloque <i>beforeEach</i>.

La prueba confía en que al crear una nueva nota, la página contiene solo una entrada, por lo que la busca así

```js
cy.get('input')
```

Si la página contuviera más entradas, la prueba se rompería

![](../../images/5/31ea.png)

Debido a esto, nuevamente sería mejor darle a la entrada un <i>id</i> y buscar el elemento por su id.

La estructura de las pruebas se ve así:

```js
describe('Note app', function() {
  // ...

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ...
    })
  })
})
```

Cypress ejecuta las pruebas en el orden en que están en el código. Entonces, primero ejecuta <i>user can log in</i>, donde el usuario inicia sesión. Entonces cypress ejecutará <i>a new note can be created</i> que el bloque <i>beforeEach</i> también inicia sesión.
¿Por qué hacer esto? ¿No inició sesión el usuario después de la primera prueba?
No, porque <i>cada</i> prueba comienza desde cero en lo que respecta al navegador.
Todos los cambios en el estado del navegador se invierten después de cada prueba.

### Controlar el estado de la base de datos

Si las pruebas necesitan poder modificar la base de datos del servidor, la situación inmediatamente se vuelve más complicada. Idealmente, la base de datos del servidor debería ser la misma cada vez que ejecutamos las pruebas, para que nuestras pruebas se puedan repetir de forma fiable y sencilla.

Al igual que con las pruebas unitarias y de integración, con las pruebas E2E es mejor vaciar la base de datos y posiblemente formatearla antes de ejecutar las pruebas. El desafío con las pruebas E2E es que no tienen acceso a la base de datos.

La solución es crear endpoints de API en el backend para la prueba.
Creemos un nuevo <i>enrutador</i> para las pruebas

```js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```

y agréguelo al backend solo <i>si la aplicación se ejecuta en modo de prueba</i>:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

después de los cambios, una solicitud HTTP POST al extremo <i>/api/testing/reset</i> vacía la base de datos.

El código de backend modificado se puede encontrar en [github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1), rama <i>part5-1</i>.

A continuación, cambiaremos el bloque <i>beforeEach</i> para que vacíe la base de datos del servidor antes de ejecutar las pruebas.

Actualmente no es posible agregar nuevos usuarios a través de la interfaz de usuario del frontend, por lo que agregamos un nuevo usuario al backend desde el bloque beforeEach.

```js
describe('Note app', function() {
   beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    // highlight-end
    cy.visit('http://localhost:3000')
  })
  
  it('front page can be opened', function() {
    // ...
  })

  it('user can login', function() {
    // ...
  })

  describe('when logged in', function() {
    // ...
  })
})
```

Durante el formateo, la prueba realiza solicitudes HTTP al backend con [cy.request](https://docs.cypress.io/api/commands/request.html).

A diferencia de antes, ahora la prueba comienza con el backend en el mismo estado cada vez. El backend contendrá un usuario y no notas.

Agreguemos una prueba más para verificar que podemos cambiar la importancia de notas.
Primero cambiamos la interfaz para que una nueva nota no sea importante por defecto, o el campo <i>important</i> sea <i>false</i>:

```js
const NoteForm = ({ createNote }) => {
  // ...

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false // highlight-line
    })

    setNewNote('')
  }
  // ...
} 
```

Hay varias formas de probar esto. En el siguiente ejemplo, primero buscamos una nota y hacemos clic en su botón <i>make important</i>. Luego verificamos que la nota ahora contenga un botón <i>make not important</i>.

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })
})
```

El primer comando busca un componente que contenga el texto <i>another note cypress</i>, y luego un botón <i>make important</i> dentro de él. Luego hace clic en el botón.

El segundo comando comprueba que el texto del botón haya cambiado a <i>make not important</i>.

Las pruebas y el código de interfaz actual se pueden encontrar en [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9), rama <i>part5-9</i>.

Hagamos una prueba para asegurarnos de que un intento de inicio de sesión falla si la contraseña es incorrecta.

Cypress ejecutará todas las pruebas cada vez de forma predeterminada y, a medida que aumenta el número de pruebas, comienza a consumir bastante tiempo.
Al desarrollar una nueva prueba o al depurar una prueba rota, podemos definir la prueba con <i>it.only</i> en lugar de <i>it</i>, de modo que Cypress solo ejecutará la prueba requerida.
Cuando la prueba está funcionando, podemos eliminar <i>.only</i>.

La primera versión de nuestras pruebas es la siguiente:

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```

La prueba utiliza [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) para garantizar que la aplicación imprima un mensaje de error.

La aplicación muestra el mensaje de error en un componente con la clase CSS <i>error</i>:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```

Podríamos hacer que la prueba asegure que el mensaje de error se representa al componente correcto, o al componente con la clase CSS <i>error</i>:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

Primero usamos [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) para buscar un componente con la clase CSS <i>error</i>. Luego verificamos que el mensaje de error se pueda encontrar en este componente.
Tenga en cuenta que el [selector de clases CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) comienza con un punto final, por lo que el selector para la clase <i>error</i> es <i>.error</i>.

Podríamos hacer lo mismo usando la sintaxis [should](https: //docs.cypress.io/api/commands/should.html):

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Usar should es un poco más complicado que usar <i>contain</i>, pero permite pruebas más diversas que <i>contain</i>, que funciona solo con contenido de texto.

La lista de las aserciones más comunes con las que se pueden usar se puede encontrar [aquí](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

Podemos, por ejemplo, asegurarnos de que el mensaje de error sea rojo y tenga un borde:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

Cypress requiere que los colores se den como [rgb](https://rgbcolorcode.com/color/red).

Debido a que todas las pruebas son para el mismo componente al que accedimos usando [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), podemos encadenarlos usando [and](https://docs.cypress.io/api/commands/and.html).

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

Terminemos la prueba para que también verifique que la aplicación no muestre el mensaje de éxito <i>'Matti Luukkainen logged in'</i>:

```js
it.only('login fails with wrong password', function() {
  cy.contains('login').click()
  cy.get('#username').type('mluukkai')
  cy.get('#password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in') // highlight-line
})
```

<i>Should</i> siempre debería estar encadenado con <i>get</i> (u otro comando encadenable). Usamos <i>cy.get ('html')</i> para acceder a todo el contenido visible de la aplicación.

### Omitiendo la interfaz de usuario

Actualmente tenemos las siguientes pruebas:

```js 
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it.only('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ... 
    })
   
  })
})
```

Primero probamos el inicio de sesión. Luego, en su propio bloque de descripción, tenemos un montón de pruebas que esperan que el usuario inicie sesión. El usuario ha iniciado sesión en el bloque <i>beforeEach</i>.

Como dijimos anteriormente, ¡cada prueba comienza desde cero! Las pruebas no comienzan en el estado donde terminaron las pruebas anteriores.

La documentación de Cypress nos da el siguiente consejo: [Pruebe completamente el flujo de inicio de sesión, ¡pero solo una vez!](Https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-en).
Por lo tanto, en lugar de iniciar sesión como usuario mediante el formulario del bloque <i>beforeEach</i>, Cypress recomienda que [omitamos la interfaz de usuario](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) y realiza una solicitud HTTP al backend para iniciar sesión. La razón de esto es que iniciar sesión con una solicitud HTTP es mucho más rápido que completar un formulario.

Nuestra situación es un poco más complicada que en el ejemplo de la documentación de Cypress, porque cuando un usuario inicia sesión, nuestra aplicación guarda sus detalles en localStorage.
El código es el siguiente

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Podemos acceder a la respuesta a un [cy.request](https://docs.cypress.io/api/commands/request.html) con el método _then_. Debajo del capó <i>cy.request</i>, como todos los comandos de Cypress, están [Promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).
La función de devolución de llamada guarda los detalles de un usuario que inició sesión en localStorage y vuelve a cargar la página.
Ahora no hay diferencia en el inicio de sesión del usuario con el formulario de inicio de sesión.

Si y cuando escribimos nuevas pruebas en nuestra aplicación, tenemos que usar el código de inicio de sesión en varios lugares.
Deberíamos convertirlo en un [comando personalizado](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Los comandos personalizados se declaran en <i>cypress/support/commands.js</i>.
El código para iniciar sesión es el siguiente:

```js 
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})
```

Usar nuestro comando personalizado es fácil y nuestra prueba se vuelve más limpia:

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.login({ username: 'mluukkai', password: 'salainen' })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Lo mismo se aplica a la creación de una nueva nota ahora que lo pensamos. Tenemos una prueba que hace una nueva nota usando el formulario. También hacemos una nueva nota en el bloque <i>beforeEach</i> de la prueba de prueba que cambia la importancia de una nota:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Creemos un nuevo comando personalizado para crear una nueva nota. El comando creará una nueva nota con una solicitud HTTP POST:

```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})
```

El comando espera que el usuario inicie sesión y que los detalles del usuario se guarden en localStorage.

Ahora el bloque de formato se convierte en:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      // ...
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        // highlight-start
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
        // highlight-end
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Las pruebas y el código de la interfaz se pueden encontrar en [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10), rama <i>part5-10</i>.

### Cambiar la importancia de una nota

Por último, echemos un vistazo a la prueba que hicimos para cambiar la importancia de una nota.
Primero cambiaremos el bloque de formato para que cree tres notas en lugar de una:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.createNote({ content: 'first note', important: false })
      cy.createNote({ content: 'second note', important: false })
      cy.createNote({ content: 'third note', important: false })
      // highlight-end
    })

    it('one of those can be made important', function () {
      cy.contains('second note')
        .contains('make important')
        .click()

      cy.contains('second note')
        .contains('make not important')
    })
  })
})
```

¿Cómo funciona realmente el comando [cy.contains](https://docs.cypress.io/api/commands/contains.html)?

Cuando hacemos clic en el comando _cy.contains('second note')_ en Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html), vemos ese comando busca el elemento que contiene el texto <i>second note</i>:

![](../../images/5/34ea.png)

Al hacer clic en la siguiente línea _.contains('make important') _ vemos que la prueba usa el botón 'make important' correspondiente a la <i> segunda nota </i>:

![](../../images/5/35ea.png)

Cuando está encadenado, el segundo comando <i>contains</i> <i>continúa</i> la búsqueda desde dentro del componente encontrado por el primer comando.

Si no hubiéramos encadenado los comandos, y en su lugar hubiéramos escrito

```js
cy.contains('second note')
cy.contains('make important').click()
```

el resultado habría sido totalmente diferente. La segunda línea de la prueba haría clic en el botón de una nota incorrecta:

![](../../images/5/36ea.png)

¡Al codificar pruebas, debe verificar en el corredor de pruebas que las pruebas utilizan los componentes correctos!

Cambiemos el componente _Note_ para que el texto de la nota se renderice en un <i>span </i>.

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

¡Nuestras pruebas se rompen! Como revela el corredor de pruebas, _cy.contains('second note') _ ahora devuelve el componente que contiene el texto y el botón no está en él.

![](../../images/5/37ea.png)

Una forma de solucionarlo es la siguiente:

```js
it('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

En la primera línea, usamos el comando [parent](https://docs.cypress.io/api/commands/parent.html) para acceder al elemento padre del elemento que contiene <i>second note</i> y busque el botón dentro de él.
Luego hacemos clic en el botón y verificamos que el texto cambie.

Tenga en cuenta que usamos el comando [find](https://docs.cypress.io/api/commands/find.html#Syntax) para buscar el botón. No podemos usar [cy.get](https://docs.cypress.io/api/commands/get.html) aquí, porque siempre busca desde la página <i>completa</i> y devolvería los 5 botones en la pagina.

Desafortunadamente, ahora tenemos algo de copypaste en las pruebas, porque el código para buscar el botón correcto es siempre el mismo.
En este tipo de situaciones, es posible usar el comando [as](https://docs.cypress.io/api/commands/as.html):

```js
it.only('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Ahora la primera línea encuentra el botón correcto y usa <i>as</i> para guardarlo como <i>theButton</i>. Las siguientes líneas pueden usar el elemento nombrado con <i>cy.get('@theButton')</i>.

### Ejecutando y depurando tus pruebas

Finalmente, algunas notas sobre cómo funciona Cypress y depurando tus pruebas.

La forma de las pruebas de Cypress da la impresión de que las pruebas son código JavaScript normal y, por ejemplo, podríamos intentar esto:

```js
const button = cy.contains('login')
button.click()
debugger() 
cy.contains('logout').click()
```

Sin embargo, esto no funcionará. Cuando Cypress ejecuta una prueba, agrega cada comando _cy_ a una cola de ejecución.
Cuando se haya ejecutado el código del método de prueba, Cypress ejecutará cada comando en la cola uno por uno.

Los comandos de Cypress siempre devuelven _undefined_, por lo que _button.click()_ en el código anterior causaría un error. Un intento de iniciar el depurador no detendría el código entre la ejecución de los comandos, sino antes de que se hayan ejecutado los comandos.

Los comandos de Cypress son <i>como promesas</i>, así que si queremos acceder a sus valores de retorno, tenemos que hágalo usando el comando [then](https://docs.cypress.io/api/commands/then.html).
Por ejemplo, la siguiente prueba imprime el número de botones en la aplicación y hace clic en el primer botón:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Detener la ejecución de la prueba con el depurador es [posible](https://docs.cypress.io/api/commands/debug.html). El depurador se inicia solo si la Consola del desarrollador del ejecutor de pruebas de Cypress está abierta.

La Consola para desarrolladores es muy útil para depurar tus pruebas.
Puede ver las solicitudes HTTP realizadas por las pruebas en la pestaña Network, y la pestaña Console le mostrará información sobre sus pruebas:

![](../../images/5/38ea.png)

Hasta ahora hemos ejecutado nuestras pruebas Cypress usando el corredor de pruebas gráfico.
También es posible ejecutarlos [desde la línea de comandos](https://docs.cypress.io/guides/guides/command-line.html). Solo tenemos que agregarle un script npm:

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run" // highlight-line
  },
```

Ahora podemos ejecutar nuestras pruebas desde la línea de comandos con el comando <i>npm run test: e2e</i>

![](../../images/5/39ea.png

Tenga en cuenta que el video de la ejecución de la prueba se guardará en <i>cypress/videos/</i>, por lo que probablemente debería ignorar este directorio.

La interfaz y el código de prueba se pueden encontrar en [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11), rama <i>part5-11</i>.

</div>

<div class="tasks">

### Ejercicios 5.17.-5.22.

En los últimos ejercicios de esta parte haremos algunas pruebas E2E para nuestra aplicación de blog.
El material de esta parte debería ser suficiente para completar los ejercicios.
Absolutamente también debería consultar la [documentación](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) de Cypress (https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell). Probablemente sea la mejor documentación que he visto para un proyecto de código abierto.

Recomiendo especialmente leer [Introducción a Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), que afirma que

> <i>Esta es la guía más importante para comprender cómo realizar pruebas con Cypress. Léelo. Entiéndalo.</i>

#### 5.17: prueba de extremo a extremo de la lista de blogs, paso 1

Configure Cypress para su proyecto. Realice una prueba para comprobar que la aplicación muestra el formulario de inicio de sesión de forma predeterminada.

La estructura de la prueba debe ser la siguiente


```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

El blog de formateo <i>beforeEach</i> debe vaciar la base de datos utilizando, por ejemplo, el método que usamos en el [material](/es​​/part5/end_to_end_testing#controlando-el-estado-de-la-base-de-datos).

#### 5.18: prueba de extremo a extremo de la lista de blogs, paso 2

Realizar pruebas para iniciar sesión. Pruebe los intentos de inicio de sesión exitosos y no exitosos.
Crear un nuevo usuario en el bloque <i>beforeEach</i> para las pruebas.

El cuerpo de las pruebas se expande de la siguiente manera

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

<i>Ejercicio adicional opcional</i>: compruebe que la notificación que se muestra con el inicio de sesión fallido se muestra en rojo.

#### 5.19: prueba de extremo a extremo de la lista de blogs, paso 3

Realice una prueba que compruebe que un usuario que ha iniciado sesión puede crear un nuevo blog.
La estructura de la prueba podría ser la siguiente

```js 
describe('Blog app', function() {
  // ...

  describe.only('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

La prueba debe garantizar que se agregue un nuevo blog a la lista de todos los blogs.

#### 5.20: prueba de extremo a extremo de la lista de blogs, paso 4

Hacer una prueba que compruebe que al usuario le puede gustar ("like") un blog.

#### 5.21: prueba de extremo a extremo de la lista de blogs, paso 5

Realice una prueba para asegurarse de que el usuario que creó un blog pueda eliminarlo.

<i>Ejercicio adicional opcional:</i> también verifique que otros usuarios no puedan eliminar el blog.

#### 5.22: prueba de extremo a extremo de la lista de blogs , paso 6

Realice una prueba que verifique que los blogs estén ordenados de acuerdo con los likes con el blog con más likes en primer lugar.

Este ejercicio puede ser un poco más complicado. Una solución es encontrar todos los blogs y luego compararlos en la función de devolución de llamada de un comando [then](https://docs.cypress.io/api/commands/then.html#DOM-element).

Este fue el último ejercicio de esta parte, y es hora de enviar su código a github y marcar los ejercicios que completó en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen) .

</div>
