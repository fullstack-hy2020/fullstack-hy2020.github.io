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

<!-- Great! Let's ctrl+c and exit out and add those to our Dockerfile. -->

很好！让我们  ctrl+c 退出并添加些内容到Dockerfile

```
  ^C
  INFO: Gracefully shutting down. Please wait...
root@98fa9483ee85:/usr/src/app# exit
  exit
```

```Dockerfile
...
RUN npm install -g serve

CMD ["serve", "build"]
```

<!-- And then build `docker build -t hello-front .` and run it `docker run -p 5000:5000 hello-front`. The app will be available in http://localhost:5000. -->
然后构建 `docker build -t hello-front .`  。 并运行`docker run -p 5000:5000 hello-front` 。应用会在浏览器中 http://localhost:5000 看到 。

### Using multiple stages
使用多步骤

<!-- While serve is a *valid* option we can do better. With containers a good goal is to create the containers so that they do not contain anything irrelevant so that they have a small number of dependencies and are less likely to break or become vulnerable over time.  -->
虽然serve 是一个 可行的 选项，但我们能进一步优化。容器中一个重要的目标就是创建的容器不包含任何不相关的内容，因此就会有较小的依赖，并且不容易被破坏，也不会随着时间流逝而变得脆弱。

<!-- Multi-stage builds are designed for splitting the build process into multiple stages. Conventional options for stages are build stage and test stage. -->

多阶段构建是设计于将构建流程切分成多个步骤。常见的阶段拆分是构建阶段和测试阶段。

With multi-stage builds a tried and true solution like [nginx](https://en.wikipedia.org/wiki/Nginx), can be used to serve static files without a lot of headache. The docker hub [page for nginx](https://hub.docker.com/_/nginx) tells us the required info to open the ports and "Hosting some simple static content".

利用多阶段构建，像 [nginx](https://en.wikipedia.org/wiki/Nginx) 这样久经考验的真正解决方案可以用于服务静态文件，免除了许多头疼的问题。 docker hub [page for nginx](https://hub.docker.com/_/nginx)  告诉我们打开端口并“托管一些简单镜头内容”所需要的信息。


<!-- Let's use the previous Dockerfile but change the FROM to include the name of the stage: -->
让我们使用之前的Dockerfile，并将FROM 改写来引入阶段名称。

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

<!-- The following repository contains an react application in the react-app directory. Copy the contents into your own repository. The react-app directory includes a README on how to start the application. -->

以下仓库在 react-app 目录中包含一个 react 应用程序。 将内容复制到您自己的存储库中。 react-app 目录包含一个关于如何启动应用程序的README。  

**TODO** there is no README in app

<!-- Use ENV to pass REACT_APP_BACKEND_URL to the application and run it with the backend. Backend can be running outside a container. -->
使用 ENV 将 REACT_APP_BACKEND_URL 传递给应用程序并与后端一起运行。 后端可以在容器外运行。

#### Exercise 12.13: Testing during build process
练习 12.13：构建过程中的测试

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

<!-- We will need to do at least two things to move the application to a container:

1. Start the application in development mode
2. Access the files with vscode -->

我们至少需要做两件事才能将应用程序移动到容器中：

1. 以开发模式启动应用程序
2. 使用vscode访问文件

<!-- And let's start with the frontend. Since the Dockerfile will be significantly different to the production Dockerfile let's create a new one called `dev.Dockerfile`. -->
让我们从前端开始。 由于 Dockerfile 与生产 Dockerfile 有很大不同，让我们创建一个名为`dev.Dockerfile` 的新文件。

<!-- Starting the create-react-app in development mode should be easy, lets start with the following: -->
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
 

The flag `-f` will be used to tell which file to use, it would otherwise default to Dockerfile: `docker build -f ./dev.Dockerfile -t hello-front-dev .`. The create-react-app will be served in port 3000, so you can test that it works. 

标志 `-f` 将用于告诉使用哪个文件，否则默认为 Dockerfile：`docker build -f ./dev.Dockerfile -t hello-front-dev .`。 create-react-app 将在端口 3000 中提供服务，因此您可以测试它是否有效。

  
The second task, Access the files with vscode, is not done yet. There are at least two ways of doing this: 
  1. [The Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers) 
  2. Volumes, the same thing we used to preserve data with the database

第二个任务，使用 vscode 访问文件，还没有完成。 至少有两种方法可以做到这一点：

1. 【Visual Studio Code Remote - Containers 扩展】(https://code.visualstudio.com/docs/remote/containers)
2. 卷，和我们用来保存数据库数据的东西一样
   
Let's go over the latter since not everyone is using vscode. Let's do a trial run with the flag `-v` and if that works then we will move the configuration to a docker-compose file. To use the -v we will need to tell it the current directory. pwd should do that for you, try with `echo $(pwd)`. Use that as the left side for -v to map current directory to the inside of the container.
让我们来看看后者，因为不是每个人都在使用 vscode。 让我们使用标志`-v` 进行试运行，如果可行，那么我们将把配置移到 docker-compose 文件中。 要使用 -v，我们需要告诉它当前目录。 pwd 应该为您做到这一点，请尝试使用 `echo $(pwd)`。 使用它作为 -v 参数的左侧将当前目录映射到容器内部。

```
$ docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev

  Compiled successfully!

  You can now view hello-front in the browser.
```

Now edit the src/App.js and the changes should be hot-loaded to the browser.
现在编辑 src/App.js，更改应该热加载到浏览器。

Next let's move that config to a docker-compose.yml.
接下来让我们将该配置移动到 docker-compose.yml。

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
    container_name: hello-front-dev # This will name the container hello-front-dev
```

With this `docker-compose up` can run the application in development mode. You don't even need node installed to develop it!
有了这个 `docker-compose up` 可以在开发模式下运行应用程序。 你甚至不需要安装node来开发它！

<!-- Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency **inside** the container. So instead of doing e.g. `npm install axios`, you have to do it in the running container e.g. `docker exec hello-front-dev npm install axios`. Or add it to the package.json and run `docker build` again. -->
对于像这样的开发设置，安装新的依赖项是一件令人头疼的事情。 更好的选择之一是在容器中安装新的 **内置** 依赖项。 所以，而不是做例如 `npm install axios`，你必须在正在运行的容器中进行，例如 `docker exec hello-front-dev npm install axios`。 或者将其添加到 package.json 并再次运行 `docker build`。

#### Communication between containers in a docker network
容器与docker 网络的通信

The docker-compose tool sets up a network between the containers and includes a DNS to easily connect two containers to one another. Let's add a new service to the docker-compose and we can see how the network and DNS work.
docker-compose 工具在容器之间建立了一个网络，并包含一个 DNS 来轻松地将两个容器相互连接起来。 让我们向 docker-compose 添加一个新服务，我们可以看到网络和 DNS 是如何工作的。

Next we will add a reverse proxy to our docker-compose. A reverse proxy will be the single point of entry to our application and we can hide multiple servers behind it. The final goal will be to set both the react application and the express application behind the reverse proxy. There are multiple different options, here are some examples ordered by initial release from newer to older: Traefik, Caddy, Nginx and Apache.
接下来我们将向我们的 docker-compose 添加一个反向代理。 反向代理将成为我们应用程序的单一入口点，我们可以在其后面隐藏多个服务器。 最终目标是在反向代理之后设置 react 应用程序和 express 应用程序。 有多种不同的选项，以下是一些示例，按初始版本从新到旧排序：Traefik、Caddy、Nginx 和 Apache。

Let's pick Nginx, the docker hub page is [here](https://hub.docker.com/_/nginx). Create a file nginx.conf in the project root and take this template for a configuration. We will need to do minor edits to have our application running:
我们选择Nginx，docker hub页面在[这里](https://hub.docker.com/_/nginx)。 在项目根目录中创建一个文件 nginx.conf 并以此模板进行配置。 我们需要做一些小的编辑才能让我们的应用程序运行：

**nginx.conf**
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

Let's test this by going inside the nginx container and using curl to send a request to the application itself:
让我们通过进入 nginx 容器并使用 curl 向应用程序本身发送请求来测试：

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

> If you are still encountering 503, make sure that the create-react-app has been built first.

就是这样！ 让我们用那个替换 nginx.conf 中的 proxy_pass 地址。

> 如果还是遇到503，先确定create-react-app是否已经建好了。

</div>

<div class="tasks">

### Exercises 12.14. - 12.16.
练习 12.14。 - 12.16

#### Exercise 12.14: Setup nginx in front of todo-front
练习 12.14：在 todo-front 前面设置 nginx

Create a development docker-compose yml with nginx and our todo react-app.
使用 nginx 和我们的 todo react-app 创建一个开发 docker-compose yml文件。

You can use *-f* flag to specify a file in case you want to have multiple, e.g. *docker-compose -f docker-compose.dev.yml up*
如果您想要多个文件，您可以使用 *-f* 标志来指定一个文件，例如 *docker-compose -f docker-compose.dev.yml up*

#### Exercise 12.15: Setup nginx in front of todo-back
练习 12.15：在 todo-back 前面设置 nginx

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

The `proxy_pass` directive has an interesting feature with a trailing slash. As we are using the path _/api_ for location but the backend application only answers in paths _/_ or _/todos_ we will want the _/api_ to be removed from the request. In other words even though the browser will send a GET request to _/api/todos/1_ we want the nginx to proxy the request to _/todos/1_. This is done by adding a trailing slash _/_ to the url at the end of `proxy_pass`.

`proxy_pass` 指令有一个有趣的特性，带有尾部斜杠。 由于我们使用路径 _/api_ 作为位置，但后端应用程序仅在路径 _/_ 或 _/todos_ 中响应，我们希望从请求中删除 _/api_。 换句话说，即使浏览器将向 _/api/todos/1_ 发送 GET 请求，我们也希望 nginx 将请求代理到 _/todos/1_。 这是通过在 `proxy_pass` 末尾添加一个斜杠 _/_ 到 url 来完成的。

This is a [common issue](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

又一个 [常见问题](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![](../../images/12/nginx_trailing_slash_stackoverflow.png)


#### Exercise 12.16: Connect todo-front to todo-back
将 todo-front 连接到 todo-back

Make sure that the todo-front works with todo-back. It will require changes to the `REACT_APP_BACKEND_URL` environmental variable.
确保 todo-front 与 todo-back 一起工作。 它将需要更改“REACT_APP_BACKEND_URL”环境变量。

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

If you are interested in learning more in depth about containers come to the [DevOps with Docker](https://devopswithdocker.com) course and you can find more about Kubernetes in the 5 credit [DevOps with Kubernetes](https://devopswithkubernetes.com). You should now have the skills to complete both of them.
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
