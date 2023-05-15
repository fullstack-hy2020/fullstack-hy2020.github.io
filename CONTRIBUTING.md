# Running Full stack open on your environment

1. Fork the repository
2. Clone your fork
3. Verify that you are running Node version 10 ([NVM](https://github.com/nvm-sh/nvm) recommended for managing node versions)
5. Install gatsby globally `npm install -g gatsby-cli`
4. Install dependencies with `npm install`
5. Start the application with `npm start`

# Setting up the PR

1. Prettify your code with `npm run format`
2. Create a new branch for your changes
3. Create the PR from that branch to the source branch

# Contributing with translations
When translation of a whole new part is completed, remember to update the file src/utils/translationProgress.json
This file tracks the progress of translations, ranging from 0 (part0) to 13 (part13). It is used in the to avoid navigation errors when the user tries to access untranslated parts of the course. At the same time, it is used to automatically redirect the user to the English material (until the part is translated). So, if you have been working on a translation, remember to update this file after completing the translation of a whole part.