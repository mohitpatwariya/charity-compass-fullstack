const app = require('./app');
const connectDb = require('./database/database');

//here we will execute the app
const PORT = process.env.PORT || 4000;
connectDb()
.then(connectionInstance => {
    console.log('DB connected successfully\n',connectionInstance.connection.host);
    //start the app
    app.listen(PORT, (error) => {
        if(!error)
            console.log(`Server started at port: ${PORT}`);
        else
            console.error(`Error in starting server at port: ${PORT}:\n`,error);
    });
})
.catch(error => {
    console.error('Error in connecting to Mongodb\n',error);
    process.exit(1);
});
