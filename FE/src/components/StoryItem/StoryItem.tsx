import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton';
import './Story.scss'
import { Story } from "models/Story";
import React from 'react';
const StoryItem: React.FC<{ data: Partial<Story> }> = ({ data }) => {
  //const data = props.data
  return (
    <>
      <div className='story-card'>
        <div className='story-card__img-wrap'>
          {data?.image ? <img src={data.image} alt="" /> : <Skeleton height={96} width={72} />}
        </div>
        <div className='story-card__content'><h2 className='story-card__tilte'>
          <Link to={`/truyen/${data?.url}`}>{data?.name || <Skeleton />}</Link>
        </h2>


          <div className='story-card__description text-secondary'>{data?.description || <Skeleton count={2} />}</div>

          {
            data?.author ? <div className='story-card__info'>
              <div className='story-card__author text-overflow-1-lines text-secondary'>
                <i style={{ marginRight: '0.25rem' }} className='bx bx-edit-alt'></i>{data?.author}
              </div>
              <span className='story-card__type border border-primary color-primary fs-12 text-overflow-1-lines'
               style={{ padding: 4 + 'px' }}>{data?.type}</span>
            </div> : <Skeleton />
          }

        </div>
      </div>
    </>

  )
}

export default StoryItem