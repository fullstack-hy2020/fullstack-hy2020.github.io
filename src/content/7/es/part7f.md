---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: es
---

<div class="content">

Además de los ocho ejercicios en las secciones [React router](/es/part7/react_router) y [custom hooks](/es/part7/hooks_personalizados) de esta séptima parte del material del curso, hay 13 ejercicios que continúan nuestro trabajo en la aplicación BlogList en la que trabajamos en las partes cuatro y cinco del material del curso. Algunos de los siguientes ejercicios son "funcionalidades" que son independientes entre sí, lo que significa que no es necesario terminarlos en ningún orden en particular. Eres libre de saltarte una parte de los ejercicios si lo deseas. Muchos de ellos son acerca de aplicar la técnica de gestión avanzada de estado (Redux, React Query y context) cubierta en la [parte 6](/es/part6).

Si no deseas utilizar tu propia aplicación BlogList, puedes utilizar el código de la solución modelo como punto de partida para estos ejercicios.

Muchos de los ejercicios de esta parte del material del curso requerirán la refactorización del código existente. Esta es una realidad común a la hora de extender aplicaciones existentes, lo que significa que la refactorización es una habilidad importante y necesaria incluso si a veces puede parecer difícil y desagradable.

Un buen consejo para refactorizar y escribir código nuevo es dar <i>pequeños pasos</i>. Perder la cordura está casi garantizado si dejas la aplicación en un estado completamente roto durante largos períodos de tiempo mientras refactorizas.

</div>

<div class="tasks">

### Ejercicios 7.9.-7.21.

#### 7.9: Formateo Automático de Código

En las partes anteriores, usamos ESLint para asegurarnos de que el código siga las convenciones definidas. [Prettier](https://prettier.io/) es otra forma de hacer lo mismo. Según la documentación, Prettier es <i>un formateador de código opinado</i>, es decir, Prettier no solo controla el estilo del código sino que también lo formatea de acuerdo con la definición.

Prettier es fácil de integrar en el editor de código para que cuando se guarde, se formatee automáticamente.

Integra Prettier en tu aplicación y configúralo para que funcione con tu editor.

### Administración de Estado: Redux

<i>Hay dos versiones alternativas para elegir para los ejercicios 7.10-7.13: puedes hacer la administración de estado de la aplicación utilizando Redux o React Query y Context</i>. Si deseas maximizar tu aprendizaje, ¡deberías hacer ambas versiones!

#### 7.10: Redux, Paso 1

Refactoriza la aplicación para que utilice Redux para administrar los datos de la notificación.

#### 7.11: Redux, Paso 2

_Ten en cuenta_ que este y los dos ejercicios siguientes son bastante laboriosos pero increíblemente educativos.

Almacena la información sobre publicaciones de blog en el store de Redux. En este ejercicio basta con que puedas ver los blogs en el backend y crear un nuevo blog.

Puedes administrar el estado para iniciar sesión y crear nuevas publicaciones de blog utilizando el estado interno de los componentes de React.

#### 7.12: Redux, Paso 3

Amplía tu solución para que sea posible volver a dar me gusta y eliminar un blog.

#### 7.13: Redux, Paso 4

Almacena la información sobre el usuario que inició sesión en el store de Redux.

### Administración de estado: React Query y Context

<i>Hay dos versiones alternativas para elegir para los ejercicios 7.10-7.13: puedes hacer la administración de estado de la aplicación utilizando Redux o React Query y Context</i>. Si deseas maximizar tu aprendizaje, ¡deberías hacer ambas versiones!

#### 7.10: React Query y Context, paso 1

Refactoriza la aplicación para usar el hook useReducer para administrar los datos de la notificación.

#### 7.11: React Query y Context, paso 2

Utiliza React Query para administrar el estado de las publicaciones de blog. En este ejercicio basta con que puedas ver los blogs en el backend y que puedas crear un nuevo blog.

Puedes administrar el estado para iniciar sesión y crear nuevas publicaciones de blog utilizando el estado interno de los componentes de React.

#### 7.12: React Query y Context, paso 3

Amplía tu solución para que sea posible volver a dar me gusta y eliminar un blog.

#### 7.13: React Query y Context, paso 4

Usa el hook useReducer y context para administrar los datos del usuario que inició sesión.

### Vistas

El resto de las tareas son comunes tanto para las versiones de Redux como para la de React Query

#### 7.14: Vista de usuarios

Implementa una vista en la aplicación que muestre toda la información básica relacionada con los usuarios:

![bloglist con tabla de usuarios mostrando cantidad de blogs creados](../../images/7/41.png)

#### 7.15: Vista de Usuario Individual

Implementa una vista para usuarios individuales, que muestre todas las publicaciones de blog agregadas por ese usuario:

![bloglist con tabla de usuarios mostrando blogs creados](../../images/7/44.png)

Puedes acceder a esta vista haciendo clic en el nombre del usuario en la vista que enumera a todos los usuarios:

![navegador mostrando usuarios clicables](../../images/7/43.png)

<i>**NB:**</i> es casi seguro que encontrarás el siguiente mensaje de error durante este ejercicio:

![error en el navegador: TypeError no puede leer la propiedad name de undefined](../../images/7/42ea.png)

El mensaje de error aparecerá si actualizas la página de usuario individual.

La causa del problema es que cuando navegamos directamente a la página de un usuario individual, la aplicación React aún no ha recibido los datos del backend. Una solución para este problema es utilizar la renderización condicional:

```js
const User = () => {
  const user = ...
  // highlight-start
  if (!user) {
    return null
  }
  // highlight-end

  return (
    <div>
      // ...
    </div>
  )
}
```

#### 7.16: Vista de Blog

Implementa una vista separada para las publicaciones de blog. Puedes modelar el diseño de tu vista a partir del siguiente ejemplo:

![bloglist mostrando un solo blog a través de la URL /blogs/number](../../images/7/45.png)

Los usuarios deberían poder acceder a esta vista haciendo clic en el nombre de la publicación del blog en la vista que enumera todas las publicaciones de blog.

![bloglist con lista de blogs clicables](../../images/7/46.png)

Una vez que hayas terminado con este ejercicio, la funcionalidad que se implementó en el ejercicio 5.7 ya no es necesaria. Al hacer clic en una publicación de blog, ya no es necesario expandir el elemento en la lista y mostrar los detalles de la publicación de blog.

#### 7.17: Navegación

Implementa un menú de navegación para la aplicación:

![menú de navegación de bloglist](../../images/7/47.png)

#### 7.18: Comentarios, paso 1

Implementa la funcionalidad para comentar las publicaciones de blog:

![bloglist mostrando lista de comentarios para un blog](../../images/7/48.png)

Los comentarios deben ser anónimos, lo que significa que no están asociados al usuario que dejó el comentario.

En este ejercicio basta con que el frontend muestre solo los comentarios que recibe la aplicación del backend.

Un mecanismo apropiado para agregar comentarios a una publicación de blog sería una solicitud HTTP POST al endpoint <i>api/blogs/:id/comments</i>.

#### 7.19: Comentarios, paso 2

Amplía tu aplicación para que los usuarios puedan agregar comentarios a las publicaciones de blog desde el frontend:

![bloglist mostrando comentarios agregados desde el frontend](../../images/7/49.png)

#### 7.20: Estilos, paso 1

Mejora la apariencia de tu aplicación aplicando uno de los métodos que se muestran en el material del curso.

#### 7.21: Estilos, paso 2

Puedes marcar este ejercicio como finalizado si utilizas una hora o más para darle estilos a tu aplicación.

Este fue el último ejercicio de esta parte del curso y es hora de enviar el código a GitHub y marcar todos los ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
