import FS from 'fs';

import express from 'express';
import axios from 'axios';

import nconf from 'nconf';

import mongoose from 'mongoose';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';

import baseManager from './base-manager';
import routes from '../routes';

import ContextWrapper from '../components/common/ContextWrapper';

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
        this.createHomePage(router);
        this.createClientsPerUserDeviceRoute(router);
        this.createLastestBillsRoute(router);
        this.createDetailedBillRoute(router);
        this.createMenuRoute(router);        
        return router;
    },
    createHomePage(router) {
        router.get('/', (req, res) => {
            this.retrieveHome((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
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
    
    createLastestBillsRoute(router) {
        router.get('/latest-bills', (req, res) => {
            this.retrieveLatestBills((err, data) => {
                if(!err) {
                    res.json(data);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },

    createDetailedBillRoute(router) {
        router.get('/bill/:id', (req, res) => {
            const id = req.params.id;

            this.retrieveDetailedBills((err, data) => {
                if(!err) {
                    const billData = data.items.filter((item) => {
                        return item.id === id;
                    })[0];

                    res.json(billData);                                    
                } else {
                    res.status(500).send(err);
                }
            });
        });
    },

    retrieveMenu(callback){
        const menu = {items: [
            {device: "Clients Per User Device", id:"/clients_per_user_device"},
            {device: "NodeJs Event Loop", id:"/node_event_loop"}            
        ]};
        callback(null, menu);
    },


    retrieveClientsPerUserDevice(callback){
        const db = mongoose.connect("mongodb://localhost/mydb");

        mongoose.connection.on("open", function(){
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
                console.log({
                    items: doc.map(r => r.value)
                });
                console.log(err);
                mongoose.connection.close();
                
                callback(err, data); 
            })
        
        });

    },
    retrieveLatestBills(callback) {
        FS.readFile('./app/fixtures/latest-bills.json', 'utf-8', (err, content) => {
            callback(err, JSON.parse(content));
        });
    },

    retrieveDetailedBills(callback) {
        FS.readFile('./app/fixtures/detailed-bills.json', 'utf-8', (err, content) => {
            callback(err, JSON.parse(content));
        });
    }
});

export default routeManager;