---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: es
---

<div class="content">

Ahora que tenemos una comprensión básica de como funciona TypeScript y como crear pequeños proyectos con él, es hora de comenzar a crear algo realmente útil. Ahora vamos a crear un nuevo proyecto con casos de uso un poco más realistas.

Un cambio importante con respecto a la parte anterior es que *ya no usaremos ts-node*. Es una herramienta útil que te ayuda a empezar, pero a largo plazo es recomendable utilizar el compilador oficial de TypeScript que viene con el paquete npm de *typescript*. El compilador oficial genera y empaqueta archivos JavaScript a partir de los archivos .ts para que la *versión de producción* construida ya no contenga código TypeScript. Este es el resultado exacto al que aspiramos, ya que TypeScript en sí no es ejecutable por navegadores o Node.

### Configurando el proyecto

Crearemos un proyecto para Ilari, a quien le encanta volar aviones pequeños pero tiene dificultades para gestionar su historial de vuelos. Él mismo es bastante coder, por lo que no necesita una interfaz de usuario, pero le gustaría usar el software con solicitudes HTTP y conservar la posibilidad de agregar más tarde una interfaz de usuario basada en web a la aplicación.

Comencemos por crear nuestro primer proyecto real *Diarios de vuelo de Ilari*. Como de costumbre, ejecuta *npm init* e instala el paquete de *typescript* como una dependencia de desarrollo.

```shell
 npm install typescript --save-dev
```

El compilador nativo de TypeScript (*tsc*) puede ayudarnos a inicializar nuestro proyecto al generar nuestro archivo *tsconfig.json*.
Primero, tenemos que agregar el comando *tsc* a la lista de scripts ejecutables en el archivo *package.json* (a menos que hayas instalado *typescript* globalmente). Incluso si has instalado TypeScript globalmente, siempre debes añadirlo como una dependencia de desarrollo a tu proyecto.

El script npm para ejecutar *tsc* se define de la siguiente manera:

```json
{
  // ..
  "scripts": {
    "tsc": "tsc", // highlight-line
  },
  // ..
}
```

A menudo, el comando *tsc* simple se agrega a los *scripts* para que lo usen otros scripts, por lo que es común verlo configurado dentro del proyecto de esta manera.

Ahora podemos inicializar nuestra configuración tsconfig.json ejecutando:

```shell
 npm run tsc -- --init
```

**Ten en cuenta** el extra *--* ¡antes del argumento real! Los argumentos antes de *--* se interpretan como parte del comando *npm*, mientras que los posteriores son para el comando que se ejecuta a través del script (p.ej. *tsc* en este caso).

El archivo *tsconfig.json* que acabamos de crear, contiene una lista larga de todas las configuraciones disponibles para nosotros. Sin embargo, solo unos pocos no han sido comentados.
Estudiar este archivo puede ser útil para encontrar algunas opciones de configuración que puedas necesitar.
También está completamente bien mantener las filas comentadas en el archivo en caso de que algún día necesites expandir sus ajustes de configuración.

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

La configuración *target* le dice al compilador qué versión de *ECMAScript* usar cuando se genera el JavaScript. ES6 es compatible con la mayoría de los navegadores y es una opción buena y bastante segura.

*outDir* indica dónde debe colocarse el código compilado.

*module* le dice al compilador que queremos usar los módulos de *CommonJS* en el código compilado. Esto significa que podemos usar la vieja sintaxis *require* en lugar de *import*, que no es compatible con versiones viejas de *Node*.

*strict* es en realidad una abreviatura de varias opciones independientes:
*noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes y strictPropertyInitialization*.
Estas opciones guían nuestro estilo de codificación para usar las funciones de TypeScript de manera más estricta.
Para nosotros quizás el más importante sea el que ya hemos visto [noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny). Impide establecer implícitamente el tipo *any*, lo que puede suceder si, por ejemplo, no escribes los tipos de los parámetros de una función.
Los detalles del resto de las configuraciones se pueden encontrar en la [documentación de tsconfig](https://www.staging-typescript.org/tsconfig#strict).
El uso de *strict* es sugerido por la documentación oficial.

*noUnusedLocals* evita tener variables locales sin usar, y *noUnusedParameters* arroja un error si una función tiene parámetros sin usar.

*noImplicitReturns* controla todos los posibles caminos del código en una función para asegurar que siempre haya un valor retornado.

*noFallthroughCasesInSwitch* asegura que en un *switch case* cada caso termina con una declaración *return* o *break*.

*esModuleInterop* permite la interoperatividad entre los módulos CommonJS y ES; ve más al respecto en la [documentación](https://www.staging-typescript.org/tsconfig#esModuleInterop).

Ahora que hemos definido nuestra configuración, continuemos instalando *express* y, por supuesto, también *@types/express*. Dado que este es un proyecto real, que está destinado a crecer con el tiempo, usaremos ESlint desde el principio:

```shell
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Ahora nuestro *package.json* debería verse así:

```json
{
  "name": "flight-diary",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "tsc": "tsc"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.18",
    "@typescript-eslint/eslint-plugin": "^6.7.3",
    "@typescript-eslint/parser": "^6.7.3",
    "eslint": "^8.50.0",
    "typescript": "^5.2.2"
  }
}
```

También creamos un archivo *.eslintrc* con el siguiente contenido:

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
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

Ahora solo necesitamos configurar nuestro entorno de desarrollo y estamos listos para comenzar a escribir un poco de código serio.
Hay muchas opciones diferentes para esto. Podríamos usar el conocido *nodemon* con *ts-node*. Sin embargo, como vimos anteriormente, *ts-node-dev* hace exactamente lo mismo, asi que lo continuaremos usando.
Entonces, instalemos *ts-node-dev*

```shell
npm install --save-dev ts-node-dev
```

Finalmente definimos un par de scripts npm más, y voilà, estamos listos para comenzar:

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

Como puedes ver, hay muchas cosas que hacer antes de que comenzar a codear de verdad. Cuando se trabaja con un proyecto real, los preparativos cuidadosos respaldan tu proceso de desarrollo.Tómate el tiempo necesario para crear una buena configuración para ti y tu equipo, para que, a la larga, todo funcione sin problemas.

### Que haya código

¡Ahora finalmente podemos empezar a codear! Como siempre, comenzamos creando un ping-endpoint, solo para asegurarnos de que todo esté funcionando.

El contenido del archivo *index.ts*:

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

Ahora, si ejecutamos la aplicación con *npm run dev*, podemos verificar que una solicitud a <http://localhost:3000/ping> da una respuesta *pong*, ¡así que nuestra configuración está lista!

Al iniciar la aplicación con *npm run dev*, se ejecuta en modo de desarrollo.
El modo de desarrollo no es adecuado en absoluto cuando luego operamos la aplicación en producción.

Intentemos crear una *compilación de producción* ejecutando el compilador de TypeScript. Dado que hemos definido el *outdir* en nuestro tsconfig.json, no hay nada más que hacer que ejecutar el script *npm run tsc*.

Al igual que por arte de magia, se crea una compilación de producción de JavaScript ejecutable nativa del backend de Express en el archivo *index.js* dentro del directorio *build*. El codigo compilado se ve así:

```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Actualmente, si ejecutamos ESlint, también interpretará los archivos en el directorio *build*. No queremos eso, ya que el código allí es generado por el compilador. Podemos evitar esto creando un archivo *.eslintignore* que enumere el contenido que queremos que ESlint ignore, tal como lo hacemos con git y *.gitignore*.

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

Cuando ejecutamos la aplicación con *npm start*, podemos verificar que también funciona la compilación de producción

![navegador mostrando pong en localhost:3000/ping](../../images/9/15a.png)

Ahora tenemos una línea de trabajo mínima para desarrollar nuestro proyecto.
Con la ayuda de nuestro compilador y ESlint, aseguramos que se mantenga una buena calidad de código. Con esta base, podemos comenzar a crear una aplicación que luego podríamos desplegar en un entorno de producción.

</div>

<div class="tasks">

### Ejercicios 9.8.-9.9.

#### Antes de comenzar los ejercicios

Para este conjunto de ejercicios, desarrollaras un backend para un proyecto existente llamado **Patientor**, que es una aplicación simple de registros médicos para doctores que manejan diagnósticos e información básica de la salud de sus pacientes.

El [frontend](https://github.com/fullstack-hy2020/patientor) ya ha sido creado por expertos externos y tu tarea es crear un backend para darle soporte al código existente.

#### ADVERTENCIA

Bastante a menudo, VS code pierde el registro de lo que realmente esta pasando en el código y muestra advertencias relacionadas al tipo o estilo a pesar de que el código ya ha sido arreglado. Si esto sucede (a mi me ha sucedido bastante seguido), cierra y vuelve a abrir el archivo que te da problemas o simplemente reinicia el editor. También es bueno asegurarse de que todo realmente funciona ejecutando el compilador y ESlint desde la linea de comandos:

```bash
npm run tsc
npm run lint
```

Cuando lo ejecutamos en la linea de comandos obtienes el "resultado real". Entonces, ¡no confíes demasiado en el editor!

#### 9.8: Patientor backend, paso 1

Inicializa un nuevo proyecto de backend que será utilizado por el frontend. Configura ESlint y tsconfig con las mismas configuraciones que se utilizan en el material. Define un endpoint que responda a las solicitudes HTTP GET para la ruta */api/ping*.

El proyecto debería poder ejecutarse con scripts npm, tanto en modo de desarrollo y como código compilado, en modo de producción.

#### 9.9: Patientor backend, paso 2

Haz un fork y clona el proyecto [patientor](https://github.com/fullstack-hy2020/patientor). Inicia el proyecto con la ayuda del archivo README. 

Deberías poder usar el frontend sin un backend que funcione.

Asegúrate de que el backend responda a la solicitud de ping que el *frontend* ha realizado al inicio. Verifica la herramienta para desarrolladores para asegurarte de que realmente funciona:

![dev tools mostrando que ping falló](../../images/9/16a.png)

Es posible que también quieras echarle un vistazo a la pestaña *console*. Si algo falla, la [parte 3](/es/part3) del curso muestra cómo se puede resolver el problema.

</div>

<div class="content">

### Implementando la funcionalidad

Finalmente estamos listos para empezar a escribir código.

Empecemos por lo básico. Ilari quiere poder realizar un seguimiento de sus experiencias en sus viajes aéreos.

Quiere poder guardar las *entradas del diario* que contienen:

- La fecha de la entrada
- Condiciones meteorológicas (sunny, windy, cloudy, rainy or stormy)(soleado, ventoso, nublado, lluvioso o tormentoso)
- Visibilidad (great, good, ok or poor)(muy buena, buena, regular o mala)
- Texto libre detallando la experiencia

Hemos obtenido algunos datos de muestra, que utilizaremos como base para construir.
Los datos se guardan en formato JSON y se pueden encontrar [aquí](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json).

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

Primero necesitamos tomar algunas decisiones sobre cómo estructurar nuestro código fuente. Es mejor colocar todo el código fuente en el directorio *src*, para que el código fuente no se mezcle con los archivos de configuración.
Trasladaremos *index.ts* allí y haremos los cambios necesarios a los scripts npm.

Colocaremos todos los [routers](/es/part4/estructura_de_la_aplicacion_backend_introduccion_a_las_pruebas) y los módulos que se encargan de manejar un conjunto de recursos específicos como *diaries*, bajo el directorio *src/routes*.
Esto es un poco diferente a lo que hicimos en la [parte 4](/es/part4), donde usamos el directorio *src/controllers*.

El router que se encarga de todos los endpoints del diario está en *src/routes/diaries.ts* y tiene este aspecto:

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

Enrutaremos todas las solicitudes al prefijo */api/diaries* a ese router específico en *index.ts*

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

Y ahora, si hacemos una solicitud HTTP GET a <http://localhost:3000/api/diaries>, deberíamos ver el mensaje *Fetching all diaries!*.

A continuación, debemos comenzar a servir los datos (que se encuentran [aquí](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)) desde la aplicación. Obtendremos los datos y los guardaremos en *data/entries.json*.

No escribiremos el código para las manipulaciones de datos en el router. En su lugar, crearemos un *service* que se encargue de la manipulación de datos.
Es una práctica bastante común separar la "lógica de negocios" de el código del router en sus propios módulos, que a menudo se denominan *services*.
El nombre service se origina en el [Diseño guiado por el dominio](https://es.wikipedia.org/wiki/Dise%C3%B1o_guiado_por_el_dominio) y se hizo popular con el framework [Spring](https://spring.io/).

Vamos a crear un directorio *src/services* y coloquemos el archivo *diaryService.ts* en él.
El archivo contiene dos funciones para buscar y guardar entradas del diario:

```js
import diaryData from '../../data/entries.json'

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

Pero algo no esta bien:

![vscode pidiendo considerar el uso de resolveJsonModule ya que no puede encontrar el módulo](../../images/9/17c.png)

La sugerencia dice que podríamos querer usar *resolveJsonModule*. Agreguémoslo a nuestro tsconfig:

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

> **NB**: Por alguna razón, VSCode tiende a quejarse de que no puede encontrar el archivo *../../data/diaries.json* desde el servicio a pesar de que el archivo existe. Eso es un error en el editor y desaparece cuando se reinicia el editor.

Anteriormente vimos cómo el compilador puede decidir el tipo de variable por el valor que se le asigna.
De manera similar, el compilador puede interpretar grandes conjuntos de datos que constan de objetos y arrays.
Debido a esto, el compilador puede advertirnos si intentamos hacer algo sospechoso con los datos JSON que estamos manejando. Por ejemplo, si estamos manejando un array que contiene objetos de un tipo específico, y tratamos de agregar un objeto que no tiene todos los campos que tienen los otros objetos, o tiene conflictos de tipos (por ejemplo, un número donde debería haber un string), el compilador puede darnos una advertencia.

Aunque el compilador es bastante bueno para asegurarse de que no hagamos nada no deseado, es más seguro definir los tipos de datos nosotros mismos.

Actualmente tenemos una aplicación básica de Express con TypeScript que funciona, pero el código apenas esta *tipado*. Dado que sabemos qué tipo de datos deben aceptarse para los campos *weather* y *visibility*, no hay razón para que no incluyamos sus tipos en el código.

Creemos un archivo para nuestros tipos, *types.ts*, donde definiremos todos nuestros tipos para este proyecto.

Primero, vamos a tipear los valores de de *Weather* y *Visibility* utilizando un [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) de las strings permitidas:

```js
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

Y a partir de ahí podemos continuar creando un tipo DiaryEntry, que será un [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces):

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
import diaryData from '../../data/entries.json';

import { DiaryEntry } from '../types'; // highlight-line

const diaries: DiaryEntry[] = diaryData; // highlight-line

const getEntries = (): DiaryEntry[] => { // highlight-line
  return diaries; // highlight-line
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

Pero dado que el JSON ya tiene sus valores declarados, asignar un tipo para el conjunto de datos da como resultado un error:

![vscode mostrando error string no asignable a weather](../../images/9/19b.png)

El final del mensaje de error revela el problema: los campos *weather* son incompatibles. En *DiaryEntry* especificamos que su tipo es *Weather*, pero el compilador de TypeScript había inferido que su tipo era *string*.

Podemos solucionar el problema haciendo una [afirmación de tipo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions). Como ya [mencionamos](/es/part9/primeros_pasos_con_type_script#asercion-de-tipos) ¡las aserciones de tipo solo deben hacerse si estamos seguro de lo que estamos haciendo!

Si afirmamos que el tipo de la variable *diaryData* es *DiaryEntry* con la palabra clave *as*, todo debería funcionar:

```js
import diaryData from '../../data/entries.json'

import { Weather, Visibility, DiaryEntry } from '../types'

const diaries: DiaryEntry[] = diaryData as DiaryEntry[]; // highlight-line

const getEntries = (): DiaryEntry[] => {
  return diaries;
}

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  addDiary
};
```

Nunca deberíamos usar la aserción de tipo a menos que no haya otra forma de proceder, ya que siempre existe el peligro de afirmar un tipo no apto para un objeto y causar un desagradable error de ejecución.
Si bien el compilador confía en que sepas lo que está haciendo cuando usas *as*, al hacer esto, no estamos usando todo el poder de TypeScript, sino que confiamos en el desarrollador para asegurar el código.

En nuestro caso, podríamos cambiar la forma en que exportamos nuestros datos para poder escribirlos dentro del archivo de datos.
Dado que no podemos usar typings en un archivo JSON, deberíamos convertir el archivo JSON en un archivo ts llamado *diaries.ts* que exporta los datos tipados de la siguiente manera:

```js
import { DiaryEntry } from "../src/types"; // highlight-line

const diaryEntries: DiaryEntry[] = [ // highlight-line
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries; // highlight-line
```

Ahora, cuando importamos el array, el compilador lo interpreta correctamente y los campos *weather* y *visibility* se entienden correctamente:

```js
import diaries from '../../data/entries'; // highlight-line

import { DiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => {
  return diaries;
}

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  addDiary
};
```

Ten en cuenta que si queremos poder guardar entradas sin un campo determinado, por ejemplo, *comment*, podríamos establecer el tipo del campo como [opcional](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties) agregando *?* a la declaración de tipo:

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string; // highlight-line
}
```

### Módulos de Node y JSON

Es importante tomar nota de un problema que puede surgir al usar la opción de tsconfig [resolveJsonModule](https://www.typescriptlang.org/tsconfig/#resolveJsonModule):

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true // highlight-line
  }
}
```

De acuerdo con la documentación de node para los [módulos de archivo](https://nodejs.org/api/modules.html#modules_file_modules), node intentará resolver los módulos por orden de extensiones:

```shell
 ["js", "json", "node"]
```

Además de eso, de forma predeterminada, *ts-node* y *ts-node-dev* amplían la lista de posibles extensiones de módulo de node a:

```shell
 ["js", "json", "node", "ts", "tsx"]
```

> **NB**: La validez de los archivos *.js*, *.json* y *.node* como módulos en Typescript depende de la configuración del entorno, incluidas las opciones de *tsconfig* como *allowJs* y *resolveJsonModule*.

Considera una estructura de directorios plana que contiene archivos:

```shell
  ├── myModule.json
  └── myModule.ts
```

En TypeScript, con la opción *resolveJsonModule* establecida en true, el archivo *myModule.json* se convierte en un módulo de node válido. Ahora, imagina un escenario en el que deseamos utilizar el archivo *myModule.ts*:

```js
import myModule from "./myModule";
```

Mirando de cerca el orden de las extensiones de módulo de node:

```sh
 ["js", "json", "node", "ts", "tsx"]
```

Notamos que la extensión de archivo *.json* tiene prioridad sobre *.ts*, por lo que se importará *myModule.json* y no *myModule.ts*.

Para evitar errores, se recomienda que dentro de un directorio plano, cada archivo con una extensión de módulo de node válida tenga un nombre de archivo único.

### Tipos de utilidad

A veces, es posible que deseemos utilizar una modificación específica de un tipo.
Por ejemplo, considera una página para enumerar algunos datos, algunos de los cuales son confidenciales y otros no.
Es posible que deseemos estar seguros de que no se utilizan ni se muestran datos sensibles. Podríamos *elegir* los campos de un tipo que permitimos que se utilicen para hacer cumplir esto.
Podemos hacer eso usando el tipo de utilidad [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys).

En nuestro proyecto, deberíamos considerar que Ilari podría querer crear una lista de todas las entradas de su diario *excluyendo* el campo de comentarios, ya que durante un vuelo muy aterrador, podría terminar escribiendo algo que no necesariamente querría mostrarle a alguien más.

El tipo de utilidad [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) nos permite elegir qué campos de un tipo existente queremos usar.
Pick se puede utilizar para construir un tipo completamente nuevo o para informar a una función lo que debería devolver en tiempo de ejecución.
Los tipos de utilidad son un tipo especial, pero se pueden utilizar como los tipos normales.

En nuestro caso, para crear una versión "censurada" de *DiaryEntry* para pantallas públicas, podemos usar *Pick* en la declaración de la función:

```js
const getNonSensitiveEntries =
  (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
    // ...
  }
```

y el compilador esperaría que la función devuelva un array de valores del tipo *DiaryEntry* modificado, que incluye solo los cuatro campos seleccionados.

En este caso, solo queremos excluir un campo, por lo que seria aún mejor utilizar el tipo de utilidad [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys), con el cual podemos declarar qué campos queremos excluir:

```js
const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
  // ...
}
```

Para mejorar la legibilidad, definitivamente deberiamos definir un [alias de tipo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) llamado *NonSensitiveDiaryEntry* en el archivo *types.ts*:

```js
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

El código ahora es mucho más claro y más descriptivo:

```js
import diaries from '../../data/entries';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => { // highlight-line
  return diaries;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary,
  getNonSensitiveEntries // highlight-line
};
```

Una cosa en nuestra aplicación es motivo de preocupación. En *getNonSensitiveEntries*, estamos devolviendo las entradas completas del diario, ¡y *no se da ningún error* a pesar del typing!

Esto sucede porque [TypeScript solo verifica](http://www.typescriptlang.org/docs/handbook/type-compatibility.html) si tenemos todos los campos obligatorios o no, pero los campos extra no están prohibidos. En nuestro caso esto significa que *no está prohibido* devolver un objeto de tipo *DiaryEntry[]*, pero si intentáramos acceder al campo *comment*, no sería posible porque estaríamos accediendo a un campo que TypeScript desconoce incluso aunque existe.

Desafortunadamente, esto puede provocar un comportamiento no deseado si no eres consciente de lo que estas haciendo; la situación es válida en lo que respecta a TypeScript, pero lo más probable es que estés permitiendo un uso no deseado.
Si ahora devolviéramos todas las entradas del diario de la función *getNonSensitiveEntries* al frontend, estaríamos *filtrando los campos no deseados* al navegador solicitante, ¡incluso aunque nuestros tipos parezcan implicar lo contrario!

Debido a que TypeScript no modifica los datos reales, sino solo su tipo, debemos excluir los campos nosotros mismos:

```js
import diaries from '../../data/entries.ts'

import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// highlight-start
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// highlight-end

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

Si ahora intentamos devolver estos datos con el tipo básico *DiaryEntry*, es decir, si escribiéramos la función de la siguiente manera:

```js
const getNonSensitiveEntries = (): DiaryEntry[] => {
```

obtendríamos el siguiente error:

![error de vscode - comment esta declarado aquí](../../images/9/22b.png)

Nuevamente, la última línea del mensaje de error es la más útil. Deshagamos esta modificación no deseada.

Ten en cuenta que si haces el campo comment opcional (usando el operador *?*), todo funciona bien.

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

![navegador en api/diaries muestra tres objetos json](../../images/9/26.png)

</div>

<div class="tasks">

###  Ejercicios 9.10.-9.11.

De manera similar al servicio de vuelo de Ilari, no usamos una base de datos real en nuestra aplicación, sino que usamos datos codificados, es decir, en los archivos [diagnoses.ts](https://github.com/fullstack-hy2020/misc/blob/master/diagnoses.ts) y [patients.ts](https://github.com/fullstack-hy2020/misc/blob/master/patients.ts). Obten los archivos y guárdalos en un directorio llamado *data* en tu proyecto. Todas la modificaciones de datos se pueden realizar en la memoria de ejecución, por lo que durante esta parte *no es necesario escribir a un archivo*.

#### 9.10: Patientor backend, paso 3

Crea un tipo *Diagnose* y utilízalo para crear un endpoint */api/diagnoses* para obtener todos los diagnósticos con HTTP GET.

Estructura tu código correctamente utilizando directorios y archivos con nombres apropiados.

**Ten en cuenta** que *diagnoses* pueden contener o no el campo *latin*. Es posible que quieras utilizar [propiedades opcionales](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#optional-properties) en la definición de tipos.

####  9.11: Patientor backend, paso 4

Crea el tipo de datos *Patient* y configura un endpoint GET */api/patients* que devuelva todos los pacientes al frontend, excluyendo el campo *ssn*. Utiliza un [tipo de utilidad](https://www.typescriptlang.org/docs/handbook/utility-types.html) para asegurarte de que estas seleccionando y devolviendo solo los campos deseados.

En este ejercicio, puedes asumir que el campo *gender* tiene el tipo *string*.

Prueba el endpoint con el navegador y asegúrate de que *ssn* no esté incluido en la respuesta:

![navegador en api/patients no muestra ssn en el json de pacientes](../../images/9/22g.png)

Después de crear el endpoint, asegúrate de que el *frontend* muestre la lista de pacientes:

![navegador mostrando la lista de pacientes](../../images/9/22h.png)

</div>

<div class="content">

###  Previniendo un resultado undefined accidental

Extendamos el backend para admitir la obtención de una entrada específica con una solicitud HTTP GET a la ruta *api/diaries/:id*.

El DiaryService debe ampliarse con la función *findById*:

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

![error de vscode no se puede asignar undefined a DiaryEntry](../../images/9/23e.png)

El problema es que no hay garantía de que se pueda encontrar una entrada con el id especificado.
Es bueno que seamos conscientes de este problema potencial ya en la fase de compilación. Sin TypeScript no se nos advertiría sobre este problema y, en el peor de los casos, podríamos haber terminado devolviendo un objeto *undefined* en lugar de informar al usuario de que no se ha encontrado la entrada especificada.

En primer lugar, en casos como este, debemos decidir cuál debe ser el *valor de retorno* si no se encuentra un objeto y cómo se debe manejar el caso.
El método *find* de un array devuelve *undefined* si no se encuentra el objeto, y esto está bien.
Podemos resolver nuestro problema tipeando el valor de retorno de la siguiente manera:

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

### Agregando un nuevo diario

Comencemos a construir el endpoint HTTP POST para agregar nuevas entradas al diario de vuelo. 
Las nuevas entradas deben tener el mismo tipo que los datos existentes.

El manejo del código de la respuesta es el siguiente:

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const addedEntry = diaryService.addDiary(
    date,
    weather,
    visibility,
    comment,
  );
  res.json(addedEntry);
});
```

El método correspondiente en *diaryService* se ve así:

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

Como puedes ver, la función *addDiary* se está volviendo bastante difícil de leer ahora que tenemos todos los campos como parámetros separados. Podría ser mejor enviar los datos como un objeto a la función:

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const addedEntry = diaryService.addDiary({ // highlight-line
    date,
    weather,
    visibility,
    comment,
  }); // highlight-line
  res.json(addedEntry);
})
```

Pero espera, ¿cuál es el tipo de este objeto? No es exactamente una *DiaryEntry*, ya que todavía le falta el campo de *id*. Podría ser útil crear un nuevo tipo, *NewDiaryEntry*, para una entrada que aún no ha sido guardada. Vamos a crearlo en *types.ts* usando el tipo *DiaryEntry* existente y el tipo de utilidad [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys):

```js
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

Ahora podemos usar el nuevo tipo en nuestro DiaryService y desestructurar el nuevo objeto de entrada al crear una entrada para ser guardada:

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

Aún tenemos una queja en nuestro codigo:

![error de vscode asignación insegura de un valor any](../../images/9/43.png)

La causa es la regla de ESlint [@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md) que nos previene de asignar los campos del body de una solicitud a las variables.

Por el momento, simplemente ignoremos la regla de ESlint en todo el archivo, podemos hacerlo agregando lo siguiente a la primer linea del archivo:

``` js
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

Para procesar los datos entrantes debemos tener configurado el middleware *json*:

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

¡Ahora la aplicación está lista para recibir solicitudes HTTP POST para nuevas entradas del diario con el tipo correcto!

### Solicitudes de revisión

Hay muchas cosas que pueden salir mal cuando aceptamos datos de fuentes externas.
Las aplicaciones rara vez funcionan completamente por sí solas y, nos vemos obligados a vivir con el hecho de que no se puede confiar plenamente en los datos de fuentes externas a nuestro sistema.
Cuando recibimos datos de una fuente externa, no hay forma de que ya estén tipados cuando los recibimos. Necesitamos tomar decisiones sobre cómo manejar la incertidumbre que viene con esto.

La regla de ESlint deshabilitada nos indicaba que la siguiente asignación es riesgosa:

```js
const newDiaryEntry = diaryService.addDiary({
  date,
  weather,
  visibility,
  comment,
});
```

Nos gustaría tener la certeza de que el objeto en una solicitud POST tiene el tipo correcto. Ahora definamos una función *toNewDiaryEntry* que reciba un request body como parámetro y que devuelva un objeto *NewDiaryEntry* apropiadamente tipado. La función será definida en el archivo *utils.ts*

La definición de la ruta utiliza la función de la siguiente manera:

```js
import toNewDiaryEntry from '../utils'; // highlight-line

// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body); // highlight-line

    const addedEntry = diaryService.addDiary(newDiaryEntry); // highlight-line
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})
```

Ahora, también podemos remover la primera linea que ignora la regla de ESlint *no-unsafe-assignment*.

Dado que ahora estamos escribiendo código seguro y tratando de asegurarnos de obtener exactamente los datos que queremos de las solicitudes, debemos comenzar a procesar y validar cada campo que esperamos recibir.

El esqueleto de la función *toNewDiaryEntry* se ve de la siguiente manera:

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

La función debe procesar cada campo y asegurarse de que el valor de retorno sea exactamente del tipo *NewDiaryEntry*. Esto significa que debemos verificar cada campo por separado.

Una vez más tenemos un problema de tipo: ¿cuál es el tipo del parámetro *objeto*? Dado que el *objeto* **es** el request body, Express lo ha escrito como *any*. Dado que la idea de esta función es mapear campos de tipo desconocido a campos del tipo correcto y verificar si están definidos como se espera, este podría ser el caso poco común en el que *queremos permitir el tipo **any** *.

Sin embargo, si escribimos el objeto como *any*, ESlint nos da una queja:

![vscode eslint mostrando objeto debe ser tipado non-any y que esta definido pero nunca usado](../../images/9/61new.png)

Podríamos ignorar la regla de ESlint pero una idea mejor es seguir uno de los consejos que el editor nos da en el *Quick Fix* y definir el tipo del parámetro como *unknown*

```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => { // highlight-line
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default toNewDiaryEntry;
```

[unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown) es el tipo ideal para nuestra situación en la validación del input, ya que aún no tenemos que definir el tipo para que sea de tipo *any*, en cambio podemos verificar el tipo primero y luego confirmar que es del tipo que esperábamos.
Con el uso de *unknown*, tampoco tenemos que preocuparnos por la regla de ESlint *@typescript-eslint/no-explicit-any*, ya que no estamos usando *any*. Sin embargo, quizás tengamos que usar *any* en algunos casos donde aun no estamos seguros acerca del tipo y necesitemos acceso a las propiedades de un objeto de tipo *any* para validar o controlar el tipo de los valores de las propiedades.

>#### Una nota al margen de el editor
>
> *Si eres como yo y odias tener código que esté roto por un tiempo largo debido a tener un tipado incompleto, podrías comenzar por "falsificar" la función*
>
>
>```js
>const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
>
>  console.log(object); // now object is no longer unused
>  const newEntry: NewDiaryEntry = {
>    weather: 'cloudy', // fake the return value
>    visibility: 'great',
>    date: '2022-1-1',
>    comment: 'fake news'
>  };
>
>  return newEntry;
>};
>```
>
> *Entonces, antes de de que los datos reales y los tipos estén listos para ser usados, simplemente estoy retornando algo que se que tiene el tipo correcto. El código permanece operacional todo el tiempo y mi presión sanguínea vuelve a niveles normales*

### Guardias de tipos

Comencemos a crear los parsers para cada uno de los campos de *object: unknown*.

Para validar el campo *comment*, debemos verificar que exista y asegurarnos de que sea del tipo *string*.

La función debería verse más o menos así:

```js
const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

La función obtiene un parámetro de tipo *unknown* y lo devuelve como tipo *string* si existe y es del tipo correcto.

La función de validación de string se ve así:

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

La función es una [guardia de tipo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). Eso significa que es una función que devuelve un booleano *y* que tiene un *predicado de tipo* como tipo de retorno. En nuestro caso, el tipo de predicado es:

```js
text is string
```

La forma general de un predicado de tipo es *parameterName is Type* donde el *parameterName* es el nombre del parámetro de función y *Type* es el tipo objetivo.

Si la función de guardia de tipo devuelve true, el compilador de TypeScript sabe que la variable probada tiene el tipo que se definió en el predicado de tipo.

Antes de que se llame a la guardia de tipo, el tipo de la variable *comment* es desconocido:

![vscode cursor sobre isString(comment) muestra tipo unknown](../../images/9/28e-21.png)

Pero después de la llamada, si el código pasa de la excepción (es decir, la guardia de tipo ha devuelto true), entonces el compilador sabe que *comment* es del tipo *string*:

![vscode cursor sobre return comment muestra tipo string](../../images/9/29e-21.png)

El uso de una guardia de tipo que devuelve un predicado de tipo es una forma de hacer el [estrechamiento de tipos](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), eso es, darle a una variable un tipo más estricto o preciso. Como pronto veremos, también hay otras [guardias de tipo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) disponibles.

> #### Nota al margen: probando si algo es un string
>
> *¿Por qué tenemos dos condiciones en la guardia de tipo string?*
>
>```js
>const isString = (text: unknown): text is string => {
>  return typeof text === 'string' || text instanceof String; // highlight-line
>}
>```
>
>*¿No seria suficiente escribir la guardia así?*
>
>```js
>const isString = (text: unknown): text is string => {
>  return typeof text === 'string';
>}
>```
>
>*Probablemente, la forma más simple es suficientemente buena para todos los casos prácticos. Sin embargo, si queremos estar absolutamente seguros, ambas condiciones son necesarias. Hay dos formas diferentes de crear strings en JavaScript, una como primitivo y otra como objeto, los cuales funcionan un poco diferente cuando son comparadas con los operadores **typeof** y **instanceof**:*
>
>```js
>const a = "I'm a string primitive";
>const b = new String("I'm a String Object");
>typeof a; --> returns 'string'
>typeof b; --> returns 'object'
>a instanceof String; --> returns false
>b instanceof String; --> returns true
>```
>
>*Sin embargo, es muy poco probable que alguien cree un string con una función constructora. Es más probable que la version más simple de la guardia de tipo sea suficiente*

A continuación, consideremos el campo *date*.
Parsear y validar el objeto date es bastante similar a lo que hicimos con los comentarios.
Dado que TypeScript realmente no conoce un tipo para una fecha, debemos tratarlo como un *string*.
Sin embargo, deberíamos seguir utilizando la validación a nivel de JavaScript para comprobar si el formato de la fecha es aceptable.

Agregaremos las siguientes funciones:

```js
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

El código no es nada especial. Lo único para mencionar es que aquí no podemos usar una guardia de tipo basada en el predicado de tipos, ya que una fecha en este caso solo se considera como un *string*. Ten en cuenta que aunque la función *parseDate* acepta la variable *date* como *unknown*, después de verificar el tipo con *isString*, su tipo se establece como *string*, por lo que podemos pasar la variable a la función *isDate* que requiere un string sin ningún problema.

Finalmente, estamos listos para pasar a los dos últimos tipos, *Weather* y *Visibility*.

Nos gustaría que la validación y el parsing funcionaran de la siguiente manera:

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather)
  }
  return weather;
};
```

La pregunta es, ¿cómo podemos validar que el string tiene una forma específica?
Una forma posible de escribir la guardia de tipo sería la siguiente:

```js
const isWeather = (str: string): str is Weather => {
  return ['sunny', 'rainy', 'cloudy', 'stormy' ].includes(str);
};
```

Esto funcionaría bien, pero el problema es que la lista de posibles condiciones meteorológicas no se mantiene necesariamente sincronizada con las definiciones de tipo si el tipo se modifica.
Ciertamente, esto no es bueno, ya que nos gustaría tener una sola fuente para todos los posibles tipos de clima.

### Enum

En nuestro caso, una mejor solución sería mejorar el tipo *Weather*. En lugar de un alias de tipo, deberíamos usar [enum](https://www.typescriptlang.org/docs/handbook/enums.html) de Typescript, que nos permite usar los valores reales en nuestro código en tiempo de ejecución, no solo en la fase de compilación.

Redefinamos el tipo *Weather* de la siguiente manera:

```js
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}
```

Ahora podemos comprobar que un string es uno de los valores aceptados, y la guardia de tipo se puede escribir así:

```js
const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).map(v => v.toString()).includes(param);
};
```

Ten en cuenta que necesitamos la representación en forma de string de los valores de enum para hacer la comparación, por eso es que hacemos el mapeo.

Un problema emerge luego de estos cambios. Nuestros datos en el archivo *data/entries.ts* ya no se corresponden con nuestros tipos:

![error de vscode rainy no es asignable al tipo Weather](../../images/9/30.png)

Esto se debe a que no podemos simplemente asumir que un string es un enum.

Podemos arreglar esto mapeando los elementos de los datos iniciales a el tipo *DiaryEntry* con la función *toNewDiaryEntry*:

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
  const object = toNewDiaryEntry(obj) as DiaryEntry;
  object.id = obj.id;
  return object;
});

export default diaryEntries;
```

Ten en cuenta que dado que *toNewDiaryEntry* devuelve un objeto del tipo *NewDiaryEntry*, debemos afirmar que sea del tipo *DiaryEntry* con el operador [as](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions).

Enums son típicamente utilizados cuando hay un conjunto de valores predeterminados que no se espera que cambien el futuro. Usualmente, son utilizados para valores mucho más estrictos en cuanto a posibles cambios (por ejemplo, días de la semana, meses, direcciones cardinales), pero ya que nos ofrecen una gran forma de validar nuestros valores entrantes, también podríamos usarlos en nuestro caso.

Aún debemos darle el mismo tratamiento a *Visibility*. El enum se ve de la siguiente forma:

```js
export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}
```

La guardia de tipo y el parser están debajo:

```js
const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility).map(v => v.toString()).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
      throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

Y finalmente, podemos finalizar la función *toNewDiaryEntry* que se ocupa de validar y parsear los campos del body de POST. Sin embargo, aún tenemos una cosa más de la que ocuparnos. Si intentamos acceder a los campos del parámetro *object* de la siguiente manera:

```js
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

notamos que el código no compila. Esto es por qué el tipo [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) no permite ninguna operación, por lo que acceder a los campos no es posible.

Una vez mas, podemos solucionar el problema con estrechamiento de tipos. Ahora tenemos dos guardias de tipo, la primera controla que el parámetro object existe y tiene el tipo *object*. Luego de esto, la segunda guardia de tipo utiliza el operador [in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing) para asegurar que el objeto tiene todos los campos deseados:

```js
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

Si la guardia no evalúa a true, una excepción es arrojada

El uso del operador *in* ahora garantiza que los campos existen en el objeto. Por eso mismo, la comprobación de existencia en los ya no es necesaria:

```js
const parseVisibility = (visibility: unknown): Visibility => {
  // check !visibility removed:
  if (!isString(visibility) || !isVisibility(visibility)) {
      throw new Error('Incorrect visibility: ' + visibility);
  }
  return visibility;
};
```

Si un campo, p.ej. *comment* fuera opcional, el estrechamiento de tipo debería considerar esto y, el operador [in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing) no podría ser utilizado como lo hicimos aquí, ya que la evaluación de *in* requiere que el campo este presente.

Si ahora intentamos crear una nueva entrada en el diario con campos inválidos o faltantes, obtendremos un mensaje de error apropiado:

![postman mostrando 400 bad request con valor incorrecto o faltante - awesome](../../images/9/62new.png)

El código fuente de nuestra aplicación puede ser encontrado en [GitHub](https://github.com/fullstack-hy2020/flight-diary).

</div>

<div class="tasks">

### Ejercicios 9.12.-9.13.

#### 9.12: Patientor backend, paso 5

Cree un endpoint POST */api/patients* para agregar pacientes. Asegúrate de que también puedas agregar pacientes desde el frontend. Puedes crear ids únicos de tipo *string* usando la librería [uuid](https://github.com/uuidjs/uuid):

```js
import { v1 as uuid } from 'uuid'
const id = uuid()
```

#### 9.13: Patientor backend, paso 6

Configura parsing seguro, validación y predicado de tipos en la solicitud POST */api/patients*.

Refactoriza el campo *gender* para usar un [tipo enum](http://www.typescriptlang.org/docs/handbook/enums.html).

</div>
