import { useEffect, useState } from "react";
import { Navigate, Outlet, Routes, Route } from "react-router";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Auth from "./pages/Auth/Auth";
import Navbar from "./components/Navbar/Navbar";
import Account from "./pages/Account/Account";
import Members from "./pages/Members/Members";
import Schedule from "./pages/Schedule/Schedule";
import Notifications from "./pages/Notifications/Notifications";
import NotFound from "./pages/NotFound/NotFound";

import "./App.css";

function MainComponent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Members />} />
        <Route path="/account" element={<Account />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(true);
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? <Auth /> : <MainComponent />}
    </div>
  );
}

export default App;
