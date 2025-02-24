import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify'
import getData from 'api/getData'
import { ChangeEventHandler, ClickEventHandler } from 'types/react';
import { getChapterByNumber } from 'api/apiStory';
import { createChapter, updateChapter } from 'api/apiChapter';

type AddChapterProps = {
  url: string,
  chapnumber: number | string,
  onClickBackFromAddChap: ClickEventHandler,
  reloadChapters: ClickEventHandler
}
const AddChapter: React.FC<AddChapterProps> = ({ url, chapnumber, onClickBackFromAddChap }) => {
  const [content, setContent] = useState<string>("")
  const [tenchuong, setTenchuong] = useState<string>("")
  const [edit, setEdit] = useState<boolean>(false)
  const [isLock, setIsLock] = useState<boolean>(false)

  const onChangeTenchuong: ChangeEventHandler = (e) => {
    setTenchuong(e.target.value)
  }

  useEffect(() => {
    const GetChapter = async () => {
      if (chapnumber) {
        getChapterByNumber(url, chapnumber)
          .then(res => {
            setContent(res.content || '')
            setTenchuong(res.chaptername)
            setEdit(true)
            setIsLock(res.isLock)
          })
      }
    }
    GetChapter()
  }, [url, chapnumber])

  const onClickAddChapter:ClickEventHandler = async (e) => {
    const params = { content, tenchap: tenchuong, url, isLock }
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    createChapter(params)
      .then(res => {
        toast.success("Thêm chương thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }

  const onClickEditChapter:ClickEventHandler = async (e) => {
    const params = { content, tenchap: tenchuong, url, chapnumber, isLock }
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    updateChapter(params)
      .then(res => {
        toast.success("Sửa truyện thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }
  const labelStyle = { 'minWidth': '100px', 'margin': '5px 0px', 'display': 'inline-block' }
  return (<>
    <div>
      <span className='text-with-icon' onClick={onClickBackFromAddChap}><i className='bx bx-left-arrow'></i> Danh sách chương</span>
    </div>
    <div className="group-info" style={{ 'marginBottom': '10px' }}>
      <label htmlFor="" className='fs-16' style={labelStyle}>Tên chương</label>
      <input onChange={onChangeTenchuong} value={tenchuong || ""} />
    </div>
    <div className='d-flex' style={{ 'marginBottom': '10px', gap: '6px' }}>
      <input name='isLock' type='checkbox' checked={isLock} onChange={() => setIsLock(pre => !pre)} />
      <label htmlFor="isLock" className='fs-16' style={labelStyle}>Khoá chương (Tính phí 200coin)</label>
    </div>
    <label htmlFor="" className='fs-16' style={labelStyle}>Nội dung chương</label>
    <CKEditor
      editor={ClassicEditor}
      data={content || ''}
      onReady={editor => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        setContent(editor.getData())
      }}
      onBlur={(event, editor) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        console.log('Focus.', editor);
      }}
    />


    <div className='d-flex'>
      {
        edit ? <button className='btn-primary' onClick={onClickEditChapter} style={{ 'margin': '20px auto' }}>Cập nhật chương</button>
          : <button className='btn-primary' onClick={onClickAddChapter} style={{ 'margin': '20px auto' }}>Thêm chương</button>}

    </div>
  </>)
}
export default AddChapter