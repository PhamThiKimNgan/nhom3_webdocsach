import React, { MouseEvent, ReactElement, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './StoryDetail.scss'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LoadingData from '../../components/LoadingData/LoadingData'
import Grid from '../../components/Grid/Grid'
import Pagination from '../../components/Pagination/Pagination'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'
import Modal, { ModalContent } from '../../components/Modal/Modal'
import { unlockChapter } from 'api/apiPayment'
import getData from 'api/getData'
import RatingStory from 'components/RatingStory/RatingStory'
import { userStore } from 'store/userStore'
import { useMutation, useQuery } from 'react-query'
import { getNameChapters, getStory } from 'api/apiStory'
import { Story } from 'models/Story'
import { Chapter } from 'models/Chapter'
import { getUserInfo } from 'api/apiAuth'
import { checkSaved, savedStory, unsavedStory } from 'api/apiSaveStory'
import ListComment from 'components/ListComment/ListComment'

const nav = [//navigate
  {
    path: 'about',
    display: 'Giới thiệu',
    mobile: 'show'
  },
  {
    path: 'rate',
    display: 'Đánh giá',
    mobile: 'show'
  },
  {
    path: 'chapter',
    display: 'Ds Chương',
    mobile: 'hide'
  },
  {
    path: 'comment',
    display: 'Bình luận',
    mobile: 'show'
  },
  // {
  //   path: 'donate',
  //   display: 'Hâm mộ',
  //   mobile: 'hide'
  // }
]

function StoryDetail() {
  const url = useParams().url || 'd'
  const catGiu = 100
  const [main, setMain] = useState<ReactElement | null>()
  const [tab, setTab] = useState<string>('')
  const active = nav.findIndex(e => e.path === tab)
  const [handling, setHandling] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [listchapter, setListchapter] = useState<boolean>(false)

  const user = userStore(state => state.user)

  const { isLoading, data: truyen,refetch } = useQuery<Story, Error>(['get-story', url], () => getStory(url), {
    onSuccess(data) {
      setTab('about')//set tab mặc định là About
    }
  })

  const { isLoading: isLoadingCheck, data, mutate } = useMutation((variables: string) => checkSaved(variables),
    {
      onSuccess(data) {
        setSaved(data.saved || false)
      }
    }
  )

  useEffect(() => {//xử lý đổi tab
    if (truyen) {

      switch (tab) {
        case 'about':
          setMain(<About key={'about'} description={truyen?.description || ''} />)
          break
        case 'rate':
          setMain(<RatingStory key={'rate'} />)
          break
        case 'chapter':
          setMain(<ListChapter key={'chapter'} totalPage={truyen.numberofchapter} />)
          break
        case 'comment':
          setMain(<ListComment key={'comment'} />)
          break
        default:
          setMain(<Donate key={'donate'} />)
      }
    }
  }, [tab, truyen])


  useEffect(() => {
    const handleCheckSaved = async () => {
      if (user) {
        mutate(url)
      }
    }
    refetch()
    handleCheckSaved();
  }, [user, url])

  const onClickTab = (tab: string) => {
    setTab(tab)
  }

  const onClickSaved = async () => {
    if (user) {
      setHandling(true)
      savedStory({ url })
        .then(res => {
          setSaved(true)
        })
        .finally(() => { setHandling(false) })
    } else {
      toast.warning("Vui lòng đăng nhập để lưu truyện")
    }
  }

  const onClickUnsaved = async () => {
    if (user) {
      setHandling(true)

      unsavedStory({ url })
        .then(res => {
          setSaved(false)
        })
        .finally(() => { setHandling(false) })

    } else {
      toast.warning("Vui lòng đăng nhập để lưu truyện")
    }
  }

  const onClickShowListChapter = () => {
    setListchapter(true)
  }
  const onCloseModalListChapter = () => {
    setListchapter(false)
  }
  //style
  const liClass = "border-primary rounded-2 color-primary"
  return (
    <Layout >
      <div className="main-content">
        {isLoading ? <LoadingData />
          :
          <>
            <div className="heroSide row">
              <div className='heroSide__img'>
                <div className="img-wrap">
                  <img src={truyen?.image} alt="" />
                </div>
              </div>

              <div className="heroSide__main">
                <div className="heroSide__main__title">
                  <h2 >{truyen?.name}</h2>
                </div>
                <ul className='heroSide__main__info row'>
                  <li className={liClass}>{truyen?.author}</li>
                  <li className={liClass}>{truyen?.status}</li>
                  <li className={liClass}>{truyen?.type}</li>
                </ul>
                <ul className="heroSide__main__statistic row">
                  <li>
                    <span className='fs-16 bold'>{truyen?.numberofchapter || '0'}</span>
                    <span>Chương</span>
                  </li>
                  <li>
                    <span className='fs-16 bold'>{truyen?.reads || '0'}</span>
                    <span>Lượt đọc</span>
                  </li>

                  <li>
                    <span className='fs-16 bold'>{catGiu || '0'}</span>
                    <span>Cất giữ</span>
                  </li>

                </ul>

                <div className="heroSide__main__rate">
                  <div className="heroSide__main__rate-wrap fs-16 d-flex">
                    <span className={`bx ${truyen?.rating >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.rating >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.rating >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.rating >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.rating >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span>&nbsp;{Number(truyen?.rating).toFixed(1)}/5   ({truyen?.numberofrating} đánh giá)</span>
                  </div>

                </div>
                <div className='heroSide__main__handle row' style={{ gap: '15px' }}>
                  <Link to={`/truyen/${url}/${1}`}><button className='btn-primary'><i className='bx bx-glasses'></i>Đọc truyện</button></Link>
                  {
                    saved ?
                      <button onClick={onClickUnsaved} className='btn-outline'>
                        {
                          handling ? <Loading /> : <><i className='bx bx-check' ></i> Đã lưu</>
                        }
                      </button>
                      :
                      <button onClick={onClickSaved} className='btn-outline'>
                        {
                          handling ? <Loading /> : <><i className='bx bx-bookmark' ></i> Đánh dấu</>
                        }</button>
                  }
                  <button className='btn-outline'><i className='bx bx-donate-heart'></i>Đề cử</button>
                </div>

              </div>
            </div>
            <div className='listchapter fs-16' style={{ margin: '15px 0px' }}>
              <div onClick={onClickShowListChapter} className='row' style={{ alignItems: 'center' }}>Danh sách chương<i className='bx bxs-chevron-right'></i></div>
            </div>

            <div className="story-detail">
              <ul className="navigate">
                {
                  nav.map((item, index) => {
                    return (
                      <li
                        className={`navigate__tab fs-20 bold ${active === index ? 'tab_active' : ''} ${item.mobile === 'hide' ? 'mobileHide' : ''}`}
                        key={index}
                        //data={item.path}
                        onClick={() => onClickTab(item.path)}
                      >{item.display}</li>)
                  })
                }
              </ul>
            </div>

            <div className="story-detail__tab__main">
              {main}
            </div>
          </>
        }
      </div>
      {listchapter && <Modal active={listchapter}>
        <ModalContent onClose={onCloseModalListChapter} style={{ width: '100%' }}>
          <ListChapter key={'chapter'} totalPage={truyen?.numberofchapter || 0 / 20} />
        </ModalContent>
      </Modal>}
    </Layout>

  )
}


const About: React.FC<{ description: string }> = (props) => {
  return (<>
    <p>
      {props.description}
    </p>
  </>)
}

type ListChapterProps = {
  col?:number,
  totalPage:number;
}

export const ListChapter: React.FC<ListChapterProps> = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isUnlockChapter, setIsUnlockChapter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState('')
  const [chapnum, setChapnum] = useState(1)
  const size = 20;
  const url = useParams().url || ''
  const navigate = useNavigate()

  const user = userStore(state => state.user)
  const updateBalance = userStore(state => state.updateBalance)

  const { isLoading, data: chapters ,refetch} = useQuery<Chapter[], Error>(['get-chapters', currentPage - 1,url],
    () => getNameChapters(url, {//payload
      page: currentPage - 1,
      size: 20
    }))

  const handleChapterLock = (e: MouseEvent<HTMLAnchorElement>, id: string, chapnumber: number) => {
    e.preventDefault()
    setIsUnlockChapter(true)
    setId(id)
    setChapnum(chapnumber)
  }
  const handleUnlock = () => {
    if (user) {
      setLoading(true)
      unlockChapter({ id })
        .then(res => {
          toast.success("Mở khoá truyện thành công")
          updateUser()
          refetch()
          setIsUnlockChapter(false)
          navigate(`/truyen/${url}/${chapnum}`)
        })
        .catch(err => {
          toast.warning("Mở khoá truyện không thành công")
        })
        .finally(() => setLoading(false))
    } else {
      toast.warning("Vui lòng đăng nhập trước khi mở khoá truyện", {
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 1200
      })
    }
  }

  const updateUser = async () => {
    const res = getData(await getUserInfo());
    const { balance } = res.userInfo
    updateBalance(balance)
  }

  return (
    <>
      <h3>Danh sách chương</h3>
      {
        isLoading ? <LoadingData /> :
          <Grid gap={15} col={props.col || 3} smCol={1}>
            {
              chapters && chapters.map((item, index) => <Link to={`/truyen/${url}/${item.chapternumber}`}
                key={index} className='text-overflow-1-lines'
                onClick={item.isLock && !item.unlock ? (e: MouseEvent<HTMLAnchorElement>) => handleChapterLock(e, item._id, item.chapternumber) : undefined}
                style={{ "fontSize": `${16}px` }}>
                {item.chaptername} {item.isLock && !item.unlock && <i className='bx bx-lock'></i>}
              </Link>
              )
            }
          </Grid>
      }

      {
        isUnlockChapter &&
        <Modal active={isUnlockChapter}>
          <ModalContent onClose={() => setIsUnlockChapter(false)}>

            <div className='auth-wrap'>
              <div className="auth-header">
                <h4>Mở khoá chương truyện</h4>
              </div>
              <div className="auth-body">
                <div className="listchapter__modal">
                  <p className="">Bạn có muốn dùng 200 coin để mở khoá chương này không?</p>
                  <button className='btn-primary' onClick={handleUnlock}>{loading && <Loading />}Mở khoá</button>
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>}


      <Pagination totalPage={Math.ceil(props.totalPage / size)} currentPage={currentPage} handleSetPage={setCurrentPage} />

    </>
  )
}


const Donate = () => {
  return (
    <h1>Hâm mộ</h1>
  )
}
export default StoryDetail