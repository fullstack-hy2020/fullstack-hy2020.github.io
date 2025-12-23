# Contributing Guidelines

We really appreciate that you are considering contributing! There are many ways you can help us to improve the course material. The preferred way is to make a pull request, but you can also submit an issue, help with translations or review existing pull requests, for example.

# Running Full stack open on your environment

1. Fork the repository
2. Clone your fork
3. Verify that you are running Node version 10 ([NVM](https://github.com/nvm-sh/nvm) recommended for managing node versions, with it you can run `nvm use` to activate correct node version)
4. Install dependencies with `npm install`
5. Start the application with `npm start`
6. Application will be available at <http://localhost:8000>

# Setting up the PR

1. Create a new branch for your changes
2. Create the PR from that branch to the source branch
3. If your pull request is for a specific part of the course material, please add the part number to the beginning of the title (eg. "**Part 3a:** Fix broken link")

# Contributing with translations

When translation of a whole new part is completed, remember to update the file src/utils/translationProgress.json
This file tracks the progress of translations, ranging from 0 (part0) to 13 (part13). It is used in the to avoid navigation errors when the user tries to access untranslated parts of the course. At the same time, it is used to automatically redirect the user to the English material (until the part is translated). So, if you have been working on a translation, remember to update this file after completing the translation of a whole part.