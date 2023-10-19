---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: es
---

<div class="content">

Después de la breve introducción a los principios fundamentales de TypeScript, ahora estamos listos para comenzar nuestro viaje para convertirnos en desarrolladores FullStack de TypeScript. 
En lugar de brindarte una introducción completa a todos los aspectos de TypeScript, en esta parte nos centraremos en los problemas más comunes que surgen al desarrollar backends con Express o frontends de React con TypeScript.
Además de las características del lenguaje, también tendremos un fuerte énfasis en las herramientas.

### Configurando Typescript

Instala la compatibilidad con TypeScript en el editor de tu elección. [Visual Studio Code](https://code.visualstudio.com/) funciona de forma nativa con Typescript.

Como se mencionó anteriormente, el código TypeScript no es ejecutable por sí mismo. Primero debe compilarse en JavaScript ejecutable.
Cuando TypeScript se compila en JavaScript, el código queda sujeto a borrado de tipos. Esto significa que las anotaciones de tipos, interfaces, alias de tipos y otras construcciones del sistema de tipos se eliminan del código y el resultado es JavaScript puro y listo para ejecutar.

En un entorno de producción, la necesidad de compilación a menudo significa que debes configurar un "paso de compilación". Durante el paso de compilación, todo el código TypeScript se compila en JavaScript en una carpeta separada, y el entorno de producción luego ejecuta el código desde esa carpeta. En un entorno de desarrollo, a menudo es más útil hacer uso de la compilación en tiempo real y la recarga automática para poder ver los cambios resultantes más rápido.

Comencemos a escribir nuestra primera aplicación TypeScript. Para simplificar las cosas, comencemos usando el paquete [ts-node](https://github.com/TypeStrong/ts-node) de npm . El cual compila y ejecuta el archivo TypeScript especificado inmediatamente, por lo que no es necesario un paso de compilación por separado.

Puedes instalar tanto <i>ts-node</i> como el paquete oficial <i>typescript</i> a nivel global ejecutando

```bash
npm install --location=global ts-node typescript
```

Si no puedes o no quieres instalar paquetes globales, puedes crear un proyecto npm que tenga las dependencias necesarias y ejecutar sus scripts en él.
También tomaremos este enfoque.

Como recordamos de la [parte 3](/es/part3), un proyecto npm se configura ejecutando el comando *npm init* en un directorio vacío. Entonces podemos instalar las dependencias ejecutando

```bash
npm install --save-dev ts-node typescript
```

y configurando <i>scripts</i> dentro de package.json:

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

Ahora, dentro de este directorio, puedes usar <i>ts-node</i> ejecutando * npm run ts-node*. Ten en cuenta que si estás utilizando ts-node a través de package.json, todos los argumentos de la línea de comandos para el script deben tener el prefijo  *--*. Entonces, si deseas ejecutar file.ts con <i>ts-node</i> y opciones *-s* y *--someoption*, el comando completo es: -->

```shell
npm run ts-node file.ts -- -s --someoption
```

Vale la pena mencionar que TypeScript también proporciona un área de juegos en línea, donde puedes probar rápidamente el código TypeScript y ver instantáneamente el JavaScript resultante y los posibles errores de compilación. Puedes acceder al área de juegos oficial de TypeScript [aquí](https://www.typescriptlang.org/play/index.html).

**NB:** El área de juegos puede contener diferentes reglas en tsconfig (que se presentarán más adelante) que en tu entorno local, por lo que es posible que veas advertencias diferentes en comparación con tu entorno local. El tsconfig de la zona de juegos se puede modificar a través del menú de configuración desplegable.

#### Una nota sobre el estilo de código

JavaScript en sí mismo es un lenguaje bastante relajado y, a menudo, las cosas se pueden hacer de múltiples formas diferentes. Por ejemplo, tenemos funciones anónimas y con nombre, podemos usar const y let o var, y podemos elegir si usar el <i>punto y coma</i> o no. Esta parte del curso se diferencia del resto por el uso de punto y coma. No es un patrón específico de TypeScript, sino una decisión de estilo de código general al crear cualquier tipo de proyecto de JavaScript. Utilizarlos o no suele estar en manos del programador, pero dado que se espera que podamos adaptar nuestros hábitos de código al código base existente, esperamos que uses punto y coma y que te adaptes a estilo del código en los ejercicios de esta parte. Esta parte también tiene otras diferencias de estilo de código en comparación con el resto del curso, por ejemplo, en las convenciones utilizadas para nombrar los directorios.

Agreguemos una configuración al archivo *tsconfig.json* al proyecto con el siguiente contenido:

```js
{
  "compilerOptions":{
    "noImplicitAny": false
  }
}
```

El archivo <i>tsconfig.json</i> es utilizado para definir como el compilador de Typescript debe interpretar el código, cuan estrictamente el compilador debería funcionar, que archivos revisar o ignorar, y [mucho más](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
Por ahora, solo utilizaremos la opción del compilador [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), la cual no requiere tener tipos en todas las variables utilizadas.

Comencemos creando un multiplicador simple. Se ve exactamente igual a como se haría en JavaScript.

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

Como puedes ver, este sigue siendo JavaScript básico y ordinario sin características adicionales de TS. Se compila y se ejecuta muy bien con *npm run ts-node -- multiplier.ts*, como lo haría con Node.

Pero, ¿qué sucede si terminamos pasando <i>tipos</i> incorrectos de argumentos a la función multiplicator?

¡Vamos a probarlo!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');

```

Ahora, cuando ejecutamos el código, el resultado es: *Multiplied a string and 4, the result is: NaN*.

¿No sería bueno si el lenguaje en sí mismo pudiera evitar que terminemos en situaciones como esta?
Aquí es donde vemos los primeros beneficios de TypeScript. Agreguemos tipos a los parámetros y veamos a dónde nos lleva.

TypeScript admite de forma nativa varios tipos, incluidos *number*, *string* y *Array*. Ve la lista completa [aquí](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html). También se pueden crear tipos personalizados más complejos.

Los dos primeros parámetros de nuestra función son de tipo number y el último es de tipo string, ambos tipos son [primitivos](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean):

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

Ahora el código ya no es JavaScript válido, sino TypeScript. Cuando intentamos ejecutar el código, notamos que no se compila:

![salida de consola mostrando error de asignación de string a number](../../images/9/2a.png)

Una de las mejores cosas de la compatibilidad con el editor de TypeScript es que ni siquiera es necesario que ejecutes el código para ver los problemas.
VSCode es tan eficiente que te informa inmediatamente cuando intentas utilizar un tipo incorrecto:

![vscode mostrando el mismo error acerca de un string como number](../../images/9/2.png)

### Creando tus primeros tipos

Ampliemos nuestro multiplicador a una calculadora un poco más versátil que también admita sumas y divisiones. La calculadora debe aceptar tres argumentos: dos números y la operación, ya sea *multiplicar*, *sumar* o *dividir*, que le dice qué hacer con los números.

En JavaScript, el código requeriría una validación adicional para asegurarse de que el último argumento sea un string. TypeScript ofrece una forma de definir tipos específicos de entradas, que describen exactamente qué tipo de entrada es aceptable. Además de eso, TypeScript también puede mostrar la información de los valores aceptados ya en el nivel de editor.

Podemos crear un *tipo* usando la palabra clave nativa de TypeScript *type*. Describamos nuestro tipo *Operation*:

```js
type Operation = 'multiply' | 'add' | 'divide';
```

Ahora el tipo *Operation* acepta solo tres tipos de valores; exactamente los tres strings que queríamos.
Utilizando el operador OR *|* podemos definir una variable para aceptar múltiples valores creando un [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types). 
En este caso usamos strings exactos (que en términos técnicos se denominan [tipos literales de strings](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)) pero con uniones también podría hacer que el compilador acepte, por ejemplo, string y number:  *string | number*.

La palabra clave *type* define un nuevo nombre para un tipo, un [alias de tipo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases). Dado que el tipo definido es una unión de tres valores posibles, es útil asignarle un alias que tenga un nombre representativo.

Ahora echémosle un vistazo a nuestra calculadora:

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

Ahora, cuando pasamos el cursor sobre el tipo *Operation* en la función calculator, podemos ver inmediatamente sugerencias sobre qué hacer con él:

![sugerencia de vs code con 3 tipos de operación](../../images/9/3.png)

Y si intentamos usar un valor que no está dentro del tipo *Operation*, obtenemos la conocida señal de advertencia roja e información adicional de nuestro editor:

![advertencia de vs code cuando intentamos utilizar 'yolo' como Operation](../../images/9/4x.png)

Esto ya es bastante bueno, pero una cosa que aún no hemos tocado es tipear el valor de retorno de una función. Por lo general, querrás saber qué devuelve una función, y sería bueno tener una garantía de que realmente devuelve lo que dice que hace. Agreguemos un valor de retorno *number* a la función calculator:

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => { // highlight-line

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

El compilador se queja de inmediato, porque en un caso la función devuelve un string. Hay un par de formas de arreglar esto:

Podríamos extender el tipo de retorno para permitir valores string de esta forma:

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  {
  // ...
}
```

O podríamos crear un tipo de retorno que incluya ambos tipos posibles, muy parecido a nuestro tipo Operation:

```js
type Result = string | number

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

Pero ahora la pregunta es, ¿<i>realmente</i> está bien que la función devuelva un string?

Cuando tu código puede terminar en una situación en la que algo se divide por 0, es probable que algo haya salido terriblemente mal y se debería generar un error y manejarlo desde donde se llamó a la función.
Cuando decides devolver valores que no esperabas originalmente, las advertencias de TypeScript te impiden tomar decisiones apresuradas y te ayudan a mantener tu código funcionando como se esperaba.

Una cosa más a considerar es que, aunque hemos definido tipos para nuestros parámetros, el JavaScript generado que se usa durante el tiempo de ejecución no contiene las verificaciones de tipos.
Entonces, si, por ejemplo, el valor del parámetro de *operation* proviene de una interfaz externa, no hay garantía definitiva de que sea uno de los valores permitidos. Por lo tanto, es mejor incluir el manejo de errores y estar preparado para lo inesperado.
En este caso, cuando hay múltiples valores aceptados posibles y todos los inesperados deberían dar como resultado un error, la declaración [switch...case](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch) se adapta mejor que if...else en nuestro código.

El código de nuestra calculadora debería verse así:

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) : number => {  // highlight-line
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can\'t divide by 0!');  // highlight-line
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');  // highlight-line
  }
}

try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### Estrechamiento de Tipos

El valor por defecto del parámetro *error* en el bloque catch es *unknown*. El tipo [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) es una especie de tipo superior que fue introducido en la version 3 de TypeScript para ser la contraparte segura de *any*. Todo es asignable a *unknown*, pero *unknown* no es asignable a nada más que a si mismo y a *any* sin utilizar una aserción de tipo o un estrechamiento basado en el control de flujos. Asimismo, no se permiten operaciones en un *unknown* sin primero utilizar una aserción o un estrechamiento a un tipo especifico.

Ambas posibles causas de excepción (operador incorrecto o división por cero) van a generar un objeto de [Error](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error) con un mensaje de error, que nuestro programa le imprime al usuario.

Si nuestro código fuera JavaScript, podríamos imprimir el mensaje de error tan solo referenciando al parámetro [message](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error/message) del objeto *error* de la siguiente manera:

```js
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error) {
  console.log('Something went wrong: ' + error.message);  // highlight-line
}
```

Ya que el tipo por defecto del objeto *error* en TypeScript es *unknown*, tenemos que [estrechar](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) el tipo para acceder al parámetro:

```ts
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  // here we can not use error.message
  if (error instanceof Error) { // highlight-line 
    // the type is narrowed and we can refer to error.message
    errorMessage += error.message;  // highlight-line 
  }
  // here we can not use error.message

  console.log(errorMessage);
}
```

Aquí el estrechamiento fue hecho con la guardia de tipo [instanceof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing), que es tan solo una de las muchas formas en las que se puede estrechar a un tipo. Vamos a ver muchas otras más adelante en esta parte.

### Accediendo a argumentos de la linea de comandos

Los programas que hemos escrito están bien, pero seguro que sería mejor si pudiéramos usar argumentos de línea de comandos en lugar de tener que cambiar siempre el código para calcular cosas diferentes.

Vamos a probar, como lo haríamos en una aplicación normal de Node, accediendo a *process.argv*. Si estas utilizando una versión de npm reciente (7.0 o superior), no habra problemas, pero con una versión mas antigua algo no va bien:

![error de vs code no puede encontrar nombre del proceso necesita instalar definiciones de tipo](../../images/9/5.png)

Entonces, ¿cual es el problema con las versiones antiguas?

### @types/{npm_package}

Volvamos a la idea básica de TypeScript. TypeScript espera que todo el código utilizado globalmente sea tipado, como lo hace por tu código cuando tu proyecto tiene una configuración razonable. La biblioteca de TypeScript en sí misma, contiene solo tipados para el código del paquete TypeScript. Es posible escribir tus propias tipificaciones para el código de una libreria, pero eso casi nunca es necesario, ¡ya que la comunidad de TypeScript lo ha hecho por nosotros!

Al igual que con npm, el mundo TypeScript también celebra el código fuente abierto. La comunidad está activa y reacciona continuamente a las actualizaciones y cambios en los paquetes npm de uso común. Casi siempre puedes encontrar las tipificaciones de paquetes npm, por lo que no tienes que crear tipificaciones para todas tus miles de dependencias por ti mismo.

Por lo general, las tipificaciones de paquetes existentes se pueden encontrar en la organización <i>@types</i> dentro de npm, y puedes agregar los tipos relevantes a tu proyecto instalando un paquete npm con el nombre de tu paquete con el prefijo *@types/*. Por ejemplo:

```bash
npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose
```

y así sucesivamente. Los <i>@types/*</i> son mantenidos por [Definitely typed](https://github.com/DefinitelyTyped/DefinitelyTyped), un proyecto comunitario con el objetivo de mantener todas las tipificaciones en un solo lugar.

A veces, un paquete npm también puede incluir sus tipificaciones dentro del código y, en ese caso, no es necesario instalar los correspondientes <i>@types/*</i>.

> **NB:** Dado que las tipificaciones solo se usan antes de la compilación, estas no son necesarias en la compilación de producción y siempre deben estar en devDependencies del package.json.

Dado que la variable global <i>process</i> está definida por el propio Node, obtenemos sus tipificaciones del paquete <i>@types/node</i>.

Desde la version 10.0 <i>ts-node</i> ha definido <i>@types/node</i> como una [dependencia entre pares](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies). Si la version de npm es al menos 7.0, las dependencias entre pares de un proyecto son automáticamente instaladas por npm. Si tienes una version mas antigua de npm, la dependencia entre pares debe ser instalada explícitamente:

```shell
npm install --save-dev @types/node
```

Después de instalar el paquete @types/node, nuestro compilador ya no se queja de la variable <i>process</i>. Ten en cuenta que no es necesario requerir los tipos para el código, ¡la instalación del paquete es suficiente!


## Mejorando el proyecto

A continuación, agreguemos scripts npm para ejecutar nuestros dos programas, <i>multiplier</i> y <i>calculator</i>:

```json
{
  "name": "fs-open",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts", // highlight-line
    "calculate": "ts-node calculator.ts" // highlight-line
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"
  }
}
```

Podemos hacer que multiplier funcione con los parámetros de la línea de comando con los siguientes cambios

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
```
Y podemos ejecutarlo con:

```shell
npm run multiply 5 2
```

Si el programa se ejecuta con parámetros que no son del tipo correcto, p. ej.

```shell
npm run multiply 5 lol
```

"funciona" pero nos da la respuesta

```shell
Multiplied 5 and NaN, the result is: NaN
```

La razón de esto es que *Number('lol')* devuelve *NaN*, que en realidad es de tipo *number*, por lo que TypeScript no tiene poder para rescatarnos de este tipo de situación.

Para evitar este tipo de comportamientos, tenemos que validar los datos que nos brindan desde la línea de comandos.

La versión mejorada del multiplicador se ve así:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
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
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
```

Cuando ahora ejecutamos el programa

```shell
npm run multiply 1 lol
```

obtenemos un mensaje de error adecuado:

```shell
Something bad happened. Error: Provided values were not numbers!
```

Hay bastante sucediendo en el código. La adición más importante es la función *parseArguments* que se asegura de que los parámetros dados a *multiplicator* sean del tipo correcto. En caso contrario, se lanza una excepción con un mensaje de error descriptivo.

La definición de la función tiene un par de cosas interesantes:

```js
const parseArguments = (args: string[]): MultiplyValues => {
  // ...
}
```

En primer lugar, el parámetro *args* es un [array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) de strings.

El valor de retorno de la función tiene el tipo *MultiplyValues*, que se define de la siguiente manera:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

La definición utiliza la palabra clave [Interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) de TypeScript, que es una forma de definir la "forma" que debe tener un objeto. En nuestro caso, es bastante obvio que el valor de retorno debe ser un objeto con dos propiedades *value1* y *value2*, que deben ser ambas del tipo number.

### La sintaxis alternativa para arrays

Ten en cuenta que también existe una sintaxis alternativa para [arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) en TypeScript. En lugar de escribir

```js
let values: number[];
```

podríamos usar la "sintaxis de genéricos" y escribir

```js
let values: Array<number>;
```

En este curso, normalmente, seguiremos la convención impuesta por la regla de Eslint [array-simple](https://typescript-eslint.io/rules/array-type/#array-simple) que sugiere escribir los arrays simples con la sintaxis [] y usar la sintaxis <> para los más complejos.

</div>

<div class="tasks">

### Ejercicios 9.1.-9.3.

#### setup

Los ejercicios 9.1.-9.7. se realizarán todos en el mismo proyecto de node. Crea el proyecto en un directorio vacío con *npm init* e instale los paquetes ts-node y typescript. Cree también el archivo <i>tsconfig.json</i> en el directorio con el siguiente contenido:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
  }
}
```

La opción del compilador [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), que hace que sea obligatorio tener tipos para todas las variables utilizadas.

#### 9.1 Índice de masa corporal

Crea el código de este ejercicio en el archivo <i>bmiCalculator.ts</i>

Escribe una función *calculateBmi* que cuente el [IMC](https://es.wikipedia.org/wiki/%C3%8Dndice_de_masa_corporal) según la altura (en centímetros) y el peso (en kilogramos) y que luego devuelva un mensaje que se adapte a los resultados.

Llama a la función en el mismo archivo con parámetros fijos e imprime el resultado. El código

```js
console.log(calculateBmi(180, 74))
```

debe imprimir el siguiente mensaje

```sh
Normal (healthy weight)
```

Crea un script npm para ejecutar el programa con el comando <i>npm run calculateBmi</i>

#### 9.2 Calculadora de ejercicio

Crea el código de este ejercicio en el archivo *exerciseCalculator.ts*

Escribe una función *calculateExercises* que calcule el tiempo promedio de las <i>horas diarias de ejercicio</i> y lo compare con la <i>cantidad objetivo</i> de horas diarias y devuelva un objeto que incluya los siguientes valores:

- el numero de días
- el número de días de entrenamiento
- el valor objetivo original
- el tiempo promedio calculado
- valor booleano que describe si se alcanzó el objetivo
- una calificación entre los números 1-3 que indica qué tan bien se cumplen las horas. Puedes decidir la métrica por tu cuenta.
- un valor de texto que explique la calificación, puedes inventar las explicaciones

Las horas de ejercicio diarias se asignan a la función como un [array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) que contiene el número de horas de ejercicio de cada día en el período de entrenamiento. P.ej. una semana con 3 horas de entrenamiento el lunes, ninguna el martes, 2 horas el miércoles, 4,5 horas el jueves y así sucesivamente estaría representada por el siguiente array:

```js
[3, 0, 2, 4.5, 0, 3, 1]
```

Para el objeto Result, debe crear un [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces).

Si llamas a la función con los parámetros *[3, 0, 2, 4.5, 0, 3, 1]* y *2* , debería devolver:

```js
{ periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.9285714285714286
}
```

Crea un script npm *npm run calculateExercises* para llamar a la función con valores fijos.

#### 9.3 Línea de comando

Cambia los ejercicios anteriores para que puedas dar los parámetros de *bmiCalculator* y *exerciseCalculator* como argumentos de línea de comando.

Tu programa podría funcionar, por ejemplo. de la siguiente manera:

```shell
$ npm run calculateBmi 180 91

Overweight
```

y:

```shell
$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{ periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.7222222222222223
}
```

En el ejemplo, el <i>primer argumento</i> es el valor objetivo.

Maneja las excepciones y los errores de manera adecuada. exerciseCalculator debe aceptar entradas de diferentes longitudes. Determina tú mismo cómo recopilar toda la información necesaria.

Un par de cosas para tener en cuenta:

Si defines las funciones en otros módulos, deberías utilizar el [Sistema de módulos de Javascript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules), el cual, es el mismo que hemos utilizado con React cuando la importación es realizada con

```js
import { isNotNumber } from "./utils";
```

y la exportación

```js
export const isNotNumber = (argument: any): boolean =>
  isNaN(Number(argument));

default export "this is the default..."
```

Otra nota: sorprendentemente, por algún motivo TypeScript no permite definir la misma variable en muchos archivos en el "scope de bloque", o sea, fuera de funciones (o clases):

![vs code mostrando error no se puede re-declarar block-scoped variable x](../../images/9/60new.png)

En realidad esto no es del todo cierto. Esta regla solamente aplica a archivos que son tratados como "scripts". Un archivo es un script si no contiene ninguna declaración de exportación o importación. Si un archivo las posee, entonces el archivo es tratado como un [modulo](https://www.typescriptlang.org/docs/handbook/modules.html), <i>y</i> las variables no son definidas en el scope de bloque.

</div>

<div class="content">

### Más acerca de tsconfig

Hasta ahora solo hemos utilizado una regla en tsconfig, [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny). Es un buen lugar para comenzar, pero ahora es el momento de profundizar un poco más en el archivo de configuración.

Como ya mencionamos, el archivo [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) contiene todas tus configuraciones principales sobre cómo deseas que TypeScript funcione en tu proyecto.

Especifiquemos las siguientes configuraciones en nuestro archivo <i>tsconfig.json</i>:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true, // highlight-line
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

No te preocupes demasiado por las *compilerOptions*, haremos una inspección minuciosa más adelante.

Puedes encontrar explicaciones para cada una de las configuraciones en la documentación de TypeScript, o en la muy util [página de tsconfig](https://www.typescriptlang.org/tsconfig), o en la [definición del esquema](http://json.schemastore.org/tsconfig) de tsconfig , que desafortunadamente tiene un formato un poco peor que las dos primeras opciones.

### Añadiendo express a la mezcla

Ahora mismo estamos en un lugar bastante bueno. Nuestro proyecto está configurado y tenemos dos calculadoras ejecutables en él.
Sin embargo, dado que nuestro objetivo es aprender a desarrollar FullStack, es hora de empezar a trabajar con algunas solicitudes HTTP.

Comencemos por instalar express:

```bash
npm install express
```

y luego agrega el script *start* a package.json:

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

Ahora podemos crear el archivo <i>index.ts</i> y escribir el endpoint *ping* de HTTP GET:

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

Todo lo demás parece estar funcionando bien, pero como era de esperar, los parámetros *req* y *res* de *app.get* necesitan tipado. Si observas con atención, VSCode también se queja acerca de la importación de Express. Puedes ver una pequeña línea amarilla de puntos debajo de *require*. Pasemos el cursor sobre el problema:

![vscode alertando sobre cambiar require a import](../../images/9/6.png)

La queja es que la llamada *'require' puede convertirse en un import*. Sigamos los consejos y escribamos el import de la siguiente manera:

```js
import express from 'express';
```

**NB**: VSCode te ofrece una posibilidad para solucionar los problemas de forma automática haciendo clic en el botón <i>Quick fix...</i>. Mantén los ojos abiertos para estas ayudas/soluciones rápidas; escuchar a su editor generalmente hace que su código sea mejor y más fácil de leer. Las correcciones automáticas de problemas también pueden suponer un gran ahorro de tiempo.

Ahora nos encontramos con otro problema: el compilador se queja de la declaración de importación. 
Una vez más, el editor es nuestro mejor amigo cuando tratamos de averiguar cuál es el problema:

![error de vscode acerca de no encontrar express](../../images/9/7.png)

No hemos instalado tipos para <i>express</i>.
Hagamos lo que dice la sugerencia y ejecutemos:

```bash
npm install --save-dev @types/express
```

¡Y no más errores! Echemos un vistazo a lo que cambió.

Cuando pasamos el cursor sobre la declaración *require*, podemos ver que el compilador interpreta todo lo relacionado con express para que sea del tipo *any*.

![vscode mostrando problema de tener un tipo any implícito](../../images/9/8a.png)

Mientras que cuando usamos *import*, el editor conoce los tipos reales:

![vscode mostrando que req es de tipo Request](../../images/9/9x.png)

La declaración de importación que se utilizará depende del método de exportación utilizado en el paquete importado.

Una buena regla general es intentar importar un módulo utilizando primero la declaración *import*. Siempre usaremos este método en el <i>frontend</i>.
Si *import* no funciona, prueba con un método combinado: *import ... = require('...')*.

Te recomendamos encarecidamente que leas más sobre los módulos de TypeScript [aquí](https://www.typescriptlang.org/docs/handbook/modules.html).

Hay un problema más con el código.

![vscode mostrando req declarado pero nunca leído](../../images/9/9b.png)

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

Esta configuración puede crear problemas si tienes funciones predefinidas en la librería que requieran declarar una variable incluso si no se usa en absoluto, como es el caso aquí.
Afortunadamente, este problema ya se ha resuelto a nivel de configuración.
Una vez más, pasar el cursor sobre el problema nos da una solución. Esta vez podemos hacer clic en el botón quick fix:

![vscode quickfix para agregar guion bajo a la variable](../../images/9/14a.png)

Si es absolutamente imposible deshacerse de una variable no utilizada, puede pre-fijarla con un guion bajo para informar al compilador que ha pensado en ello y que no hay nada que pueda hacer.

Cambiemos el nombre de la variable *req* a *_req*. Finalmente estamos listos para iniciar la aplicación. Parece que funciona bien:

![navegador mostrando resultado pong en /ping](../../images/9/11a.png)

Para simplificar el desarrollo, deberíamos habilitar la <i>recarga automática</i> para mejorar nuestro flujo de trabajo. En este curso ya has utilizado <i>nodemon</i>, pero ts-node tiene una alternativa llamada <i>ts-node-dev</i>. Está hecho para ser utilizado solo en un entorno de desarrollo y se encarga de la re-compilación en cada cambio, por lo que no será necesario reiniciar la aplicación.

Instalemos *ts-node-dev* en nuestras dependencias de desarrollo:

```bash
npm install --save-dev ts-node-dev
```

Agreguemos un script a <i>package.json</i>:

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

Y ahora, al ejecutar *npm run dev*, ¡tenemos un entorno de desarrollo que funciona y que se recarga automáticamente para nuestro proyecto!

</div>

<div class="tasks">

### Ejercicios 9.4.-9.5.

#### 9.4 Express

Agrega Express a tus dependencias y crea un endpoint HTTP GET *hello* que responda 'Hello Full Stack!'

La aplicación web debe iniciarse con los comandos *npm start* en modo de producción y con *npm run dev* en modo de desarrollo, este último debe usar *ts-node-dev* para ejecutar la aplicación.

Reemplaza también tu archivo <i>tsconfig.json</i> existente con el siguiente contenido:

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

¡Asegúrate de que no haya errores!

#### 9.5 WebBMI

Agrega un endpoint para la calculadora de IMC que se pueda usar haciendo una solicitud HTTP GET al endpoint *bmi* y especificando el input con [query string parameters](https://en.wikipedia.org/wiki/Query_string). Por ejemplo, para obtener el IMC de una persona que tiene una altura de 180 y un peso de 72, la URL es http://localhost:3002/bmi?height=180&weight=72

La respuesta es un json con este formato:

```js
{
  weight: 72,
  height: 180,
  bmi: "Normal (healthy weight)"
}
```

Consulta la [documentación de Express](http://expressjs.com/en/5x/api.html#req.query) para obtener información sobre cómo acceder a los parámetros de consulta.

Si los parámetros de consulta de la solicitud son del tipo incorrecto o faltan, se proporciona una respuesta con el código de estado y el mensaje de error adecuados:

```js
{
  error: "malformatted parameters"
}
```

No copies el código de la calculadora en el archivo <i>index.ts</i>, conviértelo en un [módulo de Typescript](https://www.typescriptlang.org/docs/handbook/modules.html) que se pueda importar en <i>index.ts</i>.

</div>

<div class="content">

### Los horrrores de *any*

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

![](../../images/9/12a21.png)

Pero si pasa el cursor sobre los valores del request, surge un problema:

![](../../images/9/13a21.png)

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
