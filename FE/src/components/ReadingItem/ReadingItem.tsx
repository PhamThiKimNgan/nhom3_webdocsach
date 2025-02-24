
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import './ListReading.scss'
import { Reading } from 'models/Reading'
function ReadingItem(props:{data:Partial<Reading>}) {
  const data = props.data

  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        {data?.image ? <img src={data?.image} alt="" /> : <Skeleton width={32} height={43}/>}
      </div>
      <div className="reading-card__content">
        {
          data?.name?<Link to={`/truyen/${data?.url}`} className="reading-card__title fs-15">
          {data?.name}
        </Link> :<Skeleton />
        }
        
        {
          data?.chapternumber !== undefined?
            <div className="reading-card__chap">
              Đã đọc: {data.chapternumber}/{data?.sochap}
            </div> : <Skeleton />
        }
      </div>
    </div>
  )
}

export default ReadingItem