---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: es
---

<div class="content">

Además de los ocho ejercicios de las secciones [React router](/es/part7/react_router) y [hooks personalizados](/es/part7/hooks_personalizados) de esta séptima parte del material del curso, hay 13 ejercicios que continúan nuestro trabajo sobre la aplicación BlogList en la que trabajamos en las partes cuatro y cinco del material del curso. Algunos de los siguientes ejercicios son "features" independientes entre sí, lo que significa que no es necesario terminarlos en ningún orden concreto. Eres libre de saltarte una parte de los ejercicios si así lo deseas. Bastantes de ellos tratan sobre aplicar la técnica avanzada de gestión del estado (Zustand, React Query y context) que cubrimos en la [parte 6](/es/part6).

Si no quieres usar tu propia aplicación BlogList, puedes utilizar el código de la solución modelo como punto de partida para estos ejercicios.

Muchos de los ejercicios de esta parte del material del curso requerirán refactorizar código existente. Esto es una realidad común al extender aplicaciones existentes, lo que significa que la refactorización es una habilidad importante y necesaria aunque a veces pueda resultar difícil y desagradable.

Un buen consejo tanto para refactorizar como para escribir código nuevo es avanzar a <i>pasos pequeños</i>. Perder la cordura está casi garantizado si dejas la aplicación en un estado completamente roto durante largos periodos mientras refactorizas.

</div>

<div class="tasks">

### Ejercicios 7.6.-7.18.

#### 7.6: Formateo Automático de Código

En las partes anteriores usamos ESLint para asegurarnos de que el código sigue las convenciones definidas. [Prettier](https://prettier.io/) es otra aproximación al mismo problema. Según su documentación, Prettier es <i>an opinionated code formatter</i>, es decir, no solo controla el estilo del código sino que además lo formatea de acuerdo con esa definición.

Prettier es fácil de integrar en el editor de código para que el archivo se formatee automáticamente al guardarlo.

Integra Prettier en tu aplicación y configúralo para que funcione con tu editor.

### Gestión del Estado: Zustand

<i>Hay dos versiones alternativas para elegir para los ejercicios 7.7-7.10: puedes hacer la gestión del estado de la aplicación usando Zustand o React Query y Context</i>. Si quieres maximizar tu aprendizaje, deberías hacer ambas versiones.

Nota: si completaste la parte 6 usando Redux, por supuesto puedes usar Redux en lugar de Zustand en esta serie de ejercicios.

#### 7.7: Zustand, paso 1

Refactoriza la aplicación para usar Zustand para gestionar los datos de la notificación.

#### 7.8: Zustand, paso 2

<i>Ten en cuenta</i> que este ejercicio y los dos siguientes son bastante laboriosos, pero increíblemente educativos.

Guarda la información sobre las publicaciones del blog en el store de Zustand. En este ejercicio es suficiente con que puedas ver los blogs en el backend y crear un nuevo blog.

Eres libre de gestionar el estado del inicio de sesión y la creación de nuevas publicaciones usando el estado interno de los componentes React.

#### 7.9: Zustand, paso 3

Amplía tu solución para que vuelva a ser posible dar like y eliminar un blog.

#### 7.10: Zustand, paso 4

Guarda la información sobre el usuario autenticado en el store de Zustand.

### Gestión del Estado: React Query y Context

<i>Hay dos versiones alternativas para elegir para los ejercicios 7.7-7.10: puedes hacer la gestión del estado de la aplicación usando Zustand o React Query y Context</i>. Si quieres maximizar tu aprendizaje, deberías hacer ambas versiones.

#### 7.7: React Query y Context, paso 1

Refactoriza la aplicación para usar el hook useReducer y context para gestionar los datos de la notificación.

#### 7.8: React Query y Context, paso 2

Usa React Query para gestionar el estado de las publicaciones del blog. Para este ejercicio, basta con que la aplicación muestre los blogs existentes y que la creación de un nuevo blog funcione correctamente.

Eres libre de gestionar el estado del inicio de sesión y la creación de nuevas publicaciones usando el estado interno de los componentes React.

#### 7.9: React Query y Context, paso 3

Amplía tu solución para que vuelva a ser posible dar like y eliminar un blog.

#### 7.10: React Query y Context, paso 4

Usa el hook useReducer y context para gestionar los datos del usuario autenticado.

### Vistas

El resto de tareas son comunes tanto para la versión con Zustand como para la versión con React Query.

#### 7.11: Vista de usuarios

Implementa en la aplicación una vista que muestre toda la información básica relacionada con los usuarios:

![browser blogs with users table showing blogs created](../../images/7/41.png)

#### 7.12: Vista individual de usuario

Implementa una vista para usuarios individuales que muestre todas las publicaciones de blog añadidas por ese usuario:

![browser blogs showing users added blogs](../../images/7/44.png)

Puedes acceder a esta vista haciendo clic en el nombre del usuario en la vista que enumera a todos los usuarios:

![browser blogs showing clickable users](../../images/7/43.png)

<i>**NB:**</i> es casi seguro que te encontrarás con el siguiente mensaje de error durante este ejercicio:

![browser TypeError cannot read property name of undefined](../../images/7/42ea.png)

El mensaje aparecerá si recargas la página de un usuario individual.

La causa del problema es que, cuando navegamos directamente a la página de un usuario concreto, la aplicación React todavía no ha recibido los datos del backend. Una solución a este problema es usar renderizado condicional:

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

#### 7.13: Vista de blog

Implementa una vista separada para las publicaciones de blog. Puedes modelar el diseño de tu vista a partir del siguiente ejemplo:

![browser blogs showing single blog via URL /blogs/number](../../images/7/45.png)

Los usuarios deben poder acceder a esta vista haciendo clic en el nombre de la publicación en la vista que lista todas las publicaciones.

![browser showing blogs are clickable](../../images/7/46.png)

Cuando hayas terminado este ejercicio, la funcionalidad implementada en el ejercicio 5.7 ya no será necesaria. Hacer clic en una publicación ya no tiene que expandir el elemento de la lista y mostrar sus detalles.

#### 7.14: Navegación

Implementa un menú de navegación para la aplicación:

![browser blogs navigation navigation menu](../../images/7/47.png)

#### 7.15: Comentarios, paso 1

Implementa la funcionalidad para comentar publicaciones de blog:

![browser blogs showing list of comments for a blog](../../images/7/48.png)

Los comentarios deben ser anónimos, es decir, no deben estar asociados al usuario que los dejó.

En este ejercicio, basta con que el frontend muestre los comentarios que la aplicación recibe del backend.

Un mecanismo apropiado para añadir comentarios a una publicación sería una petición HTTP POST al endpoint <i>api/blogs/:id/comments</i>.

#### 7.16: Comentarios, paso 2

Amplía tu aplicación para que los usuarios puedan añadir comentarios a las publicaciones desde el frontend:

![browser showing comments added via frontend](../../images/7/49.png)

#### 7.17: Estilos, paso 1

Mejora el aspecto de tu aplicación aplicando alguno de los métodos mostrados en el material del curso.

#### 7.18: Estilos, paso 2

Puedes marcar este ejercicio como terminado si dedicas una hora o más a dar estilo a tu aplicación.

Este fue el último ejercicio de esta parte del curso y ya es momento de subir tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
