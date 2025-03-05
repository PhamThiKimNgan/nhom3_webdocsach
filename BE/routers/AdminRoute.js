import express from 'express';
import {AdminController} from '../controllers/AdminController.js';
import { AuthController } from '../controllers/AuthController.js';
import { CommentController } from '../controllers/CommentController.js';
import {verifyToken, verifyTokenAdmin} from "../controllers/middlewareController.js"
import { RatingController } from '../controllers/RatingController.js';
import { NovelController } from '../controllers/NovelController.js';

const router = express.Router();

// GET routes

router.get('/users', verifyTokenAdmin, AuthController.LoadUsers);
router.get('/users/getlistusers', verifyTokenAdmin, AdminController.GetListUser);
router.get('/users/search', verifyTokenAdmin, AdminController.SearchUsers);
router.get('/users/:userId', verifyTokenAdmin, AdminController.GetUserById);
router.get('/novel/getnovels', verifyTokenAdmin, AdminController.GetNovels);
router.get('/novel/getnovelreview', verifyTokenAdmin, AdminController.GetNovelCommentRatings);
router.get('/bills/getbills', verifyTokenAdmin, AdminController.GetBills);
router.get('/comment/getlistcomments', verifyTokenAdmin, AdminController.GetListOfComments);
router.get('/rating/getlistratings', verifyTokenAdmin, AdminController.GetListRating);
router.get('/rating/deleterating', verifyTokenAdmin, AdminController.DeleteRating);
router.get('/comment/deletecomment', verifyTokenAdmin, AdminController.DeleteComment);

// POST routes
router.post('/user/deleteaccount', verifyTokenAdmin, AdminController.deleteAccount);
router.post('/novel/deletenovel', verifyTokenAdmin, AdminController.deleteNovelById);
router.post('/user/getuserinfo', verifyTokenAdmin, AdminController.GetUserById);
router.post('/user/updatedeleteaccount', AdminController.updateDeleteStatus); 
router.post('/novel/getnovelreviewbyid', verifyTokenAdmin, AdminController.GetNovelReviewById);
router.post('/novel/getnovelreviewbyurl', verifyTokenAdmin, AdminController.GetNovelReviewByUrl);

// PUT routes
router.put('/user/active', verifyTokenAdmin, AdminController.activeByAdmin);
router.put('/user/inactive', verifyTokenAdmin, AdminController.inactiveByAdmin);
router.put('/role/updatetouser', verifyTokenAdmin, AdminController.updateRoles);

// DELETE routes
router.delete('/comment', verifyTokenAdmin, CommentController.DeleteComment);
router.delete('/rating', verifyTokenAdmin, RatingController.DeleteRating);
router.delete('/novel', verifyTokenAdmin, NovelController.DeleteNovelByUrl);

export default router;
