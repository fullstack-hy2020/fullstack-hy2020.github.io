---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: es
---

<div class="content">

Además de los seis ejercicios de las secciones sobre [hooks de React](/es/part7/mas_sobre_los_hooks_de_react) de esta parte del material, hay 14 ejercicios que continúan nuestro trabajo con la aplicación BlogList de las partes cuatro y cinco. Algunos de los siguientes ejercicios son funcionalidades independientes entre sí, lo que significa que no es necesario completarlos en un orden concreto. Puedes saltarte una parte de los ejercicios si así lo deseas. Muchos de ellos consisten en aplicar las técnicas avanzadas de gestión del estado —Zustand, React Query y context— tratadas en la [parte 6](/es/part6).

Si no quieres utilizar tu propia aplicación BlogList, puedes usar el código de la solución modelo como punto de partida para estos ejercicios.

Muchos de los ejercicios de esta parte del material requerirán [refactorizar](https://es.wikipedia.org/wiki/Refactorizaci%C3%B3n) código existente. Esta es una realidad habitual al ampliar aplicaciones existentes, por lo que la refactorización es una habilidad importante y necesaria aunque a veces pueda resultar difícil y desagradable.

Un buen consejo tanto para refactorizar como para escribir código nuevo es avanzar a <i>pasos pequeños</i>. Perder la cordura está casi garantizado si dejas la aplicación en un estado completamente roto durante periodos prolongados mientras refactorizas.

**Estos ejercicios presuponen que ya has completado los ejercicios [5.24-5.28](/es/part5/react_router_librerias_de_ui#ejercicios-524–528). Si no lo has hecho, complétalos primero.**

</div>

<div class="tasks">

### Ejercicios 7.7.-7.20.

Estos ejercicios presuponen que ya has completado los ejercicios [5.24-5.28](/es/part5/react_router_librerias_de_ui#ejercicios-524–528). Si no lo has hecho, complétalos primero.

#### 7.7: Frontend y backend en el mismo repositorio

Durante el curso, el frontend y el backend de la aplicación BlogList han estado en repositorios separados. Una práctica habitual en proyectos reales consiste en colocar ambos en un único repositorio, lo que simplifica el despliegue y facilita compartir código entre ellos.

Lee la sección [Frontend y backend en el mismo repositorio](/es/part7/miscelanea#frontend-y-backend-en-el-mismo-repositorio) del material y reestructura tu aplicación en consecuencia. Coloca el código fuente del frontend y del backend en el mismo repositorio, manteniendo separados sus archivos <i>package.json</i>.

Asegúrate de que el flujo de desarrollo sigue funcionando: ejecutar <i>npm run dev</i> en el directorio del frontend debe iniciar el servidor de desarrollo de Vite con recarga en caliente, igual que antes. Comprueba también que el build de producción funciona: el backend debe poder servir el frontend compilado como sitio estático mediante un comando como <i>npm run build && npm start</i> —o scripts equivalentes que definas—.

<i>Nota:</i> si después de reorganizar el repositorio aparecen errores extraños de dependencias, la solución más segura suele ser eliminar todos los directorios <i>node_modules</i> y volver a ejecutar <i>npm install</i> desde cero en cada directorio pertinente.

#### 7.8: Límite de errores

Los errores de una aplicación React que no se capturen en ningún lugar producen una página en blanco. Esto no ofrece una buena experiencia de usuario. La solución estándar de React es el concepto de límite de errores: un componente que envuelve una parte del árbol de componentes, captura los errores de renderizado que se producen en su interior y muestra una interfaz alternativa en vez de bloquear toda la página.

Lee la sección [Límite de errores](/es/part7/miscelanea#limite-de-errores) del material. Después, añade a tu aplicación un componente de límite de errores que capture los errores de renderizado y muestre un mensaje comprensible en vez de una página en blanco.

El límite de errores debe añadirse de manera que la barra de navegación quede fuera de él. Si se produce un error de renderizado en cualquier lugar del resto de la aplicación, el límite lo captura y muestra un mensaje fácil de entender como este:

![](../../images/7/b1.png)

Puedes simular un error de renderizado lanzando temporalmente una excepción dentro de uno de tus componentes, por ejemplo:

```js
const BlogList = ({ blogs }) => {
  throw new Error('simulated error') // highlight line
  return (
    // ...
  )
}
```

#### 7.9: Rutas inexistentes

La aplicación también presenta otro tipo de error. Si el usuario intenta navegar a una ruta que no existe, como

![](../../images/7/b2.png)

o

![](../../images/7/b3.png)

el resultado es una página en blanco. Corrige el enrutamiento para que al navegar a una ruta inexistente se muestre un mensaje apropiado de «Página no encontrada». La [ruta comodín](https://reactrouter.com/start/framework/routing#splats) de React Router (<i>path="*"</i>) es la herramienta adecuada: coincide con cualquier ruta que no cubra ninguna otra. El resultado debe tener este aspecto:

![](../../images/7/b4.png)

#### 7.10: Formateo automático del código

En las partes anteriores utilizamos ESLint para garantizar que el código siguiera las convenciones definidas. [Prettier](https://prettier.io/) es otro enfoque para el mismo problema. Según la documentación, Prettier es <i>an opinionated code formatter</i>, es decir, no solo controla el estilo del código, sino que también lo formatea según su definición.

Prettier es fácil de integrar en el editor de código para que el archivo se formatee automáticamente al guardarlo.

Incorpora Prettier a tu aplicación y configúralo para que funcione con tu editor.

### Gestión del estado: Zustand

<i>Hay dos versiones alternativas entre las que elegir para los ejercicios 7.11-7.14: puedes gestionar el estado de la aplicación con Zustand o con React Query y Context</i>. Si quieres maximizar tu aprendizaje, ¡deberías hacer ambas versiones!

Nota: si completaste la parte 6 utilizando Redux, por supuesto puedes usar Redux en vez de Zustand en esta serie de ejercicios.

#### 7.11: Zustand, paso 1

Refactoriza la aplicación para utilizar Zustand en la gestión de los datos de las notificaciones.

#### 7.12: Zustand, paso 2

<i>Ten en cuenta</i> que este ejercicio y los dos siguientes son bastante laboriosos, pero increíblemente educativos.

Almacena la información de las entradas de blog en el store de Zustand. En este ejercicio basta con que puedas ver los blogs del backend y crear un nuevo blog.

Puedes gestionar el estado del inicio de sesión y de la creación de nuevas entradas de blog mediante el estado interno de los componentes de React.

#### 7.13: Zustand, paso 3

Amplía tu solución para que vuelva a ser posible dar «me gusta» a un blog y eliminarlo.

#### 7.14: Zustand, paso 4

Almacena la información del usuario que ha iniciado sesión en el store de Zustand.

### Gestión del estado: React Query y Context

<i>Hay dos versiones alternativas entre las que elegir para los ejercicios 7.11-7.14: puedes gestionar el estado de la aplicación con Zustand o con React Query y Context</i>. Si quieres maximizar tu aprendizaje, ¡deberías hacer ambas versiones!

#### 7.11: React Query y Context, paso 1

Refactoriza la aplicación para utilizar el hook useReducer y el contexto en la gestión de los datos de las notificaciones.

#### 7.12: React Query y Context, paso 2

Utiliza React Query para gestionar el estado de las entradas de blog. Para este ejercicio basta con que la aplicación muestre los blogs existentes y permita crear correctamente un nuevo blog.

Puedes gestionar el estado del inicio de sesión y de la creación de nuevas entradas de blog mediante el estado interno de los componentes de React.

#### 7.13: React Query y Context, paso 3

Amplía tu solución para que vuelva a ser posible dar «me gusta» a un blog y eliminarlo.

#### 7.14: React Query y Context, paso 4

Utiliza la Context API para gestionar los datos del usuario que ha iniciado sesión.

#### 7.15: Limpieza del código

Lo más probable es que tu aplicación contenga código que gestiona el usuario que ha iniciado sesión mediante <i>localStorage</i> en varios lugares:

```js
const userJSON = window.localStorage.getItem('loggedBlogappUser')

// ...

window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

// ...

window.localStorage.removeItem('loggedBlogappUser')
```

Extrae esta lógica a un módulo de servicio específico, <i>src/services/persistentUser.js</i>, que exporte las siguientes funciones:

```js
const getUser = () => { ... }
const saveUser = (user) => { ... }
const removeUser = () => { ... }
```

Sustituye todos los accesos directos a <i>localStorage</i> de la aplicación por llamadas a estas funciones.

Utiliza también en los formularios el hook [useField](/es/part7/mas_sobre_los_hooks_de_react) presentado anteriormente en esta parte.

El resto de las tareas son comunes a las versiones con Zustand y con React Query.

#### 7.16: Vista de usuarios

Implementa una vista en la aplicación que muestre toda la información básica relacionada con los usuarios:

![navegador con una tabla de usuarios que muestra los blogs creados](../../images/7/b5.png)

#### 7.17: Vista de un usuario

Implementa una vista para cada usuario que muestre todas las entradas de blog añadidas por él:

![navegador que muestra los blogs añadidos por un usuario](../../images/7/b6.png)

Puedes acceder a esta vista haciendo clic en el nombre del usuario en la vista que enumera todos los usuarios:

![navegador que muestra usuarios en los que se puede hacer clic](../../images/7/b7.png)


#### 7.18: Comentarios, paso 1

Implementa la funcionalidad para comentar las entradas de blog:

![navegador que muestra la lista de comentarios de un blog](../../images/7/u8.png)

Los comentarios deben ser anónimos, es decir, no deben estar asociados al usuario que los dejó.

En este ejercicio basta con que el frontend muestre los comentarios que la aplicación recibe del backend.

Un mecanismo apropiado para añadir comentarios a una entrada de blog sería una petición HTTP POST al endpoint <i>api/blogs/:id/comments</i>.

#### 7.19: Comentarios, paso 2

Amplía tu aplicación para que los usuarios puedan añadir comentarios a las entradas de blog desde el frontend:

![navegador que muestra comentarios añadidos desde el frontend](../../images/7/u9.png)

#### 7.20: Estilos

Mejora la apariencia visual de las nuevas funcionalidades de tu aplicación utilizando las técnicas tratadas en la [parte 5](/es/part5/react_router_librerias_de_ui).

Este era el último ejercicio de esta parte del curso. Es hora de subir tu código a GitHub y marcar todos los ejercicios que hayas completado en el [sistema de entrega de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
