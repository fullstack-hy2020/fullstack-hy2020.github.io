---
mainImage: ../../../images/part-1.svg
part: 11
letter: c
lang: en
---

<div class="content">

Having written a nice application it's time to think about how we're going to put this in front of people. In previous modules of this course, you've simply uploaded the files to a server. In this module, we're going to look at the principles of making a deployment safely and some of the principles of deploying software on both a small and large scale. 

### Principles
We'd like to define some rules about how our deployment process should work but before that, we have to look at some constraints of reality.

One on phrasing of Murphy's Law holds that:
  "Anything that can go wrong will go wrong."

It's important to remember this when we plan out our deployment system. Some of the things we'll need to consider could include:
 - What if my PC crashes or hangs during deployment?
 - I'm connected to the server I'm deploying to over the internet, what happens if my internet connection dies?
 - What happens if any specific instruction in my deployment script/system fails?
 - What happens if, for whatever reason, my software doesn't work as expected on the server I'm deploying to? Can I roll back to a previous version?
 - What happens if a user requests something from our software just before we do a deployment (we didn't have time to send a response to the user)?

These are just a small selection of what can go wrong during a deployment, or rather, things that we should plan for. Regardless of what happens, our deployment system should *never* leave our software in a broken state. We should also always know (or be easily able to find out) what state a deployment is in.

Another important rule to remember when it comes to deployments (and CI in general) is:
  "Silent failures are *very* bad!"

This doesn't mean that failures need to be shown to the users of the software, it means we need to be aware if anything goes wrong. If we are aware of a problem, we can fix it, if the deployment system doesn't give any errors but fails, we may end up in a state where we believe we have fixed a critical bug but the deployment failed, leaving the bug in our production environment and us unaware of the situation.

Defining hard and fast rules/requirements for a deployment system is difficult, let's try anyway:
 - Our deployment system should be able to fail gracefully at *any* step of the deployment.
 - Our deployment system should *never* leave our software in a broken state.
 - Our deployment system should let us know when a failure has happened. It's more important to notify about failure than about success.
 - Our deployment system should be allow us to roll back to a previous deployment. Preferrably this roll back should be easier to do (and less prone to failure) than a full deployment.
 - Our deployment system should handle the situation where a user makes a request just before/during a deployment.
 - Our deployment system should make sure that the software we are deploying meets the requirements we have set for this (e.g. don't deploy if tests haven't been run).

Let's define some things we *want* in this hypothetical deployment system too:
 - We would like it to be fast
 - We'd like to have no downtime during the deployment (this is distinct from the requirement we have for handling user requests just before/during the deployment).

</div>

<div class="tasks">

### Exercises 11.5.-11.X.

#### 11.5 TODO

TODO: needs exercise

</div>
