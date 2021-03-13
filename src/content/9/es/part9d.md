---
mainImage: ../../../images/part-9.svg
part: 9
letter: d
lang: es
---

<div class="content">

Antes de comenzar a profundizar en cómo puede usar TypeScript con React, primero deberíamos echar un vistazo a lo que queremos lograr. Cuando todo funcione como debería, TypeScript nos ayudará a detectar los siguientes errores:

- Intentar pasar un prop adicional/no deseado a un componente
- Olvidar pasar un prop requerido a un componente
- Pasar un prop de un tipo incorrecto a un componente

Si cometemos alguno de estos errores, TypeScript puede ayudarnos a detectarlos en nuestro editor de inmediato. Si no usamos TypeScript, tendríamos que detectar estos errores más tarde durante el testing. Podríamos vernos obligados a realizar un debugging tedioso para encontrar la causa de los errores.

Eso es suficiente razonamiento por ahora, ¡comencemos a ensuciarnos las manos!
 

### Crear una aplicación React con TypeScript

Podemos usar [create-react-app](https://create-react-app.dev) para crear una aplicación de TypeScript agregando un argumento de <i>template</i> al script de inicialización. Entonces, para crear una  TypeScript Create React App, ejecute el siguiente comando:

```sh
npx create-react-app my-app --template typescript
```

Después de ejecutar el comando, debe tener una aplicación react básica completa que use TypeScript. Puede iniciar la aplicación ejecutando <i>npm start</i> en la raíz de la aplicación.

Si echas un vistazo a los archivos y carpetas, notarás que la aplicación no es tan diferente de una que usa JavaScript puro. Las únicas diferencias son que los archivos <i>.js</i> y <i>.jsx</i> ahora son archivos <i>.ts</i> y <i>.tsx</i>, contienen algunas anotaciones de tipo y el directorio raíz contiene un archivo <i>tsconfig.json</i>.

Ahora, echemos un vistazo al archivo <i>tsconfig.json</i> que se ha creado para nosotros. Todo en él debería estar más o menos bien, excepto en el momento en que la configuración permite compilar archivos JavaScript, porque <i>allowJs</i> está establecido en <i>true</i>. Eso estaría bien si necesita mezclar TypeScript y JavaScript (por ejemplo, si está en el proceso de transformar un proyecto JavaScript en TypeScript o algo así), pero queremos crear una aplicación TypeScript pura, así que cambiemos esa configuración a <i>false</i>.

En nuestro proyecto anterior usamos eslint para ayudarnos a hacer cumplir el estilo de codificación, y haremos lo mismo con esta aplicación. No necesitamos instalar ninguna dependencia, ya que create-react-app ya se ha encargado de eso.

Configuramos eslint en <i>.eslintrc</i> con las siguientes configuraciones:

```js
{
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["react", "@typescript-eslint"],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": 0
  }
}
```

Dado que el tipo de retorno de básicamente todos los componentes de React es  <i>JSX.Element</i> or <i>null</i>, hemos aflojado un poco las reglas de linting predeterminadas al deshabilitar la regla [explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md). Ahora no necesitamos indicar explícitamente nuestros tipos de retorno de función en todas partes.

A continuación, necesitamos que nuestro script linting parsee archivos <i>*.tsx </i>, que son el equivalente en TypeScript de los archivos JSX de react. Podemos hacerlo modificando nuestro comando lint en .<i>.package.json</i> a lo siguiente:

```json
{
  // ...
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint './src/**/*.{ts,tsx}'" // highlight-line
  },
  // ...
}
```
Si está utilizando Windows, puede que tenga que utilizar comillas dobles para el linting path: `"lint": "eslint \"./src/**/*.{ts,tsx}\""`.

Ahora, si ejecutamos <i>npm run lint</i>, todavía recibimos un error de eslint:

![](../../images/9/31a.png)

¿Porqué es eso? Como podemos ver en el mensaje de error, el archivo <i>serviceWorker.ts</i> no parece ser compatible con nuestras configuraciones de linting. Esto se debe a que la función <i>register</i> usa otras funciones que se declaran más adelante en el mismo archivo y a la regla [@typescript-eslint/no-use-before-define](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md) no le gusta eso. Para corregir el error, debemos mover la función <i>register</i> al final del archivo.

Ahora, si ejecutamos <i>npm run lint</i>, ya no debería haber errores. En realidad, el error que obtuvimos anteriormente no importa, ya que de todos modos no necesitamos el archivo <i>serviceWorker.ts</i>. Es mejor eliminarlo por completo.


### Componentes de React con TypeScript
Consideremos el siguiente ejemplo de JavaScript React:


```jsx
import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

const Welcome = props => {
  return <h1>Hello, {props.name}</h1>;
};

Welcome.propTypes = {
  name: PropTypes.string
};

const element = <Welcome name="Sara" />;
ReactDOM.render(element, document.getElementById("root"));
```

En el ejemplo tenemos un componente llamado <i>Welcome</i> al que pasamos un nombre como prop. Luego muestra el nombre en la pantalla.
Sabemos que <i>name</i> debe ser un sting, y usamos el paquete [prop-types](https://www.npmjs.com/package/prop-types) presentado en la p[arte 5](/es/part5/props_children_and_proptypes#prop-types) para recibir sugerencias sobre los tipos deseados de props de componentes y advertencias sobre tipos de props no válidos.

Con TypeScript ya no necesitamos el paquete <i>prop-types</i>. Podemos definir los tipos con la ayuda de TypeScript usando el tipo _FunctionComponent_ o su alias _FC_.

Cuando se usa TypeScript con componentes de React, las anotaciones de tipo se ven un poco diferentes que con otro código de TypeScript. Agregamos un tipo para la variable componente en lugar de la función y sus props._ React.FunctionComponent_ es un tipo [generic](https://www.typescriptlang.org/docs/handbook/generics.html). Podemos pasarle un tipo como argumento, que luego usa como tipo.

Las declaraciones de tipo para _React.FC_ y _React.FunctionComponent_ tienen el siguiente aspecto:

```js
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement | null;
  propTypes?: WeakValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}
```

En primer lugar, puede ver que _FC_ es simplemente un alias para la interfaz _FunctionComponent_ . Ambos son genéricos, que se pueden reconocer fácilmente por el paréntesis angular _<>_ después del nombre del tipo. Dentro de los paréntesis angulares tenemos <i>P = {}</i>. Eso significa que puede pasar un tipo como argumento. El tipo recibido tendrá el nombre <i>P</i>, y es un objeto vacío <i>{}</i> por defecto.

Ahora echemos un vistazo a la primera línea dentro de _FunctionComponent_:


```js
(props: PropsWithChildren<P>, context?: any): ReactElement | null;
```

Aquí puede ver que <i>props</i> es de tipo <i>PropsWithChildren</i>, que también es un tipo genérico al que se le pasa <i>P</i>. El tipo <i>PropsWithChildren</i> a su vez es una [intersección](https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types) de <i>P</i> y el tipo <i>{ children?: ReactNode }</i>.

```js
type PropsWithChildren<P> = P | { children?: ReactNode };
```

Bueno, eso fue complicado (¿o no?). Todo lo que necesitamos saber en este momento es que podemos definir un tipo y pasarlo a _FunctionComponent_, y los <i>props</i> del componente consisten en el tipo definido y los hijos(<i>children</i>) del componente .

Ahora, volvamos a nuestro ejemplo de código y veamos cómo definiríamos el tipo para los props del componente <i>Welcome</i> en TypeScript.

```jsx
interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

const element = <Welcome name="Sara" />;
ReactDOM.render(element, document.getElementById("root"));
```

Definimos un nuevo tipo _WelcomeProps_ y lo pasamos al componente <i>Welcome</i> en su declaración de tipo:

```js
const Welcome: React.FC<WelcomeProps>;
```

Podría escribir lo mismo con una sintaxis menos detallada:

```jsx
const Welcome: React.FC<{ name: string }> = ({ name }) => (
  <h1>Hello, {name}</h1>
);
```

Ahora nuestro editor sabe que el prop <i>name</i> es un string. Por alguna razón, eslint no está satisfecho y se queja de que <i>'name' is missing in props validation</i> (falta 'nombre' en la validación de props). Esto sucede porque las reglas de react linting esperan que definamos propTypes para todos los props. No es consciente de que ya estamos usando TypeScript para definir tipos para nuestros props.

Para corregir el error, necesitamos agregar una nueva regla de pelusa a <i>.eslintrc</i>:

```json
{
  // ...
  "rules": {
    "react/prop-types": 0, // highlight-line
  },  
  // ...
}
```

</div>

<div class="tasks">

### Ejercicio 9.14.

#### 9.14.

Cree una nueva Create React App con TypeScript y configure eslint para el proyecto de manera similar a como lo hicimos.

Este ejercicio es similar al que ya hizo en la [Parte 1](/es/part1/java_script#exercises-1-3-1-5) del curso, pero con TypeScript y algunos ajustes adicionales. Comience modificando el contenido de <i>index.tsx</i> a lo siguiente:

```jsx
import React from "react";
import ReactDOM from "react-dom";

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <h1>{courseName}</h1>
      <p>
        {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
        {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
        {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

y elimine los archivos innecesarios.

Toda la aplicación ahora está en un componente. Eso no es lo que queremos, así que refactorice el código para que conste de tres componentes: <i>Header</i>, <i>Content</i> y <i>Total</i>. Todos los datos se mantienen en el componente <i>App</i>, que pasa todos los datos necesarios a cada componente como props. ¡Asegúrese de agregar declaraciones de tipo para los props de cada componente!

El componente <i>Header</i> debe encargarse de renderizar el nombre del curso. <i>Content</i> debe representar los nombres de las diferentes partes y la cantidad de ejercicios en cada parte, y <i>Total</i> debe renderizar la suma total de ejercicios en todas las partes.

El componente <i>App</i> debería verse algo así:


```jsx
const App = () => {
  // const-declarations

  return (
    <div>
      <Header name={courseName} />
      <Content ... />
      <Total ... />
    </div>
  )
};
```
</div>

<div class="content">

### Uso de tipo más profundo

En el ejercicio anterior teníamos tres partes de un curso, y todas las partes tenían los mismos atributos <i>name</i> y <i>exerciseCount</i>. Pero, ¿qué pasaría si tuviéramos la necesidad de atributos adicionales para las partes y cada parte tuviera la necesidad de diferentes atributos? ¿Cómo se vería esto en código? Consideremos el siguiente ejemplo:

```js
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
  }
];
```

En el ejemplo anterior, hemos agregado algunos atributos adicionales a cada parte del curso. Cada parte tiene los atributos <i>name</i> y <i>exerciseCount</i>, pero la primera y la tercera también tienen un atributo llamado <i>description</i> y la segunda y la tercera parte también tienen algunos atributos adicionales distintos.

Imaginemos que nuestra aplicación sigue creciendo y necesitamos pasar las diferentes partes del curso en nuestro código. Además de eso, también se agregan atributos adicionales y partes del curso a la mezcla. ¿Cómo podemos saber que nuestro código es capaz de manejar correctamente todos los diferentes tipos de datos y no nos estamos olvidando, por ejemplo, de renderizar una nueva parte del curso en alguna página? ¡Aquí es donde TypeScript es realmente útil!

Comencemos por definir tipos para nuestras diferentes partes del curso:

```js
interface CoursePartOne {
  name: "Fundamentals";
  exerciseCount: number;
  description: string;
}

interface CoursePartTwo {
  name: "Using props to pass data";
  exerciseCount: number;
  groupProjectCount: number;
}

interface CoursePartThree {
  name: "Deeper type usage";
  exerciseCount: number;
  description: string;
  exerciseSubmissionLink: string;
}
```

A continuación, crearemos una [unión de tipos](http://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) de todos estos tipos. Luego podemos usarlo para definir un tipo para nuestro array, que debería aceptar cualquiera de estos tipos de partes del curso:

```js
type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree;
```

Ahora podemos establecer el tipo de nuestra variable <i>courseParts</i>. Ahora nuestro editor nos advertirá automáticamente si usamos un tipo incorrecto para un atributo, usamos un atributo adicional u olvidamos establecer un atributo esperado. Puede probar esto comentando cualquier atributo de cualquier parte del curso. Gracias al [string literal](http://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types) de <i>name</i>, TypeScript puede identificar qué parte del curso requiere qué atributos adicionales, incluso si la variable está definida para usar la unión de tipos.

¡Pero todavía no estamos satisfechos! Todavía hay mucha duplicación en nuestros tipos y queremos evitar eso. Comenzamos identificando los atributos que todas las partes del curso tienen en común y definiendo un tipo base que los contiene. Luego, [ampliaremos](http://www.typescriptlang.org/docs/handbook/interfaces.html#extending-interfaces) ese tipo base para crear nuestros tipos específicos de partes:

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartOne extends CoursePartBase {
  name: "Fundamentals";
  description: string;
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBase {
  name: "Deeper type usage";
  description: string;
  exerciseSubmissionLink: string;
}
```

¿Cómo deberíamos utilizar ahora estos tipos en nuestros componentes?

Una forma práctica de utilizar este tipo de tipos en TypeScript es mediante el uso de expresiones _switch case_. Una vez que haya declarado explícitamente o que TypeScript haya inferido que una variable es de unión de tipos y cada tipo en la unión de tipos contiene un determinado atributo, podemos usarlo como un identificador de tipo. Luego podemos construir un switch case alrededor de ese atributo y TypeScript sabrá qué atributos están disponibles dentro de cada bloque de case.

![](../../images/9/32.png)

En el ejemplo anterior, TypeScript sabe que un <i>coursePart</i> tiene el tipo <i>CoursePart</i>. Entonces puede inferir que <i>part</i> es de tipo <i>CoursePartOne</i>, <i>CoursePartTwo</i> o <i>CoursePartThree</i>. <i>name</i> es distinto para cada tipo, por lo que podemos usarlo para identificar cada tipo y TypeScript puede hacernos saber qué atributos están disponibles en cada bloque de casos. TypeScript entonces producirá un error si se intenta utilizar por ejemplo <i>part.description</i> dentro del bloque <i>"Using props to pass data"</i>.

¿Qué hay de agregar nuevos tipos? Si tuviéramos que agregar una nueva parte del curso, ¿no sería bueno saber si ya hemos implementado el manejo de ese tipo en nuestro código? En el ejemplo anterior, un nuevo tipo iría al bloque <i>default</i> y no se imprimiría nada para un nuevo tipo. Por supuesto, a veces esto es totalmente aceptable, por ejemplo, si desea manejar solo casos específicos (no todos) de una unión de tipos, pero en la mayoría de los casos se recomienda manejar todas las variaciones por separado.

Con TypeScript podemos utilizar un método llamado <i>comprobación exhaustiva de tipos</i>. Su principio básico es que si encontramos un valor inesperado, llamamos a una función que acepta un valor con el tipo [never](https://www.typescriptlang.org/docs/handbook/basic-types.html#never) y también tiene el tipo de retorno <i>never</i>.

Una versión sencilla de la función podría verse así:

```js
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```
Si ahora reemplazáramos el contenido de nuestro bloque <i>default</i>por:


```js
default:
  return assertNever(part);
```


y también comentaríamos el bloque de casos de <i>Deeper type usage</i>, veríamos el siguiente error:


![](../../images/9/33.png)

El mensaje de error dice que <i>el argumento de tipo 'CoursePartThree' no se puede asignar al parámetro de tipo 'never'</i>, lo que nos dice que estamos usando una variable en algún lugar donde nunca debería usarse. Esto nos dice que hay que arreglar algo. Cuando eliminemos los comentarios del bloque case <i>Deeper type usage</i>, verá que el error desaparece.

</div>

<div class="tasks">

### Ejercicio 9.15.

#### 9.15.

Primero agregue la información de tipo a <i>index.tsx</i> y reemplace la variable <i>courseParts</i> con la del ejemplo siguiente.

```js
// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartOne extends CoursePartBase {
  name: "Fundamentals";
  description: string;
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBase {
  name: "Deeper type usage";
  description: string;
  exerciseSubmissionLink: string;
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree;

// this is the new coursePart variable
const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
  }
];
```

Ahora sabemos que ambas interfaces <i>CoursePartOne</i> y <i>CoursePartThree</i> comparten no solo los atributos base, sino también un atributo llamado <i>description</i>, que es un string en ambas interfaces.

Su primera tarea es declarar una nueva interfaz, que incluye el atributo <i>description</i> y extiende la interfaz de <i>CoursePartBase</i>. Luego, modifique el código para que pueda eliminar el atributo de <i>description</i> de <i>CoursePartOne</i> y <i>CoursePartThree</i> sin obtener ningún error.

A continuación, cree un componente <i>Part</i> que represente todos los atributos de cada tipo de parte del curso. Utilice un switch case basado en verificación de tipo exhaustiva. Utilice el nuevo componente en el componente <i>Content</i>.

Por último, agregue su propia interfaz de parte del curso con al menos los siguientes atributos: <i>name</i>, <i>exerciseCount</i> y <i>description</i>. Luego agregue esa interfaz a la unión de tipos <i>CoursePart</i> y agregue los datos correspondientes a la variable <i>courseParts</i>. Ahora, si no ha modificado su componente <i>Content</i> correctamente, debería recibir un error, porque aún no ha agregado soporte para el cuarto tipo de parte del curso. Realice los cambios necesarios en <i>Content</i> para que todos los atributos de la nueva parte del curso también se rendericen y el compilador no produzca ningún error.

</div>

<div class="content">

### Una nota sobre la definición de tipos de objetos
Hemos utilizado [interfaces](http://www.typescriptlang.org/docs/handbook/interfaces.html) para definir tipos de objetos, por ejemplo, entradas de diario, en la sección anterior.

```js
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```
y parte del curso en esta sección

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

De hecho, podríamos haber tenido el mismo efecto usando un [alias de tipo](http://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases)


```js
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

En la mayoría de los casos, puede utilizar la sintaxis que prefiera, <i>type</i> or <i>interface</i>. Sin embargo, hay algunas cosas a tener en cuenta. Por ejemplo, si define varias interfaces con el mismo nombre, darán como resultado una interfaz fusionada, mientras que si intenta definir varios tipos con el mismo nombre, dará como resultado un error que indica que un tipo con el mismo nombre ya está declarado.

La documentación de TypeScript [recomienda el uso de interfaces](http://www.typescriptlang.org/docs/handbook/advanced-types.html#interfaces-vs-type-aliases) en la mayoría de los casos.

### Trabajar con una base de código existente

Al sumergirse en una base de código existente por primera vez, es bueno obtener una visión general de las convenciones y la estructura del proyecto. Puede comenzar su investigación leyendo README.md en la raíz del repositorio. Por lo general, el archivo <i>README.md</i> contiene una breve descripción de la aplicación y los requisitos para usarla, así como cómo iniciarla para el desarrollo. Si README no está disponible o alguien ha "ahorrado tiempo" y lo ha dejado como código auxiliar, puede echar un vistazo al <i>package.json</i>. Siempre es una buena idea iniciar la aplicación y hacer clic para verificar que tiene un entorno de desarrollo funcional.

También puede examinar la estructura de carpetas para obtener información sobre la funcionalidad de la aplicación y/o la arquitectura utilizada. Estos no siempre son claros y es posible que los desarrolladores hayan elegido una forma de organizar el código que no le resulte familiar. El [proyecto de muestra](https://github.com/fullstack-hy2020/patientor) utilizado en el resto de esta parte está organizado por características. Puede ver qué páginas tiene la aplicación y algunos componentes generales, por ejemplo, modales y estado. Tenga en cuenta que las funciones pueden tener diferentes alcances. Por ejemplo, los modales son componentes visibles de la interfaz de usuario, mientras que el estado es comparable a la lógica empresarial y mantiene los datos organizados bajo el capó para que los use el resto de la aplicación.

TypeScript le proporciona tipos que le indican qué tipo de estructuras de datos, funciones, componentes y estado esperar. Puede intentar buscar <i>types.ts</i> o algo similar para comenzar. VSCode es de gran ayuda y solo resaltar variables y parámetros puede brindarle una gran cantidad de información. Todo esto, naturalmente, depende de cómo se utilicen los tipos en el proyecto.

Si el proyecto tiene pruebas unitarias, de integración o de un extremo a otro, leerlas probablemente sea beneficioso. Los casos de prueba son su herramienta más importante al refactorizar o crear nuevas funciones para la aplicación. Desea asegurarse de no romper ninguna característica existente al manipular el código. TypeScript también puede brindarle orientación sobre tipos de argumentos y devoluciones al cambiar el código.

Recuerde que leer código es una habilidad en sí misma, y ​​no se preocupe si no comprende el código en la primera lectura completa. El código puede tener muchos casos de esquina, y es posible que se hayan agregado piezas de lógica aquí y allá a lo largo de su ciclo de desarrollo. Es difícil imaginar con qué tipo de problemas ha estado luchando el desarrollador anterior. Piense en todo esto como [anillos de crecimiento en árboles](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings). Comprenderlo todo requiere profundizar en el código y los requisitos del dominio empresarial. Cuanto más código lea, mejor lo hará. Leerá más código del que va a producir.


### Patientor frontend

Es hora de ensuciarnos las manos finalizando el frontend para el backend que construimos en los e[jercicios 9.8.-9.13.](/es/part9/typing_the_express_app).

Antes de sumergirnos en el código, comencemos tanto el frontend como el backend.

Si todo va bien, debería ver una página de lista de pacientes. Obtiene una lista de pacientes de nuestro backend y la muestra en la pantalla como una tabla simple. También hay un botón para crear nuevos pacientes en el backend. Como usamos datos simulados en lugar de una base de datos, los datos no persistirán; cerrar el backend eliminará todos los datos que hemos agregado. El diseño de la interfaz de usuario claramente no ha sido un punto fuerte de los creadores, así que ignoremos la interfaz de usuario por ahora.

Luego de verificar que todo funciona, podemos comenzar a estudiar el código. Todas las cosas interesantes se encuentran en la carpeta <i>src/</i>. Para su comodidad, también hay un archivo <i>types.ts</i> listo para los tipos básicos utilizados en la aplicación, que tendrá que ampliar o refactorizar en los ejercicios.

En principio, podríamos usar los mismos tipos tanto para el backend como para el frontend, pero generalmente el frontend tiene diferentes estructuras de datos y casos de uso para los datos, lo que hace que los tipos sean diferentes. Por ejemplo, el frontend tiene un estado y puede querer mantener los datos en objetos o mapas, mientras que el backend usa un array. Es posible que el frontend tampoco necesite todos los campos de un objeto de datos guardados en el backend, y es posible que deba agregar algunos campos nuevos para usarlos en la representación.

La estructura de carpetas tiene el siguiente aspecto:

![](../../images/9/34a.png)

Como era de esperar, actualmente hay dos componentes principales: <i>AddPatientModal</i> y <i>PatientListPage</i>. La carpeta <i>state/</i> contiene el manejo del estado para la interfaz. La principal funcionalidad del código en <i>state/</i> es mantener nuestros datos en un solo lugar y ofrecer acciones simples para alterar el estado de nuestra aplicación.

### Manejo del estado

Estudiemos el manejo del estado un poco más de cerca, ya que muchas cosas parecen estar sucediendo bajo el capó y difiere un poco de los métodos utilizados en el curso hasta ahora.

La administración del estado se construye usando los hooks de React [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) y [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer). Esta es una configuración bastante buena porque sabemos que la aplicación será bastante pequeña y no queremos usar <i>redux</i> u otras bibliotecas similares para la administración del estado. Hay mucho material bueno, por ejemplo, [este artículo](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe), sobre este enfoque de la gestión de estados.

El enfoque adoptado en esta aplicación utiliza [context](https://reactjs.org/docs/context.html) de React, que según su documentación

> <i>...... está diseñado para compartir datos que pueden considerarse "globales" para un árbol de componentes de React, como el usuario autenticado actual, el tema o el idioma preferido.</i> 

En nuestro caso, los datos compartidos "globales" son el estado de la aplicación <i>y</i> la función de envío que se utiliza para realizar cambios en los datos. En muchos sentidos, nuestro código funciona de forma muy similar a la gestión de estado basada en redux que usamos en la [parte 6](/es/part6), pero es más ligero ya que no requiere el uso de bibliotecas externas. Esta parte asume que al menos está familiarizado con la forma en que funciona redux, por ejemplo, debería haber cubierto al menos la [primera sección](/es/part6/flux_architecture_and_redux) de la parte 6.

El [context](https://reactjs.org/docs/context.html de nuestra aplicación tiene una tupla que contiene el estado de la aplicación y el despachador para cambiar el estado. El estado de la aplicación se escribe de la siguiente manera:

```js
export type State = {
  patients: { [id: string]: Patient };
};
```

El estado es un objeto con una key <i>patients</i>, que tiene un [diccionario](https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types-and-index-signatures) o simplemente pone un objeto con keys de strings y con un objeto <i>Patient</i> como valores. El índice solo puede ser un <i>string</i> o un <i>number</i> ya que puede acceder a los valores del objeto usando esos. Esto obliga a que el estado se ajuste a la forma que queremos y evita que los desarrolladores hagan un mal uso del estado.

¡Pero ten en cuenta una cosa! Cuando un tipo se declara como el tipo para <i>patients</i>, TypeScript en realidad no tiene ninguna forma de saber si la key a la que está intentando acceder realmente existe o no. Entonces, si intentáramos acceder a un paciente mediante una identificación no existente, el compilador pensaría que el valor devuelto es de tipo <i>Patient</i> y no se produciría ningún error al intentar acceder a sus propiedades:

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // no error, TypeScript believes that myPatient is of type Patient
```

Para solucionar esto, podríamos definir el tipo de valores del paciente para que sea una unión de <i>Patient</i> y <i>undefined</i> de la siguiente manera:

```js
export type State = {
  patients: { [id: string]: Patient | undefined };
};
```

Eso haría que el compilador diera la siguiente advertencia:


```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // error, Object is possibly 'undefined'
```

Este tipo de seguridad de tipo adicional siempre es bueno para implementar si, por ejemplo, usa datos de fuentes externas o usa el valor de una entrada de usuario para acceder a datos en su código. Pero si está seguro de que solo maneja datos que realmente existen, entonces nadie le impide usar la primera solución presentada.

A pesar de que no los estamos usando en esta parte del curso, es bueno mencionar que una forma más estricta de tipos sería usar objetos [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), a los que puede declarar un tipo tanto para la key como para el contenido. La función de acceso de map <i>get()</i> siempre devuelve una unión del tipo de valor declarado e indefinido, por lo que TypeScript requiere automáticamente que realice verificaciones de validez en los datos recuperados de un map:

```js
interface State {
  patients: Map<string, Patient>;
}
...
const myPatient = state.patients.get('non-existing-id'); // type for myPatient is now Patient | undefined 
console.log(myPatient.name); // error, Object is possibly 'undefined'

console.log(myPatient?.name); // valid code, but will log 'undefined'
```

<!--
You can also think of a scenario where we may have state as a union. Eg. using states type as an indicator whether user has logged in:

```js
export type State =
  | {
      type: "Unauthenticated";
    }
  | {
      type: "Authenticated";
      currentUser: User;
    };
```

This is one way of using TypeScript to help keeping the applications state under control. We know that if the state is in <i>type: "Authenticated"</i> we will have a <i>currentUser</i> field in state.

This matches the arguments that are received from [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer). hook. Dispatch function takes as parameter objects with of <i>Action</i> which is defined in <i>reducer.ts</i> alongside the actual reducer function defining what the action does to the state returning a new state. 

The main principle in our state management approach is to pass the state to our components through the context and to modify the state using reducers. 

-->

Al igual que con redux, toda la manipulación de estados se realiza mediante un reducer. Se define en el archivo <i>reducer.ts</i> junto con el tipo <i>Action</i> que se ve de la siguiente manera

```js
export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };
```

El reducer se parece bastante a los que escribimos en la [parte 6](/es/part6). Cambia el estado para cada tipo de acción:

```js
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
```

La principal diferencia es que el estado ahora es un diccionario (o un objeto), en lugar de un array que usamos en la [parte 6](/es/part6).

Suceden muchas cosas en el archivo <i>state.ts</i>, que se encarga de configurar el contexto. El ingrediente principal es el hok [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) utilizado para crear el estado y la función de envío, y pasarlos al [context provider](https://reactjs.org/docs/context.html#contextprovider):

```js
export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState); // highlight-line
  return (
    <StateContext.Provider value={[state, dispatch]}>  // highlight-line
      {children}
    </StateContext.Provider>
  );
};
```

El proveedor hace que las funciones de <i>state</i> y <i>dispatch</i> estén disponibles en todos los componentes, gracias a la configuración en <i>index.ts</i>:

```js 
import { reducer, StateProvider } from "./state";

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>, 
  document.getElementById('root')
);
```

También define el hook <i>useStateValue</i>

```js 
export const useStateValue = () => useContext(StateContext);
```

y los componentes que necesitan acceder al estado o el despachador lo usan para obtener esos:

```js 
import { useStateValue } from "../state";

// ...

const PatientListPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

No se preocupe si esto le parece confuso, seguramente lo es hasta que haya estudiado la [documentación del contexto](https://reactjs.org/docs/context.html) y su uso en la [gestión del estado](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe). ¡No es necesario que comprenda todo esto completamente para hacer los ejercicios!

De hecho, es bastante común que cuando comienzas a trabajar en una aplicación existente, no comprendas el 100% de lo que sucede bajo el capó al principio. Si la aplicación se ha estructurado correctamente, puede confiar en que si realiza modificaciones cuidadosas, la aplicación seguirá funcionando a pesar de que no comprendió todos los mecanismos internos. Con el tiempo, comprenderá las partes menos familiares, pero no sucede de la noche a la mañana cuando se trabaja con una base de código grande.


###  Página de listado de pacientes

Revisemos <i>PatientListPage/index.ts</i>, ya que puede inspirarse desde allí para ayudarlo a obtener datos del backend y actualizar el estado de la aplicación. <i>PatientListPage</i> usa nuestro hook personalizado para inyectar el estado y el despachador para actualizarlo. Cuando enumeramos a los pacientes, solo necesitamos desestructurar la propiedad <i>patients</i> del estado:

```js
import { useStateValue } from "../state";

const PatientListPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

También usamos el estado de la aplicación creado con el hook <i>useState</i> para administrar la visibilidad modal y el manejo de errores de formulario:

```js
const [modalOpen, setModalOpen] = React.useState<boolean>(false);
const [error, setError] = React.useState<string | undefined>();
```

Le damos al hook <i>useState</i> un parámetro de tipo, que luego se aplica al estado real. Entonces <i>modalOpen</i> es un <i>booleano</i> y <i>error</i> tiene el tipo <i>string | undefined</i>. Ambas funciones de conjunto devueltas por el hook useState son funciones que aceptan solo argumentos de acuerdo con el parámetro de tipo dado, por ejemplo. el tipo exacto de la función <i>setModalOpen</i> es React.Dispatch <i>React.Dispatch<React.SetStateAction&lt;boolean&gt;></i>.

También tenemos funciones de ayuda <i>openModal</i> y <i>closeModal</i> para una mejor legibilidad y conveniencia:

```js
const openModal = (): void => setModalOpen(true);

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};
```

Los tipos de frontend se basan en lo que ha creado al desarrollar el backend en la parte anterior.

Cuando el componente <i>App</i> se monta, busca pacientes del backend usando [axios](https://github.com/axios/axios). Observe cómo le estamos dando a la función <i>axios.get</i> un parámetro de tipo para describir el tipo de datos de respuesta:

````js
React.useEffect(() => {
  axios.get<void>(`${apiBaseUrl}/ping`);

  const fetchPatientList = async () => {
    try {
      const { data: patients } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
      );
      dispatch({ type: "SET_PATIENT_LIST", payload: patients });
    } catch (e) {
      console.error(e);
    }
  };
  fetchPatientList();
}, [dispatch]);
````


**¡Una palabra de advertencia!** Pasar un parámetro de tipo a axios no validará ningún dato. Es bastante peligroso, especialmente si está utilizando API externas. Puede crear funciones de validación personalizadas que abarquen toda la carga útil y devuelvan el tipo correcto, o puede utilizar una protección de tipos. Ambas son opciones válidas. También hay muchas bibliotecas que brindan validación a través de diferentes tipos de esquemas, por ejemplo, [io-ts](https://github.com/gcanti/io-ts). En aras de la simplicidad, continuaremos confiando en nuestro propio trabajo y confiando en que obtendremos datos de la forma correcta del backend.

Como nuestra aplicación es bastante pequeña, actualizaremos el estado simplemente llamando a la función <i>dispatch</i> que nos proporciona el hook <i>useStateValue</i>. El compilador ayuda asegurándose de que despachamos acciones de acuerdo con nuestro tipo de <i>Action</i> con un string de tipo predefinida y una carga útil:

```js
dispatch({ type: "SET_PATIENT_LIST", payload: patients });
```

</div>

<div class="tasks">

### Ejercicios 9.16.-9.18.

Pronto agregaremos un nuevo tipo <i>Entry</i> para nuestra aplicación que representa una entrada de diario de paciente liviana. Consiste en el texto de la revista, es decir , <i>description</i>, fecha de creación, información sobre el especialista que la creó y posibles códigos de diagnóstico. Los códigos de diagnóstico se asignan a los códigos ICD-10 devueltos desde el endpoint <i>/api/diagnoses</i>. Nuestra implementación ingenua será que un paciente tiene un array de entradas.

Antes de entrar en esto, hagamos algunos trabajos preparatorios.

#### 9.16: patientor, paso 1
Cree un endpoint <i>/api/patients/:id</i> que devuelva toda la información del paciente para un paciente, incluida el array de entradas de pacientes que todavía está vacía para todos los pacientes. Por el momento, expanda los tipos de backend de la siguiente manera:

```js
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[] // highlight-line
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >  // highlight-line
```

La respuesta debe tener el siguiente aspecto:

![](../../images/9/38a.png)

#### 9.17: patientor, paso 2

Cree una página para mostrar la información completa de un paciente en el frontend.

El usuario debe poder acceder a la información de un paciente, por ejemplo, haciendo clic en el nombre del paciente.

Obtenga los datos del enpoint creado en el ejercicio anterior. Después de obtener la información del paciente del backend, agregue la información obtenida al estado de la aplicación. No obtenga la información si ya está en el estado de la aplicación, es decir, si el usuario está visitando la información del mismo paciente muchas veces.

Dado que ahora tenemos el estado en el contexto, deberá definir un nuevo tipo de acción para actualizar los datos de un paciente individual.

La aplicación usa [Semantic UI React](https://react.semantic-ui.com/) para estilar, que es bastante similar a [React Bootstrap](https://react-bootstrap.github.io/) y  [MaterialUI](https://material-ui.com/) que cubrimos en la [parte 7](/es/part7/more_about_styles). También puede usarlo para los nuevos componentes, pero eso depende de usted, ya que nuestro enfoque principal ahora es Typecript.

La aplicación también usa el [react router](https://reacttraining.com/react-router/web/guides/quick-start) para controlar qué vista es visible en el frontend. Es posible que desee echar un vistazo a la [parte 7](/es/part7/react_router) si aún no comprende cómo funciona el enrutador.

El resultado podría verse así:

![](../../images/9/39a.png)

El género se muestra con el [icono](https://react.semantic-ui.com/elements/icon/#gendersicons-can-represent-genders-or-types-of-sexuality)  del componente react-semantic-ui

**Tenga en cuenta** que para acceder al id en la URL, debe proporcionar a [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams) un argumento de tipo adecuado:

```js
const { id } = useParams<{ id: string }>();
```

#### 9.18: patientor, paso 3

Actualmente creamos los objetos de <i>acción</i> dondequiera que despachamos las acciones, por ejemplo, el componente <i>App</i> tiene lo siguiente:

```js
dispatch({
  type: "SET_PATIENT_LIST", payload: patientListFromApi
});
```

Refactorice el código para usar funciones de [creación de acciones](/es/part6/flux_architecture_and_redux#action-creators) que están todas definidas en el archivo <i>reducer.tsx</i>.

Por ejemplo, <i>App</i> cambia así

```js
import { useStateValue, setPatientList } from "./state";

// ...

dispatch(setPatientList(patientListFromApi));
```


</div>

<div class="content">

### Full entries
En el [ejercicio 9.12.](/es/part9/typing_the_express_app#exercises-9-12-9-13) implementamos un endpoint  para obtener los diagnósticos del paciente, pero todavía no lo usamos en absoluto. Dado que ahora tenemos una página para ver la información de un paciente, sería bueno ampliar un poco nuestros datos. Agreguemos un campo <i>Entry</i> a los datos de nuestros pacientes para que los datos de un paciente contengan sus entradas médicas, incluidos los posibles diagnósticos.

Vamos a deshacernos de nuestros datos iniciales de pacientes antiguos del backend y comencemos a usar [este formato expandido](https://github.com/fullstack-hy2020/misc/blob/master/patients.ts).

**Aviso:** esta vez los datos no están en formato .json sino en formato .ts. Ya debería tener implementados los tipos completos <i>Gender</i> y <i>Patient</i>, por lo que solo corrija las rutas de donde se importan si es necesario.

Creemos ahora un tipo <i>Entry</i> adecuado en función de los datos que tenemos.

Si echamos un vistazo más de cerca a los datos, podemos ver que las entradas son en realidad bastante diferentes entre sí. Por ejemplo, echemos un vistazo a las dos primeras entradas:

```js
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: '2015-01-16',
    criteria: 'Thumb has healed.',
  }
}
...
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'MD House',
  employerName: 'HyPD',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description:
    'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

Inmediatamente podemos ver que mientras los primeros campos son los mismos, la primera entrada tiene un campo <i>discharge</i> y la segunda entrada tiene los campos <i>employerName</i> y <i>sickLeave</i>. Todas las entradas parecen tener algunos campos en común, pero algunos campos son específicos de la entrada.

Al observar el <i>tipo</i>, podemos ver que en realidad hay tres tipos de entradas: <i>OccupationalHealthcare</i>, <i>Hospital</i> y <i>HealthCheck</i>. Esto indica que necesitamos tres tipos separados. Dado que todos tienen algunos campos en común, es posible que deseemos crear una interfaz de entrada base que podamos ampliar con los diferentes campos de cada tipo.

Al mirar los datos, parece que los campos <i>id</i>, <i>description</i>, <i>date</i> y <i>specialist</i> son algo que se puede encontrar en cada entrada. Además de eso, parece que <i>diagnosisCodes</i> solo se encuentran en una entrada de tipo <i>OccupationalHealthCare</i> y una de tipo <i>Hospital</i>. Dado que no siempre se usa incluso en esos tipos de entradas, es seguro asumir que el campo es opcional. También podríamos considerar agregarlo al tipo <i>HealthCheck</i>, ya que es posible que no se use en estas entradas específicas.

Entonces, nuestra <i>BaseEntry</i> desde la que se podría extender cada tipo sería la siguiente:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

Si queremos ajustarlo un poco más, dado que ya tenemos un tipo <i>Diagnosis</i> definido en el backend, es posible que solo queramos referirnos al campo de código del tipo <i>Diagnosis</i> directamente en caso de que su tipo alguna vez cambie. Podemos hacerlo así:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
```

Como recordará, <i>Array&lt;Type&gt;</i> es solo una forma alternativa de decir <i>Type[]</i>. En casos como este, es mucho más claro usar la convención de array, ya que la otra opción sería definir el tipo diciendo <i>Diagnosis['code'][]</i>, lo que comienza a parecer un poco extraño.

Ahora que tenemos <i>BaseEntry</i> definido, podemos comenzar a crear los tipos de entrada extendidos que realmente usaremos. Comencemos por crear el tipo <i>HealthCheckEntry</i>.

Las entradas de tipo <i>HealthCheck</i> contienen el campo <i>HealthCheckRating</i>, que es un número entero de 0 a 3, cero significa<i>Healthy</i> (saludable) y 3 significa <i>CriticalRisk</i> (riesgo critico). Este es un caso perfecto para una definición de enumeración. Con estas especificaciones podríamos escribir una definición de tipo <i>HealthCheckEntry</i> así:

```js
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
```

Ahora solo necesitamos crear los tipos <i>OccupationalHealthCareEntry</i> and <i>HospitalEntry</i> para que podamos combinarlos y exportarlos como un tipo Entry como este:

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

</div>

<div class="tasks">

### Ejercicios 9.19.-9.22.

#### 9.19: patientor, paso 4

Defina los tipos <i>OccupationalHealthCareEntry</i> y <i>HospitalEntry</i> para que se ajusten a los datos de ejemplo. Asegúrese de que su backend devuelva las entradas correctamente cuando vaya a la ruta de un paciente individual

![](../../images/9/40.png)

¡Utilice los tipos correctamente en el backend! Por ahora no es necesario hacer una validación adecuada para todos los campos de las entradas en el backend, es suficiente, por ejemplo, comprobar que campo <i>type</i> tiene un valor correcto.

#### 9.20: patientor, paso 5

Amplíe la página de un paciente en el frontend para enumerar <i>date</i>, <i>description</i> y <i>diagnose codes</i> de las entradas del paciente.

Puede utilizar la misma definición de tipo para una <i>Entry</i> en la interfaz. Para estos ejercicios, basta con copiar/pegar las definiciones del backend al frontend.

Su solución podría verse así:

![](../../images/9/41.png)

#### 9.21: patientor, paso 6

Obtenga y agregue diagnósticos al estado de la aplicación desde el endpoint <i>/api/diagnosis</i>. Utilice los nuevos datos de diagnóstico para mostrar las descripciones de los códigos de diagnóstico del paciente:

![](../../images/9/42.png)

#### 9.22: patientor, paso 7

Amplíe la lista de entradas en la página del paciente para incluir los detalles de la entrada con un nuevo componente que muestra el resto de la información de las entradas de los pacientes distinguiendo diferentes tipos entre sí.

Podría utilizar, por ejemplo. [Icon](https://react.semantic-ui.com/elements/icon/) o algún otro componente de [SemanticUI](https://react.semantic-ui.com/) para obtener imágenes apropiadas para su listado.

Debe utilizar un renderizado _switch case_ y una <i>comprobación de tipo exhaustiva</i> para que no se olviden casos.

Como esto: 

![](../../images/9/35c.png)

Las entradas resultantes en la lista <i>podrían</i> verse así:

![](../../images/9/36a.png)

</div>

<div class="content">

### Agregar formulario de paciente

El manejo de formularios a veces puede ser una molestia en React. Es por eso que hemos decidido utilizar el paquete [Formik](https://jaredpalmer.com/formik/docs/overview) para nuestro formulario para agregar pacientes en nuestra aplicación. Aquí hay una pequeña introducción de la documentación de Formiks:

> Formik es una pequeña librería que te ayuda con las 3 partes más molestas:
> 
> - Obtener valores dentro y fuera del estado del formulario
> - Mensajes de validación y error
> - Manejo de envío de formularios
>
> Al colocar todo lo anterior en un solo lugar, Formik mantendrá las cosas organizadas, lo que hará que las pruebas, la refactorización y el razonamiento sobre sus formularios sean muy sencillos.

El código para el formulario se puede encontrar en <i>src/AddPatientModal/AddPatientForm.tsx</i> y algunos helpers de campo de formulario se pueden encontrar en <i>src/AddPatientModal/FormField.tsx</i>.

Mirando la parte superior de <i>AddPatientForm.tsx</i>, puede ver que hemos creado un tipo para nuestros valores de formulario, llamado simplemente <i>PatientFormValues</i>. El tipo es una versión modificada del tipo <i>Patient</i>, con las propiedades <i>id</i> y <i>entries</i> omitidas. No queremos que el usuario pueda enviarlos al crear un nuevo paciente. El <i>id</i> es creada por el backend y solo se pueden agregar entradas para pacientes existentes.

```js
export type PatientFormValues = Omit<Patient, "id" | "entries">;
```

A continuación, declaramos los props para nuestro componente de formulario:

```js
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}
```

Como puede ver, el componente requiere dos props: <i>onSubmit</i> y <i>onCancel</i>. Ambas son funciones callback que devuelven <i>void</i>. La función <i>onSubmit</i> debería recibir un objeto de tipo <i>PatientFormValues</i> como argumento, de modo que la devolución de llamada pueda manejar nuestros valores de formulario.

Al observar el componente de función <i>AddPatientForm</i>, puede ver que hemos enlazado los <i>Props</i> como los props de nuestro componente, y desestructuramos <i>onSubmit</i> y <i>onCancel</i> de esos props.

```js
export const AddPatientForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  // ...
}
```

Ahora, antes de continuar, echemos un vistazo a nuestros helpers de formulario en <i>FormField.tsx</i>. Si comprueba lo que se exporta del archivo, encontrará el tipo <i>GenderOption</i> y los componentes de función <i>SelectField</i> y <i>TextField</i>.

Echemos un vistazo más de cerca a <i>SelectField</i> y los tipos que lo rodean. Primero creamos un tipo genérico para cada objeto de opción, que contiene un value y un label para ese value. Estos son el tipo de objetos de opción que queremos permitir en nuestro formulario en el campo de selección. Dado que las únicas opciones que queremos permitir son diferentes géneros, establecemos que <i>value</i> debe ser de tipo <i>Gender</i>.

```js
export type GenderOption = {
  value: Gender;
  label: string;
};
```

En <i>AddPatientForm.tsx</i> usamos el tipo <i>GenderOption</i> para la variable <i>genderOptions</i>, declarando que es un array que contiene objetos de tipo <i>GenderOption</i>:

```js
const genderOptions: GenderOption[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" }
];
```

A continuación, observe el tipo <i>SelectFieldProps</i>. Define el tipo de props para nuestro componente <i>SelectField</i>. Allí puede ver que las opciones son un array de tipos de <i>GenderOption</i>.

```js
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};
```

El componente de función <i>SelectField</i> en sí mismo es bastante sencillo. Renderiza el label, un elemento de selección y todos los elementos de opción dados (o en realidad sus labels y values).

```jsx
export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);
```

Ahora pasemos al componente <i>TextField</i>. El componente renderiza un SemanticUI [Form.Field](https://react.semantic-ui.com/collections/form/) con un label y un Formik [Campo](https://jaredpalmer.com/formik/docs/api/field). El campo Formik recibe un <i>name</i> y un <i>placeholder</i> como props.

```jsx
interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField: React.FC<TextProps> = ({ field, label, placeholder }) => (
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color:'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);
```

Tenga en cuenta que usamos componente de Formik [ErrorMessage](https://jaredpalmer.com/formik/docs/api/errormessage) para generar un mensaje de error para el input cuando sea necesario. El componente hace todo lo que hay debajo del capó, y no necesitamos especificar qué debe hacer.

También sería posible obtener los mensajes de error dentro del componente usando la prop <i>form</i>:

```jsx
export const TextField: React.FC<TextProps> = ({ field, label, placeholder, form }) => {
  console.log(form.errors); 
  // ...
}
```

Ahora, volvamos al componente de formulario <i>AddPatientForm.tsx</i>. El componente de función <i>AddPatientForm</i> renderiza un [componente de Formik](https://jaredpalmer.com/formik/docs/api/formik). El componente Formik es un contenedor, que requiere dos props: <i>initialValues</i> y <i>onSubmit</i>. La función de los props se explica por sí misma. El contenedor de Formik realiza un seguimiento del estado de su formulario y luego expone al estado y a algunos métodos y controladores de eventos que se pueden recuperar a su formulario a través de props.

También estamos usando una prop de <i>validación</i> opcional, que espera una función de validación y devuelve un objeto que contiene posibles errores. Aquí solo verificamos que nuestros campos de texto no sean falsos, además podría contener fácilmente, por ejemplo, alguna validación para el formato del número de seguridad social o algo así. Los mensajes de error definidos por esta función se pueden mostrar en el componente ErrorMessage del campo correspondiente.

Primero eche un vistazo a todo el componente. Más adelante discutiremos las diferentes partes en detalle.

```jsx
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}

export const AddPatientForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        ssn: "",
        dateOfBirth: "",
        occupation: "",
        gender: Gender.Other
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.name) {
          errors.name = requiredError;
        }
        if (!values.ssn) {
          errors.ssn = requiredError;
        }
        if (!values.dateOfBirth) {
          errors.dateOfBirth = requiredError;
        }
        if (!values.occupation) {
          errors.occupation = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              label="Social Security Number"
              placeholder="SSN"
              name="ssn"
              component={TextField}
            />
            <Field
              label="Date Of Birth"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              component={TextField}
            />
            <Field
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              component={TextField}
            />
            <SelectField
              label="Gender"
              name="gender"
              options={genderOptions}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;
```

Como hijo de nuestro contenedor Formik, tenemos una <i>función</i> que devuelve el contenido del formulario. Usamos el [Formulario](https://jaredpalmer.com/formik/docs/api/form) de Formik para renderizar el elemento de formulario real. Dentro del elemento Form usamos nuestros componentes <i>TextField</i> y <i>SelectField</i>, que creamos en <i>FormField.tsx</i>.

Por último, creamos dos botones: uno para cancelar el envío del formulario y otro para enviar el formulario. El botón cancelar llama al callback <i>onCancel</i> inmediatamente cuando se hace clic. El botón enviar activa el evento onSubmit de Formik, que a su vez usa el callback <i>onSubmit</i> de los props del componente. El botón enviar está habilitado solo si el formulario es <i>válido</i> y está <i>sucio</i>, lo que significa que el usuario ha editado algunos de los campos.

Manejamos el envío de formularios a través de Formik, porque nos permite llamar a la función de validación antes de realizar el envío real. Si la función de validación devuelve algún error, el envío se cancela.

Los botones se colocan dentro de un [Grid](https://react.semantic-ui.com/collections/grid/) de SemanticUI para colocarlos uno al lado del otro fácilmente.

```jsx
<Grid>
  <Grid.Column floated="left" width={5}>
    <Button type="button" onClick={onCancel} color="red">
      Cancel
    </Button>
  </Grid.Column>
  <Grid.Column floated="right" width={5}>
    <Button type="submit" floated="right" color="green">
      Add
    </Button>
  </Grid.Column>
</Grid>
```

El callback <i>onSubmit</i> se ha transmitido desde nuestra página de lista de pacientes. Básicamente, envía una solicitud HTTP POST a nuestro backend, agrega el paciente que regresó del backend al estado de nuestra aplicación y cierra el modal. Si el backend devuelve un error, el error se muestra en el formulario.

Aquí está nuestra función de envío:

```js
const submitNewPatient = async (values: FormValues) => {
  try {
    const { data: newPatient } = await axios.post<Patient>(
      `${apiBaseUrl}/patients`,
      values
    );
    dispatch({ type: "ADD_PATIENT", payload: newPatient });
    closeModal();
  } catch (e) {
    console.error(e.response.data);
    setError(e.response.data.error);
  }
};
```

Con este material deberías poder completar el resto de los ejercicios de esta parte. En caso de duda, intente leer el código existente para encontrar pistas sobre cómo proceder.

</div>

<div class="tasks">

### Ejercicios 9.23.-9.27.

#### 9.23: patientor, paso 8

Hemos establecido que los pacientes pueden tener diferentes tipos de entradas. Todavía no tenemos ninguna forma de agregar entradas a los pacientes en nuestra aplicación, por lo que en este momento es bastante inútil como registro médico electrónico.

Su siguiente tarea es agregar un endpoint  <i>/api/patients/:id/entries</i> a su backend, a través del cual pueda hacer POST(publicar) una entrada para un paciente.

Recuerde que tenemos diferentes tipos de entradas en nuestra aplicación, por lo que nuestro backend debe admitir todos esos tipos y verificar que se proporcionen al menos todos los campos obligatorios para cada tipo.

#### 9.24: patientor, paso 9

Ahora que nuestro backend permite agregar entradas, queremos agregar la funcionalidad correspondiente al frontend. En este ejercicio, debe agregar un formulario para agregar una entrada a un paciente. Un lugar intuitivo para acceder al formulario sería la página del paciente.

En este ejercicio es suficiente **admitir <i>un</i> tipo de entrada** y no tiene que manejar ningún error. Es suficiente si se puede crear una nueva entrada cuando el formulario se llena con datos válidos.

Tras un envío exitoso, la nueva entrada debe agregarse al paciente correcto y las entradas del paciente en la página del paciente deben actualizarse para contener la nueva entrada.

Si lo desea, puede reutilizar parte del código del formulario <i>Agregar paciente</i> para este ejercicio, pero esto no es un requisito.

Tenga en cuenta que el archivo  [FormField.tsx](https://github.com/fullstack-hy2020/patientor/blob/master/src/AddPatientModal/FormField.tsx#L58) tiene un componente _DiagnosisSelection_ listo para usar que se puede utilizar para establecer el campo <i>diagnoses</i>.

Se puede utilizar de la siguiente manera:

```js
const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue() // highlight-line

  return (
    <Formik
    initialValues={{
      /// ...
    }}
    onSubmit={onSubmit}
    validate={values => {
      /// ...
    }}
  >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => { // highlight-line

      return (
        <Form className="form ui">
          // ...

          // highlight-start
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />    
          // highlight-end

          // ...
        </Form>
      );
    }}
  </Formik>
  );
};
```

También existe el componente _NumberField_ listo para usar para los valores numéricos con un rango limitado

```js
<Field
  label="healthCheckRating"
  name="healthCheckRating"
  component={NumberField}
  min={0}
  max={3}
/>
```

#### 9.25: patientor, paso 10

Amplíe su solución para que muestre un mensaje de error si faltan algunos valores obligatorios o si el formato es incorrecto.

#### 9.26: patientor, paso 11

Amplíe su solución para que admita <i>dos</i> tipos de entrada y muestre un mensaje de error si faltan algunos valores obligatorios o tienen un formato incorrecto. No necesita preocuparse por los posibles errores en la respuesta del servidor.

La forma más fácil, pero seguramente no la más elegante, de hacer este ejercicio es tener un formulario separado para cada tipo de entrada diferente. Hacer que los tipos funcionen correctamente puede ser un pequeño desafío si usa solo un formulario.

#### 9.27: patientor, paso 12

Amplíe su solución para que admita <i>todos los tipos de entrada</i> y muestre un mensaje de error si faltan algunos valores obligatorios o tienen un formato incorrecto. No necesita preocuparse por los posibles errores en la respuesta del servidor.

Este fue el último ejercicio de esta parte del curso y es hora de enviar el código a GitHub y marcar todos los ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
