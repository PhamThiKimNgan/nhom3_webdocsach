import {Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton';
import './Story.scss'
import { Story } from 'models/Story';
function StoryRate(props:{data:Partial<Story>}) {
    const data=props.data;
  return (
    <>
    <div className='story-card'>
        <div className='story-card__img-wrap'>
            {
              data?.image?<img src={data?.image} alt=""/>
              :<Skeleton height={96} width={72} />}
        </div>
        <div className='story-card__content'>
            <h2 className='story-card__tilte'><Link to={`truyen/${data?.url}`}>{data['name']||<Skeleton />}</Link></h2>
            <div className="story-card__rate">{
              data?.rating !== undefined?<>
                <span className='story-card__rate__score'>{Number(data?.rating | 0).toFixed(1)}</span>
                <span className='story-card__rate__count'>{`${data?.numberofrating} đánh giá`}</span>
              </>:<Skeleton />
            }
            </div>
            <div className='story-card__description text-secondary'>{data?.description||<Skeleton count={2} />}</div>
            <div className='story-card__info'>
            {
              data?.author?<>
              <div className='story-card__author text-overflow-1-lines text-secondary'><i style={{marginRight:'0.25rem'}} className='bx bx-edit-alt'></i>{data.author}</div>
              <span className='story-card__type border border-primary color-primary fs-12 text-overflow-1-lines' style={{padding:4+'px'}}>{data.type}</span>
              </>:<Skeleton />
            }
            </div>
        </div>
    </div>
    </>
    
  )
}

export default StoryRate