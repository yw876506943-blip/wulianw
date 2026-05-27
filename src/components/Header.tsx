import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
}

export function Header({ currentView }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 py-3 shrink-0">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          智能物联网平台
        </h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索设备、工位或工艺..." 
            className="pl-9 pr-4 py-2 w-64 border border-slate-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800">系统管理员</p>
            <p className="text-[10px] text-slate-400">云端中控</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
