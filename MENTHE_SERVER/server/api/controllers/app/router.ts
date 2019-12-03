import express from 'express';
import * as _ from 'underscore';

import usercontroller from './user.controller';
import articlecontroller from './article.controller';
import workflowcontroller from './workflow.controller';
import variablecontroller from './variable.controler'
import processcontroller from './process.controller';
import { checkIfAuthenticated } from '../../../authentication/auth.middleware';
import { checkCsrfToken } from '../../../common/csrf.middleware';
import { checkIfAuthorized } from '../../../autorization/autorization.middleware';

export default express.Router()
    .post('/signup', usercontroller.createUser)
    .post('/login', usercontroller.login)
    .post('/logout', checkIfAuthenticated, checkCsrfToken, usercontroller.logout)
    .get('/content', checkIfAuthenticated, usercontroller.getContent)
    .get('/user', checkIfAuthenticated, usercontroller.getUser)                       // Get user email address from SESSIONID cookie
    .get('/user/:id', checkIfAuthenticated, usercontroller.getUserById)
    .get('/user/email/:email', checkIfAuthenticated,usercontroller.getUserByEmail)
    .get('/users', checkIfAuthenticated, usercontroller.allUsers)
    .delete('/user/:id', checkIfAuthenticated,
                    _.partial(checkIfAuthorized,(['ADMIN']))
                    , usercontroller.deleteUser)
// Articles 
    .post('/article', articlecontroller.createArticle)
    .get('/articles', articlecontroller.allArticles)
    .get('/article', articlecontroller.getArticle)
    .get('/article/:id', articlecontroller.getArticleById)
    .delete('/article/:id', _.partial(checkIfAuthorized,(['LOCAL_ADMIN'])),
                            articlecontroller.deleteArticle)

// Workflow 
.post('/workflow', workflowcontroller.createWorkflow)
.get('/workflows', workflowcontroller.allWorkflows)
.get('/workflow', workflowcontroller.getWorkflow)
.get('/workflow/:id', workflowcontroller.getWorkflowById)
.delete('/workflow/:id', _.partial(checkIfAuthorized,(['ADMIN','LOCAL_ADMIN'])),
                        workflowcontroller.deleteWorkflow)
.post('/workflow/:id', workflowcontroller.createWorkflow)
.put('/workflow/:id', workflowcontroller.updateWorkflow)  
.patch('/workflow/:id', workflowcontroller.updateWorkflow)                      
//    .get('/:id', controller.byId)

// Variable
.post('/variable', variablecontroller.createVariable)
.get('/variables', variablecontroller.allVariables)
.get('/variable', variablecontroller.getVariable)
.get('/variable/:id', variablecontroller.getVariableById)
.delete('/variable/:id', _.partial(checkIfAuthorized,(['ADMIN','LOCAL_ADMIN'])),
variablecontroller.deleteVariable)
.post('/variable/:id', variablecontroller.createVariable)
.put('/variable/:id', variablecontroller.updateVariable)  
.patch('/variable/:id', variablecontroller.updateVariable)  
.get('/variable/byworkflow/:id', variablecontroller.getVariableByWorkFlowId)


.post('/process', processcontroller.createProcess)
.get('/processes', processcontroller.allProcesses)
.get('/process', processcontroller.getProcess)
.get('/process/:id',processcontroller.getProcessById)
.delete('/process/:id', _.partial(checkIfAuthorized,(['ADMIN','LOCAL_ADMIN'])),
processcontroller.deleteProcess)
.post('/process/:id', processcontroller.createProcess)
.put('/process/:id', processcontroller.updateProcess)  
.patch('/process/:id', processcontroller.updateProcess) 
    ;