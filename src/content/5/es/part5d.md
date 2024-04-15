---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: es
---

<div class="content">

Hasta ahora, hemos probado el backend como un todo a nivel de API usando pruebas de integración, y probado algunos componentes frontend usando pruebas unitarias.

A continuación, veremos una forma de probar el [sistema como un todo](https://en.wikipedia.org/wiki/System_testing) usando pruebas de <i>Extremo a Extremo</i> (End to End o E2E).

Podemos hacer pruebas E2E de una aplicación web usando un navegador y una librería de pruebas. Hay varias librerías disponibles, por ejemplo [Selenium](http://www.seleniumhq.org/) que se puede utilizar con casi cualquier navegador.
Otra opción de navegador son los denominados [headless browsers](https://es.wikipedia.org/wiki/Navegador_sin_interfaz_gr%C3%A1fica) (navegadores sin cabeza), que son navegadores sin interfaz gráfica de usuario.
Por ejemplo, Chrome se puede utilizar en modo sin cabeza.

Las pruebas E2E son potencialmente la categoría de pruebas más útil, porque prueban el sistema a través de la misma interfaz que usan los usuarios reales.

También tienen algunos inconvenientes. Configurar las pruebas E2E es más complicado que las pruebas unitarias o de integración. También tienden a ser bastante lentas y, con un sistema grande, su tiempo de ejecución puede ser de minutos, incluso horas. Esto es malo para el desarrollo, porque durante el desarrollo es beneficioso poder ejecutar pruebas con la mayor frecuencia posible en caso de sufrir [regresiones](https://es.wikipedia.org/wiki/Pruebas_de_regresi%C3%B3n) de código.

Las pruebas E2E también pueden ser [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359) (inestables).
Algunas pruebas pueden pasar una vez y fallar en otra, incluso si el código no cambia en absoluto.

Quizás las dos librerías más fáciles para pruebas de extremo a extremo en este momento son [Cypress](https://www.cypress.io/) y [Playwright](https://playwright.dev/).

De las estadísticas en [npmtrends.com](https://npmtrends.com/cypress-vs-playwright) vemos que Cypress, que dominó el mercado durante los últimos cinco años, sigue siendo claramente el número uno, pero Playwright está en un rápido ascenso:

![cypress vs playwright en tendencias de npm](../../images/5/cvsp.png)

Este curso ha estado usando Cypress durante años. Ahora Playwright es una nueva adición. Puedes elegir si completar la parte de pruebas E2E del curso con Cypress o Playwright. Los principios operativos de ambas librerías son muy similares, así que tu elección no es muy importante. Sin embargo, ahora Playwright es la librería E2E preferida para el curso.

Si tu elección es Playwright, por favor continúa. Si terminas usando Cypress, ve [aquí](/es/part5/pruebas_de_extremo_a_extremo_cypress).

### Playwright

[Playwright](https://playwright.dev/) es un recién llegado a las pruebas de extremo a extremo, que comenzó a explotar en popularidad hacia finales de 2023. Playwright está aproximadamente a la par con Cypress en términos de facilidad de uso. Las librerías son ligeramente diferentes en términos de cómo funcionan. Cypress es radicalmente diferente de la mayoría de las librerías de pruebas E2E, ya que las pruebas de Cypress se ejecutan completamente dentro del navegador. Las pruebas de Playwright, por otro lado, se ejecutan en el proceso de Node, que está conectado al navegador a través de interfaces de programación.

Se han escrito muchos blogs sobre comparaciones de librerías, por ejemplo, [este](https://www.lambdatest.com/blog/cypress-vs-playwright/) y [este](https://www.browserstack.com/guide/playwright-vs-cypress).

Es difícil decir qué librería es mejor. Una ventaja de Playwright es su soporte de navegadores; Playwright soporta Chrome, Firefox y navegadores basados en Webkit como Safari. Actualmente, Cypress incluye soporte para todos estos navegadores, aunque el soporte de Webkit es experimental y no soporta todas las funcionalidades de Cypress. Al momento de escribir (1.3.2024), mi preferencia personal se inclina ligeramente hacia Playwright.

Ahora exploremos Playwright.

### Inicializando pruebas

A diferencia de las pruebas de backend o las pruebas unitarias realizadas en el front-end de React, las pruebas de extremo a extremo no necesitan estar ubicadas en el mismo proyecto npm donde está el código. Hagamos un proyecto completamente separado para las pruebas E2E con el comando _npm init_. Luego instala Playwright ejecutando en el directorio del nuevo proyecto el comando:

```js
npm init playwright@latest
```

El script de instalación hará algunas preguntas, responde de la siguiente manera:

![respuesta: javascript, tests, false, true](../../images/5/play0.png)

Definamos un script npm para ejecutar pruebas e informes de pruebas en _package.json_:

```js
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

Durante la instalación, lo siguiente se imprime en la consola:

```
And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration
```

esto es, la ubicación de algunas pruebas de ejemplo para el proyecto que la instalación ha creado.

Ejecutemos algunas pruebas:

```bash
$ npm test

> notes-e2e@1.0.0 test
> playwright test


Running 6 tests using 5 workers
  6 passed (3.9s)

To open last HTML report run:

  npx playwright show-report
```

Las pruebas pasan. Un reporte más detallado puede abrirse tanto con el comando sugerido en la consola, como con el script de npm que acabamos de definir:

```
npm run test:report
```

Las pruebas también pueden ejecutarse a través de la interfaz gráfica con el comando:

```
npm run test -- --ui
```

Las pruebas de muestra se ven así:

```js
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/'); // highlight-line

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

La primera linea de las funciones test dicen que las pruebas están probando la pagina https://playwright.dev/.

### Probando nuestro propio código

Ahora eliminemos las pruebas de ejemplo y comencemos a probar nuestra propia aplicación.

Las pruebas de Playwright asumen que el sistema bajo prueba está en funcionamiento cuando se ejecutan las pruebas. A diferencia de, por ejemplo, las pruebas de integración de backend, las pruebas de Playwright <i>no inician</i> el sistema bajo prueba durante las pruebas.

Hagamos un script npm para el <i>backend</i>, que permitirá iniciarlo en modo de prueba, es decir, de modo que <i>NODE_ENV</i> obtenga el valor <i>test</i>.

```js
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test node --test",
    "start:test": "NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

Iniciemos el frontend y el backend, y creemos el primer archivo de prueba para la aplicación <code>tests/note\_app.spec.js</code>:

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
})
```

Primero, la prueba abre la aplicación con el método [page.goto](https://playwright.dev/docs/writing-tests#navigation). Después de esto, utiliza el método [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) para obtener un [locator](https://playwright.dev/docs/locators) (localizador) que corresponde al elemento donde se encuentra el texto <i>Notes</i>.

El método [toBeVisible](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible) asegura que el elemento correspondiente al localizador sea visible en la página.

La segunda comprobación se realiza sin usar la variable auxiliar.

Nos damos cuenta de que el año ha cambiado. Cambiemos la prueba de la siguiente manera:

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible() // highlight-line
})
```

Como se esperaba, la prueba falla. Playwright abre el informe de la prueba en el navegador y se hace evidente que Playwright ha realizado las pruebas con tres navegadores diferentes: Chrome, Firefox y Webkit, es decir, el motor de navegador utilizado por Safari:

![informe de prueba mostrando la prueba fallida en tres navegadores diferentes](../../images/5/play2.png)

Al hacer clic en el informe de uno de los navegadores, podemos ver un mensaje de error más detallado:

![mensaje de error de la prueba](../../images/5/play3a.png)

Generalmente, es por supuesto algo muy bueno que las pruebas se lleven a cabo con los tres motores de navegador más comúnmente utilizados, pero esto es lento, y al desarrollar las pruebas probablemente sea mejor realizarlas principalmente con solo un navegador. Puedes definir el motor de navegador a utilizar con el parámetro de línea de comando:

```js
npm test -- --project chromium
```

Ahora corrijamos el año desactualizado en el código del frontend que causó el error.

Antes de continuar, agreguemos un bloque _describe_ a las pruebas:

```js
const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {  // highlight-line
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })
})
```

Antes de continuar, rompamos las pruebas una vez más. Notamos que la ejecución de las pruebas es bastante rápida cuando pasan, pero mucho más lenta si no pasan. La razón de esto es que la política de Playwright es esperar a que los elementos buscados estén [renderizados y listos para la acción](https://playwright.dev/docs/actionability). Si el elemento no se encuentra, se genera un _TimeoutError_ y la prueba falla. Playwright espera por los elementos por defecto durante 5 o 30 segundos [dependiendo de las funciones utilizadas en la prueba](https://playwright.dev/docs/test-timeouts#introduction).

Al desarrollar pruebas, puede ser más prudente reducir el tiempo de espera a unos pocos segundos. Según la [documentación](https://playwright.dev/docs/test-timeouts), esto se puede hacer cambiando el archivo _playwright.config.js_ de la siguiente manera:

```js
module.exports = defineConfig({
  timeout: 3000,
  fullyParallel: false, // highlight-line
  workers: 1, // highlight-line
  // ...
})
```

También hicimos dos cambios más en el archivo, y especificamos que todas las pruebas [se ejecuten una a una](https://playwright.dev/docs/test-parallel). Con la configuración predeterminada, la ejecución ocurre en paralelo, y dado que nuestras pruebas utilizan una base de datos, la ejecución en paralelo causa problemas.

### Escribiendo en un formulario

Escribamos una nueva prueba para intentar iniciar sesión en la aplicación. Supongamos que un usuario está guardado en la base de datos, con el nombre de usuario <i>mluukkai</i> y la contraseña <i>salainen</i>.

Comencemos abriendo el formulario de inicio de sesión.

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
  })
})
```

La prueba primero utiliza el método [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) para encontrar el botón basado en su texto. El método devuelve el [Locator](https://playwright.dev/docs/api/class-locator) correspondiente al elemento Button. Presionar el botón se realiza utilizando el método [click](https://playwright.dev/docs/api/class-locator#locator-click) del Locator.

Al desarrollar pruebas, podrías usar el [modo UI](https://playwright.dev/docs/test-ui-mode) de Playwright, es decir, la versión de la interfaz de usuario. Comencemos las pruebas en modo UI de la siguiente manera:

```
npm test -- --ui
```

Ahora vemos que la prueba encuentra el botón

![UI de Playwright renderizando la aplicación de notas mientras la prueba](../../images/5/play4.png)

Después de hacer clic, aparecerá el formulario

![UI de Playwright renderizando el formulario de inicio de sesión de la aplicación de notas](../../images/5/play5.png)

Cuando se abre el formulario, la prueba debe buscar los campos de texto e introducir el nombre de usuario y la contraseña en ellos. Hagamos el primer intento utilizando el método [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role):

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByRole('textbox').fill('mluukkai')  // highlight-line
  })
})
```

Esto resulta en un error:

```bash
Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
  1) <input value=""/> aka locator('div').filter({ hasText: /^username$/ }).getByRole('textbox')
  2) <input value="" type="password"/> aka locator('input[type="password"]')
```

El problema ahora es que _getByRole_ encuentra dos campos de texto, y al llamar al método [fill](https://playwright.dev/docs/api/class-locator#locator-fill) falla, porque asume que solo se encontró un campo de texto. Una manera de solucionar el problema es utilizar los métodos [first](https://playwright.dev/docs/api/class-locator#locator-first) y [last](https://playwright.dev/docs/api/class-locator#locator-last):

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    // highlight-start
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    // highlight-end
  })
})
```

Después de escribir en los campos de texto, la prueba presiona el botón _login_ y verifica que la aplicación muestre la información del usuario que ha iniciado sesión en la pantalla.

Si hubiera más de dos campos de texto, utilizar los métodos _first_ y _last_ no sería suficiente. Una posibilidad sería usar el método [all](https://playwright.dev/docs/api/class-locator#locator-all), que convierte a los localizadores encontrados en un array que puede ser indexado:

```js
describe('Note app', () => {
  // ...
  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    // highlight-start
    const textboxes = await page.getByRole('textbox').all()

    await textboxes[0].fill('mluukkai')
    await textboxes[1].fill('salainen')
    // highlight-end

    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })  
})
```

Ambas versiones de la prueba funcionan. Sin embargo, ambas son problemáticas en la medida en que si el formulario de registro cambia, las pruebas pueden fallar, ya que dependen de que los campos estén en la página en un cierto orden.

Una mejor solución es definir atributos de id de prueba únicos para los campos, y buscarlos en las pruebas utilizando el método [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id).

Ampliemos el formulario de inicio de sesión de la siguiente manera

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            data-testid='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            data-testid='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">
          login
        </button>
      </form>
    </div>
  )
}
```

La prueba cambia de la siguiente manera:

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai') // highlight-line
    await page.getByTestId('password').fill('salainen')  // highlight-line
  
    await page.getByRole('button', { name: 'login' }).click() 
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

Ten en cuenta que para que la prueba pase en esta etapa, es necesario que haya un usuario en la base de datos de <i>test</i> del backend con el nombre de usuario <i>mluukkai</i> y la contraseña <i>salainen</i>. ¡Crea un usuario si es necesario!

Dado que ambas pruebas comienzan de la misma manera, es decir, abriendo la página <i>http://localhost:5173</i>, se recomienda aislar la parte común en el bloque <i>beforeEach</i> que se ejecuta antes de cada prueba:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // highlight-start
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })
  // highlight-end

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

### Probando el formulario para agregar notas

A continuación, agreguemos pruebas para probar la funcionalidad "new note":

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})
```

La prueba se ha definido en su propio bloque _describe_. Crear una nota requiere que el usuario haya iniciado sesión, lo cual es controlado en el bloque _beforeEach_.

La prueba confía en que al crear una nueva nota, la página contiene solo un campo de texto, por lo que lo busca así:

```js
page.getByRole('textbox')
```

Si la página tuviera más campos, la prueba se rompería. Debido a esto, sería mejor agregarle un test-id a los inputs del formulario y buscarlo basado en su id.

**Nota:** la prueba solo pasara la primera vez. La razón de esto es que su aserción

```js
await expect(page.getByText('a note created by playwright')).toBeVisible()
```

causa problemas cuando la misma nota es creada en la aplicación más de una vez. El problema será resuelto en el próximo capitulo.

La estructura de las pruebas se ve así:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ....

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})
```

Dado que hemos evitado que las pruebas se ejecuten en paralelo, Playwright ejecuta las pruebas en el orden en que aparecen en el código de prueba. Es decir, primero se realiza la prueba <i>user can log in</i>, donde el usuario inicia sesión en la aplicación. Después de esto se ejecuta la prueba <i>a new note can be created</i>, que también realiza un inicio de sesión, en el bloque <i>beforeEach</i>. ¿Por qué se hace esto, no está ya el usuario conectado gracias a la prueba anterior? No, porque la ejecución de <i>cada</i> prueba comienza desde el "estado cero" del navegador, todos los cambios realizados en el estado del navegador por las pruebas anteriores se resetean.

### Controlando el estado de la base de datos

Si las pruebas necesitan poder modificar la base de datos del servidor, la situación inmediatamente se vuelve más complicada. Idealmente, la base de datos del servidor debería ser la misma cada vez que ejecutamos las pruebas, para que nuestras pruebas se puedan repetir de forma fiable y sencilla.

Al igual que con las pruebas unitarias y de integración, con las pruebas E2E es mejor vaciar la base de datos y posiblemente formatearla antes de ejecutar las pruebas. El desafío con las pruebas E2E es que no tienen acceso a la base de datos.

La solución es crear endpoints de API en el backend para la prueba.
Podemos vaciar la base de datos usando estos endpoints.
Creemos un nuevo enrutador para las pruebas dentro del directorio <i>controllers</i>, en el archivo <i>testing.js</i>

```js
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```

y agrégalo al backend solo <i>si la aplicación se ejecuta en modo de prueba</i>:

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

Después de los cambios, una solicitud POST HTTP al endpoint <i>/api/testing/reset</i> vacía la base de datos. Asegúrate de que tu backend esté ejecutándose en modo de prueba iniciándolo con este comando (previamente configurado en el archivo package.json):

```js
  npm run start:test
```

El código de backend modificado se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1), rama <i>part5-1</i>.

A continuación, cambiaremos el bloque _beforeEach_ para que vacíe la base de datos del servidor antes de ejecutar las pruebas.

Actualmente no es posible agregar nuevos usuarios a través de la interfaz de usuario del frontend, por lo que agregamos un nuevo usuario al backend desde el bloque beforeEach.

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  
  test('front page can be opened',  () => {
    // ...
  })

  test('user can login', () => {
    // ...
  })

  describe('when logged in', () => {
    // ...
  })
})
```

Durante la inicialización, la prueba realiza solicitudes HTTP al backend con el método [post](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post) del parámetro _request_.

A diferencia de antes, ahora la prueba del backend siempre comienza desde el mismo estado, es decir, hay un usuario y no hay notas en la base de datos.

Hagamos una prueba que verifique que la importancia de las notas pueda cambiarse.

Hay algunos enfoques diferentes para realizar la prueba.

A continuación, primero buscamos una nota y hacemos clic en su botón que tiene el texto <i>make not important</i>. Después de esto, comprobamos que la nota contiene el botón con <i>make important</i>.


```js
describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    // ...

    // highlight-start
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    // highlight-end
    })
  })
})
```

El primer comando primero busca al componente donde está el texto <i>another note by playwright</i> y dentro de él al botón <i>make not important</i> y hace clic en él.

El segundo comando asegura que el texto del mismo botón haya cambiado a <i>make important</i>.

El código actual para las pruebas está en [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-1), en la rama <i>part5-1</i>.

### Prueba de inicio de sesión fallida

Hagamos una prueba para asegurarnos de que un intento de inicio de sesión falla si la contraseña es incorrecta.

Cypress ejecutará todas las pruebas cada vez de forma predeterminada y, a medida que aumenta el número de pruebas, comienza a consumir bastante tiempo.
Al desarrollar una nueva prueba o al depurar una prueba rota, podemos definir la prueba con <i>it.only</i> en lugar de <i>it</i>, de modo que Cypress solo ejecutará la prueba requerida.
Cuando la prueba esté funcionando, podemos eliminar <i>.only</i>.

La primera versión de nuestras pruebas es la siguiente:

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
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

Podríamos hacer que la prueba asegure que el mensaje de error se renderiza al componente correcto, es decir, al componente con la clase CSS <i>error</i>:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

Primero usamos [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) para buscar un componente con la clase CSS <i>error</i>. Luego verificamos que el mensaje de error se pueda encontrar en este componente.
Ten en cuenta que los [selectores de clase CSS](https://developer.mozilla.org/es/docs/Web/CSS/Class_selectors) comienzan con un punto final, por lo que el selector para la clase <i>error</i> es <i>.error</i>.

Podríamos hacer lo mismo usando la sintaxis [should](https://docs.cypress.io/api/commands/should.html):

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Usar should es un poco más complicado que usar <i>contains</i>, pero permite pruebas más diversas que <i>contains</i>, que funciona solo con contenido de texto.

La lista de las aserciones más comunes con las que se puede usar _should_ se puede encontrar [aquí](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

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
it('login fails with wrong password', function() {
  cy.contains('log in').click()
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

El comando <i>should</i> se usa más frecuentemente encadenándolo después del comando <i>get</i> (o otro comando similar que pueda ser encadenado). El <i>cy.get('html')</i> usado en la prueba prácticamente significa el contenido visible de toda la aplicación.

También podríamos verificar lo mismo encadenando el comando <i>contains</i> con el comando <i>should</i> con un parámetro ligeramente diferente:

```js
cy.contains('Matti Luukkainen logged in').should('not.exist')
```

**NOTA:** Algunas propiedades CSS se comportan de manera diferente en Firefox. Si ejecutas las pruebas con Firefox:

  ![running](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)
  
  entonces las pruebas que involucran, por ejemplo, `border-style`, `border-radius` y `padding`, pasarán en Chrome o Electron, pero fallarán en Firefox:

  ![borderstyle](https://user-images.githubusercontent.com/4255997/119016340-7b55e780-b9a2-11eb-82e0-bab0418244c0.png)

### Omitiendo la interfaz de usuario

Actualmente tenemos las siguientes pruebas:

```js
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
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

La documentación de Cypress nos da el siguiente consejo: [Prueba completamente el flujo de inicio de sesión, ¡pero solo una vez!](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow----but-only-once).
Por lo tanto, en lugar de iniciar sesión como usuario mediante el formulario en el bloque <i>beforeEach</i>, vamos a omitir la interfaz de usuario y realizaremos una solicitud HTTP al backend para iniciar sesión. La razón de esto es que iniciar sesión con una solicitud HTTP es mucho más rápido que completar un formulario.

Nuestra situación es un poco más complicada que en el ejemplo de la documentación de Cypress, porque cuando un usuario inicia sesión, nuestra aplicación guarda sus detalles en localStorage.
Sin embargo, Cypress también puede manejar esto.
El código es el siguiente:

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Podemos acceder a la respuesta de un [cy.request](https://docs.cypress.io/api/commands/request.html) con el método [_then_](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#The-Cypress-Command-Queue). Debajo del capó, <i>cy.request</i>, al igual que todos los comandos de Cypress, son [asíncronos](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Commands-Are-Asynchronous).
La función de callback guarda los detalles de un usuario conectado en localStorage y recarga la página.
Ahora no hay diferencia con un usuario que inicia sesión a través del formulario de inicio de sesión.

Si cuando escribimos nuevas pruebas en nuestra aplicación, tenemos que usar el código de inicio de sesión en varios lugares, deberíamos convertirlo en un [comando personalizado](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Los comandos personalizados se declaran en <i>cypress/support/commands.js</i>.
El código para iniciar sesión es el siguiente:

```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
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

Lo mismo se aplica a la creación de una nueva nota ahora que pensamos sobre ello. Tenemos una prueba que hace una nueva nota usando el formulario. También hacemos una nueva nota en el bloque <i>beforeEach</i> de la prueba que cambia la importancia de una nota:

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
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:5173')
})
```

El comando espera que el usuario haya iniciado sesión y que los detalles del usuario estén guardados en localStorage.

Ahora el bloque beforeEach de la nota se convierte en:

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
          important: true
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

Hay otra cosa en nuestras pruebas que es molesta. La URL de nuestra aplicación <i> http://localhost:5173 </i> esta codificada literalmente en varios lugares.

Definamos la URL de nuestra aplicación <i>baseUrl</i> en el [archivo de configuración](https://docs.cypress.io/guides/references/configuration) pre-generado de Cypress <i>cypress.config.js</i>:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173' // highlight-line
  },
})
```

Todos los comandos en las pruebas que usan la dirección de la aplicación

```js
cy.visit('http://localhost:5173')
```

se pueden cambiar a

```js
cy.visit('')
```

La dirección codificada del backend, <i>http://localhost:3001</i>, todavía está en las pruebas. La [documentación](https://docs.cypress.io/guides/guides/environment-variables) de Cypress recomienda definir otras direcciones utilizadas por las pruebas como variables de entorno.

Expandamos el archivo de configuración <i>cypress.config.js</i> de la siguiente manera:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173',
    env: {
      BACKEND: 'http://localhost:3001/api' // highlight-line
    }
  },
})
```

Reemplacemos todas las direcciones del backend en las pruebas de la siguiente manera:

```js
describe('Note ', function() {
  beforeEach(function() {

    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // highlight-line
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) // highlight-line
    cy.visit('')
  })
  // ...
})
```

Las pruebas y el código del frontend se pueden encontrar en [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10), rama <i>part5-10</i>.

### Cambiando la importancia de una nota

Por último, echemos un vistazo a la prueba que hicimos para cambiar la importancia de una nota.
Primero cambiaremos el bloque beforeEach para que cree tres notas en lugar de una:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.login({ username: 'mluukkai', password: 'salainen' })
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

Cuando hacemos clic en el comando _cy.contains('second note')_ en Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/cypress-app#Test-Runner), vemos que ese comando busca el elemento que contiene el texto <i>second note</i>:

![cypress test runner haciendo clic en la segunda nota](../../images/5/34new.png)

Al hacer clic en la línea siguiente _.contains('make important')_ vemos que la prueba utiliza el botón 'make important' correspondiente a la <i>segunda nota</i>:

![cypress test runner haciendo clic en make important](../../images/5/35new.png)

Cuando está encadenado, el segundo comando <i>contains</i> <i>continúa</i> la búsqueda desde dentro del componente encontrado por el primer comando.

Si no hubiéramos encadenado los comandos, y en su lugar hubiéramos escrito

```js
cy.contains('second note')
cy.contains('make important').click()
```

el resultado habría sido totalmente diferente. La segunda línea de la prueba haría clic en el botón de una nota incorrecta:

![cypress mostrando error e intentando hacer clic incorrectamente en el primer botón](../../images/5/36new.png)

Al escribir pruebas, ¡debes verificar en el ejecutor de pruebas que las pruebas utilicen los componentes correctos!

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

¡Nuestras pruebas se rompen! Como revela el test runner, _cy.contains('second note')_ ahora devuelve el componente que contiene el texto y el botón no está en él.

![cypress mostrando que la prueba está rota intentando hacer clic en "make important"](../../images/5/37new.png)

Una forma de solucionarlo es la siguiente:

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

En la primera línea, usamos el comando [parent](https://docs.cypress.io/api/commands/parent.html) para acceder al elemento padre del elemento que contiene <i>second note</i> y buscamos el botón dentro de él.
Luego hacemos clic en el botón y verificamos que el texto cambie.

Ten en cuenta que usamos el comando [find](https://docs.cypress.io/api/commands/find.html#Syntax) para buscar el botón. No podemos usar [cy.get](https://docs.cypress.io/api/commands/get.html) aquí, porque siempre busca desde la página <i>completa</i> y devolvería los 5 botones en la pagina.

Desafortunadamente, ahora tenemos algo de copia-pega en las pruebas, porque el código para buscar el botón correcto es siempre el mismo.

En este tipo de situaciones, es posible usar el comando [as](https://docs.cypress.io/api/commands/as.html):

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Ahora la primera línea encuentra el botón correcto y usa <i>as</i> para guardarlo como <i>theButton</i>. Las siguientes líneas pueden usar el elemento nombrado con <i>cy.get('@theButton')</i>.

### Ejecutando y depurando tus pruebas

Finalmente, algunas notas sobre cómo funciona Cypress y la depuración de tus pruebas.

Debido a la forma de las pruebas de Cypress, da la impresión de que son código JavaScript normal y, por ejemplo, podríamos intentar esto:

```js
const button = cy.contains('log in')
button.click()
debugger
cy.contains('logout').click()
```

Sin embargo, esto no funcionará. Cuando Cypress ejecuta una prueba, agrega cada comando _cy_ a una cola de ejecución.
Cuando se haya ejecutado el código del método de prueba, Cypress ejecutará cada comando en la cola uno por uno.

Los comandos de Cypress siempre devuelven _undefined_, por lo que _button.click()_ en el código anterior causaría un error. Un intento de iniciar el depurador no detendría el código entre la ejecución de los comandos, sino antes de que se haya ejecutado algún comando.

Los comandos de Cypress son <i>como promesas</i>, así que si queremos acceder a sus valores de retorno, tenemos que hacerlo usando el comando [then](https://docs.cypress.io/api/commands/then.html).
Por ejemplo, la siguiente prueba imprime el número de botones en la aplicación y hace clic en el primer botón:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Detener la ejecución de la prueba con el depurador es [posible](https://docs.cypress.io/api/commands/debug.html). El depurador se inicia solo si la consola para desarrolladores del test runner de Cypress está abierta.

La Consola para desarrolladores es muy útil para depurar tus pruebas.
Puedes ver las solicitudes HTTP realizadas por las pruebas en la pestaña Network, y la pestaña Console te mostrará información sobre tus pruebas:

![consola para desarrolladores mientras se ejecuta Cypress](../../images/5/38new.png)

Hasta ahora hemos ejecutado nuestras pruebas Cypress usando el test runner gráfico.
También es posible ejecutarlas [desde la línea de comandos](https://docs.cypress.io/guides/guides/command-line.html). Solo tenemos que agregarle un script npm:

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

Ahora podemos ejecutar nuestras pruebas desde la línea de comandos con el comando <i>npm run test:e2e</i>

![Salida de terminal al ejecutar las pruebas npm e2e mostrando aprobadas](../../images/5/39new.png)

Ten en cuenta que los videos de la ejecución de las pruebas se guardarán en <i>cypress/videos/</i>, por lo que probablemente deberías ignorar este directorio en git. También es posible [desactivar](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos) la creación de videos.

El código frontend y las pruebas se pueden encontrar en [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11) en la rama <i>part5-11</i>.

</div>

<div class="tasks">

### Ejercicios 5.17.-5.23.

En los últimos ejercicios de esta parte haremos algunas pruebas E2E para nuestra aplicación de blog.
El material de esta parte debería ser suficiente para completar los ejercicios.
También deberías consultar la [documentación](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) de Cypress. Probablemente sea la mejor documentación que he visto para un proyecto de código abierto.

Recomiendo especialmente leer [Introducción a Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), que afirma que

> <i>Esta es la guía más importante para comprender cómo realizar pruebas con Cypress. Léela. Entiéndela.</i>

#### 5.17: Pruebas de End To End de la Lista de Blogs, paso 1

Configura Cypress para tu proyecto. Realiza una prueba para comprobar que la aplicación muestra el formulario de inicio de sesión de forma predeterminada.

La estructura de la prueba debe ser la siguiente

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

El blog de formateo <i>beforeEach</i> debe vaciar la base de datos utilizando, por ejemplo, el método que usamos en el [material](/es/part5/pruebas_de_extremo_a_extremo#controlando-el-estado-de-la-base-de-datos).

#### 5.18: Pruebas de End To End de la Lista de Blogs, paso 2

Realiza pruebas para iniciar sesión. Prueba tanto los intentos de inicio de sesión exitosos y los no exitosos.
Crea un nuevo usuario en el bloque <i>beforeEach</i> para las pruebas.

El cuerpo de las pruebas se extiende de la siguiente manera

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:5173')
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

<i>Ejercicio adicional opcional</i>: comprueba que la notificación que se muestra con el inicio de sesión fallido se muestra en rojo.

#### 5.19: Pruebas de End To End de la Lista de Blogs, paso 3

Realiza una prueba que compruebe que un usuario que ha iniciado sesión puede crear un nuevo blog.
La estructura de la prueba podría ser la siguiente

```js
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
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

#### 5.20: Pruebas de End To End de la Lista de Blogs, paso 4

Haz una prueba que compruebe que al usuario le puede gustar ("like") un blog.

#### 5.21: Pruebas de End To End de la Lista de Blogs, paso 5

Realiza una prueba para asegurarte de que el usuario que creó un blog pueda eliminarlo.

#### 5.22: Pruebas de End To End de la Lista de Blogs, paso 6

Realiza una prueba para asegurarte de que solo el creador puede ver el botón delete de un blog, nadie más.

#### 5.23: Pruebas de End To End de la Lista de Blogs, paso 7

Realiza una prueba que verifique que los blogs estén ordenados de acuerdo con los likes, con el blog con más likes en primer lugar.

<i>Este ejercicio puede ser un poco más complicado que los anteriores</i>. Una posible solución es agregar cierta clase para el elemento que cubre el contenido del blog y luego usar el método [eq](https://docs.cypress.io/api/commands/eq#Syntax) para obtener el elemento en un índice específico:

```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

Ten en cuenta que podrías terminar teniendo problemas si haces clic en el botón "Like" muchas veces seguidas. Puede ser que Cypress haga clic tan rápido que no tenga tiempo de actualizar el estado de la aplicación entre los clics. Una solución para esto es esperar a que se actualice la cantidad de Likes entre todos los clics.

Este fue el último ejercicio de esta parte, y es hora de enviar tu código a GitHub y marcar los ejercicios que has completado en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
