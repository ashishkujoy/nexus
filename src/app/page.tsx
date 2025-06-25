
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="main-container">
      <Sidebar currentUser={{ name: "Martha", email: "martha@gmail.com" }} />
    </div>
  );
}
