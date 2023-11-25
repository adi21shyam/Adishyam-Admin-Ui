import Interface from "../components/Interface";
import "../index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  return (
    <div className="Main">
      <Interface />
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Admin;
