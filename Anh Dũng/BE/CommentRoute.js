import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {CommentController} from '../controllers/CommentController.js'
const router = express.Router();

router.post('/', verifyToken, CommentController.CreateComment);

router.get('/getlistcomments', CommentController.GetComments);

router.get('/:url', CommentController.GetCommentsByUrl);

router.get('/:id', CommentController.GetListCommentByNovelId);


router.delete('/', verifyToken, CommentController.DeleteComment);

export default router;