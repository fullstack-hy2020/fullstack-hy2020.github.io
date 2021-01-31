---
mainImage: ../../../images/part-11.svg
part: 11
letter: e
lang: es
---

<div class="content">

Esta parte se ha centrado en construir un Sistema de CI eficaz y robusto que ayuda a los desarrolladores a trabajar juntos, mantener la calidad del código e implementar de forma segura. ¿Qué más podría uno querer? En el mundo real, hay más dedos en el pastel que solo desarrolladores y usuarios. Incluso si eso no fuera cierto, incluso para los desarrolladores, se puede obtener mucho más valor de los sistemas de CI que solo las cosas anteriores.

### Visibilidad y comprensión

En todas las empresas, excepto en las más pequeñas, las decisiones sobre qué desarrollar no las toman exclusivamente los desarrolladores. El término 'parte interesada' se usa a menudo para referirse a personas, tanto dentro como fuera del equipo de desarrollo, que pueden tener algún interés en vigilar el progreso del desarrollo. Con este fin, a menudo hay integraciones entre git y cualquier software de gestión de proyectos/seguimiento de errores que esté usando el equipo.

Un uso común de esto es tener alguna referencia al sistema de seguimiento en las pull request o commits de git. De esta manera, por ejemplo, cuando esté trabajando en el problema número 123, puede nombrar su pull request <code>BUG-123: Fix user copy issue</code> y el sistema de seguimiento de errores notaría la primera parte del PR. nombre y mueva automáticamente el problema a <code>Done</code> cuando se fusiona el PR.

### Notificaciones

Cuando el proceso de CI finaliza rápidamente, puede ser conveniente simplemente observar cómo se ejecuta y esperar el resultado. A medida que los proyectos se vuelven más complejos, también lo hace el proceso de creación y prueba del código. Esto puede llevar rápidamente a una situación en la que se tarda lo suficiente en generar el resultado de la compilación, por lo que un desarrollador puede querer comenzar a trabajar en otra tarea. Esto a su vez conduce a una construcción olvidada.

Esto es especialmente problemático si hablamos de fusionar PR que pueden afectar el trabajo de otro desarrollador, causando problemas o retrasos para ellos. Esto también puede llevar a una situación en la que crea que ha implementado algo pero en realidad no ha terminado una implementación, esto puede generar una mala comunicación con los compañeros de equipo y los clientes (por ejemplo, "Continúe e inténtelo de nuevo, el error debe corregirse").

Hay varias soluciones a este problema que van desde notificaciones simples hasta procesos más complicados que simplemente fusionan el código de paso si se cumplen ciertas condiciones. Vamos a discutir las notificaciones como una solución simple, ya que es la que menos interfiere con el flujo de trabajo del equipo.

De forma predeterminada, GitHub Actions envía un correo electrónico en caso de falla de compilación. Esto se puede cambiar para enviar notificaciones independientemente del estado de la compilación y también se puede configurar para que le avise en la interfaz web de GitHub. Excelente. Pero, ¿y si queremos más? ¿Qué pasa si por alguna razón esto no funciona para nuestro caso de uso?

Hay integraciones, por ejemplo, para varias aplicaciones de mensajería como [Slack](https://slack.com/intl/en-fi/), para enviar notificaciones. Estas integraciones aún deciden qué enviar y cuándo enviarlo según la lógica de GitHub.

</div>

<div class="tasks">

### Ejercicio 11.19

Hemos configurado un canal de Slack <i>fullstackopengroup.slack.com</i> para probar una integración de mensajería. Únase al canal haciendo clic [aquí](https://join.slack.com/t/fullstackopengroup/shared_invite/zt-jy0669dd-41WHtYNO6WwBujp4djgJTA). Desafortunadamente, necesita una dirección de correo electrónico para registrarse. Si no está dispuesto a utilizar el suyo, puede utilizar un correo electrónico temporal para los fines. Hay muchas opciones como <https://tempmail.ninja/>.

Tenga en cuenta que necesita la URL del webhook de Slack para realizar este ejercicio. Si aún no lo tiene, solicítelo por correo electrónico matti.luukkainen@helsinki.fi o en el [Telegram](https://t.me/fullstackcourse) del curso, haga ping a @mluukkai

<i>También puede usar algún otro Slack canal en este ejercicio, pero luego
estará solo con la configuración.</i>

#### 11.19 Acción de notificación de éxito/falla de la compilación

Puede encontrar docenas de acciones de terceros en [GitHub Action Marketplace](https://github.com/marketplace?type=actions) utilizando la frase de búsqueda [slack](https://github.com/marketplace?type=actions&query=slack). Elija uno para este ejercicio. Mi elección fue [action-slack](https://github.com/marketplace/actions/action-slack) ya que tiene bastantes inicios y una documentación decente.

Configure la acción para que brinde dos tipos de notificaciones:

- Una indicación de éxito si se implementa una nueva versión
- Una indicación de error si falla una compilación

En el caso de un error, la notificación debe ser un poco más detallada para ayudar a los desarrolladores a encontrar rápidamente cuál fue el error y cuál es el commit que lo causó.

Consulte [aquí](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions ) ¡cómo comprobar el estado del trabajo!

Sus notificaciones pueden tener el siguiente aspecto:

![Releases](../../images/11/20a.png)

</div>

<div class="content">

### Métricas

En la sección anterior, mencionamos que a medida que los proyectos se vuelven más complicados, también lo hacen sus compilaciones y aumenta la duración de las compilaciones. Obviamente, eso no es lo ideal: cuanto más largo sea el ciclo de retroalimentación, más lento será el desarrollo.

Si bien hay cosas que se pueden hacer sobre este aumento en los tiempos de construcción, es útil tener una mejor vista de la imagen. Es útil saber cuánto tiempo tomó una compilación hace unos meses en comparación con cuánto tiempo lleva ahora. ¿Fue la progresión lineal o saltó de repente? Saber qué causó el aumento en el tiempo de construcción puede ser muy útil para ayudar a resolverlo. Si el tiempo de construcción aumentó linealmente de 5 minutos a 10 durante el último año, tal vez podamos esperar que demore unos meses más en llegar a 15 minutos y tengamos una idea del valor que tiene dedicar tiempo a acelerar el proceso de CI .

Las métricas pueden ser autoinformadas (también llamadas métricas 'push', donde cada compilación informa cuánto tiempo tomó) o los datos se pueden obtener de la API posteriormente (a veces llamadas métricas 'pull'). El riesgo de la autoevaluación es que la autoevaluación en sí lleva tiempo y puede tener un impacto significativo en el "tiempo total necesario para todas las construcciones".

Estos datos pueden enviarse a una base de datos de series de tiempo o a un archivo de otro tipo. Hay muchos servicios en la nube donde puede agregar fácilmente las métricas, una buena opción es [Datadog](https://www.datadoghq.com/).

### Tareas periódicas

A menudo, hay tareas periódicas que deben realizarse en un equipo de desarrollo de software. Algunos de estos pueden automatizarse con herramientas comúnmente disponibles y algunos necesitará automatizarlos usted mismo.

La primera categoría incluye cosas como comprobar los paquetes en busca de vulnerabilidades de seguridad. Varias herramientas ya pueden hacer esto por usted. Algunas de estas herramientas incluso serían gratuitas para ciertos tipos de proyectos (por ejemplo, de código abierto). GitHub proporciona una de esas herramientas, [Dependabot](https://dependabot.com/).

Un consejo para tener en cuenta: si su presupuesto lo permite, casi siempre es mejor utilizar una herramienta que ya haga el trabajo que desarrollar su propia solución. Si la seguridad no es la industria que busca, por ejemplo, use Dependabot para buscar vulnerabilidades de seguridad en lugar de crear su propia herramienta.

¿Qué pasa con las tareas que no tienen una herramienta? También puede automatizarlos usted mismo con GitHub Actions. Las acciones de GitHub proporcionan un disparador programado que se puede usar para ejecutar una tarea en un momento determinado.

</div>

<div class="tasks">

### Ejercicios 11.20-11.22

#### 11.20 Comprobación de estado periódica

Ahora estamos bastante seguros de que nuestra canalización evita que se implemente código incorrecto. Sin embargo, existen muchas fuentes de errores. Si nuestra aplicación dependiera, por ejemplo, de una base de datos que, por algún motivo, no estuviera disponible, lo más probable es que nuestra aplicación se bloquee. Es por eso que sería una buena idea configurar <i>una verificación de estado periódica</i> que regularmente haga una solicitud HTTP GET a nuestro servidor. A menudo nos referimos a este tipo de solicitud como <i>ping</i>.

Es posible [programar](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events) acciones de GitHub para que sucedan de forma regular.

Use ahora la acción [url-health-check](https://github.com/marketplace/actions/url-health-check) o cualquier otra alternativa y programe un ping de verificación de estado periódico para su software implementado. Intente simular una situación en la que su aplicación falla y asegúrese de que la verificación detecte el problema. Escriba este flujo de trabajo periódico en un archivo propio.

**Tenga en cuenta** que, desafortunadamente, lleva bastante tiempo hasta que las acciones de GitHub inicien por primera vez un flujo de trabajo programado. Para mí, tomó casi una hora. Por lo tanto, podría ser una buena idea hacer que la verificación funcione primero activando el flujo de trabajo con git push. Cuando esté seguro de que la verificación funciona correctamente, cambie a un activador programado.

**Tenga en cuenta también** que una vez que esto funcione, es mejor reducir la frecuencia de ping (al máximo una vez en 24 horas) o deshabilitar la regla por completo, ya que de otra manera su control de salud puede consumir [toda sus](https://devcenter.heroku.com/articles/free-dyno-hours) horas gratuitas mensuales.

#### 11.21 Su propia canalización

Cree una canalización de CI/CD similar para algunas de sus propias aplicaciones. Algunos de los buenos candidatos son la aplicación de directorio telefónico que se creó en las partes 2 y 3 del curso, o la aplicación de blog integrada en las partes 4 y 5, o las anécdotas redux integradas en la parte 6. También puede usar alguna aplicación propia para este ejercicio.

Lo más probable es que necesite hacer una reestructuración para unir todas las piezas. Un primer paso lógico es almacenar tanto el código de interfaz como el de backend en el mismo repositorio. Esto no es un requisito, pero se recomienda, ya que simplifica mucho las cosas.

Una posible estructura del repositorio sería tener el backend en la raíz del repositorio y el frontend como subdirectorio. También puede "copiar y pegar" la estructura de la aplicación de ejemplo de esta parte o probar la [aplicación de ejemplo](https://github.com/fullstack-hy2020/create-app) mencionada en la [parte 7](/en/part7/class_components_miscellaneous#frontend-and-backend-in-the-same-repository).

Quizás sea mejor crear un nuevo repositorio para este ejercicio y simplemente copiar y pegar el código anterior allí. En la vida real, probablemente haría todo esto en el antiguo repositorio, pero ahora "un nuevo comienzo" facilita las cosas.

Este es un ejercicio largo y quizás bastante difícil, pero este tipo de situación en la que tiene un "código heredado" y necesita crear una canalización de implementación adecuada es bastante común en la vida real.

Obviamente, este ejercicio no se realiza en el mismo repositorio que los ejercicios anteriores. Dado que solo puede devolver un repositorio al sistema de envío, coloque un enlace del <i>otro</i> repositorio al que complete en el formulario de envío.

#### 11.22 Proteger al master y solicitar una pull request

Proteja la rama master del repositorio donde realizó el ejercicio anterior. Esta vez evitará también que los administradores fusionen el código sin una revisión.

Haz una pull request y pregunta a cualquiera de los usuarios de GitHub [mluukkai](https://github.com/mluukkai), [kaltsoon](https://github.com/kaltsoon) o [jakousa](https://github.com/jakousa) para revisar su código. Una vez realizada la revisión, combine su código con master.

¡Ya has terminado!

</div>

<div class="content">

### Envío de ejercicios y obtención de créditos

Los ejercicios de thisp se envían a través del [sistema de presentaciones](https://studies.cs.helsinki.fi/stats/courses/fs-cicd) al igual que en las partes anteriores, pero a diferencia de las partes 0 a 9, la presentación va a diferente "instancia de curso". ¡Recuerda que tienes que completar <i>todos los ejercicios</i> para aprobar esta parte!

Una vez que haya completado los ejercicios y desee obtener los créditos, háganos saber a través del sistema de envío de ejercicios que ha completado el curso:

![Submissions](../../images/11/21.png)

Tenga en cuenta que la nota "examen realizado en Moodle" se refiere al [examen del curso Full Stack Open](/en/part0/general_info#sign-up-for-the-exam), que debe completarse antes de que pueda obtener créditos de esta parte.

Puede descargar el certificado para completar esta parte haciendo clic en uno de los iconos de bandera. El icono de la bandera corresponde al idioma del certificado.

</div>
