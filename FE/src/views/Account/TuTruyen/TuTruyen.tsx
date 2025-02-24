import ReadingItem from 'components/ReadingItem/ReadingItem'
import StoryCreated from './Story/StoryCreated'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Reading } from 'models/Reading'
import { AxiosError } from 'axios'
import { getReadings } from 'api/apiStory'
import ListSaved from './ListSaved/ListSaved'

const nav = [
  {
    path: 'reading',
    display: 'Đang đọc'
  },
  {
    path: 'saved',
    display: 'Đánh dấu'
  },
  {
    path: 'created',
    display: 'Đã đăng'
  },
]
function TuTruyen() {

  const location = useLocation()
  const active = nav.findIndex(e => e.path === location.pathname.split('/').pop())
  
  return (
    <>
      <div className='navigate'>
        {
          nav.map((item, index) => {
            return <Link key={item.path} to={item.path} className={`navigate__tab fs-18 fw-6 ${active === index ? 'tab_active' : ''}`}
              //name={item.path}
            >{item.display}</Link>
          })
        }
      </div>
      <Routes>
        <Route key={'reading'} path='reading' element={<Readings key={'reading'}/>} />
        <Route key={'saved'} path='saved' element={<ListSaved key={'saved'} />} />
        <Route key={'created'} path='created' element={<StoryCreated key={'created'}/>} />
      </Routes>


    </>
  )
}
const Readings = () => {
  const {data:readings} = useQuery<Reading[],AxiosError>(['get-readings'], getReadings)

  return (
    <div>
      {
        readings?.map((item, i) => <div key={i} >
          <ReadingItem  data={item} />
            <hr /></div>)
        
      }</div>)
}



export default TuTruyen