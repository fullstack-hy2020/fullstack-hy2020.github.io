---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: es
---

<div class="content">

Ahora que tenemos una comprensión básica de cómo funciona TypeScript y cómo crear pequeños proyectos con él, es hora de comenzar a crear algo realmente útil. Ahora vamos a crear un nuevo proyecto con casos de uso un poco más realistas en mente.

Un cambio importante con respecto a la parte anterior es que <i>ya no usaremos ts-node</i>. Es una herramienta útil y le ayuda a empezar, pero a largo plazo es recomendable utilizar el compilador oficial de TypeScript que viene con el paquete npm de <i>typescript</i>. El compilador oficial genera y empaqueta archivos JavaScript a partir de los archivos .ts para que la <i>versión de producción</i> construida ya no contenga ningún código TypeScript. Este es el resultado exacto al que aspiramos, ya que TypeScript en sí no es ejecutable por navegadores o Node.


### Configurando el proyecto

Crearemos un proyecto para Ilari, a quien le encanta volar aviones pequeños pero tiene dificultades para gestionar su historial de vuelos. Él mismo es bastante coder, por lo que no necesita necesariamente una interfaz de usuario, pero le gustaría usar el software con solicitudes HTTP y conservar la posibilidad de agregar más tarde una interfaz de usuario basada en web a la aplicación.

Comencemos por crear nuestro primer proyecto real 'Diarios de vuelo de Ilari'. Como de costumbre, ejecute <i>npm init</i> e instale el paquete de <i>typescript</i>.

El compilador <i>tsc</i> nativo de TypeScript puede ayudarnos a inicializar nuestro proyecto con el comando <i>tsc --init</i>. Primero debemos agregar el comando <i>tsc</i> a la lista de scripts ejecutables en el archivo package.json (a menos que haya instalado <i>typescript</i> globalmente). 
Incluso si ha instalado TypeScript a nivel global, siempre debe incluirlo como una dependencia de desarrollo en su proyecto.

El script npm para ejecutar <i>tsc</i> se establece de la siguiente manera:

```json
{
  // ..
  "scripts": {
    "tsc": "tsc", // highlight-line
  },
  // ..
}
```
A menudo, el comando <i>tsc</i> simple se agrega a los scripts para que lo usen otros scripts, por lo que es común ver el comando <i>tsc</i> configurado dentro del proyecto de esta manera.

Ahora podemos inicializar nuestra configuración tsconfig.json ejecutando:


```sh
 npm run tsc -- --init
```

**Tenga en cuenta** el extra -- ¡antes del argumento real! Los argumentos antes de -- se interpretan para el comando <i>npm</i> y los posteriores son para el comando que se ejecuta a través del script.


La ejecución del script crea un archivo <i>tsconfig.json</i>, que contiene una lista larga de todas las configuraciones disponibles para nosotros. Sin embargo, solo unos pocos no han sido comentados. 
Estudiar el archivo <i>tsconfig.json</i> inicial puede ser útil para encontrar algunas opciones de configuración que pueda necesitar. 
También está completamente bien mantener las filas comentadas en el archivo en caso de que algún día necesite expandir sus ajustes de configuración.


La configuración que queremos ahora mismo es la siguiente:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Repasemos cada configuración:

La configuración <i>target</i> le dice al compilador qué versión de ECMAScript usar para el JavaScript generado. ES6 es compatible con la mayoría de los navegadores y es una opción buena y bastante segura.

<i>outDir</i> indica dónde debe colocarse el código compilado.

<i>module</i> le dice al compilador que queremos usar los módulos de <i>commonjs</i> en el código compilado. Esto significa que podemos usar _require_ en lugar de _import_, que no es compatible con versiones anteriores de Node.js, como la versión 10.

<i>strict</i> es en realidad una abreviatura de varias opciones independientes:

<i>noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes y strictPropertyInitialization</i>. 
Estos guían nuestro estilo de codificación para usar las funciones de TypeScript de manera más estricta. 
Para nosotros quizás el más importante sea el que ya hemos visto [noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny). Impide establecer implícitamente el tipo <i>any</i>, lo que puede suceder si no escribe los parámetros de una función, por ejemplo. 
Los detalles del resto de las configuraciones se pueden encontrar en la [documentación de tsconfig](https://www.staging-typescript.org/tsconfig#strict). El uso de <i>strict</i> es sugerido por la documentación oficial.

<i>noUnusedLocals</i> evita tener variables locales sin usar, y <i>noUnusedParameters</i> arroja un error si una función tiene parámetros sin usar.

<i>noFallthroughCasesInSwitch</i> asegura que en un _switch case_ cada caso termina con una declaración _return_ o _break_.

<i>esModuleInterop</i> permite la interoperabilidad entre los módulos commonJS y ES; consulte más en la [documentación](https://www.staging-typescript.org/tsconfig#esModuleInterop).

Ahora que tenemos nuestra configuración preferida, continuemos instalando <i>express</i> y, por supuesto, también <i>@types/express</i>. Dado que este es un proyecto real, que está destinado a crecer con el tiempo, usaremos eslint desde el principio:s

```sh
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Ahora nuestro <i>package.json</i> debería verse así:

```json
{
  "name": "ilaris-flight-diaries",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "tsc": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.2",
    "@typescript-eslint/eslint-plugin": "^2.17.0",
    "@typescript-eslint/parser": "^2.17.0",
    "eslint": "^6.8.0",
    "typescript": "^3.7.5"
  }
}
```

También creamos <i>.eslintrc</i> con el siguiente contenido:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": [
        "error", { "argsIgnorePattern": "^_" }
    ],
     "@typescript-eslint/no-explicit-any": 1,
    "no-case-declarations": 0
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

Ahora solo necesitamos configurar nuestro entorno de desarrollo y estamos listos para comenzar a escribir código serio. 
Hay muchas opciones diferentes para esto. Podríamos usar el conocido <i>nodemon</i> con <i>ts-node</i>, pero como vimos anteriormente, </i>ts-node-dev</i> hace exactamente lo mismo y podemos continuar usándolo. Entonces, instalemos </i>ts-node-dev</i>

```sh
npm install --save-dev ts-node-dev
```

Y estamos listos para comenzar a escribir algo de código después de definir un par de scripts npm más:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts", // highlight-line
    "lint": "eslint --ext .ts ." // highlight-line
  },
  // ...
}
```

Hay muchas cosas por las que pasar antes de que pueda comenzar la codificación real. Cuando se trabaja con un proyecto real, los preparativos cuidadosos respaldan en gran medida su proceso de desarrollo. 
Tómese el tiempo para crear un buen escenario para usted y su equipo para que, a la larga, todo funcione sin problemas.

### Que haya código

¡Ahora finalmente podemos empezar a codear! Como siempre, comenzamos creando un ping-endpoint, solo para asegurarnos de que todo esté funcionando.

El contenido del archivo <i>index.ts</i>:

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Ahora, si ejecutamos la aplicación con <i>npm run dev</i>, podemos verificar que una solicitud a http://localhost:3000/ping da una respuesta <i>pong</i>, ¡así que nuestra configuración está lista!

Al iniciar la aplicación con <i>npm run dev</i>, se ejecuta en modo de desarrollo. 
El modo de desarrollo no es adecuado en absoluto cuando luego operamos la aplicación en producción.

Intentemos crear una <i>compilación de producción</i> ejecutando el compilador de TypeScript. Dado que hemos definido el <i>outdir</i> en nuestro tsconfig.json, realmente no hay nada más que hacer que ejecutar el script <i>npm run tsc</i>.

Al igual que por arte de magia, se crea una compilación de producción de JavaScript ejecutable nativa del backend express en la <i>compilación</i> del directorio.

Actualmente, si ejecutamos eslint, también interpretará los archivos en el directorio de <i>compilación</i>. No queremos eso, ya que el código es generado por el compilador. Podemos evitar esto creando un archivo <i>.eslintignore</i> que enumere el contenido que queremos que eslint ignore, tal como lo hacemos con git y <i>gitignore</i>.

Agreguemos un script npm para ejecutar la aplicación en modo de producción:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts .",
    "start": "node build/index.js" // highlight-line
  },
  // ...
}
```

Cuando ejecutamos la aplicación con <i>npm start</i>, podemos verificar que también funciona la compilación de producción

![](../../images/9/15a.png)


Ahora tenemos una cartera de trabajo mínima para desarrollar nuestro proyecto. 
Con la ayuda de nuestro compilador y eslint, también asegura que se mantenga una buena calidad de código. Con esta base, podemos comenzar a crear una aplicación que luego podríamos implementar en un entorno de producción.

</div>

<div class="tasks">

### Ejercicios 9.8.-9.9.

**Antes de comenzar los ejercicios**

Para este conjunto de ejercicios, desarrollará un backend para un proyecto existente llamado <i>Patientor</i>, que es una aplicación simple de registro médico para médicos que manejan diagnósticos e información básica de salud de sus pacientes.

El [frontend](https://github.com/fullstack-hy2020/patientor) ya ha sido creado por expertos externos y su tarea es crear un backend para admitir el código existente.

#### 9.8: Patientor backend, paso 1

Inicialice el proyecto que será utilizado por el frontend. Configure eslint y tsconfig con las mismas configuraciones que se utilizan en el material. Defina un endpoint que responda a las solicitudes HTTP GET para enrutar <i>/ping</i>.

El proyecto debería poder ejecutarse con scripts npm tanto en modo de desarrollo como código compilado en modo de producción.

#### 9.8: Patientor backend, paso 

Haz un fork y clone el proyecto [patientor](https://github.com/fullstack-hy2020/patientor). Inicie el proyecto con la ayuda del archivo README. Debería poder usar el frontend sin un backend que funcione.

Asegúrese de que el backend responda a la solicitud de ping que el frontend ha realizado al inicio. Verifique la herramienta para desarrolladores para asegurarse de que realmente funcione:

![](../../images/9/16a.png)

Es posible que también desee echar un vistazo a la pestaña <i>console<i>. Si algo falla, la [parte 3](/es/part3) del curso muestra cómo se puede resolver el problema.

</div>

<div class="content">

### Implementando la funcionalidad

Finalmente estamos listos para empezar a escribir código.

Empecemos por lo básico. Ilari quiere poder realizar un seguimiento de sus experiencias en sus viajes aéreos.

Quiere poder guardar las </i>entradas del diario</i> que contengan:

- La fecha de la entrada
- Condiciones meteorológicas (good, windy, rainy or stormy)(bueno, ventoso, lluvioso o tormentoso)
- Visibilidad (good, ok or poor)(buena, regular o mala)
- Texto libre detallando la experiencia

Hemos obtenido algunos datos de muestra, que utilizaremos como base para construir. 
Los datos se guardan en formato json y se pueden encontrar [aquí](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json).

Los datos tienen el siguiente aspecto

```json
[
  {
    "id": 1,
    "date": "2017-01-01",
    "weather": "rainy",
    "visibility": "poor",
    "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  {
    "id": 2,
    "date": "2017-04-01",
    "weather": "sunny",
    "visibility": "good",
    "comment": "Everything went better than expected, I'm learning much"
  },
  // ...
]
```

Comencemos por crear un endpoint que devuelva todas las entradas del diario de vuelo.

Primero necesitamos tomar algunas decisiones sobre cómo estructurar nuestro código fuente. Es mejor colocar todo el código fuente en el directorio <i>src</i>, para que el código fuente no se mezcle con los archivos de configuración. 
Nos trasladaremos <i>index.ts</i> allí y hacer los cambios necesarios a los scripts npm.

Colocaremos todos los [routers](/es/part4/structure_of_backend_application_introduction_to_testing), módulos que se encargan de manejar un conjunto de recursos específicos como <i>diaries</i>, bajo el directorio <i>src/routes</i>. 
Esto es un poco diferente a lo que hicimos en la [parte 4](/es/part4), donde usamos el directorio <i>src/controllers</i>.

El router que se encarga de todos los endpoints del diario está en <i>src/routes/diaries.ts</i> y tiene este aspecto:

```js
import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Fetching all diaries!');
})

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
})

export default router;
```

Enrutaremos todas las solicitudes al prefijo <i>/api/diaries</i> a ese router específico en _index.ts_


```js
import express from 'express';
import diaryRouter from './routes/diaries'; // highlight-line
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter); // highlight-line


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Y ahora, si hacemos una solicitud HTTP GET a http://localhost:3000/api/diaries, deberíamos ver el mensaje <i>Fetching all diaries!</i>.

A continuación, debemos comenzar a servir los datos (que se encuentran [aquí](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)) desde la aplicación. Obtendremos los datos y los guardaremos en <i>data/diaries.json</i>.

No escribiremos el código para las manipulaciones de datos reales en el router. En su lugar, crearemos un <i>service</i> que se encargue de la manipulación de datos. Es una práctica bastante común separar la "lógica empresarial" del código del router en sus propios módulos, que a menudo se denominan <i>service</i>. El servicio de nombres se origina en un [diseño impulsado por dominios](https://en.wikipedia.org/wiki/Domain-driven_design) y se hizo popularcon el framework [Spring](https://spring.io/).

Vamos a crear un <i>src/services</i> de directorio y coloquemos el archivo <i>diaryService.ts</i> en él. 
El archivo contiene dos funciones para buscar y guardar entradas del diario:


```js
import diaryData from '../../data/diaries.json'

const getEntries = () => {
  return diaryData;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
```

Pero algo no esta bien

![](../../images/9/17c.png)

La sugerencia dice que podríamos querer usar <i>resolveJsonModule</i>. Agreguémoslo a nuestro tsconfig:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true // highlight-line
  }
}
```

Y nuestro problema está resuelto.

> **NB**: Por alguna razón, VSCode tiende a quejarse de que no puede encontrar el archivo <i>../../data/diaries.json</i> del servicio a pesar de que el archivo existe. Eso es un error en el editor y desaparece cuando se reinicia el editor.

Anteriormente vimos cómo el compilador puede decidir el tipo de variable por el valor que se le asigna. De manera similar, el compilador puede interpretar grandes conjuntos de datos que constan de objetos y matrices. Debido a esto, el compilador puede advertirnos si intentamos hacer algo sospechoso con los datos json que estamos manejando. Por ejemplo, si estamos manejando un array que contiene objetos de un tipo específico, y tratamos de agregar un objeto que no tiene todos los campos que tienen los otros objetos, o tiene conflictos de tipos (por ejemplo, un número donde debería haber un string), el compilador puede darnos una advertencia.

Aunque el compilador es bastante bueno para asegurarse de que no hagamos nada no deseado, es más seguro definir los tipos de datos nosotros mismos.

Actualmente tenemos una aplicación básica de TypeScript express que funciona, pero apenas hay <i>typings</i> real en el código. Dado que sabemos qué tipo de datos deben aceptarse para los campos meteorológicos y de visibilidad, no hay razón para que no incluyamos sus tipos en el código.

Creemos un archivo para nuestros tipos, <i>types.ts</i>, donde definiremos todos nuestros tipos para este proyecto.

Primero, escriba los valores de <i>Weather</i>(clima) y <i>Visibility</i>(visibilidad) utilizando un [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) de las strings permitidas:

```js
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

Y a partir de ahí podemos continuar creando un tipo DiaryEntry, que será un [interface](http://www.typescriptlang.org/docs/handbook/interfaces.html):

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

Ahora podemos intentar escribir nuestro json importado:

```js
import diaryData from '../../data/diaries.json';

import { DiaryEntry } from '../types'; // highlight-line

const diaries: Array<DiaryEntry> = diaryData; // highlight-line

const getEntries = (): Array<DiaryEntry> => { // highlight-line
  return diaries; // highlight-line
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
```
Pero dado que el json ya tiene sus valores declarados, asignar un tipo para el conjunto de datos da como resultado un error:

![](../../images/9/19b.png)

El final del mensaje de error revela el problema: los campos <i>weather</i> son incompatibles. En <i>DiaryEntry</i> especificamos que su tipo es <i>Weather</i>, pero el compilador de TypeScript había inferido que su tipo era string .

Podemos solucionar el problema haciendo una [afirmación de tipo](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions). Esto debe hacerse solo si estamos seguros de que sabemos lo que estamos haciendo. Si afirmamos que el tipo de la variable <i>diaryData</i> es <i>DiaryEntry</i> con la palabra clave <i>as</i>, todo debería funcionar:

```js
import diaryData from '../../data/entries.json'

import { Weather, Visibility, DiaryEntry } from '../types'

const diaries: Array<DiaryEntry> = diaryData as Array<DiaryEntry>; // highlight-line

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addEntry = () => {
  return null
}

export default {
  getEntries,
  addEntry
};
```

Nunca deberíamos usar la aserción de tipo a menos que no haya otra forma de proceder, ya que siempre existe el peligro de afirmar un tipo no apto para un objeto y causar un error de ejecución desagradable. Si bien el compilador confía en que sepa lo que está haciendo cuando usa <i>as</i>, al hacer esto, no estamos usando toda la potencia de TypeScript, sino que confiamos en el codificador para asegurar el código.

En nuestro caso, podríamos cambiar la forma en que exportamos nuestros datos para poder escribirlos dentro del archivo de datos. Dado que no podemos usar typings en un archivo JSON, deberíamos convertir el archivo json en un archivo ts que exporta los datos escritos así:

```js
import { DiaryEntry } from "../src/types";

const diaryEntries: Array<DiaryEntry> = [
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries;
```

Ahora, cuando importamos el array, el compilador la interpreta correctamente y los campos <i>weather</i> y <i>visibility</i> se entienden correctamente:


```js
import diaries from '../../data/diaries'; // highlight-line

import { DiaryEntry } from '../types';

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addEntry = () => {
  return null;
}

export default {
  getEntries,
  addEntry
};
```

Tenga en cuenta que si queremos poder guardar entradas sin un campo determinado, por ejemplo, <i>comment</i>, podríamos establecer el tipo de campo como [opcional](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) agregando <i>?</i> a la declaración de tipo:

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

### Módulos de Node y JSON

Es importante tomar nota de un problema que puede surgir al usar la opción tsconfig [resolveJsonModule](https://www.typescriptlang.org/en/tsconfig#resolveJsonModule):

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true // highlight-line
  }
}
```

De acuerdo con la documentación del nodo para los [módulos de archivo](https://nodejs.org/api/modules.html#modules_file_modules), node intentará resolver los módulos en orden de extensiones:

```sh
 ["js", "json", "node"]
```

Además de eso, de forma predeterminada, <i>ts-node</i> y <i>ts-node-dev</i> amplían la lista de posibles extensiones de módulo de node a:

```sh
 ["js", "json", "node", "ts", "tsx"]
```

> **NB**: La validez de los archivos <i>.js</i>, <i>.json</i> y <i>.node</i> como módulos en Typecript depende de la configuración del entorno, incluidas las opciones <i>tsconfig</i> como <i>allowJs</i> y <i>resolveJsonModule</i>.

Considere una estructura de carpeta plana que contiene archivos:

```sh
  ├── myModule.json
  └── myModule.ts
```

En typescript, con la opción <i>resolveJsonModule</i> establecida en true, el archivo <i>myModule.json</i> se convierte en un módulo de nodo válido. Ahora, imagine un escenario en el que deseamos utilizar el archivo <i>myModule.ts</i>:

```js
import myModule from "./myModule";
```

Mirando de cerca el orden de las extensiones de módulo de node:

```sh
 ["js", "json", "node", "ts", "tsx"]
```

Notamos que la extensión de archivo <i>.json</i> tiene prioridad sobre <i>.ts</i>, por lo que se importará <i>myModule.json</i> y no <i>myModule.ts</i>.

Para evitar errores, se recomienda que dentro de un directorio plano, cada archivo con una extensión de módulo de node válida tenga un nombre de archivo único.

### Tipos de utilidad

A veces, es posible que deseemos utilizar una modificación específica de un tipo. Por ejemplo, considere una página para enumerar algunos datos, algunos de los cuales son confidenciales y otros no. Es posible que deseemos estar seguros de que no se utilizan ni se muestran datos sensibles. Podríamos elegir los campos de un tipo que permitamos que se utilicen para hacer cumplir esto. Podemos hacer eso usando el tipo de utilidad [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk).

En nuestro proyecto, deberíamos considerar que Ilari podría querer crear una lista de todas las entradas de su diario excluyendo el campo de comentarios, ya que durante un vuelo muy aterrador podría terminar escribiendo algo que no necesariamente querría mostrarle a nadie más.

El tipo de utilidad [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) nos permite elegir qué campos de un tipo existente queremos usar. Pick se puede utilizar para construir un tipo completamente nuevo o para informar a una función lo que debería devolver en tiempo de ejecución. Los tipos de utilidad son un tipo especial de herramientas de tipo, pero se pueden utilizar como los tipos normales.

En nuestro caso, para crear una versión "censurada" de <i>DiaryEntry</i> para pantallas públicas, podemos usar Pick en la declaración de función:

```js
const getNonSensitiveEntries =
  (): Array<Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>> => {
    // ...
  }
```

y el compilador esperaría que la función devolviera un array de valores del tipo DiaryEntry modificado, que incluye solo los cuatro campos seleccionados.

Dado que [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) requiere que el tipo que modifica se proporcione como una [variable de tipo](http://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), al igual que Array, ahora tenemos dos variables de tipo anidadas y la sintaxis está empezando a parecer un poco extraña. Podemos mejorar la legibilidad del código utilizando la sintaxis de array [alternativa](http://www.typescriptlang.org/docs/handbook/basic-types.html#array):

```js
const getNonSensitiveEntries =
  (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
    // ...
  }
```

En este caso, queremos excluir solo un campo, por lo que aún mejor sería usar el tipo de utilidad [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk), que podemos usar para declarar qué campos excluir:

```js
const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
  // ...
}
```

Otra forma sería declarar un tipo completamente nuevo para <i>NonSensitiveDiaryEntry</i>:

```js
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

El código ahora se convierte en

```js
import diaries from '../../data/diaries';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => { // highlight-line
  return diaries;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry,
  getNonSensitiveEntries // highlight-line
};
```

Una cosa en nuestra aplicación es motivo de preocupación. En <i>getNonSensitiveEntries</i> estamos devolviendo las entradas completas del diario, ¡y no se da ningún error a pesar de typing!

Esto sucede porque [TypeScript solo verifica](http://www.typescriptlang.org/docs/handbook/type-compatibility.html) si tenemos todos los campos obligatorios o no, pero los campos en exceso no están prohibidos. En nuestro caso esto significa que <i>no está prohibido</i> devolver un objeto de tipo <i>DiaryEntry[]</i>, pero si intentáramos acceder al campo <i>comment</i>, no sería posible porque estaríamos accediendo a un campo que TypeScript desconoce incluso aunque existe.

Desafortunadamente, esto puede provocar un comportamiento no deseado si no es consciente de lo que está haciendo; la situación es válida en lo que respecta a TypeScript, pero lo más probable es que esté permitiendo un uso no deseado. Si ahora devolviéramos todos los diaryEntries de la función <i>getNonSensitiveEntries</i> al <i>frontend</i>, en realidad estaríamos filtrando los campos no deseados al navegador solicitante, ¡incluso aunque nuestros tipos parezcan implicar lo contrario!

Debido a que TypeScript no modifica los datos reales, sino solo su tipo, debemos excluir los campos nosotros mismos:

```js
import diaries from '../../data/entries.js'

import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// highlight-start
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry [] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// highlight-end

const addDiary = () => {
  return []
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

Si ahora intentamos devolver estos datos con el tipo básico <i>DiaryEntry</i>, es decir, si escribiéramos la función de la siguiente manera


```js
const getNonSensitiveEntries = () : DiaryEntry[] => {
```

obtendríamos el siguiente error:

![](../../images/9/22b.png)

Nuevamente, la última línea del mensaje de error es la más útil. Deshagamos esta modificación no deseada.

Los tipos de utilidades incluyen muchas herramientas útiles y definitivamente vale la pena tomarse un tiempo para estudiar [la documentación](https://www.typescriptlang.org/docs/handbook/utility-types.html).

Finalmente, podemos completar la ruta que devuelve todas las entradas del diario:

```js
import express from 'express';
import diaryService from '../services/diaryService';  // highlight-line

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries()); // highlight-line
});

router.post('/', (_req, res) => {
    res.send('Saving a diary!');
});

export default router;
```

La respuesta es lo que esperamos que sea

![](../../images/9/26.png)

</div>

<div class="tasks">

###  Ejercicios 9.10.-9.11.

De manera similar al servicio de vuelo de Ilari, no usamos una base de datos real en nuestra aplicación, sino que usamos datos codificados, es decir, en los archivos [diagnoses.json](https://github.com/fullstack-hy2020/misc/blob/master/diagnoses.json) y [patients.json](https://github.com/fullstack-hy2020/misc/blob/master/patients.json). Obtenga los archivos y guárdelos en un directorio llamado <i>data</i> en su proyecto. Toda la modificación de datos se puede realizar en la memoria de ejecución, por lo que durante esta parte <i>no es necesario escribir en un archivo</i>.

#### 9.10: Patientor backend, paso 3

Cree un tipo <i>Diagnose</i> y utilícelo para crear endpoint <i>/api/diagnoses</i> para obtener todos los diagnósticos con HTTP GET.

Estructura tu código correctamente utilizando directorios y archivos con nombres significativos.

**Tenga en cuenta**  que los diagnósticos pueden contener o no el campo <i>latin</i>. Es posible que desee utilizar [propiedades opcionales](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) en la definición de tipo.

####  9.11: Patientor backend, paso 
Cree el tipo de dato <i>Patient</i> y configure un endpoint GET <i>/api/patients</i> que devuelva todos los pacientes al frontend, excluyendo el campo <i>ssn</i>. Utilice un [tipo de utilidad](https://www.typescriptlang.org/docs/handbook/utility-types.html) para asegurarse de que está seleccionando y devolviendo solo los campos deseados.

En este ejercicio, puede asumir que el campo <i>gender</i> tiene el tipo <i>string</i>.

Pruebe el endpoint con el navegador y asegúrese de que <i>ssn</i> no esté incluido en la respuesta:

![](../../images/9/22g.png)

Después de crear el endpoint, asegúrese de que el <i>frontend</i> muestre la lista de pacientes:

![](../../images/9/22h.png)

</div>

<div class="content">

###  Evitar un resultado undefined accidental

Extendamos el backend para admitir la obtención de una entrada específica con una solicitud HTTP GET para enrutar <i>api/diaries/:id</i>.

El DiaryService debe ampliarse con la función <i>findById</i>:

```js
// ...

// highlight-start
const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};
// highlight-end

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById // highlight-line
}
```

Pero una vez más, surge un nuevo problema:

![](../../images/9/23e.png)

El problema es que no hay garantía de que se pueda encontrar una entrada con la identificación especificada. Es bueno que seamos conscientes de este problema potencial ya en la fase de compilación. Sin TypeScript no se nos advertiría sobre este problema y, en el peor de los casos, podríamos haber terminado devolviendo un objeto <i>undefined</i> en lugar de informar al usuario que no se ha encontrado la entrada especificada.

En primer lugar, en casos como este, debemos decidir cuál debe ser el <i>valor de retorno</i> si no se encuentra un objeto y cómo se debe manejar el caso. El método de búsqueda de una matriz devuelve indefinido si no se encuentra el objeto, y esto está bien para nosotros. Podemos resolver nuestro problema escribiendo el valor de retorno de la siguiente manera

```js
const findById = (id: number): DiaryEntry | undefined => { // highlight-line
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

El controlador de ruta es el siguiente


```js
import express from 'express';
import diaryService from '../services/diaryService'

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
})

// ...

export default router;
```

### Agregar un nuevo diario

Comencemos a construir el endpoint HTTP POST para agregar nuevas entradas al diario de vuelo. Las nuevas entradas deben tener el mismo tipo que los datos existentes.

El manejo del código de la respuesta es el siguiente

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addEntry(
    date,
    weather,
    visibility,
    comment,
  );
  res.json(newDiaryEntry);
});
```

El método correspondiente en <i>diaryService</i> se ve así

```js
import {
  NonSensitiveDiaryEntry,
  DiaryEntry,
  Visibility, // highlight-line
  Weather // highlight-line
} from '../types';


const addEntry = (
    date: string, weather: Weather, visibility: Visibility, comment: string
  ): DiaryEntry => {

  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    date,
    weather,
    visibility,
    comment,
  }

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

Como puede ver, la función <i>addDiary</i> se está volviendo bastante difícil de leer ahora que tenemos todos los campos como parámetros separados. Podría ser mejor simplemente enviar los datos como un objeto a la función:

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addDiary({ // highlight-line
    date,
    weather,
    visibility,
    comment,
  }); // highlight-line
  res.json(newDiaryEntry);
})
```

Pero espera, ¿cuál es el tipo de este objeto? No es exactamente una <i>DiaryEntry</i>, ya que todavía le falta el campo de <i>id</i>. Podría ser útil crear un nuevo tipo, <i>NewDiaryEntry</i>, para una entrada aún no guardada. Vamos a crearlo en <i>types.ts</i> usando el tipo <i>DiaryEntry</i> existente y el tipo de utilidad [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk):

```js
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

Ahora podemos usar el nuevo tipo en nuestro DiaryService y desestructurar el nuevo objeto de entrada al crear una entrada para guardar:


```js
import { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

// ...

const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {  // highlight-line
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry // highlight-line
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

¡Ahora el código se ve mucho más limpio!

Para parsear los datos entrantes debemos tener configurado el middleware <i>json</i>:


``` js
import express from 'express';
import diaryRouter from './routes/diaries';
const app = express();
app.use(express.json()); // highlight-line

const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

¡Ahora la aplicación está lista para recibir solicitudes HTTP POST para nuevas entradas del diario del tipo correcto!

### Solicitudes de revisión

Hay muchas cosas que pueden salir mal cuando aceptamos datos de fuentes externas. Las aplicaciones rara vez funcionan completamente por sí solas y nos vemos obligados a vivir con el hecho de que no se puede confiar plenamente en los datos de fuentes externas a nuestro sistema. Cuando recibimos datos de una fuente externa, no hay forma de que ya estén escritos cuando los recibimos. Necesitamos tomar decisiones sobre cómo manejar la incertidumbre que viene con esto.

Express maneja el parsing del cuerpo de la solicitud afirmando el tipo [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) en todos los campos del cuerpo. En nuestro caso, esto no es evidente en el editor, pero si comenzamos a mirar las variables más de cerca y pasamos el cursor sobre cualquiera de ellas, podemos ver que cada una de ellas es de tipo [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any). El editor no se queja de ninguna manera cuando pasamos estos datos a la función <i>addDiary</i> como parámetros:

![](../../images/9/27.png)

El valor de tipo [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#an) puede asignarse a cualquier tipo de variable, ya que <i>podría ser</i> el tipo deseado. Definitivamente no es seguro confiar en esto, así que siempre verifique los valores entrantes (independientemente de si estamos usando TypeScript o no).

Podríamos simplemente agregar comprobaciones simples <i>exists</i> y <i>is-value-valid</i> a la función que define la ruta, es mejor escribir la lógica de parsing y validación en un archivo separado <i>utils.ts</i>.

Necesitamos definir una función <i>toNewDiaryEntry</i> que reciba el cuerpo de la solicitud como parámetro y devuelva un objeto <i>NewDiaryEntry</i> debidamente tipado. La definición de ruta usa la función de la siguiente manera

```js
import toNewDiaryEntry from '../utils'; // highlight-line

// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body); // highlight-line

    const addedEntry = diaryService.addDiary(newDiaryEntry); // highlight-line
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
```

Dado que ahora estamos creando un código seguro y tratando de asegurarnos de obtener exactamente los datos que queremos de las solicitudes, debemos comenzar a parsear y validar cada campo que esperamos recibir.

El esqueleto de la función <i>toNewDiaryEntry</i> se parece a lo siguiente:

```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default toNewDiaryEntry;
```

La función debe parsear cada campo y asegurarse de que el valor de retorno sea exactamente del tipo <i>NewDiaryEntry</i>. Esto significa que debemos verificar cada campo por separado.

Una vez más tenemos un problema de tipo: ¿cuál es el tipo de <i>objeto</i>? Dado que el <i>objeto</i> es de hecho el cuerpo de una solicitud, Express lo ha escrito como <i>any</i>. Dado que la idea de esta función es mapear campos de tipo desconocido a campos del tipo correcto y verificar si están definidos como se espera, este podría ser el caso poco común en el que realmente <i>queramos permitir el tipo <i>any</i> </i>.

Sin embargo, si escribimos el objeto como <i>any</i>, eslint nos da una queja:

![](../../images/9/24e.png)

Esto se debe a la regla de eslint [no-explicit-any](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md) que nos impide establecer explícitamente el tipo en <i>any</i>. En general, esta es una buena regla y no es deseada solo en este archivo en particular. Podemos permitir el uso de <i>any</i> en este archivo deshabilitando la regla eslint en el archivo. Esto sucede agregando la siguiente línea al archivo:

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
```

Comencemos a crear los parsers para cada uno de los campos del <i>objecti</i>.

Para validar el campo <i>comment</i>, debemos verificar que exista y asegurarnos de que sea del tipo <i>string</i>.

La función debería verse así:

```js
const parseComment = (comment: any): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment: ' + comment);
  }

  return comment;
}
```

La función obtiene un parámetro de tipo <i>any</i> y lo devuelve como tipo <i>string</i> si existe y es del tipo correcto.

La función de validación de string se ve así

```js
const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

La función es un [tipo de protección](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards). Eso significa que es una función que devuelve un booleano <i>y</i> que tiene un <i>predicado</i> de tipo como tipo de retorno. En nuestro caso, el tipo de predicado es


```js
text is string
```

La forma general de un predicado de tipo es _parameterName is Type_ donde el _parameterName_ es el nombre del parámetro de función y _Type_ es el tipo de destino.

Si la función de protección de tipos devuelve verdadero, el compilador de TypeScript sabe que la variable probada tiene el tipo que se definió en el predicado de tipo.

Antes de que se llame al tipo de protección, el tipo real de la variable <i>comment</i> no se conoce:

![](../../images/9/28e.png)

Pero después de la llamada, si el código pasa de la excepción (es decir, el tipo guard devuelto verdadero), el compilador sabe que <i>comment</i> es del tipo <i>string</i>:

![](../../images/9/29e.png)

¿Por qué tenemos dos condiciones en la protección de tipo de string?

```js
const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String; // highlight-line
}
```

¿No sería suficiente escribir la protección así?

```js
const isString = (text: any): text is string => {
  return typeof text === 'string';
}
```

Lo más probable es que la forma más simple sea lo suficientemente buena para todos los propósitos prácticos. Sin embargo, si queremos estar absolutamente seguros, se necesitan ambas condiciones. Hay dos formas diferentes de crear objetos de strings en JavaScript que funcionan de manera un poco diferente con respecto a los operadores <i>typeof</i> e <i>instanceof</i>:

```js
const a = "I'm a string primitive";
const b = new String("I'm a String Object");
typeof a; --> returns 'string'
typeof b; --> returns 'object'
a instanceof String; --> returns false
b instanceof String; --> returns true
```

Sin embargo, es poco probable que alguien cree un string con una función de constructor. Lo más probable es que la versión más simple de la protección de tipos esté bien.

A continuación, consideremos el campo <i>date</i>. Parsear y validar el objeto date es bastante similar a lo que hicimos con los comentarios. Dado que TypeScript realmente no conoce un tipo para una fecha, debemos tratarlo como un <i>string</i>. Sin embargo, deberíamos seguir utilizando la validación de nivel de JavaScript para comprobar si el formato de fecha es aceptable.

Agregaremos las siguientes funciones

```js
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

El código no es nada especial. Lo único es que no podemos usar un tipo de protección aquí ya que una fecha en este caso solo se considera un <i>string</i>. Tenga en cuenta que aunque la función <i>parseDate</i> acepta la variable <i>date</i> como any, después de verificar el tipo con <i>isString</i>, su tipo se establece como string, por lo que podemos dar la variable a la función <i>isDate</i> que requiere un string sin ningún problema.

Finalmente, estamos listos para pasar a los dos últimos tipos, Weather y Visibility.

Nos gustaría que la validación y el parsing funcionaran de la siguiente manera:

```js
const parseWeather = (weather: any): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather)
  }
  return weather;
};
```

La pregunta es, ¿cómo podemos validar que el string tiene una forma específica? Una forma posible de escribir el tipo de protección sería la siguiente:

```js
const isWeather = (str: string): str is Weather => {
  return ['sunny', 'rainy', 'cloudy', 'stormy' ].includes(str);
};
```

Esto funcionaría bien, pero el problema es que la lista de posibles condiciones meteorológicas no se mantiene necesariamente sincronizada con las definiciones de tipo si el tipo se modifica. Ciertamente, esto no es bueno, ya que nos gustaría tener una sola fuente para todos los posibles tipos de clima.

En nuestro caso, una mejor solución sería mejorar el tipo Weather real. En lugar de un alias de tipo, deberíamos usar [enum](https://www.typescriptlang.org/docs/handbook/enums.html) de Typescript, que nos permite usar los valores reales en nuestro código en tiempo de ejecución, no solo en la fase de compilación.

Redefinamos el tipo <i>Weather</i> de la siguiente manera:

```js
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}
```

Ahora podemos comprobar que un string es uno de los valores aceptados, y el tipo de protección se puede escribir así:

```js
const isWeather = (param: any): param is Weather => {
  return Object.values(Weather).includes(param);
};
```

Una cosa a tener en cuenta aquí es que hemos cambiado el tipo de parámetro a <i>any</i>. Si sería string, la verificación <i>includes</i> no se compilará. Esto también tiene sentido si considera la posibilidad de reutilizar la función. Permitiendo <i>any</i> como parámetro, la función se puede usar con confianza sabiendo que, independientemente de lo que le demos, la función siempre nos dice si la variable es un clima válido o no.

La función <i>parseWeather</i> se puede simplificar un poco

```js
const parseWeather = (weather: any): Weather => {
  if (!weather || !isWeather(weather)) { // highlight-line
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

Surge un problema después de estos cambios. Nuestros datos ya no se ajustan a nuestros tipos:

![](../../images/9/30.png)

Esto se debe a que no podemos simplemente asumir que un stringes una enumeración.

Podemos solucionar esto asignando los elementos de datos iniciales al tipo de <i>DiaryEntry</i> con la función <i>toNewDiaryEntry</i>:

```js
import { DiaryEntry } from "../src/types";
import toNewDiaryEntry from "../src/utils";

const data = [
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
]

const diaryEntries: DiaryEntry [] = data.map(obj => {
  const object = toNewDiaryEntry(obj) as DiaryEntry
  object.id = obj.id
  return object
})

export default diaryEntries
```

Tenga en cuenta que, dado que <i>toNewDiaryEntry</i> devuelve un objeto del tipo <i>NewDiaryEntry</i>, debemos afirmar que sea <i>DiaryEntry</i> con el operador [as](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions).

Las enumeraciones se utilizan generalmente cuando hay un conjunto de valores predeterminados que no se espera que cambien en el futuro. Por lo general, las enumeraciones se usan para valoresmucho más estrictos que no cambian (por ejemplo, días de semana, meses, direcciones), pero dado que nos ofrecen una excelente manera de validar nuestros valores entrantes, también podríamos usarlos en nuestro caso.

Todavía tenemos que darle el mismo tratamiento a <i>visibility</i>. La enumeración se ve a continuación:

```js
export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}
```

El tipo de protección y el parser están debajo

```js
const isVisibility = (param: any): param is Visibility => {
  return Object.values(Visibility).includes(param);
};

const parseVisibility = (visibility: any): Visibility => {
  if (!visibility || !isVisibility(visibility)) {
      throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

Y finalmente podemos finalizar la función <i>toNewDiaryEntry</i> que se encarga de validar y parsear los campos de los datos:

```js
const toNewDiaryEntry = (object: any): NewDiaryEntry => {
  return {
    date: parseDate(object.date),
    comment: parseComment(object.comment),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };
};
```

¡La primera versión de nuestra aplicación de diario de vuelo ya está completa!

Si ahora intentamos crear una nueva entrada en el diario con campos no válidos o faltantes, recibiremos un mensaje de error apropiado.

![](../../images/9/30b.png)

</div>

<div class="tasks">

### Ejercicios 9.12.-9.13.

#### 9.12: Patientor backend, paso 5
Cree un endpoint POST <i>/api/patients</i> para agregar pacientes. Asegúrese de que puede agregar pacientes también desde el frontend.

#### 9.13: Patientor backend, paso 6

Configurar protecciones de tipo, validación y parsing seguro en la solicitud de POST <i>/api/patients</i>.

Refactorice el campo <i>Gender</i> para usar un tipo [enum](http://www.typescriptlang.org/docs/handbook/enums.html).

</div>
