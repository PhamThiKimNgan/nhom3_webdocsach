import { useEffect, useState } from 'react'
import { useQuery } from "react-query";
import Section, { SectionHeading, SectionBody } from 'components/Section/Section';
import StoryItem from 'components/StoryItem/StoryItem';
import { Link } from 'react-router-dom'
import './ListStory.scss'
import { userStore } from 'store/userStore';
import { getReadingDefault, getReadings, getStories } from 'api/apiStory';
import { Story } from 'models/Story';
import ReadingItem from 'components/ReadingItem/ReadingItem';
import { Reading } from 'models/Reading';

function ListStory() {

  const [datas, setData] = useState<Story[]>([]);
  const [readings, setReadings] = useState<Reading[]>([])
  // const user = useSelector(state => state.user.info)
  const user = userStore(state => state.user)

  useEffect(() => {

    const getReading = async () => {//Xử lý gọi API thông tin đang đọc
      let readingsDefault = await getReadingDefault({ page: 1, size: 8 });

      if (user) {
        if (readingsDefault) {

          getReadings()
            .then((res) => {
              if (res.length < 10) {
                res = [...res, ...readingsDefault].slice(0, 8)
              }
              setReadings(res)
              localStorage.setItem("readings", JSON.stringify(res))
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
      else {

        if (localStorage.getItem("readings")) {
          let readings = JSON.parse(localStorage.getItem("readings")!)
          if (Array.isArray(readings)) {
            setReadings(readings)
          }
        }
        else {
          setReadings(readingsDefault)
          localStorage.setItem("readings", JSON.stringify(readingsDefault))
        }

      }
    }
    getReading();//gọi hàm
  }, [user])

  const { isLoading, isSuccess, data } =
    useQuery<Story[], Error>(['query-stories', { size: 6 }], getStories);


  useEffect(() => {
    if (isSuccess && data)
      setData(data)

  }, [isSuccess, data])
  return (
    <div key={"ListStory"} className='row'>
      <div className='col-8 col-md-12 col-sm-12'>
        <Section >
          <SectionHeading>
            <h4 className='section-title'>Biên tập viên đề cử</h4>
            <Link to='tat-ca'>Xem tất cả</Link>
          </SectionHeading>
          <SectionBody>
            <div key={"section1"} className='list-story' style={{ marginTop: -24 }}>
              {
                isLoading ? Array.from(Array(6)).map(
                  (data, index) => <StoryItem key={index} data={data}/>
                ) :
                  datas.map((data, index) => <StoryItem key={index} data={data} />)}
            </div>
          </SectionBody>
        </Section>

      </div>

      <div className='col-4 col-md-12 col-sm-12'>
        <Section key={"section2"}>
          <SectionHeading>
            <h4 className='section-title'>Đang đọc</h4>
            <Link to="tat-ca">Xem tất cả</Link>
          </SectionHeading>
          <SectionBody>
            <div className='list-reading'>
              {
              readings.length === 0 ? Array.from(Array(6)).map(
                (data, index) => <ReadingItem key={index} data={data}/>
              ) :
              readings.map((item, i) => <ReadingItem key={i} data={item} />)}
            </div>
          </SectionBody>
        </Section>

      </div>
    </div>


  )
}

export default ListStory