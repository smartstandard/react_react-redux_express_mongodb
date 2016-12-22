// src / routes / user.js
'use strict';

// Imports
const express = require('express');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Tweet = require('../models/tweet');

// Common Routes
let tweetRoutes = express.Router();

// Tweets (/tweets)
tweetRoutes.get('/tweets', authMiddleware, (request, response) => {
    let responseData = {
        success: false,
        data: {},
        errors: []
    };

    Tweet.find({}).sort('-createdAt').exec(function(error, documents) {
        if(documents.length > 0) {
            responseData.data = documents;
            responseData.success = true;
        }

        response.json(responseData);
    });
});

// Tweet (/tweet)
tweetRoutes.post('/tweet', authMiddleware, (request, response) => {
    let responseData = {
        success: false,
        data: {},
        errors: []
    };

    if(request.body.text != '') {
        let tweet = {
            text: request.body.text,
            userId: request.user._id,
            createdAt: new Date()
        };

        Tweet.create(tweet, (error, document) => {
            if(error) {
                responseData.errors.push({type: 'critical', message: error});
            } else {
                let tweetId = document._id;

                if(tweetId) {
                    responseData.data.tweetId = tweetId;
                    responseData.success = true;
                } else {
                    responseData.errors.push({type: 'default', message: 'Please try again.'});
                }
            }

            response.json(responseData);
        });
    } else {
        responseData.errors.push({type: 'warning', message: 'Please enter tweet.'});

        response.json(responseData);
    }
});

// Export
module.exports = tweetRoutes;