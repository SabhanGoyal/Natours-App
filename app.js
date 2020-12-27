const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp"); // http parameter pollution

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // so that one IP can send atmost 100 request in an hour
  message: "Too many requets from this Ip. Pls try again in an hour!",
});

app.use("/api", limiter); // for all urls with this starting

// Body Parser. Reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss to parse and convert the html code
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
); // like sort on duration and price which is wrong because sort can be done on 1 thing only. Then it will consider only price.

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
