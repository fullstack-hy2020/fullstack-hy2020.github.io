---
mainImage: ../../../images/part-12.svg
part: 12
letter: a
lang: zh
---

<div class="content">

<!-- Software development includes the whole lifecycle from envisioning the software to programming and to releasing the software to the end-users and even maintaining it. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle. -->
软件开发包含了软件从编程到发布的整个生命周期，甚至还包含了运维阶段。这一章我们会引入容器的概念，这一流行的工具通常会在软件生命周期的后半段应用到。

<!-- Containers encapsulate your application into a single package. This package will then include all of the dependencies with the application. As a result, each container can run isolated from the other containers. -->
容器将你的应用包装在一个单独的包中。这个包会包含该应用所有的依赖，因此每一个容器是可以单独运行的。

<!-- Containers prevent the application inside from accessing files and resources of the device. Developers can give the contained applications permission to access files and specify available resources. More accurately, containers are OS-level virtualization. The easiest-to-compare technology is a virtual machine (VM). VMs are used to run multiple operating systems on a single physical machine. They have to run the whole operating system, whereas a container runs the software using the host operating system. The resulting difference between VMs and containers is that there is hardly any overhead when running containers; they only need to run a single process. -->

容器阻止了应用从内部访问设备的文件和资源。开发者可以赋予容器化的应用相关权限，来访问文件和特定的资源。更准确地来说，容器是操作系统层级上的虚拟化。最简单的比较是和虚拟机（VM），虚拟机是用来在耽搁物理机上跑多个操作系统。需要运行起整个操作系统，而容器使用的宿主机的操作系统。也就是说，容器和虚拟机的区别是，容器仅仅需要很少的一部分额外开销来运行；它们仅仅需要跑在一个单独的进程中。

<!-- As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And as they isolate the software running inside, it enables the software to run identically almost anywhere. As such, they are the go-to option in any cloud environment or application with more than a handful of users. -->
容器是相对轻量的，至少与虚拟机比较而言，他们扩展起来更迅速。而且它能将软件在内部运行，使得软件能够运行在完全相同的环境中。这些特点使得它是云环境或者多用户下的首选方案。

<!-- Cloud services like AWS, Google Cloud, and Microsoft Azure all support containers in multiple different forms. These include AWS Fargate and Google Cloud Run, both of which run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your own machine.   -->
类似AWS、Google 云、微软 Azure 的云服务都不同方式地支持容器。比如AWS Fargate 与Google Cloud Run 会将容器作为serverless服务-也就是应用容器在不需要的时候压根不需要运行。你也可以将容器运行环境安装在大多数的机器中，并自己运行容器——包括能装到你的个人机中。

<!-- So containers are used in clouds and even during development. What are the benefits of using containers? Here are two common scenarios: -->

所以说容器通常运行在云环境甚至开发环境中。容器化的收益是什么呢？有两个典型的场景：

<!-- > Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed. -->

> 场景一： 你正在开发一个新的应用，它需要和你的遗留应用跑在同一个机器中。而且依赖的是不同的Node 版本。

<!-- You can probably use nvm, virtual machines, or dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere. -->
你可以使用nvm，虚拟机或者其他一些黑科技来让他们同时运行。但是，容器一个完美的解决方案，因为你可以让应用跑在自己的容器中。他们是互相独立且不会互相干扰。

<!-- > Scenario 2: Your application runs on your machine. You need to move the application to a server. -->
> 场景2: 你的应用跑在自己的机器中，你需要把它迁移到服务器上。

<!-- It is not uncommon that the application just does not run on the server despite it working just fine in your machine. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same execution environment both on your machine and on the server. It is not perfect: different hardware can be an issue, but you can limit the differences between environments. -->
应用很常见的一种情况是，在你的机器上跑起来没问题，但迁移到服务器上运转不起来。可能是由于环境缺失了依赖。而容器是一个完美的解决方案，虽然你可以在自己的机器和服务器上创建一个相同的环境（容器环境），但这并不完美：硬件可能会成为问题，但你可以限制不同的环境。

<!-- Sometimes you may hear about the <i>"Works in my container"</i> issue. The phrase describes a situation in which the application works fine in a container running on your machine but breaks when the container is started on a server. The phrase is a play on the infamous <i>"Works in my machine"</i> issue, which containers are often promised to solve. The situation also is most likely a usage error. -->
很少能听到<i>“在我的容器上明明是好用的”</i>这个问题。这句话描述的是应用在你机器上运行是好使的，但是到了服务器上的容器运行失败了。这句话像极了<i>“在我的机器上明明是好用的”</i>这个问题，容器化通常能够解决。这种情况的发生通常是使用问题。

### About this part ###
【关于本章】

<!-- In this part, the focus of our attention will not be on the JavaScript code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to <i>a single GitHub repository</i> which will include all of the source code and configuration you do during this part. -->
本章中，我们的重点不会放在JavaScript代码上。相反，我们把重点放在对软件运行的环境配置中。因此，练习可能不包含任何编码，你可以通过Githab访问应用，你的任务就是配置它们。联系提交到一个<i>单独的Github 仓库</i>，该仓库将包含此源码和本章中的配置。

<!-- You will need basic knowledge of Node, Express, and React. Only the core parts, 1 through 5, are required to be completed before this part.-->
你需要Node、Express 和React的 基础知识。只有核心的章节，也就是1到5章是本章节的前置章节。

</div>

<div class="tasks">

### Exercise 12.1
### <i>Warning</i>
注意

<!-- Since we are stepping right outside of our comfort zone as JavaScript developers, this part may require you to take a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.-->
由于我们正在慢慢走出JavaScript 开发者的舒适区，本章节开始前需要你了解一些 shell/命令行/命令语句/终端 等知识。

<!-- If you have only ever used a graphical user interface and never touched e.g. Linux or terminal on Mac, or if you get stuck in the first exercises we recommend doing the Part 1 of "Computing tools for CS studies" first: <https://tkt-lapio.github.io/en/>. Skip the section for "SSH connection" and Exercise 11. Otherwise, it includes everything you are going to need to get started here!-->
如果你一直是一个图形界面的使用者，并没有接触过任何类似Linux 或者Mac 里终端的概念，或者在第一个练习就卡壳了，我建议你首先学一下 “CS学习中的计算工具” <https://tkt-lapio.github.io/en/>这门课，可以跳过11章的“SSH 连接”这一章。这里面包含了所有你会遇到的所有内容。


#### Exercise 12.1: Using a computer (without graphical user interface)
联系12：使用计算机（不使用图形化用户界面）

<!-- Step 1: Read the text below the Warning header. -->
步骤一：阅读警告头下面的文字。

<!-- Step 2: Download this [repository](https://github.com/fullstack-hy2020/part12-containers-applications) and make it your submission repository for this part. -->
步骤二：下载这个[repository](https://github.com/fullstack-hy2020/part12-containers-applications)，将文件提交到你的仓库中。

<!-- Step 3: Run <i>curl http://helsinki.fi</i> and save the output into a file. Save that file into your repository as file <i>script-answers/exercise12_1.txt</i>. The directory <i>script-answers</i> was created in the previous step. -->

步骤三： 运行 <i>curl http://helsinki.fi</i> 并将输出存储成文件。将文件保存到你的仓库中，文件名为<i>script-answers/exercise12_1.txt</i>。文件夹 <i>script-answers</i>  在之前的步骤会创建好。

</div>
<div class="content">

### Submitting exercises and earning credits ###
提交联系并获得学分

<!-- Submit the exercises via the [submissions system](https://studies.cs.helsinki.fi/stats/) just like in the previous parts. Exercises in this part are submitted <i>to its [own course instance](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>. -->

练习通过 [submissions system](https://studies.cs.helsinki.fi/stats/) 提交，与之前章节是一样的。此章节的联系提交到它 [自己的课程实例中](https://studies.cs.helsinki.fi/stats/courses/fs-containers)。

<!-- Completing this part on containers will get you 1 credit. Note that you need to do all the exercises for earning the credit or the certificate. -->
完成本章节关于容器的练习你会获得一个学分。注意你需要做完所有的练习来获得积分或认证证书。

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course: -->
你完成联系并想要获得学分，请通过联系提交系统告诉我们你已经完成了课程：

![Submitting exercises for credits](../../images/10/23.png)

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the language of the certificate. -->
你可以通过单击小旗图标来下载完成此章节的认证。小旗图标代表了认证通过。

### Tools of the trade
商业版本的工具

<!-- The basic tools you are going to need vary between operating systems: -->
不同操作系统使用的基础工具不同：

<!-- * [WSL 2 terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10) on Windows
* Terminal on Mac
* Command Line on a Linux -->

* Windows 的 [WSL 2 terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10)  
* Mac 的 Terminal
* Linux 的 命令行Command Line


### Installing everything required for this part ###
安装本章节所需要的所有内容

<!-- We will begin by installing the required software. The installation step will be one of the possible obstacles. As we are dealing with OS-level virtualization, the tools will require superuser access on the computer. They will have access to your operating systems kernel. -->

我们会从安装必备的软件开始。软件的安装步骤就是一个可能的阻碍。由于我们是在处理操作系统级别的虚拟化。因此工具需要超级管理员的权限。你需要能够访问操作系统的内核。

<!-- The material is built around [Docker](https://www.docker.com/), a set of products that we will use for containerization and the management of containers. Unfortunately, if you can not install Docker you probably can not complete this part. -->

该教材是围绕 [Docker](https://www.docker.com/) 构建，Docker 是一个我们用于容器化和容器管理的产品阵列。不幸的是，如果你不安装Docker 你可能完成不了本章节。

<!-- As the install instructions depend on your operating system, you will have to find the correct install instructions from the link below. Note that they may have multiple different options for your operating system.  -->

由于安装步骤取决于你的操作系统，你要在如下链接中找到正确的安装步骤。注意对你的操作系统来说，可能有多种不同的选项。


- [Get Docker](https://docs.docker.com/get-docker/)

<!-- Now that that headache is hopefully over, let's make sure that our versions match. Yours may have a bit higher numbers than here:-->
既然头疼的问题希望已经解决了，让我们确保我们的版本匹配。你的版本号可能比这里高一点：

```bash
$ docker -v
Docker version 20.10.5, build 55c4c88
```

### Containers and images
容器和镜像

<!-- There are two core concepts when starting with containers and they are easy to confuse with one another: -->

开始使用容器时有两个核心概念，它们很容易互相混淆：

<!-- A **container** is a runtime instance of an **image**. -->

**Container容器** 是 **image镜像** 的运行时实例。

<!-- Both of the following statements are true: -->

以下两句话都是正确的：

<!-- - Images include all of the code, dependencies and instructions on how to run the application 
- Containers package software into standardized units  -->

- 镜像包含了所有的代码，依赖以及如何运行应用的指令
- 容器将软件打包到标准单元中

<!-- It is no wonder they are easily mixed up. -->
难怪它们这么容易混淆。

<!-- To help with the confusion, almost everyone uses the word container to describe both. But you can never actually build a container or download one since containers only exist during runtime. Images, on the other hand, are **immutable** files. As a result of the immutability, you can not edit an image after you have created one. However, you can use existing images to create <i>a new image</i> by adding new layers on top of the existing ones. -->

为了消除这个歧义，大多数人使用容器这个词来同时描述镜像和容器。但是你不可能下载或构建一个容器，因为容器只存在于运行时。镜像，从另一方面来说，是**不变的** 文件。不变的结果就是你可以在创建后修改它们。但是你可以使用已经存在的镜像来创建一个<i>新的镜像</i>，只需要在已有的镜像上增加新的层即可

<!-- Cooking metaphor: -->
烹饪比喻：

<!-- * Image is pre-cooked, frozen treat. -->
<!-- * Container is the delicious treat. -->
* 镜像是预先煮熟的冷冻食品。
* 容器是美味佳肴。

<!-- [Docker](https://www.docker.com/) is the most popular containerization technology and pioneered the standards most containerization technologies use today. In practice, Docker is a set of products that help us to manage images and containers. This set of products will enable us to leverage all of the benefits of containers. For example, the docker engine will take care of turning the immutable files called images into containers. -->
[Docker](https://www.docker.com/) 是最流行的容器化技术，开创了现在最常用的标准。实际上，Docker是一系列产品来帮助我们管理容器和镜像，这一系列产品将使我们能够利用容器的所有好处。 例如，docker engine 会将不可变文件，也就是镜像转换为容器。

<!-- For managing the docker containers, there is also a tool called [Docker Compose](https://docs.docker.com/compose/) that allows one to **orchestrate** (control) multiple containers at the same time. In this part we shall use Docker Compose to set up a complex local development environment. In the final version of the development environment that we set up, even installing the Node to our machine is not a requirement anymore. -->
为了管理 docker 容器，还有 [Docker Compose](https://docs.docker.com/compose/)。它用于同时**编排**（控制）多个容器。在这一章中，我们将使用 Docker Compose 快速搭建复杂的本地开发环境。在我们构建的开发环境的最终版本中，甚至将Node 安装到我们机器上的这个需求也消除了。

<!-- There are several concepts we need to go over. But we will skip those for now and learn about Docker first!  -->
有许多概念我们需要复习，但我们现在将跳过这些并首先了解 Docker！

<!-- Let us start with the command <i>docker container run</i> that is used to run images within a container. The command structure is the following: _container run <i>IMAGE-NAME</i>_ that we will tell Docker to create a container from an image. A particularily nice feature of the command is that it can run a container even if the image to run is not downloaded on our device yet. -->
让我们从命令  <i>docker container run</i> 开始讲起，它是用来将镜像运行成一个容器。命令结构类似：_container run <i>IMAGE-NAME</i>_  ，我们会告诉Docker 来从一个镜像中创建一个容器。一个额外的好的特性是即使这个镜像还没有下载到我们的设备上，也能运行这个容器。


我最喜欢的功能之一是能够处理正在运行的容器，即使它们尚未下载到我们的设备上。

<!-- The command structure is the following: _container run <i>IMAGE-NAME</i>_. So we will tell Docker to create a container from an image. -->
命令结构如下：_container run <i>IMAGE-NAME</i>_。这样我们会告诉 docker 从一个镜像创建一个容器。

```bash
§ docker container run hello-world
```

<!-- There will be a lot of output, but let's split it into multiple sections, which we can decipher together. The lines are numbered by me so that it is easier to follow the explanation. Your output will not have the numbers. -->
会有很多输出，让我们将它分成多个部分，一起破译它。这些行由我编号，以便更容易理解解释，您的输出将没有这些编号：

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

<!-- Because the image <i>hello-world</i> was not found on our machine, the command first downloaded it from a free registry called [Docker Hub](https://hub.docker.com/). You can see the Docker Hub page of the image with your browser here: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)-->

由于 这个镜像没有在我们的机器中找到，这个命令会首先从一个免费的仓库，也就是 [Docker Hub](https://hub.docker.com/). 中下载下来。您可以在此处使用浏览器查看镜像的 docker hub 页面：[https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world) 

<!-- The first part of the message states that we did not have the image "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an URL. An image name is in the following format:   -->
消息的第一部分指出我们还没有“hello-world:latest”这个镜像。这揭示了镜像本身的一些细节；镜像名称由多个部分组成，有点像 URL。镜像名称采用以下格式：

- _registry/organisation/image:tag_

<!-- In this case the 3 missing fields defaulted to:  -->
<!-- - _index.docker.io/library/hello-world:latest_ -->
在这种情况下，3 个缺失的字段默认为：
- _index.docker.io/library/hello-world:latest_


<!-- The second row shows the organisation name, "library" where it will get the image. In the Docker Hub url, the "library" is shortened to _. -->

第二行显示组织名称，“库”，它将在其中获取镜像。在 Docker Hub url 中，“库”缩短为 _。

<!-- The 3rd and 5th rows only show the status. But the 4th row may be interesting: each image has a unique digest based on the <i>layers</i> from which the image is built. In practice, each step or command that was used in building the image creates a unique layer. The digest is used by Docker to identify that an image is the same. This is done when you try to pull the same image again. -->
第 3 行和第 5 行仅显示状态。但是第 4 行可能很有趣：每个镜像都有一个基于<i>层</i>的唯一数字签名，通过这个层来构建的镜像。实践中，每一步对镜像的构建或命令都会在镜像上构建唯一的层。如果您再次尝试拉取镜像，docker 会使用签名来识别该镜像是否相同。

<!-- So the result of using the command was a pull and then output information about the **image**. After that, the status told us that a new version of hello-world:latest was indeed downloaded. You can try pulling the image with _docker image pull hello-world_ and see what happens.-->
于是使用该命令的结果是，它会做出一些拉取动作，并打印出 **镜像** 的信息。然后，给出了下载了新版本 hello-world:latest 的状态。你可以使用拉取镜像的命令_docker image pull hello-world_。

<!-- The following output was from the container itself. It also explains what happened when we ran _docker container run hello-world_. -->
以下输出来自容器本身。它同时还解释了当我们运行 _docker container run hello-world_ 时发生了什么。

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

<!-- The output contains a few new things for us to learn. <i>Docker daemon</i> is a background service that makes sure the containers are running, and we use the <i>Docker client</i> to interact with the daemon. We now have interacted with the first image and created a container from the image. During the execution of that container, we received the output. -->
输出包含了一些我们需要学习的新内容。<i>Docker 守护进程</i>是一个确保容器正常运行的后台服务，我们使用<i>Docker 客户端</i>与守护进程进行交互。我们现在已经和第一个镜像进行了通信，并通过镜像产生了一个容器。通过运行那个容器，我们获得了输出。

</div>

<div class="tasks">

### Exercise 12.2
练习12.2


<!-- Some of these exercises do not require you to write any code or configurations to a file. -->
一些练习并不需要你写任何代码或者配置文件。

<!-- In these exercises you should use [script](https://man7.org/linux/man-pages/man1/script.1.html) command to record the commands you have used; try it yourself with _script_ to start recording, _echo "hello"_ to generate some output, and _exit_ to stop recording. It saves your actions into a file names "typescript". -->

在这些练习中，你会使用 [script](https://man7.org/linux/man-pages/man1/script.1.html) 来记录你使用的命令，你可以使用_script_ 来记录 ，_echo "hello"_  来生成一些输出，_exit_  来停止记录。他会将你的行为保存到一个文件，名叫“typescript”。


<!-- If _script_ does not work, you can just copy-paste all commands you used into a text file. -->
如果 _script_ 不起作用，你可以使用 复制粘贴所有的命令到一个文本文件中。

#### Exercise 12.2: Running your second container
练习12.2： 运行你的第二个容器

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_2.txt -->
> 使用 _script_ 来记录你的行为，将生成的文件保存到你答案的仓库中，保存为script-answers/exercise12_2.txt 。


<!-- The hello-world output gave us an ambitious task to do. Do the following -->
hello-word 的输出为我们衍生出了雄心勃勃的任务。执行以下操作：

<!-- Step 1. Run an Ubuntu container with the command given by hello-world

The step 1 will connect you straight into the container with bash. You will have access to all of the files and tools inside of the container. The following steps are run within the container:

Step 2. Create directory <i>/usr/src/app</i>

Step 3. Create a file <i>/usr/src/app/index.js</i>

Step 4. Run <i>exit</i> to quit from the container

Google should be able to help you with creating directories and files. -->

步骤1. 使用hello-word 给出的命令运行一个Ubuntu 容器。

步骤一会直接连接到你的容器并运行bash。你会访问容器中所有的文件和工具，一下命令是运行在容器中的：

步骤2. 创建一个目录 <i>/usr/src/app</i>

步骤3. 创建一个文件 <i>/usr/src/app/index.js</i>

步骤4. 运行 <i>exit</i> 来退出容器

Google 可以帮助你创建目录和文件。

</div>

<div class="content">

### Ubuntu image
Ubuntu 镜像

<!-- The command you just used to run the ubuntu container, _docker container run -it ubuntu bash_, contains a few additions to the previously run hello-world. Let's see the --help to get a better understanding. I'll cut some of the output so we can focus on the relevant parts. -->
刚刚用于运行ubuntu 容器的命令，_docker container run -it ubuntu bash_ 与之前的hello-world相比包含了一些额外的信息。让我们输入 --help 来获取更多解释。我会裁剪一些输出信息，以便于我们可以专注于相关章节。

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
<!-- The two options, or flags, in _-it_ make sure we can interact with the container. After the options, we defined that image to run is _ubuntu_. Then we have the command _bash_ to be executed inside the container when we start it. -->
解释一下这两个参数，或者说标志， _-it_ 会确保我们能够与容器交互，在这些标志之后，我们定义了要运行一个镜像，也就是 _ubuntu_ 。然后我们用命令 _bash_ 来在启动后在容器内部执行。


<!-- You can try other commands that the ubuntu image might be able to execute. As an example try _docker container run --rm ubuntu ls_. The _ls_ command will list all of the files in the directory and _--rm_ flag will remove the container after execution. Normally containers are not deleted automatically. -->
你可以尝试ubuntu镜像可能具有的其他命令，比如 _docker container run --rm ubuntu ls_ 。 _ls_ 命令会列出目录中所有的文件，_--rm_执行后 会删除容器。通常境况下容器不会自动删除。

<!-- Let's continue with our first ubuntu container with the **index.js** file inside of it. The container has stopped running since we exited it. We can list all of the containers with _container ls -a_, the _-a_ (or --all) will list containers that have already been exited. -->
让我们继续我们的第一个ubuntu容器，其中包含了 **index.js** 文件。自从我们退出它后容器就停止运行了。我们可以使用 _container ls -a_ 列出所有容器，  _-a_ (或 --all)将列出已经退出的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

<!-- We have two options when addressing a container. The identifier in the first column can be used to interact with the container almost always. Plus, most commands accept the container name as a more human-friendly method of working with them. The name of the container was automatically generated to be **"hopeful_clarke"** in my case. -->

我们在登陆容器时有两个参数。第一个标识符，也就是第一列的值总是可以用来与容器进行交互。此外，大多数命令接受容器名，这种更容易被人读懂的方式来与容器进行交互。在我的例子中，容器被自动命名为 **"hopeful_clarke"** 。

<!-- The container has already exited, yet we can start it again with the start command that will accept the id or name of the container as a parameter: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_. -->

容器已经退出，但是我们可以再次启动它， 该命令将接受容器的id 或名称作为参数_start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_。

```bash
$ docker start hopeful_clarke
hopeful_clarke
```

<!-- The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag _--interactive_ so we can not interact with it. -->
start 命令会启动我们之前相同的容器。不幸的事，我们忘记了使用标志  _--interactive_ 来启动它，所以我们无法与它进行交互。

<!-- The container is actually up and running as the command _container ls -a_ shows, but we just can not communicate it: -->
容器实际上已经启动了，我们可以运行 _container ls -a_ 来看到，只是我们不能与之交互：

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

<!-- Note that we can also execute the command without the flag _-a_ to see just those containers that are running: -->
注意我们也可以不带 _-a_ 标志来运行，这样仅能看到运行中的容器：

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke             
```

<!-- Let's kill it with the _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ command and try again.  -->
让我们运行 _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ 杀掉他来再次尝试

```bash
$ docker kill hopeful_clarke
hopeful_clarke
```

<!-- _docker kill_ sends a [signal SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html) to the process forcing it to exit, and that causes the container to stop. We can check it's status with _container ls -a_: -->
_docker kill_  发送了一个  [signal SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html) 来强制进程停止，这会导致容器停止。我们可以通过运行 _container ls -a_ 来验证一下：

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

<!-- Now let us start the container again, but this time in interactive mode: -->
让我们再次运行容器，这次我们使用交互模式：

```bash
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```


<!-- Let's edit the file <i>index.js</i> and add in some JavaScript code to execute. We are just missing the tools to edit the file. Nano will be a good text editor for now. The install instructions were found from the first result of Google. We will omit using sudo since we are already root. -->

让我们编辑 <i>index.js</i> 并添加些要执行的JavaScript 代码。我们现在缺少编辑文件的工具。Nono 目前是一个不错的选择。Google 能够查到安装指引。我们已经是root 用户，会省略使用sudo。

```bash
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

<!-- Now we have nano installed and can start editing files! -->
现在我们已经安装了nano 并可以开始编辑文件了。

</div>

<div class="tasks">

### Exercise 12.3 - 12.4
练习12.3-12.4

#### Exercise 12.3: Ubuntu 101
练习12.3 Ubuntu 101

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_3.txt -->
> 使用 _script_ 来记录你的行为，保存到文件 script-answers/exercise12_3.txt 中。

<!-- Edit the _/usr/src/app/index.js_ file inside the container with the now installed nano and add the following line -->
使用刚安装的nono编辑容器中的 _/usr/src/app/index.js_  文件，添加如下行。

```js
console.log('Hello World')
```

<!-- If you are not familiar with Nano you can ask for help in the chat or Google. -->
如果你不熟悉nano 的使用可以在聊天里询问或咨询谷歌。

#### Exercise 12.4: Ubuntu 102
练习12.4 Ubuntu 102

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_4.txt -->
> 使用 _script_ 来记录你的行为，将文件保存到 script-answers/exercise12_4.txt 中。

<!-- Install Node while inside the container and run the index file with _node /usr/src/app/index.js_ in the container. -->
在容器中安装Node 并运行index 文件：_node /usr/src/app/index.js_ 

<!-- The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste: -->
安装Node 的说明不太好找，所以你可以直接拷贝粘贴下面的命令：

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```

<!-- You will need to install the _curl_ into the container. It is installed in the same way as you did with _nano_. -->
你需要将_curl_  安装到容器中。和安装 _nano_ 的方法是一样的。


<!-- After the installation, ensure that you can run your code inside the container with command -->
安装完成后，确保你可以使用如下代码，将自己的代码运行在容器中：

```
root@b8548b9faec3:/# node /usr/src/app/index.js
Hello World
```

</div>

<div class="content">

### Other docker commands
其他Docker 命令

<!-- Now that we have Node installed in the container we can execute JavaScript in the container! Let's create a new image from the container. The _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ will create a new image that includes the changes we have made. You can use _container diff_ to check for the changes between the original image and container before doing so. -->
目前我们已经在容器中安装了node ，并可以在容器中运行 JavaScript 了！ 让我们从容器中创建一个新的镜像。 命令 _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ 会创建一个新的镜像，镜像里包含了我们的修改。你可以使用 _container diff_ 来检查原始镜像和容器的不同。

```bash
$ docker commit hopeful_clarke hello-node-world
```

<!-- You can list your images with _image ls_: -->
 你可以利用 _image ls_ 来列出你的镜像。

```bash
$ docker docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
``` 
 
<!-- You can now run the new image as follows: -->
 现在你可以用如下命令来运行一个新的镜像了：

```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

<!-- There are multiple ways to achieve the same conclusion. Let's go through a better solution. We will clean the slate with _container rm_ to remove the old container. -->
有多种方式可以达到相同的结果。我们首先使用 _container rm_  删除老的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

<!-- Create a file <i>index.js</i> to your current directory and write _console.log('Hello, World')_ inside it. No need for containers yet. -->
创建一个 <i>index.js</i> 文件到你的文件夹中，并写入 _console.log('Hello, World')_ ，先没有必要创建容器。

<!-- Next, let's skip installing Node altogether. There are plenty of useful Docker images in Docker Hub ready for our use. Let's use the image [https://hub.docker.com/_/Node](https://hub.docker.com/_/Node), which has Node already installed. We only need to pick a version. -->
下面让我们省略安装node 的步骤。因为Docker Hub 中为我们提供了丰富的可用Docker镜像，让我们使用 [https://hub.docker.com/_/Node](https://hub.docker.com/_/Node)，该镜像中已经安装好了Node，我们只需要选择一个版本即可。

<!-- By the way, the _container run_ accepts _--name_ flag that we can use to give a name for the container. -->
此外，_container run_ 接受 _--name_  标志我们可以给容器起一个名字。

```bash
$ docker container run -it --name hello-node node:16 bash
```

<!-- Let us create a directory for the code inside the container: -->
让我们创建一个文件夹来存放容器中的代码：

```
root@77d1023af893:/# mkdir /usr/src/app
```

<!-- While we are inside the container on this terminal, open another terminal and use the _container cp_ command to copy file from your own machine to the container. -->

由于我们现在在当前容器的终端，我们打开另外一个终端，使用 _container cp_  命令来从宿主机拷贝文件到容器。

```bash
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

<!-- And now we can run _node /usr/src/app/index.js_ in the container. We can commit this as another new image, but there is an even better solution. The next section will be all about building your images like a pro.-->
现在我们可以在容器中运行 _node /usr/src/app/index.js_  了。我们可以将这个提交为一个新的镜像，但有一个更好的解决方案。下一章我们会讨论像一个专家一样来构建你的镜像。

</div>
