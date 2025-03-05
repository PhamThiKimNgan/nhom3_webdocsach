import { Novel } from "../models/Novel.js"
import { ResponseDetail, ResponseData } from "../services/ResponseJSON.js"
import { Chapter } from "../models/Chapter.js"
import jwt_decode from 'jwt-decode'
import { Reading } from '../models/Reading.js'
import { User } from '../models/User.js'
import mongoose from "mongoose"
import { Chapterunlocked } from "../models/Chapterunlocked.js"

export const NovelController = {
    CreateNovel: async (req, res) => {
        try {
            const name = req.body.tentruyen
            const url = req.body.url
            const image = req.body.hinhanh
            const type = req.body.theloai
            const author = req.body.tacgia
            const uploader = new mongoose.Types.ObjectId(req.body.nguoidangtruyen)
            const novel = await new Novel({ name, url, image, type, author, uploader })
            let error = novel.validateSync();
            if (error)
                return res.status(400).json(ResponseDetail(400, {
                    message: Object.values(error.errors)[0].message || 'Lỗi'
                }))

            const response = await novel.save()
            if (response) {
                return res.status(200).json(ResponseData(200, novel))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Đăng truyện không thành công" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    EditNovel: async (req, res) => {
        try {
            const name = req.body.chaptername
            const url = req.body.url
            const image = req.body.image
            const type = req.body.type
            const author = req.body.author
            const id = new mongoose.Types.ObjectId(req.body.id)
            const username = req.user.sub
            const newUser = await User.findOne({ username: username })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))

            const novel = await Novel.findOne({ _id: id, uploader: newUser.id })
            if (!novel)
                return res.status(400).json(ResponseDetail(400, { message: "Bạn không có quyền sửa truyện của người khác" }))
            const newNovel = await Novel.findByIdAndUpdate(id, {
                name, url, image, type, author
            }, { new: true })
            if (newNovel)
                return res.status(200).json(ResponseData(200, novel))
            return res.status(400).json(ResponseDetail(400, { message: "Sửa truyện không thành công" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    DeleteNovelByUrl: async (req, res) => {
        try {
            const url = req.query.url

            const user = req.user
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return res.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.uploader.equals(newUser._id)) {
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
                }
                const response = await Novel.deleteOne({ _id: novel._id })
                if (response.deletedCount == 1)
                    return res.status(200).json(ResponseData(200, { message: "Xoá truyện thành công" }))
                return res.status(400).json(ResponseDetail(400, { message: "Xoá truyện không thành công" }))

            }
            else
                return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },

    GetNovelById: async (req, res) => {
        try {
            const id = req.params.id;
            console.log("NBI")
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json(ResponseDetail(400, { message: "ID truyện không hợp lệ" }));
            }
            
            const novel = await Novel.findById(id);
            
            if (novel) {
                return res.status(200).json(ResponseData(200, novel));
            }
            
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }));
        } catch (error) {
            console.log(error);
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }));
        }
    },
    SearchNovelByName: async (req, res) => {
        try {
            let search = req.query.search
            if (!search) {
                return res.status(500).json(ResponseDetail(500, { message: "Thiếu field" }))
            }
            search = search.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== '').join(' ')
            const novels = await Novel.find({ $text: { $search: search } })
            if (novels) {
                return res.status(200).json(ResponseData(200, novels))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm truyện" }))
        }
    },
    CreateChapter: async (req, res) => {
        try {
            let chaptername = req.body.tenchap
            const content = req.body.content
            const isLock = req.body.isLock || false
            const url = req.body.url
            if (content.length <= 10)
                return res.status(400).json(ResponseDetail(400, { message: "Nội dung phải dài hơn 10 kí tự" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {

                const newestChap = await Chapter.find({ novelId: novel._id }).sort({ chapternumber: -1 }).limit(1)
                let chapternumber = 1
                if (newestChap.length > 0) {
                    chapternumber = newestChap[0].chapternumber + 1
                }

                chaptername = `Chương ${chapternumber}: ${chaptername}`

                const chapter = await new Chapter({ chaptername, novelId: novel._id, content, chapternumber, isLock })
                const response = await chapter.save()
                const count = await Chapter.count({ novelId: novel._id })
                await Novel.updateOne({ _id: novel._id }, { numberofchapter: count })
                if (response) return res.status(200).json(ResponseData(200, response))
                return res.status(400).json(ResponseDetail(400, { message: "Đăng chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    UpdateChapter: async (req, res) => {
        try {
            let chaptername = req.body.tenchap
            const content = req.body.content
            const url = req.body.url
            const chapternumber = req.body.chapnumber
            const isLock = req.body.isLock
            const user = req.user
            if (content.length <= 10)
                return res.status(400).json(ResponseDetail(400, { message: "Nội dung phải dài hơn 10 kí tự" }))
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.uploader.equals(newUser._id))
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))
                const newChap = await Chapter.findOneAndUpdate({ chapternumber, novelId: novel._id }, { content, chaptername, isLock }, { new: true })
                if (newChap) return res.status(200).json(ResponseData(200, newChap))
                return res.status(400).json(ResponseDetail(400, { message: "Sửa chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    DeleteChapter: async (req, res) => {
        try {
            const url = req.query.url
            const chapnumber = req.query.chapnumber
            const user = req.user
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.uploader.equals(newUser._id))
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
                const newChap = await Chapter.findOneAndDelete({ chapnumber, novelId: novel.id })
                const count = await Chapter.count({ novelId: novel._id })
                await Novel.updateOne({ _id: novel._id }, { numberofchapter: count })
                if (newChap) return res.status(200).json(ResponseData(200, { message: "Xoá chương thành công" }))
                return res.status(400).json(ResponseDetail(400, { message: "Xoá chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },

    //create-with-chapters
    CreateNovelWithChapters: async (req, res) => {
        try {
            const { story, chapters } = req.body;
            
            if (!story || !chapters || !Array.isArray(chapters)) {
                return res.status(400).json(ResponseDetail(400, { message: "Dữ liệu không hợp lệ" }));
            }
            
            const { name, author, description, image, url } = story;
            const uploader = new mongoose.Types.ObjectId(req.body.nguoidangtruyen || req.user.id);
            
            // Create novel
            const novel = new Novel({ 
                name, 
                url, 
                image, 
                author, 
                uploader,
                description,
                numberofchapter: chapters.length
            });
            
            // Validate novel
            let error = novel.validateSync();
            if (error) {
                return res.status(400).json(ResponseDetail(400, {
                    message: Object.values(error.errors)[0].message || 'Lỗi'
                }));
            }
            
            // Save novel
            const savedNovel = await novel.save();
            
            // Create and save chapters
            if (chapters.length > 0) {
                const chapterDocuments = chapters.map(chapter => ({
                    chaptername: chapter.name || `Chương ${chapter.chapternumber}`,
                    novelId: savedNovel._id,
                    content: chapter.content,
                    chapternumber: chapter.chapternumber,
                    isLock: chapter.isLock || false
                }));
                
                await Chapter.insertMany(chapterDocuments);
            }
            
            return res.status(200).json(ResponseData(200, {
                novel: savedNovel,
                chaptersCount: chapters.length
            }));
        } catch (error) {
            console.log(error);
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }));
        }
    },

    UpdateNovelWithChapters: async (req, res) => {
        try {
            const { story, chapters } = req.body;
            
            if (!story || !chapters || !Array.isArray(chapters)) {
                return res.status(400).json(ResponseDetail(400, { message: "Dữ liệu không hợp lệ" }));
            }
            
            // Verify user permissions
            const username = req.user.sub;
            const user = await User.findOne({ username });
            
            if (!user) {
                return res.status(403).json(ResponseDetail(403, { message: "Không tìm thấy người dùng" }));
            }
            
            // Find and validate novel
            const novel = await Novel.findById(story._id);
            if (!novel) {
                return res.status(404).json(ResponseDetail(404, { message: "Không tìm thấy truyện" }));
            }
            
            
            // Update novel details
            const { name, author, description, image, url } = story;
            const updatedNovel = await Novel.findByIdAndUpdate(
                novel._id, 
                { name, author, description, image, url },
                { new: true }
            );
            
            // Process chapters
            for (const chapter of chapters) {
                if (chapter._id) {
                    // Update existing chapter
                    await Chapter.findByIdAndUpdate(chapter._id, {
                        chaptername: chapter.chaptername || chapter.name,
                        content: chapter.content,
                        isLock: chapter.isLock !== undefined ? chapter.isLock : false
                    });
                } else {
                    // Create new chapter
                    const newestChap = await Chapter.find({ novelId: novel._id })
                        .sort({ chapternumber: -1 })
                        .limit(1);
                        
                    let chapternumber = 1;
                    if (newestChap.length > 0) {
                        chapternumber = newestChap[0].chapternumber + 1;
                    }
                    
                    const newChapter = new Chapter({
                        chaptername: chapter.chaptername || `Chương ${chapternumber}: ${chapter.name || ''}`,
                        novelId: novel._id,
                        content: chapter.content,
                        chapternumber: chapter.chapternumber || chapternumber,
                        isLock: chapter.isLock || false
                    });
                    
                    await newChapter.save();
                }
            }
            
            // Update chapter count
            const count = await Chapter.count({ novelId: novel._id });
            await Novel.updateOne({ _id: novel._id }, { numberofchapter: count });
            
            return res.status(200).json(ResponseData(200, {
                novel: updatedNovel,
                message: "Cập nhật truyện thành công"
            }));
            
        } catch (error) {
            console.log(error);
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật truyện" }));
        }
    },

    GetNovelsByUserId: async (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = req.query.page || 0
            const size = req.query.size || 20
            const id = req.query.id

            Novel.find({ uploader: new mongoose.Types.ObjectId(id) }).limit(size).skip(size * page).sort({ name: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },

    GetNovels: (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = parseInt(req.query.page) || 0
            const size = parseInt(req.query.size) || 6
            
            // Ensure page is non-negative
            const validPage = Math.max(0, page)

            Novel.find()
                .limit(size)
                .skip(size * validPage)
                .sort({ name: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },
    GetNovelsTopRating: (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = req.query.page - 1 || 0
            const size = req.query.size || 6

            Novel.find().limit(size).skip(size * (page)).sort({ rating: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },

    GetNovelsByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            const novel = await Novel.findOne({ url: url })
            if (novel)
                return res.status(200).json(ResponseData(200, novel))
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))

        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }))
        }
    },
    GetChapterByNumber: async (req, res) => {
        try {
            const chapNumber = req.params.chapNumber;
            const url = req.params.url

            const token = req.headers.authorization?.split(" ")[1];
            var username;
            if (token) {
                username = jwt_decode(token).sub
            }

            const novel = await Novel.findOne({ url: url })
            if (novel) {
                Chapter.findOne({ novelId: novel._id, chapternumber: chapNumber })
                    .then(
                        async (result) => {
                            if (username) {
                                const user = await User.findOne({ username })
                                if (user) {
                                    if (result.isLock === true) {
                                        if (novel.uploader.toString() === user._id.toString()) {
                                            return res.status(200).json(ResponseData(200, result))
                                        }
                                        const chapterisUnlock = await Chapterunlocked.findOne({ chapterId: result._id, userId: user._id })
                                        if (!chapterisUnlock) {
                                            return res.status(400).json(ResponseDetail(500, { message: "Bạn chưa mở khoá chương" }))
                                        }
                                    }
                                    let reading = await Reading.findOne({
                                        novelId: novel._id,
                                        userId: user._id
                                    })
                                    if (reading) {
                                        reading.chapternumber = chapNumber
                                    }
                                    else {
                                        reading = await new Reading({
                                            novelId: novel._id,
                                            userId: user._id,
                                            chapternumber: chapNumber
                                        })
                                    }
                                    await reading.save()
                                }
                            } else {
                                if (result.isLock === true) {
                                    return res.status(400).json(ResponseDetail(500, { message: "Bạn chưa mở khoá chương" }))
                                }
                            }
                            Novel.updateOne({ _id: novel._id }, { $inc: { reads: 1 } })
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },

    GetChapterByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            const page = req.query.page || 0
            const size = req.query.size || 1000
            const novel = await Novel.findOne({ url: url })
            const token = req.headers.authorization?.split(" ")[1];
            var username;
            if (token) {
                username = jwt_decode(token).sub
            }

            if (novel) {
                Chapter.find({ novelId: novel._id })
                    .limit(size)
                    .skip((page) * size)
                    .sort({ chapternumber: 1 })
                    .select({ chapternumber: 1, chaptername: 1, isLock: 1 }).then(
                        async result => {
                            if (username) {
                                const user = await User.findOne({ username })
                                const listChapterId = result.map(item => item.id)

                                if (user) {
                                    let chapterisUnlock = await Chapterunlocked.find({ chapterId: { $in: listChapterId }, userId: user._id })
                                    let newChapterisUnlock = chapterisUnlock.reduce((total, current) => ({
                                        ...total,
                                        [current.chapterId]: { ...current._doc }
                                    })
                                        , {})
                                    for (let i = 0; i < result.length; i++) {
                                        result[i] = { ...result[i]._doc, unlock: false }
                                        if (newChapterisUnlock[result[i]._id]) {
                                            console.log(result[i]._doc)
                                            result[i] = { ...result[i], unlock: true }
                                        }
                                        if (novel.uploader.toString() == user._id.toString()) {
                                            result[i] = { ...result[i], unlock: true }
                                        }
                                    }
                                }
                            }
                            //console.log(result)
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    }

    ,
    SetReading: async (req, res) => {
        try {
            const chapNumber = req.body.chapNumber
            const url = req.body.url
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            User.findOne({ username: username })
                .then(async (result) => {
                    const novel = await Novel.findOne({ url: url })
                    if (novel) {

                        let reading = await Reading.findOne({
                            novelId: novel._id,
                            userId: result._id
                        })
                        if (reading) {
                            reading.chapternumber = chapNumber
                        }
                        else {
                            reading = await new Reading({
                                novelId: novel._id,
                                userId: result._id,
                                chapNumber
                            })
                        }
                        const temp = await reading.save()
                        return res.status(200).json(ResponseData(200, temp))
                    }
                    return res.status(500).json(ResponseDetail(500, { message: "Không tìm thấy tài khoản" }))
                })
                .catch(err => {
                    return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
                })
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },
    GetReadings: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            const user = await User.findOne({ username: username })
            if (user) {
                let readings = await Reading.find({ userId: user._id }).populate('novelId').populate("userId")

                readings = await Promise.all(readings.map(async (item) => {
                    let sochap = await Chapter.countDocuments({ novelId: item.novelId._id })
                    const  {  novelId, ...itemData } = item
                    console.log(novelId)
                    return {
                        "name": novelId.name,
                        "image": novelId.image,
                        "chapternumber": novelId.reads+1,
                        "url": novelId.url,
                        "sochap": novelId.numberofchapter,
                        "author": novelId.author,
                        "updatedAt": novelId.updatedAt,
                    }
                }))

                return res.status(200).json(ResponseData(200, readings))
            } else {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },

    GetNewestChapter: async (req, res) => {
        try {
            const page = req.query.page || 0
            const size = req.query.size || 10
            let chaps = await Chapter.find().populate({
                path: 'novelId',
                populate: {
                    path: 'uploader'
                }
            }).limit(size).sort({ updatedAt: -1 })
            chaps = chaps.filter(item => item.novelId != null).map(item => {
                return {
                    type: item.novelId.type,
                    name: item.novelId.name,
                    chaptername: item.chaptername,
                    author: item.novelId.author,
                    uploader: item.novelId.uploader?.nickname,
                    updatedAt: item.updatedAt,
                    url: item.novelId.url,
                    chapternumber: item.chapternumber
                }
            })
            if (chaps) {
                return res.status(200).json(ResponseData(200, chaps))
            }
            return res.status(200).json(ResponseData(200, []))
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },

    GetReadingsDefault: async (req, res) => {
        try {
            console.log(req.query)
            // Parse params with proper defaults and validation
            const page = parseInt(req.query.page) || 0;
            const size = parseInt(req.query.size) || 10;
            
            // Ensure page is non-negative
            const validPage = Math.max(0, page);
            
            // Get paginated novels with sorting
            const novels = await Novel.find()
                .limit(size)
                .sort({ updatedAt: -1 });  // Sort by most recently updated

            
            // Map and add chapter count to each novel
            const novelReadings = await Promise.all(novels.map(async (item) => {
                const chapterCount = await Chapter.countDocuments({ novelId: item._id });
                return { 
                    name: item.name, 
                    image: item.image, 
                    chapternumber: 0, 
                    url: item.url, 
                    sochap: chapterCount 
                };
            }));
            
            return res.status(200).json(ResponseData(200, novelReadings));
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }));
        }
    },

    UpdateChapters: async (req, res) => {
        try {
            console.log("CHẠY UPDATE")
            var NovelID = mongoose.Types.ObjectId('634318e300c8a010015ec04e')
            const count = await Chapter.count({ novelId: NovelID })
            await Novel.updateMany({ _id: NovelID }, { numberofchapter: count })
            // await Chapter.updateMany({novelId: NovelID}, {"isLock": true})
            // await Chapter.updateMany({},{$unset: {"isLock": true}},{strict:false})
            // await Chapter.updateMany({novelId: NovelID},{$set: {"isLock": true}},{strict:false})
            // await Chapter.updateMany({},{$rename: {"chapnumber": "chapternumber"}},{strict:false})
            // await Chapter.updateMany({},{$set: {"isLock": false}},{strict:false})
            // await Chapter.updateMany({},{$set: {"price": 200}},{strict:false})
            return res.status(200).json(ResponseDetail(200, { message: "Update thông tin chap thành công" }))
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(ResponseDetail(500, { message: "Update không thành công" }))
        }
    },

    UnlockChapter: async (req, res) => {
        try {
            const chapterID = req.body.id
            const token = req.headers.authorization?.split(" ")[1];
            const decodeToken = jwt_decode(token)
            const username = decodeToken.sub
            const user = await User.findOne({ username: username }).populate("roles");
            const chapter = await Chapter.findById(chapterID)
            const balance = user.balance - chapter.price;
            if (balance < 0) {
                return res.status(400).json(ResponseDetail(400, { message: "Mở khóa không thành công, số dư không đủ!!" }))
            }
            await User.updateOne({ _id: user._id }, { balance: balance })

            const newChapterUnlocked = await new Chapterunlocked({
                userId: user._id,
                chapterId: chapter._id
            });
            await newChapterUnlocked.save();

            return res.status(200).json(ResponseDetail(200, { message: "Mở khóa chương thành công" }))
        }
        catch (err) {
            console.log(err)
            return res.status(500).json(ResponseDetail(500, { message: "Mở khóa không thành công" }))
        }
    },

    GetChaptersByNovelId: async (req, res) => {
        try {
            const novelId = req.params.id;
            const page = parseInt(req.query.page) || 0;
            const size = parseInt(req.query.size) || 20;
            
            if (!mongoose.Types.ObjectId.isValid(novelId)) {
                console.log(CBNI)
                return res.status(400).json(ResponseDetail(400, { message: "ID truyện không hợp lệ" }));
            }
            
            const chapters = await Chapter.find({ novelId: novelId })
                .limit(size)
                .skip(size * page)
                .select();
                
            return res.status(200).json(ResponseData(200, chapters));
        } catch (error) {
            console.log(error);
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi khi lấy danh sách chương" }));
        }
    },
}
