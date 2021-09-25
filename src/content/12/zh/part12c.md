---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: zh
---

<div class="content">

### React in container
React 的容器化

<!-- Let's create and containerize a React application next. Let us choose npm as the package manager even though create-react-app defaults to yarn. -->
接下来让我们容器化一个 React 应用。我们选择npm 作为包管理器，虽然 create-react-app 默认是使用yarn的。

```
$ npx create-react-app hello-front --use-npm
  ...

  Happy hacking!
```

<!-- The create-react-app already installed all dependencies for us, so we did not need to run npm install here. -->
create-react-app 已经为我们安装好了所有依赖，所以我们没有必要运行 npm install了。

<!-- The next step is to turn the JavaScript code and CSS, into production-ready static files. The create-react-app already has _build_ as an npm script so let's use that: -->
下一步将 JavaScript 和CSS 转移到生产就绪的静态文件。 create-react-app 自带了 npm _build_  命令，所以我们执行：

```
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

<!-- Great! The final step is figuring a way to use a server to serve the static files. As you may know, we could use our [express.static](https://expressjs.com/en/starter/static-files.html) with the express server to serve the static files. I'll leave that as an exercise for you to do at home. Instead, we are going to go ahead and start writing our Dockerfile: -->

非常好！最后一步是用一种方法来用服务器提供这些静态文件。你可能知道我们可以使用  [express.static](https://expressjs.com/en/starter/static-files.html) 利用express 服务器来做。这个留作回家的一个练习，我们先继续编写我们的Dockerfile。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

<!-- That looks about right. Let's build it and see if we are on the right track. Our goal is to have the build succeed without errors. Then we will use bash to check inside of the container to see if the files are there. -->
看起来不错，我们先构建一下确认我们还在正确的轨道上，我们的目标是构建成功，没有失败。然后我们会使用bash 来内部检查一下容器来看看文件是否存在。

```bash
$ docker build . -t hello-front
  [+] Building 172.4s (10/10) FINISHED 

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
  Dockerfile  README.md  build  node_modules  package-lock.json  package.json  public  src

root@98fa9483ee85:/usr/src/app# ls build/
  asset-manifest.json  favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt  static
```

<!-- A valid option for serving static files now that we already have Node in the container is [serve](https://www.npmjs.com/package/serve). Let's try installing serve and serving the static files while we are inside the container. -->
一个用来服务静态文件的可行方案已经存在与容器的 Node 中，那就是[serve](https://www.npmjs.com/package/serve) 。让我们安装serve 并提供静态文件服务。

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

<!-- Great! Let's ctrl+c and exit out and then add those to our Dockerfile. -->

很好！让我们  ctrl+c 退出并添加些内容到Dockerfile

<!-- The installation of serve turns into a RUN in the Dockerfile. This way the dependency is installed during the build process. The command to serve build directory will become the command to start the container: -->
serve 的安装在Dockerfile 中变成了RUN指令，这种方法使得依赖的安装是在构建环节发生的。serve 的build 命令变成了容器的启动命令：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve # highlight-line

CMD ["serve", "build"] # highlight-line
```

<!-- Our CMD now includes square brackets and as a result we now used the so called <i>exec form</i> of CMD. There are actually **three** different forms for the CMD out of which the exec form is preferred. Read the [documentation](https://docs.docker.com/engine/reference/builder/#cmd) for more info. -->

我们的CMD 现在用中括号，结果是我们使用了所谓的CMD中的<i>执行表单exec form</i> 。实际上有 **三种** 不同的CMD表单，执行表单是常用的，阅读 [documentation](https://docs.docker.com/engine/reference/builder/#cmd) 获取更多信息。

<!-- When we now build the image with _docker build -t hello-front_ and run it with _docker run -p 5000:5000 hello-front_, the app will be available in http://localhost:5000.
 -->
我们构建镜像时运行 _docker build -t hello-front ._ ， 并运行_docker run -p 5000:5000 hello-front_ 。应用会在浏览器中 http://localhost:5000 看到 。

### Using multiple stages
使用多阶段构建

<!-- While serve is a <i>valid</i> option we can do better. A good goal is to create Docker images so that they do not contain anything irrelevant. With a minimal number of dependencies, images are less likely to break or become vulnerable over time.    -->
虽然serve 是一个 <i>可行的</i> 选项，但我们能进一步优化。容器中一个重要的目标就是创建的镜像不包含任何不相关的内容。镜像有较小的依赖，就不容易被破坏，也不会随着时间流逝而变得脆弱。

<!-- [Multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) are designed for splitting the build process into many separate stages, where it is possible to limit what parts of the image files are moved between the stages. That opens possibilities for limiting the size of the image since not all by-products of the build are necessary for the resulting image. Smaller images are faster to upload and download and they help reduce the number of vulnerabilities your software may have.
 -->

多阶段构建 [Multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)是设计于将构建流程切分成多个不同的阶段，从而限制镜像文件在不同阶段传递。这就使得限制镜像的大小变得可能，因为并不是结果镜像需要所有生产流水线中的所有构建。较小的镜像会更快地上传和下载，而且能减少你软件的脆弱性。


<!-- With multi-stage builds, a tried and true solution like [nginx](https://en.wikipedia.org/wiki/Nginx) can be used to serve static files without a lot of headaches. The Docker Hub [page for nginx](https://hub.docker.com/_/nginx) tells us the required info to open the ports and "Hosting some simple static content". -->

利用多阶段构建，像 [nginx](https://en.wikipedia.org/wiki/Nginx) 这样久经考验的真正解决方案可以用于服务静态文件，免除了许多头疼的问题。 Docker Hub [page for nginx](https://hub.docker.com/_/nginx)  告诉我们打开端口并“托管一些简单镜头内容”所需要的信息。


<!-- Let's use the previous Dockerfile but change the FROM to include the name of the stage: -->
让我们使用之前的Dockerfile，并将FROM 改写来引入阶段名称。

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

<!-- We have declared also <i>another stage</i> where only the relevant files of the first stage (the <i>build</i> directory, that contains the static content) are moved. -->
我们已经声明了<i>另一个阶段</i>，并且只将第一阶段中相关文件（包含静态内容的<i>build</i>目录）移动了。

<!-- After we build it again, the image is ready to serve the static content. The default port will be 80 for Nginx, so something like _-p 8000:80_ will work, so the parameters of the run command need to be changed a bit.-->
在build之后，该镜像已经可以服务静态内容了。Nginx 的默认端口是 80，所以像 _-p 8000:80_ 这样的操作会起作用，所以运行的参数会在后续进行调整

<!-- Multi-stage builds also include some internal optimizations that may affect your builds. As an example, multi-stage builds skip stages that are not used. If we wish to use a stage to replace a part of a build pipeline, like testing or notifications, we must pass **some** data to the following stages. In some cases this is justified: copy the code from the testing stage to the build stage. This ensures that you are building the tested code. -->
多阶段构建还包括一些可能会影响您构建的内部优化。 例如，多阶段构建跳过未使用的阶段。 如果我们希望使用一个阶段来替换构建管道的一部分，例如测试或通知，我们必须将 **some** 数据传递给下面的阶段。 在某些情况下，这是合理的：将代码从测试阶段复制到构建阶段，确保您正在构建经过测试的代码。

</div>

<div class="tasks">

### Exercises 12.13 - 12.14.
练习12.13 -12.14.

#### Exercise 12.13: Todo application frontend
练习12.13 Todo 应用前端

<!-- Finally, we get to the todo-frontend. View the todo-app/todo-frontend and read through the README. -->
终于，我们要开始处理 todo 的前端了。查看 todo-app/todo-frontend 并通读README。

<!-- Start by running the frontend outside the container and ensure that it works with the backend. -->
在容器外运行前端，确保它于后端是能工作的。

<!-- Containerize the application by creating <i>todo-app/todo-frontend/Dockerfile</i> and use [ENV](https://docs.docker.com/engine/reference/builder/#env) instruction to pass *REACT\_APP\_BACKEND\_URL* to the application and run it with the backend. The backend should still be running outside a container. -->
创建 <i>todo-app/todo-frontend/Dockerfile</i>  来容器化应用，并使用 [ENV](https://docs.docker.com/engine/reference/builder/#env) 指令来传递 *REACT\_APP\_BACKEND\_URL* 给应用，与后端进行运行。后端仍然应该在容器外部运行。

#### Exercise 12.14: Testing during the build process
练习12.14 在构建过程中测试

<!-- One interesting possibility to utilize multi-stage builds is to use a separate build stage for [testing](https://docs.docker.com/language/nodejs/run-tests/). If the testing stage fails, the whole build process will also fail. Note that it may not be the best idea to move <i>all testing</i> to be done during the building of an image, but there may be <i>some</i> containerization-related tests when this might be a good idea.  -->
多阶段构建一个有趣的使用场景是使用单独的构建阶段来 [testing](https://docs.docker.com/language/nodejs/run-tests/) 。如果测试阶段失败，整个构建过程也会失败。注意在构建镜像的过程中，将 <i>所有测试</i> 移动到待完成并非一个好主意，但是将 <i>一些</i> 与容器化相关的测试放进来就不错。


<!-- Extract a component <i>Todo</i> that represents a single todo. Write a test for the new component and add running tests into the build process. -->
提取出一个 <i>Todo</i> 组件来代表单独的todo。为该组件写一个测试放到构建流程中。

<!-- You can add a new build stage for the test if you wish to do so. If you do so, remember to read the last paragraph before exercise 12.13 again! -->
你可以增加一个新的构建阶段来测试。如果这么做了，记得阅读练习12.13前的最后一段。


</div>

<div class="content">

### Development in containers
在容器中开发

<!-- Let's move the whole todo application development to a container. There are a few reasons why you would want to do that:

- To keep the environment similar between development and production to avoid bugs that appear only in the production environment
- To avoid differences between developers and their personal environments that lead to difficulties in application development
- To help new team members hop in by having them install container runtime - and requiring nothing else.-->

让我们将整个 todo 应用程序开发移到容器中。 之所以要这样做，有几个原因：

- 保持开发和生产环境相似，避免只出现在生产环境中的bug
- 避免开发者与自身环境差异导致应用开发困难
- 帮助新团队成员加入，让他们只需要安装容器运行时，不再需要安装其他的了

<!-- These all are great reasons. The tradeoff is that we may encounter some unconventional behavior when we aren't running the applications like we are used to. We will need to do at least two things to move the application to a container:

- Start the application in development mode
- Access the files with VSCode
 -->

所有这些都是不错的理由。作为代价是我们由于不再像之前那样工作，因此会带来些不习惯的地方。我们至少需要做两件事才能将应用程序移动到容器中：

- 以开发模式启动应用程序
- 使用 VSCode 访问文件

<!-- Let's start with the frontend. Since the Dockerfile will be significantly different to the production Dockerfile let's create a new one called <i>dev.Dockerfile</i>. -->
让我们从前端开始。 由于 Dockerfile 与生产 Dockerfile 有很大不同，让我们创建一个名为<i>dev.Dockerfile</i> 的新文件。

<!-- Starting the create-react-app in development mode should be easy. Let's start with the following: -->
在开发模式下启动 create-react-app 应该很容易，让我们从以下开始：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm start is the command to start the application in development mode
CMD ["npm", "start"]
```
 
<!-- During build the flag _-f_ will be used to tell which file to use, it would otherwise default to Dockerfile, so _docker build -f ./dev.Dockerfile -t hello-front-dev ._ will build the image. The create-react-app will be served in port 3000, so you can test that it works by running a container with that port published. -->

构建阶段，标志 `-f` 将用于告诉使用哪个文件，否则默认为 Dockerfile：_docker build -f ./dev.Dockerfile -t hello-front-dev ._ 会构建镜像。 create-react-app 将在端口 3000 中提供服务，因此您可以在容器启动后测试端口是否被发布。

  
<!-- The second task, accessing the files with VSCode, is not done yet. There are at least two ways of doing this:  -->

<!-- - [The Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers)  -->
<!-- - Volumes, the same thing we used to preserve data with the database -->
第二个任务，使用 VSCode 访问文件，还没有完成。 至少有两种方法可以做到这一点：

- [The Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers) 
- 挂载卷，和我们用来保存数据库数据的东西一样
   
<!-- Let's go over the latter since that will work with other editors as well. Let's do a trial run with the flag _-v_, and if that works, then we will move the configuration to a docker-compose file. To use the _-v_, we will need to tell it the current directory. The command _pwd_ should output the path to the current directory for you. Try this with _echo $(pwd)_ in your command line. We can use that as the left side for _-v_ to map the current directory to the inside of the container or you can use the full directory path. -->

让我们来看看后者，因为大家还可能使用别的编辑器。 让我们使用标志 _-v_ 进行试运行，如果可行，那么我们将把配置移到 docker-compose 文件中。 要使用 _-v_，我们需要告诉它当前目录。 _pwd_ 命令能打印出当前文件夹的路径，请尝试使用 _echo $(pwd)_。 我们可以使用它作为 _-v_ 参数的左侧将当前目录映射到容器内部，或者你可以使用文件夹的全路径。

```bash
$ docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev

  Compiled successfully!

  You can now view hello-front in the browser.
```

<!-- Now we can edit the file <i>src/App.js</i>, and the changes should be hot-loaded to the browser! -->

现在我们可以简单编辑 <i>src/App.js</i> ，内容会热加载到浏览器中。

<!-- Next, let's move the config to a <i>docker-compose.yml</i>. That file should be at the root of the project as well: -->
下面我们将配置迁移到 <i>docker-compose.yml</i> 。 该文件应该会在项目的根目录

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

<!-- With this configuration, _docker-compose -f docker-compose.dev.yml up_ can run the application in development mode. You don't even need Node installed to develop it! -->

通过这个配置，此时我们运行 _docker-compose -f docker-compose.dev.yml up_ ，会启动一个应用，处于开发模式。你不用安装node 来开发了。

<!-- Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency **inside** the container. So instead of doing e.g. _npm install axios_, you have to do it in the running container e.g. _docker exec hello-front-dev npm install axios_, or add it to the package.json and run _docker build_ again. -->

安装新的依赖对开发来说是一件头疼的事情。一个好的实践是将其安装到容器 **内部**。 因此不必  _npm install axios_ ，你只需在容器中运行 _docker exec hello-front-dev npm install axios_ ，或者将其放到 package.json  文件并再次运行 _docker build_。

</div>
<div class="tasks">

### Exercise 12.15
练习 12.15
#### Exercise 12.15: Setup a frontend development environment
练习 12.15: 构建一个前端开发环境

<!-- Create <i>todo-frontend/docker-compose.dev.yml</i> and use the volumes to enable the development of the todo-frontend while it is running <i>inside</i> a container. -->
创建一个 <i>todo-frontend/docker-compose.dev.yml</i> 文件，并使用卷来启动一个开发的前端todo 应用，跑在容器 <i>内部</i>

</div>

<div class="content">

### Communication between containers in a docker network
容器和docker 网络进行通信

<!-- The docker-compose tool sets up a network between the containers and includes a DNS to easily connect two containers. Let's add a new service to the docker-compose and we shall see how the network and DNS work. -->

docker-compose 工具建立起一个网络，连通容器和一个DNS 来简单地连接两个容器到其他容器。让我们添加一个服务到docker-compose 我们可以看到网络和DNS如何工作。

<!-- [Busybox](https://www.busybox.net/) is a small executable with multiple tools you may need. It is called "The Swiss Army Knife of Embedded Linux", and we definitely can use it to our advantage. -->

[Busybox](https://www.busybox.net/)  是一个小型、可运行、多工具的镜像。被称为“嵌入Linux 的瑞士军刀”，我们可以使用它，利用其优势。

<!-- Busybox can help us to debug our configurations. So if you get lost in the later exercises of this section, you should use Busybox to find out what works and what doesn't. Let's use it to explore what was just said. That containers are inside a network and you can easily connect between them. Busybox can be added to the mix by changing <i>docker-compose.yml</i> to: -->
Busybox 可以用来帮助我们 debug 我们的配置。因此如果在后续的练习中卡住了，你可以使用 Busybox 来找到哪里工作哪里不工作了。让我们使用它来探索我们刚说到的内容，该容器存在于一个网络中，你可以方便地连接。Busybox 可以通过修改 <i>docker-compose.yml</i>  文件添加：


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

<!-- The Busybox container won't have any process running inside so that we could _exec_ in there. Because of that, the output of _docker-compose -f docker-compose.dev.yml up_ will also look like this: -->

Busybox 容器不会有任何进程在运行，所以我们可以在那里 _exec_ 。也由于此，_docker-compose -f docker-compose.dev.yml up_ 的输出会类似如下内容

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

<!-- This is expected as it's just a toolbox. Let's use it to send a request to hello-front-dev and see how the DNS works. While the hello-front-dev is running, we can do the request with [wget](https://en.wikipedia.org/wiki/Wget) since it's a tool included in Busybox to send a request from the debug-helper to hello-front-dev. -->


这验证了我们的想法，它仅是一个工具箱。让我们用它来发送一个请求到hello-front-dev 并看DNS如何工作。由于hello-front-dev 在运行，我们可以使用 [wget](https://en.wikipedia.org/wiki/Wget) ，因为它在 Busybox 中预装了，可以从debug-helper 到 hello-front-dev 发送一个请求

<!-- With Docker Compose we can use _docker-compose run SERVICE COMMAND_ to run a service with a specific command. Command wget requires the flag _-O_ with _-_ to output the response to the stdout: -->

利用 Docker Compose 我们可以使用 _docker-compose run SERVICE COMMAND_ 来运行一个特定的服务。wget 命令需要参数 _-O_ 和 _-_ 来输出响应到stdout 。

```bash
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

<!-- The URL is the interesting part here. We simply said to connect to the service <i>hello-front-dev</i> and to that port 3000. The port does not need to be published for other services in the same network to be able to connect to it. The "ports" in the docker-compose file are only for external access. -->

该URL 是很有趣的一部分。我们简单地说连接到另一个  <i>hello-front-dev</i> 服务的某个端口 3000。该端口不必暴露给网络中的其他服务。 docker-compose 文件中的 "ports" 仅仅是为了外部访问

<!-- Let's change the port configuration in the <i>docker-compose.dev.yml</i> to emphasize this: -->
让我们对 <i>docker-compose.dev.yml</i> 中的端口配置做一些修改来验证这一点：

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


<!-- With _docker-compose up_ the application is available in <http://localhost:3210> at the <i>host machine</i>, but still _docker-compose run debug-helper wget -O - http://hello-front-dev:3000_ works since the port is still 3000 within the docker network. -->

有了这个 _docker-compose up_  应用可以在 <i>宿主机</i> 的 <http://localhost:3210> 访问。 同样，_docker-compose run debug-helper wget -O - http://hello-front-dev:3000_ 也好使，因为在docker 网络中它使用的仍然是3000端口。

![](../../images/12/busybox_networking_drawio.png)

<!-- As the above image illustrates, _docker-compose run_ asks debug-helper to send the request within the network. While the browser in host machine sends the request from outside of the network. -->
如上图所示， _docker-compose run_ 会询问 debug-helper 使用网络发送请求。浏览器会在宿主机网络外发送请求。 

<!-- Now that you know how easy it is to find other services in the <i>docker-compose.yml</i> and we have nothing to debug we can remove the debug-helper and revert the ports to 3000:3000 in our <i>docker-compose.yml</i>. -->
既然你已经知道了在 <i>docker-compose.yml</i> 找到其他服务是多么方便，而且没什么可以debug的了，我们可以在<i>docker-compose.yml</i>删除 debug-helper 并回退端口到 3000:3000 状态。

</div>
<div class="tasks">

### Exercise 12.16
练习12.16

#### Exercise 12.16: Run todo-back in a development container
练习12.16：将 todo-后端跑在开发容器中

<!-- Use the volumes and Nodemon to enable the development of the todo app backend while it is running <i>inside</i> a container. Create a <i>todo-backend/dev.Dockerfile</i> and edit the <i>todo-backend/docker-compose.dev.yml</i>. -->
使用挂载卷和Nodemon 来开启todo 应用后端的开发模式，让其运行在容器 <i>内部</i>。 创建一个 <i>todo-backend/dev.Dockerfile</i> 并编辑 <i>todo-backend/docker-compose.dev.yml</i> 。

<!-- You will also need to rethink the connections between backend and MongoDB / Redis. Thankfully docker-compose can include environment variables that will be passed to the application: -->
你需要重新回想后台与MongoDB/Redis 的连接。多亏docker-compose 可以包含传递给应用的环境变量。

```yaml
services:
  server:
    image: ...
    volumes:
      - ...
    ports:
      - ...
    environment: 
      - REDIS_URL=//localhost:3000
      - MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database
```

<!-- The URLs (localhost) are purposefully wrong, you will need to set the correct values. Remember to <i>look all the time what happens in console</i>. If and when things blow up, the error messages hint at what might be broken. -->
URL(localhost) 是故意写错的，你需要改成正确的。记得 <i>随时查看console中发生了什么</i>。 如果崩溃了，错误信息是崩溃的线索

<!-- Here is a possibly helpful image illustrating the connections within the docker network: -->
一个可能有帮助的图片展示了docker 网络中的连接。

![](../../images/12/ex_12_15_backend_drawio.png)

</div>

<div class="content">

### Communications between containers in a more ambitious environment
容器与更复杂的环境进行通信

<!-- Next, we will add a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) to our docker-compose.yml. According to wikipedia -->

<!-- > <i>A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself.</i> -->

接下来我们将向我们的 docker-compose.yml 添加一个反向代理[reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy)。 根据维基百科的定义

> <i>反向代理是一种代理服务器，它作为客户端侧从一个或多个服务器获取资源。这些资源返回给真正的客户端，就好像他们是从反向服务器自己那里来的一样。</i>

<!-- So in our case, the reverse proxy will be the single point of entry to our application, and the final goal will be to set both the React frontend and the Express backend behind the reverse proxy.  -->
在我们的例子中，反向代理会作为我们应用程序单一入口点，最终目标是在反向代理服务器后端设置React 前端和Express 后端。

<!-- There are multiple different options for a reverse proxy implementation, such as Traefik, Caddy, Nginx, and Apache (ordered by initial release from newer to older). -->
关于反向代理的实现，有多种不同的选择：例如Traefik、Caddy、Nginx 和 Apache（按初始版本从新到旧排序）。

<!-- Our pick is [Nginx](https://hub.docker.com/_/nginx). Create a file <i>nginx.conf</i> in the project root and take the following template as a starting point. We will need to do minor edits to have our application running: -->
我们选择 [Nginx](https://hub.docker.com/_/nginx) 。在项目根目录中创建一个文件 <i>nginx.conf</i> 并以此模板进行配置。 我们需要做一些小的编辑才能让我们的应用程序运行：

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

<!-- Next, add Nginx to the <i>docker-compose.yml</i> file. Add a volume as instructed in the Docker Hub page where the right side is _:/etc/nginx/nginx.conf:ro_, the final ro declares that the volume will be <i>read-only</i>: -->

然后将 Nginx 添加到 <i>docker-compose.yml</i> 文件中。 按照 docker hub 页面中的指示添加一个卷，其中右侧是 _:/etc/nginx/nginx.conf:ro_ ，最后的 ro 声明该卷将为 <i>read-only</i>。

```yml
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
```

<!-- with that added we can run _docker-compose up_ and see what happens. -->
添加后，我们可以运行 _docker-compose up_  并查看会发生什么。

```bash
$ docker container ls
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                       NAMES
a02ae58f3e8d   nginx:1.20.1      "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp       reverse-proxy
5ee0284566b4   hello-front-dev   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   hello-front-dev
```

<!-- Connecting to http://localhost:8080 will lead to a familiar-looking page with 502 status.  -->

连接到 http://localhost:8080 将导致一个具有 502 状态的熟悉页面。

<!-- This is because directing requests to http://localhost:3000 leads to nowhere as the Nginx container does not have an application running in port 3000. By definition, localhost refers to the current computer used to access it. With containers localhost is unique for each container, leading to the container itself. -->

这是因为将请求定向到 http://localhost:3000 导致无处可去，因为 Nginx 容器没有在端口 3000 中运行任何应用程序。根据定义，localhost 是指用于访问它的当前计算机。 对于容器，每个容器的 localhost 都是唯一的，从而导致容器本身。

<!-- Let's test this by going inside the Nginx container and using curl to send a request to the application itself. In our usage curl is similar to wget, but won't need any flags. -->
让我们通过进入 Nginx 容器并使用 curl 向应用程序本身发送请求来测试, 我们使用curl ，它类似wget，不过不需要任何参数：

```bash
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:/# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

<!-- To help us, docker-compose set up a network when we ran docker-compose up. It also added all of the containers in the docker-compose.yml to the network. A DNS makes sure we can find the other container. The containers are each given two names: the service name and the container name. -->
为了帮助我们，docker-compose 在运行 docker-compose up 时创建了一个网络。并将  docker-compose.yml 中所有的容器加到了这个网络中。DNS 确保我们可以找到其他容器。容器被给了两个名字：服务名和容器名。


<!-- Since we are inside the container, we can also test the DNS! Let's curl the service name (app) in port 3000 -->
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

<!-- That is it! Let's replace the proxy_pass address in nginx.conf with that one. -->

<!-- If you are still encountering 503, make sure that the create-react-app has been built first. You can read the logs output from the docker-compose up. -->

就是这样！ 让我们用那个替换 nginx.conf 中的 proxy_pass 地址。

如果还是遇到503，先确定create-react-app是否已经建好了。你可以检查一下 docker-compose up 的输出日志。

</div>

<div class="tasks">

#### Exercises 12.17. - 12.19.
练习 12.17. - 12.19.

#### Exercise 12.17: Setup Nginx in front of todo-front
练习 12.17: 在todo-前端前面创建Nginx

<!-- We are going to move the nginx in front of both todo-frontend and todo-backend. Let's start by creating a new docker-compose file <i>todo-app/docker-compose.dev.yml</i> and <i>todo-app/nginx.conf</i>. -->
我们将要把todo 的前端和后端应用放到nginx 后面。 我们首先创建一个新的 docker-compose 文件 <i>todo-app/docker-compose.dev.yml</i> 和 <i>todo-app/nginx.conf</i>。

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.conf // highlight-line
└── docker-compose.dev.yml // highlight-line
```

<!-- Add nginx and todo-frontend built with <i>todo-app/todo-frontend/dev.Dockerfile</i> into the docker-compose.dev.yml. -->
将nginx 和 todo 前端利用 <i>todo-app/todo-frontend/dev.Dockerfile</i> 文件进行构建，构建到  docker-compose.dev.yml。

![](../../images/12/ex_12_16_nginx_front.png)

#### Exercise 12.18: Setup Nginx in front of todo-back
练习12.18 在todo 后端应用前搭建Nginx

<!-- Add the todo-backend to the development <i>todo-app/docker-compose.dev.yml</i> in development mode. -->
将nginx 和 todo 后端以开发模式添加到开发的 <i>todo-app/docker-compose.dev.yml</i>。

<!-- Add a new location to the <i>nginx.conf</i> so that requests to /api are proxied to the backend. Something like this should do the trick: -->
向 <i>nginx.conf</i>  添加一个新位置，以便将 /api 的请求代理到后端。 像这样应该可以解决问题：

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

<!-- The *proxy\_pass* directive has an interesting feature with a trailing slash. As we are using the path _/api_ for location but the backend application only answers in paths _/_ or _/todos_ we will want the _/api_ to be removed from the request. In other words, even though the browser will send a GET request to _/api/todos/1_ we want the Nginx to proxy the request to _/todos/1_. Do this by adding a trailing slash _/_ to the URL at the end of *proxy\_pass*. -->

*proxy\_pass* 指令有一个有趣的特性，带有尾部斜杠。 由于我们使用路径 _/api_ 作为位置，但后端应用程序仅在路径 _/_ 或 _/todos_ 中响应，我们希望从请求中删除 _/api_。 换句话说，即使浏览器将向 _/api/todos/1_ 发送 GET 请求，我们也希望 Nginx 将请求代理到 _/todos/1_。 这是通过在 *proxy\_pass* 末尾添加一个斜杠 _/_ 到 URL 来完成的。

<!-- This is a [common issue](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass) -->

有一个 [常见问题](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![](../../images/12/nginx_trailing_slash_stackoverflow.png)

<!-- This illustrates what we are looking for and may be helpful if you are having trouble: -->
如果你有疑问，这里展示了我们所找到的一些帮助材料：

![](../../images/12/ex_12_17_nginx_back.png)

#### Exercise 12.19: Connect todo-front to todo-back
练习 12.19: 将 todo-front 连接到 todo-back

<!-- Make sure that the todo-front works with todo-back. It will require changes to the *REACT\_APP\_BACKEND\_URL* environmental variable. -->
确保 todo-front 与 todo-back 一起工作。 它将需要更改 *REACT\_APP\_BACKEND\_URL* 环境变量。

<!-- If you already got this working during a previous exercise you may skip this. -->
如果您在之前的练习中已经完成了这项工作，则可以跳过此部分。

<!-- Make sure that the development environment is now fully function at, that is -->
<!-- - all features of the todo app wod -->
<!-- - you can edit the source files <i>and</i> the changes take effect through hot reload in case of frontend and by reloading the app in case of backend -->
确保开发环境当前完全可用：
- 所有todo 的功能可用
- 可以编辑源码文件，<i>并且</i> 变化可以通过热加载生效，同时检查前端和后端。

</div>

<div class="content">

### Tools for Production
生产工具

<!-- Containers are fun tools to use in development, but the best use case for them is in the production environment. There are many more powerful tools than docker-compose to run containers in production. -->
容器是在开发中使用的有趣工具，但它们的最佳用例是在生产环境中。 有许多比 docker-compose 更强大的工具可以在生产中运行容器。

<!-- Heavy weight container orchestration tools like [Kubernetes](https://kubernetes.io/) allow us to manage containers on a completely new level. Theese tools hide away the physical machines and allows us, the developers, to worry less about the infrastructure. -->
重量级容器编排工具，例如 Kubernetes 这样的工具使我们能够在一个全新的层面上管理容器。 这些工具基本上隐藏了物理机器，让我们的开发人员不必担心基础设施。

<!-- If you are interested in learning more in-depth about containers come to the [DevOps with Docker](https://devopswithdocker.com) course and you can find more about Kubernetes in the advanced 5 credit [DevOps with Kubernetes](https://devopswithkubernetes.com) course. You should now have the skills to complete both of them! -->
如果您有兴趣更深入地了解容器，请访问 [DevOps with Docker](https://devopswithdocker.com) 课程，您可以在 [DevOps with Kubernetes](https://devopswithkubernetes.com) 获得5个学分。 您现在应该具备完成这两项任务的技能。

</div>

<div class="tasks">


### Exercises 12.20.-12.22.
练习 12.20.-12.22.
#### Exercise 12.20:
练习 12.20：

<!-- Create a production <i>todo-app/docker-compose.yml</i> with all of the services, Nginx, todo-backend, todo-frontend, MongoDB and Redis. Use the Dockerfiles instead of <i>dev.Dockerfiles</i> and make sure to start the applications in production mode. -->
创建一个生产的 <i>todo-app/docker-compose.yml</i> ，包含所有的服务，Nginx，todo 前端 、后端、MongoDB 以及 Redis。使用Dockerfile 而不是 <i>dev.Dockerfiles</i> ，并确保应用跑在了生产模式下。

<!-- Please use the following structure for this exercise: -->
请用以下的结构来完成练习：

```bash
todo-app
├── todo-frontend
├── todo-backend
├── nginx.conf
├── docker-compose.dev.yml
└── docker-compose.yml // highlight-line
```

#### Exercise 12.21:
练习 12.21：

<!-- Do a simillar containerized development environment to one of <i>your own</i> full stack apps that you have created during the course or at your freetime. You should structure the app to submission repository as follows: -->
建一个类似的容器化开发环境到 <i>你自己的</i> 全栈 app 中，可以是业余时间通过课程完成的。应当把你的应用按如下架构进行提交：

```console
└── my-app
    ├── frontend
    |    └── dev.Dockerfile
    ├── backend
    |    └── dev.Dockerfile
    └── docker-compose.dev.yml
```

#### Exercise 12.22:
练习 12.22：

<!-- Do a simillar containerized development environment to one of <i>your own</i> full stack apps that you have created during the course or at your freetime.  -->
建一个类似的容器化开发环境到 <i>你自己的</i> 全栈 app 中，可以是业余时间通过课程完成的。

<!-- Finish this part by creating a contanerized <i>production setup</i> to your own full stack app. -->
Structure the app to submission repository as follows:
并为自己的全栈app创建一个 <i>生产构建</i> 来完成本章节
提交到仓库的应用应该像如下构建：

```console
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

<!-- This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-containers). -->
这是本章节的最后一个练习。是时候将你的代码提交到Github 并在 [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-containers) 将你所完成的练习标记为已完成了

</div>
