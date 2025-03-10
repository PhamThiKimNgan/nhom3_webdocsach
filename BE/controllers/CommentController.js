import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js';
import { ResponseDetail, ResponseData } from '../services/ResponseJSON.js';
import { Novel } from '../models/Novel.js'
import { Comment } from '../models/Comment.js';

export const CommentController = {
    CreateComment: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const content = req.body.content
            const url = req.body.urltruyen
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if (user) {
                const novel = await Novel.findOne({ url: url })
                if (novel) {
                    const comment = await new Comment({
                        novelId: novel.id,
                        userId: user.id,
                        content: content
                    })
                    const cmtResponse = await comment.save()
                    const data={
                        id:cmtResponse.id,
                        content,
                        image:user.image,
                        nickname:user.nickname,
                        username:user.username,
                        createdAt:cmtResponse.createdAt

                    }
                    return res.status(200).json(ResponseData(200, data))
                } else {
                    return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
                }
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }
        } catch (error) {
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    GetComments : async (req, res) => {
        try {
            const comments = await Comment.find()
            return res.status(200).json(ResponseData(200, comments))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi comment" }))
        }
    },
    GetListCommentByNovelId: async (req, res) => {
        try {
            const novelId = req.params.id
            const comments = await Comment.find({ novelId: novelId }).sort({ createdAt: -1 }).populate('userId')
            const data = comments.map(item => {
                return {
                    id: item.id,
                    content: item.content,
                    image: item.userId.image,
                    nickname: item.userId.nickname,
                    username: item.userId.username,
                    createdAt: item.createdAt
                }
            }
            )
            return res.status(200).json(ResponseData(200, data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
        
    },


    GetCommentsByUrl: async (req, res) => {
        try {
            const url = req.params.url
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                let comments = await Comment.find({
                    novelId: novel._id}).sort({createdAt:-1}).populate('userId')
                comments=comments.map(item=>{return {
                    nickname:item.userId.nickname,
                    image:item.userId.image,
                    content:item.content,
                    id:item.id,
                    username:item.userId.username,
                    createdAt:item.createdAt
                }})
                return res.status(200).json(ResponseData(200, comments))
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },

    DeleteComment: async (req, res) => {
        try {
            const commentId = req.query.id
            const count = await Comment.findByIdAndDelete(commentId)
            if(count) 
                return res.status(200).json(ResponseData(200, {message:"Xoá thành công"}))
            else {
                return res.status(400).json(ResponseDetail(400, { message: 'Xoá thất bại' }))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi xoá comment" }))
        }
    }
}