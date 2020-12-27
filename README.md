Natours Application was made using Express,MongoDb,Express.

It has two entities user and tour.

User can signup,login,resetPassword,deleteData,updateData
Tour can be updated,deleted,getAllTours,getTour and many more.

The route files are in the route folder.

The model files are in the model folder where we create the userSchema,tourSchema and also querymiddlewares,prehooks,posthooks.

Controller folder controller files which handle the route requests.

app.js has global middlewares.

server.js is the file where Express connection with mongoDB is made and server is run.
