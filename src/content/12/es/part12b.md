---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: es
---

<div class="tasks">

Esta parte fue actualizada el 21 de Marzo de 2024: Create react app reemplazado con Vite en el frontend de todo.

Si comenzaste esta parte antes de la actualización, puedes ver el viejo material [aquí](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/tree/4015af9dddb61cb01f013456d8728e8f553be347/src/content/12). Hay algunos cambios en las configuraciones del frontend.
</div>

<div class="content">

En la sección anterior, usamos dos imágenes base diferentes: ubuntu y node, e hicimos un trabajo manual para ejecutar un simple "¡Hola, mundo!". Las herramientas y los comandos que aprendimos durante ese proceso nos serán útiles más adelante. En esta sección, aprenderemos a crear imágenes y configurar entornos para nuestras aplicaciones. Comenzaremos con un backend regular de Express/Node.js y lo desarrollaremos con otros servicios, incluida una base de datos MongoDB.

### Dockerfile

En lugar de modificar un contenedor copiando archivos dentro, podemos crear una nueva imagen que contenga la aplicación "¡Hola, mundo!". La herramienta para esto es el Dockerfile. Dockerfile es un archivo de texto simple que contiene todas las instrucciones para crear una imagen. Vamos a crear un Dockerfile de ejemplo a partir de la aplicación "Hello, World!".

Si aún no lo hiciste, crea un directorio en tu máquina y crea un archivo llamado <i>Dockerfile</i> dentro de ese directorio. También coloquemos un <i>index.js</i> que contenga _console.log('Hello, World!')_ al lado del Dockerfile. La estructura de su directorio debería verse así:

```
├── index.js
└── Dockerfile
```

Dentro de ese Dockerfile le diremos a la imagen tres cosas:

- Usa [node:20](https://hub.docker.com/_/node) como base para nuestra imagen.
- Incluye al archivo index.js dentro de la imagen, así no necesitaremos copiarlo manualmente en el contenedor
- Cuando ejecutemos el contenedor desde la imagen, usa node para ejecutar el archivo index.js.

Las instrucciones anteriores se traducirán en un Dockerfile básico. La mejor ubicación para colocar este archivo suele ser la raíz del proyecto.

El archivo <i>Dockerfile</i> resultante se ve así:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

La instrucción FROM le dirá a Docker que la base de la imagen debe ser node:20. La instrucción COPY copiará el archivo <i>index.js</i> de la máquina host al archivo con el mismo nombre en la imagen. La instrucción CMD dice lo que sucede cuando se usa _docker run_. CMD es el comando predeterminado que luego se puede sobrescribir con el argumento dado después del nombre de la imagen. Consulta _docker run --help_ si lo has olvidado.

La instrucción WORKDIR se introdujo para garantizar que no interfiramos con el contenido de la imagen. Garantizará que todos los siguientes comandos tendrán <i>/usr/src/app</i> configurado como el directorio de trabajo. Si el directorio no existe en la imagen base, se creará automáticamente.

Si no especificamos un WORKDIR, corremos el riesgo de sobrescribir archivos importantes por accidente. Si verificas la raíz (_/_) de la imagen node:20 con _docker run node:20 ls_, puedes notar todos los directorios y archivos que ya están incluidos en la imagen.

Ahora podemos usar el comando _docker build_ para construir una imagen basada en el Dockerfile. Vamos a modificar el comando con una bandera adicional: _-t_, esto nos ayudará a nombrar la imagen:

```bash
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

Entonces, el resultado es "Docker, por favor construye con la etiqueta (puedes pensar que la etiqueta es el nombre de la imagen resultante.) <i>fs-hello-world</i> el Dockerfile en este directorio". Puedes apuntar a cualquier Dockerfile, pero en nuestro caso, un simple punto significará el Dockerfile en <i>este</i> directorio. Es por eso que el comando termina con un punto. Una vez finalizado el build, puedes ejecutarlo con _docker run fs-hello-world_.

```bash
$ docker run fs-hello-world
Hello, World
```

Como las imágenes son solo archivos, se pueden mover, descargar y eliminar. Puedes enumerar las imágenes que tienes localmente con _docker image ls_, eliminarlas con _docker image rm_. Ve qué otro comando tienes disponible con _docker image --help_.

Una cosa más: antes se mencionó que el comando predeterminado, definido por CMD en el Dockerfile, puede ser sobre-escrito si fuera necesario. Podríamos, por ejemplo, abrir una sesión de bash en el contenedor y observar su contenido:

```bash
$ docker run -it fs-hello-world bash
root@2932e32dbc09:/usr/src/app# ls
index.js
root@2932e32dbc09:/usr/src/app#
```

### Imagen más significativa

Mover un servidor Express a un contenedor debería ser tan simple como mover la aplicación "¡Hola, mundo!" dentro de un contenedor. La única diferencia es que hay más archivos. Afortunadamente, la instrucción _COPY_ puede manejar todo eso. Eliminemos index.js y creemos un nuevo servidor Express. Usemos [express-generator](https://expressjs.com/en/starter/generator.html) para crear el esqueleto básico de una aplicación Express.

```bash
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

Primero, ejecutemos la aplicación para tener una idea de lo que acabamos de crear. Ten en cuenta que el comando para ejecutar la aplicación puede ser diferente al tuyo, mi directorio se llama playground.

```bash
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

Genial, ahora podemos navegar a [http://localhost:3000](http://localhost:3000) y la aplicación se está ejecutando allí.

Poner la aplicación en un contenedor debería ser relativamente fácil según el ejemplo anterior.

- Usar node como base
- Establecer el directorio de trabajo para que no interfiramos con el contenido de la imagen base
- Copia TODOS los archivos en este directorio a la imagen
- Ejecútala con DEBUG=playground:* npm start

Coloquemos el siguiente Dockerfile en la raíz del proyecto:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

Construiremos la imagen desde Dockerfile y luego la ejecutaremos: 

```bash
docker build -t express-server .
docker run -p 3123:3000 express-server 
```

La bandera _-p_ informará a Docker de que se debe abrir un puerto de la máquina host y dirigirlo a un puerto en el contenedor. El formato es _-p host-port:application-port_.

¡La aplicación ya se está ejecutando! Probémoslo enviando una solicitud GET a [http://localhost:3123/](http://localhost:3123/).

> Si el tuyo no funciona, pasa a la siguiente sección. Hay una explicación de por qué puede que no funcione incluso si has seguido los pasos correctamente.

Cerrarlo es un dolor de cabeza en este momento. Usa otro terminal y el comando _docker kill_ para cerrar la aplicación. El _docker kill_ enviará una señal de eliminación (SIGKILL) a la aplicación para obligarla a cerrarse. Necesitas el nombre o id del contenedor como argumento.

Por cierto, cuando se usa id como argumento, el comienzo de la ID es suficiente para que Docker sepa a qué contenedor nos referimos.

```bash
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

En el futuro, usemos el mismo puerto en ambos lados de _-p_. Solo para que no tengamos que recordar cuál elegimos.

#### Solucionar problemas potenciales que creamos al copiar y pegar

Hay algunos cambios que debemos realizar para crear un Dockerfile más completo. Incluso puede ser que el ejemplo anterior no funcione en todos los casos porque nos saltamos un paso importante.

Cuando ejecutamos npm install en nuestra máquina, en algunos casos el **administrador de paquetes de node (npm)** puede instalar dependencias específicas del sistema operativo durante el paso de instalación. Es posible que accidentalmente movamos partes no funcionales a la imagen con la instrucción COPY. Esto puede suceder fácilmente si copiamos el directorio <i>node_modules</i> en la imagen.

Esto es algo crítico a tener en cuenta cuando construimos nuestras imágenes. Es mejor hacer la mayoría de las cosas, como ejecutar _npm install_ durante el proceso de compilación <i>dentro del contenedor</i> en lugar de hacerlo antes de compilar. La regla general es copiar solo los archivos que enviarías a GitHub. Los artefactos o las dependencias de compilación no se deben copiar, ya que se pueden instalar durante el proceso de compilación.

Podemos usar <i>.dockerignore</i> para resolver el problema. El archivo .dockerignore es muy similar a .gitignore, puedes usarlo para evitar que se copien archivos no deseados en tu imagen. El archivo debe colocarse junto al Dockerfile. Aquí hay un posible contenido de un <i>.dockerignore</i>

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

Sin embargo, en nuestro caso, .dockerignore no es lo único que se requiere. Tendremos que instalar las dependencias durante el paso de compilación. El _Dockerfile_ cambia a:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install # highlight-line

CMD DEBUG=playground:* npm start
```

La instalación de npm puede ser riesgosa. En lugar de usar npm install, npm ofrece una herramienta mucho mejor para instalar dependencias, el comando _ci_.

Diferencias entre ci e install:

- install puede actualizar el package-lock.json
- install puede instalar una versión diferente de una dependencia si tiene ^ o ~ en la versión de la dependencia.

- ci eliminará la carpeta node_modules antes de instalar cualquier cosa
- ci seguirá el package-lock.json y no alterará ningún archivo

En resumen: _ci_ crea compilaciones confiables, mientras que _install_ es el que se usa cuando deseas instalar nuevas dependencias.

Como no estamos instalando nada nuevo durante el paso de compilación y no queremos que las versiones cambien repentinamente, usaremos _ci_:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci # highlight-line

CMD DEBUG=playground:* npm start
```

Aún mejor, podemos usar _npm ci --omit=dev_ para no perder tiempo instalando dependencias de desarrollo.

> Como habrás notado en la lista de comparación; npm ci eliminará la carpeta node_modules, por lo que no importó crear el .dockerignore. Sin embargo, .dockerignore es una herramienta increíble cuando deseas optimizar tu proceso de compilación. Hablaremos brevemente sobre estas optimizaciones más adelante.

Ahora el Dockerfile debería funcionar de nuevo, pruébalo con _docker build -t express-server . && docker run -p 3123:3000 express-server_

> Ten en cuenta que estamos aquí encadenando dos comandos bash con &&. Podríamos obtener (casi) el mismo efecto ejecutando ambos comandos por separado. Al encadenar comandos con &&, si un comando falla, los siguientes de la cadena no se ejecutarán.

Configuramos una variable de entorno _DEBUG=playground:*_ durante CMD para el inicio de npm. Sin embargo, con Dockerfiles también podríamos usar la instrucción ENV para establecer variables de entorno. Vamos a hacer eso:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

#highlight-start
ENV DEBUG=playground:*
#highlight-end

#highlight-start
CMD npm start
#highlight-end
```

> <i>Si te preguntas qué hace la variable de entorno DEBUG, lee [Debugging Express](https://expressjs.com/en/guide/debugging.html).</i>

#### Mejores prácticas de Dockerfile

Hay 2 reglas generales que debes seguir al crear imágenes:

- Intenta crear una imagen lo más **segura** posible
- Intenta crear una imagen lo más **pequeña** posible

Las imágenes más pequeñas son más seguras al tener menos área de superficie de ataque, y también se mueven más rápido en las pipelines de despliegue.

Snyk tiene una excelente lista de las [10 mejores prácticas para la creación de contenedores de node/express](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

Un gran descuido que debemos resolver es ejecutar la aplicación como root en lugar de usar un usuario con menos privilegios. Hagamos un ultimo arreglo al Dockerfile:

```Dockerfile
FROM node:20
  
WORKDIR /usr/src/app

#highlight-start
COPY --chown=node:node . .
#highlight-end

RUN npm ci 

ENV DEBUG=playground:*
  
#highlight-start
USER node
#highlight-end

CMD npm start
```

</div>
  
<div class="tasks">

### Ejercicio 12.5.

#### Ejercicio 12.5: Contenedorización de una aplicación de Node.js

El repositorio que clonaste o copiaste en el [primer ejercicio](/es/part12/introduccion_a_los_contenedores#ejercicio-12-1) contiene una aplicación de tareas (todo-app). Échale un vistazo a todo-app/todo-backend y lee el README. Todavía no tocaremos todo-frontend.

- Paso 1. Pon a todo-backend en un contenedor creando un <i>todo-app/todo-backend/Dockerfile</i> y construyendo una imagen.

- Paso 2. Ejecuta la imagen de todo-backend con los puertos correctos abiertos. Asegúrate de que el contador de visitas aumente cuando se usa a través de un navegador en http://localhost:3000/ (o algún otro puerto si lo configuras)

Sugerencia: Ejecuta la aplicación fuera de un contenedor para examinarla antes de comenzar.

</div>
  
<div class="content">

### Utilizando docker-compose

En la sección anterior, creamos un servidor Express, sabiendo que se ejecutaría en el puerto 3123, y utilizamos los comandos _docker build -t express-server . && docker run -p 3123:3000 express-server_ para ejecutarlo. Esto ya parece algo que necesitarías poner en un script para recordarlo. Afortunadamente, Docker nos ofrece una mejor solución.

[Docker-compose](https://docs.docker.com/compose/) es otra herramienta fantástica que puede ayudarnos a administrar contenedores. Comencemos a usar docker-compose a medida que aprendamos más sobre los contenedores, ya que nos ayudará a ahorrar algo de tiempo con la configuración.

Y ahora podemos convertir el hechizo anterior en un archivo yaml. ¡La mejor parte de los archivos yaml es que puedes guardarlos en un repositorio de Git!

Crea el archivo **docker-compose.yml** y colócalo en la raíz del proyecto, junto al Dockerfile. Esta vez utilizaremos el mismo puerto para host y contenedor. El contenido del archivo es:

```yaml
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

El significado de cada línea se explica como un comentario. Si deseas ver la especificación completa, consulta la [documentación](https://docs.docker.com/compose/compose-file/).

Ahora podemos usar _docker compose up_ para compilar y ejecutar la aplicación. Si queremos reconstruir las imágenes podemos usar _docker compose up --build_.

También puedes ejecutar la aplicación en segundo plano con _docker compose up -d_ (_-d_ para separado) y cerrarla con _docker compose down_.

> <i>Ten en cuenta que algunas versiones antiguas de Docker (especialmente en Windows) no soportan el comando _docker compose_. Una forma de evitar este problema es [instalando](https://docs.docker.com/compose/install/) el comando _docker-compose_ que funciona casi siempre igual que _docker compose_. Sin embargo, la solución preferible es actualizar Docker a su versión más reciente.</i>

Crear archivos como _docker-compose.yml_ que <i>declaran</i> lo que deseas en lugar de archivos de script que necesitas ejecutar en un orden específico / un número específico de veces es a menudo una buena práctica.

</div>

<div class="tasks">

### Ejercicio 12.6.

#### Ejercicio 12.6: Docker compose

Crea un archivo <i>todo-app/todo-backend/docker-compose.yml</i> que funcione con la aplicación de node del ejercicio anterior.

El contador de visitas es la única funcionalidad que se requiere que funcione.

</div>

<div class="content">

### Uso de contenedores en desarrollo

Cuando estás desarrollando software, la contenedorización se puede utilizar de varias maneras para mejorar tu calidad de vida. Uno de los casos más útiles es evitar la necesidad de instalar y configurar las herramientas dos veces.

Puede que no sea la mejor opción mover todo tu entorno de desarrollo a un contenedor, pero si eso es lo que deseas, es posible. Retomaremos esta idea al final de esta parte. Pero hasta entonces, <i>ejecuta la propia aplicación de Node fuera de los contenedores</i>.

La aplicación que conocimos en los ejercicios anteriores utiliza MongoDB. Exploremos [Docker Hub](https://hub.docker.com/) para encontrar una imagen de MongoDB. Docker Hub es el lugar predeterminado desde donde Docker extrae las imágenes, también puedes usar otros registros, pero dado que ya estamos metidos hasta las rodillas en Docker, es una buena opción. Con una búsqueda rápida, podemos encontrar [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

Crea un nuevo yaml llamado <i>todo-app/todo-backend/docker-compose.dev.yml</i> que se parece a lo siguiente:

```yml
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

El significado de las dos primeras variables de entorno definidas anteriormente se explica en la página de Docker Hub:

> <i>Estas variables, usadas en conjunto, crean un nuevo usuario y establecen la contraseña de ese usuario. Este usuario se crea en la base de datos de autenticación del administrador y se le otorga el rol de root ("superusuario").</i>

La última variable de entorno *MONGO\_INITDB\_DATABASE* le indicará a MongoDB que cree una base de datos con ese nombre.

Puedes usar la bandera _-f_ para especificar un <i>archivo</i> que se ejecute con el comando Docker Compose, por ejemplo:

```bash
docker compose -f docker-compose.dev.yml up
```

Ahora que podríamos tener multiples archivos de compose, es útil.

A continuación, inicia MongoDB con _docker compose -f docker-compose.dev.yml up -d_. Con _-d_ se ejecutará en segundo plano. Puedes ver los registros del output con _docker compose -f docker-compose.dev.yml logs -f_. Allí, _-f_ se asegurará de que <i>seguimos</i> los registros.

Como se dijo anteriormente, actualmente <strong>no</strong> queremos ejecutar la aplicación Node dentro de un contenedor. Desarrollar mientras la aplicación está dentro de un contenedor es un desafío. Exploraremos esa opción más adelante en esta parte.

Ejecuta el buen y viejo _npm install_ primero en tu máquina para configurar la aplicación Node. Luego inicia la aplicación con la variable de entorno relevante. Puedes modificar el código para configurarlas como predeterminadas o usar el archivo .env. No pasa nada por poner estas claves en GitHub, ya que solo se usan en tu entorno de desarrollo local. Las agregaré con _npm run dev_ para ayudarte a copiar y pegar.

```bash
MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

Esto no será suficiente; necesitamos crear un usuario para ser autorizado dentro del contenedor. La url http://localhost:3000/todos genera un error de autenticación:

```bash
[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272
          callback(new MongoError(document));
                   ^
MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272:20)
```

### Vincular e inicializar la base de datos

En la página [MongoDB Docker Hub](https://hub.docker.com/_/mongo) en la sección "Inicializar una nueva instancia" se encuentra la información sobre cómo ejecutar JavaScript para inicializar la base de datos y un usuario para ella.

El proyecto de ejercicio tiene un archivo <i>todo-app/todo-backend/mongo/mongo-init.js</i> con el contenido:

```js
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

Este archivo inicializará la base de datos con un usuario y algunas tareas. A continuación, debemos colocarlo dentro del contenedor al inicio.

Podríamos crear una nueva imagen DESDE mongo y COPIAR el archivo, o podemos usar un <i>bind mount</i> para montar el archivo <i>mongo-init.js</i> en el contenedor. Hagamos esto último.

Bind mount es el acto de vincular un archivo (o directorio) en la máquina host a un archivo (o directorio) en el contenedor. Podríamos agregar una bandera _-v_ con _container run_. La sintaxis es _-v ARCHIVO-EN-HOST:ARCHIVO-EN-CONTENEDOR_. Como ya aprendimos sobre Docker Compose, omitámoslo. El bind mount se declara bajo la clave <i>volumes</i> en _docker-compose.dev.yml_. De lo contrario, el formato es el mismo, primero host y luego contenedor:

```yml
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
      # highlight-start
    volumes: 
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      # highlight-end
```

El resultado del vínculo es que el archivo <i>mongo-init.js</i> en la carpeta mongo de la máquina host es el mismo que el archivo <i>mongo-init.js</i> en el directorio /docker-entrypoint-initdb.d del contenedor. Los cambios en cualquiera de los archivos estarán disponibles en el otro. No necesitamos hacer ningún cambio durante el tiempo de ejecución. Pero esta será la clave para el desarrollo de software en contenedores.

Ejecuta _docker compose -f docker-compose.dev.yml down --volumes_ para asegurarte de que no quede nada y comienza desde cero con _docker compose -f docker-compose.dev.yml up_ para inicializar la base de datos.

Si ves un error como este:

```bash
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

es posible que tengas un problema de permiso de lectura. No son raros cuando se trata de volúmenes. En el caso anterior, puedes usar _chmod a+r mongo-init.js_, que les dará a todos acceso de lectura a ese archivo. Ten cuidado al usar _chmod_ ya que otorgar más privilegios puede ser un problema de seguridad. Usa _chmod_ solo en mongo-init.js en tu computadora.

Ahora, iniciar la aplicación Express con la variable de entorno correcta debería funcionar:

```bash
MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Verifiquemos que http://localhost:3000/todos devuelve las tareas. Debería devolver las dos tareas que inicializamos. Podemos y <i>debemos</i> usar Postman para probar la funcionalidad básica de la aplicación, como agregar o eliminar una tarea.

### ¿Aún con problemas?

Por algún motivo, para muchos, la inicialización de Mongo ha causado problemas.

Si la aplicación no funciona y aún tienes el siguiente error:

```bash
/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272
          callback(new MongoError(document));
                   ^
MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272:20)
```

ejecuta estos comandos:

```bash
docker compose -f docker-compose.dev.yml down --volumes
docker image rm mongo
```

Luego, intenta iniciar Mongo otra vez.

Si el problema persiste, dejemos de lado la idea de usar un volumen y copiemos el script de inicialización a una imagen personalizada. Crea el siguiente <i>Dockerfile</i> al directorio <i>todo-app/todo-backend/mongo</i>

```Dockerfile
FROM mongo

COPY ./mongo-init.js /docker-entrypoint-initdb.d/
```

Agrégalo a una imagen con el comando:

```bash
docker build -t initialized-mongo .
```

Ahora cambia al archivo <i>docker-compose.dev.yml</i> para que utilize la nueva imagen:

```yml
  mongo:
    image: initialized-mongo  # highlight-line
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

Ahora la aplicación debería funcionar.

### Persistiendo datos con volúmenes

Por defecto, los contenedores no conservarán nuestros datos. Cuando cierres el contenedor de la base datos, <i>es posible</i> que no puedas recuperar los datos.

> Mongo, de hecho, es un caso raro en el que el contenedor conserva los datos. Esto sucede, ya que los desarrolladores que crearon la imagen de Docker para Mongo han definido un volumen para usar. [Esta línea](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) en el Dockerfile indicará a Docker que conserve los datos en un volumen.

Hay dos métodos distintos para almacenar los datos:
- Declarar una ubicación en tu sistema de archivos (llamado [bind mount](https://docs.docker.com/storage/bind-mounts/) (montaje de enlace))
- Dejar que Docker decida dónde almacenar los datos ([volumen](https://docs.docker.com/storage/volumes/))

La primera opción es preferible en la mayoría de los casos siempre que uno <i>realmente</i> necesite evitar eliminar los datos.

Veamos ambos en acción con docker-compose. Comencemos con <i>bind mount</i>:

```yml
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db # highlight-line
```

Esto creará un directorio llamado *mongo\_data* en tu sistema de archivos local y lo asignará al contenedor como _/data/db_. Esto significa que los datos en _/data/db_ se almacenan fuera del contenedor, ¡pero el contenedor aún puede acceder a ellos! Solo recuerda agregar el directorio a .gitignore.

Se puede lograr un resultado similar con un volumen con nombre:

```yml
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db

volumes:  # highlight-line
  mongo_data:  # highlight-line
```

Ahora, el volumen es creado y controlado por Docker. Después de iniciar la aplicación (_docker compose -f docker-compose.dev.yml up_) puedes enumerar los volúmenes con _docker volume ls_, inspeccionar uno de ellos con _docker volume inspect_ e incluso eliminarlos con _docker volume rm_:

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     todo-backend_mongo_data
$ docker volume inspect todo-backend_mongo_data
[
    {
        "CreatedAt": "2024-19-03T12:52:11Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "todo-backend",
            "com.docker.compose.version": "1.29.2",
            "com.docker.compose.volume": "mongo_data"
        },
        "Mountpoint": "/var/lib/docker/volumes/todo-backend_mongo_data/_data",
        "Name": "todo-backend_mongo_data",
        "Options": null,
        "Scope": "local"
    }
]
```

El volumen con nombre aún está almacenado en tu sistema de archivos local, pero descubrir <i>dónde</i> puede no ser tan trivial como con la opción anterior.

</div>

<div class="tasks">

### Ejercicio 12.7.

#### Ejercicio 12.7: Escribiendo un poco de código de MongoDB

Ten en cuenta que este ejercicio asume que has realizado todas las configuraciones realizadas en el material después del ejercicio 12.5. Aún debes ejecutar el backend de la aplicación de tareas <i>fuera de un contenedor</i>, solo MongoDB está en un contenedor por ahora.

La aplicación de tareas no tiene una implementación adecuada de las rutas para obtener una tarea pendiente (GET <i>/todos/:id</i>) y actualizar una tarea pendiente (PUT <i>/todos/:id</i>). Arregla el código.

</div>

<div class="content">

### Depurando problemas en contenedores

> <i>Cuando codificas, lo más probable es que termines en una situación en la que todo está roto.</i>

> \- Matti Luukkainen

Al desarrollar con contenedores, necesitamos aprender nuevas herramientas para la depuración, ya que no podemos simplemente usar "console.log" para todo. Cuando el código tiene un error, a menudo puede estar en un estado en el que al menos algo funciona y podemos avanzar a partir de ahí. La configuración suele estar en cualquiera de los dos estados: 1. funcionando o 2. rota. Repasaremos algunas herramientas que pueden ayudar cuando tu aplicación se encuentra en este último estado.

Al desarrollar software, puedes avanzar paso a paso con seguridad, verificando todo el tiempo que lo que has codificado se comporta como se espera. A menudo, este no es el caso cuando se realizan configuraciones. La configuración que puedes estar escribiendo puede romperse hasta en el momento en que finaliza. Entonces, cuando escribes un docker-compose.yml o Dockerfile largo y no funciona, debes tomarte un momento y pensar en las diversas formas en que podrías confirmar que algo funciona.

<i>Cuestionar todo</i> sigue siendo aplicable aquí. Como se dijo en la [parte 3](/es/part3/guardando_datos_en_mongo_db): La clave es ser sistemático. Dado que el problema puede existir en cualquier lugar, <i>debes cuestionar todo</i> y eliminar todas las posibles fuentes de error una por una.

Para mí, el método más valioso de depuración es detenerme y pensar en lo que estoy tratando de lograr en lugar de simplemente golpearme la cabeza con el problema. A menudo hay una solución simple, alternativa, o una búsqueda rápida en Google que me ayudará a seguir adelante.

#### exec

El comando de Docker [exec](https://docs.docker.com/engine/reference/commandline/exec/) es un gran bateador. Se puede usar para saltar directamente a un contenedor cuando se está ejecutando.

Iniciemos un servidor web en segundo plano y hagamos un poco de depuración para que funcione y muestre el mensaje "¡Hola, exec!" en nuestro navegador. Elijamos [Nginx](https://www.nginx.com/) que es, entre otras cosas, un servidor capaz de servir archivos HTML estáticos. Tiene un index.html predeterminado que podemos reemplazar.

```bash
$ docker container run -d nginx
```

Bien, ahora las preguntas son:

- ¿Dónde debemos ir con nuestro navegador?
- ¿Está incluso funcionando?

Sabemos cómo responder a lo último: enumerando los contenedores en ejecución.

```bash
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

¡Sí! También hemos respondido a la primera pregunta. Parece escuchar en el puerto 80, como se ve en la salida anterior.

Apaguémoslo y reiniciemos con el indicador _-p_ para que nuestro navegador acceda a él.

```bash
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

> <i>**Nota del editor:** al desarrollar, es **esencial** seguir constantemente los logs del contenedor. Normalmente no ejecuto contenedores en modo detached (es decir, con -d) ya que requiere un poco de esfuerzo adicional abrir los logs.
> 
> Cuando estoy 100% seguro de que todo funciona... no, cuando estoy 200% seguro, entonces puedo relajarme un poco e iniciar los contenedores en modo detached. Hasta que todo vuelva a desmoronarse y sea hora de abrir los logs nuevamente.</i>

Miremos a la aplicación en http://localhost:8080. ¡Parece que muestra un mensaje incorrecto! Saltemos directamente al contenedor y arreglémoslo. Mantén tu navegador abierto, no necesitaremos cerrar el contenedor para esta corrección. Ejecutaremos bash dentro del contenedor, las banderas _-it_ asegurarán que podamos interactuar con el contenedor:

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
7edcb36aff08   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

Ahora que estamos dentro, necesitamos encontrar el archivo defectuoso y reemplazarlo. Rapidamente Google nos dice que el archivo en sí es _/usr/share/nginx/html/index.html_.

Pasemos al directorio y eliminemos el archivo.

```bash
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

Ahora, si vamos a http://localhost:8080/ sabemos que eliminamos el archivo correcto. La página muestra 404. Vamos a reemplazarlo con uno que contenga el contenido correcto:

```bash
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

¡Actualiza la página y se mostrará nuestro mensaje! Ahora sabemos cómo se puede usar exec para interactuar con los contenedores. Recuerda que todos los cambios se pierden cuando se elimina el contenedor. Para conservar los cambios, debes usar _commit_ tal como lo hicimos en la [sección anterior](/es/part12/introduccion_a_los_contenedores#otros-comandos-de-docker).

</div>

<div class="tasks">

### Ejercicio 12.8.

#### Ejercicio 12.8: Interfaz de linea de comandos (CLI) de Mongo

> Usa _script_ para registrar lo que haces, guarda el archivo en script-answers/exercise12_8.txt

Mientras se ejecuta MongoDB del ejercicio anterior, accede a la base de datos con la interfaz de línea de comandos (CLI) de mongo. Puedes hacerlo usando docker exec. A continuación, agrega una tarea nueva mediante la CLI.

El comando para abrir CLI cuando estás dentro del contenedor es _mongosh_

La CLI de mongo requerirá las banderas de nombre de usuario y contraseña para autenticarse correctamente. Las banderas _-u root -p example_ deberían funcionar, los valores corresponden a los que se encuentran en el archivo _docker-compose.dev.yml_.

* Paso 1: Ejecuta MongoDB
* Paso 2: Utiliza <i>docker exec</i> para ingresar al contenedor
* Paso 3: Abre Mongo CLI

Cuando te hayas conectado a Mongo CLI, puedes pedirle que muestre las DBs dentro:

```bash
> show dbs
admin         0.000GB
config         0.000GB
local         0.000GB
the_database  0.000GB
```

Para acceder a la base de datos correcta:

```bash
> use the_database
```

Y finalmente para conocer las colecciones:

```bash
> show collections
todos
```

Ahora podemos acceder a los datos en esas colecciones:

```bash
> db.todos.find({})
[
  {
    _id: ObjectId("633c270ba211aa5f7931f078"),
    text: 'Write code',
    done: false
  },
  {
    _id: ObjectId("633c270ba211aa5f7931f079"),
    text: 'Learn about containers',
    done: false
  }
]
```

Inserta una tarea pendiente nueva con el texto: "Increase the number of tools in my tool belt" con el estado done como false. Consulta la [documentación](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/) para ver cómo se realiza la adición.

Asegúrate de ver la nueva tarea tanto en la aplicación Express como al consultar desde la CLI de Mongo.

</div>

<div class="content">

### Redis

[Redis](https://redis.io/) es una base de datos [clave-valor](https://redis.com/nosql/key-value-databases/). En contraste con por ej. MongoDB, los datos almacenados en un almacén de clave-valor tienen un poco menos de estructura, por ejemplo, no contienen colecciones ni tablas, solo contienen pedazos de datos que se pueden obtener en función de la <i>clave</i> que se adjuntó a los datos (el <i>valor</i>).

De forma predeterminada, Redis funciona <i>en memoria</i>, lo que significa que no almacena datos de forma persistente.

Un caso de uso excelente para Redis es usarlo como <i>caché</i>. Los cachés a menudo se usan para almacenar datos que, de otro modo, serían lentos para obtener y guardar hasta que ya no sean válidos. Después de que la memoria caché se vuelva inválida, obtendrás los datos nuevamente y los almacenarás en la memoria caché.

Redis no tiene nada que ver con los contenedores. Pero dado que ya podemos agregar <i>cualquier</i> servicio de terceros a tus aplicaciones, ¿por qué no conocer uno nuevo?

</div>

<div class="tasks">

### Ejercicios 12.9. - 12.11.

#### Ejercicio 12.9: Instalando Redis en el proyecto

El servidor Express ya se configuró para usar Redis y solo falta la variable de entorno *REDIS_URL*. La aplicación utilizará esa variable de entorno para conectarse a Redis. Lee la [página de Docker Hub para Redis](https://hub.docker.com/_/redis), agrega Redis a <i>todo-app/todo-backend/docker-compose.dev.yml</ i> definiendo otro servicio después de mongo:

```yml
services:
  mongo:
    ...
  redis:
    ???
```

Dado que la página de Docker Hub no tiene toda la información, podemos usar Google para ayudarnos. El puerto predeterminado para Redis se encuentra fácilmente al buscarlo:

![resultado de busqueda de google para "default port for redis" es 6379](../../images/12/redis_port_by_google.png)

No sabremos si la configuración funciona a menos que la probemos. La aplicación no comenzará a usar Redis por sí sola, eso sucederá en el próximo ejercicio.

Una vez que Redis esté configurado e iniciado, reinicia el backend y asígnale el <i>REDIS\_URL</i>, que tiene la forma <i>redis://host:port</i>

```bash
REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Ahora puedes probar la configuración agregando la línea

```js
const redis = require('../redis')
```

al servidor Express, por ejemplo, en el archivo <i>routes/index.js</i>. Si no pasa nada, la configuración se hizo correctamente. Si no, el servidor falla:

```bash
events.js:291
      throw er; // Unhandled 'error' event
      ^

Error: Redis connection to localhost:637 failed - connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
Emitted 'error' event on RedisClient instance at:
    at RedisClient.on_error (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:342:14)
    at Socket.<anonymous> (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:223:14)
    at Socket.emit (events.js:314:20)
    at emitErrorNT (internal/streams/destroy.js:100:8)
    at emitErrorCloseNT (internal/streams/destroy.js:68:3)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  errno: -61,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 6379
}
[nodemon] app crashed - waiting for file changes before starting...
```

#### Ejercicio 12.10:

El proyecto ya tiene [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) instalado y dos funciones "promisificadas": getAsync y setAsync.

- La función setAsync toma la clave y el valor, usando la clave para almacenar el valor.

- La función getAsync toma la clave y devuelve el valor en una promesa.

Implementa un contador de tareas pendientes que guarde la cantidad de tareas pendientes creadas en Redis:

- Paso 1: Cada vez que se envíe una solicitud para agregar una tarea pendiente, incrementa el contador en uno.
- Paso 2: Crea un endpoint GET/statistics donde puedas solicitar los metadatos de uso. El formato debe ser el siguiente JSON:

```json
{
  "added_todos": 0
}
```

#### Ejercicio 12.11:

> Utiliza _script_ para registrar lo que haces, guarda el archivo como script-answers/exercise12_11.txt

Si la aplicación no se comporta como se esperaba, un acceso directo a la base de datos puede ser beneficioso para identificar problemas. Probemos cómo se puede usar [redis-cli](https://redis.io/topics/rediscli) para acceder a la base de datos.

- Ve al contenedor de redis con _docker exec_ y abre redis-cli.
- Encuentra la clave que usaste con _[KEYS *](https://redis.io/commands/keys)_
- Verifica el valor de la clave con el comando [GET](https://redis.io/commands/get)
- Establece el valor del contador en 9001, encuentra el comando correcto [aquí](https://redis.io/commands/)
- Asegúrate de que el nuevo valor funcione actualizando la página http://localhost:3000/statistics
- Crea una nueva tarea con Postman y asegúrate de que el contador haya aumentado en consecuencia desde redis-cli
- Elimina la clave de cli y asegúrate de que el contador funcione cuando se agreguen nuevas tareas

</div>

<div class="content">

### Persistiendo datos con Redis

En la sección anterior, se mencionó que <i>por defecto</i> Redis no conserva los datos. Sin embargo, la persistencia es fácil de activar. Solo necesitamos iniciar Redis con un comando diferente, como se indica en la [página de Docker hub](https://hub.docker.com/_/redis):

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

Los datos ahora se almacenarán en el directorio <i>redis_data</i> de la máquina host.
¡Recuerda agregar el directorio a .gitignore!

#### Otras funcionalidades de Redis

Además de las operaciones GET, SET y DEL en claves y valores, Redis también puede hacer mucho más. Por ejemplo, puede hacer que las claves caduquen automáticamente, lo que es una característica muy útil cuando Redis se usa como caché.

Redis también se puede utilizar para implementar el patrón denominado [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) (o PubSub), que es un mecanismo de comunicación asíncrona para aplicaciones distribuidas. En este escenario, Redis funciona como un <i>agente de mensajes</i> entre dos o más aplicaciones. Algunas de las aplicaciones están <i>publicando</i> mensajes enviándolos a Redis, que al recibir un mensaje, informa a las partes que se han <i>suscrito</i> a esos mensajes.

</div>

<div class="tasks">

### Ejercicio 12.12.
  
#### Ejercicio 12.12: Persistiendo datos en Redis

Comprueba que los datos no se conservan de forma predeterminada, después de ejecutar:

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up
```
 
 el valor del contador se restablece a 0.

Luego, crea un volumen para los datos de Redis (modificando <i>todo-app/todo-backend/docker-compose.dev.yml</i>) y asegúrate de que los datos sobrevivan después de ejecutar:

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up
```

</div>
