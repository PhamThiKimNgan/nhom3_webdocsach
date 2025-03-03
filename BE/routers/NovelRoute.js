import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {NovelController} from '../controllers/NovelController.js';

const router = express.Router();

// GET routes - no auth required, fixed paths first
router.get('/novel/newupdate', NovelController.GetNewestChapter);
router.get('/novel-toprating', NovelController.GetNovelsTopRating);
router.get('/readingsdefault', NovelController.GetReadingsDefault);
router.get('/updatechapters', NovelController.UpdateChapters);
router.get('/readings', NovelController.GetReadings);
router.get('/search', NovelController.SearchNovelByName);
router.get('/', NovelController.GetNovels);

// GET routes with params - less specific routes come last
router.get('/novel/:url/mucluc', NovelController.GetChapterByUrl);
router.get('/novel/:url/chuong/:chapNumber', NovelController.GetChapterByNumber);
router.get('/novel/:url', NovelController.GetNovelsByUrl);
router.get('/:id/chapters', NovelController.GetChaptersByNovelId);
router.get('/:id', NovelController.GetNovelById);

// POST routes - require auth
router.post('/novel/create-with-chapters', verifyToken, NovelController.CreateNovelWithChapters);
router.post('/novel/create', verifyToken, NovelController.CreateNovel);
router.post('/novel/chuong/create', verifyToken, NovelController.CreateChapter);
router.post('/novel/reading/', NovelController.SetReading);
router.post('/chuong/unlock', verifyToken, NovelController.UnlockChapter);

// PUT routes - require auth
router.put('/novel/update-with-chapters', verifyToken, NovelController.UpdateNovelWithChapters);
router.put('/novel/chuong/edit', verifyToken, NovelController.UpdateChapter);
router.put('/novel/edit', verifyToken, NovelController.EditNovel);

// DELETE routes - require auth
router.delete('/novel/chuong', verifyToken, NovelController.DeleteChapter);
router.delete('/novel', verifyToken, NovelController.DeleteNovelByUrl);

export default router;