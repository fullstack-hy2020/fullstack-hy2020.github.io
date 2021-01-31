---
mainImage: ../../../images/part-11.svg
part: 11
letter: a
lang: en
---

<div class="content">

Durante esta parte, construirás un robusto canal de implementación a un [proyecto de ejemplo](https://github.com/smartlyio/full-stack-open-pokedex) listo para usar a partir del [ejercicio 11.2] (/en/part11/Getting_started_with_git_hub_actions#exercise-11-2). Tendrás que hacer [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) al proyecto de ejemplo y eso te creará una copia personal del repositorio. En los [dos últimos](/es​​/part11/expansion_further#ejercicios-11-20-22)ejercicios creará otro canal de implementación para algunas de <i>sus</i> aplicaciones creadas anteriormente.

Hay 22 ejercicios en esta parte, y debe completar <i>cada</i> ejercicio para completar el curso. Los ejercicios se envían a través del [sistema de presentaciones](https://studies.cs.helsinki.fi/stats/courses/fs-cicd) al igual que en las partes anteriores, pero a diferencia de las partes 0 a 9, la presentación va a una "instancia de curso".

Esta parte se basará en muchos conceptos cubiertos en las partes anteriores del curso. Se recomienda que termine al menos las partes 0 a 5 antes de comenzar esta parte.

A diferencia de las otras partes de este curso, no escribe muchas líneas de código en esta parte, se trata mucho más de configuración. La depuración del código puede ser difícil, pero la depuración de configuraciones es mucho más difícil, por lo que en esta parte, ¡necesita mucha paciencia y disciplina!

### Llevando el software a producción

Escribir software está muy bien, pero nada existe en el vacío. Eventualmente, necesitaremos implementar el software en producción, es decir, entregárselo a los usuarios reales. Después de eso, necesitamos mantenerlo, lanzar nuevas versiones y trabajar con otras personas para expandir ese software.

Ya usamos GitHub para almacenar nuestro código fuente, pero ¿qué sucede cuando trabajamos en un equipo con más desarrolladores?

Pueden surgir muchos problemas cuando participan varios desarrolladores. El software puede funcionar bien en <i>mi computadora</i>, pero quizás algunos de los otros desarrolladores estén usando un sistema operativo diferente o versiones de biblioteca diferentes. No es raro que un código funcione bien en la máquina de un desarrollador, pero otro desarrollador ni siquiera puede comenzar. Esto a menudo se denomina "funciona en mi máquina".

También hay problemas más complicados. Si dos desarrolladores están trabajando en cambios y no han decidido la forma de implementarlos en producción, ¿de quiénes son los cambios que se implementan? ¿Cómo sería posible evitar que los cambios de un desarrollador sobrescribieran los de otro?

En esta parte, cubriremos formas de trabajar juntos y construir e implementar software de una manera estrictamente definida para que quede claro <i>exactamente</i> lo que sucederá bajo cualquier circunstancia.

### Algunos términos útiles

En esta parte usaremos algunos términos con los que puede que no esté familiarizado o que no entienda bien. Analizaremos algunos de estos términos aquí. Incluso si está familiarizado con los términos, lea esta sección para que cuando usemos los términos en esta parte, estemos en la misma página.

Git permite que coexistan múltiples copias, transmisiones o versiones del código sin sobrescribirse entre sí. Cuando crea un repositorio por primera vez, verá la rama principal (generalmente en git, lo llamamos <i>master</i> o <i>main</i>, pero eso varía en proyectos más antiguos). Esto está bien si solo hay un desarrollador para un proyecto y ese desarrollador solo trabaja en una función a la vez.

Las ramas son útiles cuando este entorno se vuelve más complejo. En este contexto, cada desarrollador puede tener una o más ramas. Cada rama es efectivamente una copia de la rama principal con algunos cambios que la hacen divergir de la principal. Una vez que la característica o el cambio en la rama está listo, se puede <i>fusionar</i> de nuevo en la rama principal, convirtiendo efectivamente esa característica o cambio en parte del software principal. De esta manera, cada desarrollador puede trabajar en su propio conjunto de cambios y no afectar a ningún otro desarrollador hasta que los cambios estén listos.

Pero una vez que un desarrollador ha fusionado sus cambios en la rama principal, ¿qué sucede con las ramas de los otros desarrolladores? Ahora se desvían de una copia anterior de la rama principal. ¿Cómo sabrá el desarrollador de la rama posterior si sus cambios son compatibles con el estado actual de la rama principal? Esa es una de las preguntas fundamentales que intentaremos responder en esta parte.

Puede leer más sobre las ramas, por ejemplo, desde [aquí](https://www.atlassian.com/git/tutorials/using-branches).

#### Pull Request

En GitHub, la fusión de una rama de regreso a la rama principal del software ocurre con bastante frecuencia mediante un mecanismo llamado [pull request (solicitud de extracción)](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-request/about-pull-orders), donde el desarrollador que ha realizado algunos cambios solicita que los cambios se fusionen con la rama principal. Una vez que se realiza o <i>abre</i> la pull request, o PR como se le llama a menudo, otro desarrollador verifica que todo esté bien y <i>fusiona</i> el PR.

Si ha propuesto cambios en el material de este curso, ¡ya ha realizado una pull request!

#### Construir

El término "construir" tiene diferentes significados en diferentes idiomas. En algunos lenguajes interpretados como Python o Ruby, en realidad no es necesario realizar ningún paso de compilación.

En general, cuando hablamos de compilación, nos referimos a preparar el software para que se ejecute en la plataforma en la que debe ejecutarse. Esto podría significar, por ejemplo, que si ha escrito su aplicación en TypeScript y tiene la intención de ejecutarla en Node, entonces el paso de compilación podría ser transpilar TypeScript en JavaScript.

Este paso es mucho más complicado (y obligatorio) en lenguajes compilados como C y Rust, donde el código debe compilarse en un ejecutable.

En [parte 7](/en/part7/webpack) echamos un vistazo a [webpack](https://webpack.js.org/) que es la herramienta de facto actual para construir una versión de producción de React o cualquier otra base de código JavaScript o TypeScript de frontend.

#### Implementar

La implementación se refiere a colocar el software donde debe estar para que el usuario final lo use. En el caso de las bibliotecas, esto puede significar simplemente enviar un paquete npm a un archivo de paquetes (como npmjs.com) donde otros usuarios pueden encontrarlo e incluirlo en su software.

La implementación de un servicio (como una aplicación web) puede variar en complejidad. En la [parte 3](/en/part3/deploying_app_to_internet), nuestro flujo de trabajo de implementación implicó ejecutar algunos scripts manualmente y enviar el código del repositorio al servicio de alojamiento [Heroku](https://www.heroku.com/).

En esta parte, desarrollaremos un "canal de implementación" simple que implementa cada confirmación de su código automáticamente en Heroku <i>si</i> el código comprometido no rompe nada.

Las implementaciones pueden ser significativamente más complejas, especialmente si agregamos requisitos como "el software debe estar disponible en todo momento durante la implementación" (implementaciones sin tiempo de inactividad) o si tenemos que tener en cuenta cosas como migraciones de bases de datos. No cubriremos implementaciones complejas como las de esta parte, pero es importante saber que existen.

### ¿Qué es CI?

La definición estricta de CI (Integración Continua) y la forma en que se usa el término en la industria son bastante diferentes. Un debate influyente pero bastante temprano (del año 2006) sobre el tema se encuentra en [el blog de Martin Fowler](https://www.martinfowler.com/articles/continuousIntegration.html).

Estrictamente hablando, CI se refiere a menudo a <a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>fusionar los cambios del desarrollador con la rama principal</a>, Wikipedia incluso sugiere de manera útil: "varias veces al día". Esto suele ser cierto, pero cuando nos referimos a la CI en la industria, normalmente hablamos de lo que sucede después de que ocurre la fusión real.

Es probable que queramos seguir algunos de estos pasos:

- Lint: para mantener nuestro código limpio y fácil de mantener
- Compilar: poner todo nuestro código junto en el software
- Probar: para asegurarnos de no romper las características existentes
- Paquete: Ponlo todos juntos en un lote que se puede mover fácilmente
- Cargar/implementar: ponerlo a disposición del mundo

Discutiremos cada uno de estos pasos (y cuando sean adecuados) con más detalle más adelante. Lo que es importante recordar es que este proceso debe definirse estrictamente.

Por lo general, las definiciones estrictas actúan como una restricción a la velocidad de creatividad/desarrollo. Sin embargo, esto generalmente no debería ser cierto para la CI. Este rigor debe establecerse de tal manera que permita un desarrollo más fácil y el trabajo conjunto. El uso de un buen sistema de CI (como las acciones de GitHub que cubriremos en esta parte) nos permitirá hacer todo esto automáticamente.

### Empaquetado e implementación como parte de CI

Puede que valga la pena señalar que el empaquetado y especialmente la implementación a veces no se consideran incluidos en el ámbito de la CI. Los agregaremos aquí porque en el mundo real tiene sentido agruparlos todos. Esto se debe en parte a que tienen sentido en el contexto del flujo y la canalización (quiero hacer llegar mi código a los usuarios) y en parte porque estos son, de hecho, el punto de falla más probable.

El empaque es a menudo un área donde surgen problemas en CI, ya que esto no es algo que generalmente se prueba localmente. Tiene sentido probar el paquete de un proyecto durante el flujo de trabajo de CI incluso si no hacemos nada con el paquete resultante. Con algunos flujos de trabajo, es posible que incluso estemos probando los paquetes ya construidos. Esto nos asegura que hemos probado el código de la misma forma que lo que se implementará en producción.

¿Qué pasa con el despliegue entonces? Hablaremos extensamente sobre la coherencia y la repetibilidad en las próximas secciones, pero mencionaremos aquí que queremos un proceso que siempre se vea igual, ya sea que estemos ejecutando pruebas en una rama de desarrollo o en el master. De hecho, el proceso puede <i>literalmente</i> ser el mismo con solo una verificación al final para determinar si estamos en la rama master y necesitamos hacer una implementación. En este contexto, tiene sentido incluir la implementación en el proceso de CI, ya que lo mantendremos al mismo tiempo que trabajamos en CI.

#### ¿Está relacionado esto con el CD?

Los términos <i>Continuous Delivery</i> y <i>Continuous Deployment</i> (ambos con el acrónimo CD) se usan a menudo cuando se habla de CI que también se ocupa de las implementaciones. No lo aburriremos con la definición exacta (puede usar, por ejemplo, [Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery) u [Otra publicación del blog de Martin Fowler](https://martinfowler.com/bliki/ContinuousDelivery.html)) pero, en general, nos referimos al CD como la práctica en la que la rama maestra se mantiene desplegable en todo momento. En general, esto también se combina con frecuencia con implementaciones automatizadas desencadenadas por fusiones en la rama principal/base.

¿Qué pasa con el área turbia entre CI y CD? Si, por ejemplo, tenemos pruebas que deben ejecutarse antes de que cualquier código nuevo pueda fusionarse con el maestro, ¿es este CI porque hacemos fusiones frecuentes con el maestro, o es un CD porque nos aseguramos de que el maestro siempre se pueda implementar?

Por lo tanto, algunos conceptos cruzan con frecuencia la línea entre CI y CD y, como discutimos anteriormente, la implementación a veces tiene sentido para considerar CD como parte de CI. Es por eso que a menudo verá referencias a CI/CD para describir todo el proceso. Usaremos los términos "CI" y "CI/CD" indistintamente en esta parte.

### ¿Por qué es importante?

Anteriormente hablamos sobre el problema de "funciona en mi máquina" y la implementación de múltiples cambios, pero ¿qué pasa con otros problemas? ¿Y si Alice hiciera un commit directamente con el master? ¿Qué pasa si Bob usa una rama pero no se molesta en ejecutar pruebas antes de fusionarse? ¿Qué pasa si Charlie intenta construir el software para producción pero lo hace con los parámetros incorrectos?

Con el uso de la integración continua y formas sistemáticas de trabajo, podemos evitarlos.

- Podemos rechazar las commits directamente al master
- Podemos hacer que nuestro proceso de CI se ejecute en todas las Pull Request (PR) contra el master y permitir fusiones solo cuando se cumplan nuestras condiciones deseadas, por ejemplo, las pruebas pasan
- Podemos construir nuestros paquetes para producción en el entorno conocido del sistema CI

Existen otras ventajas de ampliar esta configuración:

- Si usamos CD con implementación cada vez que hay una fusión para master, entonces sabemos que master siempre se está ejecutando en producción
- Si solo permitimos fusiones cuando la rama tiene un master actualizado, entonces podemos estar seguros de que diferentes desarrolladores no sobrescriban los cambios de los demás.

Tenga en cuenta que en esta parte asumimos que la rama <i>master</i> o <i>main</i> contiene el código que se está ejecutando en producción. Los numerosos [flujos de trabajo](https://www.atlassian.com/git/tutorials/comparing-workflows) diferentes que se pueden usar con git, por ejemplo, en algunos casos, puede ser una <i>rama de lanzamiento</i> específica que contiene el código que se ejecuta en producción.

### Principios importantes

Es importante recordar que CI/CD no es el objetivo. El objetivo es un desarrollo de software mejor y más rápido con menos errores evitables y una mejor cooperación en equipo.

Con ese fin, CI siempre debe configurarse para la tarea en cuestión y el proyecto en sí. El objetivo final debe tenerse en cuenta en todo momento. Puede pensar en CI como la respuesta a estas preguntas:

- ¿Cómo asegurarse de que las pruebas se ejecuten en todo el código que se implementará?
- ¿Cómo asegurarse de que la rama master se pueda implementar en todo momento?
- ¿Cómo garantizar que las compilaciones sean coherentes y que siempre funcionen en la plataforma en la que se implementarán?
- ¿Cómo asegurarse de que los cambios no se sobrescriban entre sí?
- ¿Cómo hacer que las implementaciones sucedan con el clic de un botón o automáticamente cuando uno se fusiona con el master?

Incluso existe evidencia científica sobre los numerosos beneficios que tiene el uso de CI/CD. Según un gran estudio publicado en el libro [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://itrevolution.com/book/accelerate/), el uso de CI/CD correlaciona fuertemente con el éxito de la organización (por ejemplo, mejora la rentabilidad y la calidad del producto, aumenta la participación de mercado, acorta el tiempo de comercialización). CI/CD incluso hace más felices a los desarrolladores al reducir su tasa de desgaste. Los resultados resumidos en el libro también se informan en artículos científicos como [este](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2681909).

#### Comportamiento documentado

Hay una vieja broma de que un error es solo una "característica indocumentada". Nos gustaría evitar eso. Nos gustaría evitar situaciones en las que no conocemos el resultado exacto. Por ejemplo, si dependemos de una etiqueta en un PR para definir si algo es un lanzamiento "mayor", "menor" o "parche" (cubriremos el significado de esos términos más adelante), entonces es importante que sepamos qué sucede si un desarrollador se olvida de poner una etiqueta en su PR. ¿Qué pasa si le ponen una etiqueta después de que ha comenzado el proceso de construcción/prueba? ¿Qué sucede si el desarrollador cambia la etiqueta a mitad de camino, cuál es la que realmente lanza?

Es posible cubrir todos los casos en los que pueda pensar y aún tener lagunas en las que el desarrollador hará algo "creativo" en lo que no pensó, por lo que es importante que el proceso falle de forma segura en este caso.

Por ejemplo, si tenemos el caso mencionado anteriormente donde la etiqueta cambia a mitad de la construcción. Si no pensamos en esto de antemano, sería mejor fallar la compilación y alertar al usuario si sucedió algo que no esperábamos. La alternativa, en la que implementamos el tipo de versión incorrecto de todos modos, podría resultar en problemas mayores, por lo que fallar y notificar al desarrollador es la forma más segura de salir de esta situación.

#### Sepa que sucede lo mismo cada vez.

Podríamos tener las mejores pruebas imaginables para nuestro software, pruebas que detectan todos los problemas posibles. Eso es genial, pero son inútiles si no los ejecutamos en el código antes de implementarlo.

Necesitamos garantizar que las pruebas se ejecutarán y debemos asegurarnos de que se ejecuten en el código que realmente se implementará. Por ejemplo, no sirve de nada si las pruebas <i>solo</i> se ejecutan contra la rama de Alice si fallan después de fusionarse con master. Estamos implementando desde el master, por lo que debemos asegurarnos de que las pruebas se ejecuten en una copia del master con los cambios de Alice combinados.

Esto nos lleva a un concepto crítico. Necesitamos asegurarnos de que suceda lo mismo cada vez. O más bien, que todas las tareas requeridas se realicen y en el orden correcto.

#### Código siempre disponible

Tener un código que siempre se puede implementar (y es posible que lo sea) hace la vida más fácil. Esto es especialmente cierto cuando la rama master contiene el código que se ejecuta en el entorno de producción. Por ejemplo, si se encuentra un error y es necesario corregirlo, puede extraer una copia del master (sabiendo que es el código que se está ejecutando en producción), corregir el error y realizar una pull request de regreso al master. Esto es relativamente sencillo.

Si, por otro lado, master y producción son muy diferentes y master no se puede implementar, entonces tendría que averiguar qué código <i>está</i> ejecutándose en producción, extraer una copia de eso, corregir el error, encuentre una manera de rechazarlo, luego descubra cómo implementar ese commit en específico. Eso no es genial y tendría que ser un flujo de trabajo completamente diferente al de una implementación normal.

#### Saber qué código se implementa (sha sum/versión)

A menudo es importante saber qué se está ejecutando realmente en producción. Idealmente, como comentamos anteriormente, tendríamos master funcionando en producción. Esto no siempre es posible. A veces pretendemos tener master en producción pero falla una compilación, a veces agrupamos varios cambios y queremos implementarlos todos a la vez.

Lo que necesitamos en estos casos (y es una buena idea en general) es saber exactamente <i>qué código se está ejecutando en producción</i>. A veces, esto se puede hacer con un número de versión, a veces es útil tener la suma SHA de confirmación (hash de identificación única de esa confirmación en particular en git) adjunta al código. Hablaremos más sobre el control de versiones [un poco más adelante en esta parte](/en/part11/keep_green#versioning).

Es incluso más útil si combinamos la información de la versión con un historial de todas las versiones. Si, por ejemplo, descubrimos que una confirmación en particular ha introducido un error, podemos averiguar exactamente cuándo se publicó y cuántos usuarios se vieron afectados. Esto es especialmente útil cuando ese error ha escrito datos incorrectos en la base de datos. Ahora podríamos rastrear dónde fueron esos datos erróneos en función del tiempo.

### Tipos de configuración de CI

Para cumplir con algunos de los requisitos enumerados anteriormente, queremos dedicar un servidor separado para ejecutar las tareas en integración continua. Tener un servidor separado para este propósito minimiza el riesgo de que algo más interfiera con el proceso de CI/CD y haga que sea impredecible.

Hay dos opciones: alojar nuestro propio servidor o utilizar un servicio en la nube.

#### Jenkins (y otras configuraciones autohospedadas)

Entre las opciones autohospedadas, [Jenkins](https://www.jenkins.io/) es la más popular. Es extremadamente flexible y
hay complementos para casi cualquier cosa (excepto una cosa que desea hacer). Esta es una gran opción para muchas aplicaciones, usar una configuración autohospedada significa que todo el entorno está bajo su control, la cantidad de recursos se puede controlar, secretos (explicaremos un poco más sobre seguridad en secciones posteriores de esta parte ) nunca están expuestos a nadie más y puedes hacer lo que quieras en el hardware.

Desafortunadamente, hay una desventaja. Jenkins es bastante complicado de configurar. Es muy flexible, pero eso significa que a menudo hay un poco de código repetitivo/plantilla involucrado para que las compilaciones funcionen. Con Jenkins específicamente, también significa que CI/CD debe configurarse con el lenguaje específico de dominio propio de Jenkins. También existen riesgos de fallas de hardware que pueden ser un problema si la configuración se usa mucho.

Con las opciones de alojamiento propio, la facturación generalmente se basa en el hardware. Pagas por el servidor. Lo que haces en el servidor no cambia la facturación.

#### Acciones de GitHub y otras soluciones basadas en la nube

En una configuración alojada en la nube, la configuración del entorno no es algo de lo que deba preocuparse. Está ahí, todo lo que necesita hacer es decirle qué hacer. Hacer eso generalmente implica poner un archivo en su repositorio y luego decirle al sistema de CI que lea el archivo (o que verifique su repositorio para ese archivo en particular).

La configuración de CI real para las opciones basadas en la nube suele ser un poco más simple, al menos si se mantiene dentro de lo que se considera un uso "normal". Si desea hacer algo un poco más especial, las opciones basadas en la nube pueden volverse más limitadas, o puede que le resulte difícil realizar una tarea específica para la que la plataforma en la nube no está diseñada.

En esta parte, veremos un caso de uso bastante normal. Las configuraciones más complicadas pueden, por ejemplo, hacer uso de recursos de hardware específicos, por ejemplo, una GPU.

Aparte del problema de configuración mencionado anteriormente, a menudo existen limitaciones de recursos en las plataformas basadas en la nube. En una configuración autohospedada, si una compilación es lenta, puede obtener un servidor más grande y ofrecerle más recursos. En las opciones basadas en la nube, esto puede no ser posible. Por ejemplo, en [GitHub Actions](https://github.com/features/actions), los nodos en los que se ejecutarán tus compilaciones tienen 2 vCPU y 8 GB de RAM.

Las opciones basadas en la nube también se facturan generalmente por tiempo de compilación, que es algo a considerar.

#### ¿Por qué elegir uno sobre el otro?

En general, si tiene un proyecto de software pequeño o mediano que no tiene requisitos especiales (por ejemplo, la necesidad de una tarjeta gráfica para ejecutar pruebas), probablemente lo mejor sea una solución basada en la nube. La configuración es simple y no necesita tomarse la molestia o el gasto de configurar su propio sistema. Especialmente para proyectos más pequeños, esto debería ser más barato.

Para proyectos más grandes donde se necesitan más recursos o en empresas más grandes donde hay varios equipos y proyectos para aprovecharlo, una configuración de CI autohospedado es probablemente el camino a seguir.

#### Por qué utilizar GiHub Acctions para este curso

Para este curso, usaremos [GitHub Actions](https://github.com/features/actions). Es una elección obvia ya que de todos modos estamos usando GitHub. Podemos conseguir una solución de CI robusta que funcione de inmediato sin la molestia de instalar un servidor o configurar un servicio de terceros basado en la nube.

Además de que es fácil de usar, GitHub Actions es una buena opción desde otros aspectos. Podría ser la mejor solución basada en la nube en este momento. Ha ganado mucha popularidad desde su lanzamiento inicial en noviembre de 2019.

</div>

<div class="tasks">

### Ejercicio 11.1

Antes de ensuciarnos las manos con la configuración de la canalización de CI/CD, reflexionemos un poco sobre lo que hemos leído.

#### 11.1 calentamiento

Piense en una situación hipotética en la que un equipo de unas 6 personas está trabajando en una aplicación. La aplicación está en desarrollo activo y se lanzará pronto.

Supongamos que la aplicación está codificada con algún otro lenguaje que no sea JavaScript/TypeScript, por ejemplo, en Python, Java o Ruby. Puede elegir libremente el idioma. Incluso podría ser un idioma que usted no conoce mucho.

Escriba un texto breve, de 200 a 300 palabras, donde responda o discuta algunos de los puntos siguientes. Puede verificar la longitud con https://wordcounter.net/. Guarde su respuesta en el archivo llamado <i>exercise1.md</i> en la raíz del repositorio que creará en el [ejercicio 11.2](/es​​/part11/Getting_started_with_git_hub_actions#exercise-11-2).

Los puntos a discutir:

- Algunos pasos comunes en una configuración de CI incluyen <i>linting</i>, <i>testing</i> y <i>building</i>. ¿Cuáles son las herramientas específicas para cuidar estos pasos en el ecosistema del idioma que eligió? Puede buscar las respuestas por google.
- ¿Qué alternativas existen para configurar el CI además de las acciones de Jenkins y GitHub que mencionamos en esta sección?
- ¿Esta configuración sería mejor en un entorno autohospedado o basado en la nube? ¿Por qué? ¿Qué información necesitaría para tomar esa decisión?

¡Recuerde que no hay respuestas 'correctas' a lo anterior!

** Una cosa más:** en el ejercicio [11-19](/es​​/part11/expansion_further#ejercicio-11-19) necesitará una <i>URL de webhook de Slack</i>. Es mejor preguntar de inmediato por correo electrónico matti.luukkainen@helsinki.fi o, por supuesto, [Telegram](https://t.me/fullstackcourse), ping @mluukkai

</div>
