import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Factory, 
  Cpu, 
  Settings, 
  Users, 
  FileBox, 
  ActivitySquare
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '工作台 (Dashboard)', icon: LayoutDashboard },
    { id: 'topology', label: '区域拓扑 (Regions)', icon: Network },
    { id: 'lines', label: '产线管理 (Lines)', icon: Factory },
    { id: 'devices', label: '设备接入 (Devices)', icon: Cpu },
    { id: 'process', label: '工艺与产品 (Processes)', icon: FileBox },
    { id: 'employees', label: '员工管理 (Employees)', icon: Users },
    { id: 'alarms', label: '报警中心 (Alarms)', icon: ActivitySquare },
    { id: 'settings', label: '系统设置 (Settings)', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col text-slate-900 transition-all duration-300 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 font-semibold space-x-3 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <ActivitySquare className="w-5 h-5 text-white" />
        </div>
        <span className="truncate tracking-tight text-slate-800">智能物联网平台</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          核心业务
        </div>
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                currentView === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="bg-slate-50 rounded-lg p-3 text-[10px] text-slate-500">
          <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
            <span>平台状态</span>
            <span className="flex items-center text-emerald-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
              运行中
            </span>
          </div>
          <div className="truncate font-mono tracking-tighter mt-2">v2.0.1 (MQTT Connected)</div>
        </div>
      </div>
    </div>
  );
}
