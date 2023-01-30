import './App.css';
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/home/Home';

function App() {
  return (
    <>
    <Navbar />
    <Home />
    </>
  );
}

export default App;
