---
mainImage: ../../../images/part-12.svg
part: 12
letter: a
lang: es
---

<div class="tasks">

Esta parte fue actualizada el 21 de Marzo de 2024: Create react app reemplazado con Vite en el frontend de todo.

Si comenzaste esta parte antes de la actualización, puedes ver el viejo material [aquí](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/tree/4015af9dddb61cb01f013456d8728e8f553be347/src/content/12). Hay algunos cambios en las configuraciones del frontend.
</div>

<div class="content">

El desarrollo de software incluye un amplio ciclo, desde imaginar el software hasta la programación y el lanzamiento al usuario final, e incluso su mantenimiento. Esta parte será una introducción a los contenedores, una herramienta moderna utilizada en las partes finales del ciclo de desarrollo de software.

Los contenedores encapsulan tu aplicación en un solo paquete. Este paquete incluirá a la aplicación y a todas sus dependencias. Como resultado, cada contenedor puede correr aislado de otros contenedores.

Los contenedores previenen que la aplicación pueda acceder a los archivos y recursos del dispositivo. Los desarrolladores pueden establecer permisos a las aplicaciones para que accedan a los archivos y también especificar recursos disponibles. Más precisamente, los contenedores son virtualizaciones a nivel de Sistema Operativo ( OS-level virtualization ). La comparación más cercana es con una máquina virtual (VM). VMs son utilizadas para ejecutar múltiples sistemas operativos en una misma máquina física. Ellas tienen que ejecutar todo el sistema operativo, mientras que los contenedores ejecutan el software utilizando el sistema operativo del host. La diferencia resultante entre las máquinas virtuales y los contenedores es que se consumen menos recursos cuando se ejecutan contenedores; solo necesitan ejecutar un solo proceso.

Como los contenedores son relativamente ligeros, al menos comparados con las máquinas virtuales, estos pueden escalar rápidamente. Y como aíslan el software que ejecutan dentro, permiten que el software se ejecute de manera idéntica en cualquier ambiente. Por ello, son la opción preferida en cualquier entorno basado en la nube o aplicación con más de un puñado de usuarios.

Servicios como AWS, Google Cloud y Microsoft Azure soportan contenedores en diferentes formas. Estos incluyen a AWS Fargate y Google Cloud Run, ambos permiten ejecutar los contenedores sin servidor (serverless) - donde el contenedor de la aplicación ni siquiera necesita estar ejecutándose si no es utilizado. También puedes instalar un entorno de ejecución de contenedores en la mayoría de los ordenadores y ejecutarlos tú mismo- incluyendo tu propia máquina.

Por lo que los contenedores son utilizados en ambientes en la nube e incluso durante el desarrollo. Cuáles son los beneficios de utilizar contenedores? He aquí dos escenarios comunes:

<i>Escenario 1: Estás desarrollando una aplicación nueva que necesita ejecutarse en la misma máquina que una aplicación antigua (legacy). Ambas requieren instalar diferentes versiones de Node.</i>

Probablemente puedas utilizar nvm, máquinas virtuales o magia negra para lograr ejecutarlas al mismo tiempo. Sin embargo los contenedores son una excelente solución ya que puedes ejecutar ambas aplicaciones en sus respectivos contenedores. Ellas están aisladas una de otra y no interfieren.

<i>Escenario 2: Tu aplicación se ejecuta en tu ordenador. Necesitas mover la aplicación a un servidor</i>

No es poco común que la aplicación simplemente no se ejecute en el servidor a pesar de estar trabajando bien en tu ordenador. Esto puede ocurrir debido a algunas dependencias faltantes o otras diferencias en los entornos. Aquí los contenedores son una excelente solución ya que puedes ejecutar tu aplicación en el mismo ambiente tanto en tu ordenador como en el servidor. No es perfecto: las diferencias en el hardware pueden provocar incidentes, pero puedes limitar estas diferencias entre los ambientes.

Alguna vez podrás escuchar sobre el problema <i>"Works in my container"</i> (Funciona en mi contenedor). La frase describe la situación en la que la aplicación funciona bien en un contenedor ejecutándose en tu ordenador pero se rompe cuando el contenedor es iniciado en el servidor. Esta frase es una variante del infame problema <i>"Works on my machine"</i> (Funciona en mi maquina), que con frecuencia los contenedores resuelven. La situación es también con mucha certeza, un error de uso.

### Sobre esta parte ###

En esta parte, el foco de nuestra atención no estará en el código JavaScript. En cambio, nos interesa la configuración del entorno en el que se ejecuta el software. Como resultado, es posible que los ejercicios no contengan nada de código, las aplicaciones están disponibles a través de GitHub y sus tareas incluirán configurarlas. Los ejercicios deben enviarse a <i>un solo repositorio de GitHub</i> que incluirá todo el código fuente y las configuraciones que realizes durante esta parte.

Necesitarás conocimientos básicos de Node, Express y React. Solo las partes principales, 1 a 5, deben ser completadas antes de esta parte.

</div>

<div class="tasks">

### Ejercicio 12.1
### <i>Advertencia</i>

Dado que estamos saliendo de nuestra zona de confort como desarrolladores de JavaScript, esta parte puede requerir que tomes un desvío para familiarizarte con shell / línea de comandos/ intérprete de comandos / terminal antes de comenzar.

Si solo has utilizado una interfaz gráfica de usuario y nunca has tocado, por ejemplo, Linux o el terminal en Mac, o si te quedas atascado en los primeros ejercicios, te recomendamos hacer primero la Parte 1 de "Herramientas informáticas para estudios de CS": <https://tkt-lapio.github.io/en/>. Omite la sección "Conexión SSH" y el Ejercicio 11. ¡Esto incluye todo lo que necesitaras para comenzar aquí!

#### Ejercicio 12.1: Usando una computadora (sin la interfaz gráfica de usuario)

Paso 1: Lee el texto debajo del titulo "Advertencia".

Paso 2: Descarga este [repositorio](https://github.com/fullstack-hy2020/part12-containers-applications) y conviértelo en tu repositorio de envío para esta parte del curso.

Paso 3: Ejecuta <i>curl http://helsinki.fi</i> y guarda el resultado en un archivo. Guarda el archivo en tu repositorio con el nombre <i>script-answers/exercise12_1.txt</i>. El directorio <i>script-answers</i> ha sido creado en el paso anterior.

</div>
<div class="content">

### Enviar los ejercicios y recibir los créditos ###

Envía los ejercicios utilizando el [sistema de envío](https://studies.cs.helsinki.fi/stats/) igual que en las partes anteriores. Los ejercicios de esta parte son enviados <i>a su [propia instancia del curso](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>.

Completar esta parte supondrá la obtención de 1 crédito. Ten en cuenta que debes realizar todos los ejercicios para obtener el crédito o el certificado.

Cuando completes los ejercicios y desees obtener los créditos, déjanoslo saber a través del sistema de envío de ejercicios que has completado el curso:

![Enviando los ejercicios para obtener los créditos](../../images/10/23.png)

Puedes descargar el certificado de finalización de esta parte dando click en uno de los íconos de las banderas. Cada bandera corresponde con el idioma del certificado.

### Herramientas del oficio

Las herramientas básicas que necesitaras varían de acuerdo a los sistemas operativos:

* [Terminal WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) en Windows
* Terminal en Mac
* Command Line en Linux

### Instalando todo lo necesario para esta parte

Comenzaremos instalando el software necesario. El paso de instalación será uno de los posibles obstáculos. Como estamos tratando con la virtualización a nivel del sistema operativo, las herramientas requerirán acceso de superusuario en el ordenador. Tendrán acceso al kernel de tu sistema operativo.

Este material está basado en [Docker](https://www.docker.com/), un conjunto de productos que utilizaremos para la contenedorización y la administración de los contenedores. Desafortunadamente si no puedes instalar Docker probablemente no podrás completar esta parte.

Como las instrucciones de instalación dependen de tu sistema operativo, deberás encontrar las instrucciones de instalación correctas en el siguiente enlace. Ten en cuenta que pueden haber múltiples opciones diferentes para tu sistema operativo.

- [Obtén Docker](https://docs.docker.com/get-docker/)

Ahora que esperamos que ese dolor de cabeza haya terminado, asegurémonos de que nuestras versiones coincidan. La tuya puede tener números un poco más altos que esta:

```bash
$ docker -v
Docker version 25.0.3, build 4debf41
```

### Contenedores e imágenes

Hay dos conceptos básicos en esta parte: <i>contenedores</i> e <i>imágenes</i>. Los cuales son fáciles de confundir entre sí:

Un <i>contenedor</i> es una instancia en tiempo de ejecución de una <i>imagen</i>.

Las dos afirmaciones siguientes son verdaderas:

- Las imágenes incluyen todo el código, dependencias e instrucciones sobre cómo ejecutar la aplicación
- Los contenedores empaquetan software en unidades estandarizadas

No es de extrañar que se confundan fácilmente.

Para ayudar con la confusión, casi todos usan la palabra contenedor para describir ambos. Pero en realidad nunca se puede construir un contenedor o descargar uno, ya que los contenedores solo existen durante el tiempo de ejecución. Las imágenes, por otro lado, son archivos **inmutables**. Como resultado de la inmutabilidad, no puedes editar una imagen después de haberla creado. Sin embargo, puedes usar imágenes existentes para crear <i>una nueva imagen</i> agregando nuevas capas encima de las existentes.

Metáfora de la cocina:

* La imagen es un manjar pre-cocinado y congelado.
* El contenedor es el delicioso manjar.

[Docker](https://www.docker.com/) es la tecnología de contenedorización más popular y fue pionera en los estándares que la mayoría de las tecnologías de contenedorización utilizan en la actualidad. En la práctica, Docker es un conjunto de productos que nos ayudan a gestionar imágenes y contenedores. Este conjunto de productos nos permitirá aprovechar todos los beneficios de los contenedores. Por ejemplo, el motor de Docker se encargará de convertir los archivos inmutables llamados imágenes en contenedores.

Para administrar los contenedores Docker, también existe una herramienta llamada [Docker Compose](https://docs.docker.com/compose/) que permite **orquestar** (controlar) varios contenedores al mismo tiempo. En esta parte, utilizaremos Docker Compose para configurar un entorno de desarrollo local complejo. En la versión final del entorno de desarrollo que configuraremos, incluso instalar Node en nuestra máquina ya no sera un requisito.

Hay varios conceptos que necesitamos repasar. ¡Pero los omitiremos por ahora y aprenderemos sobre Docker primero!

Comencemos con el comando <i>docker container run</i> que se usa para ejecutar imágenes dentro de un contenedor. La estructura del comando es la siguiente: _container run <i>IMAGE-NAME</i>_ le indicaremos a Docker que cree un contenedor a partir de una imagen. Una característica particularmente interesante del comando es que puede ejecutar un contenedor incluso si la imagen para ejecutar aún no se ha descargado en nuestro dispositivo.

Ejecutemos el comando

```bash
§ docker container run hello-world
```

Habrá muchos resultados, pero separemoslos en varias secciones, que podemos descifrar juntos. Las líneas están numeradas para que sea más fácil seguir la explicación. Tu output no tendrá los números.

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

Debido a que la imagen <i>hello-world</i> no se encontró en nuestra máquina, el comando primero la descargó de un registro gratuito llamado [Docker Hub](https://hub.docker.com/). Puedes ver la página de Docker Hub de la imagen con tu navegador aquí: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)

La primera parte del mensaje indica que aún no teníamos la imagen "hello-world:latest". Esto revela un poco de detalle sobre las imágenes mismas; los nombres de las imágenes constan de varias partes, como una URL. El nombre de una imagen tiene el siguiente formato:

- _registry/organisation/image:tag_

En este caso, los 3 campos que faltan resuelven por defecto a:
- _index.docker.io/library/hello-world:latest_

La segunda fila muestra el nombre de la organización, "librería" donde obtendrá la imagen. En la URL de Docker Hub, la "librería" se acorta a _.

Las filas 3 y 5 solo muestran el estado. Pero la cuarta fila puede ser interesante: cada imagen tiene un resumen único basado en las <i>capas</i> a partir de las cuales se construye la imagen. En la práctica, cada paso o comando que se usó para construir la imagen crea una capa única. Docker usa el resumen para identificar que una imagen es la misma. Esto se hace cuando intenta extraer la misma imagen nuevamente.

Entonces, el resultado de usar el comando fue extraer y luego generar información sobre la **imagen**. Después de eso, el estado nos dijo que se descargó una nueva versión de hello-world:latest. Puedes intentar extraer la imagen con _docker image pull hello-world_ y ver qué sucede.

El siguiente output fue del propio contenedor. También explica lo que sucedió cuando ejecutamos _docker container run hello-world_.

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker container run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

El output contiene algunas cosas nuevas para que aprendamos. <i>Docker daemon</i> es un servicio en segundo plano que se asegura de que los contenedores se estén ejecutando, y usamos el <i>Docker client</i> para interactuar con el daemon. Ahora hemos interactuado con la primera imagen y hemos creado un contenedor a partir de la imagen. Durante la ejecución de ese contenedor, recibimos el output.

</div>

<div class="tasks">

### Ejercicio 12.2

Algunos de estos ejercicios no requieren que escribas ningún código o configuración en un archivo.
En estos ejercicios, debes usar el comando [script](https://man7.org/linux/man-pages/man1/script.1.html) para registrar los comandos que has usado; pruébalo con _script_ para comenzar a grabar, _echo "hello"_ para generar algún output y _exit_ para detener la grabación. Guarda tus acciones en un archivo llamado "typescript" (que no tiene nada que ver con lenguaje de programación TypeScript, el nombre es solo una coincidencia).

Si _script_ no funciona, puedes simplemente copiar y pegar todos los comandos que utilizaste en un archivo de texto.

#### Ejercicio 12.2: Ejecutando tu segundo contenedor

> Usa _script_ para registrar lo que haces, guarda el archivo en script-answers/exercise12_2.txt

El resultado de hello-world nos dio una tarea ambiciosa que hacer. Haz lo siguiente:

> Paso 1. Ejecuta un contenedor de Ubuntu con el comando proporcionado por hello-world

El paso 1 conectará directamente al contenedor con bash. Tendrás acceso a todos los archivos y herramientas dentro del contenedor. Los siguientes pasos se ejecutan dentro del contenedor:

- Paso 2. Crea el directorio <i>/usr/src/app</i>

- Paso 3. Crea el archivo <i>/usr/src/app/index.js</i>

- Paso 4. Ejecuta <i>exit</i> para salir del contenedor

Google debería poder ayudarte a crear directorios y archivos.

</div>

<div class="content">

### Imagen de Ubuntu

El comando que acabas de usar para ejecutar el contenedor de Ubuntu, _docker container run -it ubuntu bash_, contiene algunas adiciones al hello-world ejecutado anteriormente. Veamos --help para entenderlo mejor. Cortaré parte del output para que podamos centrarnos en las partes relevantes.

```bash
$ docker container run --help

Usage:  docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
Run a command in a new container

Options:
  ...
  -i, --interactive                    Keep STDIN open even if not attached
  -t, --tty                            Allocate a pseudo-TTY
  ...
```

Las dos opciones, o banderas, _-it_ aseguran que podamos interactuar con el contenedor. Después de las opciones, definimos que la imagen a ejecutar es _ubuntu_. Luego tenemos el comando _bash_ que se ejecutará dentro del contenedor cuando lo iniciemos.

Puedes probar otros comandos que la imagen de Ubuntu podría ejecutar. Como ejemplo, prueba _docker container run --rm ubuntu ls_. El comando _ls_ enumerará todos los archivos en el directorio y la bandera _--rm_ eliminará el contenedor después de la ejecución. Normalmente, los contenedores no se eliminan automáticamente.

Continuemos con nuestro primer contenedor de Ubuntu con el archivo **index.js** dentro. El contenedor ha dejado de ejecutarse desde que salimos de él. Podemos enumerar todos los contenedores con _container ls -a_,la _-a_ (o --all) enumerará los contenedores que ya se han cerrado.

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

> <i>Nota del editor: el comando _docker container ls_ también tiene una forma más corta _docker ps_</i>, yo prefiero la que es más corta.

Tenemos dos opciones a la hora de abordar un contenedor. El identificador de la primera columna se puede utilizar para interactuar con el contenedor casi siempre. Además, la mayoría de los comandos aceptan el nombre del contenedor como un método más amigable para trabajar con ellos. El nombre del contenedor se generó automáticamente para ser **"hopeful_clarke"** en mi caso.

El contenedor ya termino de ejecutarse, pero podemos iniciarlo de nuevo con el comando de inicio que aceptará el id o el nombre del contenedor como parámetro: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_.

```bash
$ docker start hopeful_clarke
hopeful_clarke
```

El comando iniciará el mismo contenedor que teníamos anteriormente. Desafortunadamente, olvidamos iniciarlo con la bandera _--interactive_ (que también puede escribirse como _-i_) por lo que no podemos interactuar con él.

El contenedor está realmente en funcionamiento como muestra el comando _container ls -a_, pero simplemente no podemos comunicarnos con el:

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

Ten en cuenta que también podemos ejecutar el comando sin la bandera _-a_ para ver solo los contenedores que se están ejecutando:

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke             
```

Matémoslo con el comando _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ e intentemos nuevamente.

```bash
$ docker kill hopeful_clarke
hopeful_clarke
```

_docker kill_ envía una [señal SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html) al proceso forzándolo a salir, y eso hace que el contenedor se detenga. Podemos verificar su estado con _container ls -a_:

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

Ahora iniciemos el contenedor de nuevo, pero esta vez en modo interactivo:

```bash
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

Editemos el archivo <i>index.js</i> y agreguemos código JavaScript para ejecutar. Solo nos faltan las herramientas para editar el archivo. Nano será un buen editor de texto por ahora. Las instrucciones de instalación se encontraron en el primer resultado de Google. Omitiremos usar sudo ya que ya somos root.

```bash
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

¡Ahora tenemos nano instalado y podemos comenzar a editar archivos!

</div>

<div class="tasks">

### Ejercicio 12.3 - 12.4

#### Ejercicio 12.3: Ubuntu 101

> Utiliza _script_ para registrar lo que haces, guarda el archivo en script-answers/exercise12_3.txt

Edita el archivo _/usr/src/app/index.js_ dentro del contenedor con Nano y agrega la siguiente línea

```js
console.log('Hello World')
```

Si no estás familiarizado con Nano, puedes pedir ayuda en el chat o en Google.

#### Ejercicio 12.4: Ubuntu 102

> Utiliza _script_ para registrar lo que haces, guarda el archivo en script-answers/exercise12_4.txt

Instala Node mientras estás dentro del contenedor y ejecuta el archivo index con _node /usr/src/app/index.js_ en el contenedor.

Las instrucciones para instalar Node a veces son difíciles de encontrar, así que aquí hay algo que puedes copiar y pegar:

```bash
curl -sL https://deb.nodesource.com/setup_20.x | bash
apt install -y nodejs
```

Deberás instalar _curl_ en el contenedor. Se instala de la misma manera que lo hiciste con _nano_.

Después de la instalación, asegúrate de que puedes ejecutar tu código dentro del contenedor con el comando:

```
root@b8548b9faec3:/# node /usr/src/app/index.js
Hello World
```

</div>

<div class="content">

### Otros comandos de Docker

¡Ahora que tenemos Node instalado, podemos ejecutar JavaScript en el contenedor! Vamos a crear una nueva imagen desde el contenedor. El comando

```bash
commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME
```

creará una nueva imagen que incluye los cambios que hemos realizado. Puedes usar _container diff_ para verificar los cambios entre la imagen original y el contenedor antes de hacerlo.

```bash
$ docker commit hopeful_clarke hello-node-world
```

Puedes enumerar tus imágenes con _image ls_:
 
```bash
$ docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
``` 
 
Ahora puedes ejecutar la nueva imagen de la siguiente manera:
 
```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

Hay varias formas de hacer lo mismo. Probemos una mejor solución. Limpiaremos la pizarra con _container rm_ para retirar el contenedor antiguo.

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

Crea un archivo <i>index.js</i> en tu directorio actual y escribe _console.log('Hello, World')_ dentro de él. No hay necesidad de contenedores todavía.

A continuación, nos saltaremos la instalación manual de Node por completo. Hay muchas imágenes útiles de Docker en Docker Hub, listas para nuestro uso. Usemos la imagen [https://hub.docker.com/_/Node](https://hub.docker.com/_/Node), que ya tiene Node instalado. Sólo tenemos que elegir una versión.

Por cierto, el _container run_ acepta el indicador _--name_ que podemos usar para dar un nombre al contenedor.

```bash
$ docker container run -it --name hello-node node:20 bash
```

Vamos a crear un directorio para el código dentro del contenedor:

```
root@77d1023af893:/# mkdir /usr/src/app
```

Mientras estamos dentro del contenedor en este terminal, abre otro terminal y usa el comando _container cp_ para copiar el archivo desde tu propia máquina al contenedor.

```bash
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

Y ahora podemos ejecutar _node /usr/src/app/index.js_ en el contenedor. Podemos guardar esto como otra imagen nueva, pero hay una solución aún mejor. La siguiente sección tratará sobre la construcción de tus imágenes como un profesional.

</div>
