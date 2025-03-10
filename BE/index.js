import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import {UserRoute,AuthRoute, NovelRoute, CommentRoute, AdminRoute,SavedRoute,PaymentRoute, StatisticRoute, RatingRoute, TrafficRoute} from './routers/index.js'
import { Novel } from './models/Novel.js';
import { Chapter } from './models/Chapter.js';

const app=express();
const PORT = process.env.PORT ||5000;
const URI=process.env.MONGODB_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({ credentials: true, origin:true}));
app.use(cookieParser());

mongoose.connect(URI)
    .then(()=>{
        console.log('Connected')
        
    }).catch(err=> {
        console.log('err',err)
    })

    

app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} `)
        })
app.get('/',(req,res)=>{
        res.send('SUCCESS');
    });
app.use('/api',AuthRoute)
app.use('/api/user',UserRoute)
app.use('/api/novels',NovelRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/admin',AdminRoute)
app.use('/api/saved',SavedRoute)
app.use('/api/payment',PaymentRoute)
app.use('/api/statistic',StatisticRoute)
app.use('/api/rating',RatingRoute)
app.use('/api/traffic',TrafficRoute)
