---
mainImage: ../../../images/part-1.svg
part: 11
letter: a
lang: en
---

<div class="content">

Writing software is all well and good but nothing exists in a vacuum. Eventually, we'll need to deploy the software, maintain it, release new versions and work with other people to expand that software. We've already used git to keep our source code, but what happens when we work with more developers? 

If I build on my computer, the software works just fine, but maybe some of the other developers are using a different operating system, maybe different library versions. This is often called the "works on my machine" problem.

If we're both working on changes and we haven't decided on a way to deploy to production, who's changes get deployed, how do we prevent one developer's changes from overwriting another's? 

In this module, we'll cover ways to work together and build and deploy software in a strictly defined way so that it's clear *exactly* what will happen under any given circumstance.

### Some useful terms
In this module we'll be using some terms you may not be familiar with or you may not have a good understanding of. We'll discuss some of these terms here. Even if you are familiar with the terms, give this section a read so when we use the terms in this module, we're on the same page.

#### Branches
Git allows multiple copies, streams, or versions of the code to co-exist without overwriting eachother. When you first create a repository, you will be looking at the main branch (usually in git, we call this `master` or `main`, but that does vary in older projects). This is fine if there's only one developer for a project and that developer only works on one feature at a time.

Branches are useful when this environment becomes more complex. In this context each developer can have one or more branches. Each branch is effectively a copy of the main branch with some changes that make it diverge from master. Once the feature or change in the branch is ready it can be merged back into the main branch, effectively making that feature or change part of the main software. In this way each developer can work on their own set of changes and not affect any other developer until the changes are ready. 

But once one developer has merged their changes into the main branch, what happens to the other developers' branches? They are now diverging from an older copy of the main branch. How will the developer on the later branch know if their changes are compatible with the current state of the main branch? That is one of the fundamental questions we will be trying to answer in this module.

#### Build
The term 'build' has different meanings in different languages. In some languages, there is no need for a build step. 

In general when we talk about building we mean preparing software to run on the platform where it's intended to run. This might mean, for example, that if you've written your application in TypeScript, and you intend to run it on Node, then the build step might be transcoding the TS into JS.

This step is much more complicated (and required) in compiled languages where the code needs to be compiled into an executable.

#### Deploy
Deployment refers to putting the software where it needs to be for the end user to use it. In the case of libraries, this may simply mean pushing an npm package to a package archive (such as npmjs.com) where other users can find it and include it in their software. 

Deploying a service (such as a web app) can vary in complexity. In this module we'll cover a simple deployment (to a web based hosting service) where users can use the software simply by going to the URL. 

Deployments can be significantly more complex, especially if we add requirements such as "the software must be available at all times during the deployment" (zero downtime deployments) or if we have to take things like database migrations into account. We won't cover complex deployments like those in this module but it's important to know that they exist.

### What is CI?

The strict definition of CI (Continuous Integration) and the way the term is used in industry are quite different.

Strictly speaking, CI refers to <a href='https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment'>merging developer changes to a main branch</a> often, wikipedia even helpfully suggests: "several times a day". This is usually true but when we refer to CI in industry, we're usually talking about what happens after the actual merge happens.

We'd likely want to do some of these steps:
 - Lint: to keep our code clean and maintainable
 - Build: put all of our code together into software
 - Test: to ensure we don't break existing features
 - Package: Put it all together in an easily movable batch
 - Upload/Deploy: Make it available to the world

We'll discuss each of these steps (and when they're suitable) in more detail later. What is important to remember is that this process should be strictly defined. 

Usually strict definitions act as a constraint on creativity/development speed, this, however should usually not be true for CI. This strictness should be set up in such a way as to allow for easier development and working together. Using a good CI system (GitHub Actions is what we'll cover in this module) will allow us to do this all automagically.

### Packaging and Deployment as a part of CI

It may be worthwhile to note that packaging and especially deployment are sometimes considered to not fall under the umbrella of CI. We'll add them in here because in the real world it makes sense to lump it all together. This is partially because they make sense in the context of the flow and pipeline (I want to get my code to users) and partially because these are in fact the most likely point of failure.

Packaging is often an area where issues crop up in CI as this isn't something that's usually tested locally. It makes sense to test the packaging of a project during the CI workflow even if we don't do anything with the resultant package. With some workflows we may even be testing the already built packages. This assures us that we have tested the code in the same form as what will be deployed to production.

What about deployment then? We'll talk about consistency and repeatability at length in the coming sections but we'll mention here that we want a process that always looks the same, whether we're running tests on a development branch or on master. In fact the process may *literally* be the same with only a check at the end to determine if we are on master branch and need to do a deployment. In this context, it makes sense to include deployment in the CI process since we'll be maintaining it at the same time we work on CI.

#### Is this CD thing related?

Continuous Delivery (CD) is often an extension to CI. I won't bore you with the definition (you can use wikipedia just as well as I can) but in general we refer to CD as the practice where the master branch is kept deployable at all times. In general, this is also frequently coupled with automated deployments triggered from merges into the master/base branch.

What about the murky area between CI and CD? If, for example, we have tests that must run before any new code can be merged to master, is this CI because we're making frequent merges to master or is it CD because we're making sure that master is always deployable.

So, some concepts frequently cross the line between CI and CD and, as we discussed above, deployment sometimes makes sense to consider as part of CI. This is why you'll often see references to CI/CD to describe the entire process. We'll use the terms "CI" and "CI/CD" interchangably in this module. Do however note that we didn't add the term "CD" as an interchangable term. This is because, in general, deployment pipelines described as "CD" follow a particular pattern (outside the scope of this module) that we won't focus on.

### Why is it important?

Above we talked about the "works on my machine" problem and the deployment of multiple changes, but what about other issues. What if Alice committed directly to master? What if Bob used a branch but didn't bother to run tests before merging? What if Charlie tries to build the software for production but does so with the wrong parameters?

With CI we can avoid these. 
 - We can disallow commits directly to master
 - We can have our CI process run on all Pull Requests (PRs) against master and allow merges only when our desired conditions are met e.g. tests pass.
 - We can build our packages for production in the known environment of the CI system

There are other advantages to extending this setup:
 - If we use CD with deployment every time there is a merge to master then we know that master is always running in production.
 - If we only allow merges when the branch has an up to date master, then we can be sure that different developers don't overwrite eachother's changes.

### Important principles to remember and things to keep in mind

It's important to remember that CI/CD is not the goal. The goal is better, faster software development with fewer preventable bugs and better team cooperation. 

To that end, CI should always be configured to the task at hadn and the project itself. The end goal should be kept in mind at all times. You can think of CI as the answer to these questions:
 - How to I make sure that tests run on all code that will be deployed?
 - How do I make sure that my master branch is deployable at all times?
 - How do I ensure that my builds will be consistent and will always work on the platform it'd be deploying to?
 - How do I make sure that the changes don't overwrite each other?
 - How do I make deployments happen at the click of a button or automatically when I merge to master?

#### Documented behavior

There's an old joke that a bug is just an "undocumented feature". We'd like to avoid that. We'd like to avoid any situations where we don't know the exact outcome. For example, if we depend on a label on a PR to define whether something is a "major", "minor" or "patch" release (we'll cover the meanings of those terms later), then it's important that we know what happens if a developer forgets to put a label on their PR. What if they put a label on after the build/test process has started? What happens if the developer changes the label mid-way through, which one is the one that actually releases?

It's possible to cover all cases you can think of and still have gaps where the developer will do something "creative" that you didn't think of, so it's important to have the process fail safely in this case. 

For example, if we have the case mentioned above where the label changes mid way through the build. If we didn't think of this beforehand, it might be best to fail the build and alert the user if something we weren't expecting happened. The alternative, where we deploy the wrong type of version anyway, could result in bigger problems, so failing and notifying the developer is the safest way out of this situation.

#### Know the same thing happens every time

We might have the best tests imaginable for our software, tests that catch every possible issue. That's great, but they're useless if we don't run them on the code before it's deployed.

We need to guarantee that the tests will run and we need to be sure that they run against the code that will actually be deployed. For example, it's no use if the tests are run against Alice's branch if they would then fail if they're run against master after Alice's changes are merged. We're deploying from master so we need to make sure that the tests are run against a copy of master with Alice's changes merged in.

This brings us to a critical concept. We need to make sure that the same thing happens every time. Or rather that the required tasks are all performed and in the right order.

#### The same thing happens every time

Now, at first glance, this looks like the same point as the previous one, but (shock, awe, horror) it's not.

In order for us to be able to identify our software uniquely, we sometimes use hash sums over the entire software. A hash is a non-reversible function that gives a unique output for every input. Usually, the output is much smaller than the input. If you haven't worked with hashes before, you can think of them as a fingerprint, every person has a unique fingerprint, it can be used to identify a person, but a fingerprint can't be used to reconstruct a person.

Ideally, every time we build and package our software, we would get identical files and have identical output (and generate the same hash sum for our software). If it's the same code, why wouldn't that be the case? Well, we use dependencies, and if some code changed in the dependencies then the dependency looks a little bit different and if we include that dependency in our final software, then the hash sum for our software is different. There's also the case with some compiled languages where the timestamp of the build is included in the output, generating a different hash every time you build. We won't discuss that here though.

The importance of completely reproducible builds varies in importance by application. In a financial institution or somewhere that handles medical records, it may be very important that the exact same build hash is reproducible to prove that the code that was approved is what is in the final output. In many other applications though, this is not extremely important.

#### Code always kept deployable

Having code that's always deployable (and provably so) makes life easier. This is especially so when the master branch contains the code running in the production environment. For example, if a bug is found and it needs to be fixed, you can pull a copy of master (knowing it is the code running in production), fix the bug and make a pull request back to master. This is relatively straight forward. 

If, on the other hand, master and production are very different and master is not deployable, then you would have to find out what code *is* running in production, pull a copy of that, fix the bug, figure out a way to push it back, then work out how to deploy that specific commit. That's not great and would have to be a completely different workflow from a normal deployment.

#### Knowing what code is deployed (sha sum/version)

It's often important to know what is actually running in production. Ideally, as we discussed above, we'd have master running in production. This is not always possible. Sometimes we intend to have master in production but a build fails, sometimes we batch together several changes and want to have them all deployed at once. 

What we need in these cases (and is generally a good idea in general) is to know exactly what code is running in production. Sometimes this can be done with a version, sometime sit's useful to have the commit SHA sum (uniquely identifying hash of that particular commit in git) attached to the code.

This is even more useful if we combine this with a history of all releases. If, for example, we found out that a particular commit has introduced a bug, we can find out exactly when that was released and how many users were affected. This is especially useful when that bug has written bad data to the database. We'd now be able to track where that bad data went based on the time.

### Types of CI setup

To meet some of the requirements listed above, we likely don't want to run CI on a personal computer. We're likely going to want to dedicate a server to specifically this task so that there's less chance to have something else interfere with the CI/CD process. To that end, there are two optins: host our own server or use a cloud service (some one else's computer).

#### Jenkins (and other self hosted setups)

Among the self hosted options, Jenkins is the most popular. It's extremely flexible and there's a plugin to do almost anything (except that one thing you want to do). This is a great option for many applications, using a self hosted setup means that the entire environment is under your control, the amount of resources can be controlled, secrets (we'll elaborate a little more on security in later sections of this module) are never exposed to anyone else and you can do anything you want on the hardware.

Unfortunately, there is a downside. Jenkins is quite complicated to set up and secure. It's very flexible but that means that there's often quite a bit of boilerplate/tempate code involved to get builds working. With jenkins specifically, it also means that CI/CD must be set up with either Jenkins' own domain specific language or a flaour of Groovy. There's also the issue of hardware failure which can be an issue if the setup sees heavy use.

Self hosted options are usually build a blanket fee for renting the server, what you do on the server ususally doesn't have any bearing on the billing. 

{{TODO: Clarify this a little}}

#### GitHub Actions and other cloud based solutions

In a cloud hosted setup, the setup of the environment is not something you need to worry about. It's there, all you need to do is tell it what to do. Doing that usually involves putting a file in your repo and then telling the CI system to read the file (or to check your repo for that particular file). The actual CI config for the cloud based options is often a little simpler if you stay within what is considered "normal" usage. If you want to do something a little bit more special then cloud based options may become more limited or you may find it difficult to do that one specific task that the cloud platform just isn't built for.

In this module we'll look at a fairly normal use-case. The more complicated setups might, for example, make use of specific hardware resources, e.g. a GPU.

Aside from the configuration issue mentioned above, there are often resource limitations on could based platforms. In a self hosted setup, if a build is slow, you cna just get a bigger server and throw more resources at it, in cloud based options, this may not be an option. For example, in GitHub Actions, the nodes your builds will run on have 2 vCPUs and 8GB of RAM.

Cloud based options are also usually billed by build time which is something to consider.

#### Why pick one over the other

In general, if you have a small to medium software project that doesn't have any special requirements (e.g. needs a graphics card to run tests), a cloud based solution is probably best. The configuration is simple and you don't need to go to the hassle or expense of setting up your own system. For smaller projects especially, this should be cheaper.

For larger projects where more resources are needed or in larger companies where there are multiple teams and projects to take advantage of it, a self hosted CI setup is probably the way to go.

#### Why use GHA for this course

For this course we'll use GitHub Actions. We'll do this because there's very little overhead since we're using GitHub anyway. We can see it work immediately and discuss the usage and configuration of CI without having to set up a server to do it.

</div>

<div class="tasks">

### Exercises 11.1.

For the exercises below, you are not expected to know anything about Python (the programming language at least, you *are* expected to be an expert on the actual snake). The expectation is that you will find a way to achieve the objective (in principle) without having to learn a new language. Python is used here as an illustrative point, not with the aim of learning a new language.

#### 11.1 Thinking hypothetically
In order to distance the concept if CI/CD from the actual code of an application, let's use a hypothetical example in a different language. We'll use Python.

##### The Situation:
We have an application being worked on by a team of about 6 people. The application is in active development and will be released soon. The application is written in Python. Python is an interpreted language but we'll assume that the intention is to build the code into some form of artifact that will be deployed to a production environment (eventually).

##### Instructions:
Select tools to use in a CI system for the developers. These tools should help them keep their development experience coherent. Make sure you address the following steps:
 - Linting
 - Testing
 - Building
You can assume that once the software is built, someone else will handle the deployment.

For each of the above steps, find a tool that can be used to complete that requirement. Discuss what the usefulness of completing that step is from the developer's point of view. Explain why you selected that tool (over other tools in the same category) and what assumptions you made along the way.

Would this setup be better in a self-hosted or a cloud based environment? Why? What information would you need to make that decision?

There is no 'right' answer to the above though there certainly might be incorrect ones. Make sure you explain your logic.

</div>
