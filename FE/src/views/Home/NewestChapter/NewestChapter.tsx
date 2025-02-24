
import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Section, { SectionBody, SectionHeading } from '../../../components/Section/Section'
import Skeleton from 'react-loading-skeleton'
import './NewestChapter.scss'
import { useQuery } from 'react-query'
import { getChapterNewUpdate } from 'api/apiStory'

function NewestChapter() {
const [newUpdate,setNewUpdate]  = useState(Array.from(Array(10).keys(),i=>undefined))
const {data, isFetched} = useQuery(['get-newest-chapter',{size:10}],getChapterNewUpdate)
  useEffect(()=>{
    if(isFetched && data) {
      setNewUpdate(data)
    }
  },[data, isFetched])

  
  return (
    <div className='row'>
      <div className="col-12">

        <Section>
          <SectionHeading>
            <h4 className='section-title'>Mới cập nhật</h4>
            <Link to="tat-ca">Xem tất cả</Link>
          </SectionHeading>
          <SectionBody>
            <table className='newest-chapter'>
              <tbody>
                {
                  newUpdate.map((item,i) =>
                   <tr key={i}>
                     {
                        item?<>
                    <td><span className='text-overflow-1-lines text-secondary'>{item.type}</span></td>
                    <td className='w-25'>
                      <Link to={`truyen/${item.url}`}>
                      <span className='text-overflow-1-lines fw-6'>{item.name}</span>
                      </Link></td>
                    <td className='w-25'>
                      <Link to={`truyen/${item.url}/${item.chapternumber}`}><span className='text-overflow-1-lines'>{item.chaptername}</span></Link>
                    </td>
                    <td><span className='text-overflow-1-lines'>{item.author}</span></td>
                    <td><span className='text-overflow-1-lines text-secondary'>{item.uploader}</span></td>
                    <td><span className='text-overflow-1-lines text-secondary'>
                      {moment(item.updatedAt).fromNow()}</span></td></>
                      :<td>
                        <Skeleton height={16}/></td>
}
                  </tr>)
                }
              </tbody>
            </table>
          </SectionBody>
        </Section>
      </div>
    </div>
  )
}
moment.updateLocale('en', {
  relativeTime : {
      future: "in %s",
      past:   "%s trước",
      s  : 'vài giây',
      ss : '%d giây',
      m:  "1 phút",
      mm: "%d phút",
      h:  "1 giờ",
      hh: "%d giờ",
      d:  "1 ngày",
      dd: "%d ngày",
      w:  "1 tuần",
      ww: "%d tuần",
      M:  "1 tháng",
      MM: "%d tháng",
      y:  "1 năm",
      yy: "%d năm"
  }
});
export default NewestChapter