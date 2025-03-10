import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js';
import { ResponseDetail,ResponseData } from '../services/ResponseJSON.js';
import { Role } from '../models/Role.js';

import bcrypt from 'bcrypt'
export const UserController ={
    getInfo:async(req,res)=>{
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodeToken = jwt_decode(token)
            const username = decodeToken.sub
            const user =await User.findOne({username:username}).populate("roles");
            const {password,_id:id,...rest}=user._doc;
            const data ={id,...rest}
               

            return res.status(200).json(ResponseData(200,{userInfo:data}))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi xác thực"}))
        }
    },
    getInfoWithBalance:async(req,res)=>{
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodeToken = jwt_decode(token)
            const username = decodeToken.sub
            const user =await User.findOne({username:username}).populate("roles");
            const {balance }=user._doc;

            return res.status(200).json(ResponseData(200,{
                balance
            }))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi xác thực"}))
        }
    },
    updateUser:async(req,res)=>{
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodeToken = jwt_decode(token)
            const username = decodeToken.sub

            const data = {
                birthdate:req.body.birthdate,
                image:req.body.image,
                nickname:req.body.nickname
            }

            const newUser= await User.findOneAndUpdate({username:username},data,{new:true})
            console.log(newUser)
            const {password,...rest}=newUser._doc
            return res.status(200).json(ResponseData(200,{userInfo:{...rest}}))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi cập nhật tài khoản"}))
        }
    },
    updatePassword:async(req,res)=>{
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodeToken = jwt_decode(token)
            const username = decodeToken.sub
            
            const salt =await bcrypt.genSalt(10);
            const hash =await bcrypt.hash(req.body.newPassword, salt);

            const data = {
                password:hash
            }
            const user = await User.findOne({username:username})
            const auth = await bcrypt.compare(req.body.password,user.password)
            if(auth){
                const newUser = await User.findOneAndUpdate({username:username},data,{new:true})
                if(newUser){
                    const {password,...rest}=newUser._doc
                    return res.status(200).json(ResponseData(200,{userInfo:{...rest}}))
                }
                return res.status(400).json(ResponseDetail(400,{message:"Cập nhật không thành công"}))
            }
            return res.status(400).json(ResponseDetail(400,{password:"Sai mật khẩu"}))
            
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi cập nhật tài khoản"}))
        }
    },
    
    deleteAccount:async(req,res)=>{
        try{
            const id=req.query.id;
            console.log(id)
            const deleteUser =await User.deleteOne({_id:id})
            console.log(deleteUser)
            if(deleteUser)
                return res.status(200).json(ResponseData(200,{message:"Xoá thành công"}))
            return res.status(400).json(ResponseDetail(400,"Xoá thất bại"))
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi cập nhật quyền tài khoản"}))
        }
    },
    
}