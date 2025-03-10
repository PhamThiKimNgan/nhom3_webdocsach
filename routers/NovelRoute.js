import express from 'express';
import { NovelController } from '../controllers/NovelController.js';
import { verifyToken } from '../controllers/middlewarecontroller.js';
const router = express.Router();

// không cần xác thực, không tham số
router.get('/novel/newupdate', NovelController.GetNewestChapter);   
router.get('/novel-toprating', NovelController.GetNovelsTopRating);
router.get('/', NovelController.GetNovels);
router.get('/readingsdefault', NovelController.GetReadingsDefault);
router.get('/search', NovelController.SearchNovelByName);
// có tham số 
router.get('/:id', NovelController.GetNovelById);
router.get('/novel/:url', NovelController.GetNovelsByUrl);
router.get('/novel/:url/chuong/:chapNumber', NovelController.GetChapterByNumber);



//cần xác thực 
router.get('/readings', NovelController.GetReadings);
router.post('/novel/create-with-chapters', verifyToken, NovelController.CreateNovelWithChapters);


export default router;
