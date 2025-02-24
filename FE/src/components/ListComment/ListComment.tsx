import React, {  useState } from 'react'
import { toast } from 'react-toastify';
import avt from '../../assets/img/avt.png'
import moment from 'moment';
import "./Comment.scss"
import { useParams } from 'react-router-dom';
import { userStore } from 'store/userStore';
import { useQuery } from 'react-query';
import { deleteComment, getCommentsByUrl } from 'api/apiComment';
import { Comment } from 'models/Comment';
import useCreateComment from 'hooks/useCreateComment';

function ListComment() {
    const user = userStore(state => state.user)
    const [content, setContent] = useState("")
    const url: string = useParams().url || ''

    const { isLoading, data: comments, refetch } = useQuery<Comment[], Error>(['get-comments', url],
        () => getCommentsByUrl(url, { size: 20 }))

    const { handleCreateComment } = useCreateComment(refetch, setContent)
    const onClickCreateComment = () => { //xử lý đăng bình luận mới
        const params = { urltruyen: url, content, parentId: "" }//payload
        handleCreateComment(params)
    }

    const onClickDeleteComment: React.MouseEventHandler<HTMLLIElement> = (e) => {//xử lý xoá comment
        if (user) {//Nếu đã đăng nhập thì mới đc phép xoá
            deleteComment({ id: e.currentTarget.id })
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
            <h1>Bình luận {comments?.length || 0}</h1>
            <div className="comment__form d-flex w100">
                <div className="avatar--45 mr-1">
                    <img src={user?.image || avt} alt="" />
                </div>
                <div className="comment__input">
                    <textarea placeholder='Nhập nội dung bình luận'
                        style={{ 'height': '100%', 'padding': '5px 20px 5px 5px' }} className='fs-15 fw-5' value={content} onChange={e => { setContent(e.target.value) }}></textarea>
                    <div className='d-flex comment__icon' ><span onClick={onClickCreateComment} className=" fs-20 "><i className='bx bxs-send' ></i></span></div>
                </div>

            </div>
            <hr />
            <div>
                {
                    comments?.map((item, index) => {
                        return (
                            <div style={{ marginTop: '12px' }} key={item.id} >
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
                                                <li id={item.id} onClick={onClickDeleteComment} className='fs-14 text-secondary'><i className='bx bxs-trash-alt'></i> Xoá</li> : ''
                                            }
                                            <li className='fs-14 text-secondary'><i className="bx bx-reply"></i> Trả lời</li>
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
        future: "in %s",
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
export default ListComment