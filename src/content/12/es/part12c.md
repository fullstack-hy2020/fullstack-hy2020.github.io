---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: es
---

<div class="content">

### React in container

Vamos a crear y contenerizar una aplicación React a continuación. Elijamos npm como administrador de paquetes aunque create-react-app tenga como valor predeterminado yarn.

```
$ npx create-react-app hello-front --use-npm
  ...

  Happy hacking!
```

create-react-app ya instaló todas las dependencias para nosotros, por lo que no necesitamos ejecutar npm install aquí.

El siguiente paso es convertir el código JavaScript y CSS en archivos estáticos listos para producción, create-react-app ya tiene _build_ como un script npm, así que usemos eso:

```
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

¡Excelente! El paso final es encontrar una forma de usar un servidor para servir los archivos estáticos. Como sabrás, podríamos usar nuestro [express.static](https://expressjs.com/en/starter/static-files.html) con el servidor Express para servir los archivos estáticos. Te lo dejo como ejercicio para que lo hagas en casa. En su lugar, seguiremos adelante y comenzaremos a escribir nuestro Dockerfile:

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

Eso parece correcto. Construyámoslo y veamos si estamos en el camino correcto. Nuestro objetivo es que la compilación tenga éxito sin errores. Luego usaremos bash para verificar dentro del contenedor para ver si los archivos están allí.

```bash
$ docker build . -t hello-front
  [+] Building 172.4s (10/10) FINISHED 

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
  Dockerfile  README.md  build  node_modules  package-lock.json  package.json  public  src

root@98fa9483ee85:/usr/src/app# ls build/
  asset-manifest.json  favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt  static
```

Una opción válida para servir archivos estáticos ahora que ya tenemos Node en el contenedor es [serve](https://www.npmjs.com/package/serve). Intentemos instalar el servicio y servir los archivos estáticos mientras estamos dentro del contenedor.

```bash
root@98fa9483ee85:/usr/src/app# npm install -g serve

  added 88 packages, and audited 89 packages in 6s

root@98fa9483ee85:/usr/src/app# serve build

   ┌───────────────────────────────────┐
   │                                   │
   │   Serving!                        │
   │                                   │
   │   Local:  http://localhost:5000   │
   │                                   │
   └───────────────────────────────────┘

```

¡Excelente! Hagamos ctrl+c y salgamos y luego agréguelos a nuestro Dockerfile.

La instalación de serve se convierte en RUN en el Dockerfile. De esta manera, la dependencia se instala durante el proceso de compilación. El comando para servir el directorio de compilación se convertirá en el comando para iniciar el contenedor:

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve # highlight-line

CMD ["serve", "build"] # highlight-line
```

Nuestro CMD ahora incluye corchetes y, como resultado, usamos el llamado <i>exec form</i> de CMD. En realidad, hay **tres** formas diferentes para el CMD de las cuales se prefiere la forma exec. Lea la [documentación](https://docs.docker.com/engine/reference/builder/#cmd) para obtener más información.

Cuando ahora construimos la imagen con _docker build. -t hello-front_ y la ejecutamos con _docker run -p 5000:3000 hello-front_, la aplicación estará disponible en http://localhost:5000.

### Usando múltiples etapas

Si bien serve es una opción <i>válida</i>, podemos hacerlo mejor. Un buen objetivo es crear imágenes de Docker para que no contengan nada irrelevante. Con un número mínimo de dependencias, es menos probable que las imágenes se rompan o se vuelvan vulnerables con el tiempo.

[Compilaciones de varias etapas](https://docs.docker.com/develop/develop-images/multistage-build/) están diseñadas para dividir el proceso de compilación en muchas etapas separadas, donde es posible limitar qué partes de los archivos de imagen se mueven entre las etapas. Eso abre posibilidades para limitar el tamaño de la imagen, ya que no todos los subproductos de la construcción son necesarios para la imagen resultante. Las imágenes más pequeñas son más rápidas de cargar y descargar y ayudan a reducir la cantidad de vulnerabilidades que puede tener su software.

Con compilaciones de varias etapas, se puede usar una solución probada y verdadera como [Nginx](https://en.wikipedia.org/wiki/Nginx) para servir archivos estáticos sin muchos dolores de cabeza. La [página de Nginx](https://hub.docker.com/_/nginx) de Docker Hub nos brinda la información necesaria para abrir los puertos y "Alojamiento de contenido estático simple".

Usemos el Dockerfile anterior pero cambiemos FROM para incluir el nombre de la etapa:

```Dockerfile
# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage # highlight-line

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine # highlight-line

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html # highlight-line
```

Hemos declarado también <i>otra etapa</i> donde solo se mueven los archivos relevantes de la primera etapa (el directorio <i>build</i>, que contiene el contenido estático).

Después de que la construimos de nuevo, la imagen está lista para servir el contenido estático. El puerto predeterminado será 80 para Nginx, por lo que algo como _-p 8000:80_ funcionará, por lo que los parámetros del comando de ejecución deben cambiarse un poco.

Las compilaciones de varias etapas también incluyen algunas optimizaciones internas que pueden afectar sus compilaciones. Como ejemplo, las compilaciones de varias etapas se saltan las etapas que no se utilizan. Si deseamos usar una etapa para reemplazar una parte de una canalización de compilación, como pruebas o notificaciones, debemos pasar **algunos** datos a las siguientes etapas. En algunos casos esto está justificado: copie el código de la etapa de prueba a la etapa de construcción. Esto garantiza que está compilando el código probado.

</div>

<div class="tasks">

### Ejercicios 12.13 - 12.14.

#### Ejercicio 12.13: Fronted de la aplicación de tareas

Finalmente, llegamos a la interfaz (fronted) de la aplicación de tareas pendientes. Vea todo-app/todo-frontend y lea el LÉAME.

Comience ejecutando el frontend fuera del contenedor y asegúrese de que funcione con el backend.

Contenga la aplicación creando <i>todo-app/todo-frontend/Dockerfile</i> y use la instrucción [ENV](https://docs.docker.com/engine/reference/builder/#env) para pasar * REACT\_APP\_BACKEND\_URL* a la aplicación y ejecútela con el backend. El backend aún debería estar ejecutándose fuera de un contenedor. Tenga en cuenta que debe configurar *REACT\_APP\_BACKEND\_URL* antes de compilar la interfaz, de lo contrario, no quedará definida en el código.

#### Ejercicio 12.14: Pruebas durante el proceso de construcción

Una posibilidad interesante de utilizar compilaciones de varias etapas es usar una etapa de compilación separada para [pruebas](https://docs.docker.com/language/nodejs/run-tests/). Si la etapa de prueba falla, todo el proceso de construcción también fallará. Tenga en cuenta que puede que no sea la mejor idea mover <i>todas las pruebas</i> para que se realicen durante la construcción de una imagen, pero puede ser buena idea que existan <i>algunas</i> pruebas relacionadas con la creación de contenedores.

Extraiga un componente <i>Todo</i> que represente una sola tarea. Escriba una prueba para el nuevo componente y agregue pruebas en ejecución al proceso de compilación.

Ejecute las pruebas con _CI=true npm test_, o create-react-app comenzará a buscar cambios y su canalización se atascará.

Puede agregar una nueva etapa de compilación para la prueba si lo desea. Si lo hace, ¡recuerde leer de nuevo el último párrafo antes del ejercicio 12.13!

</div>

<div class="content">

### Desarrollo en contenedores

Movamos todo el desarrollo de la aplicación de tareas pendientes a un contenedor. Hay algunas razones por las que querrías hacer eso:

- Para mantener el entorno similar entre el desarrollo y la producción para evitar errores que aparecen solo en el entorno de producción.
- Evitar diferencias entre los desarrolladores y sus entornos personales que generen dificultades en el desarrollo de aplicaciones.
- Para ayudar a los nuevos miembros del equipo a incorporarse, haciéndoles instalar el tiempo de ejecución del contenedor, sin necesidad de nada más.

Todas estas son buenas razones. La contrapartida es que podemos encontrarnos con algún comportamiento no convencional cuando no estamos ejecutando las aplicaciones a las que estamos acostumbrados. Tendremos que hacer al menos dos cosas para mover la aplicación a un contenedor:

- Inicie la aplicación en modo de desarrollo
- Accede a los archivos con VSCode

Comencemos con la interfaz. Dado que el Dockerfile será significativamente diferente al Dockerfile de producción, creemos uno nuevo llamado <i>dev.Dockerfile</i>.

Iniciar la aplicación create-react-app en modo de desarrollo debería ser fácil. Comencemos con lo siguiente:

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm start is the command to start the application in development mode
CMD ["npm", "start"]
```
 
Durante la compilación, se usará el indicador _-f_ para indicar qué archivo usar; de lo contrario, sería Dockerfile predeterminado, por lo que _docker build -f ./dev.Dockerfile -t hello-front-dev ._ compilará la imagen. La aplicación create-react se servirá en el puerto 3000, por lo que puede probar que funciona ejecutando un contenedor con ese puerto publicado.

La segunda tarea, acceder a los archivos con VSCode, aún no se ha realizado. Hay al menos dos formas de hacer esto:

- [Extensión de Visual Studio Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)
- Volúmenes, lo mismo que usamos para conservar los datos con la base de datos.

Repasemos esto último, ya que también funcionará con otros editores. Hagamos una ejecución de prueba con el indicador _-v_ y, si funciona, moveremos la configuración a un archivo docker-compose. Para usar _-v_, necesitaremos decirle el directorio actual. El comando _pwd_ debería generar la ruta al directorio actual. Intente esto con _echo $(pwd)_ en su línea de comando. Podemos usarlo con _-v_ a la izquierda para asignar el directorio actual al interior del contenedor o puede usar la ruta completa del directorio.

```bash
$ docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev

  Compiled successfully!

  You can now view hello-front in the browser.
```

Ahora podemos editar el archivo <i>src/App.js</i>, ¡y los cambios deben cargarse de forma instantanea en el navegador!

A continuación, movamos la configuración a <i>docker-compose.yml</i>. Ese archivo también debe estar en la raíz del proyecto:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3000:3000
    container_name: hello-front-dev # This will name the container hello-front-dev
```

Con esta configuración, _docker-compose up_ puede ejecutar la aplicación en modo de desarrollo. ¡Ni siquiera necesita Node instalado para desarrollarlo!

Instalar nuevas dependencias es un dolor de cabeza para una configuración de desarrollo como esta. Una de las mejores opciones es instalar la nueva dependencia **dentro** del contenedor. Entonces, en lugar de hacer, p. _npm install axios_, debe hacerlo en el contenedor en ejecución, p. _docker exec hello-front-dev npm instale axios_, o agréguelo a package.json y ejecute _docker build_ nuevamente.

</div>
<div class="tasks">

### Ejercicio 12.15

#### Ejercicio 12.15: Configurar un entorno de desarrollo frontend

Cree <i>todo-frontend/docker-compose.dev.yml</i> y use volúmenes para habilitar el desarrollo de todo-frontend mientras se ejecuta <i>dentro</i> de un contenedor.

</div>

<div class="content">

### Comunicación entre contenedores en una red Docker

La herramienta docker-compose configura una red entre los contenedores e incluye un DNS para conectar fácilmente dos contenedores. Agreguemos un nuevo servicio a docker-compose y veremos cómo funcionan la red y el DNS.

[Busybox](https://www.busybox.net/) es un pequeño ejecutable con varias herramientas que puede necesitar. Se llama "La navaja suiza de Embedded Linux", y definitivamente podemos usarlo para nuestro beneficio.

Busybox puede ayudarnos a depurar nuestras configuraciones. Entonces, si se pierde en los ejercicios posteriores de esta sección, debe usar Busybox para averiguar qué funciona y qué no. Usémoslo para explorar lo que se acaba de decir. Que los contenedores están dentro de una red y puede conectarse fácilmente entre ellos. Busybox se puede agregar a la mezcla cambiando <i>docker-compose.yml</i> a:

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
      - 3000:3000
    container_name: hello-front-dev
  debug-helper: # highlight-line
    image: busybox # highlight-line
```

El contenedor Busybox no tendrá ningún proceso ejecutándose dentro para que podamos _ejecutar_ allí. Por eso, la salida de _docker-compose up_ también se verá así:

```bash
$ docker-compose up
  Pulling debug-helper (busybox:)...
  latest: Pulling from library/busybox
  8ec32b265e94: Pull complete
  Digest: sha256:b37dd066f59a4961024cf4bed74cae5e68ac26b48807292bd12198afa3ecb778
  Status: Downloaded newer image for busybox:latest
  Starting hello-front-dev          ... done
  Creating react-app_debug-helper_1 ... done
  Attaching to react-app_debug-helper_1, hello-front-dev
  react-app_debug-helper_1 exited with code 0
  
  hello-front-dev | 
  hello-front-dev | > react-app@0.1.0 start
  hello-front-dev | > react-scripts start
```

Esto es de esperar ya que es solo una caja de herramientas. Usémoslo para enviar una solicitud a hello-front-dev y ver cómo funciona el DNS. Mientras se ejecuta hello-front-dev, podemos realizar la solicitud con [wget](https://en.wikipedia.org/wiki/Wget) ya que es una herramienta incluida en Busybox para enviar una solicitud desde el asistente de depuración. a hola-front-dev.

Con Docker Compose podemos usar _docker-compose run SERVICE COMMAND_ para ejecutar un servicio con un comando específico. El comando wget requiere la bandera _-O_ con _-_ para generar la respuesta a la salida estándar:

```bash
$ docker-compose run debug-helper wget -O - http://app:3000

  Creating react-app_debug-helper_run ... done
  Connecting to hello-front-dev:3000 (172.26.0.2:3000)
  writing to stdout
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      ...
```

La URL es la parte interesante aquí. Simplemente dijimos que se conectará al servicio <i>hello-front-dev</i> y a ese puerto 3000. El <i>hello-front-dev</i> es el nombre del contenedor, que fue dado por nosotros usando *container\_name* en el archivo docker-compose. Y el puerto utilizado es el puerto desde el cual la aplicación está disponible en ese contenedor. No es necesario publicar el puerto para que otros servicios de la misma red puedan conectarse a él. Los "puertos" en el archivo docker-compose son solo para acceso externo.

Cambiemos la configuración del puerto en <i>docker-compose.yml</i> para enfatizar esto:

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
      - 3210:3000 # highlight-line
    container_name: hello-front-dev
  debug-helper:
    image: busybox
```

Con _docker-compose up_ la aplicación está disponible en <http://localhost:3210> en la <i>máquina host</i>, pero aun así _docker-compose ejecuta debug-helper wget -O - http://app: 3000_ funciona ya que el puerto sigue siendo 3000 dentro de la red docker.

![](../../images/12/busybox_networking_drawio.png)

Como ilustra la imagen de arriba, _docker-compose run_ le pide a debug-helper que envíe la solicitud dentro de la red. Mientras que el navegador en la máquina host envía la solicitud desde fuera de la red.

Ahora que sabe lo fácil que es encontrar otros servicios en <i>docker-compose.yml</i> y no tenemos nada que depurar, podemos eliminar el asistente de depuración y revertir los puertos a 3000:3000 en nuestro < i>docker-compose.yml</i>.

</div>
<div class="tasks">

### Ejercicio 12.16

#### Ejercicio 12.16: Ejecutar todo-backend en un contenedor de desarrollo

Use volúmenes y Nodemon para permitir el desarrollo del backend de la aplicación de tareas mientras se ejecuta <i>dentro</i> de un contenedor. Cree un <i>todo-backend/dev.Dockerfile</i> y edite <i>todo-backend/docker-compose.dev.yml</i>.

También deberá repensar las conexiones entre el backend y MongoDB/Redis. Afortunadamente, docker-compose puede incluir variables de entorno que se pasarán a la aplicación:

```yaml
services:
  server:
    image: ...
    volumes:
      - ...
    ports:
      - ...
    environment: 
      - REDIS_URL=...
      - MONGO_URL=...
```

Las URL (localhost) son incorrectas a propósito, deberá establecer los valores correctos. Recuerda <i>mirar todo el tiempo lo que sucede en la consola</i>. Si las cosas fallan, los mensajes de error insinúan lo que podría estar roto.

Aquí hay una imagen posiblemente útil que ilustra las conexiones dentro de la red acoplable:

![](../../images/12/ex_12_15_backend_drawio.png)

</div>

<div class="content">

### Comunicaciones entre contenedores en un entorno más ambicioso

A continuación, agregaremos un [proxy inverso](https://en.wikipedia.org/wiki/Reverse_proxy) a nuestro docker-compose.yml. segun wikipedia

> <i>Un proxy inverso es un tipo de servidor proxy que recupera recursos en nombre de un cliente de uno o más servidores. Estos recursos luego se devuelven al cliente, apareciendo como si se originaran en el propio servidor proxy inverso.</i>

Entonces, en nuestro caso, el proxy inverso será el único punto de entrada a nuestra aplicación, y el objetivo final será establecer tanto el frontend de React como el backend de Express detrás del proxy inverso.

Hay múltiples opciones diferentes para una implementación de proxy inverso, como Traefik, Caddy, Nginx y Apache (ordenadas por versión inicial de más reciente a más antigua).

Nuestra elección es [Nginx](https://hub.docker.com/_/nginx).

Ahora pongamos <i>hello-frontend</i> detrás del proxy inverso.

Cree un archivo <i>nginx.conf</i> en la raíz del proyecto y tome la siguiente plantilla como punto de partida. Tendremos que hacer ediciones menores para que nuestra aplicación se ejecute:

```bash
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }
  }
}
```

A continuación, cree un servicio Nginx en el archivo <i>docker-compose.yml</i>. Agregue un volumen como se indica en la página de Docker Hub donde el lado derecho es _:/etc/nginx/nginx.conf:ro_, el ro final declara que el volumen será <i>de solo lectura</i>:

```yml
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
    depends_on:
      - app # wait for the frontend container to be started
```

Con eso agregado, podemos ejecutar _docker-compose up_ y ver qué sucede.

```bash
$ docker container ls
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                       NAMES
a02ae58f3e8d   nginx:1.20.1      "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp       reverse-proxy
5ee0284566b4   hello-front-dev   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   hello-front-dev
```

Conectarse a http://localhost:8080 conducirá a una página familiar con estado 502.

Esto se debe a que dirigir las solicitudes a http://localhost:3000 no conduce a ninguna parte, ya que el contenedor Nginx no tiene una aplicación ejecutándose en el puerto 3000. Por definición, localhost se refiere a la computadora actual utilizada para acceder a él. Con los contenedores, localhost es único para cada contenedor, lo que lleva al contenedor en sí.

Probemos esto ingresando al contenedor Nginx y usando curl para enviar una solicitud a la aplicación misma. En nuestro uso, curl es similar a wget, pero no necesitará ninguna bandera.

```bash
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:/# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

Para ayudarnos, docker-compose configuró una red cuando ejecutamos _docker-compose up_. También agregó todos los contenedores en <i>docker-compose.yml</i> a la red. Un DNS se asegura de que podamos encontrar el otro contenedor. Cada uno de los contenedores recibe dos nombres: el nombre del servicio y el nombre del contenedor.

Como estamos dentro del contenedor, ¡también podemos probar el DNS! Modifiquemos el nombre del servicio (aplicación) en el puerto 3000

```html
root@374f9e62bfa8:/# curl http://app:3000
  <!DOCTYPE html>
  <html lang="en">
    <head>
    ...
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    ...
```

¡Eso es! Reemplacemos la dirección proxy_pass en nginx.conf con esa.

Si todavía se encuentra con 502, asegúrese de que la aplicación create-react-app se haya creado primero. Puede leer la salida de registros desde _docker-compose up_.

Una cosa más: agregamos una opción [depends_on](https://docs.docker.com/compose/compose-file/compose-file-v3/#depends_on) a la configuración que garantiza que el contenedor _nginx_ no se inicie antes se mira el contenedor frontend _app_:

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
      
      proxy_pass http://app:3000; // highlight-line
    }
  }
}
```

Tenga en cuenta que <i>depends\_on</i> no garantiza que el servicio en el contenedor dependiente esté listo para la acción, solo asegura que el contenedor se haya iniciado (y la entrada correspondiente se agregue a DNS). Si un servicio necesita esperar a que otro servicio esté listo antes del inicio, se deben usar [otras soluciones](https://docs.docker.com/compose/startup-order/).

</div>

<div class="tasks">

### Ejercicios 12.17. - 12.19.

#### Ejercicio 12.17: Configure un servidor proxy inverso Nginx frente a todo-frontend

A continuación vamos a poner el servidor nginx delante de todo-frontend y todo-backend. Comencemos creando un nuevo archivo docker-compose <i>todo-app/docker-compose.dev.yml</i> y <i>todo-app/nginx.conf</i>.

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.conf // highlight-line
└── docker-compose.dev.yml // highlight-line
```

Agregue los servicios nginx y todo-frontend creados con <i>todo-app/todo-frontend/dev.Dockerfile</i> en <i>todo-app/docker-compose.dev.yml</i>.

![](../../images/12/ex_12_16_nginx_front.png)

#### Ejercicio 12.18: Configure el servidor Nginx para que esté al frente de todo-backend

Agregue el servicio todo-backend al archivo docker-compose <i>todo-app/docker-compose.dev.yml</i> en el modo de desarrollo.

Agregue una nueva ubicación a <i>nginx.conf</i> para que las solicitudes a _/api_ se transmitan al backend. Algo como esto debería hacer el truco:

```conf
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }

    # Requests starting with /api/ are handled
    location /api/ {
      ...
    }
  }
```

La directiva *proxy\_pass* tiene una característica interesante con una barra inclinada final. Como estamos usando la ruta _/api_ para la ubicación, pero la aplicación backend solo responde en las rutas _/_ o _/todos_, queremos que se elimine _/api_ de la solicitud. En otras palabras, aunque el navegador envíe una solicitud GET a _/api/todos/1_, queremos que Nginx envíe la solicitud a _/todos/1_. Haga esto agregando una barra inclinada final _/_ a la URL al final de *proxy\_pass*.

Este es un [problema común](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![](../../images/12/nginx_trailing_slash_stackoverflow.png)

Esto ilustra lo que estamos buscando y puede ser útil si tiene problemas:

![](../../images/12/ex_12_17_nginx_back.png)

#### Ejercicio 12.19: Conecte los servicios, todo-frontend con todo-backend

> En este ejercicio, envíe todo el entorno de desarrollo, incluidas las aplicaciones Express y React, Dockerfiles y docker-compose.yml.

Asegúrese de que todo-frontend funcione con todo-backend. Requerirá cambios en la variable ambiental *REACT\_APP\_BACKEND\_URL*.

Si ya hizo que esto funcionara durante un ejercicio anterior, puede omitirlo.

Asegúrese de que el entorno de desarrollo ahora sea completamente funcional, es decir:
- todas las funciones de la aplicación de tareas funcionan
- puede editar los archivos fuente <i>y</i> los cambios surten efecto a través de la recarga instantanea en el caso del frontend y recargando la aplicación en el caso del backend.

</div>

<div class="content">

### Herramientas para la producción

Los contenedores son herramientas divertidas para usar en el desarrollo, pero el mejor caso de uso para ellos es en el entorno de producción. Hay muchas herramientas más potentes que docker-compose para ejecutar contenedores en producción.

Herramientas de orquestación de contenedores pesados como [Kubernetes](https://kubernetes.io/) nos permiten administrar contenedores en un nivel completamente nuevo. Estas herramientas ocultan las máquinas físicas y nos permiten a nosotros, los desarrolladores, preocuparnos menos por la infraestructura.

Si está interesado en obtener más información sobre los contenedores, acceda al curso [DevOps con Docker](https://devopswithdocker.com) y podrá encontrar más información sobre Kubernetes en el curso avanzado de 5 créditos [DevOps con Kubernetes](https: //devopswithkubernetes.com) curso. ¡Ahora deberías tener las habilidades para completar ambos!

</div>

<div class="tasks">

### Ejercicios 12.20.-12.22.
#### Ejercicio 12.20:

Cree una producción <i>todo-app/docker-compose.yml</i> con todos los servicios, Nginx, todo-backend, todo-frontend, MongoDB y Redis. Utilice Dockerfiles en lugar de <i>dev.Dockerfiles</i> y asegúrese de iniciar las aplicaciones en modo de producción.

Utilice la siguiente estructura para este ejercicio:

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.conf
├── docker-compose.dev.yml
└── docker-compose.yml // highlight-line
```

#### Ejercicio 12.21:

Cree un entorno de desarrollo en contenedores similar para uno de sus aplicaciónes <i>propias</i> puede usar las que haya creado durante el curso o en su tiempo libre. Debe estructurar la aplicación en su repositorio de envío de la siguiente manera:

```bash
└── my-app
    ├── frontend
    |    └── dev.Dockerfile
    ├── backend
    |    └── dev.Dockerfile
    └── docker-compose.dev.yml
```

#### Ejercicio 12.22:

Termine esta parte creando una <i>configuración de producción</i> en contenedores de su propia aplicación.
Estructure la aplicación en su repositorio de envío de la siguiente manera:

```bash
└── my-app
    ├── frontend
    |    ├── dev.Dockerfile
    |    └── Dockerfile
    ├── backend
    |    └── dev.Dockerfile
    |    └── Dockerfile
    ├── docker-compose.dev.yml
    └── docker-compose.yml
```
### Envío de ejercicios y obtención de créditos.

Este fue el último ejercicio de esta sección. Es hora de enviar su código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-containers).

Los ejercicios de esta parte se envían al igual que en las partes anteriores, pero a diferencia de las partes 0 a 7, la presentación va a una [instancia propia del curso](https://studies.cs.helsinki.fi/stats/courses/fs-containers ). ¡Recuerda que tienes que terminar <i>todos los ejercicios</i> para aprobar esta parte!

Una vez que hayas completado los ejercicios y quieras obtener los créditos, infórmanos a través del sistema de envío de ejercicios que has completado el curso:

![Submissions](../../images/11/21.png)


**Tenga en cuenta** que necesita registrarse en la parte del curso correspondiente para obtener los créditos registrados, consulte [aquí](/es/part0/informacion_general#calificacion) para obtener más información.

Puede descargar el certificado por completar esta parte haciendo clic en uno de los íconos de bandera. El ícono de la bandera corresponde al idioma del certificado.

</div>

</div>
