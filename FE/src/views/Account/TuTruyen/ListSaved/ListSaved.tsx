import SavedItem from 'components/SavedItem/SavedItem'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { getListSaved } from 'api/apiSaveStory'
import { Saved } from 'models/Saved'
const ListSaved = () => {
    const {data:listSaved} = useQuery<Saved[],AxiosError>(['get-listsaved'],
    getListSaved)
  
    return (
      <div>
        {
          listSaved?.map((item, i) => <div key={item.url} >
            <SavedItem data={item} />
              <hr /></div>)
          
        }</div>)
  }
  export default ListSaved