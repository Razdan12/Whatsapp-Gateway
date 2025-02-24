import express from 'express';
const router = express.Router();
import whatsappRouter from "./core/whatsapp/whatsapp.router.js";
import authenticationRouter from './core/authentication/authentication.router.js';

export const routeLists = [
    {
        path : '/wa',
        route: whatsappRouter
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