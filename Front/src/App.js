import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
  } from "react-router-dom";
  import Logo from "./images/logo.jpg";
  import "./App.scss";
  import Header from "./Components/Header.js";
  import QrHeader from "./Components/qrHeader.js";
  import Statistics from "./Components/Statistics";
  import testimg from "./images/qr.png";
  import LoginForm from "./Components/LoginForm";
  import { QueryClient, QueryClientProvider } from "react-query";
  import MainPage from "./Components/mainPage";
  import PrivateRoute from "./privateRoute";
  import QrStatic from "./Components/QrStatic";
  function App() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
        },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainPage />
                  <Outlet />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  }
  
  export default App;