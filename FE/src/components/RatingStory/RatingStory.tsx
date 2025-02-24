import React, { MouseEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import avt from '../../assets/img/avt.png'
import moment from 'moment';
import { userStore } from 'store/userStore';
import { ClickEvent } from 'types/react';
import { createRating, deleteRating, getRatingsByUrl } from 'api/apiStory';
import { useQuery } from 'react-query';
import { Rating } from 'models/Rating';
import useCreateRating from 'hooks/useCreateRating';
import { useParams } from 'react-router-dom';

function RatingStory() {

    const [rating, setRating] = useState<number>(0);
    const user = userStore(state => state.user)
    const [content, setContent] = useState<string>("")
    const url:string = useParams().url || ''

    const { isLoading, data: ratings, refetch } = useQuery<Rating[], Error>(['get-ratings', { size: 20 }],
    ()=> getRatingsByUrl(url,{ size: 20 }))
    const { handleCreateRating } = useCreateRating(refetch, setContent, setRating)
    const handleHoverStar = (star: number) => {
        setRating(star)
    }

    const onClickCreateRatings = async (e: ClickEvent) => { //xử lý đăng bình luận mới
        if (rating === 0 || !content) {
            toast.warning('Vui lòng nhập nội dung đánh giá')
            return
        }
        const params = { url: url, content, rating }//payload
        handleCreateRating(params)

    }

    const onClickDeleteRating = async (id: string) => {//xử lý xoá comment
        if (user) {//Nếu đã đăng nhập thì mới đc phép xoá
            deleteRating({ id })
                .then(async (res) => {
                    toast.success(res.message, { hideProgressBar: true, pauseOnHover: false, autoClose: 1000 })
                    refetch()
                })
                .catch(err => {
                    toast.error(err.response.data.detail.message, { hideProgressBar: true, pauseOnHover: false, autoClose: 1000 })
                })
        }
    }

    return (
        <div className="comment__wrap">
            <h1>Đánh giá {ratings?.length || 0}</h1>
            <div className="heroSide__main__rate" style={{ marginBottom: '8px' }}>
                <div style={{ marginLeft: '58px', cursor: 'pointer' }} className="heroSide__main__rate-wrap fs-22 d-flex">
                    Đánh giá của bạn
                    <span style={{ marginLeft: '8px' }} onMouseMove={() => handleHoverStar(1)}
                        className={`bx ${rating >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(2)} className={`bx ${rating >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(3)} className={`bx ${rating >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(4)} className={`bx ${rating >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span onMouseMove={() => handleHoverStar(5)} className={`bx ${rating >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                </div>
            </div>
            <div className="comment__form d-flex w100">

                <div className="avatar--45 mr-1">
                    <img src={user?.image || avt} alt="" />
                </div>
                <div className="comment__input">
                    <textarea placeholder='Nội dung đánh giá'
                        style={{ 'height': '100%', 'padding': '5px 20px 5px 10px' }} className='fs-15 fw-5' value={content} onChange={e => { setContent(e.target.value) }}></textarea>
                    <div className='d-flex comment__icon' ><span onClick={onClickCreateRatings} className=" fs-20 "><i className='bx bxs-send' ></i></span></div>
                </div>


            </div>
            <hr />
            <div>
                {
                    ratings && ratings.map((item, index) => {
                        return (
                            <div style={{ marginTop: '8px' }} key={item.id} >
                                <div className="heroSide__main__rate" style={{ marginBottom: '8px' }}>
                                    <div style={{ marginLeft: '58px', cursor: 'pointer' }} className="heroSide__main__rate-wrap fs-22 d-flex">

                                        <span
                                            className={`bx ${item.rating >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                                        <span className={`bx ${item.rating >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className="comment__avatar ">
                                        <div className="avatar--45 mr-1">
                                            <img src={item.image || avt} alt="" />
                                        </div>
                                    </div>
                                    <div className="comment__body">
                                        <div className="comment__author__info">
                                            <h4>{item.nickname}</h4>
                                            <span className='fs-12 fw-4 text-secondary'>
                                                {
                                                    moment(item.createdAt).fromNow()
                                                }
                                            </span>
                                        </div>
                                        <div className="comment__content mb-1">
                                            {item.content}
                                        </div>
                                        <ul className="comment__nav">
                                            {item.username === user?.username ?
                                                <li id={item.id} onClick={() => onClickDeleteRating(item.id)} className='fs-14 text-secondary'><i className='bx bxs-trash-alt'></i> Xoá</li> : ''
                                            }
                                            {/* <li className='fs-14 text-secondary'><i className="bx bx-reply"></i> Trả lời</li> */}
                                            <li className='fs-14 text-secondary'><i className='bx bxs-flag-alt' ></i> Báo xấu</li>

                                        </ul>

                                    </div>
                                </div>
                                <hr />
                            </div>)
                    })
                }
            </div>
        </div>
    )
}

moment.updateLocale('en', {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: 'vài giây',
        ss: '%d giây',
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        w: "1 tuần",
        ww: "%d tuần",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});
export default RatingStory