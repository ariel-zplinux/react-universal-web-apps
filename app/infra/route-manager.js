import FS from 'fs';

import express from 'express';
import axios from 'axios';

import nconf from 'nconf';

import mongoose from './db-manager'

import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';

import baseManager from './base-manager';
import routes from '../routes';

import ContextWrapper from '../components/common/ContextWrapper';

import RandomName from 'random-name';

import Message from '../models/Message';
import User from '../models/User';

const routeManager = Object.assign({}, baseManager, {
    configureDevelopmentEnv(app) {
        const apiRouter = this.createApiRouter();
        const pagesRouter = this.createPageRouter();
        app.use('/api', apiRouter);            
        app.use('/', pagesRouter);            
    },

    createPageRouter() {
        const router = express.Router();
        router.get('*', (req, res) => {
            match({routes, location: req.originalUrl}, (err, redirectLocation, renderProps) => {
                const {promises, components} = this.mapComponentsToPromises(renderProps.components, renderProps.params, req);
                Promise.all(promises).then((values) => {
                    const data = this.prepareData(values, components);
                    const html = this.render(renderProps, data);

                    res.render('index', {
                        content: html,
                        context: JSON.stringify(data)
                    });
                }).catch((err) => {
                    res.status(500).send(err);
                });
            });
        });

        return router;
    },

    mapComponentsToPromises(components, params, req) {
        const filteredComponents = components.filter((Component) => {
            return (typeof Component.loadAction === 'function');
        });
        const promises = filteredComponents.map(function(Component) {
            return Component.loadAction(params, req.originalUrl, nconf.get('domain'));                  
        });

        return {promises, components: filteredComponents};
    },

    prepareData(values, components) {
        const map = {};

        values.forEach((value, index) => {
            map[components[0].NAME] = value.data;
        });

        return map;
    },

    render(renderProps, data) {      
        let html = renderToString(
            <ContextWrapper data={data}>
                <RoutingContext {...renderProps}/>
            </ContextWrapper>
        );

        return html;
    },


    createApiRouter(app) {
        const router = express.Router();

        this.createNewUserRoute(router);        
        this.createUpdateUserRoute(router);
        this.createDeleteUserRoute(router);
        this.createGetUsersRoute(router)

        this.createNewMessageRoute(router);
        this.createGetMessagesRoute(router);

        return router;
    },

    
    // API User

    createGetUsersRoute(router){
        router.get('/users', (req, res) => {
            this.retrieveUsers((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },
    retrieveUsers(callback){
        User.find({})
            .select({_id: 1, name: 1})
            .sort({'date': -1}).limit(50).exec().then( (doc, err) => {
            callback(err, {items: doc.reverse()}); 
        });  
    },

    createDeleteUserRoute(router) {
        router.delete('/user/delete', (req, res) => {
            const id = req.query.id;
            console.log('== user disconnected - id: ' + id);
                        
            this.deleteUserDb(id, (err, data) =>{
                if(!err) {
                    res.json(data);                                 
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },

    deleteUserDb(id, callback) {
        User.find({ _id: id }).remove( (err) => {
            if (err){
                console.log(err);
                callback(err, null);
            }
            callback(null, true);
        });
    },


    createUpdateUserRoute(router){
        router.put('/user/update', (req, res) => {
            //retrieve put parameters
            const user = req.body;
            console.log('== username updated');
            console.log(user);

            user.ip = req.connection.remoteAddress;
            this.updateUserDb(user, (err, data) =>{
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },
    updateUserDb(user, callback) {
        User.update(
            { _id: user.id},
            { $set: {name: user.name}},
            (err) => {
                if (err){
                    callback(err, null);
                }
                callback(null, user.name);
            }
        );
    },

    createNewUserRoute(router) {
        router.get('/user/new', (req, res) => {
            const user = { 
                name: RandomName.place(),
                ip: req.connection.remoteAddress,
                date: Date()
            }
            console.log('== new user connected');
            console.log(user);
            this.addUserDb(user, (err, data) =>{
                if(!err) {
                    res.json(data);                                 
                } else {
                    res.status(500).send(err);
                }
            });
            // res.json(data);                                    
        });
    },

    addUserDb(user, callback) {
        const u = new User();
        u.name = user.name;
        u.ip = user.ip;

        u.save( (err) => {
            if (err){
                callback(err, null);
            }
            const newUser = {
                name: u.name,
                id: u._id,
                ip: u.ip
            }
            callback(null, newUser);
        });
    },
    
    // API Message

    createGetMessagesRoute(router){
        router.get('/messages', (req, res) => {
            this.retrieveMessages((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },
    retrieveMessages(callback){
        Message.find({}).sort({'date': -1}).limit(50).exec().then( (doc, err) => {
            callback(err, {items: doc.reverse()}); 
        });  
    },

    createNewMessageRoute(router) {
        router.post('/message/new', (req, res) => {
            //retrieve post parameters
            const message =req.body;
            this.addMessageToDb(message, (err, data) =>{
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },

    addMessageToDb(message, callback) {
        const m = new Message();
        m.content = message.content;
        m.username = message.username;
        m.save( (err) => {
            if (err){
                callback(err, null);
            }
            else {
                const newMessage = {
                    content: m.content,
                    username: m.username,
                    _id: m.id
                }
                callback(null, newMessage);
            }
        });
    },  
});

export default routeManager;
