import "./Payment.style.scss";
import { useEffect } from "react";
import { getInfoWithBalance } from "api/apiPayment";
import { Fragment } from "react";
import Layout from "components/Layout/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingData from "components/LoadingData/LoadingData";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { userStore } from "store/userStore";

const ResultPayment = () => {
  const query = useSearchParams()[0]
  const user = userStore(state => state.user)
  const updateBalance = userStore(state=>state.updateBalance)
  const [message, setMessage] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const getBalance = () => {
      if (query.get('resultCode') === '0') {
        getInfoWithBalance()
          .then(res => {
            updateBalance(res.balance)
            navigate('/')
          })
      }
      else {
        setMessage(query.get('message') || '')
        setTimeout(() => navigate('/'), 3000)
      }
    }
    getBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  return (
    <Fragment>
      <Layout>
        <div className="main-content">
          <LoadingData />
          <h3>{message || "Đang cập nhật số dư. Vui lòng chờ trong giây lát"}</h3>
        </div>
      </Layout>
    </Fragment>
  );
};

export default ResultPayment;
