
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="main-container">
      <div className="page-container">
        <Sidebar currentUser={{ name: "Martha", email: "martha@gmail.com" }} />
        <div className="main-content">
          <Header />
        </div>
      </div>
    </div>
  );
}
