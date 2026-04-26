import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./Modals/ForgetPassword";
import ResetPassword from "./Modals/ResetPassword";
import AllPackages from "./Pages/AllPackages";
import Parent from "./Pages/Parent";
import Payment from "./Pages/Payment";
import BookingOverview from "./Payment/BookingOverview";
import Paymentfail from "./Payment/PaymentFail";
import Paymentsuccess from "./Payment/Paymentsuccess";
import { useGetAllBannerQuery } from "./services";
import Emailvarification from "./SmallComponents/Emailvarification";
import Loading from "./SmallComponents/Loading";
import TwoStepCode from "./SmallComponents/TwoSteoCode";
import { TwoStepVerification } from "./SmallComponents/TwoStepVerification";

const Home = React.lazy(() => import("./Pages/Home"));
const Blogs = React.lazy(() => import("./Pages/Blogs"));
const AboutUs = React.lazy(() => import("./Pages/AboutUs"));
const ContactUs = React.lazy(() => import("./Pages/ContactUs"));
const Careers = React.lazy(() => import("./Pages/Careers"));
const Profile = React.lazy(() => import("./Pages/Profile"));
const TermsAndConditions = React.lazy(() => import("./Pages/TermsAndConditions"));
const CancellationAndRefund = React.lazy(() => import("./Pages/CancellationAndRefund"));
const PrivacyPolicy = React.lazy(() => import("./Pages/PrivacyPolicy"));

const CategorieDetails = React.lazy(() =>
  import("./Component/Home/CategorieDetails")
);
const UpcommingDetails = React.lazy(() =>
  import("./SmallComponents/Tabs/UpCommingTabs/UpCommingDetails")
);
const BlogDetail = React.lazy(() => import("./Component/BlogDetail"));
const HostPage = React.lazy(() => import("./Component/Host/HostPage"));

function App() {
  const [loading, setLoading] = useState(true);
  const { isError, isFetching, isLoading, data } = useGetAllBannerQuery();
  console.log("data Cover Images", data);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    if (data) {
      setBannerData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
  }, [data]);
  return (
    <>
      {" "}
      <Suspense fallback={<Loading isLoading={loading} />}>
        <Routes>
          <Route path="/" element={<Parent />}>
            <Route
              index
              element={
                <Home
                  homebg={bannerData[0]?.home}
                  toggle={bannerData[0]?.toggle}
                  homeVideo={bannerData[0]?.homeVideo}
                  aboutSection={bannerData[0]?.aboutSection}
                />
              }
            />
            <Route
              path="/all_Packages"
              element={<AllPackages allpkgbg={bannerData[0]?.allPakeges} />}
            />
            <Route path="/email-verification" element={<Emailvarification />} />
            <Route
              path="/two-step-verification"
              element={<TwoStepVerification />}
            />
            <Route path="/two-step-code" element={<TwoStepCode />} />

            <Route
              path="/CategorieDetails/:id"
              element={<CategorieDetails />}
            />
            <Route
              path="/UpCommingDetails/:id"
              element={<UpcommingDetails />}
            />
            <Route path="/hosts/:id" element={<HostPage />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/blogs"
              element={<Blogs blogbg={bannerData[0]?.blog} />}
            />
            <Route path="blogs/Details/:id" element={<BlogDetail />} />
            <Route
              path="/about_us"
              element={<AboutUs aboutbg={bannerData[0]?.aboutUs} />}
            />
            <Route
              path="/contact_us"
              element={<ContactUs contactbg={bannerData[0]?.contactUS} />}
            />
            <Route path="/careers" element={<Careers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="/payment" element={<Payment />} />
            <Route path="/booking_overview" element={<BookingOverview />} />
            <Route path="/paymentsuccess" element={<Paymentsuccess />} />
            <Route path="/paymentfail" element={<Paymentfail />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
