/// Here are the steps for creating my
- make a creae a http server in server.js and make the 'start' property of the package.json to 'nodemon server.js'
    - import app from app.js and pass it to the create server function.
    - Listen to Port number

- in app.js, import express and initialize it as app.
    - add middleware to the app variable for 'morgan','bodyParser.urlencoded', 'bodyParser.json'.
    - import mongoose too, set the database url and add middleware to mongoose. and set `db = mongoose.connection`

- inside the api folder we have:
    - controllers: this are where functions like `signUp` and `signIn` etc are done.
    - middlewares: this has auth middleware for jwt in it.
    - models: this is where models/schema are kept.
    - routes: keep seperate routes here.
