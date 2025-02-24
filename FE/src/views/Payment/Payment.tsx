import "./Payment.style.scss";
import { makePaymentMomo, makePaymentVNPay } from "api/apiPayment";
import React, { Fragment } from "react";
import Layout from "components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { numWithCommas } from "utils/convertNumber";
import { useSelector } from "react-redux";
const data = [
  {
    id: 1,
    amount: 10000,
  },
  {
    id: 2,
    amount: 20000,
  },
  {
    id: 3,
    amount: 50000,
  },
  {
    id: 4,
    amount: 100000,
  },
  {
    id: 5,
    amount: 200000,
  },
];
const Payment = () => {

  const user = useSelector(state=>state.user.info)

  const redirectMomo = (amount) => {
    makePaymentMomo({ orderId: uuidv4(), amount,username:user.username }).then((result) => {
      if (result.payUrl) {
        window.location.replace(result.payUrl);
      } else {
        toast.warning(
          "Có lỗi trong quá trình giao dịch, vui lòng thực hiện lại"
        );
      }
    });
    console.log("Thanh toán ");
  };
  const redirectVNPay = (amount) => {
    makePaymentVNPay({ orderId: uuidv4(), amount,username:user.username }).then((result) => {
      if (result.payUrl) {
        window.location.replace(result.payUrl);
      } else {
        toast.warning(
          "Có lỗi trong quá trình giao dịch, vui lòng thực hiện lại"
        );
      }
    });
    console.log("Thanh toán ");
  };
  return (
    <Fragment>
      <Layout>
        <div className="main-content">
          <div className="payment-section">
            <h1 className="headline">Nạp thẻ</h1>
            <div className="payment-list">
              {data.map((item) => (
                <div key={item.id} className="payment-item">
                  <div className="paymen-price">
                    {numWithCommas(item.amount)}đ
                  </div>
                  <div
                    className="paymen-item__button"
                    onClick={() => redirectMomo(item.amount)}
                  >
                    Thanh toán với Momo
                  </div>
                  <div
                    className="paymen-item__button"
                    onClick={() => redirectVNPay(item.amount)}
                  >
                    Thanh toán với VNPay
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Payment;
