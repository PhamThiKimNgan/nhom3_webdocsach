import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import '../ReadingItem/ListReading.scss'
import { Saved } from 'models/Saved'

type SavedProps = {
  data:Partial<Saved>
}
const SavedItem:React.FC<SavedProps>=(props)=> {
  const data = props.data
  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        {data?.image ? <img src={data.image} alt="" /> : <Skeleton width={32} height={43}/>}
      </div>
      <div className="reading-card__content">
        {
          data?.name?<Link to={`/truyen/${data?.url}`} className="reading-card__title fs-15">
          {data.name}
        </Link> :<Skeleton />
        }
        
        {
          data?.author?
            <div className="reading-card__chap">
              Tác giả: {data.author}
            </div> : <Skeleton />
        }
      </div>
    </div>
  )
}

export default SavedItem