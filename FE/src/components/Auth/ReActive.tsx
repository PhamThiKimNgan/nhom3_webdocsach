import { reActive } from "api/apiAuth";
import Loading from "components/Loading/Loading";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChangeEvent, ClickEvent } from "types/react";

export default function ReActive(props:any) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
  
    const onChangeEmail = (e:ChangeEvent) => {
      setEmail(e.target.value)
    }
  
    const onReActive = async (e:ClickEvent) => {//xử lý gọi api gửi mail kích hoạt
      e.preventDefault()
      setLoading(true)
      const data = { email }
      reActive(data)
        .then(response => {
          toast.success("Đã gửi đường dẫn kích hoạt vào email. Vui lòng kiểm tra", { autoClose: 1200, pauseOnHover: false, hideProgressBar: true });
        })
        .catch(err => {
          toast.error(err.response.data.details.message, { autoClose: 1200, pauseOnHover: false, hideProgressBar: true });
        })
        .finally(() => { setLoading(false) })
  
    }
    return (
      <div className="form-wrap">
        <form>
          <div className="form-group d-flex">
            <div className='d-flex label-group'>
              <label >Email</label>
            </div>
            <div className="field-wrap">
              <input
                placeholder="Email" required name="emailActive" type="text"
                onChange={onChangeEmail
                } value={email} />
            </div>
          </div>
          <button className='rounded-2' onClick={onReActive}>{loading ? <Loading /> : ''}Gửi đường dẫn kích hoạt</button>
        </form>
      </div>
    )
  }