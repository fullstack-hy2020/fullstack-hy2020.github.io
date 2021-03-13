---
mainImage: ../../../images/part-11.svg
part: 11
letter: a
lang: zh
---

<div class="content">

<!-- During this part, you will build a robust deployment pipeline to a ready made [example project](https://github.com/smartlyio/full-stack-open-pokedex) starting in [exercise 11.2](/en/part11/getting_started_with_git_hub_actions#exercise-11-2). You will [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) the example project and that will create you a personal copy of the repository. In the [last two](/en/part11/expanding_further#exercises-11-20-22) exercises, you will build another deployment pipeline for some of <i>your own</i> previously created app! -->

在本章中，你将构建一个健壮的部署管道pipeline，以便从[练习11.2](/en/part11/getting_started_with_git_hub_actions#exercise-11-2)开始构建一个现成的[示例项目](https://github.com/smartlyio/full-stack-open-pokedex) 。你将为示例项目创建一个[fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)，这将为您创建一个仓库的私人副本。在最后两个练习中，你将为自己以前创建的应用程序构建另一个部署管道！

<!-- There are 22 exercises in this part, and you need to complete <i>each</i> exercise for completing the course. Exercises are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-cicd) just like in the previous parts, but unlike parts 0 to 9, the submission goes to a different "course instance".  -->
本章共有22个练习，你需要完成<i>每个</i>练习才能完成课程。与前面的章节一样，练习是通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-cicd) 提交的，但与0到9章节不同，提交的是一个不同的“课程实例”。

<!-- This part will rely on many concepts covered in the previous parts of the course. It is recommended that you finish at least parts 0 to 5 before starting this part. -->
这一章节会依赖课程前面章节所涉及的许多概念。在开始这个章节之前，建议你至少完成0到5章的学习。

<!-- Unlike the other parts of this course, you do not write many lines of code in this part, it is much more about configuration. Debugging code might be hard but debugging configurations is way harder, so in this part, you need lots of patience and discipline! -->
与本课程的其他章节不同，在本章节中你不会编写很多行代码，而是更多的是关于配置。调试代码可能很困难，但是调试配置要更困难，所以在这一章节中，你需要很多耐心和纪律！

### Getting software to production
让软件投入生产

<!-- Writing software is all well and good but nothing exists in a vacuum. Eventually, we'll need to deploy the software to production, i.e. give it to the real users. After that we need to maintain it, release new versions, and work with other people to expand that software. -->
编写软件固然很好，但是我们并非生活在真空中。最终，我们需要将软件部署到生产环境中，也就是说，将其提供给真正的用户。之后，我们需要维护它，发布新版本，并与其他人一起扩展该软件。

<!-- We've already used GitHub to store our source code, but what happens when we work within a team with more developers?  -->
我们已经学会使用 GitHub 来存储我们的源代码，但是当我们在一个团队中与更多的开发人员一起工作时会发生什么呢？

<!-- Many problems may arise when several developers are involved. The software might work just fine on <i>my computer</i>, but maybe some of the other developers are using a different operating system or different library versions. It is not uncommon that a code works just fine in one developer's machine but another developer can not even get it started. This is often called the "works on my machine" problem. -->
当涉及到几个开发人员时，可能会出现许多问题。这个软件可能在<i>我的电脑</i>上运行得很好，但是也许其他一些开发人员使用的是不同的操作系统或者不同的库版本。一个代码在一个开发人员的机器上运行良好，而另一个开发人员甚至无法启动它，这种情况并不罕见。这通常被称为“我的机器上明明能运行”问题。


<!-- There are also more involved problems. If two developers are both working on changes and they haven't decided on a way to deploy to production, who's changes get deployed? How would it be possible to prevent one developer's changes from overwriting another's?  -->
还有一些更复杂的问题。如果两个开发人员都在进行更改，但他们还没有决定部署到生产环境的方法，那么谁来部署更改？如何才能防止一个开发人员的更改覆盖另一个开发人员的更改？

<!-- In this part, we'll cover ways to work together and build and deploy software in a strictly defined way so that it's clear <i>exactly</i> what will happen under any given circumstance. -->
在这一章节中，我们将讨论如何以严格定义的方式共同工作、构建和部署软件，以便清楚地了解在任何给定的情况下会发生什么。

### Some useful terms
一些有用的术语

<!-- In this part we'll be using some terms you may not be familiar with or you may not have a good understanding of. We'll discuss some of these terms here. Even if you are familiar with the terms, give this section a read so when we use the terms in this part, we're on the same page. -->
在这一章节，我们将使用一些你可能不熟悉或你可能没有很好的理解的术语。我们将在这里讨论其中的一些术语。即使你熟悉这些术语，也请仔细阅读这一章节，这样当我们使用这一章节中的术语时，我们就能达成共识。

#### Branches
分支

<!-- Git allows multiple copies, streams, or versions of the code to co-exist without overwriting each other. When you first create a repository, you will be looking at the main branch (usually in git, we call this <i>master</i> or <i>main</i>, but that does vary in older projects). This is fine if there's only one developer for a project and that developer only works on one feature at a time. -->
Git 允许代码的多个副本、流或版本共存，而不会相互覆盖。当你第一次创建代码库时，你将看到主分支(通常在 git 中，我们称之为<i>master</i> 或 <i>main</i>，但是在旧的项目中这是不同的)。如果一个项目只有一个开发人员，而且开发人员一次只处理一个特性，那么这样做是没有问题的。


<!-- Branches are useful when this environment becomes more complex. In this context, each developer can have one or more branches. Each branch is effectively a copy of the main branch with some changes that make it diverge from the master. Once the feature or change in the branch is ready it can be <i>merged</i> back into the main branch, effectively making that feature or change part of the main software. In this way, each developer can work on their own set of changes and not affect any other developer until the changes are ready.  -->
当这个环境变得更复杂时，分支就派上了用场。在这种情况下，每个开发人员可以有一个或多个分支。每个分支实际上都是主分支的一个副本，但有一些修改使其偏离主分支。一旦分支中的特性或更改准备就绪，它就可以合并<i>merged</i>回主分支，能有效地使该特性或更改成为主软件的一部分。通过这种方式，每个开发人员可以处理自己的一组更改，并且在更改准备就绪之前不会影响其他开发人员。

<!-- But once one developer has merged their changes into the main branch, what happens to the other developers' branches? They are now diverging from an older copy of the main branch. How will the developer on the later branch know if their changes are compatible with the current state of the main branch? That is one of the fundamental questions we will be trying to answer in this part. -->
但是，一旦一个开发人员将他们的变更合并到主分支中，其他开发人员的分支会发生什么呢？它们现在脱离了主分支的旧版本。后一个分支上的开发人员如何知道他们的更改是否与主分支的当前状态兼容？这是我们将在这一章节试图回答的基本问题之一。

<!-- You can read more about branches e.g. from [here](https://www.atlassian.com/git/tutorials/using-branches). -->
你可以从[这里](https://www.atlassian.com/git/tutorials/using-branches)了解更多有关分支的信息。

#### Pull request
拉取请求

<!-- In GitHub merging a branch back to the main branch of software is quite often happening using a mechanism called [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests), where the developer who has done some changes is requesting the changes to be merged to the main branch. Once the pull request, or PR as it's often called, is made or <i>opened</i>, another developer checks that all is ok and <i>merges</i> the PR. -->
在 GitHub 中，通过一种叫做 [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests) 的机制，将一个分支合并回软件的主分支，这种情况经常发生，在这种机制中，做了一些修改的开发人员要求将这些改变合并到主分支。一旦拉请求，或者通常所说的 PR，被提出或者 <i>opened</i>，另一个开发人员会检查一切是否正常，然后合并<i>merge</i>  PR。


<!-- If you have proposed changes to the material of this course, you have already made a pull request! -->
如果你对本课程的材料提出了修改建议，那么你已经提出了一个PR！

#### Build
构建

<!-- The term "build" has different meanings in different languages. In some interpreted languages such as Python or Ruby , there is actually no need for a build step at all.  -->
“ build”一词在不同的语言中有不同的含义。在诸如 Python 或 Ruby 之类的解释性语言中，实际上根本不需要构建步骤。

<!-- In general when we talk about building we mean preparing software to run on the platform where it's intended to run. This might mean, for example, that if you've written your application in TypeScript, and you intend to run it on Node, then the build step might be transpiling the TypeScript into JavaScript.  -->
一般来说，当我们谈论构建的时候，我们指的是准备软件在它要运行的平台上运行。这可能意味着，例如，如果你已经用TypeScript编写了应用程序，并且打算在 Node 上运行它，那么构建步骤可能会将TypeScript 转化为 JavaScript。

<!-- This step is much more complicated (and required) in compiled languages such as C and Rust where the code needs to be compiled into an executable. -->
在 C 和 Rust 等编译语言中，这个步骤要复杂得多(也是必需的) ，因为这些语言中的代码需要编译成可执行文件。

<!-- In [part 7](/en/part7/webpack) we had a look at [webpack](https://webpack.js.org/) that is the current de facto tool for building a production version of a React or any other frontend JavaScript or TypeScript codebase. -->
在[第七章](/zh/part7/webpack)，我们介绍了  [webpack](https://webpack.js.org/) ，它是目前构建 React 或其他前端 JavaScript 或 TypeScript 代码库的事实工具。

#### Deploy
部署

<!-- Deployment refers to putting the software where it needs to be for the end-user to use it. In the case of libraries, this may simply mean pushing an npm package to a package archive (such as npmjs.com) where other users can find it and include it in their software.  -->
部署是指将软件放置在最终用户需要使用它的地方。对于库，这可能仅仅意味着将一个 npm 包推送到一个包存档网站(例如 npmjs.com) ，其他用户可以在其中找到它并将其引用到他们的软件中。

<!-- Deploying a service (such as a web app) can vary in complexity. In [part 3](/en/part3/deploying_app_to_internet) our deployment workflow involved running some scripts manually and pushing the repository code to [Heroku](https://www.heroku.com/) hosting service. -->
部署服务(比如 web 应用程序)的复杂程度各不相同。在[第3章](/zh/part3/deploying_app_to_internet)中，我们的部署工作流程包括手动运行一些脚本，并将存储库代码推送到 [Heroku](https://www.heroku.com/)  主机服务。

<!-- In this part, we'll develop a simple "deployment pipeline" that deploys each commit of your code automatically to Heroku <i>if</i> the committed code does not break anything. -->
在这一章节中，我们将开发一个简单的“部署管道” ，如果提交的代码没有破坏任何东西，那么将代码的每次提交都自动部署到 Heroku。

<!-- Deployments can be significantly more complex, especially if we add requirements such as "the software must be available at all times during the deployment" (zero downtime deployments) or if we have to take things like database migrations into account. We won't cover complex deployments like those in this part but it's important to know that they exist. -->
部署可能会复杂得多，特别是如果我们添加一些需求，比如“在部署期间，软件必须始终可用”(零停机时间部署) ，或者如果我们必须考虑数据库迁移之类的事情。我们不会在这章节讨论复杂的部署，但是知道它们的存在是很重要的。

### What is CI?
什么是 CI？

<!-- The strict definition of CI (Continuous Integration) and the way the term is used in the industry are quite different. One influental but quite early (from year 2006) discussion of the topic is in . -->
持续集成的严格定义和行业中使用该术语的方式是完全不同的。马丁 · 福勒(Martin Fowler)的[博客](https://www.martinfowler.com/articles/continuousIntegration.html)中有一个有影响但相当早(从2006年开始)的关于此话题的讨论。

<!-- Strictly speaking, CI refers to <a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>merging developer changes to the main branch</a> often, Wikipedia even helpfully suggests: "several times a day". This is usually true but when we refer to CI in industry, we're usually talking about what happens after the actual merge happens. -->
严格地说，CI 指的是经常<a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>将开发人员的更改合并到主分支</a>，维基百科甚至建议: “一天几次”。这通常是正确的，但当我们在工业中提到 CI 时，我们通常谈论的是实际合并发生之后会发生什么。


<!-- We'd likely want to do some of these steps: -->
我们可能会采取以下一些措施:
 <!-- - Lint: to keep our code clean and maintainable
 - Build: put all of our code together into software
 - Test: to ensure we don't break existing features
 - Package: Put it all together in an easily movable batch
 - Upload/Deploy: Make it available to the world -->

 - Lint: 保持代码的清洁和可维护性
 - 构建Build: 将我们所有的代码集中到软件中
 - 测试Test: 确保我们不破坏现有功能
 - 打包Package: 将所有材料放置在一个容易移动的批处理中
 - 上传/部署Upload/Deploy: 向全世界提供


We'll discuss each of these steps (and when they're suitable) in more detail later. What is important to remember is that this process should be strictly defined. 
稍后我们将更详细地讨论这些步骤(以及何时适合)。重要的是要记住，这个过程应该被严格定义。

<!-- Usually, strict definitions act as a constraint on creativity/development speed. This, however, should usually not be true for CI. This strictness should be set up in such a way as to allow for easier development and working together. Using a good CI system (such as GitHub Actions that we'll cover in this part) will allow us to do this all automagically. -->
通常，严格的定义会限制创新/开发的速度。然而，这一般不适用于 CI。这种严格的规定应当使开发和合作更加容易。使用一个好的 CI 系统(比如我们将在本章节中介绍的 GitHub Actions)将允许我们自动完成这一切。

### Packaging and Deployment as a part of CI
CI 的一部分——打包和部署

<!-- It may be worthwhile to note that packaging and especially deployment are sometimes not considered to fall under the umbrella of CI. We'll add them in here because in the real world it makes sense to lump it all together. This is partly because they make sense in the context of the flow and pipeline (I want to get my code to users) and partially because these are in fact the most likely point of failure. -->
可能值得注意的是，打包和部署（尤其）有时不被认为属于 CI 的范畴。我们把它们放在这里，因为在现实世界中，把它们放在一起是有意义的。这部分是因为它们在流和管道的上下文中是有意义的(我希望将我的代码提供给用户) ，部分是因为它们实际上是最有可能出现故障的地方。

<!-- The packaging is often an area where issues crop up in CI as this isn't something that's usually tested locally. It makes sense to test the packaging of a project during the CI workflow even if we don't do anything with the resulting package. With some workflows, we may even be testing the already built packages. This assures us that we have tested the code in the same form as what will be deployed to production. -->
打包通常是 CI 中突然出现问题的地方，因为这通常不是在本地测试的东西。在 CI 工作流程中测试项目的打包是有意义的，即使我们不对产生的包做任何事情。通过一些工作流，我们甚至可以测试已经构建的包。这向我们保证，我们已经测试了将部署到生产环境中的代码的相同形式。

<!-- What about deployment then? We'll talk about consistency and repeatability at length in the coming sections but we'll mention here that we want a process that always looks the same, whether we're running tests on a development branch or the master. In fact, the process may <i>literally</i> be the same with only a check at the end to determine if we are on the master branch and need to do a deployment. In this context, it makes sense to include deployment in the CI process since we'll be maintaining it at the same time we work on CI. -->
那部署怎么办？在接下来的部分中，我们将详细讨论一致性和可重复性，但在这里我们将提到，无论是在开发分支上还是在主分支上运行测试，我们都希望流程看起来总是相同的。实际上，这个过程可能<i>完全</i> 相同，只是在结尾处有一个检查，以确定我们是否在主分支上，是否需要进行部署。在这种情况下，将部署包含在 CI 流程中是有意义的，因为我们将在处理 CI 的同时维护它。

#### Is this CD thing related?
CD 是指的什么？

<!-- The terms <i>Continuous Delivery</i> and <i>Continuous Deployment</i> (both of which have the acronym CD) are often used when one talks about CI that also takes care of deployments. We won't bore you with the exact definition (you can use e.g. [Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery) or [Martin Fowler's another blog post](https://martinfowler.com/bliki/ContinuousDelivery.html)) but in general, we refer to CD as the practice where the master branch is kept deployable at all times. In general, this is also frequently coupled with automated deployments triggered from merges into the master/base branch. -->
持续交付<i>Continuous Delivery</i>和持续部署<i>Continuous Deployment</i>(两者的首字母缩写都是 CD)这两个术语经常被用来指代负责部署的 CI。我们不会给出确切的定义(你可以使用维基百科[Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery)或者 Martin Fowler 的另一篇[博客文章](https://martinfowler.com/bliki/ContinuousDelivery.html)) ，但是一般来说，我们把 CD 称为主分支在任何时候都可以部署的实践。通常，这也经常与从合并到主/基分支中触发的自动部署相结合。

<!-- What about the murky area between CI and CD? If we, for example, have tests that must be run before any new code can be merged to master, is this CI because we're making frequent merges to master, or is it CD because we're making sure that master is always deployable? -->
CI 和 CD 之间的模糊区域是什么？例如，如果我们在任何新代码可以被合并到 master 之前必须运行测试，那么这个 CI 是因为我们要经常合并到 master 中，还是 CD 是因为我们要确保 master 总是可部署的？

<!-- So, some concepts frequently cross the line between CI and CD and, as we discussed above, deployment sometimes makes sense to consider CD as part of CI. This is why you'll often see references to CI/CD to describe the entire process. We'll use the terms "CI" and "CI/CD" interchangeably in this part.  -->
因此，一些概念经常跨越 CI 和 CD 之间的界限，正如我们上面讨论的，部署有时候将 CD 视为 CI 的一部分是有意义的。这就是为什么你经常会看到对 CI/CD 的引用来描述整个过程。在本章节中，我们将交替使用“ CI”和“ CI/CD”这两个术语。

### Why is it important?
为什么它很重要？

<!-- Above we talked about the "works on my machine" problem and the deployment of multiple changes, but what about other issues. What if Alice committed directly to master? What if Bob used a branch but didn't bother to run tests before merging? What if Charlie tries to build the software for production but does so with the wrong parameters? -->
除了上面我们讨论了“在我的机器上还能跑”的问题和多个更改的部署问题，但是其他问题呢。如果Alice直接向主分支 commit 呢？如果 Bob 使用了一个分支，但是在合并之前没有运行测试会怎么样？如果 Charlie 试图构建用于生产的软件，但是用了错误的参数怎么办？

<!-- With the use of continuous integration and systematic ways of working, we can avoid these.  -->
通过使用持续集成和系统的工作方式，我们可以避免这些问题。
 <!-- - We can disallow commits directly to master
 - We can have our CI process run on all Pull Requests (PRs) against master and allow merges only when our desired conditions are met e.g. tests pass
 - We can build our packages for production in the known environment of the CI system -->
- 我们可以禁止直接向master的提交
- 我们可以让我们的 CI 程序在所有针对master的PR请求上运行，并且只有当我们所需的条件(如测试通过)得到满足时才允许合并
- 我们可以在 CI 系统的确定环境中构建我们的包

<!-- There are other advantages to extending this setup: -->
扩展这种还有其他好处:
 <!-- - If we use CD with deployment every time there is a merge to master then we know that master is always running in production
 - If we only allow merges when the branch has an up to date master, then we can be sure that different developers don't overwrite each other's changes -->
 - 如果我们每次在合并到 master 时使用 CD 部署，那么我们就知道 master 总是在生产中运行
 - 如果我们只允许在具有最新的master分支时进行合并，那么我们可以确保不同的开发人员不会覆盖彼此的更改

<!-- Note that in this part we are assuming that <i>master</i> or <i>main</i> branch contains the code that is running in production. The numerous different [workflows](https://www.atlassian.com/git/tutorials/comparing-workflows) one can use with git, e.g. in some cases, it may be a specific <i>release branch</i> that contains the code which is running in production. -->
请注意，在这一章节中，我们假设<i>master</i> 或 <i>main</i>分支只包含正在生产环境中运行的代码。Git 可以使用大量不同的工作流[workflows](https://www.atlassian.com/git/tutorials/comparing-workflows) ，例如，在某些情况下，它可能是一个特定的发布分支 <i>release branch</i>，其中包含正在生产环境中运行的代码。


### Important principles
重要原则

<!-- It's important to remember that CI/CD is not the goal. The goal is better, faster software development with fewer preventable bugs and better team cooperation.  -->
重要的是要记住 CI/CD 不是目标。目标是更好，更快的软件开发，更少的可预防的bug和更好的团队合作。

<!-- To that end, CI should always be configured to the task at hand and the project itself. The end goal should be kept in mind at all times. You can think of CI as the answer to these questions: -->
为此，CI 应该始终配置为手头的任务和项目本身。任何时候都应该牢记最终目标。你可以把 CI 看作是这些问题的答案:
 <!-- - How to make sure that tests run on all code that will be deployed?
 - How to make sure that the master branch is deployable at all times?
 - How to ensure that builds will be consistent and will always work on the platform it'd be deploying to?
 - How to make sure that the changes don't overwrite each other?
 - How to make deployments happen at the click of a button or automatically when one merges to master? -->
 - 如何确保测试在将要部署的所有代码上运行？
 - 如何确保主分支在任何时候都可部署？
 - 如何确保构建是一致的，并且始终能够在将要部署的平台上工作？
 - 如何确保更改不会互相覆盖？
 - 如何在单击一个按钮时进行部署，或者在合并到master时自动进行部署？


<!-- There even exists scientific evidence on the numerous benefits the usage of CI/CD has. According to a large study reported in the book [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://itrevolution.com/book/accelerate/), the use of CI/CD correlate heavily with organizational success (e.g. improves profitability and product quality, increases market share, shortens the time to market). CI/CD even makes developers happier by reducing their burnout rate. The results summarized in the book are also reported in scientific articles such as [this](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2681909). -->
甚至还有科学证据表明使用 CI/CD 有许多好处。根据 [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://itrevolution.com/book/accelerate/),一书中报道的一项大型研究，CI/CD 的使用与组织的成功密切相关(例如提高盈利能力和产品质量，增加市场份额，缩短上市时间)。CI/CD 甚至可以通过降低开发人员的倦怠率来使他们更加快乐。书中总结的结果也在诸如此类的[科学文章](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2681909)中有所报道。


#### Documented behavior
记录下来的行为

<!-- There's an old joke that a bug is just an "undocumented feature". We'd like to avoid that. We'd like to avoid any situations where we don't know the exact outcome. For example, if we depend on a label on a PR to define whether something is a "major", "minor" or "patch" release (we'll cover the meanings of those terms later), then it's important that we know what happens if a developer forgets to put a label on their PR. What if they put a label on after the build/test process has started? What happens if the developer changes the label mid-way through, which one is the one that actually releases? -->
有一个老笑话说，bug 只是一个“未记录的特性”。我们希望避免这种情况。我们希望避免任何我们不知道确切结果的情况。例如，如果我们依赖 PR 上的标签来定义某个版本是“主版本”、“次版本”还是“补丁版本”(我们稍后会讨论这些术语的含义) ，那么我们必须知道如果开发者忘记在 PR 上贴标签会发生什么。如果他们在构建/测试过程开始之后贴上标签会怎么样？如果开发人员中途更改了标签，那么实际发布的是哪个标签呢？

<!-- It's possible to cover all cases you can think of and still have gaps where the developer will do something "creative" that you didn't think of, so it's important to have the process fail safely in this case.  -->
可以覆盖所有你能想到的情况，但仍然有一些空白，开发人员将做一些你没有想到的“创新”的事情，所以在这种情况下，让过程安全地失败是很重要的。

<!-- For example, if we have the case mentioned above where the label changes midway through the build. If we didn't think of this beforehand, it might be best to fail the build and alert the user if something we weren't expecting happened. The alternative, where we deploy the wrong type of version anyway, could result in bigger problems, so failing and notifying the developer is the safest way out of this situation. -->
例如，如果我们有上面提到的情况，在构建过程中标签会发生变化。如果我们事先没有想到这一点，那么最好是让构建失败，并在出现我们没有预料到的情况时向用户发出警告。如果我们部署了错误类型的版本，那么可能会导致更大的问题，因此失败并通知开发人员是避免这种情况的最安全的方法。


#### Know the same thing happens every time
知道同样的事情每次都会发生

<!-- We might have the best tests imaginable for our software, tests that catch every possible issue. That's great, but they're useless if we don't run them on the code before it's deployed. -->
对于我们的软件，我们可能有最好的可以想象的测试，这些测试可以捕捉到所有可能的问题。这很好，但是如果我们在部署之前不在代码上运行它们，它们就毫无用处。

<!-- We need to guarantee that the tests will run and we need to be sure that they run against the code that will actually be deployed. For example, it's no use if the tests are <i>only</i> run against Alice's branch if they would fail after merging to master. We're deploying from the master so we need to make sure that the tests are run against a copy of master with Alice's changes merged in. -->
我们需要保证测试能够运行，并且我们需要确保测试能够针对实际部署的代码运行。例如，如果测试<i>只</i>针对 Alice 的分支运行，而且在合并为 master 后会失败，那么测试就毫无用处。我们正在从master部署测试，所以我们需要确保测试是针对一个master副本运行的，并将 Alice 的更改合并到master中。


<!-- This brings us to a critical concept. We need to make sure that the same thing happens every time. Or rather that the required tasks are all performed and in the right order. -->
这带给我们一个批判性的概念。我们需要确保同样的事情每次都会发生。或者更确切地说，所需的任务都以正确的顺序完成。

#### Code always kept deployable
代码总是可部署的

<!-- Having code that's always deployable (and provably so) makes life easier. This is especially so when the master branch contains the code running in the production environment. For example, if a bug is found and it needs to be fixed, you can pull a copy of master (knowing it is the code running in production), fix the bug, and make a pull request back to master. This is relatively straight forward.  -->
拥有总是可部署的代码(并且可以证明是可部署的)会让生活变得更容易。当主分支包含在生产环境中运行的代码时尤其如此。例如，如果发现了一个 bug 并且需要修复，你可以提取 master 的一个副本(知道它是正在生产中运行的代码) ，修复该 bug，并向 master 发出一个提取请求。这是相对直接的。

<!-- If, on the other hand, master and production are very different and master is not deployable, then you would have to find out what code <i>is</i> running in production, pull a copy of that, fix the bug, figure out a way to push it back, then work out how to deploy that specific commit. That's not great and would have to be a completely different workflow from a normal deployment. -->
另一方面，如果master和生产非常不同，master不可部署，那么你就必须找出生产中运行的代码，提取其副本，修复错误，找到推回错误的方法，然后研究如何部署特定的提交。这不是很好，而且必然是一个与正常部署完全不同的工作流。

#### Knowing what code is deployed (sha sum/version)
知道部署了哪些代码(sha sum/version)

<!-- It's often important to know what is actually running in production. Ideally, as we discussed above, we'd have master running in production. This is not always possible. Sometimes we intend to have master in production but a build fails, sometimes we batch together several changes and want to have them all deployed at once.  -->
了解生产过程中实际运行的内容通常很重要。理想情况下，正如我们上面所讨论的，我们生产中运行的是master 分支。这并不总是可能的。有时候我们想要将master跑到生产，但是构建失败了，有时候我们有一批变更并且希望同时部署它们。

<!-- What we need in these cases (and is a good idea in general) is to know exactly <i>what code is running in production</i>. Sometimes this can be done with a version number, sometimes it's useful to have the commit SHA sum (uniquely identifying hash of that particular commit in git) attached to the code. We will discuss versioning further [a bit later in this part](/en/part11/keeping_green#versioning). -->
在这些情况下，我们需要的(通常是一个好主意)是准确地知道<i>生产环境中运行的代码是什么</i>。有时可以使用版本号来完成，有时将提交 SHA sum (git 中特定提交的唯一标识散列)附加到代码中是有用的。我们将在本章节后面进一步讨论版本控制。

<!-- It is even more useful if we combine the version information with a history of all releases. If, for example, we found out that a particular commit has introduced a bug, we can find out exactly when that was released and how many users were affected. This is especially useful when that bug has written bad data to the database. We'd now be able to track where that bad data went based on the time. -->
如果我们将版本信息与所有发行版的历史记录结合起来，那么它会更加有用。例如，如果我们发现一个特定的提交引入了一个 bug，我们就可以准确地找出这个 bug 是什么时候发布的，以及有多少用户受到了影响。当 bug 向数据库中写入了错误数据时，这种方法尤其有用。我们现在可以根据时间跟踪坏数据去了哪里。

### Types of CI setup
CI 配置的种类

<!-- To meet some of the requirements listed above, we want to dedicate a separate server for running the tasks in continuous integration. Having a separate server for the purpose minimizes the risk that something else interferes with the CI/CD process and causes it to be unpredictable. -->
为了满足上面列出的一些需求，我们希望专用一个单独的服务器来运行持续集成中的任务。为此目的使用一个单独的服务器，可以最大限度地减少其他因素干扰 CI/CD 进程并导致其不可预测的风险。

<!-- There are two options: host our own server or use a cloud service. -->
有两种选择: 搭建我们自己的服务器或使用云服务。

#### Jenkins (and other self-hosted setups)
Jenkins（以及其他自我托管的配置）

<!-- Among the self-hosted options, [Jenkins](https://www.jenkins.io/) is the most popular. It's extremely flexible and there are plugins for almost anything (except that one thing you want to do). This is a great option for many applications, using a self-hosted setup means that the entire environment is under your control, the number of resources can be controlled, secrets (we'll elaborate a little more on security in later sections of this part) are never exposed to anyone else and you can do anything you want on the hardware. -->
在自我托管的配置中， [Jenkins](https://www.jenkins.io/)  是最受欢迎的。它非常灵活并且几乎所有的东西都有插件(除了你想做的一件事)。对于许多应用程序来说，这是一个很好的选择，使用自托管的设置意味着整个环境都在你的控制之下，资源的数量可以控制，secret (我们将在本章节后面的章节详细说明安全性)从不向任何人公开，你可以在硬件上做任何想做的事情。

<!-- Unfortunately, there is a downside. Jenkins is quite complicated to set up. It's very flexible but that means that there's often quite a bit of boilerplate/template code involved to get builds working. With Jenkins specifically, it also means that CI/CD must be set up with Jenkins' own domain-specific language. There are also the risks of hardware failures which can be an issue if the setup sees heavy use. -->
不幸的是，这也有不利的一面。Jenkins 的设置相当复杂。它非常灵活，但这意味着要使构建运转起来，通常需要相当多的样板/模板代码。对于 Jenkins 来说，这也意味着 CI/CD 必须使用 Jenkins 自己的领域特定语言。如果配置大量使用，还有硬件故障的风险，这可能会成为一个问题。

<!-- With self-hosted options, the billing is usually based on the hardware. You pay for the server. What you do on the server doesn't change the billing. -->
通过自主托管选项，账单通常基于硬件。你要为服务器付钱。你在服务器上所做的并不会让账单变化。

#### GitHub Actions and other cloud-based solutions
GitHub Actions 和其他基于云的解决方案

<!-- In a cloud-hosted setup, the setup of the environment is not something you need to worry about. It's there, all you need to do is tell it what to do. Doing that usually involves putting a file in your repository and then telling the CI system to read the file (or to check your repository for that particular file). -->
在云托管的设置中，你不需要担心环境的设置。它就在那里，你所需要做的就是告诉它该做什么。这通常包括将文件放入仓库，然后告诉 CI 系统读取该文件(或检查仓库中的特定文件)。


<!-- The actual CI config for the cloud-based options is often a little simpler, at least if you stay within what is considered "normal" usage. If you want to do something a little bit more special, then cloud-based options may become more limited, or you may find it difficult to do that one specific task for which the cloud platform just isn't built for. -->
如果你保持在“正常”使用范围内的话，实际的基于云的的 CI 配置通常要简单一些。如果你想做一些更特别的事情，那么基于云的选项可能会变得更加有限，或者你可能会发现很难完成一个特定的任务，因为云平台并不是为此而构建的。

<!-- In this part, we'll look at a fairly normal use case. The more complicated setups might, for example, make use of specific hardware resources, e.g. a GPU. -->
在这一章节中，我们将看到一个相当普通的用例。更复杂的设置可能，例如，使用特定的硬件资源，例如 GPU。

<!-- Aside from the configuration issue mentioned above, there are often resource limitations on cloud-based platforms. In a self-hosted setup, if a build is slow, you can just get a bigger server and throw more resources at it. In cloud-based options, this may not be possible. For example, in [GitHub Actions](https://github.com/features/actions), the nodes your builds will run on have 2 vCPUs and 8GB of RAM. -->
除了上面提到的配置问题之外，基于云的平台上经常存在资源限制。在自托管的设置中，如果构建速度很慢，你只需要获得一个更大的服务器并向其投入更多的资源。在基于云的选项中，这可能是不可能的。例如，在 GitHub Actions 中，你的构建将运行在2个 vcpu 和8 GB 内存的节点上。

<!-- Cloud-based options are also usually billed by build time which is something to consider. -->
基于云的选项通常也按构建时间计费，这是需要考虑的问题。

#### Why pick one over the other
如何取舍

<!-- In general, if you have a small to medium software project that doesn't have any special requirements (e.g. a need for a graphics card to run tests), a cloud-based solution is probably best. The configuration is simple and you don't need to go to the hassle or expense of setting up your own system. For smaller projects especially, this should be cheaper. -->
一般来说，如果你有一个中小型软件项目，它没有任何特殊的需求(例如需要一个显卡来运行测试) ，那么基于云的解决方案可能是最好的。配置很简单，省去了自己安装系统的麻烦或费用。特别是对于小型项目，这应该更便宜。

<!-- For larger projects where more resources are needed or in larger companies where there are multiple teams and projects to take advantage of it, a self-hosted CI setup is probably the way to go. -->
对于需要更多资源的大型项目，或者有多个团队和项目可以利用这些资源的大型公司，自我托管的 CI 设置可能是最好的方式。

#### Why use GitHub Actions for this course
为什么在这个课程中使用 GitHub Actions

<!-- For this course, we'll use [GitHub Actions](https://github.com/features/actions). It is an obvious choice since we're using GitHub anyway. We can get a robust CI solution working immediately without any hassle of setting up a server or configuring a third-party cloud-based service.  -->
在本课程中，我们将使用 [GitHub Actions](https://github.com/features/actions)。这是一个显而易见的选择，因为我们正在使用 GitHub。我们可以得到一个健壮的持续集成解决方案，立即工作，没有任何麻烦来设置服务器或配置第三方云服务。

<!-- Besides being easy to take into use, GitHub Actions is a good choice in other respects. It might be the best cloud-based solution at the moment. It has gained lots of popularity since its initial release in November 2019.  -->
除了易于使用之外，GitHub Actions 在其他方面也是一个不错的选择。它可能是目前最好的基于云的解决方案。自从2019年11月首次发布以来，它已经获得了广泛的欢迎。

</div>

<div class="tasks">

### Exercise 11.1

<!-- Before getting our hands dirty with setting up the CI/CD pipeline let us reflect a bit on what we have read.  -->
在开始设置 CI/CD 管道之前，让我们先回顾一下我们所读到的内容。

#### 11.1 warming up
热身

<!-- Think about a hypothetical situation where we have an application being worked on by a team of about 6 people. The application is in active development and will be released soon. -->
假设我们有一个由大约6个人组成的团队正在开发的应用程序。该应用程序正在积极开发中，不久将发布。

<!-- Let us assume that the application is coded with some other language than JavaScript/TypeScript, e.g. in  Python, Java, or Ruby. You can freely pick the language. This might even be a language you do not know much yourself. -->
让我们假设应用程序是用 JavaScript/TypeScript 以外的其他语言编码的，例如 Python、 Java 或 Ruby。你可以自由选择语言。这甚至可能是一种你自己不太懂的语言。

<!-- Write a short text, say 200-300 words, where you answer or discuss some of the points below. You can check the length with https://wordcounter.net/. Save your answer to the file named <i>exercise1.md</i> in the root of the repository that you shall create in [exercise 11.2](/en/part11/getting_started_with_git_hub_actions#exercise-11-2). -->
写一篇短文，比如说200-300个单词，在这里你回答或者讨论下面的一些观点。你可以用 https://wordcounter.net/ 来检查长度。将答案保存到将在[练习11.2](/zh/part11/getting_started_with_git_hub_actions#exercise-11-2)中创建的仓库根目录中，命名为 <i>exercise1.md</i>。

<!-- The points to discuss: -->
讨论要点:
<!-- - Some common steps in a CI setup include <i>linting</i>, <i>testing</i>, and <i>building</i>. What are the specific tools for taking care of these steps in the ecosystem of the language you picked? You can search for the answers by google.
- What alternatives are there to set up the CI besides Jenkins and GitHub Actions? Again, you can ask google!
- Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision? -->
- CI 设置中的一些常见步骤包括<i>linting</i>, <i>testing</i>, 以及 <i>building</i>。在你选择的语言的生态系统中，有哪些具体工具来处理这些步骤？你可以通过谷歌搜索答案。
- 除了 Jenkins 和 GitHub Actions 之外，还有什么其他方法可以设置 CI? 同样，你可以问 google！
- 在自主托管环境或基于云的环境中，这种设置会更好吗？为什么？你需要什么信息来做出这个决定？



<!-- Remember that there are no 'right' answers to the above!  -->
记住，上面的问题没有正确的答案！

<!-- **One more thing:** in exercise [11-19](/en/part11/expanding_further#exercise-11-19) you will need a <i>Slack webhook URL</i>.  It is better to ask it right away by email matti.luukkainen@helsinki.fi or in course [Telegram](https://t.me/fullstackcourse), ping @mluukkai
还有一件事: 在练习[11-19](/zh/part11/expanding_further#exercise-11-19)你需要一个 <i>Slack webhook URL</i>。最好是通过电子邮件 matti.luukkainen@helsinhelsinki.fi 或者是 [Telegram](https://t.me/fullstackcourse)中@mluukkai 来询问 -->
</div>
