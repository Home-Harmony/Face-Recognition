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
    <div className="min-h-screen pb-12 bg-background text-primary selection:bg-accent/30">
      <Header isMonitoring={isMonitoring} onToggleMonitoring={toggleMonitoring} />

      <main className="container pt-24">
        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <ModeSelector currentMode={driverMode} onModeChange={setDriverMode} />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />
          <SessionInfo startTime={sessionStartTime} alertCount={alertCount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] h-auto">
          {/* Left Column: Camera & Status */}
          <div className="flex flex-col gap-6">
            <CameraFeed
              webcamRef={webcamRef}
              canvasRef={canvasRef}
              driverState={driverState}
              isInitialized={isInitialized}
            />
            <StatusPanel status={driverState.status} isMonitoring={isMonitoring} />
            <PrivacyPolicy />
          </div>

          {/* Right Column: Logs */}
          <div className="h-full overflow-hidden">
            <LogTable logs={logs} onClearLogs={clearLogs} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
