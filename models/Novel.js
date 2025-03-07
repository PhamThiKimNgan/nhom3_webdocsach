import mongoose from 'mongoose'
import { Comment } from './Comment.js';
import { Reading } from './Reading.js';
import { Chapter } from './Chapter.js';
import { Rating } from './Rating.js';
const schema =new  mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    author:{
        type: String,
        require: true,
    },
    type:{
        type: String,
        require: true,
    },
    rating:{
        type: Number,
        require: true,
        default:0
    },
    reads:{
        type: Number,
        require: true,
        default:0
    },
    image:{
        type: String,
        require: true,
    },
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description:{
        type: String,
        require: true,
        default:"Mô tả truyện đọc",
        validate:{
            validator:item=>{
                return item.length > 10
            },
            message:"Nội dung phải dài hơn 10 kí tự"
        }
    },
    numberofrating:{
        type: Number,
        require: true,
        default:0
    },
    state:{
        type: String,
        require: true,
        default:"Đang ra"
    },
    url:{
        type: String,
        require: true,
    },
    numberofchapter:{
        type:Number,
        required:true,
        default:0
    }
},
{timestamps:true}
)
schema.index({name:'text'})
// middlewware chạy trước khi thực hiện xóa 1 novel 
schema.pre('deleteOne',{ query: true, document: false }, async function(next) {
    let id=this.getQuery()['_id'];
    //xóa các collection liên quan trước khi xóa novel 
    console.log(id)
    await Comment.deleteMany({novelId:id});
    await Reading.deleteMany({novelId:id});
    await Chapter.deleteMany({novelId:id});
    await Rating.deleteMany({novelId:id});
    // xong việc dưới middleware chuyển tiếp đến controller 
    next();
});



export const Novel = mongoose.model('Novel', schema)