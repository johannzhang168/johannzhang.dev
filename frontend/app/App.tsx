import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateNewsletter from "./pages/CreateNewsletter";
import { UserProvider } from "./context/UserContext";
import NotFound from "./pages/Empty";
import { Toaster } from "react-hot-toast";
import NewsletterPage from "./pages/NewsletterPage";
import EditNewsletter from "./pages/EditNewsletter";
import Blog from "./pages/Blog";

const pageVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

const pageTransition = {
  duration: 0.5,
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/create"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <CreateNewsletter />
            </motion.div>
          }
        />
        <Route
          path="/blog/:newsletterId"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <NewsletterPage />
            </motion.div>
          }
        />
        <Route
          path="/blog/edit/:newsletterId"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <EditNewsletter />
            </motion.div>
          }
        />
        <Route
          path="/blog"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Blog />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </UserProvider>
    </Router>
  );
};

export default App;
