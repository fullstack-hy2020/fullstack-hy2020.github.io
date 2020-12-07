---
mainImage: ../../../images/part-1.svg
part: 11
letter: d
lang: en
---

<div class="content">

Your main branch of code should always remain <i>green</i>. Being green means that all the steps of your build pipeline should complete successfully: project should build successfully, test should run without errors, and the linter shouldn't have anything to complain about etc.

Why is this important? You will likely deploy your code to production specifically from your main branch. Any failures in the main branch would mean that new features cannot be deployed to production until the issue is sorted out. Sometimes you will discover a nasty bug in production that was not caught by the CI/CD pipeline. In these cases you want to be able to roll the production environment back to a previous commit in a safe manner.

How do you keep your main branch green then? Avoid committing any changes directly to the main branch. Instead, commit your code on a branch based on the freshest possible version of the main branch. Once you think the branch is ready to be merged into the master you create a GitHub Pull Request (also referred to as <abbr title="Pull Request">PR</abbr>).

### Working with Pull Requests

Pull requests are a core part of collaboration process when working on any software project with at least two contributors. When making changes to a project you checkout a new branch locally, make and commit your changes, push the branch to remote repository (in our case to GitHub) and create a pull request for someone to review your changes before they can be merged into the master branch.

There are several reasons why using pull request and getting your code reviewed by at least one other person is always a good idea.

1. Even a seasoned developer can often overlook some issues in their code: we all know of the tunnel vision effect.
1. A reviewer can have a different perspective and offer a different point of view.
1. After reading through your changes at least one other developer will be familiar with the changes you've made.
1. Using PRs allows you to automatically run all tasks in your CI pipeline before the code is pushed to the master branch. GitHub Actions provides a trigger for pull requests.

You can configure your GitHub repository in such a way that pull requests cannot be merged until they are approved.

![Compare & pull request](../../images/11/part11d_00.png)

To open a new pull request, open your branch in GitHub and click on the green "Compare & pull request" at the top. You will be presented with the form where you can fill in pull request description.

![Open a new pull request](../../images/11/part11d_01.png)

GitHub's pull request interface presents a description and the discussion interface. At the bottom it displays all the CI checks (in our case each of our Github Actions) that are configured to run for each PR and the statuses of these checks. A green board is what you aim for! You can click on Details of each check to view details and run logs.


All the workflows we looked at so far were triggered by commits to master branch. To make the workflow run for each pull request we would have to update the trigger part of the workflow. We use the "pull_request" trigger for branch "master" and limit the trigger to events "opened" and "synchronize". Basically this means, that the workflow will run when a PR into master is opened or updated.

So let us change events that [trigger](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) of workflow as follows:

```js
on:
  push:
    branches:
      - master
  pull_request: // highlight-line
    branches: [master] // highlight-line
    types: [opened, synchronize] // highlight-line
```

We shall soon make it impossible to push the code directly to master but in the meantime let us still run the workflow also for all the possible direct pushes to master.

</div>

<div class="tasks">

### Exercises 11.14-15.

Our workflow is doing a nice job of ensuring good code quality, but since it is run on commits to master, it's catching the problems too late!

#### 11.14 pull request

Update the trigger of the existing workflow as suggested above to run on new pull requests to master.

Create a new branch, commit your changes and open a pull request to master.

_TODO: link to tutorial that shows how to work with branches_

Note that when you open the pull request, make sure that you select here your own repository as the <i>base repository</i>. By default the selection is the smartly-depository and you do not want to do that:

![](../../images/11/15a.png)

In the "Conversation" tab of the pull request you should see your latest commit and the yellow status for checks in progress:

![](../../images/11/16.png)

Once the checks have run the status should turn to green. Make sure all the checks pass.

#### 11.15 run deployment step only for master branch

All looks good, but there is actually a pretty serious problem with the current workflow. All the steps, including the deployment are run also for pull requests. This is surely something we do not want!

Fortunately there is an easy to problem, we can add a [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) condition to the deployment step that ensures that the step is executed only when te code is being merged or pushed to master.

The workflow [context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contexts) gives various kind of information about the code the workflow is run.

The relevant information is found in [github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context), the field <i>event_name</i> tells what is the "name" of the event that triggered the workflow. When a pull request is merged, the name of the event is somehow paradoxically <i>push</i>, the same event that happens when pushing the code to repository. Thus, we get the desired behavior by adding the following condition to the step that deploys the code:

```js
if: ${{ github.event_name == 'push' }}
```

Push some more code to your branch, and ensure that the deployment step <i>is not executed</i> anymore. Then merge the branch to master and make sure that the depolyment happens.

</div>

<div class="content">

### Versioning

The most important purpose of versioning is to uniquely identify the software we're running and the code associated with it. That also sounds simple, so, let's break it down a little more. In order to achieve the objective of having that unique identifier of code, it needs two things:
 - To be unique
 - To identify code

The ordering of versions is also an important information. For example, if the current release has broken critical functionality and we need to identify the <i>previous version</i> of the software so that we can roll back the release back to a stabile state.

#### Semantic Versioning and Hash Versioning

How an application is versioned is sometimes called a versioning strategy. We'll look at and compare two such strategies.

The first one is [Semantic Versioning](https://semver.org/), where a version is in the form <code>{major}.{minor}.{patch}</code>. For example, the `1.2.3` we mentioned above where `1` is the major version, `2` is the minor version and `3` is the patch version.

 In general, changes that fix functionality without changing how the application works from the outside are `patch` changes, changes that make small changes to functionality (as viewed from the outside) are `minor` changes and changes that completely change the application (or major functionality chagnes) are `major` changes. The definitions of each of these terms can vary from project to project. 


Hash versioning (also sometimes known as SHA versioning) is quite different. The version "number" in hash versioning is instead a hash derived from the contents of the repository and the changes introduced in this commit. In git, this is already done for you as the commit hash. This should be unique for any change set.

Hash versioning is almost always used in conjunction with automation. It's a pain (and error prone) to copy 32 character long version numbers around to make sure that everything is correctly deployed.

#### But what does the version point to?

Determining what code is in a given version is important and the way this is achieved is again quite different between semantic and hash versioning. In hash versioning (at least in git) it's as simple as looking up the commit based on the hash. This will let us know exactly what code is deployed with which version.

It's a little more complicated when using semantic versioning and there are several ways to approach the problem. These boil down to three possible approaches: something in the code itself, something in the repo or repo metadata, something completely outside the repo.

While we won't cover the last option on the list (since that's a rabbit hole all on its own), it's worth mentioning that this can be as simple as a spreadsheet that lists the Semantic Version and the commit it points to.

For the two repo based approaches, the approach with something in the code usually boils down to a version nuber in a file and the repo/metadata approach usually relies on tags or (in the case of GitHub) releases. In the case of tags or releases, this is relatively simple, the tag or release points to a commit, the code in that commit is the code in the release.

What about having the version number in a file? This presents a problem, if we commit the version number `4.2.7` into a file, then we make a few more commits with changes, then we increment the version number to `4.2.8`, what code is in version `4.2.7`? Is it the first commit in which the version number appears or is it the last commit before the version number changes? While there are conventions and workflows based around using only a version number in a file, this is perhaps not ideal. Instead, what we can do is use a combination of the methods. There's nothing preventing us from incrementing the version number in a file and also tagging the commit at which the release happens. This gives us the advantage of having a unique commit referred to (tag) and easy access to the current version number in the code.

#### Version order

In semantic versioning, even if we have version bumps of different types (major, minor or patch) it's still quite easy to put the releases in order: 1.3.7 comes before 2.0.0 which itself comes before 2.1.5 which comes before 2.2.0. A list of releases (conveniently provided by a package manager or GitHub) is still needed to know what the last version is but it's easier to look at that list and discuss it: It's easier to say "We need to roll back to 3.2.4" than to try communicate a hash in person.

That's not to say that hashes are inconvenient. Aside from giving an easier path to working out the code deployed in a specific version, if you know which commit caused the particular problem, it's easy enough to look back through a git history and get the hash of the previous commit.

#### Comparing the Two

We've already touched on some of the advantages and disadvantages of the two versioning methods discussed above but it's perhaps useful to address where they'd each likely be used.

Semantic Versioning well when deploying services where the version number could be of significance or might actually be looked at. As an example, think of the Javascript libraries that you're using. If you're using version 3.4.6 of a particular library, and there's an update available to 3.4.8, if the library uses semantic versioning, you could (hopefully) safely assume that you're ok to upgrade without breaking anything. If the version jumps to 4.0.1 then maybe it's not such a safe upgrade.

Hash versioning is very useful where most commits are being built into artifacts that are themselves uploaded or stored. As an example, if your testing requires building your package into an artifact, uploading it to a server and running tests against it, it would be convenient to have hash versioning as it would prevent accidents. Example: you're working on version 3.2.2 and you have a failing test, you fix the failure and push the commit but as you're working in your branch, you're not going to update the version number. Without hash versioning, the artifact name may not change. If there's an error in uploading the artifact, maybe the tests run again with the older artifact (since it's still there and has the same name) and you get the wrong test results. If the artifact is versioned with the hash, then the version number *must* change on every commit and this means that if the upload fails, there will be an error since the artifact you told the tests to run again does not exist.

Having an error happen when something goes wrong is almost always preferable to having a problem silently ignored in CI.

Hash based versioning is also quite useful in situations where multiple developers are working on the same project and using the same CI environment. While not covered by this course, running tests in docker is a prime example of this. The docker environment would be shared between all developers and if all of their artifacts have the same name, only one of them could run tests at a time. By including the hash in the artifact name, the naming conflict could be avoided.

#### Best of Both Worlds

From the above comparison, it would seem that the semantic versioning makes sense for releasing software while hash based versioning (or artifact naming) makes more sense during development. This doesn't neccessarily cause a conflict.

Think of it this way: versioning boils down to a technique that points to a specific commit and says "We'll give this point a name, it's name will be 3.5.5". There is nothing preventing us from also referring to the same commit by its hash.

There is a catch. We discussed at the beginning of this module that we always have to know exactly what is happening with our code, for example, we need to be sure that we have tested the code we want to deploy. Having two parallel versioning (or naming) conventions can make this a little more difficult.

For example: We have a project that uses hash based artifact builds for testing, it's always possible to track the result of every build, lint and test to a specific commit and developers know the state their code is in. This is all automated and transparent to the developers. They never need to be aware of the fact that the CI system is using the commit hash underneath to name build and test artifacts. When the developers merge their code to master, again the CI takes over. This time, it will build and test all the code and give it a semantic version number all in one go. It attaches the version number to the relevant commit with a git tag.

In the above case, the software we release is tested because the CI system makes sure that tests are run on the code it is about to tag. It would not be incorrect to say that the project uses semantic versioning and simply ignore that the CI system tests individual developer branches/PRs with a hash based naming system. We do this because the version we care about (the one that is released) is given a semantic version.

</div>

<div class="tasks">

### Exercises 11.16.-11.17.

Let's extend our workflow so that it will automatically increase (bump) the version when a pull request is merged into master and tag the release with the version number. We will use an open-source action developed by a third-party: `anothrNick/github-tag-action`. You can read the documentation for this action in its [README](https://github.com/anothrNick/github-tag-action).

#### 11.16 Adding versioning

Start by creating the workflow the same way as in previous exercises. Set push to master as the trigger and use the same environment as in other actions. The workflow should have one job with two steps. The first step is the already familiar `actions/checkout@v2` as we need have the latest code in the build environment. The second step should be the tagging action itself:

```yml
    - name: Bump version and push tag
      uses: anothrNick/github-tag-action@9aaabdb5e989894e95288328d8b17a6347217ae3
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note** that for the `github-tag-action` we're using a hash pointing to a specific commit instead of a semantic version for security reasons. The action repository has a `@1.26.0` tag that points to the 1.26.0 version and the same commit with hash `9aaabdb5e989894e95288328d8b17a6347217ae3`. However tags can be moved and we cannot be sure that the code we are executing in our repository is the same we initially specified, so we prefer to use the full hash for security reasons.

When we use actions provided by GitHub we trust GitHub not to mess with version tags and to thoroughly test their code. It's arguable if they've earned our trust, but since our code is with them already it's kind of a moot point.

In case of third-party the code might end up being buggy or even maliscious. Even when the author of the open-source code does not have the intention of doing something maliscious, they might end up leaving their credentials on a post-it note in a cafe, and then who knows what might happen.

By pointing to the hash of a specific commit we can be sure that the code we pull when running the workflow will not change, because changing the underlying commit and its contents would also change the hash.

We're passing an environmental variable `GITHUB_TOKEN` to the action. As it is third-party action, it needs the token for authenication in your repository. You can read more [here](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) about authentication in GitHub Actions.

The `anothrNick/github-tag-action` action can accept multiple environmental variables (`GITHUB_TOKEN` is the only one that is required, the rest are optional). These variables modify the way the action tags your releases. You can look at these in the [README](https://github.com/anothrNick/github-tag-action) and see what suits your needs. For example, if you add `WITH_V: true` as another environmental variable after `GITHUB_TOKEN`, the release numbers will be prefixed with `v` (e.g. `v0.1.3`).

As you can see from the documentation, unless you alter the default behaviour with a `DEFAULT_BUMP` environmental variable, by default your releases will receive a *minor* bump, meaning that the middle number will be incremented, e.g. 1.2.10 -> 1.3.10. You can override this by adding `#major`, `#minor` or `#patch` to the commit message.

Modify the above configuration so that each new version os by default a _minor_ bump in version number.

Complete the workflow and try it out! Once the workflow has run successfully, you will see the release on the right hand side in your repository. If you're uncertain of the configuration, you can set `DRY_RUN` to `true`, which will make the action output the next version number without creating or tagging the release.

TODO pics

![Releases](../../images/11/part11d_02.png)

#### 11.17 Skiping a commit for tagging and deployment

In general the more often you deploy the master to production, the better. However there might be some valid reasons from time to time skip a particular commit or a merged pull request to becoming tagged and released to production.

Modify your setup so that if a commit message in a pull request contains _#skip_, the merge will not be deployed to production and it is not given a version number.

**Hints:** 

The easiest way to implement this is to add a [if condition](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) to the relevant steps

See [these examples](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#example-printing-context-information-to-the-log-file) how to access the commit message content when implementing the `if` condition.

You might take this as a starting point:

```yml
name: Testing stuff

on:
  push:
    branches:
      - master

jobs:
  a_test_job:
    runs-on: ubuntu-18.04
    steps:
      - name: gihub context
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
        run: echo "$GITHUB_CONTEXT"
      - name: commits
        env:
          COMMITS: ${{ toJson(github.event.commits) }}
        run: echo "$COMMITS"
```

You most likely need functions [contains](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contains) and [join](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#join) for your  if condition.

Developing workflows is not easy, and quite often the only option is trial and error. It might be even advisable to have a separate repository for getting the configuration right, and then when it is done, to copy the right configurations to the actual repository.

It would also be possible to install a tool such as [act](https://github.com/nektos/act) that makes it possible of running your workflows locally. In case you end up to more involved use cases, eg. by creating your [own custom actions](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) going through the burden of setting up a tool such as act is most likely worth the trouble. 


</div>

<div class="content">

### Keep master protected

GitHub allows you to set up protected branches. It is important to protect your most important branch that should never be broken: master. In repository settings you can choose between several levels of protection. We will not go over all of the protection options, you can learn more about them in GitHub documentation. Requiring pull request approval when merging into master is one of the options we mentioned earlier.

From CI point of view the most important protection is requiring status checks to pass before a PR can be merged into master. This means that if you have set up GitHub actions to run e.g. linting and testing tasks, then until all the lint errors are fixed and all the tests pass the PR cannot be merged. Because you are the administrator for you repository, you will see an option to override the restriction. However, non-administrators will not have this option.

![Unmergeable PR](../../images/11/part11d_03.png)

To set up protection for your master branch, navigate to repository "Settings" from the top menu inside the repository. In the left-side menu select "Branches". Click "Add rule" button next to "Branch protection rules". Type a branch name pattern ("master" will do nicely) and select the protection you would want to set up. At least "Require status checks to pass before merging" is necessary for you to fully utilise the power of GitHub Actions. Under it you should also check "Require branches to be up to date before merging" and select all of the status checks that should pass before a PR can be merged. At least bulding, testing and linting checks are good candidates.

![Branch protection rule](../../images/11/part11d_04.png)


</div>

<div class="tasks">

### Exercise 11.18

#### 11.18 Adding master protection

Add protection to your master branch. You should protect it to:
- Require all pull request to be approved before merging
- Require all status checks (lint and test) to pass before merging

TODO not yet include admins!

</div>
