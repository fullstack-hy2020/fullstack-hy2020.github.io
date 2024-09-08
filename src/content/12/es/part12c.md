---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: es
---

<div class="tasks">

Esta parte fue actualizada el 21 de Marzo de 2024: Create react app reemplazado con Vite en el frontend de todo.

Si comenzaste esta parte antes de la actualización, puedes ver el viejo material [aquí](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/tree/4015af9dddb61cb01f013456d8728e8f553be347/src/content/12). Hay algunos cambios en las configuraciones del frontend.
</div>

<div class="content">

Ahora tenemos una comprensión básica de Docker y podemos utilizarlo para fácilmente configurar, por ejemplo, una base de datos para nuestra aplicación. Ahora, cambiemos nuestro enfoque hacia el frontend.

### React en un contenedor

A continuación, vamos a crear y a poner en un contenedor a una aplicación React. Comenzamos con los pasos habituales:

```bash
$ npm create vite@latest hello-front -- --template react
$ cd hello-front
$ npm install
```

El siguiente paso es convertir el código JavaScript y CSS en archivos estáticos listos para producción, Vite ya tiene un _build_ como un script npm, así que usemos eso:

```bash
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

¡Excelente! El paso final es encontrar una forma de usar un servidor para servir los archivos estáticos. Como sabrás, podríamos usar nuestro [express.static](https://expressjs.com/en/starter/static-files.html) con el servidor Express para servir los archivos estáticos. Te lo dejo como ejercicio para que lo hagas en casa. En su lugar, seguiremos adelante y comenzaremos a escribir nuestro Dockerfile:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

Eso parece correcto. Hagamos el build y veamos si estamos en el camino correcto. Nuestro objetivo es que la compilación tenga éxito sin errores. Luego usaremos bash para verificar dentro del contenedor para ver si los archivos están allí.

```bash
$ docker build . -t hello-front
 => [4/5] RUN npm ci                  
 => [5/5] RUN npm run 
 ...             
 => => naming to docker.io/library/hello-front

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
  Dockerfile  README.md  dist  index.html  node_modules  package-lock.json  package.json	public	src  vite.config.js

root@98fa9483ee85:/usr/src/app# ls dist
  assets	index.html  vite.svg
```

Una opción válida para servir archivos estáticos ahora que ya tenemos Node en el contenedor es [serve](https://www.npmjs.com/package/serve). Intentemos instalar serve y servir los archivos estáticos mientras estamos dentro del contenedor.

```bash
root@98fa9483ee85:/usr/src/app# npm install -g serve

  added 89 packages in 2s

root@98fa9483ee85:/usr/src/app# serve dist

   ┌────────────────────────────────────────┐
   │                                        │
   │   Serving!                             │
   │                                        │
   │   - Local:    http://localhost:3000    │
   │   - Network:  http://172.17.0.2:3000   │
   │                                        │
   └────────────────────────────────────────┘

```

¡Excelente! Hagamos ctrl+c para salir y luego los agregaremos a nuestro Dockerfile.

La instalación de serve se convierte en un RUN en el Dockerfile. De esta manera, la dependencia se instala durante el proceso de compilación. El comando para servir el directorio <i>dist</i> se convertirá en el comando para iniciar el contenedor:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

#highlight-start
RUN npm install -g serve
#highlight-end

#highlight-start
CMD ["serve", "dist"]
#highlight-end
```

Nuestro CMD ahora incluye corchetes y, como resultado, usamos la <i> forma exec</i> de CMD. En realidad, hay **tres** formas diferentes para CMD, de las cuales se prefiere la forma exec. Lee la [documentación](https://docs.docker.com/reference/dockerfile/#cmd) para obtener más información.

Cuando ahora construimos la imagen con _docker build . -t hello-front_ y la ejecutamos con _docker run -p 5000:3000 hello-front_, la aplicación estará disponible en http://localhost:5000.

### Usando múltiples etapas

Si bien serve es una opción <i>válida</i>, podemos hacerlo mejor. Un buen objetivo es crear imágenes de Docker para que no contengan nada irrelevante. Con un número mínimo de dependencias, es menos probable que las imágenes se rompan o se vuelvan vulnerables con el tiempo.

Los [builds de varias etapas](https://docs.docker.com/build/building/multi-stage/) están diseñadas para dividir el proceso de compilación en muchas etapas separadas, donde es posible limitar qué partes de los archivos de imagen se mueven entre las etapas. Eso abre posibilidades para limitar el tamaño de la imagen, ya que no todos los subproductos del build son necesarios para la imagen resultante. Las imágenes más pequeñas son más rápidas de cargar y descargar y ayudan a reducir la cantidad de vulnerabilidades que puede tener tu software.

Con builds de varias etapas, se puede usar una solución probada y robusta como [Nginx](https://es.wikipedia.org/wiki/Nginx) para servir archivos estáticos sin muchos dolores de cabeza. La [página de Nginx](https://hub.docker.com/_/nginx) de Docker Hub nos brinda la información necesaria para abrir los puertos y "Alojamiento de contenido estático simple".

Usemos el Dockerfile anterior pero cambiemos FROM para incluir el nombre de la etapa:

```Dockerfile
# El primer FROM ahora es una etapa llamada build-stage
# highlight-start
FROM node:20 AS build-stage 
# highlight-end

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# Esta es una nueva etapa, todo lo anterior a esta linea ha desaparecido, excepto por los archivos que queremos COPIAR
# highlight-start
FROM nginx:1.25-alpine
# highlight-end

# COPIA el directorio dist de build-stage a /usr/share/nginx/html
# El destino fue encontrado en la pagina de Docker hub
# highlight-start
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# highlight-end
```

Hemos declarado también <i>otra etapa</i>, de donde solo se mueven los archivos relevantes de la primera etapa (el directorio <i>dist</i>, que contiene el contenido estático).

Después de que la construimos de nuevo, la imagen está lista para servir el contenido estático. El puerto predeterminado será 80 para Nginx, por lo que algo como _-p 8000:80_ funcionará, por lo que los parámetros del comando RUN deben cambiarse un poco.

Los builds de varias etapas también incluyen algunas optimizaciones internas que pueden afectar tus builds. Como ejemplo, los builds de varias etapas se saltan las etapas que no se utilizan. Si deseamos usar una etapa para reemplazar una parte de un pipeline de build, como pruebas o notificaciones, debemos pasar **algunos** datos a las siguientes etapas. En algunos casos esto está justificado: copia el código de la etapa de prueba a la etapa de build. Esto garantiza que estás haciendo el build con el código probado.

</div>

<div class="tasks">

### Ejercicios 12.13 - 12.14.

#### Ejercicio 12.13: Frontend de la aplicación de tareas

Finalmente, llegamos al frontend de la aplicación de tareas pendientes. Ve a todo-app/todo-frontend y lee el README.

Comienza ejecutando el frontend fuera del contenedor y asegúrate de que funciona con el backend.

Pon a la aplicación en un contenedor creando <i>todo-app/todo-frontend/Dockerfile</i> y utiliza a la instrucción [ENV](https://docs.docker.com/engine/reference/builder/#env) para pasar *VITE\_BACKEND\_URL* a la aplicación y ejecútala con el backend. El backend aún debería estar ejecutándose fuera de un contenedor.

**Ten en cuenta** que debes configurar *VITE\_BACKEND\_URL* antes de hacer el build del frontend, de lo contrario, no quedará definida en el código.

#### Ejercicio 12.14: Pruebas durante el proceso de build

Una posibilidad interesante que utilizar builds de varias etapas nos da, es usar una etapa de build separada para [pruebas](https://docs.docker.com/language/nodejs/run-tests/). Si la etapa de prueba falla, todo el proceso de build también fallará. Ten en cuenta que puede que no sea la mejor idea mover <i>todas las pruebas</i> para que se realicen durante el build de una imagen, pero puede ser buena idea que existan <i>algunas</i> pruebas relacionadas con la creación de contenedores.

Extrae un componente llamado <i>Todo</i> que represente a una sola tarea. Escribe una prueba para el nuevo componente y agrega la ejecución de pruebas al proceso de build.

Puedes agregar una nueva etapa de build para la prueba si lo deseas. Si lo haces, ¡recuerda leer de nuevo el último párrafo antes del ejercicio 12.13!

</div>

<div class="content">

### Desarrollo en contenedores

Movamos todo el desarrollo de la aplicación de tareas pendientes a un contenedor. Hay algunas razones por las que querrías hacer eso:

- Para mantener el entorno similar entre el desarrollo y la producción y así evitar errores que aparecen solo en el entorno de producción.
- Evitar diferencias entre los desarrolladores y sus entornos personales que generen dificultades en el desarrollo de aplicaciones.
- Para ayudar a los nuevos miembros del equipo a incorporarse, haciéndoles instalar el tiempo de ejecución del contenedor, sin necesidad de nada más.

Todas estas son buenas razones. La contrapartida es que podemos encontrarnos con algún comportamiento no convencional cuando no estamos ejecutando las aplicaciones como estamos acostumbrados. Tendremos que hacer al menos dos cosas para mover la aplicación a un contenedor:

- Iniciar la aplicación en modo de desarrollo
- Acceder a los archivos con VSCode

Comencemos con el frontend. Dado que el Dockerfile será significativamente diferente al Dockerfile de producción, creemos uno nuevo llamado <i>dev.Dockerfile</i>.

**Nota** usaremos el nombre <i>dev.Dockerfile</i> para las configuraciones de desarrollo y <i>Dockerfile</i> para lo demás.

Iniciar Vite en modo de desarrollo debería ser fácil. Comencemos con lo siguiente:

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY . .

# Cambia npm ci a npm install ya que vamos a estar en modo de desarrollo
RUN npm install

# npm run dev es el comando para iniciar la aplicación en modo de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
```

> Nota los parámetros adicionales _-- --host_ en el _CMD_. Esos son necesarios para exponer el servidor de desarrollo y hacerlo visible fuera de la red Docker. Por defecto, el servidor de desarrollo solo se expone a localhost, y a pesar de que accedemos al frontend todavía usando la dirección de localhost, en realidad está conectado a la red Docker.

Durante el build, se usará el indicador _-f_ para indicar qué archivo usar; de lo contrario, el predeterminado sería Dockerfile, por lo que el siguiente comando hará el build de la imagen:

```bash
docker build -f ./dev.Dockerfile -t hello-front-dev .
```

Vite se servirá en el puerto 5173, por lo que puedes probar que funciona al ejecutar un contenedor con ese puerto publicado.

La segunda tarea, acceder a los archivos con VSCode, aún no se ha realizado. Hay al menos dos formas de hacer esto:

- [Extensión de Visual Studio Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)
- Volúmenes, lo mismo que usamos para conservar los datos con la base de datos.

Repasemos esto último, ya que también funcionará con otros editores. Hagamos una ejecución de prueba con el indicador _-v_ y, si funciona, moveremos la configuración a un archivo docker-compose. Para usar _-v_, necesitaremos decirle el directorio actual. El comando _pwd_ debería generar la ruta al directorio actual. Intentemos esto con _echo $(pwd)_ en la línea de comandos. Podemos usarlo con _-v_ a la izquierda para asignar el directorio actual al interior del contenedor o podemos usar la ruta completa del directorio.

```bash
$ docker run -p 5173:5173 -v "$(pwd):/usr/src/app/" hello-front-dev
> todo-vite@0.0.0 dev
> vite --host

  VITE v5.1.6  ready in 130 ms
```

Ahora podemos editar el archivo <i>src/App.jsx</i>, ¡y los cambios deberían cargarse de forma instantánea en el navegador!

Si tienes una Mac con procesador M1/M2, el comando anterior falla. En el mensaje de error, notamos lo siguiente:

```
Error: Cannot find module @rollup/rollup-linux-arm64-gnu
```

El problema es la librería [rollup](https://www.npmjs.com/package/rollup) que tiene su propia versión para todos los sistemas operativos y arquitecturas de procesador. Debido al mapeo de volúmenes, el contenedor ahora está usando los *node_modules* del directorio de la máquina anfitriona donde está instalado _@rollup/rollup-darwin-arm64_ (la versión adecuada para Mac M1/M2), por lo que no se encuentra la versión correcta de la librería para el contenedor _@rollup/rollup-linux-arm64-gnu_.

Hay varias formas de solucionar el problema. Usemos quizás la más simple. Inicia el contenedor con bash como el comando, y ejecuta _npm install_ dentro del contenedor:

```bash
$ docker run -it -v "$(pwd):/usr/src/app/" front-dev bash
root@b83e9040b91d:/usr/src/app# npm install
```

¡Ahora ambas versiones de la librería rollup están instaladas y el contenedor funciona!

A continuación, movamos la configuración al archivo <i>docker-compose.dev.yml</i>. Este archivo también debe estar en la raíz del proyecto:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # El contexto tomará este directorio como el "contexto del build"
      dockerfile: dev.Dockerfile # Esto simplemente le indicará qué dockerfile leer
    volumes:
      - ./:/usr/src/app # La ruta puede ser relativa, por lo que ./ es suficiente para decir "la misma ubicación que el docker-compose.yml"
    ports:
      - 5173:5173
    container_name: hello-front-dev # Esto nombrará el contenedor como hello-front-dev
```

Con esta configuración, _docker compose -f docker-compose.dev.yml up_ puede ejecutar la aplicación en modo de desarrollo. ¡Ni siquiera necesitas tener Node instalado para trabajar en ella!

**Nota** usaremos el nombre <i>docker-compose.dev.yml</i> para los archivos de composición del entorno de desarrollo, y el nombre predeterminado <i>docker-compose.yml</i> en otros casos.

Instalar nuevas dependencias es un dolor de cabeza para una configuración de desarrollo como esta. Una de las mejores opciones es instalar la nueva dependencia **dentro** del contenedor. Entonces, en lugar de hacer, p.ej. _npm install axios_, debes hacerlo en el contenedor en ejecución, p.ej. _docker exec hello-front-dev npm install axios_, o agrégalo a package.json y ejecuta _docker build_ nuevamente.

</div>
<div class="tasks">

### Ejercicio 12.15

#### Ejercicio 12.15: Configurar un entorno de desarrollo frontend

Crea <i>todo-frontend/docker-compose.dev.yml</i> y usa volúmenes para habilitar el desarrollo de todo-frontend mientras se ejecuta <i>dentro</i> de un contenedor.

</div>

<div class="content">

### Comunicación entre contenedores en una red Docker

La herramienta Docker Compose configura una red entre los contenedores e incluye un DNS para conectar fácilmente dos contenedores. Agreguemos un nuevo servicio a Docker Compose y veremos cómo funcionan la red y el DNS.

[Busybox](https://www.busybox.net/) es un pequeño ejecutable con varias herramientas que podrías necesitar. Se llama "La navaja suiza de Embedded Linux", y definitivamente podemos usarlo para nuestro beneficio.

Busybox puede ayudarnos a depurar nuestras configuraciones. Entonces, si te pierdes en los últimos ejercicios de esta sección, puedes usar Busybox para averiguar qué funciona y qué no. Usémoslo para explorar lo que se acaba de decir. Que los contenedores están dentro de una red y que puedes conectarte fácilmente entre ellos. Busybox se puede agregar a la mezcla cambiando <i>docker-compose.dev.yml</i> a:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173
    container_name: hello-front-dev
  debug-helper: # highlight-line
    image: busybox # highlight-line
```

El contenedor Busybox no tendrá ningún proceso ejecutándose dentro por lo que no podemos usar _exec_ allí. Por eso, la salida de _docker compose up_ también se verá así:

```bash
$ docker compose -f docker-compose.dev.yml up                                                                                    0.0s
Attaching to front-dev, debug-helper-1
debug-helper-1 exited with code 0
front-dev       |
front-dev       | > todo-vite@0.0.0 dev
front-dev       | > vite --host
front-dev       |
front-dev       |
front-dev       |   VITE v5.2.2  ready in 153 ms
```

Esto es de esperar ya que es solo una caja de herramientas. Usémoslo para enviar una solicitud a hello-front-dev y ver cómo funciona el DNS. Mientras se ejecuta hello-front-dev, podemos realizar la solicitud con [wget](https://es.wikipedia.org/wiki/GNU_Wget) ya que es una herramienta incluida en Busybox para enviar una solicitud desde el asistente de depuración a hello-front-dev.

Con Docker Compose podemos usar _docker compose run SERVICE COMMAND_ para ejecutar un servicio con un comando específico. El comando wget requiere la bandera _-O_ con _-_ para enviar la respuesta a stdout:

```bash
$ docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173

Connecting to app:5173 (192.168.240.3:5173)
writing to stdout
<!doctype html>
<html lang="en">
  <head>
    <script type="module">
      ...
```

La URL es la parte interesante aquí. Simplemente dijimos que se conecte al puerto 5173 del servicio <i>app</i>. <i>app</i> es el nombre del servicio especificado en el archivo <i>docker-compose.dev.yml</i>:

```yml
services:
  app: # highlight-line
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173 # highlight-line
    container_name: hello-front-dev
```

El puerto utilizado es el puerto desde el cual la aplicación está disponible en ese contenedor. No es necesario publicar el puerto para que otros servicios de la misma red puedan conectarse a él. Los "puertos" en el archivo docker-compose son solo para acceso externo.

Cambiemos la configuración del puerto en <i>docker-compose.dev.yml</i> para enfatizar esto:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 3210:5173 # highlight-line
    container_name: hello-front-dev
  debug-helper:
    image: busybox
```

Con _docker compose up_ la aplicación está disponible en <http://localhost:3210> en la <i>máquina host</i>, pero el comando

```bash
docker compose  -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173
```

funciona ya que el puerto sigue siendo 5173 dentro de la red docker.

La imagen de abajo ilustra lo que sucede. El comando _docker compose run_ le pide a debug-helper que envíe la solicitud dentro de la red. Mientras que el navegador en la máquina host envía la solicitud desde fuera de la red.

![](../../images/12/busybox_networking_drawio.png)

Ahora que sabes lo fácil que es encontrar otros servicios en <i>docker-compose.yml</i> y no tenemos nada que depurar, podemos eliminar debug-helper y revertir los puertos a 5173:5173 en nuestro archivo compose.

</div>
<div class="tasks">

### Ejercicio 12.16

#### Ejercicio 12.16: Ejecutar todo-backend en un contenedor de desarrollo

Utiliza volúmenes y Nodemon para permitir el desarrollo del backend de la aplicación de tareas mientras se ejecuta <i>dentro</i> de un contenedor. Crea un archivo <i>todo-backend/dev.Dockerfile</i> y edita a <i>todo-backend/docker-compose.dev.yml</i>.

También deberás repensar las conexiones entre el backend y MongoDB / Redis. Afortunadamente, Docker Compose puede incluir variables de entorno que se pasarán a la aplicación:

```yaml
services:
  server:
    image: ...
    volumes:
      - ...
    ports:
      - ...
    environment: 
      - REDIS_URL=redisurl_here
      - MONGO_URL=mongourl_here
```

Las URL son incorrectas a propósito, deberás poner los valores correctos. Recuerda <i>mirar todo el tiempo lo que sucede en la consola</i>. Si y cuándo las cosas exploten, los mensajes de error insinuaran lo que podría estar roto.

Aquí hay una imagen posiblemente útil que ilustra las conexiones dentro de la red de docker:

![diagrama de conexión entre navegador, backend, mongo y redis](../../images/12/ex_12_15_backend_drawio.png)

</div>

<div class="content">

### Comunicaciones entre contenedores en un entorno más ambicioso

A continuación, agregaremos un [proxy inverso](https://es.wikipedia.org/wiki/Proxy_inverso) a nuestro docker-compose.dev.yml. Según wikipedia

> <i>Un proxy inverso es un tipo de servidor proxy que recupera recursos en nombre de un cliente desde uno o más servidores. Estos recursos luego se devuelven al cliente, apareciendo como si se originaran en el propio servidor proxy inverso.</i>

Entonces, en nuestro caso, el proxy inverso será el único punto de entrada a nuestra aplicación, y el objetivo final será establecer tanto el frontend de React como el backend de Express detrás del proxy inverso.

Hay múltiples opciones diferentes para una implementación de proxy inverso, como Traefik, Caddy, Nginx y Apache (ordenadas por versión inicial de más reciente a más antigua).

Nuestra elección es [Nginx](https://hub.docker.com/_/nginx).

Ahora pongamos <i>hello-frontend</i> detrás del proxy inverso.

Crea un archivo <i>nginx.dev.conf</i> en la raíz del proyecto y usa la siguiente plantilla como punto de partida. Tendremos que hacer ediciones menores para que nuestra aplicación se ejecute:

```bash
# events es requerido, pero los valores por defecto están bien
events { }

# Un servidor http, escuchando en el puerto 80
http {
  server {
    listen 80;

    # Requests comenzando con root (/) son manejados
    location / {
      # Las siguientes 3 lineas son requeridas para que el hot loading funcione (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests son dirigidos a http://localhost:5173
      proxy_pass http://localhost:5173;
    }
  }
}
```

**Nota** estamos usando la misma convención para nombres de archivos también para Nginx, <i>nginx.dev.conf</i> para configuraciones de desarrollo, y y el nombre por defecto <i>nginx.conf</i> para producción.

A continuación, crea un servicio Nginx en el archivo <i>docker-compose.dev.yml</i>. Agrega un volumen como se indica en la página de Docker Hub donde el lado derecho es _:/etc/nginx/nginx.conf:ro_, el ro final declara que el volumen será <i>solo de lectura (read only)</i>:

```yml
services:
  app:
    # ...
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app # esperar a que el contenedor frontend arranque
```

con eso agregado, podemos ejecutar _docker compose -f docker-compose.dev.yml up_ y ver qué sucede.

```bash
$ docker container ls
CONTAINER ID   IMAGE            COMMAND  PORTS                   NAMES
a02ae58f3e8d   nginx:1.20.1     ...      0.0.0.0:8080->80/tcp    reverse-proxy
5ee0284566b4   hello-front-dev  ...      0.0.0.0:5173->5173/tcp  hello-front-dev
```

Conectarse a http://localhost:8080 conducirá a una página que se ve familiar con estado 502.

Esto se debe a que dirigir las solicitudes a http://localhost:5173 no conduce a ninguna parte, ya que el contenedor Nginx no tiene una aplicación ejecutándose en el puerto 5173. Por definición, localhost se refiere a la computadora actual utilizada para acceder a él. Con los contenedores, localhost es único para cada contenedor, lo que lleva al contenedor en sí.

Probemos esto ingresando al contenedor Nginx y usando curl para enviar una solicitud a la aplicación. En nuestro caso de uso, curl es similar a wget, pero no necesitará ninguna bandera.

```bash
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:\# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

Para ayudarnos, Docker Compose configuró una red cuando ejecutamos _docker compose up_. También agregó todos los contenedores en <i>docker-compose.dev.yml</i> a la red. Un DNS se asegura de que podamos encontrar el otro contenedor. Cada uno de los contenedores recibe dos nombres: el nombre del servicio y el nombre del contenedor.

Como estamos dentro del contenedor, ¡también podemos probar el DNS! Modifiquemos el nombre del servicio (app) en el puerto 5173

```html
root@374f9e62bfa8:\# curl http://app:5173
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

¡Eso es! Reemplacemos la dirección proxy_pass en nginx.conf con esa.

Una cosa más: agregamos una opción [depends_on](https://docs.docker.com/compose/compose-file/05-services/#depends_on) a la configuración que garantiza que el contenedor _nginx_ no se inicie antes que el contenedor frontend _app_:

```bash
services:
  app:
    # ...
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on: // highlight-line
      - app // highlight-line
```

Si no hacemos cumplir el orden de inicio con <i>depends\_on</i>, existe el riesgo de que Nginx falle en el inicio, ya que intenta recuperar todos los nombres de DNS a los que se hace referencia en el archivo de configuración:

```bash
http {
  server {
    listen 80;

    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      proxy_pass http://app:5173; // highlight-line
    }
  }
}
```

Ten en cuenta que <i>depends\_on</i> no garantiza que el servicio en el contenedor dependiente esté listo para la acción, solo asegura que el contenedor se haya iniciado (y la entrada correspondiente se agregue al DNS). Si un servicio necesita esperar a que otro servicio esté listo antes del inicio, se deben usar [otras soluciones](https://docs.docker.com/compose/startup-order/).

</div>

<div class="tasks">

### Ejercicios 12.17. - 12.19.

#### Ejercicio 12.17: Configura un servidor proxy inverso Nginx delante de todo-frontend

A continuación vamos a poner el servidor nginx delante de todo-frontend y todo-backend. Comencemos creando un nuevo archivo docker-compose <i>todo-app/docker-compose.dev.yml</i> y <i>todo-app/nginx.dev.conf</i>.

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.dev.conf // highlight-line
└── docker-compose.dev.yml // highlight-line
```

Agrega los servicios Nginx y todo-frontend creados con <i>todo-app/todo-frontend/dev.Dockerfile</i> en <i>todo-app/docker-compose.dev.yml</i>.

![diagrama de conexión entre navegador, nginx, express y frontend](../../images/12/ex_12_16_nginx_front.png)

En este y en los siguientes ejercicios **no necesitas** darle soporte a la opción build, eso es, el comando:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Es suficiente hacer el build del frontend y el backend en sus propios repositorios.

#### Ejercicio 12.18: Configura el servidor Nginx para que esté delante de todo-backend

Agrega el servicio todo-backend al archivo docker-compose <i>todo-app/docker-compose.dev.yml</i> en el modo de desarrollo.

Agrégale una nueva ubicación al archivo <i>nginx.dev.conf</i>, para que las solicitudes a _/api_ se transmitan al backend a través del proxy. Algo como esto debería hacer el truco:

```conf
  server {
    listen 80;

    # Requests comenzando con root (/) son manejados
    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      proxy_pass ...
    }

    # Requests comenzando con /api/ son manejados
    location /api/ {
      proxy_pass ...
    }
  }
```

La directiva *proxy\_pass* tiene una característica interesante con una barra inclinada final. Como estamos usando la ruta _/api_ para la ubicación, pero la aplicación backend solo responde en las rutas _/_ o _/todos_, queremos que se elimine _/api_ de la solicitud. En otras palabras, aunque el navegador envíe una solicitud GET a _/api/todos/1_, queremos que Nginx envíe la solicitud a _/todos/1_. Haz esto agregando una barra inclinada final _/_ a la URL al final de *proxy\_pass*.

Este es un [problema común](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![comentarios sobre haber olvidado usar la barra inclinada](../../images/12/nginx_trailing_slash_stackoverflow.png)

Esto ilustra lo que estamos buscando y puede ser útil si tienes problemas:

![diagrama de llamado a / y /api en acción](../../images/12/nginx-back-vite.png)

#### Ejercicio 12.19: Conecta los servicios, todo-frontend con todo-backend

> En este ejercicio, envía todo el entorno de desarrollo, incluyendo ambas aplicaciones Express y React, dev.Dockerfiles y docker-compose.dev.yml.

Finalmente, es hora de juntar todas las piezas. Antes de empezar, es esencial entender <i>dónde</i> se ejecuta realmente la aplicación React. El diagrama anterior podría dar la impresión de que la aplicación React se ejecuta en el contenedor, pero esto es completamente incorrecto.

Es solo el *código fuente de la aplicación React* lo que está en el contenedor. Cuando el navegador accede a la dirección http://localhost:8080 (suponiendo que hayas configurado Nginx para ser accesible en el puerto 8080), el código fuente de React se descarga del contenedor al navegador:

![diagrama mostrando que el código de react es enviado al navegador para su ejecución](../../images/12/nginx-setup-vite.png)

A continuación, el navegador comienza a ejecutar la aplicación React, y todas las solicitudes que hace al backend deben hacerse a través del proxy inverso Nginx:

![diagrama mostrando solicitudes hechas desde al navegador a /api de nginx y el proxy en acción solicitando a /todos](../../images/12/nginx-setup2.png)

En realidad solo accedemos al contenedor frontend en la primera solicitud, la cual obtiene el código fuente de la aplicación React para el navegador.

Ahora configura tu aplicación para que funcione como se muestra en la figura anterior. Asegúrate de que el todo-frontend funcione con todo-backend. Esto requerirá cambios en la variable de entorno *VITE\_BACKEND\_URL* en el frontend.

Asegúrate de que el entorno de desarrollo ahora esté completamente funcional, es decir:
- todas las funcionalidades de la aplicación de tareas funcionan
- puedes editar los archivos fuente *y* los cambios se reflejan al recargar la aplicación
- el frontend debe acceder al backend a través de Nginx, por lo que las solicitudes deben hacerse a http://localhost:8080/api/todos:

![pestaña de red de las herramientas de desarrollo del navegador mostrando que la url a la que el navegador llama incluye 8080/api/todos](../../images/12/todos-dev-right-2.png)

Ten en cuenta que tu aplicación debe funcionar incluso si no se definen [puertos expuestos](https://docs.docker.com/network/#published-ports) para el backend y el frontend en el archivo docker compose:

```yml
services:
  app:
    image: todo-front-dev
    volumes:
      - ./todo-frontend/:/usr/src/app
    # no hay puertos aquí!

  server:
      image: todo-back-dev
      volumes:
        - ./todo-backend/:/usr/src/app
      environment: 
        - ...
      # no hay puertos aquí!

  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80 # esto es necesario
    container_name: reverse-proxy
    depends_on:
      - app
```

Solo necesitamos exponer el puerto de Nginx a la máquina host ya que el acceso al backend y frontend funciona a través del proxy de Nginx, el cual lo envía al puerto correcto del contenedor. Debido a que Nginx, frontend y backend están definidos en la misma configuración de Docker compose, Docker los pone en la misma [Docker network](https://docs.docker.com/network/) y gracias a eso, Nginx tiene acceso directo a los puertos de los contenedores frontend y backend.

</div>

<div class="content">

### Herramientas para la producción

Los contenedores son herramientas divertidas para usar en el desarrollo, pero el mejor caso de uso para ellos es en el entorno de producción. Hay muchas herramientas más potentes que Docker Compose para ejecutar contenedores en producción.

Herramientas de orquestación de contenedores pesados como [Kubernetes](https://kubernetes.io/) nos permiten administrar contenedores en un nivel completamente nuevo. Estas herramientas ocultan las máquinas físicas y nos permiten a nosotros, los desarrolladores, preocuparnos menos por la infraestructura.

Si estás interesado en obtener más información sobre los contenedores, accede al curso [DevOps con Docker](https://devopswithdocker.com) y podrás encontrar más información sobre Kubernetes en el curso avanzado de 5 créditos [DevOps con Kubernetes](https://devopswithkubernetes.com) curso. ¡Ahora deberías tener las habilidades para completar ambos!

</div>

<div class="tasks">

### Ejercicios 12.20.-12.22.

#### Ejercicio 12.20:

Crea un archivo de producción <i>todo-app/docker-compose.yml</i> con todos los servicios, Nginx, todo-backend, todo-frontend, MongoDB y Redis. Utiliza Dockerfiles en lugar de <i>dev.Dockerfiles</i> y asegúrate de iniciar las aplicaciones en modo de producción.

Utiliza la siguiente estructura para este ejercicio:

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.dev.conf
├── docker-compose.dev.yml
├── nginx.conf  // highlight-line
└── docker-compose.yml // highlight-line
```

#### Ejercicio 12.21:

Crea un entorno de desarrollo en contenedores similar para una de tus <i>propias</i> aplicaciones, puedes usar las que hayas creado durante el curso o en tu tiempo libre. Debes estructurar la aplicación en tu repositorio de envío de la siguiente manera:

```bash
└── my-app
    ├── frontend
    |    └── dev.Dockerfile
    ├── backend
    |    └── dev.Dockerfile
    ├── nginx.dev.conf
    └── docker-compose.dev.yml
```

#### Ejercicio 12.22:

Termina esta parte creando una <i>configuración de producción</i> en contenedores de tu propia aplicación.
Estructura la aplicación en tu repositorio de envío de la siguiente manera:

```bash
└── my-app
    ├── frontend
    |    ├── dev.Dockerfile
    |    └── Dockerfile
    ├── backend
    |    └── dev.Dockerfile
    |    └── Dockerfile
    ├── nginx.dev.conf
    ├── nginx.conf
    ├── docker-compose.dev.yml
    └── docker-compose.yml
```

### Envío de ejercicios y obtención de créditos.

Este fue el último ejercicio de esta sección. Es hora de enviar tu código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-containers).

Los ejercicios de esta parte se envían al igual que en las partes anteriores, pero a diferencia de las partes 0 a 7, la presentación va a una [instancia propia del curso](https://studies.cs.helsinki.fi/stats/courses/fs-containers). ¡Recuerda que tienes que terminar <i>todos los ejercicios</i> para aprobar esta parte!

Una vez que hayas completado los ejercicios y quieras obtener los créditos, infórmanos a través del sistema de envío de ejercicios que has completado el curso:

![Submissions](../../images/11/21.png)

**Ten en cuenta** que necesitas registrarte en la parte del curso correspondiente para obtener los créditos registrados, consulta [aquí](/es/part0/informacion_general#partes-y-finalizacion) para obtener más información.

Puedes descargar el certificado por completar esta parte haciendo clic en uno de los íconos de bandera. El ícono de la bandera corresponde al idioma del certificado.

</div>

</div>
