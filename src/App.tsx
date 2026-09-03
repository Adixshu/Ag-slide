import { useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { CanvasToolbar } from './components/CanvasToolbar';
import { PresentationCanvas } from './components/PresentationCanvas';
import { AgentInspector } from './components/AgentInspector';
import { PresentModal } from './components/PresentModal';
import { registerWebMcpToolsWithBrowser } from './webmcp/registry';

export function App() {
  useEffect(() => {
    // Initialize WebMCP browser tool registration if window.webMcp is available
    registerWebMcpToolsWithBrowser();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F7F7F8] overflow-hidden text-[#18181B] font-sans antialiased">
      {/* 1. Top Bar Navigation */}
      <TopBar />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Slide Navigation Thumbnails */}
        <LeftSidebar />

        {/* Center: Presentation Editor Canvas */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto bg-[#F7F7F8] relative">
          <CanvasToolbar />
          <PresentationCanvas />
        </main>

        {/* Right Sidebar: WebMCP Agent Inspector */}
        <AgentInspector />
      </div>

      {/* 3. Fullscreen Presenter Mode Modal */}
      <PresentModal />
    </div>
  );
}

export default App;
