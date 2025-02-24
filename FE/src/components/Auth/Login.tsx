import useLogin from "hooks/useLogin";
import { useState } from "react";
import { ClickEventHandler } from "types/react";
import Loading from '../Loading/Loading'
import './Login.scss'
export default function Login(props:any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const { mutate, isLoading } = useLogin()
  
    const onLogin:ClickEventHandler = async (e) => {//xử lý đăng nhập
      e.preventDefault();
      const user = { username, password };
      mutate(user)
    }
    return (
      <div className="form-wrap">
        <form>
          <div className="form-group d-flex">
            <div className='d-flex label-group'>
              <label >Tên đăng nhập</label>
              <a onClick={props.onClickActive}>Kích hoạt tài khoản</a>
            </div>
            <div className="field-wrap">
              <input
                placeholder="Username" required name="username" type="text"
                onChange={(e) => {
                  setUsername(e.target.value)
                }} value={username} />
            </div>
  
          </div>
          <div className="form-group d-flex">
            <div className="label-group d-flex">
              <label>Mật khẩu</label>
              <a onClick={props.onClickForgetpw}>Quên mật khẩu</a>
            </div>
            <div className="field-wrap">
              <input placeholder="Password" required name="password" type='password' value={password}
                onChange={e => {
                  setPassword(e.target.value)
                }} />
            </div>
          </div>
          <div className="d-flex">
            <label className='remember-label' htmlFor="remember">
              <span>Ghi nhớ mật khẩu</span>
              <input type="checkbox" id="remember"></input>
              <span className="checkmark"></span>
            </label>
          </div>
          <button className='rounded-2' onClick={onLogin}>{isLoading ? <Loading /> : ""}Đăng nhập</button>
  
        </form>
        <span className="register-choose"><label>Bạn chưa có tài khoản. </label><a onClick={props.handleChooseRegister}>Đăng ký ngay?</a></span>
      </div>
    )
  }