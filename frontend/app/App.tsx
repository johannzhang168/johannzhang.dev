import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import NotFound from "./pages/Empty";
// import Login from "./Login";
// import Register from "./Register";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
    
  );
};

export default App;
