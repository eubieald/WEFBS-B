# WEFBS-B (Webpack ExpressJS Firebase Bootstrap5 Sass) - Boilerplate

## The objective of this project is to setup a boilerplate that bundles js,css files and whatnot as well as it uses server side data rendering using the tech stack I learned this month (January 2024). 

## What I learned:
* Webpack bundler (loaders)
* Express JS (MVC, MustacheJS template engine, Middlewares)
* Partials
* Firebase (Cloud DB, Auth )
* Bootstrap5
* Sass
* package.json
* npx and npm commands (shortcuts and output)
* npm scripting (open localhost when the script started: see package.json)
* bootstrap toast notification
* render.com as my free hosting platform

## HOW TO INSTALL
1. Download the project to your local
2. cd to project root directory
3. run npm install in cli
4. run npx webpack in cli
5. run npm start in cli
6. (very important) - project will not automatically work in your local, you still need to add in the root directory of the project your .env file and service-account.json file contents.
I left a sample format of these files in the codebase (.env.dev service-account.json.dev) just remove the .dev from the filename.
(to get the service-account.json)
Go to Firebase Console:
Open the Firebase Console: https://console.firebase.google.com/
Select your project.
Navigate to Project Settings:
In the top-left corner of the Firebase Console, click on the gear icon to open "Project settings."
Service accounts:
Navigate to the "Service accounts" tab.
Generate New Private Key:
Scroll down to the "Firebase Admin SDK" section.
Click on the "Generate new private key" button. This will download a JSON file containing your service account credentials.
This JSON file contains sensitive information, such as private keys, so make sure to keep it secure and do not expose it in public repositories.

## Demo Site:
https://wefbs-boilerplate.onrender.com/

## Screenshots:

### How to tweak this project for your own use:
I would recommend you to clone and rename this project so that you can use it for your own needs as it is an example project. This boilerplate is a nice place to start.

## Find a bug?
Please use the issue tab above to report any problems you encountered or suggestions you have for improving this project. Please make mention to the issue you created if you would like to submit a pull request. I'm grateful.
