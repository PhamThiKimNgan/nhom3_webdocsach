import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import {verifyToken, verifyTokenAdmin} from "../controllers/middlewareController.js"

const router = express.Router();

router.post('/auth/register', AuthController.RegisterUser);

router.post('/auth/login', AuthController.LoginUser);

router.post('/auth/loginadmin', AuthController.LoginUserAdmin)

router.post('/auth/refreshtoken',AuthController.RefreshToken);

router.post('/auth/reactive',AuthController.ReActive);

router.get('/auth/active',AuthController.Active);

router.get('/auth/verifytoken',AuthController.verifyToken);

router.post('/auth/forgetpassword',AuthController.Forgotpassword);

router.post('/auth/check-username',AuthController.checkUsername);

router.post('/auth/check-email',AuthController.checkEmail);

export default router;