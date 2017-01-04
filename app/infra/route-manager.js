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
        this.createClientsPerUserDeviceRoute(router);
        this.createClientsPerUserAgentRoute(router);
        this.createDurationPerUserDeviceRoute(router);
        this.createMenuRoute(router);        
        this.createDataRoute(router);        

        this.createNewUserRoute(router);        

        return router;
    },

    createNewUserRoute(router) {
        router.get('/user/new', (req, res) => {
            const data = { 
                username: RandomName(),
                mode: 'new'
            }
            res.json(data);                                    
        });
    },

    createClientsPerUserDeviceRoute(router) {
        router.get('/clients-per-user-device', (req, res) => {
            this.retrieveClientsPerUserDevice((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },
    
    createClientsPerUserAgentRoute(router) {
        router.get('/clients-per-user-agent', (req, res) => {
            this.retrieveClientsPerUserAgent(req.query, (err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },    

    createDurationPerUserDeviceRoute(router) {
        router.get('/duration-per-user-device', (req, res) => {
            this.retrieveDurationPerUserDevice((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },    

    createMenuRoute(router) {
        router.get('/menu', (req, res) => {
            this.retrieveMenu((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },
    
    createDataRoute(router) {
        router.get('/data/:id', (req, res) => {
            const id = req.params.id;

            this.retrieveData(id, (err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },

    retrieveMenu(callback){
        const menu = {items: [
            {name: "Clients Per User Device", link:"/clients_per_user_device"},
            {name: "Clients Per User Agent", link:"/clients_per_user_agent"},
            {name: "Duration Per User Device", link:"/duration_per_user_device"},
            {name: "NodeJs Event Loop", link:"/data/nodejs_event_loop"},
            {name: "Readme", link:"/data/readme"}                        
        ]};
        callback(null, menu);
    },

    retrieveClientsPerUserDevice(callback){
        const ClientsPerUserDeviceSchemaJson = {
            _id: String,
            value: {} 
        };
        // initialize RawData schema and model
        const ClientsPerUserDeviceSchema = mongoose.Schema(
            ClientsPerUserDeviceSchemaJson,
            { collection: "clients_per_user_device" },
            { skipInit: true}
        );

        let ClientsPerUserDevice;
        try {
            ClientsPerUserDevice = mongoose.model("ClientsPerUserDevice");
        } catch (err) {
            ClientsPerUserDevice = mongoose.model("ClientsPerUserDevice", ClientsPerUserDeviceSchema);
        } 
                
        ClientsPerUserDevice.find({}).exec().then( (doc, err) => {
            const data = {
                items: doc.map(r => r.value)
            };
            callback(err, data); 
        })
    },

    retrieveClientsPerUserAgent(params, callback){
        let {limit,offset} = params;
        limit = limit ? parseInt(limit) : 6;
        offset = offset ? parseInt(offset) : 0;
        
        const ClientsPerUserAgentSchemaJson = {
            _id: String,
            value: {} 
        };
        // initialize RawData schema and model
        const ClientsPerUserAgentSchema = mongoose.Schema(
            ClientsPerUserAgentSchemaJson,
            { collection: "clients_per_user_agent" },
            { skipInit: true}
        );

        let ClientsPerUserAgent;
        try {
            ClientsPerUserAgent = mongoose.model("ClientsPerUserAgent");
        } catch (err) {
            ClientsPerUserAgent = mongoose.model("ClientsPerUserAgent", ClientsPerUserAgentSchema);
        } 
                
        ClientsPerUserAgent.find({}).sort({'value.value': -1}).skip(offset || 0).limit(limit || 6).exec().then( (doc, err) => {
            const data = {
                items: doc.map(r => r.value)
            };
            callback(err, data); 
        })
    },

    retrieveDurationPerUserDevice(callback){
        const DurationPerUserDeviceSchemaJson = {
            _id: String,
            value: {} 
        };
        // initialize RawData schema and model
        const DurationPerUserDeviceSchema = mongoose.Schema(
            DurationPerUserDeviceSchemaJson,
            { collection: "duration_per_user_device" },
            { skipInit: true}
        );

        let DurationPerUserDevice;
        try {
            DurationPerUserDevice = mongoose.model("DurationPerUserDevice");
        } catch (err) {
            DurationPerUserDevice = mongoose.model("DurationPerUserDevice", DurationPerUserDeviceSchema);
        } 
                
        DurationPerUserDevice.find({}).exec().then( (doc, err) => {
            const data = {
                items: doc.map(r => r.value)
            };
            callback(err, data); 
        })
    },

    retrieveData(id, callback){
        const fileDataSchema = mongoose.Schema({
            _id: String,
            value: String
        });
        let FileData;
        try {
            FileData = mongoose.model("FileData");
        } catch (err) {
            FileData = mongoose.model("FileData", fileDataSchema);
        } 

        FileData.findOne({_id: id}).exec().then( (doc, err) => {
            const data = {
                items: doc.value
            };
            callback(err, data); 
        })  
    },
});

export default routeManager;
