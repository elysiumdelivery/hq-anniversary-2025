# hq-anniversary-2025

TODO

# Contributing

Make a local copy of the repo

`git clone https://github.com/elysiumdelivery/hq-anniversary-2025.git`

Inside the created folder, run the following to install dev dependencies.

`npm install`

Install [Netlify CLI](https://docs.netlify.com/cli/get-started/)

`npm install -g netlify-cli`

Make a local branch (you cannot push changes directly to `main`). `<your-branch-name>` can be any name you want.

`git checkout -b <your-branch-name> origin/main`

## Local hot refresh

Because browsers are finnicky about accessing local files if there isn't a web server serving the page, live-server starts a development server and serves from there. Go to the folder you saved the git repo in and run

`netlify dev`

and the app should be served at `http://localhost:8888`, auto-reloading on each file save.

We use `netlify dev` to emulate how images would get served to the user, as we transform the image URLs to optimize & cache them when they load in.

## Updating data

### Corkboard

1. Pull `data/corkboard.csv` from the designated "Website Data" sheet.
2. In terminal, run `node _scripts/processCorkboard.js` to process the csv file into a .js file that will get used by the website
3. Run `optimize.command` (if on a Mac) to strip any submitted images of EXIF data, and downside extra large images
    - NOTE: You may need to install ImageMagick to run the command script

### Guestbook
1. Pull `data/guestbook.csv` from the designated "Website Data" sheet.
2. That's it!

## Non-coder

You can use the Github UI for simple text changes/ typo fixes:
![image](https://user-images.githubusercontent.com/47371080/201824933-0ae51ae2-bfbe-42fe-8a2b-c04b89665e1e.png)
https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files

To submit your changes for review, please select "Create a new branch... and start a pull request".

# Pull Requests

Push your local branch to Github to create a pull request

`git push -u origin <your-branch-name>`

Your terminal will then prompt you for your credentials. The password will be your personal access token. Here are steps on how to create one: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

## Code Review

A code review is not strictly required to merge, but it is encouraged to get feedback from at least one other person on the team before merging.
