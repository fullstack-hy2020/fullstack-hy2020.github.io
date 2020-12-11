---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: es
---

<div class="content">

Después de la breve introducción a los principios fundamentales de TypeScript, ahora estamos listos para comenzar nuestro viaje para convertirnos en desarrolladores FullStack de TypeScript. En lugar de brindarle una introducción completa a todos los aspectos de TypeScript, en esta parte nos centraremos en los problemas más comunes que surgen al desarrollar backends express o frontends de React con TypeScript. Además de las características del lenguaje, también tendremos un fuerte énfasis en las herramientas.

### Configurando las cosas

Instale la compatibilidad con TypeScript en el editor de su elección. Para [Visual Studio Code](https://code.visualstudio.com/), necesita la extensión [typescript hero](https://marketplace.visualstudio.com/items?itemName=rbbit.typescript-hero).

Como se mencionó anteriormente, el código TypeScript no es ejecutable por sí mismo, pero primero debe compilarse en JavaScript ejecutable. Cuando TypeScript se compila en JavaScript, el código se convierte en sujeto para el borrado de tipos. Esto significa que las anotaciones de tipos, interfaces, alias de tipos y otras construcciones del sistema de tipos se eliminan del código y el resultado es JavaScript puro y listo para ejecutar.

En un entorno de producción, la necesidad de compilación a menudo significa que debe configurar un "paso de compilación". Durante el paso de compilación, todo el código TypeScript se compila en JavaScript en una carpeta separada, y el entorno de producción luego ejecuta el código desde esa carpeta. En un entorno de desarrollo, a menudo es más útil hacer uso de la compilación en tiempo real y la recarga automática para poder ver los cambios resultantes más rápido.

Comencemos a escribir nuestra primera aplicación TypeScript. Para simplificar las cosas, comencemos usando el paquete [ts-node](https://github.com/TypeStrong/ts-node) de npm . Compila y ejecuta el archivo TypeScript especificado inmediatamente, por lo que no es necesario un paso de compilación por separado.

Puede instalar tanto <i>ts-node</i> como el paquete oficial <i>typescript</i> a nivel global ejecutando

```
npm install -g ts-node typescript
```

Si no puede o no quiere instalar paquetes globales, puede crear un proyecto npm que tenga las dependencias necesarias y ejecutar sus scripts en él. También tomaremos este enfoque.

Como recordamos de la [parte 3](/es/part3), un proyecto npm se configura ejecutando el comando <i>npm init</i> en un directorio vacío. Entonces podemos instalar las dependencias ejecutando

```
npm install --save-dev ts-node typescript
```

y configure <i>scripts</i> dentro del package.json:

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

Ahora, dentro de este directorio, puede usar <i>ts-node</i> ejecutando <i>npm run ts-node</i>. Tenga en cuenta que si está utilizando ts-node a través de package.json, todos los argumentos de la línea de comandos para el script deben tener el prefijo  <i>--</i>. Entonces, si desea ejecutar file.ts con <i>ts-node</i>, el comando completo es: -->

```sh
npm run ts-node -- file.ts
```

Vale la pena mencionar que TypeScript también proporciona un área de juegos en línea, donde puede probar rápidamente el código TypeScript y ver instantáneamente el JavaScript resultante y los posibles errores de compilación. Puede acceder al área de juegos oficial de TypeScript [aquí](https://www.typescriptlang.org/play/index.html).

**NB:** El área de juegos puede contener diferentes reglas tsconfig (que se presentarán más adelante) que su entorno local, por lo que es posible que vea advertencias diferentes en comparación con su entorno local. El tsconfig de la zona de juegos se puede modificar a través del menú de configuración desplegable.

#### Una nota sobre el estilo de codificación

JavaScript en sí mismo es un lenguaje bastante relajado y, a menudo, las cosas se pueden hacer de múltiples formas diferentes. Por ejemplo, tenemos funciones anónimas y con nombre, podemos usar const y let o var y usar el <i>punto y coma</i>. Esta parte del curso se diferencia del resto por el uso de punto y coma. No es un patrón específico de TypeScript, sino una decisión de estilo de codificación general al crear cualquier tipo de JavaScript. Utilizarlos o no suele estar en manos del programador, pero dado que se espera adaptar los hábitos de codificación al código base existente, en los ejercicios de esta parte se espera usar punto y coma y ajustarse al estilo de codificación de la parte. Esta parte también tiene otras diferencias de estilo de codificación en comparación con el resto del curso, por ejemplo, en el nombre del directorio.

Comencemos creando un multiplicador simple. Se ve exactamente como se haría en JavaScript.

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

Como puede ver, este sigue siendo JavaScript básico ordinario sin características adicionales de TS. Se compila y se ejecuta muy bien con <i>npm run ts-node -- multiplier.ts</i>, como lo haría con Node. 
Pero, ¿qué sucede si terminamos pasando <i>tipos</i> incorrectos de argumentos a la función multiplicadora?

¡Probémoslo!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');

```

Ahora, cuando ejecutamos el código, el resultado es: <i>Multiplied a string and 4, the result is: NaN</i>.

¿No sería bueno si el lenguaje en sí pudiera evitar que terminemos en situaciones como esta? Aquí es donde vemos los primeros beneficios de TypeScript. Agreguemos tipos a los parámetros y veamos a dónde nos lleva.

TypeScript admite de forma nativa varios tipos, incluidos <i>number</i>, <i>string</i> y <i>Array</i>. Vea la lista completa [aquí](https://www.typescriptlang.org/docs/handbook/basic-types.html). También se pueden crear tipos personalizados más complejos.

Los dos primeros parámetros de nuestra función son del tipo [number](http://www.typescriptlang.org/docs/handbook/basic-types.html#number) y el último es un [string](http://www.typescriptlang.org/docs/handbook/basic-types.html#string):

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

Ahora el código ya no es JavaScript válido, sino TypeScript. Cuando intentamos ejecutar el código, notamos que no se compila:

![](../../images/9/2a.png)


Una de las mejores cosas de la compatibilidad con el editor de TypeScript es que no es necesario que ni siquiera ejecutes el código para ver los problemas. El plugin de VSCode es tan eficiente que le informa inmediatamente cuando intenta utilizar un tipo incorrecto:

![](../../images/9/2.png)

### Creando tus primeros tipos

Ampliemos nuestro multiplicador a una calculadora un poco más versátil que también admita sumas y divisiones. La calculadora debe aceptar tres argumentos: dos números y la operación, ya sea <i>multiplicar</i>, <i>sumar</i> o <i>dividir</i>, que le dice qué hacer con los números.

En JavaScript, el código requeriría una validación adicional para asegurarse de que el último argumento sea un string. TypeScript ofrece una forma de definir tipos específicos de entradas, que describen exactamente qué tipo de entrada es aceptable. Además de eso, TypeScript también puede mostrar la información de los valores aceptados ya en el nivel de editor.

Podemos crear un <i>tipo</i> usando la palabra clave nativa de TypeScript <i>type</i>. Describamos nuestro tipo <i>Operation</i>:
Creating your first own types

```js
type Operation = 'multiply' | 'add' | 'divide';
```

Ahora el tipo <i>Operation</i> acepta solo tres tipos de entrada; exactamente los tres strings que queríamos. 
Utilizando el operador OR  _|_ podemos definir una variable para aceptar múltiples valores creando un [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types). En este caso usamos strings exactos (que en términos técnicos se denominan [tipos literales de strings](http://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)) pero con uniones también podría hacer que el compilador acepte, por ejemplo, cadena y número:  _string | number_.

La palabra clave <i>type</i> define un nuevo nombre para un tipo, un [alias de tipo](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases). Dado que el tipo definido es una unión de tres valores posibles, es útil asignarle un alias que tenga un nombre representativo.

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op : Operation) => {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can\'t divide by 0!';
    return a / b;
  }
}
```

Ahora, cuando pasamos el cursor sobre el tipo <i>Operation</i> en la función calculator, podemos ver inmediatamente sugerencias sobre qué hacer con él:

![](../../images/9/3.png)

Y si intentamos usar un valor que no está dentro del tipo <i>Operation</i>, obtenemos la conocida señal de advertencia roja e información adicional de nuestro editor:

![](../../images/9/4.png)

Esto ya es bastante bueno, pero una cosa que aún no hemos tocado es tipear el valor de retorno de una función. Por lo general, desea saber qué devuelve una función, y sería bueno tener una garantía de que realmente devuelve lo que dice. Agreguemos un valor de retorno <i>number</i> a la función de calculadora:

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => {

  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'this cannot be done';
    return a / b;
  }
}
```

El compilador se queja de inmediato, porque en un caso la función devuelve un string. Hay un par de formas de arreglar esto: podríamos extender el tipo de retorno para permitir valores string, así

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  {
  // ...
}
```

o podríamos crear un tipo de retorno que incluya ambos tipos posibles, muy parecido a nuestro tipo Operation

```js
type Result = string | number

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

Pero ahora la pregunta es si <i>realmente</i> está bien que la función devuelva un string.

Cuando su código puede terminar en una situación en la que algo se divide por 0, es probable que algo haya salido terriblemente mal y se debe generar un error y manejarlo donde se llamó a la función. Cuando decide devolver valores que no esperaba originalmente, las advertencias que ve de TypeScript le impiden tomar decisiones apresuradas y le ayudan a mantener su código funcionando como se esperaba.

Una cosa más a considerar es que, aunque hemos definido tipos para nuestros parámetros, el JavaScript generado que se usa en tiempo de ejecución no contiene las verificaciones de tipos. 
Entonces, si, por ejemplo, el valor del parámetro de <i>operation</i> proviene de una interfaz externa, no hay garantía definitiva de que sea uno de los valores permitidos. Por lo tanto, es mejor incluir el manejo de errores y estar preparado para lo inesperado. 
En este caso, cuando hay múltiples valores aceptados posibles y todos los inesperados deberían dar como resultado un error, la declaración [switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) se adapta mejor que if...else en nuestro código.

El código de nuestra calculadora debería verse así:

```js
type Operation = 'multiply' | 'add' | 'divide';

type Result = number;

const calculator = (a: number, b: number, op : Operation) : Result => {
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if( b === 0) throw new Error('Can\'t divide by 0!');
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');
  }
}

try {
  console.log(calculator(1, 5 , 'divide'))
} catch (e) {
  console.log('Something went wrong, error message: ', e.message);
}
```

Los programas que hemos escrito están bien, pero seguro que sería mejor si pudiéramos usar argumentos de línea de comandos en lugar de tener que cambiar siempre el código para calcular cosas diferentes.
Probémoslo, como lo haríamos en una aplicación Node normal, accediendo a <i>process.argv</i>. 
Pero algo no va bien:

![](../../images/9/5.png)

### @types/{npm_package}

Volvamos a la idea básica de TypeScript. TypeScript espera que todo el código utilizado globalmente sea tipado, como usted lo hace con su propio código cuando su proyecto tiene una configuración razonable. La biblioteca de TypeScript en sí contiene solo tipificaciones para el código del paquete TypeScript. Es posible escribir sus propias tipificaciones para una librería, pero eso casi nunca es necesario, ¡ya que la comunidad de TypeScript lo ha hecho por nosotros!

Al igual que con npm, el mundo TypeScript también celebra el código fuente abierto. La comunidad está activa y reacciona continuamente a las actualizaciones y cambios en los paquetes npm de uso común.
Casi siempre puede encontrar las tipificaciones de paquetes npm, por lo que no tiene que crear tipificaciones para todas sus miles de dependencias.

Por lo general, las tipificaciones de paquetes existentes se pueden encontrar en <i>@types</i>-organization dentro de npm, y puede agregar los tipos relevantes a su proyecto instalando un paquete npm con el nombre de su paquete con el prefijo @ types / -. Por ejemplo:  <i>npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose</i> y así sucesivamente. Los <i>@types/*</i> son mantenidos por [Definitely typed](http://definitelytyped.org/), un proyecto comunitario con el objetivo de mantener tipos de todo en un solo lugar.

A veces, un paquete npm también puede incluir sus tipificaciones dentro del código y, en ese caso, no es necesario instalar los correspondientes <i>@types/*</i>.

> **NB:** Dado que las tipificaciones solo se usan antes de la compilación, estas no son necesarias en la compilación de producción y siempre deben estar en devDependencies del package.json.

Dado  la variable global <i>process</i> está definida por el propio Node, obtenemos sus tipificaciones instalando el paquete<i>@types/node</i>:

```sh
npm install --save-dev @types/node
```

Después de instalar los tipos, nuestro compilador ya no se queja de la variable <i>process</i>. Tenga en cuenta que no es necesario requerir los tipos para el código, ¡la instalación del paquete es suficiente!


## Mejorando el proyecto

A continuación, agreguemos scripts npm para ejecutar nuestros dos programas, <i>multiplier</i> y <i>calculator</i>:

```json
{
  "name": "part1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts", // highlight-line
    "calculate": "ts-node calculator.ts" // highlight-line
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^8.6.2",
    "typescript": "^3.8.2"
  }
}
```
Podemos hacer que el multiplicador funcione con los parámetros de la línea de comando con los siguientes cambios

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
```
y podemos ejecutarlo con

```sh
npm run multiply 5 2
```

si el programa se ejecuta con parámetros que no son del tipo correcto, p. ej.

```sh
npm run multiply 5 lol
```

"funciona" pero nos da la respuesta

```sh
Multiplied 5 and NaN, the result is: NaN
```

La razón de esto es que <i>Number('lol')</i> devuelve <i>NaN</i>, que en realidad es de tipo <i>number</i>, por lo que TypeScript no tiene poder para rescatarnos de este tipo de situación.

Para evitar este tipo de comportamientos, tenemos que validar los datos que nos brindan desde la línea de comandos.

La versión mejorada del multiplicador se ve así:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is:`);
} catch (e) {
  console.log('Error, something bad happened, message: ', e.message);
}
```
Cuando ahora ejecutamos el programa

```sh
npm run multiply 1 lol
```
obtenemos un mensaje de error adecuado:

```sh
Error, something bad happened, message:  Provided values were not numbers!
```
La definición de la función <i>parseArguments</i> tiene un par de cosas interesantes:

```js
const parseArguments = (args: Array<string>): MultiplyValues => {
  // ...
}
```
En primer lugar, el parámetro <i>args</i> es un [array](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) de strings. El valor de retorno tiene el tipo <i>MultiplyValues</i>, que se define de la siguiente manera:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```
La definición utiliza la palabra clave [Interface](http://www.typescriptlang.org/docs/handbook/interfaces.html) de TypeScript, que es una forma de definir la "forma" que debe tener un objeto. En nuestro caso, es bastante obvio que el valor de retorno debe ser un objeto con dos propiedades <i>value1</i> y <i>value2</i>, que deben ser ambas del tipo number.

</div>

<div class="tasks">

### Ejercicios 9.1.-9.3.

#### setup

Ejercicios 9.1.-9.7. se realizarán todos en el mismo proyecto de node. Cree el proyecto en un directorio vacío con <i>npm init</i> e instale los paquetes ts-node y typescript. Cree también el archivo <i>tsconfig.json</i> en el directorio con el siguiente contenido:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
  }
}
```

El archivo <i>tsconfig.json</i> se usa para definir cómo el compilador de TypeScript debe interpretar el código, qué tan estrictamente debe funcionar el compilador, qué archivos observar o ignorar, y [mucho más](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). Por ahora solo usaremos la opción del compilador [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), que hace que sea obligatorio tener tipos para todas las variables utilizadas.

#### 9.1 Índice de masa corporal
Cree el código de este ejercicio en el archivo <i>bmiCalculator.ts</i>

Escriba una función <i>calculateBmi</i> que cuente el [IMC](https://en.wikipedia.org/wiki/Body_mass_index) según la altura (en centímetros) y el peso (en kilogramos) y luego devuelva un mensaje que se adapte a los resultados.

Llame a la función en el mismo archivo con parámetros codificados e imprima el resultado. El código

```js
console.log(calculateBmi(180, 74))
```

debe imprimir el siguiente mensaje

```sh
Normal (healthy weight)
```

Cree un script npm para ejecutar el programa con el comando <i>npm run calculateBmi</i>

#### 9.2 Calculadora de ejercicio

Cree el código de este ejercicio en el archivo <i>exerciseCalculator.ts</i>

Escriba una función <i>calculateExercises</i> que calcule el tiempo promedio de las <i>horas diarias de ejercicio</i> y lo compare con la <i>cantidad objetivo</i> de horas diarias y devuelva un objeto que incluya los siguientes valores:

- el numero de dias
- el número de días de entrenamiento
- el valor objetivo original
- el tiempo promedio calculado
- valor booleano que describe si se alcanzó el objetivo
- una calificación entre los números 1-3 que indica qué tan bien se cumplen las horas. Puede decidir la métrica por su cuenta.
- un valor de texto que explica la calificación

Las horas de ejercicio diarias se asignan a la función como un [array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) que contiene el número de horas de ejercicio de cada día en el período de entrenamiento. P.ej. una semana con 3 horas de entrenamiento el lunes, ninguna el martes, 2 horas el miércoles, 4,5 horas el jueves y así sucesivamente estaría representada por el siguiente array:

```js
[3, 0, 2, 4.5, 0, 3, 1]
```

Para el objeto Result, debe crear un [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html).

Si llama a la función con los parámetros <i>[3, 0, 2, 4.5, 0, 3, 1]</i> y <i>2</i> , podría devolver

```js
{ periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.9285714285714286 }
```

Cree un script npm <i>npm run calculateExercises</i> para llamar a la función con valores codificados.

#### 9.3 Línea de comando

Cambie los ejercicios anteriores para que pueda dar los parámetros de <i>bmiCalculator</i> y <i>exerciseCalculator</i>  como argumentos de línea de comando.

Su programa podría funcionar, por ejemplo. como sigue:

```sh
$ npm run calculateBmi 180 91

Overweight
```

y

```sh
$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{ periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.7222222222222223 }
```

En el ejemplo, el <i>primer argumento</i> es el valor objetivo.

Maneje las excepciones y los errores de manera adecuada. exerciseCalculator debe aceptar entradas de diferentes longitudes. Determine usted mismo cómo se las arregla para recopilar toda la información necesaria.

</div>

<div class="content">

### Más acerca de tsconfig

En los ejercicios usamos solo una regla tsconfig [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny). Es un buen lugar para comenzar, pero ahora es el momento de profundizar un poco más en el archivo de configuración.

El archivo [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) contiene todas sus configuraciones principales sobre cómo desea que TypeScript funcione en su proyecto. 
Puede definir qué tan estrictamente desea que se inspeccione el código, qué archivos incluir y excluir (<i>node_modules</i> está excluido de forma predeterminada) y dónde se deben colocar los archivos compilados (más sobre esto más adelante).

Especifiquemos las siguientes configuraciones en nuestro archivo <i>tsconfig.json</i>:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

No se preocupe demasiado por <i>compilerOptions</i>, estarán bajo una inspección más cercana en la parte 2.

Puede encontrar explicaciones para cada una de las configuraciones en la documentación de TypeScript, o en la [página tsconfig](https://www.staging-typescript.org/tsconfig) realmente útil , o en la [definición del esquema](http://json.schemastore.org/tsconfig) tsconfig , que desafortunadamente tiene un formato un poco peor que las dos primeras opciones.

### Añadiendo express a la mezcla

Ahora mismo estamos en un lugar bastante bueno. Nuestro proyecto está configurado y tenemos dos calculadoras ejecutables en él. Sin embargo, dado que nuestro objetivo es aprender a desarrollar FullStack, es hora de empezar a trabajar con algunas solicitudes HTTP.

Comencemos por instalar express:

```
npm install express
```

y luego agregue el script <i>start</i> a package.json:


```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts",
    "calculate": "ts-node calculator.ts",
    "start": "ts-node index.ts" // highlight-line
  },
  // ..
}
```

Ahora podemos crear el archivo <i>index.ts</i> y escribirle el endpoint <i>ping</i> de HTTP GET:

```js
const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
Todo lo demás parece estar funcionando bien, pero como era de esperar, es necesario escribir los parámetros <i>req</i> y <i>res</i> de app.get necesitan tipado.
 Si observa con atención, VSCode también se queja de algo acerca de la importación express. Puede ver una pequeña línea amarilla de puntos debajo de <i>require</i>. Pasemos el cursor sobre el problema:

![](../../images/9/6.png)

La queja es que la llamada <i>'require' puede convertirse en un import</i>. Sigamos los consejos y escribamos el import de la siguiente manera

```js
import express from 'express';
```

**NB**: VSCode le ofrece una posibilidad para solucionar los problemas de forma automática haciendo clic en el botón <i>Quick fix...</i>. Mantenga los ojos abiertos para estos ayudas/soluciones rápidas; escuchar a su editor generalmente hace que su código sea mejor y más fácil de leer. Las correcciones automáticas de problemas también pueden suponer un gran ahorro de tiempo.

Ahora nos encontramos con otro problema: el compilador se queja de la declaración de importación. Una vez más, el editor es nuestro mejor amigo cuando tratamos de averiguar cuál es el problema:

![](../../images/9/7.png)

No hemos instalado tipos para <i>express</i>. Hagamos lo que dice la sugerencia y ejecutemos:

```
npm install --save-dev @types/express
```

¡Y no más errores! Echemos un vistazo a lo que cambió.

Cuando pasamos el cursor sobre la declaración <i>require</i>, podemos ver que el compilador interpreta todo lo relacionado con express para que sea del tipo <i>any</i>.

![](../../images/9/8a.png)

Mientras que cuando usamos <i>import</i>, el editor conoce los tipos reales

![](../../images/9/9a.png)

La declaración de importación que se utilizará depende del método de exportación utilizado en el paquete importado.

Una buena regla general es intentar importar un módulo utilizando primero la declaración <i>import</i>. Siempre usaremos este método en el <i>frontend</i>. Si <i>import</i> no funciona, pruebe con un método combinado: <i>import ... = require('...')</i>.

Le recomendamos encarecidamente que lea más sobre los módulos de TypeScript [aquí](https://www.typescriptlang.org/docs/handbook/modules.html).

Hay un problema más con el código.

![](../../images/9/9b.png)

Esto se debe a que prohibimos los parámetros no utilizados en nuestro <i>tsconfig.json</i>

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // highlight-line
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Esta configuración puede crear problemas si tiene funciones predefinidas en toda la biblioteca que requieran declarar una variable incluso si no se usa en absoluto, como es el caso aquí. 
Afortunadamente, este problema ya se ha resuelto a nivel de configuración. 
Una vez más, pasar el cursor sobre el problema nos da una solución. Esta vez podemos hacer clic en el botón quick fix:

![](../../images/9/14a.png)

Si es absolutamente imposible deshacerse de una variable no utilizada, puede prefijarla con un guión bajo para informar al compilador que ha pensado en ello y que no hay nada que pueda hacer.

Cambiemos el nombre de la variable <i>req</i> a <i>_req</i>.

Finalmente estamos listos para iniciar la aplicación. Parece que funciona bien:

![](../../images/9/11a.png)

Para simplificar el desarrollo, deberíamos habilitar la <i>recarga automática</i> para mejorar nuestro flujo de trabajo. En este curso ya usó <i>nodemon</i>, pero ts-node tiene una alternativa llamada <i>ts-node-dev</i>. Está destinado a ser utilizado solo con un entorno de desarrollo que se encarga de la recompilación en cada cambio, por lo que no será necesario reiniciar la aplicación.

Instalemos <i>ts-node-dev</i> en nuestras dependencias de desarrollo

```
npm install --save-dev ts-node-dev
```

agregemos un script a <i>package.json</i>

```json
{
  // ...
  "scripts": {
      // ...
      "dev": "ts-node-dev index.ts", // highlight-line
  },
  // ...
}
```

¡Y ahora, al ejecutar <i>npm run dev</i>, tenemos un entorno de desarrollo que funciona y que se recarga automáticamente para nuestro proyecto!

</div>

<div class="tasks">

### Ejercicios 9.4.-9.5.

#### 9.4 Express

Agregue express a sus dependencias y cree endpoint HTTP GET de saludo que responda 'Hello Full Stack!'

La aplicación web debe iniciarse con el comando <i>npm start</i> en modo de producción y <i>npm run dev</i> en modo de desarrollo, que debe usar <i>ts-node-dev</i> para ejecutar la aplicación.

Reemplace también su archivo <i>tsconfig.json</i> existente con el siguiente contenido:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "declaration": true,
  }
}
```

¡asegúrese de que no haya errores!

#### 9.5 WebBMI

Agregue un endpoint para la calculadora de IMC que se puede usar haciendo una solicitud HTTP GET al endpoint <i>bmi</i> y especificando el input con [query string parameters](https://en.wikipedia.org/wiki/Query_string). Por ejemplo, para obtener el IMC de una persona que tiene una altura de 180 y un peso de 72, la URL es http://localhost:3002/bmi?height=180&weight=72

La respuesta es un json de la forma

```js
{
  weight: 72,
  height: 180,
  bmi: "Normal (healthy weight)"
}
```

Consulte la [documentación de express](http://expressjs.com/en/5x/api.html#req.query) para obtener información sobre cómo acceder a los parámetros de consulta.

Si los parámetros de consulta de la solicitud son del tipo incorrecto o faltan, se proporciona una respuesta con el código de estado y el mensaje de error adecuados

```js
{
  error: "malformatted parameters"
}
```

No copie el código de la calculadora en el archivo <i>index.ts</i>, conviértalo en un [módulo detypescript](https://www.typescriptlang.org/docs/handbook/modules.html) que se puede importar en <i>index.ts</i>.

</div>

<div class="content">

### Los horrrores de <i>any</i>

Ahora que hemos completado nuestros primeros endpoints, es posible que observe que apenas hemos usado TypeScript en estos pequeños ejemplos. 
Al examinar el código un poco más de cerca, podemos ver algunos peligros acechando allí.


Agreguemos un HTTP GET endpoint <i>calculate</i> a nuestra aplicación:

```js
import { calculator } from './calculator'

// ...

app.get('/calculate', (req, res) => {
  const { value1, value2, op } = req.query

  const result = calculator(value1, value2, op)
  res.send(result);
});
```

Cuando pasa el cursor sobre la función <i>calculate</i>, puede ver el tipeado de <i>calculator</i> aunque el código en sí no contiene ningun tipying:

![](../../images/9/12a.png)

Pero si pasa el cursor sobre los valores del request, surge un problema:

![](../../images/9/13a.png)

Todas las variables tienen el tipo <i>any</i>. No es tan sorprendente, ya que nadie les ha dado un tipo todavía. Hay un par de maneras de solucionar este problema, pero la primera que tenemos que considerar por qué esto es aceptado y de dónde el tipo <i>any</i> viene?

En TypeScript, cada variable sin tipo cuyo tipo no se puede inferir, se convierte implícitamente en tipo [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any). Cualquiera es una especie de "comodín" que literalmente significa <i>cualquier tipo</i>. 
Las cosas se convierten implícitamente de cualquier tipo con bastante frecuencia cuando uno se olvida de darle tipo a las funciones.

También podemos explicitar el tipo <i>any</i>. La única diferencia entre cualquier tipo implícito y explícito es cómo se ve el código, al compilador no le importa la diferencia.

Sin embargo, los programadores ven el código de manera diferente cuando se aplica explícitamente <i>any</i> que cuando se infiere implícitamente. 
<i>any</i> de manera implicita generalmente se considera problemático, ya que a menudo se debe a que el codificador se olvida de asignar tipos (o es demasiado perezoso para hacerlo), y también significa que no se aprovecha todo el poder de TypeScript.

Es por eso que la regla de configuración [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny) existe a nivel de compilador, y es muy recomendable mantenerla activada en todo momento. 
En las raras ocasiones en que no pueda saber en serio cuál es el tipo de variable, debe indicarlo explícitamente en el código

```js
const a : any = /* no clue what the type will be! */.
```

Ya hemos configurado <i>noImplicitAny</i> en nuestro ejemplo, ¿por qué el compilador no se queja del tipo implicito <i>any</i>? 
La razón es que el campo de consulta de un objeto Request de express es explícitamente tipado como <i>any</i>. Lo mismo ocurre con el campo <i>request.body</i> que usamos para publicar datos en una aplicación.

¿Y si quisiéramos evitar que los desarrolladores utilicen <i>any</i>? Afortunadamente, tenemos otros métodos además de <i>tsconfig.json</i> para hacer cumplir el estilo de codificación. Lo que podemos hacer es usar <i>eslint</i> para administrar nuestro código. 
Instalemos eslint y sus extensiones de typescript:

```sh
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Configuraremos eslint para [no permitir any explicito](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md). Escriba las siguientes reglas en <i>.eslintrc</i>:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": 2
  }
}
```

Configuremos también un script <i>lint</i> npm para inspeccionar los archivos con la extensión <i>.ts</i> modificando el archivo <i>package.json</i>:

```json
{
  // ...
  "scripts": {
      "start": "ts-node index.ts",
      "dev": "ts-node-dev index.ts",
      "lint": "eslint --ext .ts ." // highlight-line
      //  ...
  },
  // ...
}
```

Ahora lint se quejará si intentamos definir una variable de tipo <i>any</i>:


![](../../images/9/13b.png)

El [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) tiene un montón de reglas específicas eslint de TypeScript, pero también se puede utilizar todas las reglas básicas eslint en proyectos de TypeScript. Por ahora, probablemente deberíamos ir con la configuración recomendada y modificar las reglas a medida que avanzamos cada vez que encontramos algo que queremos que se comporte de manera diferente.

Además de la configuración recomendada, deberíamos intentar familiarizarnos con el estilo de codificación requerido en esta parte y <i>ubicar el punto y coma al final de cada línea de código como requerido<i>.

Entonces usaremos el siguiente <i>.eslintrc</i>

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-case-declarations": 0
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

Faltan algunos puntos y comas, pero son fáciles de agregar.

¡Y ahora arreglemos todo lo que hay que arreglar!

</div>

<div class="tasks">

### Ejercicios 9.6.-9.7.

#### 9.6 Eslint

Configure su proyecto para utilizar la configuración de eslint anterior y corrija todas las advertencias.

#### 9.7 WebExercises

Agregue un endpoint a su aplicación para la calculadora de ejercicio. Debe usarse haciendo una solicitud HTTP POST al endpoint <i>exercises</i> con la entrada en el cuerpo de la solicitud

```js
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

La respuesta es un json de la siguiente forma

```js
{
    "periodLength": 7,
    "trainingDays": 4,
    "success": false,
    "rating": 1,
    "ratingDescription": "bad",
    "target": 2.5,
    "average": 1.2142857142857142
}
```

Si el cuerpo de la solicitud no tiene el formato correcto, se da una respuesta con el código de estado y el mensaje de error adecuados. El mensaje de error es

```js
{
  error: "parameters missing"
}
```

o

```js
{
  error: "malformatted parameters"
}
```

dependiendo del error. Esto último ocurre si los valores de entrada no tienen el tipo correcto, es decir, no son números ni se pueden convertir en números.

En este ejercicio, puede que le resulte beneficioso utilizar el tipo <i>any explícito</i> cuando maneje los datos en el cuerpo de la solicitud. Nuestra configuración de eslint evita esto, pero puede desarmar esta regla para una línea en particular insertando el siguiente comentario como la línea anterior:

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

Tenga en cuenta que debe tener una configuración correcta para poder acceder al cuerpo de la solicitud, consulte la [parte 3](/es/part3/node_js_and_express#receiving-data).

</div>
