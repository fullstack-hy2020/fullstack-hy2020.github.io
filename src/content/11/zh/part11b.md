---
mainImage: ../../../images/part-11.svg
part: 11
letter: b
lang: zh
---

<div class="content">

<!-- Before we start playing with GitHub Actions, let''s have a look at what they are and how do they work.-->
在我们开始使用GitHub Actions之前，让我们来看看它们是什么以及它们如何工作。

<!-- GitHub Actions work on a basis of [workflows](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). A workflow is a series of [jobs](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs) that are run when a certain triggering [event](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events) happens. The jobs that are run then themselves contain instructions for what GitHub Actions should do.-->
GitHub Actions 基于[工作流](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows)运行。工作流是一系列[作业](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs)，当某个触发[事件](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events)发生时，就会运行这些作业。然后运行的作业中包含GitHub Actions应该做什么的指令。

<!-- A typical execution of a workflow looks like this:-->
一个典型的工作流执行如下：

<!-- - Triggering event happens (for example, there is a push to the main branch).-->
当触发事件发生（例如，有一个推送到主分支）时。
<!-- - The workflow with that trigger is executed.-->
运行具有该触发器的工作流程。
<!-- - Cleanup-->
清理

### Basic needs

<!-- In general, to have CI operate on a repository, we need a few things:-->
一般来说，要让CI在存储库上运行，我们需要几件事:

<!-- - A repository (obviously)-->
一个存储库（显然）
<!-- - Some definition of what the CI needs to do:-->
- CI需要做的一些定义：

1. 执行构建，测试和部署软件
2. 持续监测代码库，检测新提交
3. 启动自动化测试并发出通知
4. 执行定期构建以确保软件可以正常工作
5. 监控部署环境并发出警报
<!--   This can be in the form of a specific file inside the repository or it can be defined in the CI system-->
这可以是存储库中的一个特定文件的形式，也可以在CI系统中定义。
<!-- - The CI needs to be aware that the repository (and the configuration file within it) exist-->
CI需要意识到存在这个仓库（以及其中的配置文件）。
<!-- - The CI needs to be able to access the repository-->
CI 需要能夠訪問該存儲庫
<!-- - The CI needs permissions to perform the actions it is supposed to be able to do:-->
CI 需要权限才能执行它被设定应该能够做的动作：
<!--   For example, if the CI needs to be able to deploy to a production environment, it needs <i>credentials</i> for that environment.-->
例如，如果CI需要部署到生产环境，它需要该环境的<i>凭据</i>。

<!-- That's the traditional model at least, we'll see in a minute how GitHub Actions short-circuit some of these steps or rather make it such that you don''t have to worry about them!-->
那是传统的模型，我们将在一分钟内看到GitHub Actions如何缩短这些步骤，或者让你不必担心它们！

<!-- GitHub Actions have a great advantage over self-hosted solutions: the repository is hosted with the CI provider. In other words, GitHub provides both the repository and the CI platform. This means that if we''ve enabled actions for a repository, GitHub is already aware of the fact that we have workflows defined and what those definitions look like.-->
GitHub Actions 相比于自托管的解决方案有一个很大的优势：代码库是由CI提供商托管的。换句话说，GitHub既提供代码库，也提供CI平台。这意味着如果我们为一个仓库启用了Actions，GitHub已经知道我们定义了工作流，以及这些定义的内容是什么样子的。

</div>

<div class="tasks">

### Exercise 11.2.

<!-- In most exercises of this part, we are building a CI/CD pipeline for a small project found in [this example project repository](https://github.com/smartlyio/fullstackopen-cicd).-->
在本部分的大多数练习中，我们正在为[这个示例项目存储库](https://github.com/smartlyio/fullstackopen-cicd)构建CI / CD管道。

#### 11.2 The example project

<!-- The first thing you''ll want to do is to fork the example repository under your name. What it essentially does is it creates a copy of the repository under your GitHub user profile for your use.-->
第一件你想要做的事情是在你的名字下fork一個示例庫。它本質上做的就是在你的GitHub用戶資料庫中創建一個複製，供你使用。

<!-- To fork the repository, you can click on the Fork button in the top-right area of the repository view next to the Star button:-->
点击仓库视图右上角附近的Star按钮旁边的Fork按钮即可fork仓库：

![](../../images/11/1.png)

<!-- Once you''ve clicked on the Fork button, GitHub will start the creation of a new repository called <code>{github_username}/full-stack-open-pokedex</code>.-->
一旦您点击了Fork按钮，GitHub就会开始创建一个名为<code>{github_username}/full-stack-open-pokedex</code>的新存储库。

<!-- Once the process has been finished, you should be redirected to your brand new repository:-->
一旦进程完成，您应该会被重定向到您全新的存储库：

![](../../images/11/2.png)

<!-- Clone the project now to your machine. As always, when starting with a new code, the most obvious place to look first is the file <code>package.json</code>-->
克隆项目到你的机器上。像往常一样，当开始一个新的代码时，最明显的地方首先要看的是<code>package.json</code>文件。

<i>**NOTE** since the project is already a bit old, you need Node 16 to work with it!</i>

<!-- Try now the following:-->
试试下面这个：
<!-- - install dependencies (by running <code>npm install</code>)-->
安装依赖（通过运行<code>npm install</code>）
<!-- - start the code in development mode-->
开始以开发模式进行代码开发
<!-- - run tests-->
运行测试
<!-- - lint the code-->
检查代码

<!-- You might notice that project contains some broken tests and linting errors. **Just leave them as they are for now.** We will get around those later in the exercises.-->
你可能注意到这个项目包含一些损坏的测试和排版错误。**现在暂时先不管它们。** 我们将在练习中解决它们。

<!-- As you might remember from [part 3](/en/part3/deploying_app_to_internet#frontend-production-build), the React code <i>should not</i> be run in development mode once it is deployed in production. Try now the following-->
command:

正如你可能从[第3章节](/en/part3/deploying_app_to_internet#frontend-production-build)记得，一旦在生产环境中部署，React代码<i>不应</i>在开发模式下运行。现在尝试以下命令：
<!-- - create a production <i>build</i> of the project-->
创建项目的<i>生产</i>构建
<!-- - run the production version locally-->
本地运行生产版本

<!-- Also for these two tasks, there are ready-made npm scripts in the project!-->
也有针对这两个任务，项目中有准备好的npm脚本！

<!-- Study the structure of the project for a while. As you notice both the frontend and the backend code is now [in the same repository](/en/part7/class_components_miscellaneous#frontend-and-backend-in-the-same-repository). In earlier parts of the course we had a separate repository for both, but having those in the same repository makes things much simpler when setting up a CI environment.-->
研究一下项目的结构。如你所见，前端和后端代码现在[都在同一个存储库](/en/part7/class_components_miscellaneous#frontend-and-backend-in-the-same-repository)中。在本课程的早期部分，我们有一个单独的存储库，但将它们放在同一个存储库中，在设置CI环境时会变得更加简单。

<!-- In contrast to most projects in this course, the frontend code <i>does not use</i> create-react-app, but it has a relatively simple [webpack](/en/part7/webpack) configuration that takes care of creating the development environment and creating the production bundle.-->
相比于本课程中的大多数项目，前端代码<i>不使用</i>create-react-app，但它有一个相对简单的[webpack](/en/part7/webpack)配置，可以负责创建开发环境并创建生产包。

</div>

<div class="content">

### Getting started with workflows

<!-- The core component of creating CI/CD pipelines with GitHub Actions is something called a [Workflow](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). Workflows are process flows that you can set up in your repository to run automated tasks such as building, testing, linting, releasing, and deploying to name a few! The hierarchy of a workflow looks as follows:-->
核心组件用于使用GitHub Actions创建CI/CD管道的是称为[工作流](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows)的东西。工作流是您可以在存储库中设置的运行自动任务的过程流，例如构建、测试、linting、发布和部署等！工作流的层次结构如下：

<!-- Workflow-->
# 工作流程

<!-- - Job-->
Description

# 职位描述

We are looking for a qualified accountant to join our team. The successful candidate will be responsible for preparing financial statements, analyzing trends, and providing financial advice. He or she should have a deep understanding of accounting principles, be highly organized, and have excellent communication and problem-solving skills.

我们正在寻找一位合格的会计加入我们的团队。成功的候选人将负责准备财务报表，分析趋势，并提供财务建议。他/她应该对会计原则有深刻的理解，非常有组织，并具有出色的沟通和解决问题的能力。
<!--   - Step-->
1: Select a product

- 第一步：选择一个产品
<!--   - Step-->
1: Go to the website

- 步骤1：转到网站
<!-- - Job-->
Description

# 职位描述

We are looking for an experienced and motivated Account Manager to join our growing team. The Account Manager will be responsible for developing and maintaining relationships with existing customers, as well as generating new business. The successful candidate will have excellent communication and interpersonal skills, and a strong understanding of the company's products and services.

我们正在寻找一位经验丰富、有动力的客户经理加入我们不断壮大的团队。客户经理需要负责发展和维护现有客户的关系，以及开发新业务。成功的候选人需要具备出色的沟通和人际交往能力，并且对公司的产品和服务有深入的了解。
<!--   - Step-->
1: Open the browser

- 第一步：打开浏览器

<!-- Each workflow must specify at least one [Job](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs), which contains a set of [Steps](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps) to perform individual tasks. The jobs will be run in parallel and the steps in each job will be executed sequentially.-->
每个工作流必须至少指定一个[作业](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs)，其中包含一组[步骤](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps)来执行单个任务。作业将并行运行，每个作业中的步骤将按顺序执行。

<!-- Steps can vary from running a custom command to using pre-defined actions, thus the name GitHub Actions. You can create [customized actions](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) or use any actions published by the community, which are plenty, but let''s get back to that later!-->
步骤可以从运行自定义命令到使用预定义动作不等，因此得名为GitHub Actions。您可以创建[自定义动作](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions)，或者使用社区发布的任何动作，这些动作很多，但让我们稍后再回到这一点！

<!-- For GitHub to recognize your workflows, they must be specified in <code>.github/workflows</code> folder in your repository. Each Workflow is its own separate file which needs to be configured using the <code>YAML</code> data-serialization language.-->
为了让GitHub识别您的工作流程，它们必须在您的存储库中的<code> .github/workflows </code>文件夹中指定。 每个工作流程都是自己的单独文件，需要使用<code>YAML</code>数据序列化语言进行配置。

<!-- YAML is a recursive acronym for "YAML Ain''t Markup Language". As the name might hint its goal is to be human-readable and it is commonly used for configuration files. You will notice below that it is indeed very easy to understand!-->
YAML是“YAML Ain''t Markup Language”的递归缩写。正如其名称所暗示的，其目标是易于人类阅读，通常用于配置文件。您会注意到，它确实非常容易理解！

<!-- Notice that indentations are important in YAML. You can learn more about the syntax [here](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html).-->
注意，缩进在YAML中很重要。您可以在[此处](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)了解更多有关语法的信息。

<!-- A basic workflow contains three elements in a YAML document. These three elements are:-->
YAML文档中包含三个元素：  
1. 基本工作流  
2. 步骤  
3. 条件

<!-- - name: Yep, you guessed it, the name of the workflow-->
is **"Fetch Data From URL"**

- 答案：没错，你猜对了，工作流的名字是**“从URL获取数据”**
<!-- - (on) triggers: The events that trigger the workflow to be executed-->
触发工作流执行的事件
<!-- - jobs: The separate jobs that the workflow will execute (a basic workflow might contain only one job).-->
- 工作：工作流将执行的单独工作（基本工作流可能只包含一项工作）。

<!-- A simple workflow definition looks like this:-->
# 简单的工作流定义如下：

```yml
name: Hello World!

on:
  push:
    branches:
      - master
      # note that your "main" branch might be called main instead of master

jobs:
  hello_world_job:
    runs-on: ubuntu-20.04
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

<!-- In this example, the trigger is a push to the main branch, which in our project is called <i>master</i>. (Your main branch could be called <i>main</i> or <i>master</i>).  There is one job named <i>hello\_world\_job</i>, it will be run in a virtual environment with Ubuntu 20.04. The job has just one step named "Say hello", which will run the <code>echo "Hello World!"</code> command in the shell.-->
在这个例子中，触发器是推送到主分支，在我们的项目中被称为<i>master</i>。（您的主分支可以被称为<i>main</i>或<i>master</i>）。有一个名为<i>hello\_world\_job</i>的作业，它将在Ubuntu 20.04的虚拟环境中运行。该作业只有一个步骤，名为“Say hello”，它将在shell中运行<code>echo "Hello World!"</code>命令。

<!-- So you may ask, when does GitHub trigger a workflow to be started? There are plenty of [options](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) to choose from, but generally speaking, you can configure a workflow to start once:-->
那么您可能会问，GitHub何时触发开始工作流程？[有很多选择](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)可供选择，但一般来说，您可以配置工作流以在以下情况下启动：

<!-- - An <i>event on GitHub</i> occurs such as when someone pushes a commit to a repository or when an issue or pull request is created-->
<i>在GitHub上发生了一个事件</i>，比如当有人向一个存储库推送提交或创建问题或拉取请求时。
<!-- - A <i>scheduled event</i>, that is specified using the [cron]( https://en.wikipedia.org/wiki/Cron)-syntax, happens-->
at a <i>predefined time</i>.

一个使用[cron](https://en.wikipedia.org/wiki/Cron)-语法指定的<i>定时事件</i>，会在<i>预定时间</i>发生。
<!-- - An <i>external event</i> occurs, for example, a command is performed in an external application such as [Slack](https://slack.com/) or [Discord](https://discord.com/) messaging app-->
一个<i>外部事件</i>发生，例如，在外部应用程序（例如[Slack](https://slack.com/)或[Discord](https://discord.com/)消息应用程序）中执行命令。

<!-- To learn more about which events can be used to trigger workflows, please refer to GitHub Action''s [documentation](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows).-->
要了解有哪些事件可用于触发工作流，请参阅GitHub Action的[文档](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)。


</div>

<div class="tasks">

### Exercises 11.3-11.4.

<!-- To tie this all together, let us now get GitHub Actions up and running in the example project!-->
让我们把这一切都联系起来，现在让我们在示例项目中启动GitHub Actions！

#### 11.3 Hello world!

<!-- Create a new Workflow which outputs "Hello World!" to the user. For the setup, you should create the directory <code>.github/workflows</code> and a file <code>hello.yml</code> to your repository.-->
创建一个新的工作流，它将“Hello World！”输出给用户。对于设置，您应该在仓库中创建目录<code> .github/workflows </code>和文件<code> hello.yml </code>。

<!-- To see what your GitHub Action workflow has done, you can navigate to the **Actions** tab in GitHub where you should see the workflows in your repository and the steps they implement. The output of your Hello World workflow should look something like this with a properly configured workflow.-->
要查看GitHub Action 工作流程的执行情况，你可以在GitHub上导航到**Actions**标签，在那里你应该可以看到你的仓库中的工作流程及其执行的步骤。如果你的Hello World工作流程配置正确，它的输出应该像这样。

![A properly configured Hello World workflow](../../images/11/3.png)

<!-- You should see the "Hello World!" message as an output. If that''s the case then you have successfully gone through all the necessary steps. You have your first GitHub Actions workflow active!-->
你应该看到"Hello World!" 作为一个输出。如果是这种情况，那么你已经成功完成了所有必要的步骤。你有你的第一个GitHub Actions工作流程处于活动状态！

<!-- Note that GitHub Actions also informs you on the exact environment (operating system, and its [setup](https://github.com/actions/virtual-environments/blob/ubuntu18/20201129.1/images/linux/Ubuntu1804-README.md)) where your workflow is run. This is important since if something surprising happens, it makes debugging so much easier if you can reproduce all the steps in your machine!-->
注意，GitHub Actions 还会告知您工作流程运行的确切环境（操作系统及其[设置](https://github.com/actions/virtual-environments/blob/ubuntu18/20201129.1/images/linux/Ubuntu1804-README.md)）。这一点非常重要，因为如果发生令人惊讶的事情，如果您能够在自己的机器上重现所有步骤，那么调试就会变得容易得多！

#### 11.4 Date and directory contents

<!-- Extend the workflow with steps that print the date and current directory content in long format.-->
扩展工作流程，添加一步，以长格式打印日期和当前目录内容。

<!-- Both of these are easy steps, and just running commands [date](https://man7.org/linux/man-pages/man1/date.1.html) and [ls](https://man7.org/linux/man-pages/man1/ls.1.html) will do the trick.-->
这两个步骤都很简单，只需运行[date](https://man7.org/linux/man-pages/man1/date.1.html)和[ls](https://man7.org/linux/man-pages/man1/ls.1.html)命令就可以了。

<!-- Your workflow should now look like this-->
你的工作流程现在应该是这样的：

![Date and dir content in workflow](../../images/11/4.png)

<!-- As the output of command <code>ls -l</code> shows, by default, the virtual environment that runs our workflow <i>does not</i> have any code!-->
<code>ls -l</code> 的输出表明，默认情况下，运行我们的工作流的虚拟环境<i>没有</i>任何代码！

</div>

<div class="content">

### Setting up lint, test and build steps

<!-- After completing the first exercises, you should have a simple but pretty useless workflow set up. Let''s make our workflow do something useful.-->
完成第一个练习后，您应该已经设置了一个简单但毫无用处的工作流程。让我们让我们的工作流程做点有用的事情吧。

<!-- Let's implement a GitHub Action that will lint the code. If the checks don't pass, GitHub Actions will show a red status.-->
让我们实施一个GitHub Action来检查代码。如果检查不通过，GitHub Actions将显示红色状态。

<!-- At start, the workflow that we will save to file <code>pipeline.yml</code> looks like this:-->
在开始时，我们将要保存到文件<code>pipeline.yml</code>的工作流看起来像这样：

```yml
name: Deployment pipeline

on:
  push:
    branches:
      - master
      # note that your "main" branch might be called main instead of master

jobs:
```

<!-- Before we can run a command to lint the code, we have to perform a couple of actions to set up the environment of the job.-->
在我们可以运行命令来检查代码之前，我们必须执行一些操作来设置作业的环境。

#### Setting up the environment

<!-- Setting up the environment is an important task while configuring a pipeline. We're going to use an <code>ubuntu-20.04</code> virtual environment because this is the version of Ubuntu we're going to be running in production.-->
設定環境是配置管道時的一項重要任務。我們將使用<code>ubuntu-20.04</code>虛擬環境，因為這是我們將在生產環境中運行的Ubuntu版本。

<!-- It is important to replicate the same environment in CI as in production as closely as possible, to avoid situations where the same code works differently in CI and production, which would effectively defeat the purpose of using CI.-->
重要的是，尽可能地复制CI和生产环境中的相同环境，以避免相同代码在CI和生产环境中表现不同的情况，这实际上会使用CI失去意义。

<!-- Next, we list the steps in the "build" job that the CI would need to perform. As we noticed in the last exercise, by default the virtual environment does not have any code in it, so we need to <i>checkout the code</i> from the repository.-->
接下來，我們列出CI需要執行的「構建」作業步驟。正如我們在上一個練習中所注意到的，預設情況下虛擬環境中沒有任何代碼，因此我們需要從存儲庫中<i>檢出代碼</i>。

<!-- This is an easy step:-->
这是一个容易的步骤：

```yml
name: Deployment pipeline

on:
  push:
    branches:
      - master

jobs:
  simple_deployment_pipeline: # highlight-line
    runs-on: ubuntu-20.04 # highlight-line
    steps: # highlight-line
      - uses: actions/checkout@v3 # highlight-line
```

<!-- The [uses](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) keyword tells the workflow to run a specific <i>action</i>. An action is a reusable piece of code, like a function. Actions can be defined in your repository in a separate file or you can use the ones available in public repositories.-->
[使用](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) 关键字告诉工作流运行特定的<i>操作</i>。操作是可重用的代码片段，就像函数一样。操作可以在存储库的单独文件中定义，也可以使用公共存储库中提供的操作。

<!-- Here we''re using a public action [actions/checkout](https://github.com/actions/checkout) and we specify a version (<code>@v3</code>) to avoid potential breaking changes if the action gets updated. The <code>checkout</code> action does what the name implies: it checkouts the project source code from Git.-->
这里我们使用一个公共动作[actions/checkout](https://github.com/actions/checkout)，并且我们指定一个版本（<code>@v3</code>）来避免动作更新时可能出现的破坏性变化。<code>checkout</code>动作正如其名：它从Git中检出项目源代码。

<!-- Secondly, as the application is written in JavaScript, Node.js must be set up to be able to utilize the commands that are specified in <code>package.json</code>. To set up Node.js, [actions/setup-node](https://github.com/actions/setup-node) action can be used. Version <code>16</code> is selected because it is the version the application is using in the production environment.-->
其次，由于该应用程序是用JavaScript编写的，必须设置Node.js才能使用<code>package.json</code>中指定的命令。可以使用[actions/setup-node](https://github.com/actions/setup-node) action来设置Node.js。选择版本<code>16</code>，因为这是应用程序在生产环境中使用的版本。

```yml
# name and trigger not shown anymore...

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3 # highlight-line
        with: # highlight-line
          node-version: '16' # highlight-line
```

<!-- As we can see, the [with](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith) keyword is used to give a "parameter" to the action. Here the parameter specifies the version of Node.js we want to use.-->
正如我們所看到的，[with](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith) 關鍵字用於為動作提供一個“參數”。在這裡，參數指定了我們要使用的Node.js版本。


<!-- Lastly, the dependencies of the application must be installed. Just like on your own machine we execute <code>npm install</code>. The steps in the job should now look something like-->
this:

最后，必须安装应用程序的依赖项。就像在自己的机器上执行<code>npm install</code>一样。作业中的步骤现在应该看起来像这样：

```yml
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies # highlight-line
        run: npm install # highlight-line
```

<!-- Now the environment should be completely ready for the job to run actual important tasks in!-->
现在环境应该完全准备好来运行实际重要任务！

#### Lint

<!-- After the environment has been set up we can run all the scripts from <code>package.json</code> like we would on our own machine. To lint the code all you have to do is add a step to run the <code>npm run eslint</code> command.-->
在环境设置完成后，我们可以像在自己的机器上一样运行<code>package.json</code>中的所有脚本。要进行代码检查，您只需添加一个步骤来运行<code>npm run eslint</code>命令即可。

```yml
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Check style  # highlight-line
        run: npm run eslint # highlight-line
```

<!-- Note that the _name_ of a step is optional, if you define a step as follows-->
_name_: Do something

提示：步骤的_名称_是可选的，如果您按照以下方式定义一个步骤：

_名称_：做点什么

```yml
- run: npm run eslint
```

<!-- the command that is run is used as the default name.-->
运行的命令被用作默认名称。

</div>

<div class="tasks">

### Exercises 11.5.-11.9.

#### 11.5 Linting workflow

<!-- Implement or <i>copy-paste</i> the "Lint" workflow and commit it to the repository. Use a new <i>yml</i> file for this workflow, you may call it e.g. <i>pipeline.yml</i>.-->
实施或<i>复制粘贴</i>“Lint”工作流程，并将其提交到存储库。 为此工作流程使用一个新的<i>yml</i>文件，您可以将其称为<i>pipeline.yml</i>。

<!-- Push your code and navigate to "Actions" tab and click on your newly created workflow on the left. You should see that the workflow run has failed:-->
推送你的代码，然后转到“操作”选项卡，点击左侧新创建的工作流。你应该会看到工作流运行失败：

![Linting to workflow](../../images/11/5.png)

#### 11.6 Fix the code

<!-- There are some issues with the code that you will need to fix. Open up the workflow logs and investigate what is wrong.-->
你需要修复一些代码存在的问题。打开工作流日志并调查是什么出了问题。

<!-- A couple of hints. One of the errors is best to be fixed by specifying proper <i>env</i> for linting, see [here](/en/part3/validation_and_es_lint#lint) how it can be done . One of the complaints concerning <code>console.log</code> statement could be taken care of by simply silencing the rule for that specific line. Ask google how to do it.-->
给出几个提示。其中一个错误最好通过为linting指定适当的<i>env</i>来解决，参见[这里](/en/part3/validation_and_es_lint#lint)如何做到。关于<code>console.log</code>语句的投诉可以通过简单地将该特定行的规则静默来解决。问问谷歌如何做到。

<!-- Make the necessary changes to the source code so that the lint workflow passes. Once you commit new code the workflow will run again and you will see updated output where all is green again:-->
使得必要的更改到源代码，以便lint工作流通过。一旦您提交新的代码，工作流将再次运行，您将看到更新的输出，所有内容都会变绿：

![Lint error fixed](../../images/11/6.png)

#### 11.7 Building and testing

<!-- Let''s expand on the previous workflow that currently does the linting of the code. Edit the workflow and similarly to the lint command add commands for build and test. After this step outcome should look like this-->
:

让我们扩展之前的工作流，目前正在对代码进行linting。编辑工作流，并类似于lint命令添加构建和测试命令。此步骤之后的结果应如下所示：

![tests fail...](../../images/11/7.png)

<!-- As you might have guessed, there are some problems in code...-->
# 如你所料，代码中存在一些问题...

#### 11.8 Back to green

<!-- Investigate which test fails and fix the issue in the code (do not change the tests).-->
探索哪個測試失敗了，並在代碼中修復該問題（不要改變測試）。

<!-- Once you have fixed all the issues and the Pokedex is bug-free, the workflow run will succeed and show green!-->
一旦你修复了所有的问题，Pokedex也没有bug，工作流就会成功地运行并显示绿色！

![tests fixed](../../images/11/8.png)

#### 11.9 Simple end to end -tests

<!-- The current set of tests use [Jest](https://jestjs.io/) to ensure that the React components work as intended. This is exactly the same thing that is done in section [Testing React apps](/en/part5/testing_react_apps) of part 5.-->
当前的测试集使用[Jest](https://jestjs.io/)来确保React组件正常工作。这与第五部分[测试React应用程序](/en/part5/testing_react_apps)的内容完全一致。

<!-- Testing components in isolation is quite useful but that still does not ensure that the system as a whole works as we wish. To have more confidence about this, let us write a couple of really simple end to end -tests with the [Cypress](https://www.cypress.io/) library similarly what we do in section [End to end testing](/en/part5/end_to_end_testing) of part 5.-->
测试组件的孤立性是非常有用的，但这仍然不能确保整个系统按照我们的意愿工作。为了更有信心，让我们用[Cypress](https://www.cypress.io/)库编写一些非常简单的端到端测试，就像我们在第5部分的[端到端测试](/en/part5/end_to_end_testing)中所做的那样。

<!-- So, setup Cypress (you''ll find [here](/en/part5/end_to_end_testing/) all info you need) and use this test at first:-->
所以，設置Cypress（你會在[這裡](/en/part5/end_to_end_testing/)找到你所需的所有信息），並且首先使用這個測試：

```js
describe('Pokedex', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('ivysaur')
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo.')
  })
})
```

<!-- Define a npm script <code>test:e2e</code> for running the e2e tests from the command line.-->
定义一个npm脚本<code>test:e2e</code>，用于从命令行运行e2e测试。

<!-- **Note** do not include the word <i>spec</i> in the Cypress test file name, that would cause also Jest to run it, and it might cause problems.-->
**注意**：在Cypress测试文件名中不要包含<i>spec</i>这个词，否则Jest也会运行它，可能会出现问题。

<!-- **Another thing to note** is that despite the page renders the Pokemon names by starting with a capital letter, the names are actually written with lower case letters in the source, so it is <code>ivysaur</code> instead of <code>Ivysaur</code>!-->
**另一件需要注意的是**，尽管页面以大写字母开头呈现Pokemon的名字，但在源文件中实际上是以小写字母书写的，因此它是<code>ivysaur</code>，而不是<code>Ivysaur</code>！

<!-- Ensure that the test passes locally. Remember that the Cypress tests _assume that the application is up and running_ when you run the test! If you have forgotten the details (that happened to me too!), please see [part 5](/en/part5/end_to_end_testing) how to get up and running with Cypress.-->
确保测试在本地通过。请记住，当你运行测试时，Cypress 测试_假设应用程序已经启动_！如果你忘记了细节（我也经常忘记！），请参阅[第5章节](/en/part5/end_to_end_testing)，了解如何使用 Cypress 启动和运行。

<!-- Once the end to end test works in your machine, include it in the GitHub Action workflow. By far the easiest way to do that is to use the ready-made action [cypress-io/github-action](https://github.com/cypress-io/github-action). The step that suits us is the following:-->
一旦端到端测试在你的机器上运行成功，就把它包含在GitHub Action工作流中。到目前为止，最简单的方法是使用现成的动作[cypress-io/github-action](https://github.com/cypress-io/github-action)。适合我们的步骤如下：

```js
- name: e2e tests
  uses: cypress-io/github-action@v5
  with:
    command: npm run test:e2e
    start: npm run start-prod
    wait-on: http://localhost:5000
```

<!-- Three options are used. [command](https://github.com/cypress-io/github-action#custom-test-command) specifies how to run Cypress tests. [start](https://github.com/cypress-io/github-action#start-server) gives npm script that starts the server and [wait-on](https://github.com/cypress-io/github-action#wait-on) says that before the tests are run, the server should have started in url <http://localhost:5000>.-->
三种选项被使用。[command](https://github.com/cypress-io/github-action#custom-test-command) 指定如何运行 Cypress 测试。[start](https://github.com/cypress-io/github-action#start-server) 给出了启动服务器的 npm 脚本，[wait-on](https://github.com/cypress-io/github-action#wait-on) 表示在运行测试之前，服务器应该在 <http://localhost:5000> 上启动。


<!-- Once you are sure that the pipeline works, <i>write another test</i> that ensures that one can navigate from the main page to the page of a particular Pokemon, e.g. <i>ivysaur</i>. The test does not need to be a complex one, just check that when you navigate a link, the page has some right content, such as the string <i>chlorophyll</i> in the case of <i>ivysaur</i>.-->
一旦你确定管道工作正常，<i>写另一个测试</i>来确保可以从主页导航到特定宝可梦的页面，例如<i>ivysaur</i>。测试不需要复杂，只需检查当你导航链接时，页面有正确的内容，比如<i>ivysaur</i>的情况下就是<i>chlorophyll</i>字符串。

<!-- **Note** also the Pokemon abilities are written with lower case letters, the capitalization is done in CSS, so <i>do not</i> search eg. for <i>Chlorophyll</i> but <i>chlorophyll</i>.-->
**注意**：口袋妖怪的能力也是用小写字母写的，大小写是用CSS实现的，所以<i>不要</i>搜索比如<i>Chlorophyll</i>，而是<i>chlorophyll</i>。

<!-- **Note2** that you should not try <i>bulbasaur</i>, for some reason the page of that particular Pokemon does not work properly...-->
**注意2**：你不應該試試<i>bulbasaur</i>，由於某些原因該特定Pokemon的頁面無法正常工作...

<!-- The end result should be something like this-->
# 结果

最终结果是这样的

![e2e tests](../../images/11/9.png)

<!-- End to end -tests are nice since they give us confidence that software works from the end user''s perspective. The price we have to pay is the slower feedback time. Now executing the whole workflow takes quite much longer.-->
端到端测试很棒，因为它们让我们有信心，软件从用户的角度来看是可以正常工作的。我们要付出的代价是反馈时间较慢。现在执行整个工作流程需要的时间更长了。

</div>
