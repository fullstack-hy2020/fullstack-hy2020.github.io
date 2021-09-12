---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: zh
---

<div class="content">

### React
React

<!-- Let's create and containerize a react application next. I'll choose npm as the package manager even though create-react-app defaults to yarn. -->
接下来让我们容器化一个react 应用。我会选择npm 作为包管理器，虽然 create-react-app 默认是使用yarn的。

```
$ npx create-react-app hello-front --use-npm
  ...

  Happy hacking!
```

<!-- The create-react-app already installed all dependencies for us, so we did not need to run npm install here. -->
create-react-app 已经为我们安装好了所有依赖，所以我们没有必要运行 npm install了。

<!-- The next step is to turn the code, js and modules, into production-ready static files. Create-react-app already has build as an npm script so let's use that: -->
下一步将代码、js 和模块转移到生产就绪的静态文件。 Create-react-app 有npm 的build 命令，所以我们执行：

```
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

<!-- Great! Final step is figuring a way to use a server to serve the static files. As you may know we could use our [express.static](https://expressjs.com/en/starter/static-files.html) with the express server to serve static files. I'll leave that as an exercise, instead we are going to go ahead and start writing our Dockerfile. -->

非常好！最后一步是用一种方法来用服务器提供这些静态文件。你可能知道我们可以使用  [express.static](https://expressjs.com/en/starter/static-files.html) 利用express 服务器来做。这个留作一个练习，我们先继续编写我们的Docker file。

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

<!-- That looks about right, let's build it and see if we are on the right track, our goal is to have the build succeed without errors. Then we will use bash to check inside of the container to see if the files are there. -->
看起来不错，我们先构建一下确认我们还在正确的轨道上，我们的目标是构建成功，没有失败。然后我们会使用bash 来内部检查一下容器来看看文件是否存在。

```
$ docker build . -t hello-front
  [+] Building 172.4s (10/10) FINISHED 

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
  Dockerfile  README.md  build  node_modules  package-lock.json  package.json  public  src

root@98fa9483ee85:/usr/src/app# ls build/
  asset-manifest.json  favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt  static
```

<!-- A valid option for serving static files now that we already have node in the container is [serve](https://www.npmjs.com/package/serve). Let's try installing serve and serving the static files while we are inside the container. -->
一个用来服务静态文件的可行方案已经存在与容器的node 中，那就是[serve](https://www.npmjs.com/package/serve) 。让我们安装serve 并提供静态文件服务。

```
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

<!-- Great! Let's ctrl+c and exit out and then add those to our Dockerfile. -->

很好！让我们  ctrl+c 退出并添加些内容到Dockerfile

```
  ^C
  INFO: Gracefully shutting down. Please wait...

root@98fa9483ee85:/usr/src/app# exit
  exit
```
<!-- The installation of serve turns into a RUN so that the dependency is installed during the build process. And the command to serve build directory will be the command to start the software with. -->

安装服务器变成了RUN状态，因此依赖在构建时已经安装完成。并且服务器构建的命令是在构建文件夹中启动的。


`Dockerfile`

```Dockerfile
...
RUN npm install -g serve

CMD ["serve", "build"]
```

<!-- And then build _docker build -t hello-front ._ and run it _docker run -p 5000:5000 hello-front_. The app will then be available in http://localhost:5000. -->
然后构建 _docker build -t hello-front ._  。 并运行_docker run -p 5000:5000 hello-front_ 。应用会在浏览器中 http://localhost:5000 看到 。

### Using multiple stages
使用多步骤

<!-- While serve is a <i>valid</i> option we can do better. With containers a good goal is to create the containers so that they do not contain anything irrelevant so that they have a small number of dependencies and are less likely to break or become vulnerable over time.   -->
虽然serve 是一个 <i>可行的</i> 选项，但我们能进一步优化。容器中一个重要的目标就是创建的容器不包含任何不相关的内容，因此就会有较小的依赖，并且不容易被破坏，也不会随着时间流逝而变得脆弱。

<!-- Multi-stage builds are designed for splitting the build process into multiple stages. Conventional options for stages are build stage and test stage.The main goal for using stages is to limit the size of the image. Smaller images are faster to upload and download and they help reduce the number of vulnerabilities your software may have.
 -->

多阶段构建是设计于将构建流程切分成多个步骤。常见的阶段拆分是构建阶段和测试阶段。使用阶段构建的主要目标是限制镜像的大小。较小的镜像会更快地上传和下载，而且能减少你软件的脆弱性。

With multi-stage builds a tried and true solution like [nginx](https://en.wikipedia.org/wiki/Nginx), can be used to serve static files without a lot of headache. The docker hub [page for nginx](https://hub.docker.com/_/nginx) tells us the required info to open the ports and "Hosting some simple static content".

利用多阶段构建，像 [nginx](https://en.wikipedia.org/wiki/Nginx) 这样久经考验的真正解决方案可以用于服务静态文件，免除了许多头疼的问题。 docker hub [page for nginx](https://hub.docker.com/_/nginx)  告诉我们打开端口并“托管一些简单镜头内容”所需要的信息。


<!-- Let's use the previous Dockerfile but change the FROM to include the name of the stage: -->
让我们使用之前的Dockerfile，并将FROM 改写来引入阶段名称。

`Dockerfile`

```Dockerfile
# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

```

<!-- Now we have declared the build stage and only move the relevant files, the build directory with static content, into an image that is ready to serve the static content. -->
现在我们已经声明了构建阶段，并且只将相关文件（包含静态内容的构建目录）移动到准备为静态内容提供服务的镜像中。

<!-- The default port will be 80 for nginx, so something like _-p 8000:80_ will work. -->
nginx 的默认端口是 80，所以像 _-p 8000:80_ 这样的操作会起作用。

<!-- Multi-stage builds also include some internal optimizations that may affect your builds. As an example, multi-stage builds skip stages that are not used. If we wish to use a stage to replace a part of a build pipeline, like testing or notifications, we must pass **some** data to the following stages. In some cases this is justified: copy the code from testing stage to build stage ensuring that you are building the tested code. -->
多阶段构建还包括一些可能会影响您构建的内部优化。 例如，多阶段构建跳过未使用的阶段。 如果我们希望使用一个阶段来替换构建管道的一部分，例如测试或通知，我们必须将 **some** 数据传递给下面的阶段。 在某些情况下，这是合理的：将代码从测试阶段复制到构建阶段，确保您正在构建经过测试的代码。

</div>

<div class="tasks">

### Exercises 12.12 - 12.13.
练习12.12 -12.13.

#### Exercise 12.12: Todo application frontend
练习12.12 Todo 应用前端

> In this exercise, submit <i>at least</i> the Dockerfile you created.
本练习中，至少提交你创建的Dockerfile。

<!-- The following repository contains an react application in the react-app directory. 

<https://github.com/fullstack-hy2020/part12-containers-applications/tree/main/react-app>

Copy the contents into your own repository. The react-app directory includes a README on how to start the application. -->


以下仓库在 react-app 目录中包含一个 react 应用程序。 

<https://github.com/fullstack-hy2020/part12-containers-applications/tree/main/react-app>

将内容复制到您自己的存储库中。 react-app 目录包含一个关于如何启动应用程序的README。  

<!-- Containerize the application and use [ENV](https://docs.docker.com/engine/reference/builder/#env) instruction to pass *REACT\_APP\_BACKEND\_URL* to the application and run it with the backend. Backend can be running outside a container. -->
容器化应用，使用 [ENV](https://docs.docker.com/engine/reference/builder/#env) 指导，将 *REACT\_APP\_BACKEND\_URL* 传递给应用程序并与后端一起运行。 后端可以在容器外运行。

#### Exercise 12.13: Testing during build process
练习 12.13：构建过程中的测试
> In this exercise, submit the entire React application, with the Dockerfile.
在本练习中，提交整个React应用，附带上Dockerfile
<!-- We can use multiple stages to do testing during the build process. The build process will fail as the tests fail. -->
我们可以在构建过程中使用多阶段进行测试。 由于测试失败，构建过程将失败。

<!-- Extract a component `Todo` that represents a single todo. Write a test for the new component add run it the build process. You can add a new stage for the test if you wish to do so. -->
提取代表单个待办事项的组件`Todo`。 为新组件编写测试并在构建过程中运行它。 如果愿意，可以为测试添加一个新阶段。

</div>

<div class="content">

### Developing in containers
在容器中开发

<!-- Let's move the todo application development to a container. There are a few reasons why you would want to do that:

1. To keep the environment similar between development and production to avoid bugs that appear only in production environment
2. To avoid differences between developers and their own environments that lead difficulties in application development
3. To help new team members hop in by having them only be required to install container runtime -->

让我们将 todo 应用程序开发移到容器中。 之所以要这样做，有几个原因：

1. 保持开发和生产环境相似，避免只出现在生产环境中的bug
2. 避免开发者与自身环境差异导致应用开发困难
3. 帮助新团队成员加入，让他们只需要安装容器运行时

<!-- These are great reasons. The tradeoff is that we may encounter some unconventional behavior when we aren't running the applications like we are used to. We will need to do at least two things to move the application to a container:

1. Start the application in development mode
2. Access the files with vscode -->

这些是主要原因。作为代价是我们由于不再像之前那样工作，因此会带来些不习惯的地方。我们至少需要做两件事才能将应用程序移动到容器中：

1. 以开发模式启动应用程序
2. 使用vscode访问文件

<!-- And let's start with the frontend. Since the Dockerfile will be significantly different to the production Dockerfile let's create a new one called `dev.Dockerfile`. -->
让我们从前端开始。 由于 Dockerfile 与生产 Dockerfile 有很大不同，让我们创建一个名为`dev.Dockerfile` 的新文件。

<!-- Starting the create-react-app in development mode should be easy, lets start with the following: -->
在开发模式下启动 create-react-app 应该很容易，让我们从以下开始：

`dev.Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm start is the command to start the application in development mode
CMD ["npm", "start"]
```
 
During build the flag _-f_ will be used to tell which file to use, it would otherwise default to Dockerfile, so _docker build -f ./dev.Dockerfile -t hello-front-dev ._ will build the image. The create-react-app will be served in port 3000, so you can test that it works by running a container with that port published.

构建阶段，标志 `-f` 将用于告诉使用哪个文件，否则默认为 Dockerfile：_docker build -f ./dev.Dockerfile -t hello-front-dev ._ 会构建镜像。 create-react-app 将在端口 3000 中提供服务，因此您可以在容器启动后测试端口是否被发布。

  
The second task, accessing the files with vscode, is not done yet. There are at least two ways of doing this: 
  1. [The Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers) 
  2. Volumes, the same thing we used to preserve data with the database

第二个任务，使用 vscode 访问文件，还没有完成。 至少有两种方法可以做到这一点：

1. 【Visual Studio Code Remote - Containers 扩展】(https://code.visualstudio.com/docs/remote/containers)
2. 卷，和我们用来保存数据库数据的东西一样
   
Let's go over the latter since that will work with other editors as well. Let's do a trial run with the flag _-v_ and if that works then we will move the configuration to a docker-compose file. To use the _-v_ we will need to tell it the current directory. The command _pwd_ should output the path to the current directory for you. Try this with _echo $(pwd)_ in your command line. We can use that as the left side for _-v_ to map current directory to the inside of the container or you can use the full directory path.

让我们来看看后者，因为大家还可能使用别的编辑器。 让我们使用标志 _-v_ 进行试运行，如果可行，那么我们将把配置移到 docker-compose 文件中。 要使用 _-v_，我们需要告诉它当前目录。 _pwd_ 命令能打印出当前文件夹的路径，请尝试使用 _echo $(pwd)_。 我们可以使用它作为 _-v_ 参数的左侧将当前目录映射到容器内部，或者你可以使用文件夹的全路径。

```
$ docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev

  Compiled successfully!

  You can now view hello-front in the browser.
```

Now we can simply edit the src/App.js and the changes should be hot-loaded to the browser.
现在我们可以简单编辑 src/App.js ，内容会热加载到浏览器中。

Next let's move that config to a docker-compose.yml. That file should be at the root of the project as well.
下面我们将配置迁移到 docker-compose.yml 。 该文件应该会在项目的根目录

`docker-compose.yml`

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

With this _docker-compose up_ can run the application in development mode. You don't even need node installed to develop it!
此时我们运行 _docker-compose up_ ，会启动一个应用，处于开发模式。你不用安装node 来开发了。

Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency **inside** the container. So instead of doing e.g. _npm install axios_, you have to do it in the running container e.g. _docker exec hello-front-dev npm install axios_. Or add it to the package.json and run _docker build_ again.

安装新的依赖对开发来说是一件头疼的事情。一个好的实践是将其安装到容器 **内部**。 因此不必  _npm install axios_ ，你只需在容器中运行 _docker exec hello-front-dev npm install axios_ ，或者将其放到 package.json  文件并再次运行 _docker build_。

### Communication between containers in a docker network
容器和docker 网络进行通信

The docker-compose tool sets up a network between the containers and includes a DNS to easily connect two containers to one another. Let's add a new service to the docker-compose and we can see how the network and DNS work.

docker-compose 工具建立起一个网络，连通容器和一个DNS 来简单地连接两个容器到其他容器。让我们添加一个服务到docker-compose 我们可以看到网络和DNS如何工作。

<i>Busybox</i> is a small executable with multiple tools you may need. It is called "The Swiss Army Knife of Embedded Linux" and we definitely can use it to our advantage.

<i>Busybox</i> 是一个小型、可运行、多工具的镜像。被称为“嵌入Linux 的瑞士军刀”，我们可以使用它，利用其优势。

It can be used to debug our configurations. So if you get lost in the later exercises of this section you should use BusyBox to find out what works and what doesn't. Let's use it to explore what I just said. That containers are inside a network and you can easily connect between them.

可以用来debug 我们的配置。因此如果在后续的练习中卡住了，你可以使用BusyBox 来找到哪里工作哪里不工作了。让我们使用它来探索我们刚说到的内容，该容器存在于一个网络中，你可以方便地连接。


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
    
  debug-helper:
    image: busybox
```

The busybox won't have any process running inside so that we could exec in there. Because of that the output of _docker-compose up_ will also look like this:

busybox 不会有任何进程在运行，所以我们可以在那里执行。也由于此，_docker-compose up_ 的输出会类似如下内容

```
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

This is completely expected as it's just a toolbox. Let's use it to send a request to hello-front-dev and see how the DNS works. While the hello-front-dev is running I'll use [wget](https://en.wikipedia.org/wiki/Wget) since it's simple and included in busybox to send a request from the debug-helper to hello-front-dev.

这完全验证了我们的想法，它仅是一个工具箱。让我们用它来发送一个请求到hello-front-dev 并看DNS如何工作。由于hello-front-dev 在运行我们可以使用 [wget](https://en.wikipedia.org/wiki/Wget) 。因为它很简单并在busybox 中预装了，从debug-helper 到 hello-front-dev 发送一个请求

<!-- Wget requires the flag _-O_ with _-_ will output the response to the stdout. And then we'll just add the url: _wget -O - URL_. With docker-compose we can use _docker-compose run SERVICE COMMAND_ to run a service with a specific command. -->

Wget 需要一个参数  _-O_  和  _-_ 会打印出响应的输出。下面我们只需要添加url：_wget -O - URL_ 利用docker-compose 我们可以使用 _docker-compose run SERVICE COMMAND_ 来运行一个特定的服务。

```
$ docker-compose run debug-helper wget -O - http://hello-front-dev:3000

  Creating react-app_debug-helper_run ... done
  Connecting to hello-front-dev:3000 (172.26.0.2:3000)
  writing to stdout
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      ...
```

The URL is really the interesting part here. We simply said to connect to the other service and to that port. The port does not need to be published for other services in the same network to be able to connect to it. The "ports" in docker-compose.yml is only for external access.

该URL 是很有趣的一部分。我们简单地说连接到另一个服务的某个端口。该端口不必暴露给网络中的其他服务。该“端口”存在于 docker-compose。 yml 仅仅是为了外部访问

Let's do a few alterations to the docker-compose to emphasize this:
让我们对docker-compose 做一些修改来验证这一点：

`docker-compose.yml`

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
      - 3210:3000
    container_name: hello-front-dev

  debug-helper:
    image: busybox
```


<!-- With _docker-compose up_ the application is available in <http://localhost:3210>. But still _docker-compose run debug-helper wget -O - http://hello-front-dev:3000_ works. -->

有了这个 _docker-compose up_  应用可以在 <http://localhost:3210> 访问。 同样，_docker-compose run debug-helper wget -O - http://hello-front-dev:3000_ 也就好使了。

![](../../images/12/busybox_networking_drawio.png)

As above image illustrates the _docker-compose run_ asks debug-helper to send the request within the network. While the browser would send the request from outside of the network.

如上图所示， _docker-compose run_ 会询问debug-helper 使用网络发送请求。浏览器会在网络外发送请求。 

<!-- Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency **inside** the container. So instead of doing e.g. `npm install axios`, you have to do it in the running container e.g. `docker exec hello-front-dev npm install axios`. Or add it to the package.json and run `docker build` again. -->
对于像这样的开发设置，安装新的依赖项是一件令人头疼的事情。 更好的选择之一是在容器中安装新的 **内置** 依赖项。 所以，而不是做例如 `npm install axios`，你必须在正在运行的容器中进行，例如 `docker exec hello-front-dev npm install axios`。 或者将其添加到 package.json 并再次运行 `docker build`。

Now that you know how easy it is to find other services in a docker-compose.yml and we have nothing to debug we can remove the debug-helper and revert the ports to 3000:3000 in our _docker-compose.yml_.
现在你就了解了在  docker-compose.yml 中找到其他服务是多么简单，如果没有什么需要debug， 我们可以在 _docker-compose.yml_ 移除debug-helper 并回滚端口配置 3000:3000

#### Communications between containers in a more ambitious environment
容器与更复杂的环境进行通信

The docker-compose tool sets up a network between the containers and includes a DNS to easily connect two containers to one another. Let's add a new service to the docker-compose and we can see how the network and DNS work.
docker-compose 工具在容器之间建立了一个网络，并包含一个 DNS 来轻松地将两个容器相互连接起来。 让我们向 docker-compose 添加一个新服务，我们可以看到网络和 DNS 是如何工作的。

Next we will add a reverse proxy to our docker-compose. A reverse proxy will be the single point of entry to our application and we can hide multiple servers behind it. The final goal will be to set both the react application and the express application behind the reverse proxy. There are multiple different options, here are some examples ordered by initial release from newer to older: Traefik, Caddy, Nginx and Apache.
接下来我们将向我们的 docker-compose 添加一个反向代理。 反向代理将成为我们应用程序的单一入口点，我们可以在其后面隐藏多个服务器。 最终目标是在反向代理之后设置 react 应用程序和 express 应用程序。 有多种不同的选项，以下是一些示例，按初始版本从新到旧排序：Traefik、Caddy、Nginx 和 Apache。

Let's pick Nginx, the docker hub page is [here](https://hub.docker.com/_/nginx). Create a file nginx.conf in the project root and take this template for a configuration. We will need to do minor edits to have our application running:
我们选择Nginx，docker hub页面在[这里](https://hub.docker.com/_/nginx)。 在项目根目录中创建一个文件 nginx.conf 并以此模板进行配置。 我们需要做一些小的编辑才能让我们的应用程序运行：

`nginx.conf`

```conf
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

And next add Nginx to the docker-compose file. Add a volume as instructed in the docker hub page where the right side is `:/etc/nginx/nginx.conf:ro`, the final ro declares that the volume will be _read-only_.

然后将 Nginx 添加到 docker-compose 文件中。 按照 docker hub 页面中的指示添加一个卷，其中右侧是`:/etc/nginx/nginx.conf:ro`，最后的 ro 声明该卷将为 _read-only_。

`docker-compose.yml`

```yml
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
```

with that added we can run docker-compose up and see what happens.
添加后，我们可以运行 docker-compose up 并查看会发生什么。

```
$ docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                       NAMES
a02ae58f3e8d   nginx:1.20.1      "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp       reverse-proxy
5ee0284566b4   hello-front-dev   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   hello-front-dev
```

Connecting to http://localhost:8080 will lead to a familiar looking page with 502 status. 
连接到 http://localhost:8080 将导致一个具有 502 状态的熟悉页面。

This is because directing requests to http://localhost:3000 leads to nowhere as the nginx container does not have any application running in port 3000. By definition localhost refers to the current computer used to access it. With containers localhost is unique for each container, leading to the container itself.
这是因为将请求定向到 http://localhost:3000 导致无处可去，因为 nginx 容器没有在端口 3000 中运行任何应用程序。根据定义，localhost 是指用于访问它的当前计算机。 对于容器，每个容器的 localhost 都是唯一的，从而导致容器本身。

Let's test this by going inside the nginx container and using curl to send a request to the application itself. In our usage curl is similar to wget, but won't need any flags.
让我们通过进入 nginx 容器并使用 curl 向应用程序本身发送请求来测试, 我们使用curl ，它类似wget，不过不需要任何参数：

```
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:/# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

To help us docker-compose set up a network when we ran docker-compose up and had all of the containers join the network. A DNS makes sure we can find the other container. The containers are each given two names: the service name and the container name.
当我们运行 docker-compose up 并让所有容器加入网络时，帮助我们 docker-compose 设置网络。 DNS 确保我们可以找到另一个容器。 每个容器都有两个名称：服务名称和容器名称。

Since we are inside the container now we can also test the DNS! Let's curl the service name (app) in port 3000
由于我们现在在容器内，我们还可以测试 DNS！ 让我们在 3000 端口curl服务名称（app）

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

That is it! Let's replace the proxy_pass address in nginx.conf with that one.

If you are still encountering 503, make sure that the create-react-app has been built first. You can read the logs output from the docker-compose up.

就是这样！ 让我们用那个替换 nginx.conf 中的 proxy_pass 地址。

如果还是遇到503，先确定create-react-app是否已经建好了。你可以检查一下 docker-compose up 的输出日志。

</div>

<div class="tasks">

### Exercises 12.14. - 12.16.
练习 12.14。 - 12.16

#### Exercise 12.14: Setup nginx in front of todo-front
练习 12.14：在 todo-front 前面设置 nginx

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.
本练习中，提交整个express应用，并提交Dockerfile 和 docker-compose.yml

Create a development docker-compose yml with nginx and our todo react-app.
使用 nginx 和我们的 todo react-app 创建一个开发 docker-compose yml文件。

You can use _-f_ flag to specify a file in case you want to have multiple, e.g. _docker-compose -f docker-compose.dev.yml up_
如果您想要多个文件，您可以使用 _-f_ 标志来指定一个文件，例如 _docker-compose -f docker-compose.dev.yml up_

#### Exercise 12.15: Setup nginx in front of todo-back
练习 12.15：在 todo-back 前面设置 nginx

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.
本练习中，提交整个express应用，并提交Dockerfile 和 docker-compose.yml

Add the express-app to the development docker-compose yml in development mode.
在开发模式下将 express-app 添加到开发 docker-compose yml 中。

Add a new location to the nginx.conf so that requests to /api are proxied to the backend. Something like this should do the trick:
向 nginx.conf 添加一个新位置，以便将 /api 的请求代理到后端。 像这样应该可以解决问题：

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

    # Requests starting with /api are handled
    location /api {
      ...
    }
  }
```

The *proxy\_pass* directive has an interesting feature with a trailing slash. As we are using the path _/api_ for location but the backend application only answers in paths _/_ or _/todos_ we will want the _/api_ to be removed from the request. In other words even though the browser will send a GET request to _/api/todos/1_ we want the nginx to proxy the request to _/todos/1_. This is done by adding a trailing slash _/_ to the url at the end of *proxy\_pass*.

*proxy\_pass* 指令有一个有趣的特性，带有尾部斜杠。 由于我们使用路径 _/api_ 作为位置，但后端应用程序仅在路径 _/_ 或 _/todos_ 中响应，我们希望从请求中删除 _/api_。 换句话说，即使浏览器将向 _/api/todos/1_ 发送 GET 请求，我们也希望 nginx 将请求代理到 _/todos/1_。 这是通过在 *proxy\_pass* 末尾添加一个斜杠 _/_ 到 url 来完成的。

This is a [common issue](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

又一个 [常见问题](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![](../../images/12/nginx_trailing_slash_stackoverflow.png)


#### Exercise 12.16: Connect todo-front to todo-back
将 todo-front 连接到 todo-back

Make sure that the todo-front works with todo-back. It will require changes to the *REACT\_APP\_BACKEND\_URL* environmental variable.
确保 todo-front 与 todo-back 一起工作。 它将需要更改 *REACT\_APP\_BACKEND\_URL* 环境变量。

If you already got this working during a previous exercise you may skip this.
如果您在之前的练习中已经完成了这项工作，则可以跳过此部分。

</div>

<div class="content">

### Tools for Production
生产工具

Containers are fun tools to use in development, but the best use case for them is in the production environment. There are a number of more powerful tools than docker-compose to run containers in production.
容器是在开发中使用的有趣工具，但它们的最佳用例是在生产环境中。 有许多比 docker-compose 更强大的工具可以在生产中运行容器。

Tools like Kubernetes allow us to manage containers on a completely new level. It basically hides away the physical machines and allows us developers to worry less about the infrastructure.
像 Kubernetes 这样的工具使我们能够在一个全新的层面上管理容器。 它基本上隐藏了物理机器，让我们的开发人员不必担心基础设施。

If you are interested in learning more in depth about containers come to the [DevOps with Docker](https://devopswithdocker.com) course and you can find more about Kubernetes in the advanced 5 credit [DevOps with Kubernetes](https://devopswithkubernetes.com) course. You should now have the skills to complete both of them.
如果您有兴趣更深入地了解容器，请访问 [DevOps with Docker](https://devopswithdocker.com) 课程，您可以在 [DevOps with Kubernetes](https://devopswithkubernetes.com) 获得5个学分。 您现在应该具备完成这两项任务的技能。

</div>

<div class="tasks">

### Exercises 12.17.

#### Exercise 12.17:

<!-- Create a production docker-compose.yml with all of the services, nginx, react-app, express-app, mongodb and redis. -->
创建一个包含所有服务、nginx、react-app、express-app、mongodb 和 redis 的生产 docker-compose.yml。

<!-- This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats). -->
这是本节的最后一个练习。 是时候将您的代码推送到 GitHub 并将您完成的所有练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats)。

</div>
