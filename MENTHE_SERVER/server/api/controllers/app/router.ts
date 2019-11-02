import express from 'express';
import usercontroller from './user.controller';
import { checkIfAuthenticated } from '../../../authentication/auth.middleware';
import { checkCsrfToken } from '../../../common/csrf.middleware';

export default express.Router()
    .post('/signup', usercontroller.createUser)
    .post('/login', usercontroller.login)
    .post('/logout', checkCsrfToken, usercontroller.logout)
    .get('/content', checkIfAuthenticated, usercontroller.getContent)
    .get('/user', checkIfAuthenticated, usercontroller.getUser)                       // Get user email address from SESSIONID cookie
    .get('/user/:id', checkIfAuthenticated, usercontroller.getUserById)
    .get('/users', checkIfAuthenticated, usercontroller.allUsers)
    .delete('/user/:id', checkIfAuthenticated, usercontroller.deleteUser)
//    .get('/:id', controller.byId)
    ;