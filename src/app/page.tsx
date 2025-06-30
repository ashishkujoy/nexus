import { getServerSession } from "next-auth";
import { fetchBatchesAssigned } from "./action";
import BatchSection from "./BatchSection";
import AppHeader from "./components/AppHeader";
import { authOptions, User } from "./lib/auth";


const MainContent = async (props: { user: User }) => {
  console.log(props.user)
  const batchs = await fetchBatchesAssigned(props.user.id, props.user.isRoot);

  return (
    <main className="content">
      <BatchSection batchs={batchs} allowBatchCreation={props.user.isRoot}/>
    </main>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return <></>;

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="main-content">
          <AppHeader />
          <MainContent user={user} />
        </div>
      </div>
    </div>
  );
}
