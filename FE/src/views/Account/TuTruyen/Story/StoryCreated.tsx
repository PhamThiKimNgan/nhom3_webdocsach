import { useState, useCallback, MouseEventHandler } from "react"
import { toast } from "react-toastify"
import getData from "api/getData"
import ListChap from "../Chapter/ListChap"
import EditStory from "./EditStory"
import { userStore } from "store/userStore"
import { useQuery } from "react-query"
import { deleteStory, getStoriesByUsername } from "api/apiStory"
import { ClickEventHandler } from "types/react"

const StoryCreated = () => {

  const [listChap, setListChap] = useState(false)
  const [editNovel, setEditNovel] = useState(false)
  const user = userStore(state => state.user)
  const [url, setUrl] = useState('')

  const { data: stories, refetch } = useQuery(['get-stories'],()=>getStoriesByUsername({ id: user?.id }))

  const onClickUpdateStory: ClickEventHandler = (e) => {
    setEditNovel(true)
    setUrl(e.currentTarget?.getAttribute('data-url') || '')
  }

  const onClickDeleteStory = (value:string) => {
    if (value) {
      deleteStory({ url: value })
        .then(res => {
          refetch()
          toast.success(res.message)
        })
        .catch(err => {
          toast.error(getData(err.response)?.details.message)
        })
    }
  }

  const onClickBackFromListChap = useCallback(() => {
    setListChap(false)
    setEditNovel(false)
  }, [])

  const onClickTruyen:MouseEventHandler<HTMLHeadingElement> = (e) => {

    setUrl(e.currentTarget?.getAttribute("data-url") || '')
    setListChap(true)
  }
  const onClickBackFromEditNovel: ClickEventHandler = useCallback(() => {
    setEditNovel(false)
  }, [])
  return (<>
    {listChap ? <ListChap onClickBackFromListChap={onClickBackFromListChap} url={url} /> :
      editNovel ? <EditStory url={url} onClickBackFromEditNovel={onClickBackFromEditNovel} /> :
        stories?.map(data => {
          return (<div key={data.url}>
            <div className="reading-card">
              <div className="reading-card__img-wrap">
                <img src={data.image} alt="" />
              </div>
              <div className="reading-card__content">
                <h4 onClick={onClickTruyen} itemID={data?.url} data-url={data?.url} className="reading-card__title">
                  {data.name}
                </h4>
                <div className="d-flex" style={{ 'gap': '15px' }}>
                  <span className="text-with-icon" onClick={onClickUpdateStory} data-url={data.url}><i className='bx bx-edit' ></i> Sửa</span>
                  <span className="text-with-icon" onClick={() => onClickDeleteStory(data.url)} ><i className='bx bx-trash' ></i> Xoá</span>

                </div>
              </div>

            </div><hr /></div>
          )
        })
    }
  </>
  )
}

export default StoryCreated;