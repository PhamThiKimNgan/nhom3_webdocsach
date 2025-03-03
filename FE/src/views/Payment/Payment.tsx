import "./Payment.style.scss";
import { makePaymentMomo, makePaymentVNPay } from "api/apiPayment";
import React, { Fragment, useState } from "react";
import Layout from "components/Layout/Layout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { numWithCommas } from "utils/convertNumber";
import { FaLock, FaCreditCard, FaCheckCircle, FaHistory, FaWallet } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { userStore } from "store/userStore";

const paymentAmounts = [
  { id: 1, amount: 10000 },
  { id: 2, amount: 20000 },
  { id: 3, amount: 50000 },
  { id: 4, amount: 100000 },
  { id: 5, amount: 200000 },
];

const FaCheckCircleIcon = FaCheckCircle as React.ComponentType<{className?: string, size?: number}>;
const FaLockIcon = FaLock as React.ComponentType<{className?: string, size?: number}>;
const FaCreditCardIcon = FaCreditCard as React.ComponentType<{className?: string, size?: number}>;
const FaHistoryIcon = FaHistory as React.ComponentType<{className?: string, size?: number}>;  
const FaWalletIcon = FaWallet as React.ComponentType<{className?: string, size?: number}>;
const BsBank2Icon = BsBank2 as React.ComponentType<{className?: string, size?: number}>;

const Payment = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const user = userStore(state => state.user)

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const processPayment = () => {
    if (!selectedAmount) {
      toast.warning("Vui lòng chọn số tiền muốn nạp");
      return;
    }

    if (selectedPaymentMethod === "momo") {
      redirectMomo(selectedAmount);
    } else if (selectedPaymentMethod === "vnpay") {
      redirectVNPay(selectedAmount);
    } else {
      toast.warning("Vui lòng chọn phương thức thanh toán");
    }
  };

  const redirectMomo = (amount) => {
    makePaymentMomo({
      orderId: uuidv4(),
      amount,
      username: user?.username || '',
    }).then((result) => {
      if (result.payUrl) {
        window.location.replace(result.payUrl);
      } else {
        toast.warning(
          "Có lỗi trong quá trình giao dịch, vui lòng thực hiện lại"
        );
      }
    });
  };

  const redirectVNPay = (amount) => {
    makePaymentVNPay({
      orderId: uuidv4(),
      amount,
      username: user?.username || '',
    }).then((result) => {
      if (result.payUrl) {
        window.location.replace(result.payUrl);
      } else {
        toast.warning(
          "Có lỗi trong quá trình giao dịch, vui lòng thực hiện lại"
        );
      }
    });
  };

  return (
    <Fragment>
      <Layout>
        <div className="main-content">
          <div className="payment-container">
            <div className="payment-header">
              <h1>Nạp tiền vào tài khoản</h1>
              <p className="payment-subtitle">
                Chọn số tiền và phương thức thanh toán ưa thích của bạn
              </p>
            </div>

            <div className="account-balance">
              <div className="balance-card">
                <div className="balance-label">Số dư hiện tại</div>
                <div className="balance-amount">
                  {user?.balance ? numWithCommas(user.balance) : 0}đ
                </div>
              </div>
            </div>

            <div className="payment-card">
              <div className="payment-section">
                <div className="section-header">
                  <h2>
                    <FaCreditCardIcon className="section-icon" size={18} /> Chọn số tiền
                  </h2>
                </div>
                <div className="amount-grid">
                  {paymentAmounts.map((item) => (
                    <div
                      key={item.id}
                      className={`amount-item ${
                        selectedAmount === item.amount ? "selected" : ""
                      }`}
                      onClick={() => handleAmountSelect(item.amount)}
                    >
                      <div className="amount-value">
                        {numWithCommas(item.amount)}đ
                      </div>
                      {selectedAmount === item.amount && (
                        <FaCheckCircleIcon className="check-icon" size={16} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-section">
                <div className="section-header">
                  <h2>
                    <BsBank2Icon className="section-icon" size={18} /> Chọn phương thức thanh
                    toán
                  </h2>
                </div>
                <div className="payment-methods">
                  <div
                    className={`payment-method ${
                      selectedPaymentMethod === "momo" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentMethodSelect("momo")}
                  >
                    <div className="method-icon momo-icon">
                      <FaWalletIcon size={18} />
                    </div>
                    <div className="method-name">MoMo</div>
                    {selectedPaymentMethod === "momo" && (
                      <FaCheckCircleIcon className="check-icon" />
                    )}
                  </div>

                  <div
                    className={`payment-method ${
                      selectedPaymentMethod === "vnpay" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentMethodSelect("vnpay")}
                  >
                    <div className="method-icon vnpay-icon">
                      <div className="vnpay-logo">VNPAY</div>
                    </div>
                    <div className="method-name">VNPay</div>
                    {selectedPaymentMethod === "vnpay" && (
                      <FaCheckCircleIcon className="check-icon" />
                    )}
                  </div>
                </div>
              </div>

              <div className="payment-summary">
                <div className="summary-row">
                  <span className="summary-label">Số tiền:</span>
                  <span className="summary-amount">
                    {selectedAmount
                      ? numWithCommas(selectedAmount) + "đ"
                      : "---"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phương thức:</span>
                  <span className="summary-value">
                    {selectedPaymentMethod === "momo"
                      ? "MoMo"
                      : selectedPaymentMethod === "vnpay"
                      ? "VNPay"
                      : "---"}
                  </span>
                </div>
                <div className="summary-row total-row">
                  <span className="summary-label">Thành tiền:</span>
                  <span className="total-amount">
                    {selectedAmount
                      ? numWithCommas(selectedAmount) + "đ"
                      : "---"}
                  </span>
                </div>
                <button
                  className="payment-button"
                  disabled={!selectedAmount || !selectedPaymentMethod}
                  onClick={processPayment}
                >
                  <FaLockIcon className="button-icon" size={16} /> Thanh toán an toàn
                </button>
              </div>

              <div className="security-notice">
                <FaLockIcon className="lock-icon" size={16} />
                <p>
                  Thanh toán an toàn và bảo mật. Thông tin của bạn được mã hóa
                  SSL.
                </p>
              </div>
            </div>

            <div className="payment-info-box">
              <div className="info-box-header">
                <FaHistoryIcon className="info-icon" size={18} />
                <h3>Lịch sử giao dịch gần đây</h3>
              </div>
              <p className="info-box-text">
                Hoàn tất giao dịch để xem lịch sử giao dịch của bạn.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Payment;
