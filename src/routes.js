import express from 'express';
const router = express.Router();
import whatsappRouter from "./core/whatsapp/whatsapp.router.js";
import authenticationRouter from './core/authentication/authentication.router.js';
import sessionRouter from './core/session/session.router.js';
import webhookRouter from './core/webhook/webhook.router.js'

export const routeLists = [
    {
        path : '/wa',
        route: whatsappRouter
    },
    {
        path : '/session',
        route: sessionRouter
    },
    {
        path : '/webhook',
        route: webhookRouter
    },
    {
        path : '/auth',
        route: authenticationRouter
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;