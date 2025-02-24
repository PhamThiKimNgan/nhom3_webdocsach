import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./views/Home/Home";
import Account from "./views/Account/Account";
import StoryDetail from "./views/StoryDetail/StoryDetail";
import Active from "./views/Active/Active";
import ChapterView from "./views/ChapterView/ChapterView";
import Search from "./views/Search/Search";
// import AllStory from "./views/AllStory/AllStory";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./scss/App.scss";
import Payment from "views/Payment/Payment";
import ResultPayment from "views/ResultPayment/ResultPayment";
import { axiosInstance } from './api/axiosClient'
import CheckAuthentication from "components/CheckAuthentication/CheckAuthentication";
import ScrollToTop from "components/ScrollToTop";
import { authStore } from "store/authStore";
import Error404 from "views/ErrorPage/Error404";

function App() {
  const refreshToken = authStore((state) => state.auth?.refreshToken);
  const accessToken = authStore((state) => state.auth?.accessToken);
  const loginSuccess = authStore(state => state.loginSuccess)
  const logoutSuccess = authStore(state => state.logoutSuccess)

  if (accessToken && refreshToken) {
    axiosInstance({ accessToken, refreshToken }, loginSuccess, logoutSuccess);
  }
  // useEffect(()=>{
  //   updateTraffic()
  // },[])
  return (
    <BrowserRouter>

      <Header />
      <CheckAuthentication>
        <ScrollToTop>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="truyen/:url" element={<StoryDetail />} />
            <Route path="truyen/:url/:chapnum" element={<ChapterView />} />
            <Route path="active/:token" element={<Active />} />
            <Route path="/user/*" element={<Account />} />
            <Route path="tim-kiem" element={<Search />} />
            <Route path="/*" element={<Error404 />} />
            <Route path="payment" element={<Payment />} />
        <Route path="result-payment" element={<ResultPayment />} />
            {/*         
        <Route path="tat-ca" element={<AllStory />} />
         */}
          </Routes>
        </ScrollToTop>
      </CheckAuthentication>
      <Footer />
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover={false}
      />
    </BrowserRouter>
  );
}

export default App;
