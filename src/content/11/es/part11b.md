---
mainImage: ../../../images/part-11.svg
part: 11
letter: b
lang: es
---

<div class="content">

Antes de empezar a jugar con las acciones de GitHub, eche un vistazo a lo que son y cómo funcionan.

Las acciones de GitHub funcionan sobre la base de [flujos de trabajo](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). Un flujo de trabajo es una serie de [trabajos](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs) que se ejecuta cuando ocurre un determinado [evento](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events) desencadenante. Los trabajos que se ejecutan contienen instrucciones sobre lo que deben hacer las acciones de GitHub.

Una ejecución típica de un flujo de trabajo se ve así:

- Se produce un evento de activación (por ejemplo, hay un push a la rama master).
- Se ejecuta el flujo de trabajo con ese disparador.
- Limpieza.

### Necesidades básicas

En general, para que CI opere en un repositorio, necesitamos algunas cosas:

- Un repositorio (obviamente)
- Alguna definición de lo que debe hacer el CI:
  esto puede ser en forma de un archivo específico dentro del repositorio o puede definirse en el sistema de CI
- El CI debe ser consciente de que el repositorio (y el archivo que contiene) existe
- El CI debe poder acceder al repositorio
- El CI necesita permisos para realizar las acciones que se supone que puede qué hacer:
  por ejemplo, si el CI necesita poder implementarse en un entorno de producción, necesita <i> credenciales </i> para ese entorno.

Ese es el modelo tradicional al menos, veremos en un minuto cómo las acciones de GitHub cortocircuitan algunos de estos pasos o, más bien, hacen que no tenga que preocuparse por ellos.

Las acciones de GitHub tienen una gran ventaja sobre las soluciones autohospedadas: el repositorio está alojado con el proveedor de CI. En otras palabras, Github proporciona tanto el repositorio como la plataforma de CI. Esto significa que si hemos habilitado acciones para un repositorio, GitHub ya es consciente del hecho de que tenemos flujos de trabajo definidos y cómo se ven esas definiciones.

</div>

<div class="tasks">

### Ejercicio 11.2.

En la mayoría de los ejercicios de esta parte, estamos creando una canalización de CI/CD para un pequeño proyecto que se encuentra en [este repositorio de proyectos de ejemplo](https://github.com/smartlyio/fullstackopen-cicd).

Tenga en cuenta que el código no funciona con la versión 15 de node. Si tiene esa versión, cambie a 14 o estará solo.

#### 11.2 el proyecto de ejemplo

Lo primero que querrás hacer es hacer fork el repositorio de ejemplo con tu nombre. Lo que hace esencialmente es crear una copia del repositorio en su perfil de usuario de GitHub para su uso.

Para bifurcar el repositorio, puede hacer clic en el botón Bifurcar en el área superior derecha de la vista del repositorio junto al botón Estrella:

![](../../images/11/1.png)

Una vez que haya al hacer clic en el botón Fork, GitHub iniciará la creación de un nuevo repositorio llamado <code>{github_username}/full-stack-open-pokedex</code>.

Una vez finalizado el proceso, debería ser redirigido a su nuevo repositorio:

![](../../images/11/2.png)

Clone el proyecto ahora en su máquina. Como siempre, al comenzar con un nuevo código, el lugar más obvio para buscar primero es el archivo <code>package.json</code>

Pruebe ahora lo siguiente:

- instalar dependencias (ejecutando <code>npm install</code> )
- inicie el código en modo de desarrollo
- ejecute pruebas
- limpie el código

Puede notar que el proyecto contiene algunas pruebas rotas y errores de borrado. **Solo déjalos como están por ahora.** Los solucionaremos más adelante en los ejercicios.

Como recordará de la [parte 3](/en/part3/deploying_app_to_internet#frontend-production-build), el código de React <i>no debería</i> ejecutarse en modo de desarrollo una vez que se haya implementado en producción. Prueba ahora lo siguiente

- crear una <i>compilación</i> de producción del proyecto
- ejecutar la versión de producción localmente.

También para estas dos tareas, ¡hay scripts npm listos para usar en el proyecto!

Estudie la estructura del proyecto por un tiempo. Como puede notar, tanto el código de la interfaz como el del backend están ahora [en el mismo repositorio](/en/part7/class_components_misiverse#frontend-and-backend-in-the-same-repository). En partes anteriores del curso teníamos un repositorio separado para ambos, pero tenerlos en el mismo repositorio simplifica mucho las cosas al configurar un entorno de CI.

A diferencia de la mayoría de los proyectos de este curso, el código frontend <i>no usa</i> create-react-app, pero tiene una configuración de [webpack](/en/part7/webpack) relativamente simple que se encarga de crear el entorno de desarrollo y crear el paquete de producción.

**Una cosa más:** en el ejercicio [11-19](/es​​/part11/expansion_further#ejercicio-11-19) necesitará una <i>URL de webhook de Slack</i>. Si aún no lo tiene, es mejor preguntarlo de inmediato por correo electrónico matti.luukkainen@helsinki.fi o, por supuesto, [Telegram](https://t.me/fullstackcourse), ping @mluukkai

</div>

<div class="content">

### Introducción a los flujos de trabajo

El componente principal de la creación de canalizaciones de CI/CD con GitHub Actions es algo llamado [Flujo de trabajo](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). Los flujos de trabajo son flujos de procesos que puede configurar en su repositorio para ejecutar tareas automatizadas, como compilar, probar, enlazar, liberar e implementar, por nombrar algunas. La jerarquía de un flujo de trabajo es la siguiente:

Flujo de trabajo

- Trabajo
  - Paso
  - Paso
- Trabajo
  - Paso

Cada flujo de trabajo debe especificar al menos un [Trabajo](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs), que contiene un conjunto de [Pasos](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps) para realizar Tareas. Los trabajos se ejecutarán en paralelo y los pasos de cada trabajo se ejecutarán secuencialmente.

Los pasos pueden variar desde ejecutar un comando personalizado hasta usar acciones predefinidas, de ahí el nombre Acciones de GitHub. Puede crear [acciones personalizadas](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) o usar cualquier acción publicada por la comunidad, que son muchas, pero vamos volvamos a eso más tarde!

Para que GitHub reconozca sus flujos de trabajo, deben especificarse en la carpeta <code>.github/workflows</code> en su repositorio. Cada flujo de trabajo es su propio archivo independiente que debe configurarse utilizando el lenguaje de serialización de datos <code>YAML</code>.

YAML es un acrónimo recursivo de "YAML Ain't Markup Language". Como su nombre podría sugerir, su objetivo es ser legible por humanos y se usa comúnmente para archivos de configuración. ¡Notará a continuación que es realmente muy fácil de entender!

Tenga en cuenta que las sangrías son importantes en YAML. Puede obtener más información sobre la sintaxis [aquí](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html).

Un flujo de trabajo básico contiene tres elementos en un documento YAML. Estos tres elementos son:

- nombre: Sí, lo adivinaste,
- (on) triggers: los eventos que activan el flujo de trabajo que se ejecutará
- trabajos: los trabajos separados que ejecutará el flujo de trabajo (un flujo de trabajo básico puede contener solo un trabajo).

Una definición de flujo de trabajo simple se ve así:

```yml
name: Hello World!

on:
  push:
    branches:
      - master

jobs:
  hello_world_job:
    runs-on: ubuntu-18.04
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

En este ejemplo, el disparador es un empujón a la rama master. Hay un trabajo llamado <i>hello\_world\_job</i>, se ejecutará en un entorno virtual con Ubuntu 18.04. El trabajo tiene solo un paso llamado "Say hello", que ejecutará el comando <code>echo "Hello World!"</code> en el shell.

Entonces, puede preguntar, ¿cuándo GitHub activa un flujo de trabajo para que se inicie? Hay muchas [opciones](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) para elegir, pero en términos generales, puede configurar un flujo de trabajo para que se inicie una vez:

- Se produce un <i>evento en GitHub</i>, como cuando alguien envía una confirmación a un repositorio o cuando se crea un problema o una solicitud de extracción
- Se produce un <i>evento programado</i>, que se especifica utilizando la sintaxis [cron](https://en.wikipedia.org/wiki/Cron)
- Un <i>evento externo</i> ocurre, por ejemplo, se ejecuta un comando en una aplicación externa como la aplicación de mensajería [Slack](https://slack.com/).

Para obtener más información sobre qué eventos se pueden usar para activar flujos de trabajo, consulte la [documentación](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) de GitHub Action.

</div>

<div class="tasks">

### Ejercicios 11.3-11.4.

Para unir todo esto, ¡ahora pongamos en marcha Github Actions en el proyecto de ejemplo!

#### 11.3 Hello world!

Cree un nuevo flujo de trabajo que genere "Hello World!" al usuario. Para la configuración, debe crear el directorio <code>.github/workflows</code> y un archivo <code>hello.yml</code> en su repositorio.

Para ver qué ha hecho su flujo de trabajo de GitHub Actions, puede navegar a la pestaña **Actions** en GitHub, donde debería ver los flujos de trabajo en su repositorio y los pasos que implementan. La salida de su flujo de trabajo Hello World debería tener un aspecto similar a este con un flujo de trabajo configurado correctamente.

![Un flujo de trabajo de Hello World configurado correctamente](../../images/11/3.png)

Debería ver el mensaje "Hello World!" como salida. Si ese es el caso, entonces ha seguido con éxito todos los pasos necesarios. ¡Tiene su primer flujo de trabajo de GitHub Actions activo!

Tenga en cuenta que GitHub Actions también le brinda información sobre cuál es el entorno exacto (el sistema operativo y su [configuración](https://github.com/actions/virtual-environments/blob/ubuntu18/20201129.1/images/linux/Ubuntu1804-README.md)) donde se ejecuta su flujo de trabajo. Esto es importante ya que si sucede algo sorprendente, la depuración será mucho más fácil si puedes reproducir todos los pasos en tu máquina.

#### 11.4 fecha y contenido del directorio

Amplíe el flujo de trabajo con pasos que imprimen la fecha y el contenido del directorio actual en formato largo.

Ambos son pasos sencillos y solo ejecutan comandos [fecha](https://man7.org/linux/man-pages/man1/date.1.html) y [ls](https://man7.org/linux/man-pages/man1/ls.1.html) hará el truco

Su flujo de trabajo ahora debe verse así

![Fecha y contenido de directorio en el flujo de trabajo](../../images/11/4.png)

Como la salida del comando <code>ls -l</code> muestra, de forma predeterminada, ¡el entorno virtual que ejecuta nuestro el flujo de trabajo <i>no</i> tiene ningún código!

</div>

<div class="content">

### Configuración de lint, prueba y pasos de construcción

Después de completar los primeros ejercicios, debes tener un flujo de trabajo simple pero bastante inútil. Hagamos que nuestro flujo de trabajo haga algo útil.

Implementemos una acción de Github que borrará el código. Si las comprobaciones no pasan, Github Actions mostrará un estado rojo.

Al principio, el flujo de trabajo que guardaremos en el archivo <code>pipeline.yml</code> se ve así:

```js
name: Deployment pipeline

on:
  push:
    branches:
      - master

jobs:
```

Antes de que podamos ejecutar un comando para filtrar el código, tenemos que realizar un par de acciones para configurar el entorno del trabajo.

#### Configuración del entorno

La configuración del entorno es una tarea importante al configurar una canalización. Vamos a utilizar un entorno virtual <code>ubuntu-18.04</code> porque esta es la versión de Ubuntu que vamos a ejecutar en producción.

Es importante replicar el mismo entorno en CI como en producción lo más cerca posible, para evitar situaciones en las que el mismo código funciona de manera diferente en CI y producción, lo que frustraría efectivamente el propósito de usar CI.

A continuación, enumeramos los pasos en el trabajo de "construcción" que el CI debería realizar. Como notamos en el último ejercicio, por defecto el entorno virtual no tiene ningún código, por lo que necesitamos <i>verificar el código</i> del repositorio.

Este es un paso fácil:

```js
name: Deployment pipeline

on:
  push:
    branches:
      - master

jobs:
  simple_deployment_pipeline: // highlight-line
    runs-on: ubuntu-18.04 // highlight-line
    steps: // highlight-line
      - uses: actions/checkout@v2  // highlight-line
```

La palabra clave [uses](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) le dice al flujo de trabajo que ejecute una < i>acción</i>. Una acción es un fragmento de código reutilizable, como una función. Las acciones se pueden definir en su repositorio en un archivo separado o puede utilizar las disponibles en repositorios públicos.

Aquí estamos usando una acción pública [actions/checkout](https://github.com/actions/checkout) y especificamos una versión (<code>@v2</code>) para evitar posibles cambios importantes si la acción se actualiza. La acción <code>checkout</code> hace lo que su nombre implica: extrae el código fuente del proyecto de git.

En segundo lugar, como la aplicación está escrita en JavasSript, Node.js debe configurarse para poder utilizar los comandos que se especifican en <code>package.json</code>. Para configurar Node.js, se puede usar la acción [actions/setup-node](https://github.com/actions/setup-node). Se selecciona la versión <code>12.x</code> porque es la versión que utiliza la aplicación en el entorno de producción.

```js
# name and trigger not shown anymore...

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1 // highlight-line
        with: // highlight-line
          node-version: '12.x' // highlight-line
```

Como podemos ver, la palabra clave [with](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith) se usa para dar un "parámetro" a la acción. Aquí el parámetro especifica la versión de Node.js que queremos usar.

Por último, se deben instalar las dependencias de la aplicación. Al igual que en su propia máquina, ejecutamos <code>npm install</code>. Los pasos en el trabajo ahora deberían verse algo así como

```js
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: npm install  // highlight-line
        run: npm install  // highlight-line
```

¡Ahora el entorno debería estar completamente listo para que el trabajo ejecute tareas importantes reales!

#### Lint

Una vez configurado el entorno, podemos ejecutar todos los scripts desde <code>package.json</code> como lo haríamos en nuestra propia máquina. Para borrar el código, todo lo que tiene que hacer es agregar un paso para ejecutar el comando <code>npm run eslint</code>.

```js
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: npm install 
        run: npm install  
      - name: lint  // highlight-line
        run: npm run eslint // highlight-line
```

</div>

<div class="tasks">

### Ejercicios 11.5.-11.9.

#### 11.5 Flujo de trabajo de Lint

Implemente o <i>copiar y pegar</i> el flujo de trabajo de "Lint" y enviarlo al repositorio. Utilice un nuevo archivo <i>yml</i> para este flujo de trabajo, puede llamarlo, por ejemplo, <i>pipeline.yml</i>.

Haz push a su código y navega a la pestaña "Actions" y haz clic en tu flujo de trabajo recién creado a la izquierda. Debería ver que la ejecución del flujo de trabajo ha fallado:

![Linting to workflow](../../images/11/5.png)

#### 11.6 Corrija el código

Hay algunos problemas con el código que necesitará arreglar.

Un par de pistas. Es mejor corregir uno de los errores especificando el <i>env</i> adecuado para linting, vea [aquí](/en/part3/validation_and_es_lint#lint) cómo se puede hacer. Una de las quejas relacionadas con la declaración <code>console.log</code> podría resolverse simplemente silenciando la regla para esa línea específica. Pregunte a google cómo hacerlo.

Realice los cambios necesarios en el código fuente para que pase el flujo de trabajo de lint. Una vez que confirme el nuevo código, el flujo de trabajo se ejecutará nuevamente y verá la salida actualizada donde todo es verde nuevamente:

![Error de lint solucionado](../../images/11/6.png)

#### 11.7 Construcción y pruebas

Ampliemos el flujo de trabajo anterior que actualmente realiza el borrado del código. Edite el flujo de trabajo y, de manera similar al comando lint, agregue comandos para compilar y probar. Después de este paso, el resultado debería verse así:

[las pruebas fallan...](../../images/11/7.png)

Como habrás adivinado, hay algunos problemas en el código...

#### 11.8 Volver a verde

Investigue qué prueba falla y corrija el problema en el código (no cambie las pruebas).

Una vez que haya solucionado todos los problemas y la Pokedex esté libre de errores, la ejecución del flujo de trabajo se realizará correctamente y se mostrará en verde.

![pruebas arregladas](../../images/11/8.png)

#### 11.9 Pruebas simples de extremo a extremo

El conjunto actual de pruebas usa [jest](https://jestjs.io/) para garantizar que los componentes de React funcionen como se espera. Esto es exactamente lo mismo que se hace en la sección [Prueba de aplicaciones React](/en/part5/testing_react_apps) de la parte 5.

Probar componentes de forma aislada es bastante útil, pero eso aún no garantiza que el sistema en su conjunto funcione como nosotros deseamos. Para tener más confianza acerca de esto, escribamos un par de pruebas de extremo a extremo realmente simples con la biblioteca [Cypress](https://www.cypress.io/) de manera similar a lo que hacemos en la sección [Prueba de extremo a extremo](/en/part5/end_to_end_testing) de la parte 5.

Entonces, configure cypress (encontrará [aquí](/en/part5/end_to_end_testing/) toda la información que necesita) y use esta prueba al principio:

```js
describe('Pokedex', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('ivysaur')
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo.')
  })
})
```

Defina un script npm <code>test: e2e</code> para ejecutar las pruebas e2e desde la línea de comandos.

**Nota** no incluya la palabra <i>spec</i> en el nombre del archivo de prueba de cypress, eso haría que también jest lo ejecutara y podría causar problemas.

**Otra cosa a tener en cuenta** es que a pesar de que la página muestra los nombres de Pokémon comenzando con una letra mayúscula, los nombres en realidad están escritos con letras minúsculas en la fuente, por lo que es <code>ivysaur</code> en lugar de <code>Ivysaur</code>!

Asegúrese de que la prueba pase localmente. Recuerde que las pruebas de cypress _supone que la aplicación está en funcionamiento_ cuando ejecuta la prueba. Si ha olvidado los detalles (¡eso también me pasó a mí!), Consulte la [parte 5](/es​​/part5/end_to_end_testing) cómo empezar a trabajar con cypress.

Una vez que la prueba de extremo a extremo funcione en su máquina, inclúyala en el flujo de trabajo de GitHub Actions. De lejos, la forma más fácil de hacerlo es utilizar la acción ya preparada [cypress-io/github-action](https://github.com/cypress-io/github-action). El paso que nos conviene es el siguiente:

```js
- name: e2e tests
  uses: cypress-io/github-action@v2
  with:
    command: npm run test:e2e
    start: npm run start-prod
    wait-on: http://localhost:5000
```

Se utilizan tres opciones. [command](https://github.com/cypress-io/github-action#custom-test-command) especifica cómo ejecutar las pruebas de cypress. [start](https://github.com/cypress-io/github-action#start-server) proporciona un script npm que inicia el servidor y [wait-on](https://github.com/cypress-io/github-action#wait-on) dice que antes de que se ejecuten las pruebas, el servidor debería haberse iniciado en la url <http://localhost:5000>.

Una vez que estés seguro de que la canalización funciona, escribe otra prueba que asegure que uno puede navegar desde la página principal a la página de un Pokémon en particular, por ejemplo, <i>ivysaur</i>. No es necesario que la prueba sea compleja, solo verifique que cuando navegue por un enlace, la página tenga algún contenido correcto, como la cadena <i>chlorophyll</i> en el caso de <i>ivysaur</i>.

**Tenga en cuenta** que no debe probar <i>bulbasaur</i>, por alguna razón la página de ese Pokémon en particular no funciona correctamente...

El resultado final debería ser algo como esto

![E2e tests](../../images/11/9.png) 

Las pruebas de extremo a extremo son agradables ya que nos dan la confianza de que el software funciona desde la perspectiva del usuario final. El precio que tenemos que pagar es el tiempo de respuesta más lento. Ahora, ejecutar todo el flujo de trabajo lleva mucho más tiempo.

</div>
