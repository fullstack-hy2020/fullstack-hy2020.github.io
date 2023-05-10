---
mainImage: ../../../images/part-11.svg
part: 11
letter: a
lang: zh
---

<div class="content">

<!-- During this part, you will build a robust <i>deployment pipeline</i> to a ready made [example project](https://github.com/smartlyio/full-stack-open-pokedex) starting in [exercise 11.2](/en/part11/getting_started_with_git_hub_actions#exercise-11-2). You will [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) the example project and that will create you a personal copy of the repository. In the [last two](/en/part11/expanding_further#exercises-11-20-22) exercises, you will build another deployment pipeline for some of <i>your own</i> previously created apps!-->
在此部分，您將建立一個強大的<i>部署管道</i>來部署[示例項目](https://github.com/smartlyio/full-stack-open-pokedex)，從[第11.2節](/en/part11/getting_started_with_git_hub_actions#exercise-11-2)開始。您將[fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)示例項目，這將為您創建一個個人副本的存儲庫。在[最後兩個](/en/part11/expanding_further#exercises-11-20-22)練習中，您將為某些<i>您自己</i>創建的應用程序構建另一個部署管道！

<!-- There are 21 exercises in this part, and you need to complete <i>each</i> exercise for completing the course. Exercises are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-cicd) just like in the previous parts, but unlike parts 0 to 7, the submission goes to a different "course instance".-->
这一部分有21道练习，你需要完成<i>每一道</i>练习才能完成课程。练习需要通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-cicd)提交，就像之前的部分一样，但是不同于0到7部分，提交的内容会发送到不同的“课程实例”。

<!-- This part will rely on many concepts covered in the previous parts of the course. It is recommended that you finish at least parts 0 to 5 before starting this part.-->
这部分将依赖课程前几部分所涵盖的许多概念。建议您在开始本部分之前至少完成 0 到 5 部分。

<!-- Unlike the other parts of this course, you do not write many lines of code in this part, it is much more about configuration. Debugging code might be hard but debugging configurations is way harder, so in this part, you need lots of patience and discipline!-->
不像这门课程的其他部分，你在这部分不需要编写很多行代码，而是更多关于配置的内容。调试代码可能很难，但是调试配置更难，所以在这一部分，你需要有很多耐心和自律！

### Getting software to production

<!-- Writing software is all well and good but nothing exists in a vacuum. Eventually, we''ll need to deploy the software to production, i.e. give it to the real users. After that we need to maintain it, release new versions, and work with other people to expand that software.-->
写软件是很好的，但没有任何东西是孤立存在的。最终，我们需要将软件部署到生产环境，即将其交给真正的用户。之后，我们需要维护它，发布新版本，并与其他人合作来扩展该软件。

<!-- We''ve already used GitHub to store our source code, but what happens when we work within a team with more developers?-->
我们已经使用GitHub来存储我们的源代码，但是当我们在一个拥有更多开发者的团队中工作又会发生什么呢？

<!-- Many problems may arise when several developers are involved. The software might work just fine on <i>my computer</i>, but maybe some of the other developers are using a different operating system or different library versions. It is not uncommon that a code works just fine in one developer''s machine but another developer can not even get it started. This is often called the "works on my machine" problem.-->
多个开发人员参与时可能会出现许多问题。软件可能在<i>我的电脑</i>上运行得很好，但是也可能其他开发人员使用的是不同的操作系统或不同的库版本。一段代码在一个开发人员的机器上可能运行得很好，但另一个开发人员却无法启动它，这种情况并不少见，这通常被称为“我的机器上可以运行”的问题。

<!-- There are also more involved problems. If two developers are both working on changes and they haven't decided on a way to deploy to production, whose changes get deployed? How would it be possible to prevent one developer's changes from overwriting another''s?-->
也有更复杂的问题。如果两个开发人员都在做更改，但他们没有决定如何部署到生产环境，谁的更改会被部署？如何才能防止一个开发人员的更改覆盖另一个开发人员的更改？

<!-- In this part, we'll cover ways to work together and build and deploy software in a strictly defined way so that it's clear <i>exactly</i> what will happen under any given circumstance.-->
在这一部分，我们将介绍如何协作并以严格定义的方式构建和部署软件，以便在任何情况下都清楚地知道<i>确切</i>会发生什么。

### Some useful terms

<!-- In this part we'll be using some terms you may not be familiar with or you may not have a good understanding of. We'll discuss some of these terms here. Even if you are familiar with the terms, give this section a read so when we use the terms in this part, we''re on the same page.-->
在这一部分中，我们将使用一些您可能不熟悉或可能不太了解的术语。我们将在这里讨论其中一些术语。即使您熟悉这些术语，也请阅读本节，以便我们在本部分中使用这些术语时，我们处于同一页面。

#### Branches

<!-- Git allows multiple copies, streams, or versions of the code to co-exist without overwriting each other. When you first create a repository, you will be looking at the main branch (usually in Git, we call this <i>master</i> or <i>main</i>, but that does vary in older projects). This is fine if there''s only one developer for a project and that developer only works on one feature at a time.-->
Git允许多个代码副本、流或版本共存而不会相互覆盖。当你第一次创建一个仓库时，你将查看主分支（通常在Git中，我们称之为<i>master</i>或<i>main</i>，但在较旧的项目中会有所不同）。如果一个项目只有一个开发者，而且该开发者一次只工作在一个特性上，这样就很好了。

<!-- Branches are useful when this environment becomes more complex. In this context, each developer can have one or more branches. Each branch is effectively a copy of the main branch with some changes that make it diverge from it. Once the feature or change in the branch is ready it can be <i>merged</i> back into the main branch, effectively making that feature or change part of the main software. In this way, each developer can work on their own set of changes and not affect any other developer until the changes are ready.-->
分支在环境变得更加复杂时很有用。在这种情况下，每个开发者可以有一个或多个分支。每个分支实际上都是主分支的一个副本，其中的一些变化使其与主分支不同。一旦分支中的功能或变化准备就绪，就可以将其<i>合并</i>回主分支，从而使该功能或变化成为主软件的一部分。这样，每个开发者都可以在自己的变化集上工作，直到变化准备就绪，而不会影响其他开发者。

<!-- But once one developer has merged their changes into the main branch, what happens to the other developers'' branches? They are now diverging from an older copy of the main branch. How will the developer on the later branch know if their changes are compatible with the current state of the main branch? That is one of the fundamental questions we will be trying to answer in this part.-->
但是一旦一个开发者将他们的更改合并到主分支中，其他开发者的分支会发生什么？它们现在正在从主分支的较旧副本中分离。后面分支上的开发者如何知道他们的更改是否与主分支的当前状态兼容？这是我们在本部分将试图解答的基本问题之一。

<!-- You can read more about branches e.g. from [here](https://www.atlassian.com/git/tutorials/using-branches).-->
你可以从[这里](https://www.atlassian.com/git/tutorials/using-branches)阅读更多关于分支的内容。

#### Pull request

<!-- In GitHub merging a branch back to the main branch of software is quite often happening using a mechanism called [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests), where the developer who has done some changes is requesting the changes to be merged to the main branch. Once the pull request, or PR as it''s often called, is made or <i>opened</i>, another developer checks that all is ok and <i>merges</i> the PR.-->
在GitHub中，使用一种称为[拉取请求](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests)的机制，经常会将分支合并回软件的主分支。一旦拉取请求（通常简称为PR）被<i>打开</i>，另一个开发人员会检查一切正常，并<i>合并</i>PR。

<!-- If you have proposed changes to the material of this course, you have already made a pull request!-->
如果你已经对本课程的材料提出了更改，你已经提交了一个 pull request！

#### Build

<!-- The term "build" has different meanings in different languages. In some interpreted languages such as Python or Ruby, there is actually no need for a build step at all.-->
在不同的语言中，“构建”这个词有不同的含义。在一些解释型语言，如Python或Ruby，实际上根本不需要构建步骤。

<!-- In general when we talk about building we mean preparing software to run on the platform where it's intended to run. This might mean, for example, that if you've written your application in TypeScript, and you intend to run it on Node, then the build step might be transpiling the TypeScript into JavaScript.-->
一般来说，当我们谈论构建时，我们指的是准备在其预期运行的平台上运行软件。例如，如果您使用TypeScript编写了应用程序，并且您打算在Node上运行它，那么构建步骤可能是将TypeScript转译为JavaScript。

<!-- This step is much more complicated (and required) in compiled languages such as C and Rust where the code needs to be compiled into an executable.-->
这一步在像C和Rust这样的编译语言中要复杂得多（也是必须的），因为代码需要被编译成可执行文件。

<!-- In [part 7](/en/part7/webpack) we had a look at [Webpack](https://webpack.js.org/) that is the current de facto tool for building a production version of a React or any other frontend JavaScript or TypeScript codebase.-->
在[第7章节](/en/part7/webpack)中，我们研究了[Webpack](https://webpack.js.org/)，它是当前用于构建React或任何其他前端JavaScript或TypeScript代码库的生产版本的默认工具。

#### Deploy

<!-- Deployment refers to putting the software where it needs to be for the end-user to use it. In the case of libraries, this may simply mean pushing an npm package to a package archive (such as [npmjs.com](https://www.npmjs.com/)) where other users can find it and include it in their software.-->
部署指的是将软件放置在最终用户可以使用它的地方。 就库而言，这可能只意味着将npm包推送到包存档（例如[npmjs.com](https://www.npmjs.com/)），其他用户可以在其中找到它并将其包含在自己的软件中。

<!-- Deploying a service (such as a web app) can vary in complexity. In [part 3](/en/part3/deploying_app_to_internet) our deployment workflow involved running some scripts manually and pushing the repository code to [Fly.io](https://fly.io/) or [Render](https://render.com/) hosting service.-->
部署服务（如网络应用）的复杂程度可能不同。在[第三部分](/en/part3/deploying_app_to_internet)中，我们的部署工作流程涉及手动运行一些脚本，并将存储库代码推送到[Fly.io](https://fly.io/)或[Render](https://render.com/)托管服务。

<!-- In this part, we''ll develop a simple "deployment pipeline" that deploys each commit of your code automatically to Fly.io or Render <i>if</i> the committed code does not break anything.-->
在这一部分中，我们将开发一个简单的“部署管道”，如果提交的代码没有破坏任何东西，就会自动将每次提交的代码部署到Fly.io或Render。

<!-- Deployments can be significantly more complex, especially if we add requirements such as "the software must be available at all times during the deployment" (zero downtime deployments) or if we have to take things like [database migrations](/en/part13/migrations_many_to_many_relationships#migrations) into account. We won't cover complex deployments like those in this part but it's important to know that they exist.-->
部署可能会更加复杂，特别是如果我们添加了要求，比如“软件在部署期间必须一直可用”（零停机部署）或者我们必须考虑[数据库迁移](/en/part13/migrations_many_to_many_relationships#migrations)等事情。 我们不会在本部分中涵盖像这样的复杂部署，但是要知道它们的存在是很重要的。

### What is CI?

<!-- The strict definition of CI (Continuous Integration) and the way the term is used in the industry may sometimes be different. One influential but quite early (written already in 2006) discussion of the topic is in [Martin Fowler''s blog](https://www.martinfowler.com/articles/continuousIntegration.html).-->
CI（持续集成）的严格定义以及这个术语在行业中的使用方式有时会有所不同。2006年就已经写出的一篇具有影响力的讨论可以参考[Martin Fowler的博客](https://www.martinfowler.com/articles/continuousIntegration.html)。

<!-- Strictly speaking, CI refers to <a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>merging developer changes to the main branch</a> often, Wikipedia even helpfully suggests: "several times a day". This is usually true but when we refer to CI in industry, we''re quite often talking about what happens after the actual merge happens.-->
按照严格的说法，CI指的是<a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>将开发者的更改合并到主分支</a>，甚至维基百科有帮助地建议：“每天几次”。这通常是正确的，但是当我们在行业中提到CI时，我们通常在谈论实际合并发生后发生的事情。

<!-- We''d likely want to do some of these steps:-->
我们可能想要做一些这些步骤：
<!--  - Lint: to keep our code clean and maintainable-->
- 代码清理：为了保持我们的代码干净、可维护。
<!--  - Build: put all of our code together into runnable software bundle-->
- 编译：将我们的所有代码组装成可运行的软件包
<!--  - Test: to ensure we don''t break existing features-->
- 测试：以确保我们不会破坏现有功能
<!--  - Package: Put it all together in an easily movable batch-->
- 把它们全部放在一个容易搬动的批次中
<!--  - Deploy: Make it available to the world-->
- 部署：让它对全世界可用

<!-- We'll discuss each of these steps (and when they're suitable) in more detail later. What is important to remember is that this process should be strictly defined.-->
我们稍后将更详细地讨论这些步骤（以及何时合适）。重要的是要记住，这个过程应该是严格定义的。

<!-- Usually, strict definitions act as a constraint on creativity/development speed. This, however, should usually not be true for CI. This strictness should be set up in such a way as to allow for easier development and working together. Using a good CI system (such as GitHub Actions that we''ll cover in this part) will allow us to do this all automagically.-->
通常，严格的定义会对创造力/发展速度产生约束。然而，这通常不应该是CI的真实情况。这种严格应该以这样的方式设置，以便于更容易的开发和共同工作。使用一个好的CI系统（比如我们将在本部分介绍的GitHub Actions），将允许我们自动完成所有这些任务。

### Packaging and Deployment as a part of CI

<!-- It may be worthwhile to note that packaging and especially deployment are sometimes not considered to fall under the umbrella of CI. We''ll add them in here because in the real world it makes sense to lump it all together. This is partly because they make sense in the context of the flow and pipeline (I want to get my code to users) and partially because these are in fact the most likely point of failure.-->
可能值得注意的是，打包和部署有时不被视为持续集成的范围。我们在这里将它们放在一起，因为在现实世界中，这是有意义的。这部分是因为它们在流程和管道的背景下是有意义的（我想把我的代码发送给用户），部分是因为这些实际上是最有可能出现故障的点。

<!-- The packaging is often an area where issues crop up in CI as this isn't something that's usually tested locally. It makes sense to test the packaging of a project during the CI workflow even if we don''t do anything with the resulting package. With some workflows, we may even be testing the already built packages. This assures us that we have tested the code in the same form as what will be deployed to production.-->
包装通常是CI中出现问题的一个领域，因为这通常不是本地测试的内容。 在CI工作流程期间测试项目的包装是有意义的，即使我们不对生成的包做任何事情。 对于某些工作流程，我们甚至可能正在测试已经构建的软件包。 这可以确保我们以与部署到生产环境相同的形式测试了代码。

<!-- What about deployment then? We'll talk about consistency and repeatability at length in the coming sections but we'll mention here that we want a process that always looks the same, whether we're running tests on a development branch or the main branch. In fact, the process may <i>literally</i> be the same with only a check at the end to determine if we are on the main branch and need to do a deployment. In this context, it makes sense to include deployment in the CI process since we'll be maintaining it at the same time we work on CI.-->
那么部署呢？我们会在接下来的章节中详细讨论一致性和可重复性，但是我们在这里提到，我们希望过程总是看起来一样，无论我们是在开发分支上运行测试还是在主分支上运行测试。事实上，过程可能<i>实际上</i>是相同的，只有在最后一次检查时才能确定我们是否在主分支上，并且需要进行部署。在这种情况下，将部署包含在CI过程中是有意义的，因为我们将在同一时间维护它。

#### Is this CD thing related?

<!-- The terms <i>Continuous Delivery</i> and <i>Continuous Deployment</i> (both of which have the acronym CD) are often used when one talks about CI that also takes care of deployments. We won''t bore you with the exact definition (you can use e.g. [Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery) or [another Martin Fowler blog post](https://martinfowler.com/bliki/ContinuousDelivery.html)) but in general, we refer to CD as the practice where the main branch is kept deployable at all times. In general, this is also frequently coupled with automated deployments triggered from merges into the main branch.-->
<i>持续交付</i>和<i>持续部署</i>(两者均有缩写CD)经常在谈论CI时被使用，同时也关注部署。我们不会给你讲具体定义（你可以参考[维基百科](https://en.wikipedia.org/wiki/Continuous_delivery)或[另一篇Martin Fowler博客文章](https://martinfowler.com/bliki/ContinuousDelivery.html))，但总的来说，我们把CD指的是主分支始终保持可部署的实践。通常这也会与从主分支合并触发自动部署结合在一起。

<!-- What about the murky area between CI and CD? If we, for example, have tests that must be run before any new code can be merged to the main branch, is this CI because we're making frequent merges to the main branch, or is it CD because we're making sure that the main branch is always deployable?-->
那么，持续集成和持续交付之间的模糊领域怎么办？例如，如果我们必须在将任何新代码合并到主分支之前运行测试，这是持续集成，因为我们经常合并到主分支，还是持续交付，因为我们确保主分支始终可以部署？

<!-- So, some concepts frequently cross the line between CI and CD and, as we discussed above, deployment sometimes makes sense to consider CD as part of CI. This is why you'll often see references to CI/CD to describe the entire process. We'll use the terms "CI" and "CI/CD" interchangeably in this part.-->
所以，一些概念经常跨越CI和CD的界限，正如我们上面讨论的，部署有时候可以把CD作为CI的一部分来考虑。这就是为什么你经常会看到提及CI/CD来描述整个过程。我们会在这一部分中交替使用“CI”和“CI/CD”这两个术语。

### Why is it important?

<!-- Above we talked about the "works on my machine" problem and the deployment of multiple changes, but what about other issues. What if Alice committed directly to the main branch? What if Bob used a branch but didn''t bother to run tests before merging? What if Charlie tries to build the software for production but does so with the wrong parameters?-->
上面我們討論了“在我的機器上運行”問題和部署多個更改，但是其他問題呢？如果Alice直接提交到主分支怎麼辦？如果Bob使用分支但沒有執行測試就合併怎麼辦？如果Charlie嘗試為生產編譯軟件但使用了錯誤的參數怎麼辦？

<!-- With the use of continuous integration and systematic ways of working, we can avoid these.-->
通过使用持续集成和系统化的工作方式，我们可以避免这些问题。
<!--  - We can disallow commits directly to the main branch-->
我们可以禁止直接提交到主分支
<!--  - We can have our CI process run on all Pull Requests (PRs) against the main branch and allow merges only when our desired conditions are met e.g. tests pass-->
- 我们可以在主分支上的所有拉取请求（PR）上运行我们的CI过程，并且只有在我们期望的条件满足时才允许合并，例如测试通过。
<!--  - We can build our packages for production in the known environment of the CI system-->
我们可以在CI系统已知的环境中构建我们的生产包。

<!-- There are other advantages to extending this setup:-->
**本设置的延伸还有其他优势：**
<!--  - If we use CI/CD with deployment every time there is a merge to the main branch, then we know that it will always work in production-->
如果我们每次合并到主分支时都使用持续集成/持续交付（CI/CD）进行部署，那么我们就知道它在生产环境中总是可以正常工作的。
<!--  - If we only allow merges when the branch is up to date with the main branch, then we can be sure that different developers don't overwrite each other's changes-->
.

如果我们只允许在分支与主分支保持同步时才进行合并，那么我们可以确保不同开发者不会覆盖彼此的更改。

<!-- Note that in this part we are assuming that the main branch (named <i>master</i> or <i>main</i>) contains the code that is running in production. There are numerous different [workflows](https://www.atlassian.com/git/tutorials/comparing-workflows) one can use with Git, e.g. in some cases, it may be a specific <i>release branch</i> that contains the code which is running in production.-->
注意，在这一部分中，我们假设主分支（名为<i>master</i>或<i>main</i>）包含正在生产中运行的代码。使用Git可以使用许多不同的[工作流程](https://www.atlassian.com/git/tutorials/comparing-workflows)，例如，在某些情况下，可能是一个特定的<i>发布分支</i>，其中包含正在生产中运行的代码。

### Important principles

<!-- It''s important to remember that CI/CD is not the goal. The goal is better, faster software development with fewer preventable bugs and better team cooperation.-->
**这很重要要记住，CI/CD不是目标，目标是更好、更快的软件开发，更少的可预防的 bug，更好的团队合作。**

<!-- To that end, CI should always be configured to the task at hand and the project itself. The end goal should be kept in mind at all times. You can think of CI as the answer to these questions:-->
至此，持续集成应该总是配置在当前任务和项目本身上。最终目标应该时刻放在心中。你可以把持续集成想象成对于下列问题的答案：
<!--  - How to make sure that tests run on all code that will be deployed?-->
- 如何确保所有要部署的代码都能够运行测试？
<!--  - How to make sure that the main branch is deployable at all times?-->
- 如何确保主分支始终可部署？
<!--  - How to ensure that builds will be consistent and will always work on the platform it''d be deploying to?-->
- 如何确保构建的一致性，并始终在要部署的平台上正常工作？
<!--  - How to make sure that the changes don''t overwrite each other?-->
- 如何确保更改不会互相覆盖？
<!--  - How to make deployments happen at the click of a button or automatically when one merges to the main branch?-->
- 如何在一键触发或者当合并到主分支时自动发布？

<!-- There even exists scientific evidence on the numerous benefits the usage of CI/CD has. According to a large study reported in the book [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://itrevolution.com/book/accelerate/), the use of CI/CD correlate heavily with organizational success (e.g. improves profitability and product quality, increases market share, shortens the time to market). CI/CD even makes developers happier by reducing their burnout rate. The results summarized in the book are also reported in scientific articles such as [this](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2681909).-->
根据《加速：精益软件开发与DevOps的科学》一书中的一项大型研究，使用CI / CD与组织成功有重大关系（例如提高盈利能力和产品质量，增加市场份额，缩短上市时间）。CI / CD甚至使开发人员更加快乐，减少了他们的疲劳率。该书中的结果也在[这篇文章](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2681909)中报道。关于使用CI / CD的众多好处，甚至存在科学证据。
#### Documented behavior

<!-- There's an old joke that a bug is just an "undocumented feature". We'd like to avoid that. We'd like to avoid any situations where we don't know the exact outcome. For example, if we depend on a label on a PR to define whether something is a "major", "minor" or "patch" release (we'll cover the meanings of those terms later), then it's important that we know what happens if a developer forgets to put a label on their PR. What if they put a label on after the build/test process has started? What happens if the developer changes the label mid-way through, which one is the one that actually releases?-->
有一个老笑话说，一个错误只是一个“未文档化的功能”。我们希望避免这种情况。我们希望避免任何情况，我们不知道确切的结果。例如，如果我们依赖PR上的标签来定义某些内容是“主要”，“次要”还是“补丁”发布（我们稍后会讨论这些术语的含义），那么我们就需要知道如果开发人员忘记添加标签会发生什么。如果他们在构建/测试过程开始后才添加标签会发生什么？如果开发人员在过程中更改标签，哪个标签最终会发布？

<!-- It's possible to cover all cases you can think of and still have gaps where the developer will do something "creative" that you didn't think of, so it''s important to have the process fail safely in this case.-->
可能覆盖你能想到的所有情况，但仍然会有开发者做出你没有想到的“创造性”的事情的空缺，因此在这种情况下，重要的是要让过程安全失败。

<!-- For example, if we have the case mentioned above where the label changes midway through the build. If we didn't think of this beforehand, it might be best to fail the build and alert the user if something we weren't expecting happened. The alternative, where we deploy the wrong type of version anyway, could result in bigger problems, so failing and notifying the developer is the safest way out of this situation.-->
例如，如果我们有上述情况，标签在构建过程中改变。如果我们之前没有想到这一点，最好的办法可能是失败构建，如果发生了我们意想不到的事情，就提醒用户。另一种情况，我们最终部署错误类型的版本，可能会带来更大的问题，因此失败并通知开发人员是这种情况下最安全的出路。

#### Know the same thing happens every time

<!-- We might have the best tests imaginable for our software, tests that catch every possible issue. That's great, but they're useless if we don't run them on the code before it's deployed.-->
我们可能拥有最好的软件测试，可以捕获每一个可能的问题。这太棒了，但是如果我们没有在部署代码之前运行它们，那么它们将是无用的。

<!-- We need to guarantee that the tests will run and we need to be sure that they run against the code that will actually be deployed. For example, it's no use if the tests are <i>only</i> run against Alice's branch if they would fail after merging to the main branch. We're deploying from the main branch so we need to make sure that the tests are run against a copy of the main branch with Alice's changes merged in.-->
我们需要保证测试能够运行，并且要确保它们是针对将要部署的实际代码运行的。例如，如果测试只运行在爱丽丝分支上，但在合并到主分支后就会失败，那么这毫无用处。我们是从主分支部署的，因此我们需要确保测试是在包含爱丽丝的更改的主分支的副本上运行的。

<!-- This brings us to a critical concept. We need to make sure that the same thing happens every time. Or rather that the required tasks are all performed and in the right order.-->
这带我们来到一个关键概念。我们需要确保每次都发生同样的事情。或者说，必要的任务都要完成，而且顺序正确。

#### Code always kept deployable

<!-- Having code that''s always deployable makes life easier. This is especially true when the main branch contains the code running in the production environment. For example, if a bug is found and it needs to be fixed, you can pull a copy of the main branch (knowing it is the code running in production), fix the bug, and make a pull request back to the main branch. This is relatively straight forward.-->
有可随时部署的代码可以让生活变得更轻松。当主分支包含了在生产环境中运行的代码时，这尤其如此。例如，如果发现了一个 bug，需要修复它，你可以拉取一份主分支的副本（知道它是在生产环境中运行的代码），修复 bug，然后提交一个 pull request 回到主分支。这相对来说是相当直接的。

<!-- If, on the other hand, the main branch and production are very different and the main branch is not deployable, then you would have to find out what code <i>is</i> running in production, pull a copy of that, fix the bug, figure out a way to push it back, then work out how to deploy that specific commit. That''s not great and would have to be a completely different workflow from a normal deployment.-->
如果另一方面，主分支和生产环境非常不同，而且主分支不可部署，那么你就必须找出当前生产环境中运行的代码是什么，拉取一份副本，修复 bug，找到一种方法将其推回，然后弄清楚如何部署该特定提交。这样的工作流程肯定不如正常部署好。

#### Knowing what code is deployed (sha sum/version)

<!-- It's often important to know what is actually running in production. Ideally, as we discussed above, we'd have the main branch running in production. This is not always possible. Sometimes we intend to have the main branch in production but a build fails, sometimes we batch together several changes and want to have them all deployed at once.-->
通常很重要知道在生产环境中实际运行的是什么。理想情况下，正如我们上面讨论的，我们将主分支运行在生产环境中。这并不总是可能的。有时，我们打算将主分支部署到生产环境，但构建失败，有时我们将几个更改批量地放在一起，希望它们一次性部署。

<!-- What we need in these cases (and is a good idea in general) is to know exactly <i>what code is running in production</i>. Sometimes this can be done with a version number, sometimes it''s useful to have the commit SHA sum (uniquely identifying hash of that particular commit in git) attached to the code. We will discuss versioning further [a bit later in this part](/en/part11/keeping_green#versioning).-->
在这些情况下（一般来说）我们需要确切地知道<i>生产环境中正在运行的代码</i>。有时候可以通过版本号来实现，有时候附带提交的SHA和（git中唯一标识提交的哈希）对代码也很有用。我们将在[后面的部分](/en/part11/keeping_green#versioning)进一步讨论版本控制。

<!-- It is even more useful if we combine the version information with a history of all releases. If, for example, we found out that a particular commit has introduced a bug, we can find out exactly when that was released and how many users were affected. This is especially useful when that bug has written bad data to the database. We''d now be able to track where that bad data went based on the time.-->
如果我们把版本信息和所有发布版本的历史记录结合起来，那就更有用了。例如，如果我们发现某个提交引入了一个 bug，我们就可以确切地知道什么时候发布的，有多少用户受到影响。当这个 bug 写入了错误的数据到数据库时，这就变得尤其有用了。我们现在可以根据时间追踪那些错误数据去向了哪里。

### Types of CI setup

<!-- To meet some of the requirements listed above, we want to dedicate a separate server for running the tasks in continuous integration. Having a separate server for the purpose minimizes the risk that something else interferes with the CI/CD process and causes it to be unpredictable.-->
为了满足上述列出的一些要求，我们希望专门投入一台服务器来运行持续集成中的任务。专门投入一台服务器可以最大限度地减少其他东西干扰CI/CD流程，导致其变得不可预测的风险。

<!-- There are two options: host our own server or use a cloud service.-->
有两种选择：搭建自己的服务器或使用云服务。

#### Jenkins (and other self-hosted setups)

<!-- Among the self-hosted options, [Jenkins](https://www.jenkins.io/) is the most popular. It''s extremely flexible and-->
has a huge library of plugins.

在自托管选项中，[Jenkins](https://www.jenkins.io/)是最受欢迎的。它非常灵活，拥有巨大的插件库。
<!-- there are plugins for almost anything (except that one thing you want to do). This is a great option for many applications, using a self-hosted setup means that the entire environment is under your control, the number of resources can be controlled, secrets (we''ll elaborate a little more on security in later sections of this part) are never exposed to anyone else and you can do anything you want on the hardware.-->
有几乎任何东西(除了你想做的那件事)的插件。这对许多应用来说都是一个很好的选择，使用自托管设置意味着整个环境都在你的控制之下，资源的数量可以控制，秘密(我们将在本部分的后面章节中对安全性进行更详细的阐述)永远不会暴露给其他人，你可以在硬件上做任何你想做的事情。

<!-- Unfortunately, there is also a downside. Jenkins is quite complicated to set up. It's very flexible but that means that there's often quite a bit of boilerplate/template code involved to get builds working. With Jenkins specifically, it also means that CI/CD must be set up with Jenkins'' own domain-specific language. There are also the risks of hardware failures which can be an issue if the setup sees heavy use.-->
不幸的是，也有缺点。Jenkins设置起来相当复杂。它非常灵活，但这意味着通常需要很多样板/模板代码才能让构建工作。对于Jenkins来说，这也意味着必须使用Jenkins自己的域特定语言来设置CI / CD。还有硬件故障的风险，如果设置受到重度使用，可能会遇到问题。

<!-- With self-hosted options, the billing is usually based on the hardware. You pay for the server. What you do on the server doesn''t change the billing.-->
随着自托管选项，计费通常基于硬件。您支付服务器费用。您在服务器上所做的不会改变计费。

#### GitHub Actions and other cloud-based solutions

<!-- In a cloud-hosted setup, the setup of the environment is not something you need to worry about. It''s there, all you need to do is tell it what to do. Doing that usually involves putting a file in your repository and then telling the CI system to read the file (or to check your repository for that particular file).-->
在云托管的设置中，环境的设置不是你需要担心的事情。它就在那里，你所需要做的就是告诉它该做什么。这通常涉及将文件放入您的存储库，然后告诉CI系统读取该文件（或检查您的存储库以获取该特定文件）。

<!-- The actual CI config for the cloud-based options is often a little simpler, at least if you stay within what is considered "normal" usage. If you want to do something a little bit more special, then cloud-based options may become more limited, or you may find it difficult to do that one specific task for which the cloud platform just isn''t built for.-->
实际的CI配置对于基于云的选项通常会简单一些，至少如果你停留在所谓的“正常”使用范围内的话。如果你想做一些更特别的事情，那么基于云的选项可能会变得更加受限，或者你可能会发现很难为那个特定的任务做到，因为云平台并不是专门为此而构建的。

<!-- In this part, we''ll look at a fairly normal use case. The more complicated setups might, for example, make use of specific hardware resources, e.g. a GPU.-->
在這一部分，我們將看看一個相當正常的案例。更複雜的設置可能會使用特定的硬件資源，例如GPU。

<!-- Aside from the configuration issue mentioned above, there are often resource limitations on cloud-based platforms. In a self-hosted setup, if a build is slow, you can just get a bigger server and throw more resources at it. In cloud-based options, this may not be possible. For example, in [GitHub Actions](https://github.com/features/actions), the nodes your builds will run on have 2 vCPUs and 8GB of RAM.-->
除了上面提到的配置问题外，基于云的平台通常也存在资源限制。在自托管设置中，如果构建速度慢，可以购买更大的服务器并投入更多的资源。在基于云的选项中，可能无法实现这一点。例如，在[GitHub Actions](https://github.com/features/actions)中，您的构建将运行的节点具有2个vCPU和8GB的RAM。

<!-- Cloud-based options are also usually billed by build time which is something to consider.-->
云端选项通常也是按照构建时间收费，这也是需要考虑的事情。

#### Why pick one over the other

<!-- In general, if you have a small to medium software project that doesn't have any special requirements (e.g. a need for a graphics card to run tests), a cloud-based solution is probably best. The configuration is simple and you don't need to go to the hassle or expense of setting up your own system. For smaller projects especially, this should be cheaper.-->
一般而言，如果你有一个中小型的软件项目，没有任何特殊要求（例如，需要一个显卡来运行测试），基于云的解决方案可能是最好的。配置非常简单，你不需要费心费力或花费去设置自己的系统。特别是对于较小的项目，这应该更便宜。

<!-- For larger projects where more resources are needed or in larger companies where there are multiple teams and projects to take advantage of it, a self-hosted CI setup is probably the way to go.-->
对于需要更多资源的大型项目或者有多个团队和项目可以利用的大公司，自托管CI设置可能是最佳选择。

#### Why use GitHub Actions for this course

<!-- For this course, we'll use [GitHub Actions](https://github.com/features/actions). It is an obvious choice since we're using GitHub anyway. We can get a robust CI solution working immediately without any hassle of setting up a server or configuring a third-party cloud-based service.-->
对于这门课程，我们将使用[GitHub Actions](https://github.com/features/actions)。由于我们已经在使用GitHub，这是一个明显的选择。我们可以立即获得强大的CI解决方案，而无需费心设置服务器或配置基于第三方云的服务。

<!-- Besides being easy to take into use, GitHub Actions is a good choice in other respects. It might be the best cloud-based solution at the moment. It has gained lots of popularity since its initial release in November 2019.-->
除了易于使用之外，GitHub Actions在其他方面也是一个不错的选择。它可能是目前最好的基于云的解决方案。自2019年11月首次发布以来，它获得了很多欢迎。

</div>

<div class="tasks">

### Exercise 11.1

<!-- Before getting our hands dirty with setting up the CI/CD pipeline let us reflect a bit on what we have read.-->
在我们开始设置CI/CD流水线之前，让我们先反思一下我们所读到的内容吧。

#### 11.1 Warming up

<!-- Think about a hypothetical situation where we have an application being worked on by a team of about 6 people. The application is in active development and will be released soon.-->
想象一个假设的情况，我们有一个由大约6人组成的团队正在开发一个应用程序。 该应用程序正在积极开发中，并将很快发布。

<!-- Let us assume that the application is coded with some other language than JavaScript/TypeScript, e.g. in  Python, Java, or Ruby. You can freely pick the language. This might even be a language you do not know much yourself.-->
让我们假设应用程序使用除JavaScript/TypeScript之外的其他语言编码，例如Python、Java或Ruby。你可以自由选择语言。甚至可以是你自己不太熟悉的语言。

<!-- Write a short text, say 200-300 words, where you answer or discuss some of the points below. You can check the length with https://wordcounter.net/. Save your answer to the file named <i>exercise1.md</i> in the root of the repository that you shall create in [exercise 11.2](/en/part11/getting_started_with_git_hub_actions#exercise-11-2).-->
# 讨论GitHub Actions

GitHub Actions是一种持续集成和部署解决方案，可让您在GitHub上自动执行任务。它可以帮助您构建，测试和部署代码，并与其他服务集成，以实现自动化。

GitHub Actions的最大优势之一是它可以节省时间，使您可以更快地完成工作。例如，如果您拥有一个GitHub存储库，可以设置一个工作流程，当您提交新代码时，该流程将自动执行构建，测试和部署操作。这样，您就可以节省大量时间，而不必手动执行这些操作。

另一个GitHub Actions的优势是它可以帮助您更轻松地与其他服务集成。例如，您可以设置一个工作流程，当您提交新代码时，它将自动将代码推送到您选择的云服务提供商，以便您可以轻松部署应用程序。

总而言之，GitHub Actions是一种强大的持续集成和部署工具，可以节省大量时间，帮助您更轻松地与其他服务集成。

# 讨论GitHub Actions

GitHub Actions是一种持续集成和部署解决方案，可以让您在GitHub上自动执行任务，为您提供构建，测试和部署代码的方便。其最大优势之一是可以节省大量时间，使您可以更快地完成工作。例如，您可以设置一个工作流程，当您提交新代码时，该流程将自动执行构建，测试和部署操作，从而节省了大量手动操作的时间。

另一个GitHub Actions的优势是它可以帮助您更轻松地与其他服务集成。例如，您可以设置一个工作流程，当您提交新代码时，它将自动将代码推送到您选择的云服务提供商，以便您可以轻松部署应用程序。

总而言之，GitHub Actions是一种强大的持续集成和部署工具，可以节省大量时间，帮助您更轻松地与其他服务集成。

<!-- The points to discuss:-->
# 要讨论的要点：
<!-- - Some common steps in a CI setup include <i>linting</i>, <i>testing</i>, and <i>building</i>. What are the specific tools for taking care of these steps in the ecosystem of the language you picked? You can search for the answers by google.-->
一些CI设置中的常见步骤包括<i>linting</i>、<i>testing</i>和<i>building</i>。在您选择的语言生态系统中，具体的工具可以负责这些步骤？您可以通过谷歌搜索答案。
<!-- - What alternatives are there to set up the CI besides Jenkins and GitHub Actions? Again, you can ask google!-->
- 除了Jenkins和GitHub Actions之外，还有什么替代方案可以用来搭建CI？再次提醒，你可以问谷歌！
<!-- - Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?-->
- 这个设置在自托管环境还是云端环境更好？为什么？需要什么信息来做出这一决定？

<!-- Remember that there are no 'right' answers to the above!-->
记住，上面没有“正确”的答案！

</div>
