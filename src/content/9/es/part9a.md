---
mainImage: ../../../images/part-9.svg
part: 9
letter: a
lang: es
---

<div class="content">

[TypeScript](https://www.typescriptlang.org/) es un lenguaje de programación diseñado para el desarrollo de JavaScript a gran escala creado por Microsoft. Por ejemplo, los productos de Microsoft <i>Azure Management Portal</i> (1,2 millones de líneas de código) y <i>Visual Studio Code</i> (300 000 líneas de código) se han escrito en TypeScript. Para respaldar la creación de aplicaciones JavaScript a gran escala, TypeScript ofrece características como mejores herramientas en tiempo de desarrollo, análisis de código estático, verificación de tipos en tiempo de compilación y documentación a nivel de código.

### Principio fundamental

TypeScript es un superconjunto tipado de JavaScript y, eventualmente, es compilado en código JavaScript simple. El programador puede incluso decidir la versión del código generado, siempre que sea ECMAScript 3 o más reciente. Que Typescript sea un superconjunto de JavaScript significa que incluye todas las características de JavaScript y sus propias características adicionales. De hecho, todo el código JavaScript existente es TypeScript válido.

TypeScript consta de tres partes separadas, pero que se complementan entre sí:

- El lenguaje
- El compilador
- El servicio de lenguajes

![diagrama de componentes de typescript](../../images/9/1.png)

El <i>lenguaje</i> consta de sintaxis, palabras clave y anotaciones de tipo. La sintaxis es similar pero no igual a la sintaxis de JavaScript. De las tres partes de TypeScript, los programadores tienen el contacto más directo con el lenguaje.

El <i>compilador</i> es responsable de borrar la información de tipo (por ejemplo, eliminar la información de la declaración de tipos) y las transformaciones de código. Las transformaciones de código permiten que el código TypeScript se transpile en JavaScript ejecutable. Todo lo relacionado con los tipos se elimina en tiempo de compilación, por lo que TypeScript no es genuinamente código de tipado estático.

Tradicionalmente, <i>compilar</i> significa que el código se transforma de un formato legible por humanos a un formato legible por máquina. En TypeScript, el código fuente legible por humanos se transforma en otro código fuente legible por humanos, por lo que el término correcto en realidad sería <i>transpilar</i>. Sin embargo, compilar ha sido el término más utilizado en este contexto, por lo que continuaremos usándolo.

El compilador también realiza un análisis de código estático. Puede emitir advertencias o errores si encuentra una razón para hacerlo, y se puede configurar para realizar tareas adicionales, como combinar el código generado en un solo archivo.

El <i>servicio de lenguaje</i> recopila información de tipo del código fuente. Las herramientas de desarrollo pueden usar la información de tipo para proporcionar intellisense, sugerencias de tipo y posibles alternativas de refactorización.

### Características clave del lenguaje TypeScript

En esta sección describiremos algunas de las características clave del lenguaje TypeScript. La intención es brindarte una comprensión básica de las características clave de TypeScript para ayudarte a comprender más de lo que vendrá durante este curso.

#### Anotaciones de tipo

Las anotaciones de tipo en TypeScript son una forma ligera de registrar el <i>contrato</i> previsto de una función o variable.
En el siguiente ejemplo, hemos definido una función *birthdayGreeter* que acepta dos argumentos: uno de tipo string y otro de tipo número.
La función devolverá un string.

```js
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`;
};

const birthdayHero = "Jane User";
const age = 22;

console.log(birthdayGreeter(birthdayHero, age));
```

#### Palabras clave

Las palabras clave en TypeScript son palabras especialmente reservadas que tienen un significado teleológico designado dentro de la construcción del lenguaje. No pueden utilizarse como identificadores (nombres de variables, nombres de funciones, nombres de clases, etc.) porque forman parte de la sintaxis del lenguaje. Un intento de usar estas palabras clave resultará en un error de sintaxis o semántico. Hay alrededor de 40-50 palabras clave en TypeScript. Algunas de estas palabras clave incluyen: type, enum, interface, void, null, instanceof, etc. 
Una cosa a tener en cuenta es que TypeScript hereda todas las palabras clave reservadas de JavaScript, además de agregar algunas propias relacionadas con tipos, como interface, type, enum, etc.

#### Tipado estructural

TypeScript es un lenguaje tipado estructuralmente. En el tipado estructural, se considera que dos elementos son compatibles entre sí cuando por cada característica dentro del tipo del primer elemento, existe una característica correspondiente e idéntica dentro del tipo del segundo elemento. Se considera que dos tipos son idénticos si son compatibles entre sí.

#### Inferencia de tipos

El compilador de TypeScript puede intentar inferir la información del tipo si no se ha especificado ningún tipo. Los tipos de las variables pueden inferirse en función de su valor asignado y su uso. La inferencia de tipos tiene lugar al inicializar variables y miembros, establecer valores predeterminados de parámetros, y al determinar los tipos de retorno de funciones.

Por ejemplo, considera la función *add*

```js
const add = (a: number, b: number) => {
  /* El valor de retorno es utilizado para determinar
     el tipo de retorno de la función */
  return a + b;
}
```

El tipo del valor de retorno de la función se infiere volviendo sobre el código hasta la expresión de retorno. La expresión de retorno realiza una adición de los parámetros a y b. Podemos ver que a y b son números basados ​​en sus tipos. Por lo tanto, podemos inferir que el valor de retorno es de tipo *number*.

#### Type erasure (borrado por tipos)

TypeScript elimina todas las construcciones del sistema de tipos durante la compilación.

Entrada:

```js
let x: SomeType;
```

Salida:

```js
let x;
```

Esto significa que no queda información de tipo en el tiempo de ejecución; nada dice que alguna variable x haya sido declarada como de tipo *SomeType*.

La falta de información sobre el tipo durante el tiempo de ejecución puede resultar sorprendente para los programadores que están acostumbrados a utilizar ampliamente reflexión u otros sistemas de metadatos.

### ¿Por qué debería uno usar TypeScript?

En diferentes foros, es posible que encuentres muchos argumentos diferentes a favor o en contra de TypeScript. La verdad probablemente sea tan ambigua, ya que depende de tus necesidades y del uso de las funciones que ofrece TypeScript. De todos modos, aquí tienes algunas de nuestras razones por las que pensamos que el uso de TypeScript puede tener algunas ventajas.

En primer lugar, TypeScript ofrece <i>verificación de tipos y análisis de código estático</i>. Podemos requerir que los valores sean de cierto tipo y que el compilador advierta sobre su uso incorrecto. Esto puede reducir los errores durante el tiempo de ejecución, e incluso es posible que pueda reducir la cantidad de pruebas unitarias requeridas en un proyecto, al menos en lo que respecta a las pruebas de tipo puro.
El análisis de código estático no solo advierte sobre el uso incorrecto de tipos, sino también sobre otros errores, como escribir mal el nombre de una variable o función o intentar usar una variable más allá de su scope.

La segunda ventaja de TypeScript es que las anotaciones de tipo en el código pueden funcionar como una especie de <i>documentación a nivel de código</i>. Es fácil verificar a partir de la firma de una función qué tipo de argumentos puede consumir y qué tipo de datos devolverá. Esta forma de documentación vinculada con anotaciones de tipo siempre estará actualizada y facilita a los nuevos programadores comenzar a trabajar en un proyecto existente. También es útil al volver a trabajar en un proyecto antiguo.

Los tipos se pueden reutilizar en toda la base de código, y un cambio en una definición de tipo se reflejará automáticamente en todos los lugares donde se use el tipo. Se podría argumentar que puedes lograr una documentación de nivel de código similar con, por ejemplo, [JSDoc](https://jsdoc.app/about-getting-started.html), pero no está conectado al código tan estrechamente como los tipos de TypeScript y, por lo tanto, puede salir de sincronización más fácilmente y también es más verboso.

La tercera ventaja de TypeScript es que los IDE pueden proporcionar <i>IntelliSense más específico e inteligente</i> cuando saben exactamente qué tipos de datos estás procesando.

Todas estas características son extremadamente útiles cuando necesitas refactorizar tu código. El análisis de código estático te advierte sobre cualquier error en tu código, y el IntelliSense puede darte pistas sobre las propiedades disponibles e incluso posibles opciones de refactorización. La documentación a nivel de código te ayuda a comprender el código existente. Con la ayuda de TypeScript, también es muy fácil comenzar a usar las funciones más nuevas del lenguaje JavaScript en una etapa temprana, simplemente modificando su configuración.

### ¿Qué no corrige TypeScript?

Como se mencionó anteriormente, las anotaciones de tipo y la verificación de tipos en Typescript solo existen durante el tiempo de compilación y ya no durante el tiempo de ejecución. Incluso si el compilador no arroja ningún error, los errores durante el tiempo de ejecución aún son posibles. Estos errores durante el tiempo de ejecución son especialmente comunes cuando se manejan inputs externos, como los datos recibidos de una solicitud de red.

Por último, a continuación, enumeramos algunos problemas que muchos tienen con TypeScript, que sería bueno tener en cuenta:

#### Tipos incompletos, no válidos o faltantes en librerías externas

Al usar librerías externas, es posible que algunas tengan declaraciones de tipos faltantes o que de alguna manera no sean válidos. La mayoría de las veces, esto se debe a que la biblioteca no está escrita en TypeScript, y a que la persona que agrega las declaraciones de tipo manualmente no esté haciendo un buen trabajo con ella. En estos casos, es posible que debas definir las declaraciones de tipo tú mismo.
Sin embargo, es muy probable que alguien ya haya agregado los tipos al paquete que estás utilizando. Verifica siempre primero la página de Github [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). Probablemente sea la fuente más popular para los archivos de declaración de tipos.
De lo contrario, es posible que desees comenzar familiarizándote con la propia [documentación](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) de TypeScript con respecto a las declaraciones de tipos.

#### A veces, la inferencia de tipos necesita ayuda

La inferencia de tipos en TypeScript es bastante buena pero no del todo perfecta. A veces, puedes sentir que has declarado tus tipos perfectamente, pero el compilador aún te dice que la propiedad no existe o que este tipo de uso no está permitido. En estos casos, es posible que necesites ayudar al compilador haciendo algo como una verificación de tipo "extra". Ten cuidado con la conversión de tipos (usualmente también llamado aserción de tipos) o con las guardias de tipos: al utilizarlos, básicamente le estás dando tu palabra al compilador de que el valor <i>es</i> realmente del tipo que declaras. Es posible que desees consultar la documentación de TypeScript con respecto a las [aserciones de tipo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) y a las [guardias/estrechamiento de tipo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

#### Errores de tipo misteriosos

Los errores dados por el sistema de tipos a veces pueden ser bastante difíciles de entender, especialmente si usas tipos complejos. Como regla general, los mensajes de error de TypeScript tienen la información más útil al final del mensaje. Cuando te encuentres con mensajes largos y confusos, comienza a leerlos desde el final.

</div>
