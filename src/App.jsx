import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import ErrorBoundary from "./SmallComponents/ErrorBoundary";
import ForgetPassword from "./Modals/ForgetPassword";
import ResetPassword from "./Modals/ResetPassword";
import AllPackages from "./Pages/AllPackagesV3";
import Parent from "./Pages/Parent";
import Payment from "./Pages/Payment";
import BookingOverview from "./Payment/BookingOverview";
import Paymentfail from "./Payment/PaymentFail";
import Paymentsuccess from "./Payment/Paymentsuccess";
import { useGetAllBannerQuery } from "./services";
import { useGetTripsQuery } from "./services/TripApis";
import CompleteProfile from "./Pages/CompleteProfile";
import GoogleAuthSuccess from "./Pages/GoogleAuthSuccess";
import Emailvarification from "./SmallComponents/Emailvarification";
import Loading from "./SmallComponents/Loading";
import TwoStepCode from "./SmallComponents/TwoSteoCode";
import { TwoStepVerification } from "./SmallComponents/TwoStepVerification";

const Home = React.lazy(() => import("./Pages/HomeV3"));
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
const NotFound = React.lazy(() => import("./Pages/NotFound"));

// Resolves a legacy /UpCommingDetails/:id URL to the new /trips/:slug path.
// Looks up the trip by MongoDB _id, then redirects to its seoSlug.
// Falls back to the ID itself if the trip has no slug yet.
function TripIdToSlugRedirect() {
  const { id } = useParams();
  const { data } = useGetTripsQuery();
  const trips = data?.data;

  if (!trips) return <Loading isLoading />;

  const trip = trips.find((t) => t._id === id);
  const slug = trip?.seoSlug || id;
  return <Navigate to={`/trips/${slug}`} replace />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const { isError, isFetching, isLoading, data } = useGetAllBannerQuery();
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    if (data) {
      setBannerData(data?.data);
    }
  }, [data]);

  return (
    <ErrorBoundary>
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

            {/* ── SEO-friendly routes (canonical) ── */}
            <Route
              path="/all-packages"
              element={<AllPackages allpkgbg={bannerData[0]?.allPakeges} />}
            />
            <Route
              path="/about-us"
              element={<AboutUs aboutbg={bannerData[0]?.aboutUs} />}
            />
            <Route
              path="/contact-us"
              element={<ContactUs contactbg={bannerData[0]?.contactUS} />}
            />
            <Route path="/trips/:slug" element={<UpcommingDetails />} />
            <Route path="/category/:slug" element={<CategorieDetails />} />

            {/* ── 301-equivalent redirects for old URLs (backward compatibility) ── */}
            <Route path="/all_Packages" element={<Navigate to="/all-packages" replace />} />
            <Route path="/about_us" element={<Navigate to="/about-us" replace />} />
            <Route path="/contact_us" element={<Navigate to="/contact-us" replace />} />
            <Route path="/CategorieDetails/:id" element={<Navigate to="/category/:id" replace />} />
            <Route path="/UpCommingDetails/:id" element={<TripIdToSlugRedirect />} />

            <Route path="/hosts/:id" element={<HostPage />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
            <Route path="/email-verification" element={<Emailvarification />} />
            <Route path="/two-step-verification" element={<TwoStepVerification />} />
            <Route path="/two-step-code" element={<TwoStepCode />} />
            <Route
              path="/blogs"
              element={<Blogs blogbg={bannerData[0]?.blog} />}
            />
            <Route path="blogs/Details/:id" element={<BlogDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/booking_overview" element={<BookingOverview />} />
            <Route path="/paymentsuccess" element={<Paymentsuccess />} />
            <Route path="/paymentfail" element={<Paymentfail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
