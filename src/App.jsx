import { useEffect, useState } from "react";
import { Routes, Route, data } from "react-router";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Auth from "./pages/Auth/Auth";
import Navbar from "./components/Navbar/Navbar";
import Account from "./pages/Account/Account";
import Members from "./pages/Members/Members";
import Schedule from "./pages/Schedule/Schedule";
import Notifications from "./pages/Notifications/Notifications";
import FAQs from "./pages/FAQs/FAQs";
import NotFound from "./pages/NotFound/NotFound";

import { supabase } from "./supabaseClient";

import "./App.css";

function MainComponent({ session }) {
  return (
    <>
      <Navbar session={session} />
      <Routes>
        <Route path="/" element={<Members session={session} />} />
        <Route path="/account" element={<Account session={session} />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // setSession(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <MainComponent key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;
