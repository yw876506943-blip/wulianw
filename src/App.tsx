import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TopologyView } from './components/TopologyView';
import { LinesView } from './components/LinesView';
import { DevicesView } from './components/DevicesView';
import { ProcessView } from './components/ProcessView';
import { AlarmsView } from './components/AlarmsView';
import { SettingsView } from './components/SettingsView';
import { EmployeesView } from './components/EmployeesView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'topology':
        return <TopologyView />;
      case 'lines':
        return <LinesView />;
      case 'devices':
        return <DevicesView />;
      case 'process':
        return <ProcessView />;
      case 'employees':
        return <EmployeesView />;
      case 'alarms':
        return <AlarmsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-slate-100 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-slate-200">
                <span className="text-slate-400 font-mono text-sm">DEV</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">模块开发中</h2>
              <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto">
                [{currentView}] 视图对应的数据模型（区域/产线/设备/工艺等）已在 types 中约束，UI 层待后续迭代构建。
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
