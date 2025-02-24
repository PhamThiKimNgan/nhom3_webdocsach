import React, { useCallback, useEffect, useState } from 'react'
import apiMain from 'api/apiMain'
import Grid from 'components/Grid/Grid'
import { toast } from 'react-toastify'
import AddChapter from './AddChapter'
import { ClickEventHandler } from 'types/react'
import { deleteChapter } from 'api/apiChapter'
import { useQuery } from 'react-query'
import { getNameChapters } from 'api/apiStory'

type ListChapProps = {
  url:string,
  onClickBackFromListChap:ClickEventHandler
}
const ListChap:React.FC<ListChapProps> = ({ url,onClickBackFromListChap }) => {
    const [addChap, setAddChap] = useState<boolean>(false)
    const [chapternumber, setChapternumber] = useState<number | string>('')
    
    const {data:chapters,refetch} = useQuery(['get-chapters'],()=>getNameChapters(url, {size:20}))
    
    const onClickUpdateChap = (value:number) => {
      setChapternumber(value)
      setAddChap(true)
    }
    const onClickDeleteChap = (value:number) => {
      if (value) {
        deleteChapter({ url, chapnumber: value })
          .then(res => {
            refetch()
            toast.success(res.message)
          })
          .catch(err => {
            toast.error(err.response.details.message)
          })
      }
    }

    const onClickBackFromAddChap:ClickEventHandler = ()=>{
      setAddChap(false)
      refetch()
    }
  
    const onClickAddChapter:ClickEventHandler = (e) => {
      setAddChap(true)
      setChapternumber('')
    }
    const reloadChapters = useCallback(()=>refetch(),[])
    return (
      <>{
        addChap ? <AddChapter url={url} chapnumber={chapternumber} 
         onClickBackFromAddChap={onClickBackFromAddChap}
         reloadChapters={reloadChapters}/> :
  
          <div>
            <div className='d-flex' style={{ 'justifyContent': 'space-between' }}>
              <span className='text-with-icon' onClick={onClickBackFromListChap}><i className='bx bx-left-arrow' ></i> Danh sách truyện</span>
              <span className='fs-20 fw-6'>Danh sách chương</span>
              <button className='btn-primary' style={{ 'margin': '0px 10px' }} onClick={onClickAddChapter}>Thêm chương</button>
            </div>
            <Grid gap={15} col={2} smCol={1}>
              {
                chapters?.map((item, index) => {
                  return (
                    <div key={item.chapternumber}>
                    <div className='d-flex'>
                      <div className="col-10 d-flex" style={{'alignItems':'center'}}>
                        <h4 key={item.chapternumber} className='text-overflow-1-lines'>{item.chaptername}</h4>
                      </div>
                      <div className="col-2">
                        <span className="text-with-icon" onClick={()=>onClickUpdateChap(item.chapternumber)}><i className='bx bx-edit' ></i> Sửa</span>
                        <span className="text-with-icon" onClick={()=>onClickDeleteChap(item.chapternumber)} ><i className='bx bx-trash' ></i> Xoá</span>
                      </div>
                    </div><hr/></div>
                    )
                })
              }
            </Grid>
          </div>
      }
      </>
    )
  }

  export default ListChap