---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: es
---

<div class="content">

Además de los ocho ejercicios en las secciones [React router](/es/part7/react_router) y [custom hooks](/es/part7/custom_hooks) de esta séptima parte del material del curso, hay 13 ejercicios que continúan nuestro trabajo en la aplicación Bloglist en la que trabajamos en las partes cuatro y cinco del material del curso. Algunos de los siguientes ejercicios son "características" que son independientes entre sí, lo que significa que no es necesario terminar los ejercicios en ningún orden en particular. Si lo desea, puede omitir una parte de los ejercicios.

Si no desea utilizar su propia aplicación Bloglist, puede utilizar el código de la solución modelo como punto de partida para estos ejercicios.

Muchos de los ejercicios de esta parte del material del curso requerirán la refactorización del código existente. Esta es una realidad común de extender las aplicaciones existentes, lo que significa que la refactorización es una habilidad importante y necesaria incluso si a veces puede parecer difícil y desagradable.

Un buen consejo para refactorizar y escribir código nuevo es dar <i>pequeños pasos</i>. Perder la cordura está casi garantizado si deja la aplicación en un estado completamente roto durante largos períodos de tiempo mientras refactoriza.

</div>

<div class="tasks">

### Ejercicios 7.9.-7.21.

#### 7.9: redux, paso 1

Refactorice la aplicación desde el uso del estado interno del componente React hasta el uso de Redux para la gestión del estado de la aplicación.

Cambie las notificaciones de la aplicación para usar Redux en este punto del conjunto de ejercicios.

#### 7.10: redux, paso 2

_Tenga en cuenta_ que este y los dos ejercicios siguientes son bastante laboriosos pero increíblemente educativos.

Almacene la información sobre publicaciones de blog en el store de Redux. En este ejercicio basta con que puedas ver los blogs en backend y crear un nuevo blog.

Puede administrar el estado para iniciar sesión y crear nuevas publicaciones de blog utilizando el estado interno de los componentes de React.

#### 7.11: redux, paso 3

Amplíe su solución para que sea posible volver a dar me gusta y eliminar un blog.

#### 7.12: redux, paso 4

Almacene la información sobre el usuario que inició sesión en el store de Redux.

#### 7.13: Vista de usuarios

Implemente una vista en la aplicación que muestre toda la información básica relacionada con los usuarios:

![](../../images/7/41.png)

#### 7.14: Vista de usuario individual

Implemente una vista para usuarios individuales, que muestre todas las publicaciones de blog agregadas por ese usuario:

![](../../images/7/44.png)

Puede acceder a la vista haciendo clic en el nombre del usuario en la vista que enumera todos los usuarios:

![](../../images/7/43.png)

<i>**NB:**</i> es casi seguro que se encontrará con el siguiente mensaje de error durante este ejercicio:

![](../../images/7/42ea.png)

El mensaje de error aparecerá si actualiza la página para un usuario individual.

La causa del problema es que cuando navegamos directamente a la página de un usuario individual, la aplicación React aún no ha recibido los datos del backend. Una solución para solucionar el problema es utilizar la representación condicional:

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

#### 7.15: Vista de blog

Implemente una vista separada para las publicaciones de blog. Puede modelar el diseño de su vista con el siguiente ejemplo:

![](../../images/7/45.png)

Los usuarios deberían poder acceder a la vista haciendo clic en el nombre de la publicación del blog en la vista que enumera todas las publicaciones del blog.

![](../../images/7/46.png)

Una vez que haya terminado con este ejercicio, la funcionalidad que se implementó en el ejercicio 5.6 ya no es necesaria. Al hacer clic en una publicación de blog, ya no es necesario expandir el elemento en la lista y mostrar los detalles de la publicación de blog.

#### 7.16: Navegación

Implemente un menú de navegación para la aplicación:

![](../../images/7/47.png)

#### 7.17: comentarios, paso 1

Implemente la funcionalidad para comentar en publicaciones de blog:

![](../../images/7/48.png)

Los comentarios deben ser anónimos, lo que significa que no están asociados al usuario que dejó el comentario.

En este ejercicio basta con que el frontend muestre solo los comentarios que recibe la aplicación del backend.

Un mecanismo apropiado para agregar comentarios a una publicación de blog sería una solicitud HTTP POST al endpoint <i>api/blogs/:id/comments</i>.

#### 7.18: comentarios, paso 2

Amplíe su aplicación para que los usuarios puedan agregar comentarios a las publicaciones del blog desde el frontend:

![](../../images/7/49.png)

#### 7.19: Estilos, paso 1

Mejore la apariencia de su aplicación aplicando uno de los métodos que se muestran en el material del curso.

#### 7.20: Estilos, paso 2

Puede marcar este ejercicio como finalizado si utiliza una hora o más para diseñar su aplicación.

#### 7.21: Comentarios del curso

¿Como lo hicimos? ¡Danos tu opinión sobre el curso en Moodle!

Este fue el último ejercicio de esta parte del curso y es hora de enviar el código a GitHub y marcar todos los ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
