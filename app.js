'use strict';

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const validator = require('./middlewares/validator');
const cors = require('cors');
require('dotenv').config();

// const reminderCron = require('./utils/reminderCron');


const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const EXPOSED_SCOPES = ['access_as_user'];

const options = {
  identityMetadata: `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID}/${process.env.VERSION}/${process.env.DISCOVERY}`,
  issuer: `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID}/${process.env.VERSION}`,
  clientID: process.env.CLIENT_ID,
  audience: process.env.CLIENT_ID,
  validateIssuer: true,
  passReqToCallback: false,
  loggingLevel: 'info',
  scope: EXPOSED_SCOPES
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
}
);

const app = express();

const corsOptions = {
  "origin": process.env.NODE_ENV === 'production' ? "https://recruitment.futransolutions.com" : 'http://localhost:3000',
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors());
// app.use(validator);
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

const router = require('./routes/index');

app.use('/', router);

module.exports = app;