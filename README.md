# Overview 

Capstone project to understand the full functionality of asynchronous javascript , webpack modules and Css grid and other related functionalities.

# Steps to Start

Install the following things:
1. npm install webpack webpack-cli
2. npm install -d webpack-dev-server

Run these commands to start the project:

1. npm run build-prod
2. npm run build (to start the development environment, the client will run and fetch info when the server is up).
3. npm start (run on a different terminal to start server over there).
4. npm run test (Please Close the running servers to run test cases!!).

Install any additional modules if needed as per the error messages or please raise a issue.

## Note I have used const values in server.js in API keys as dot-env not getting initialized during npm start.

# Functionality of project

The app opens asking you to give details of your trip. Once you give the trip city location, it will ask you to give the start and the end dates, start dates can be maximum within 16 days of current date and you are restricted to do so. After give the start date the end date will be enabled and it will automatically take the start date as its input.
Once the trip details are generated the trip details will automatically be saved in the browsers local storage. 
On giving some invalid data it will be display a error message but the previous correct details will be still stored in the browser's local storage.

Do plan your trips and enjoy our little application even in these daunting times.

## Contact Info

Reach out to me on biswadeep.bibguru96@gmail.com in case of queries.