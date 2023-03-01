# NodeJS MVC Scaffold Generator

This NodeJS app generates a complete MVC scaffold based on terminal commands. With the provided terminal command, users can generate a model, a controller, and views for the model in seconds. This app uses Express.js as the web framework, SQLite3 as the database, and EJS as the view engine.

## Getting Started
To get started with this app, you'll need to have Node.js and SQLite3 installed on your machine.

## Installation
### Clone the repository from Github:

```
$ git clone https://github.com/your-username/nodejs-mvc-scaffold-generator.git
```

### Install the dependencies:

```
$ cd nodejs-mvc-scaffold-generator
$ npm install
```

### Configuration
Before running the app, you need to configure the app by providing the SQLite3 database configuration. Create a .env file in the root of the project, and add the following code:

```
DB_PATH=./database.sqlite
```
This specifies the path to the SQLite3 database file.

## Usage
To generate a new scaffold, run the following command:

```
$ npm run scaffold:generate <model-name> <attribute1-name>:<attribute1-type> <attribute2-name>:<attribute2-type> ...
```

For example:

```
$ npm run scaffold:generate Person name:string age:number weight:number height:number
```

This generates a model called "Person" with attributes name, age, weight, and height. It also generates a controller named "people", which has routes for getting all people, getting a single person, creating a person, editing a person, and deleting a person. It also generates views for the model: one for index, which displays all people, one for create, which creates a person, and one for edit, which allows someone to edit a person. There is also a delete button on the index page.

Folder Structure
The generated scaffold follows a standard MVC folder structure, as follows:

```
├── routers
│   └── people.js
├── instance
│   └── database.db
├── db
│   └── migrations.js
│   └── schema.json
├── models
│   └── person.js
├── views
│   ├── people
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   └── index.ejs
│   ├── partials
│   │   └── flash_messages.ejs
│   ├── error.ejs
│   └── layout.ejs
├── index.js
└── package.json
```

The controllers folder contains the controller for the generated model. The database folder contains the SQLite3 database file. The models folder contains the model for the generated model. The views folder contains the views for the generated model, including a subfolder for the controller, partials for reusable view code, and the layout for the app.

## Running the App
To run the app, run the following command:

```
$ npm start
```

This starts the app on http://localhost:3000. You can then navigate to http://localhost:3000/people to view the generated scaffold.

## Contributing
If you would like to contribute to this project, please follow the guidelines below.

## Fork the repository.
Create a new branch for your feature or bugfix.
Make your changes and commit them with descriptive commit messages.
Push your branch to your fork.
Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.