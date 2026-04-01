import Image from "next/image";
import Login from "./components/login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <>
    <Login />
    <ToastContainer />
    </>
    
  );
}
