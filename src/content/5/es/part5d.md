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
  timeout: 3000, // highlight-line
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

Ahora hagamos una prueba que asegure que el intento de inicio de sesión falla si la contraseña es incorrecta.

La primera versión de la prueba se ve así:

```js
describe('Note app', () => {
  // ...

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong credentials')).toBeVisible()
  })

  // ...
)}
```

La prueba verifica con el método [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) que la aplicación muestra un mensaje de error.

La aplicación renderiza el mensaje de error en un elemento que contiene la clase CSS <i>error</i>:

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

Podríamos refinar la prueba para asegurar que el mensaje de error se muestre exactamente en el lugar correcto, es decir, en el elemento que contiene a la clase CSS <i>error</i>:

```js
  test('login fails with wrong password', async ({ page }) => {
  // ...

  const errorDiv = await page.locator('.error') // highlight-line
  await expect(errorDiv).toContainText('wrong credentials')
})
```

La prueba utiliza el método [page.locator](https://playwright.dev/docs/api/class-page#page-locator) para encontrar el componente que contiene la clase CSS <i>error</i> y lo almacena en una variable. La verificación del texto asociado con el componente se puede verificar con la aserción [toContainText](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text). Ten en cuenta que el [selector de clase CSS](https://developer.mozilla.org/es/docs/Web/CSS/Class_selectors) comienza con un punto, por lo que el selector de la clase <i>error</i> es <i>.error</i>.

Es posible probar los estilos CSS de la aplicación con el comparador [toHaveCSS](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css). Podemos, por ejemplo, asegurarnos de que el color del mensaje de error sea rojo y que haya un borde alrededor de él:

```js
  test('login fails with wrong password', async ({ page }) => {
  // ...

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid') // highlight-line
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)') // highlight-line
})
```

En Playwright los colores deben definirse cómo códigos [rgb](https://rgbcolorcode.com/color/red).

Terminemos la prueba para que también asegure que la aplicación **no renderiza** al texto describiendo un inicio de de sesión exitoso <i>'Matti Luukkainen logged in'</i>:

```js
test('login fails with wrong password', async ({ page }) =>{
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill('mluukkai')
  await page.getByTestId('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = await page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

  await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible() // highlight-line
})
```

### Ejecutando pruebas una por una

Por defecto, Playwright siempre ejecuta todas las pruebas, y a medida que el número de pruebas aumenta, cada vez consume más tiempo. Al desarrollar una nueva prueba o depurar una rota, la prueba se puede definir en lugar de con el comando <i>test</i>, con el comando <i>test.only</i>, en cuyo caso Playwright ejecutará solo esa prueba:

```js
describe(() => {
  // esta es la única prueba ejecutada!
  test.only('login fails with wrong password', async ({ page }) => {  // highlight-line
    // ...
  })

  // esta prueba es omitida...
  test('user can login with correct credentials', async ({ page }) => {
    // ...
  }

  // ...
})
```

Cuando la prueba esta lista, <i>only</i> puede y **debe** ser eliminado.

Otra opción para ejecutar una sola prueba es utilizar un parámetro de la linea de comandos:

```
npm test -- -g "login fails with wrong password"
```

### Funciones auxiliares para las pruebas

Las pruebas de nuestra aplicación actualmente se ven así:

```js 
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  test('user can login with correct credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) =>{
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      // ...
    })
  
    // ...
  })  
})
```

Primero, se prueba la función de inicio de sesión. Después de esto, otro bloque _describe_ contiene un conjunto de pruebas que asumen que el usuario ha iniciado sesión, el inicio de sesión se maneja dentro del bloque inicializador _beforeEach_.

Como ya se mencionó anteriormente, cada prueba se ejecuta comenzando desde el estado inicial (donde la base de datos se limpia y se crea un usuario allí), por lo tanto, aunque la prueba esté definida después de otra prueba en el código, ¡no comienza desde el mismo estado que han dejado las pruebas ejecutadas anteriormente en el código!

También vale la pena esforzarse por tener un código no repetitivo en las pruebas. Aislemos el código que maneja el inicio de sesión como una función auxiliar, que se coloca, por ejemplo, en el archivo _tests/helper.js_:

```js 
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }
```

La prueba se vuelve mucho más simple y clara:

```js
const { loginWith } = require('./helper')

describe('Note app', () => {
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    })

  test('a new note can be created', () => {
    // ...
  })

  // ...
})
```

Playwright también ofrece una [solución](https://playwright.dev/docs/auth) donde el inicio de sesión se realiza una vez antes de las pruebas, y cada prueba comienza desde un estado en el que la aplicación ya ha iniciado sesión. Para que podamos aprovechar este método, la inicialización de los datos de prueba de la aplicación debería hacerse de manera un poco diferente a la actual. En la solución actual, la base de datos se resetea antes de cada prueba, y debido a esto, iniciar sesión solo una vez antes de las pruebas es imposible. Para que podamos usar el inicio de sesión previo a la prueba proporcionado por Playwright, el usuario debería inicializarse solo una vez antes de las pruebas. Nos adherimos a nuestra solución actual por simplicidad.

El código repetitivo correspondiente también se aplica a la creación de una nueva nota. Para eso, hay una prueba que crea una nota usando un formulario. También en el bloque de inicialización _beforeEach_ de la prueba que evalúa el cambio de importancia de la nota, se crea una nota utilizando el formulario:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', () => {
    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })
  
      test('it can be made important', async ({ page }) => {
        // ...
      })
    })
  })
})
```

La creación de una nota también es aislada como una función auxiliar. El archivo _tests/helper.js_ se expande de la siguiente manera:

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

// highlight-start
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
}
// highlight-end

export { loginWith, createNote }
```

Las pruebas se simplifican de la siguiente manera:

```js
describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright', true) // highlight-line
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright', true) // highlight-line
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

Hay otra característica molesta en nuestras pruebas. Las direcciones del frontend <i>http://localhost:5173</i> y del backend <i>http://localhost:3001</i> están hardcodeadas en las pruebas. De estas, la dirección del backend en realidad es inútil, porque se ha definido un proxy en la configuración de Vite del frontend, que redirige todas las solicitudes hechas por el frontend a la dirección <i>http://localhost:5173/api</i> hacia el backend:

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  // ...
})
```

Así que podemos reemplazar todas las direcciones en las pruebas de _http://localhost:3001/api/..._ a _http://localhost:5173/api/..._

Ahora podemos definir la _baseUrl_ para la aplicación en el archivo de configuración de las pruebas <i>playwright.config.js</i>:

```js
module.exports = defineConfig({
  // ...
  use: {
    baseURL: 'http://localhost:5173',
  },
  // ...
}
```

Todos los comandos en las pruebas que usan la URL de la aplicación, por ejemplo:

```js
await page.goto('http://localhost:5173')
await page.post('http://localhost:5173/api/tests/reset')
```

se pueden transformar en:

```js
await page.goto('/')
await page.post('/api/tests/reset')
```

El código actual para las pruebas está en [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-2), en la rama <i>part5-2</i>.

### Revisión del cambio de importancia de la nota

Echemos un vistazo a la prueba que hicimos anteriormente, que verifica que es posible cambiar la importancia de una nota.

Cambiemos el bloque de inicialización de la prueba para que cree dos notas en lugar de una:

```js
describe('when logged in', () => {
  // ...
  describe('and several notes exists', () => {
    beforeEach(async ({ page }) => {
      // highlight-start
      await createNote(page, 'first note', true)
      await createNote(page, 'second note', true)
      // highlight-end
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      const otherNoteElement = await page.getByText('first note')

      await otherNoteElement
        .getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
})
```

La prueba primero busca el elemento correspondiente a la primera nota creada utilizando el método _page.getByText_ y lo almacena en una variable. Después de esto, busca dentro del elemento un botón con el texto _make not important_ y presiona al botón. Finalmente, la prueba verifica que el texto del botón haya cambiado a _make important_.

La prueba también podría haberse escrito sin la variable auxiliar:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  await page.getByText('first note')
    .getByRole('button', { name: 'make not important' }).click()

  await expect(page.getByText('first note').getByText('make important'))
    .toBeVisible()
})
```

Cambiemos el componente _Note_ para que el texto de la nota se renderice dentro de un elemento _span_

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

¡Las pruebas fallan! La razón del problema es que el comando _await page.getByText('second note')_ ahora devuelve un elemento _span_ que contiene solo texto, y el botón está fuera de él.

Una forma de solucionar el problema es la siguiente:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const otherNoteText = await page.getByText('first note') // highlight-line
  const otherNoteElement = await otherNoteText.locator('..') // highlight-line

  await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(otherNoteElement.getByText('make important')).toBeVisible()
})
```

La primera línea ahora busca el elemento _span_ que contiene el texto asociado con la primera nota creada. En la segunda línea, se utiliza la función _locator_ y se da _.._ como argumento, que obtiene el elemento padre del elemento. La función locator es muy flexible, y aprovechamos el hecho de que acepta [como argumento](https://playwright.dev/docs/locators#locate-by-css-or-xpath) no solo selectores CSS sino también selectores [XPath](https://developer.mozilla.org/es/docs/Web/XPath). Sería posible expresar lo mismo con CSS, pero en este caso XPath proporciona la manera más sencilla de encontrar el padre de un elemento.

Por supuesto, la prueba también puede escribirse usando solo una variable auxiliar:

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const secondNoteElement = await page.getByText('second note').locator('..')
  await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(secondNoteElement.getByText('make important')).toBeVisible()
})
```

Cambiemos la prueba para que tres notas sean creadas, la importancia se cambia en la segunda nota creada:

```js
describe('when logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new note can be created', async ({ page }) => {
    await createNote(page, 'a note created by playwright', true)
    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })

  describe('and a note exists', () => {
    beforeEach(async ({ page }) => {
      await createNote(page, 'first note', true)
      await createNote(page, 'second note', true)
      await createNote(page, 'third note', true) // highlight-line
    })

    test('importance can be changed', async ({ page }) => {
      const otherNoteText = await page.getByText('second note') // highlight-line
      const otherdNoteElement = await otherNoteText.locator('..')
    
      await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(otherdNoteElement.getByText('make important')).toBeVisible()
    })
  })
}) 
```

Por alguna razón, la prueba comienza a funcionar de manera poco confiable, a veces pasa y a veces no. Si la prueba te esta dando problemas, es hora de arremangarse y aprender cómo depurar pruebas.

### Ejecutando y depurando tus pruebas

Si, y cuando las pruebas no pasan y sospechas que la falla está en las pruebas en lugar de en el código, deberías ejecutar las pruebas en modo [debug](https://playwright.dev/docs/debug#run-in-debug-mode-1).

El siguiente comando ejecuta la prueba problemática en modo debug:

```
npm test -- -g'importance can be changed' --debug
```

El inspector de Playwright muestra el progreso de las pruebas paso a paso. El botón de flecha-punto en la parte superior lleva las pruebas un paso más adelante. Los elementos encontrados por los localizadores y la interacción con el navegador se visualizan en el navegador:

![inspector de Playwright destacando el elemento encontrado por el localizador seleccionado en la aplicación](../../images/5/play6a.png)

Por defecto, el debug avanza a través de la prueba comando por comando. Si es una prueba compleja, puede ser bastante pesado avanzar hasta el punto de interés. Esto se puede evitar utilizando el comando _await page.pause()_:

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // ...
  }

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause() // highlight-line
        const otherNoteText = await page.getByText('second note')
        const otherdNoteElement = await otherNoteText.locator('..')
      
        await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherdNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

Ahora en la prueba puedes ir a _page.pause()_ en un paso, presionando el símbolo de flecha verde en el inspector.

Cuando ahora ejecutamos la prueba y saltamos al comando _page.pause()_, descubrimos un hecho interesante:

![inspector de Playwright mostrando el estado de la aplicación en page.pause](../../images/5/play6b.png)

Parece que el navegador <i>no renderiza</i> todas las notas creadas en el bloque _beforeEach_. ¿Cuál es el problema?

La razón del problema es que cuando la prueba crea una nota, comienza a crear la siguiente incluso antes de que el servidor haya respondido, y la nota agregada se renderiza en la pantalla. Esto a su vez puede causar que algunas notas se pierdan (en la imagen, esto ocurrió con la segunda nota creada), ya que el navegador se vuelve a renderizar cuando el servidor responde, basado en el estado de las notas al inicio de esa operación de inserción.

El problema se puede resolver "ralentizando" las operaciones de inserción usando el comando [waitFor](https://playwright.dev/docs/api/class-locator#locator-wait-for) después de la inserción para esperar a que la nota insertada se renderice:

```js
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor() // highlight-line
}
```

En lugar de, o junto con el modo de depuración, ejecutar pruebas en modo UI puede ser útil. Como ya se mencionó, las pruebas se inician en modo UI de la siguiente manera:

```
npm run test -- --ui
```

Casi lo mismo que el modo UI es el uso del [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro) de Playwright. La idea es que se guarde un "rastro visual" de las pruebas, que se puede visualizar si es necesario después de que las pruebas se hayan completado. Un rastro se guarda ejecutando las pruebas de la siguiente manera:

```
npm run test -- --trace on
```

Si es necesario, Trace puede verse con el comando

```
npx playwright show report
```

o con el script npm que definimos _npm run test:report_

Trace se ve prácticamente igual que ejecutar pruebas en modo UI.

El modo UI y Trace Viewer también ofrecen la posibilidad de búsqueda asistida de locators. Esto se hace presionando el doble círculo en el lado izquierdo de la barra inferior, y luego haciendo clic en el elemento de la interfaz de usuario deseado. Playwright muestra el locator del elemento:

![trace viewer de Playwright con flechas rojas apuntando al lugar de búsqueda asistida del locator y al elemento seleccionado con él mostrando un locator sugerido para el elemento](../../images/5/play8.png)

Playwright sugiere lo siguiente como el locator para la tercera nota

```js
page.locator('li').filter({ hasText: 'third note' }).getByRole('button')
```

El método [page.locator](https://playwright.dev/docs/api/class-page#page-locator) se llama con el argumento _li_, es decir, buscamos todos los elementos li en la página, de los cuales hay un total de tres. Después de esto, utilizando el método [locator.filter](https://playwright.dev/docs/api/class-locator#locator-filter), nos centramos en el elemento li que contiene el texto <i>third note</i> y el elemento del botón dentro de él se toma usando el método [locator.getByRole](https://playwright.dev/docs/api/class-locator#locator-get-by-role).

El localizador generado por Playwright es algo diferente del localizador utilizado por nuestras pruebas, que era

```js
page.getByText('first note').locator('..').getByRole('button', { name: 'make not important' })
```

Cuál de los localizadores es mejor probablemente es cuestión de gustos.

Playwright también incluye un [generador de pruebas](https://playwright.dev/docs/codegen-intro) que hace posible "grabar" una prueba a través de la interfaz de usuario. El generador de pruebas se inicia con el comando:

```
npx playwright codegen http://localhost:5173/
```

Cuando el modo _Record_ está activado, el generador de pruebas "registra" la interacción del usuario en el inspector de Playwright, desde donde es posible copiar los localizadores y acciones a las pruebas:

![modo record de Playwright activado con su registro en el inspector después de la interacción del usuario](../../images/5/play9.png)

En lugar de la línea de comandos, Playwright también se puede utilizar a través del plugin de [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). El plugin ofrece muchas características convenientes, por ejemplo, el uso de breakpoints al depurar pruebas.

Para evitar situaciones problemáticas y aumentar la comprensión, definitivamente vale la pena explorar la [documentación](https://playwright.dev/docs/intro) de alta calidad de Playwright. Las secciones más importantes se enumeran a continuación:
- la sección sobre [locators](https://playwright.dev/docs/locators) ofrece buenos consejos para encontrar elementos en las pruebas
- la sección [actions](https://playwright.dev/docs/input) explica cómo es posible simular la interacción con el navegador en las pruebas
- la sección sobre [assertions](https://playwright.dev/docs/test-assertions) demuestra las diferentes aserciones que Playwright ofrece para las pruebas

Puedes encontrar más detalles en la descripción de la [API](https://playwright.dev/docs/api/class-playwright), siendo particularmente útiles la clase [Page](https://playwright.dev/docs/api/class-page) que corresponde a la ventana del navegador de la aplicación bajo prueba, y la clase [Locator](https://playwright.dev/docs/api/class-locator) que corresponde a los elementos buscados en las pruebas.

La versión final de las pruebas está completa en [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-3), en la rama <i>part5-3</i>.

La versión final del código del frontend está en su totalidad en [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9), en la rama <i>part5-9</i>.

</div>

<div class="tasks">

### Ejercicios 5.17.-5.23.

En los últimos ejercicios de esta parte, hagamos algunas pruebas E2E para la aplicación de blog. El material anterior debería ser suficiente para hacer la mayoría de los ejercicios. Sin embargo, definitivamente deberías leer la [documentación](https://playwright.dev/docs/intro) de Playwright y la [descripción de la API](https://playwright.dev/docs/api/class-playwright), al menos las secciones mencionadas al final del capítulo anterior.

#### 5.17: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 1

Crea un nuevo proyecto npm para pruebas y configura Playwright allí.

Haz una prueba para asegurarte de que la aplicación muestra el formulario de inicio de sesión por defecto.

El cuerpo de la prueba debería ser el siguiente:

```js 
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })
})

```

#### 5.18: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 2

Realiza pruebas para iniciar sesión. Prueba tanto los intentos de inicio de sesión exitosos y los no exitosos. Crea un nuevo usuario en el bloque  _beforeEach_ para las pruebas.

El cuerpo de las pruebas se extiende de la siguiente manera

```js 
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // vacía la base de datos aquí
    // crea un usuario para el backend aquí
    // ...
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
    })
  })
})
```

El bloque <i>beforeEach</i> debe vaciar la base de datos utilizando, por ejemplo, el método de formateo que usamos en el [material](/es/part5/pruebas_de_extremo_a_extremo_playwright#controlando-el-estado-de-la-base-de-datos).

#### 5.19: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 3

Crea una prueba que compruebe que un usuario que ha iniciado sesión puede crear un nuevo blog. El cuerpo de la prueba podría ser el siguiente

```js 
describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // ...
  })

  test('a new blog can be created', async ({ page }) => {
    // ...
  })
})
```

La prueba debe garantizar que un nuevo blog es visible en la lista de todos los blogs.

#### 5.20: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 4

Haz una prueba que compruebe que el blog puede editarse.

#### 5.21: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 5

Realiza una prueba para asegurarte de que el usuario que creó un blog pueda eliminarlo. Si utilizas el dialogo _window.confirm_ en la operación de eliminación, quizás tengas que googlear como usar el dialogo en las pruebas de Playwright

#### 5.22: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 6

Realiza una prueba para asegurarte de que solo el creador puede ver el botón delete de un blog, nadie más.

#### 5.23: Pruebas de Extremo a Extremo de la Lista de Blogs, paso 7

Realiza una prueba que verifique que los blogs estén ordenados de acuerdo con los likes, el blog con más likes en primer lugar.

<i>Este ejercicio puede ser un poco más complicado que los anteriores.</i>

Este fue el último ejercicio de esta parte, y es hora de enviar tu código a GitHub y marcar los ejercicios que has completado en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
