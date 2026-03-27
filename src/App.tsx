import { useRef } from 'react';
import Webcam from 'react-webcam';
import { Header } from './components/Header';
import { CameraFeed } from './components/CameraFeed';
import { StatusPanel } from './components/StatusPanel';
import { LogTable } from './components/LogTable';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ModeSelector } from './components/ModeSelector';
import { SessionInfo } from './components/SessionInfo';
import { useDriverAI } from './hooks/useDriverAI';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    driverState,
    logs,
    isInitialized,
    clearLogs,
    isMonitoring,
    toggleMonitoring,
    driverMode,
    setDriverMode,
    sessionStartTime,
    alertCount
  } = useDriverAI(webcamRef, canvasRef);

  return (
    <div className="min-h-screen bg-background text-primary">

      {/* Header */}
      <Header isMonitoring={isMonitoring} onToggleMonitoring={toggleMonitoring} />

      <main className="container mx-auto px-4 pt-24 pb-10">

        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <ModeSelector currentMode={driverMode} onModeChange={setDriverMode} />
          <SessionInfo startTime={sessionStartTime} alertCount={alertCount} />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Camera */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              webcamRef={webcamRef}
              canvasRef={canvasRef}
              driverState={driverState}
              isInitialized={isInitialized}
            />

            {/* Status + Privacy in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusPanel
                status={driverState.status}
                isMonitoring={isMonitoring}
              />
              <PrivacyPolicy />
            </div>
          </div>

          {/* RIGHT: Logs Panel */}
          <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-xl p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Activity Logs</h2>

            <div className="flex-1 overflow-y-auto">
              <LogTable logs={logs} onClearLogs={clearLogs} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;