import React from 'react';
import { Network, Server, Factory, Activity, AlertTriangle, ShieldCheck, Users, FileBox } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function DashboardView() {
  const stats = [
    { label: '总员工数', value: '3,842', desc: '98% 已绑定资质', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: '在线产线', value: '32', desc: '运行时长 98.4%', icon: Factory, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '设备总数', value: '1,248', desc: '91% 处于运作中', icon: Server, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '工艺标准 (SOP)', value: '156', desc: '近七日更新 12 项', icon: FileBox, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const deviceProportion = [
    { name: '无铅焊台', value: 400 },
    { name: '拆焊返修台', value: 150 },
    { name: '烟雾净化', value: 300 },
    { name: '离子风机', value: 200 },
    { name: '测温仪', value: 100 },
    { name: '静电腕带', value: 98 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];

  const dailyTrend = [
    { time: '08:00', total: 1100, active: 1050 },
    { time: '10:00', total: 1200, active: 1180 },
    { time: '12:00', total: 1248, active: 1210 },
    { time: '14:00', total: 1248, active: 1235 },
    { time: '16:00', total: 1248, active: 1190 },
    { time: '18:00', total: 1150, active: 800 },
  ];

  const realTimeCurve = [
    { time: '14:00', temp: 348 }, { time: '14:01', temp: 350 }, { time: '14:02', temp: 351 },
    { time: '14:03', temp: 349 }, { time: '14:04', temp: 352 }, { time: '14:05', temp: 350 },
    { time: '14:06', temp: 348 }, { time: '14:07', temp: 347 }, { time: '14:08', temp: 349 },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 overflow-hidden max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设备占比 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
             <h3 className="text-sm font-bold text-slate-700">设备类型占比</h3>
           </div>
           <div className="p-5 flex-1 flex flex-col items-center justify-center">
             <div className="w-full h-[180px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={deviceProportion} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                     {deviceProportion.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                     ))}
                   </Pie>
                   <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }} itemStyle={{ color: '#334155' }} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 w-full grid grid-cols-2 gap-x-4 gap-y-2">
               {deviceProportion.map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }}></span>
                    <span className="text-slate-500 truncate">{entry.name}</span>
                    <span className="font-bold text-slate-700 ml-auto">{entry.value}</span>
                  </div>
               ))}
             </div>
           </div>
        </div>

        {/* 设备每日在线趋势 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
             <h3 className="text-sm font-bold text-slate-700">产线时长与设备在线趋势</h3>
             <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 text-slate-500 rounded cursor-pointer hover:bg-slate-50 transition-colors">今日</span>
           </div>
           <div className="p-5 flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Bar dataKey="total" name="设备总量" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={16} />
                  <Bar dataKey="active" name="活跃在线" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 区域拓扑快照模型 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <h3 className="text-sm font-bold text-slate-700">产线与工位实时监控</h3>
            <button className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md shadow-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">查看拓扑图</button>
          </div>
          
          <div className="p-5 space-y-4 flex-1">
            {/* Mock Line 1 */}
            <div className="border border-slate-100 rounded-lg p-4 bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">SMT-主板组装线 A区</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 uppercase rounded">当前工艺：无铅回流焊 V2.1</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">工位 1</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">正常</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">无铅焊台</span>
                </div>
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">工位 2</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">正常</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">拆焊返修台</span>
                </div>
                <div className="border border-rose-100 bg-rose-50/20 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-rose-500">工位 3</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-100 text-rose-700 font-bold uppercase">滤网报警</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-600">烟雾净化</span>
                </div>
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">工位 4</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">正常</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">静电腕带</span>
                </div>
              </div>
            </div>
            
             {/* Mock Line 2 with Realtime Curve */}
            <div className="border border-slate-100 rounded-lg p-4 bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">DIP-插件线 B区</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 uppercase rounded">当前产品：SKU-9901</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                 <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-3 flex flex-col justify-between col-span-2 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">工位 5 - 测温检测</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">240°C · 在线合规</span>
                  </div>
                  
                  {/* 实时运行曲线插入处 */}
                  <div className="h-16 w-full mt-2 -ml-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={realTimeCurve}>
                          <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                          <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">工位 6</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">正常</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">离子风机</span>
                </div>
                <div className="border border-slate-100 bg-slate-50 rounded-lg p-3 flex flex-col justify-center items-center border-dashed">
                  <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 mb-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">工位 7 (未分配)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 系统合规与MES同步 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700">系统集成状态</h3>
          </div>
          <div className="p-5 space-y-6 flex-1">
             <div className="flex items-start space-x-3">
               <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-700">MES 系统对接</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">已建立 HTTPS / MQTT 桥接，生产数据和工艺参数可实时双向下发与回传。</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter">SYNC: Last 2 sec</span>
                  </div>
               </div>
             </div>

             <div className="flex items-start space-x-3">
               <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4 text-blue-600" />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-700">工艺下发模型</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">参数模型由工艺/产品统一定义，扫码自动绑定，拒绝非标操作。</p>
                  <button className="px-3 py-1.5 mt-3 text-xs bg-white border border-slate-200 rounded-md shadow-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">验证规则</button>
               </div>
             </div>
             
             <div className="mt-8 pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                  Generate Shift Report
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
