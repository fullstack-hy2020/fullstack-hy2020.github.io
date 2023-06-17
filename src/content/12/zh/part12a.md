---
mainImage: ../../../images/part-12.svg
part: 12
letter: a
lang: zh
---

<div class="content">

<!-- Software development includes the whole lifecycle from envisioning the software to programming and to releasing the software to the end-users and even maintaining it. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle.-->
 软件开发包括整个生命周期，从设想软件到编程，再到将软件发布给最终用户，甚至是维护软件。这一部分将介绍容器，一种在软件生命周期的后半部分使用的现代工具。

<!-- Containers encapsulate your application into a single package. This package will then include all of the dependencies with the application. As a result, each container can run isolated from the other containers.-->
 容器将你的应用封装成一个单一的包。然后，这个包将包括所有与应用有关的依赖性。因此，每个容器可以与其他容器隔离运行。

<!-- Containers prevent the application inside from accessing files and resources of the device. Developers can give the contained applications permission to access files and specify available resources. More accurately, containers are OS-level virtualization. The easiest-to-compare technology is a virtual machine (VM). VMs are used to run multiple operating systems on a single physical machine. They have to run the whole operating system, whereas a container runs the software using the host operating system. The resulting difference between VMs and containers is that there is hardly any overhead when running containers; they only need to run a single process.-->
 容器防止里面的应用访问设备的文件和资源。开发人员可以给所包含的应用访问文件的权限，并指定可用的资源。更准确地说，容器是操作系统级的虚拟化。最容易比较的技术是虚拟机（VM）。虚拟机被用来在一台物理机器上运行多个操作系统。他们必须运行整个操作系统，而容器则是使用主机操作系统运行软件。因此，虚拟机和容器之间的区别是，运行容器时几乎没有任何开销；它们只需要运行一个进程。

<!-- As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And as they isolate the software running inside, it enables the software to run identically almost anywhere. As such, they are the go-to option in any cloud environment or application with more than a handful of users.-->
由于容器是相对轻量级的，至少与虚拟机相比，它们可以快速扩展。而且，由于它们隔离了内部运行的软件，它使软件几乎可以在任何地方以相同的方式运行。因此，它们是任何云环境或应用中超过少数用户的首选方案。

<!-- Cloud services like AWS, Google Cloud, and Microsoft Azure all support containers in multiple different forms. These include AWS Fargate and Google Cloud Run, both of which run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your own machine.-->
 像AWS、谷歌云和微软Azure这样的云服务都支持多种不同形式的容器。这些服务包括AWS Fargate和Google Cloud Run，这两种服务都是以无服务器的方式运行容器--如果不使用应用容器，甚至不需要运行。你也可以在大多数机器上安装容器运行时间，自己在那里运行容器--包括你自己的机器。

<!-- So containers are used in cloud environment and even during development. What are the benefits of using containers? Here are two common scenarios:-->
所以容器在云环境中，甚至在开发过程中都可以使用。使用容器的好处是什么？这里有两个常见的场景。

<i>Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed.</i>

<!-- You can probably use nvm, virtual machines, or dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere.-->
 你可能可以使用nvm、虚拟机或黑魔法来让它们同时运行。然而，容器是一个很好的解决方案，因为你可以在各自的容器中运行两个应用。它们是相互隔离的，不会相互干扰。

<i>Scenario 2: Your application runs on your machine. You need to move the application to a server.</i>

<!-- It is not uncommon that the application just does not run on the server despite it working just fine in your machine. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same execution environment both on your machine and on the server. It is not perfect: different hardware can be an issue, but you can limit the differences between environments.-->
尽管应用在你的机器上运行得很好，但它就是不能在服务器上运行，这种情况并不罕见。这可能是由于某些依赖性的缺失或环境的其他差异。在这里，容器是一个很好的解决方案，因为你可以在你的机器和服务器上的同一执行环境中运行应用。这并不完美：不同的硬件可能是一个问题，但你可以限制环境之间的差异。

<!-- Sometimes you may hear about the <i>"Works in my container"</i> issue. The phrase describes a situation in which the application works fine in a container running on your machine but breaks when the container is started on a server. The phrase is a play on the infamous <i>"Works on my machine"</i> issue, which containers are often promised to solve. The situation also is most likely a usage error.-->
 有时你可能会听到<i>"在我的容器中工作"</i>问题。这句话描述了这样一种情况：应用在你的机器上运行的容器中工作正常，但当容器在服务器上启动时就会中断。这句话是对臭名昭著的<i>"在我的机器上工作"</i>问题的一种戏谑，容器通常被承诺解决这个问题。这种情况也很可能是一个使用错误。

### About this part ###

<!-- In this part, the focus of our attention will not be on the JavaScript code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to <i>a single GitHub repository</i> which will include all of the source code and configuration you do during this part.-->
 在这一部分，我们关注的重点将不是JavaScript代码。相反，我们对执行软件的环境配置感兴趣。因此，练习可能不包含任何编码，应用可以通过GitHub提供给你，你的任务将包括配置它们。练习将被提交到<i>一个GitHub仓库</i>，其中将包括你在这部分所做的所有源代码和配置。

<!-- You will need basic knowledge of Node, Express, and React. Only the core parts, 1 through 5, are required to be completed before this part.-->
 你将需要Node、Express和React的基本知识。只有核心部分，即1到5，需要在这部分之前完成。

</div>

<div class="tasks">

### Exercise 12.1
### <i>Warning</i>

<!-- Since we are stepping right outside of our comfort zone as JavaScript developers, this part may require you to take a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.-->
 由于我们正走出我们作为JavaScript开发者的舒适区，这部分可能需要你绕道而行，在开始之前熟悉shell/命令行/命令提示符/终端。

<!-- If you have only ever used a graphical user interface and never touched e.g. Linux or terminal on Mac, or if you get stuck in the first exercises we recommend doing the Part 1 of "Computing tools for CS studies" first: <https://tkt-lapio.github.io/en/>. Skip the section for "SSH connection" and Exercise 11. Otherwise, it includes everything you are going to need to get started here!-->
 如果你只使用过图形用户界面，从未接触过例如Linux或Mac上的终端，或者如果你在第一个练习中被卡住了，我们建议先做 "CS学习的计算工具 "的第一章节。<https://tkt-lapio.github.io/en/>。跳过 "SSH连接 "部分和练习11。否则，它包括了你在这里开始学习所需要的一切!

#### Exercise 12.1: Using a computer (without graphical user interface)

<!-- Step 1: Read the text below the Warning header.-->
 第一步：阅读警告标题下的文字。

<!-- Step 2: Download this [repository](https://github.com/fullstack-hy2020/part12-containers-applications) and make it your submission repository for this part.-->
 第2步：下载这个[仓库](https://github.com/fullstack-hy2020/part12-containers-applications)，并把它作为你在这部分的提交仓库。

<!-- Step 3: Run <i>curl http://helsinki.fi</i> and save the output into a file. Save that file into your repository as file <i>script-answers/exercise12_1.txt</i>. The directory <i>script-answers</i> was created in the previous step.-->
 第三步：运行<i>curl http://helsinki.fi</i>，并将输出保存到一个文件中。将该文件保存到你的仓库中，作为文件<i>script-answers/exercise12_1.txt</i>。目录<i>script-answers</i>已在上一步中创建。

</div>
<div class="content">

### Submitting exercises and earning credits ###

<!-- Submit the exercises via the [submissions system](https://studies.cs.helsinki.fi/stats/) just like in the previous parts. Exercises in this part are submitted <i>to its [own course instance](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>.-->
 通过[提交系统](https://studies.cs.helsinki.fi/stats/)提交练习，就像在前面的部分一样。这一部分的练习被提交<i>到其[自己的课程实例](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>。

<!-- Completing this part on containers will get you 1 credit. Note that you need to do all the exercises for earning the credit or the certificate.-->
 在集装箱上完成这部分内容将得到1个学分。注意，你需要做所有的练习来获得学分或证书。

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦你完成了练习并想获得学分，请通过练习提交系统让我们知道你已经完成了该课程。

![Submitting exercises for credits](../../images/10/23.png)

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the language of the certificate.-->
 你可以通过点击其中一个旗帜图标下载完成这部分的证书。旗帜图标与证书的语言相对应。

### Tools of the trade

<!-- The basic tools you are going to need vary between operating systems:-->
 你所需要的基本工具在不同的操作系统中有所不同。

<!-- * [WSL 2 terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10) on Windows-->
 * Windows上的[WSL 2终端](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
<!-- * Terminal on Mac-->
 * Mac上的终端
<!-- * Command Line on a Linux-->
 * Linux上的命令行

### Installing everything required for this part ###

<!-- We will begin by installing the required software. The installation step will be one of the possible obstacles. As we are dealing with OS-level virtualization, the tools will require superuser access on the computer. They will have access to your operating systems kernel.-->
 我们将从安装所需软件开始。安装步骤将是可行的障碍之一。由于我们正在处理操作系统级的虚拟化，这些工具将需要计算机上的超级用户权限。他们将有机会进入你的操作系统内核。

<!-- The material is built around [Docker](https://www.docker.com/), a set of products that we will use for containerization and the management of containers. Unfortunately, if you can not install Docker you probably can not complete this part.-->
 该材料是围绕[Docker](https://www.docker.com/)建立的，这是一套我们将用于容器化和容器管理的产品。不幸的是，如果你不能安装Docker，你可能无法完成这一部分。

<!-- As the install instructions depend on your operating system, you will have to find the correct install instructions from the link below. Note that they may have multiple different options for your operating system.-->
 由于安装说明取决于你的操作系统，你将不得不从下面的链接中找到正确的安装说明。注意，他们可能对你的操作系统有多个不同的选项。


<!-- - [Get Docker](https://docs.docker.com/get-docker/)-->
 - [获取Docker](https://docs.docker.com/get-docker/)

<!-- Now that that headache is hopefully over, let's make sure that our versions match. Yours may have a bit higher numbers than here:-->
 现在这个令人头疼的问题有望得到解决，让我们确保我们的版本相符。你的版本可能比这里的数字高一点。

```bash
$ docker -v
Docker version 20.10.5, build 55c4c88
```

### Containers and images

<!-- There are two core concepts when starting with containers and they are easy to confuse with one another:-->
 在开始使用容器时有两个核心概念，它们很容易相互混淆。

<!-- A **container** is a runtime instance of an **image**.-->
 一个**容器**是一个**图像**的运行时实例。

<!-- Both of the following statements are true:-->
 以下两种说法都是真的。

<!-- - Images include all of the code, dependencies and instructions on how to run the application-->
 - 图像包括所有的代码、依赖性和关于如何运行应用的指示
<!-- - Containers package software into standardized units-->
 - 容器将软件打包成标准化的单元

<!-- It is no wonder they are easily mixed up.-->
 难怪它们很容易被混淆。

<!-- To help with the confusion, almost everyone uses the word container to describe both. But you can never actually build a container or download one since containers only exist during runtime. Images, on the other hand, are **immutable** files. As a result of the immutability, you can not edit an image after you have created one. However, you can use existing images to create <i>a new image</i> by adding new layers on top of the existing ones.-->
 为了帮助混淆，几乎每个人都用容器这个词来描述两者。但你永远无法真正建立一个容器或下载一个，因为容器只在运行时存在。另一方面，图像是**不可变的**文件。由于它的不可更改性，在你创建了一个镜像之后，你不能再编辑它。然而，你可以使用现有的图像来创建<i>一个新的图像</i>，在现有的图像之上添加新的层。

<!-- Cooking metaphor:-->
 烹饪比喻。

<!-- * Image is pre-cooked, frozen treat.-->
 * 图像是预先煮好的、冷冻的食物。
<!-- * Container is the delicious treat.-->
 *容器是美味的食物。

<!-- [Docker](https://www.docker.com/) is the most popular containerization technology and pioneered the standards most containerization technologies use today. In practice, Docker is a set of products that help us to manage images and containers. This set of products will enable us to leverage all of the benefits of containers. For example, the docker engine will take care of turning the immutable files called images into containers.-->
 [Docker](https://www.docker.com/)是最流行的容器化技术，并开创了今天大多数容器化技术的标准。在实践中，Docker是一套帮助我们管理镜像和容器的产品。这套产品将使我们能够利用容器的所有好处。例如，docker引擎将负责把称为镜像的不可变文件变成容器。

<!-- For managing the docker containers, there is also a tool called [Docker Compose](https://docs.docker.com/compose/) that allows one to **orchestrate** (control) multiple containers at the same time. In this part we shall use Docker Compose to set up a complex local development environment. In the final version of the development environment that we set up, even installing the Node to our machine is not a requirement anymore.-->
对于管理docker容器，还有一个叫做[Docker Compose](https://docs.docker.com/compose/)的工具，它允许人们在同一时间**orchestrate**（控制）多个容器。在这一部分，我们将使用Docker Compose来建立一个复杂的本地开发环境。在我们建立的最终版本的开发环境中，甚至将Node安装到我们的机器上都不再是一个要求了。

<!-- There are several concepts we need to go over. But we will skip those for now and learn about Docker first!-->
 有几个概念我们需要去了解。但我们现在先跳过这些，先了解一下Docker!

<!-- Let us start with the command <i>docker container run</i> that is used to run images within a container. The command structure is the following: _container run <i>IMAGE-NAME</i>_ that we will tell Docker to create a container from an image. A particularly nice feature of the command is that it can run a container even if the image to run is not downloaded on our device yet.-->
 让我们从命令<i>docker container run</i>开始，该命令用于在容器中运行镜像。该命令的结构如下。_container run <i>IMAGE-NAME</i>_，我们将告诉Docker从一个镜像中创建一个容器。该命令的一个特别好的特点是，即使要运行的镜像还没有下载到我们的设备上，它也可以运行一个容器。

<!-- Let us run the command-->
 让我们运行这个命令

```bash
§ docker container run hello-world
```

<!-- There will be a lot of output, but let's split it into multiple sections, which we can decipher together. The lines are numbered by me so that it is easier to follow the explanation. Your output will not have the numbers.-->
 会有很多输出，但让我们把它分成多个部分，我们可以一起解读。这些行是由我来编号的，这样可以更容易地跟随解释。你的输出将不会有这些数字。

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

<!-- Because the image <i>hello-world</i> was not found on our machine, the command first downloaded it from a free registry called [Docker Hub](https://hub.docker.com/). You can see the Docker Hub page of the image with your browser here: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)-->
 因为在我们的机器上没有找到镜像<i>hello-world</i>，所以该命令首先从一个名为[Docker Hub](https://hub.docker.com/)的免费注册中心下载它。你可以用你的浏览器在这里看到该镜像的Docker Hub页面。[https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)

<!-- The first part of the message states that we did not have the image "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an URL. An image name is in the following format:-->
 消息的第一章节指出，我们还没有 "hello-world:最新 "的镜像。这揭示了关于图像本身的一些细节；图像名称由多个部分组成，有点像URL。一个图像名称的格式如下。

<!-- - _registry/organisation/image:tag_-->
 - _注册处/组织/图像:标签_

<!-- In this case the 3 missing fields defaulted to:-->
 在这种情况下，3个缺失的字段默认为。
<!-- - _index.docker.io/library/hello-world:latest_-->
 - _index.docker.io/library/hello-world:update_

<!-- The second row shows the organisation name, "library" where it will get the image. In the Docker Hub url, the "library" is shortened to _.-->
 第二行显示了组织名称，"library"，它将在那里获得图像。在Docker Hub的网址中，"library "被缩短为_。

<!-- The 3rd and 5th rows only show the status. But the 4th row may be interesting: each image has a unique digest based on the <i>layers</i> from which the image is built. In practice, each step or command that was used in building the image creates a unique layer. The digest is used by Docker to identify that an image is the same. This is done when you try to pull the same image again.-->
 第三和第五行只显示状态。但第4行可能很有趣：每个镜像都有一个基于构建该镜像的<i>层</i>的唯一摘要。在实践中，在构建镜像时使用的每个步骤或命令都会创建一个独特的层。Docker使用该摘要来识别一个镜像是相同的。当你试图再次拉取相同的镜像时，就会这样做。

<!-- So the result of using the command was a pull and then output information about the **image**. After that, the status told us that a new version of hello-world:latest was indeed downloaded. You can try pulling the image with _docker image pull hello-world_ and see what happens.-->
 所以，使用该命令的结果是拉取，然后输出关于**图像的信息。之后，状态告诉我们，确实下载了一个新版本的hello-world:fresh。你可以尝试用_docker image pull hello-world_来拉取镜像，看看会发生什么。

<!-- The following output was from the container itself. It also explains what happened when we ran _docker container run hello-world_.-->
 下面的输出是来自容器本身。它也解释了当我们运行_docker container run hello-world_时发生了什么。

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

<!-- The output contains a few new things for us to learn. <i>Docker daemon</i> is a background service that makes sure the containers are running, and we use the <i>Docker client</i> to interact with the daemon. We now have interacted with the first image and created a container from the image. During the execution of that container, we received the output.-->
 这个输出包含了一些新的东西供我们学习。<i>Docker daemon</i>是一个后台服务，它确保了容器的运行，我们使用<i>Docker client</i>来与daemon交互。现在我们已经与第一个镜像进行了交互，并从该镜像中创建了一个容器。在该容器的执行过程中，我们收到了这样的输出。

</div>

<div class="tasks">

### Exercise 12.2

<!-- Some of these exercises do not require you to write any code or configurations to a file.-->
 这些练习中有一些不需要你写任何代码或配置到文件中。
<!-- In these exercises you should use [script](https://man7.org/linux/man-pages/man1/script.1.html) command to record the commands you have used; try it yourself with _script_ to start recording, _echo "hello"_ to generate some output, and _exit_ to stop recording. It saves your actions into a file names "typescript".-->
 在这些练习中，你应该使用[script](https://man7.org/linux/man-pages/man1/script.1.html)命令来记录你所使用的命令；自己尝试一下，用_script_开始记录，_echo "hello"_产生一些输出，_exit_停止记录。它将你的操作保存在一个名为 "typescript "的文件中。

<!-- If _script_ does not work, you can just copy-paste all commands you used into a text file.-->
 如果_script_不起作用，你可以把你使用的所有命令复制粘贴到一个文本文件中。

#### Exercise 12.2: Running your second container

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_2.txt-->
 > 使用_script_来记录你所做的事情，将文件保存为script-answers/exercise12_2.txt。

<!-- The hello-world output gave us an ambitious task to do. Do the following-->
 hello-world的输出给了我们一个雄心勃勃的任务要做。做到以下几点

<!-- Step 1. Run an Ubuntu container with the command given by hello-world-->
 步骤1.用hello-world给出的命令运行一个Ubuntu容器

<!-- The step 1 will connect you straight into the container with bash. You will have access to all of the files and tools inside of the container. The following steps are run within the container:-->
 第1步将直接用bash连接到容器中。你将可以访问容器内的所有文件和工具。下面的步骤是在容器内运行的。

<!-- Step 2. Create directory <i>/usr/src/app</i>-->
 第2步。创建目录<i>/usr/src/app</i>。

<!-- Step 3. Create a file <i>/usr/src/app/index.js</i>-->
 第3步。创建一个文件<i>/usr/src/app/index.js</i>。

<!-- Step 4. Run <i>exit</i> to quit from the container-->
 第4步。运行<i>exit</i>从容器中退出

<!-- Google should be able to help you with creating directories and files.-->
 谷歌应该能够帮助你创建目录和文件。

</div>

<div class="content">

### Ubuntu image

<!-- The command you just used to run the ubuntu container, _docker container run -it ubuntu bash_, contains a few additions to the previously run hello-world. Let's see the --help to get a better understanding. I'll cut some of the output so we can focus on the relevant parts.-->
 你刚才用来运行ubuntu容器的命令，_docker container run -it ubuntu bash_，包含了对之前运行的hello-world的一些补充。让我们看看 --help，以获得更好的理解。我将剪掉一些输出，这样我们就可以把注意力集中在相关部分。

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

<!-- The two options, or flags, _-it_ make sure we can interact with the container. After the options, we defined that image to run is _ubuntu_. Then we have the command _bash_ to be executed inside the container when we start it.-->
 这两个选项，或者说标志，_-它_确保我们可以与容器互动。在这些选项之后，我们定义了要运行的镜像是_ubuntu_。然后，我们有一个命令_bash_，当我们启动容器时在里面执行。

<!-- You can try other commands that the ubuntu image might be able to execute. As an example try _docker container run --rm ubuntu ls_. The _ls_ command will list all of the files in the directory and _--rm_ flag will remove the container after execution. Normally containers are not deleted automatically.-->
 你可以试试ubuntu镜像可能会执行的其他命令。作为一个例子，尝试_docker container run --rm ubuntu ls_。ls_命令将列出目录中的所有文件，_--rm_标志将在执行后删除容器。通常情况下，容器是不会自动删除的。

<!-- Let's continue with our first ubuntu container with the **index.js** file inside of it. The container has stopped running since we exited it. We can list all of the containers with _container ls -a_, the _-a_ (or --all) will list containers that have already been exited.-->
 让我们继续看我们的第一个ubuntu容器，它里面有**index.js**文件。自从我们退出后，该容器已经停止运行。我们可以用_container ls -a_列出所有的容器，_-a_（或--all）会列出已经退出的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

<!-- We have two options when addressing a container. The identifier in the first column can be used to interact with the container almost always. Plus, most commands accept the container name as a more human-friendly method of working with them. The name of the container was automatically generated to be **"hopeful_clarke"** in my case.-->
 在寻址一个容器时，我们有两个选择。第一列中的标识符几乎总是可以用来与容器进行交互。另外，大多数命令都接受容器的名字，作为一种更人性化的工作方法。在我的例子中，容器的名字被自动生成为**"hopeful_clarke "**。

<!-- The container has already exited, yet we can start it again with the start command that will accept the id or name of the container as a parameter: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_.-->
 容器已经退出了，然而我们可以用启动命令再次启动它，该命令将接受容器的id或名称作为参数。_start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_。

```bash
$ docker start hopeful_clarke
hopeful_clarke
```

<!-- The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag _--interactive_ so we can not interact with it.-->
 这个启动命令将启动我们之前的那个容器。不幸的是，我们忘了用标志_--interactive_来启动它，所以我们不能与它交互。

<!-- The container is actually up and running as the command _container ls -a_ shows, but we just can not communicate it:-->
 正如命令_container ls -a_所显示的那样，这个容器实际上已经启动并运行了，但我们无法与它交流。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

<!-- Note that we can also execute the command without the flag _-a_ to see just those containers that are running:-->
 注意，我们也可以在不加标志_a_的情况下执行这个命令，只看那些正在运行的容器。

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke
```

<!-- Let's kill it with the _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ command and try again.-->
 让我们用_kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_命令杀死它，然后再试试。

```bash
$ docker kill hopeful_clarke
hopeful_clarke
```

<!-- _docker kill_ sends a [signal SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html) to the process forcing it to exit, and that causes the container to stop. We can check it's status with _container ls -a_:-->
 _docker kill_向进程发送一个[信号SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html)，迫使它退出，这将导致容器的停止。我们可以用_container ls -a_来检查它的状态。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

<!-- Now let us start the container again, but this time in interactive mode:-->
 现在让我们再次启动容器，但这次是以交互式模式。

```bash
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

<!-- Let's edit the file <i>index.js</i> and add in some JavaScript code to execute. We are just missing the tools to edit the file. Nano will be a good text editor for now. The install instructions were found from the first result of Google. We will omit using sudo since we are already root.-->
 让我们编辑文件<i>index.js</i>并添加一些JavaScript代码来执行。我们只是缺少编辑该文件的工具。目前，Nano将是一个很好的文本编辑器。安装说明是从谷歌的第一个结果中找到的。我们将省略使用sudo，因为我们已经是root。

```bash
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

<!-- Now we have nano installed and can start editing files!-->
 现在我们已经安装了nano，可以开始编辑文件了!

</div>

<div class="tasks">

### Exercise 12.3 - 12.4

#### Exercise 12.3: Ubuntu 101

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_3.txt-->
 > 使用_script_来记录你所做的事情，将文件保存为script-answers/exercise12_3.txt

<!-- Edit the _/usr/src/app/index.js_ file inside the container with the now installed nano and add the following line-->
 用现在安装的nano编辑容器内的_/usr/src/app/index.js_文件，添加以下一行

```js
console.log('Hello World')
```

<!-- If you are not familiar with Nano you can ask for help in the chat or Google.-->
 如果你不熟悉Nano，你可以在聊天中或Google上寻求帮助。

#### Exercise 12.4: Ubuntu 102

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_4.txt-->
 > 使用_script_来记录你所做的事情，将文件保存为script-answers/exercise12_4.txt

<!-- Install Node while inside the container and run the index file with _node /usr/src/app/index.js_ in the container.-->
 在容器内安装Node，在容器内用_node /usr/src/app/index.js_运行索引文件。

<!-- The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste:-->
安装Node的说明有时很难找到，所以这里是你可以复制粘贴的东西。

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```

<!-- You will need to install the _curl_ into the container. It is installed in the same way as you did with _nano_.-->
 你将需要在容器中安装_curl_。它的安装方式与你安装_nano_的方式相同。

<!-- After the installation, ensure that you can run your code inside the container with command-->
 安装完成后，确保你可以在容器内用命令运行你的代码

```
root@b8548b9faec3:/# node /usr/src/app/index.js
Hello World
```

</div>

<div class="content">

### Other docker commands

<!-- Now that we have Node installed in the container we can execute JavaScript in the container! Let's create a new image from the container. The _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ will create a new image that includes the changes we have made. You can use _container diff_ to check for the changes between the original image and container before doing so.-->
 现在我们已经在容器中安装了Node，我们可以在容器中执行JavaScript了!让我们从容器中创建一个新的镜像。_commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_将创建一个新的镜像，包括我们所做的修改。你可以在这样做之前使用_container diff_来检查原始镜像和容器之间的变化。

```bash
$ docker commit hopeful_clarke hello-node-world
```

<!-- You can list your images with _image ls_:-->
 你可以用_image ls_列出你的镜像。

```bash
$ docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
```

<!-- You can now run the new image as follows:-->
 你现在可以按以下方式运行新的镜像。

```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

<!-- There are multiple ways to achieve the same conclusion. Let's go through a better solution. We will clean the slate with _container rm_ to remove the old container.-->
 有多种方法可以达到相同的结论。让我们来看看一个更好的解决方案。我们将用_container rm_清理石板，以删除旧的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

<!-- Create a file <i>index.js</i> to your current directory and write _console.log('Hello, World')_ inside it. No need for containers yet.-->
在你的当前目录下创建一个文件<i>index.js</i>，并在其中写入_console.log(''Hello, World')_。现在还不需要容器。

<!-- Next, let's skip installing Node altogether. There are plenty of useful Docker images in Docker Hub ready for our use. Let's use the image [https://hub.docker.com/_/Node](https://hub.docker.com/_/Node), which has Node already installed. We only need to pick a version.-->
 接下来，让我们完全跳过安装Node。在Docker Hub中有很多有用的Docker镜像供我们使用。让我们使用[https://hub.docker.com/_/Node](https://hub.docker.com/_/Node)的镜像，它已经安装了Node。我们只需要选择一个版本。

<!-- By the way, the _container run_ accepts _--name_ flag that we can use to give a name for the container.-->
 顺便说一下，_container run_接受_--name_标志，我们可以用它来给容器起个名字。

```bash
$ docker container run -it --name hello-node node:16 bash
```

<!-- Let us create a directory for the code inside the container:-->
让我们为容器内的代码创建一个目录。

```
root@77d1023af893:/# mkdir /usr/src/app
```

<!-- While we are inside the container on this terminal, open another terminal and use the _container cp_ command to copy file from your own machine to the container.-->
 当我们在这个终端的容器内时，打开另一个终端，使用_container cp_命令将文件从你自己的机器复制到容器内。

```bash
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

<!-- And now we can run _node /usr/src/app/index.js_ in the container. We can commit this as another new image, but there is an even better solution. The next section will be all about building your images like a pro.-->
 现在我们可以在容器中运行_node /usr/src/app/index.js_。我们可以将其作为另一个新的镜像提交，但还有一个更好的解决方案。下一节将是关于像专家一样构建你的图像。

</div>
