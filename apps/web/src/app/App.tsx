import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./Layout";
import { HomePage } from "@/routes/home/index";
import { MissionsPage } from "@/routes/missions/index";
import { MissionDetailPage } from "@/routes/missions/detail";
import { SchedulePage } from "@/routes/schedule/index";
import { UpdatesPage } from "@/routes/updates/index";
import { MediaPage } from "@/routes/media/index";
import { ActivePage } from "@/routes/active/index";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/missions/:id" element={<MissionDetailPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/active" element={<ActivePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
