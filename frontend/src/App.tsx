import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Chat } from "./pages/Chat";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { KnowledgeBaseGraph } from "./pages/KnowledgeBaseGraph";
import { SourceDetail } from "./pages/SourceDetail";
import { Settings } from "./pages/Settings";
import { Sources } from "./pages/Sources";

function Layout() {
  return (
    <div className="h-screen w-full text-text-primary font-sans overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          <TopBar />
          <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-surface backdrop-blur-xl">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/chat/new", element: <Chat /> },
      { path: "/chat/:id", element: <Chat /> },
      { path: "/knowledge-base", element: <KnowledgeBase /> },
      { path: "/knowledge-base/graph", element: <KnowledgeBaseGraph /> },
      { path: "/source/:id", element: <SourceDetail /> },
      { path: "/settings", element: <Settings /> },
      { path: "/sources", element: <Sources /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
