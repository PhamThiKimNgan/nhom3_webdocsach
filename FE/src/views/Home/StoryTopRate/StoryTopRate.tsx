import { useEffect, useState } from 'react'
import apiMain from 'api/apiMain';
import Section, { SectionHeading, SectionBody } from 'components/Section/Section';
import StoryRate from 'components/StoryItem/StoryRate';
import getData from 'api/getData';
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { getStoriesTopRating } from 'api/apiStory';
import { Story } from 'models/Story';



function StoryTopRate() {

   const { data: stories } = useQuery<Story[], AxiosError>(['get-stories-toprating'], getStoriesTopRating)
  
  return (
    <>
      <div className='row'>
        <div className="col-12">

          <Section>
            <SectionHeading>
              <h4 className='section__title'>Đánh giá cao</h4>
              <Link to='tat-ca'>Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className='row' style={{ marginTop: -24 }}>
                {
                  stories ?
                    stories.map((data, index) => <div key={index} className='col-4 col-md-6 col-sm-12'>
                      <StoryRate data={data} />
                    </div>)
                    :
                    Array(6).map((data, index) =>
                      <div key={index} className='col-4 col-md-6 col-sm-12'>
                        <StoryRate data={data} />
                      </div>)
                }
              </div>
            </SectionBody>
          </Section>
        </div>

      </div>
    </>

  )
}

export default StoryTopRate