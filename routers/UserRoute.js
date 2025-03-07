import express from 'express';
import {AuthController} from "../controllers/AuthController.js";
import { verifyTokenAdmin, verifyToken } from '../controllers/middlewarecontroller.js';
import { UserController } from '../controllers/UserController.js';

import { CloneChapter } from '../services/cloneDB.js';
const router = express.Router();

router.get('/info', verifyToken, UserController.getInfo);

router.put('/info',verifyToken, UserController.updateUser);

router.put('/info/password',verifyToken, UserController.updatePassword);

router.get('/getusers',verifyTokenAdmin,AuthController.LoadUsers);

router.get('/chapter',CloneChapter)

router.post('/info-balance',UserController.getInfoWithBalance)

router.delete('/',verifyTokenAdmin,UserController.deleteAccount)

export default router;