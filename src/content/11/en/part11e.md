---
mainImage: ../../../images/part-1.svg
part: 11
letter: e
lang: en
---

<div class="content">

This module has focused on building a simple, effective and robust CI system that helps developers to work together, maintain code quality and deploy safely. What more could one possibly want? In the real world, there are more fingers in the pie than just developers and users. Even if that weren't true, even for developers, there's a lot more value to be gained from CI systems than just the above things.

### Visibility and Understanding

In all but the smallest companies, decisions on what to develop are not made exclusively by developers. The term 'stakeholder' is often used to refer to people (both inside and outside the development team) who may have some interest in keeping an eye on the progress of development. To this end, there are often integrations between git and whatever project management/bug tracking software the team is using.

A common use of this is to have some reference to the tracking system in git PRs or commits. This way, for example, when you're working on issue number 123, you might name your PR `BUG-123: Fix user copy issue` and the bug tracking system would notice the first part of the PR name and automatically move the issue to `Done` when the PR is merged.

### Notifications

When the CI process finishes quickly, it can be convenient to just watch it execute and wait for the result. As projects become more complex, so too does the process of building and testing the code. This can quickly lead to a situation where it takes long enough to generate the build result that a developer may want to begin working on another task. This in turn leads to forgotten build. This is especially problematic if we're talking about merging PRs that may affect another developer's work, either causing problems or delays for them. This can also lead to a situation where you think you've deployed something but haven't actually finished a deployment, this can lead to mis-communication with team mates and customers (e.g. "Go ahead and try that again, the bug should be fixed").

There are several solutions to this problem ranging from simple notifications to more complicated processes that simply merge passing code if certain conditions are met. We're going to discuss notifications as a simple solution since it's the one that interferes with the team workflow the least.

By default, GitHub Actions sends an email on a build failure. This can be changed to send notifications regardless of build status and can also be configured to alert you on the GitHub web interface. Great. But what if we want more. What if for whatever reason this doesn't work for our use case. 

There are integrations, for example with Slack, to send notifications. These integrations still decide what to send and when to send it based on logic from GitHub.

Let's go one step further. Let's set up our own notification system:

> TODO: Turn this into an excercise.

Using the build from the previous section, set up a notification to either: 
1: Tell us that the build succeeded and the project is ready for deployment
2: There was a problem that needs to be fixed. In this case, make it as easier for the developer to work out what went wrong. Send either the test report with the failing tests or a link to where said report can be found.

You can choose the channel that the notification will be sent to but you will need to explain why you chose the channel that you chose.

When doing this excercise, remember the following things.
 - The notifications should *always* be sent, even if the build fails in a much earlier step. Is there any failure that would prevent a notification from being sent?
 - The status of jobs in the build needs to be sent too, how do you get that? How do you present it?

### Metrics

In the previous section we mentioned that as projects get more complicated, so too, do their builds and the duration that the builds take increases. That's obviously not ideal: The longer the feedback loop, the slower the development.

While there are things that can be done about this increase in build times, it's useful to have a better view of the picture. It's useful to know how long a build took a few months ago versus how long it takes now. Was the progression linear or did it suddenly jump? Knowing what caused the increase in build time can be very useful in helping to solve it. If the build time increased linearly from 5 minutes to 10 over the last year, maybe we can expect it to take another few months to get to 15 minutes and we have an idea of how much value there is in spending time speeding up the CI process.

Metrics can either be self-reported (also called 'push' metrics, where each build reports how long it took) or the data can be fetched from the API afterwards (sometimes called 'pull' metrics). The risk with self reporting is that the self reporting itself takes time and may have a significant impact on "total time taken for all builds".

This data can be sent to a time series database or to an archive of another type.

### Periodic tasks

There are often periodic tasks that need to be done in a software development team. Some of these can be automated with commonly available tools and some you will need to automate yourself.

The former category includes things like checking packages for security vulnerabilities. There are several tools that can already do this for you. Some of these tools would even be free for certain types (e.g. open source) projects. Github provides one such tool, Dependabot.

Words of advice to consider: If your budget allows it, it's almost always better to use a tool that already does the job than to roll your own solution. If security isn't the industry you're aiming for, for example, use Dependabot to check for security vulnerabilities instead of making your own tool.

What about the tasks that don't have a tool? You can automate these yourself with GitHub Actions too. GitHub Actions provides a scheduled trigger that can be used to execute a task at a particular time.

> TODO: Turn this into another excercise.

Let's combine the the past last 3 sections together: Write an action that will send the average run time for all `build`, `lint`, `test` and `deploy` actions in the repo the workflow is situated in to an email address for archiving. You will likely need to create an action that calls the GitHub API for this.

Hint: Github provides a JS and a TS starter action for you to base your action on. These already import the relevant libraries and have some examples of how to use them.

</div>
