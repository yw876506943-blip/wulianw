import React, { useState } from 'react';
import { 
  Factory, Settings, Activity, History, ShieldCheck, 
  MapPin, Cpu, AlertCircle, CheckCircle2, Download, 
  ImageIcon, Thermometer, Calendar, Clock
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, Legend 
} from 'recharts';

const MOCK_LINES = [
  { id: 'L1', name: 'SMT-主板组装线 A区', status: 'RUNNING', manager: '张伟', process: 'SOP-908-A 无铅回流焊' },
  { id: 'L2', name: 'DIP-插件线 B区', status: 'STOPPED', manager: '李静', process: 'SOP-909-B' },
];

const MOCK_WS_LAYOUT = [
  { id: 'WS-021', name: 'STN-021 (回流焊)', x: 15, y: 40, status: 'NORMAL', temp: 350, esd: 0.02 },
  { id: 'WS-022', name: 'STN-022 (检测)', x: 45, y: 55, status: 'ALARM', temp: 412, esd: 0.05 },
  { id: 'WS-023', name: 'STN-023 (返修)', x: 75, y: 40, status: 'OFFLINE', temp: null, esd: null },
];

const MOCK_CURVE_DATA = [
  { time: '14:00', temp: 348, setpoint: 350 }, { time: '14:01', temp: 350, setpoint: 350 }, 
  { time: '14:02', temp: 351, setpoint: 350 }, { time: '14:03', temp: 349, setpoint: 350 }, 
  { time: '14:04', temp: 352, setpoint: 350 }, { time: '14:05', temp: 360, setpoint: 350 }, 
  { time: '14:06', temp: 412, setpoint: 350 }, { time: '14:07', temp: 380, setpoint: 350 },
];

const MOCK_HISTORY = [
  { id: 1, device: '无铅焊台 Pro (SN-S-9001)', ws: 'STN-022', event: '温度超限 (412°C)', time: '2023-10-27 14:06:00', type: 'ALARM' },
  { id: 2, device: '悬挂式离子风机', ws: 'STN-023', event: '设备离线', time: '2023-10-27 13:45:12', type: 'FAULT' },
  { id: 3, device: '测温仪 (SN-T-5510)', ws: 'STN-021', event: '已校准', time: '2023-10-27 08:30:00', type: 'CALIB' },
];

const MOCK_STATS = [
  { month: '8月', online: 450, fault: 12, alarm: 35 },
  { month: '9月', online: 480, fault: 8, alarm: 24 },
  { month: '10月', online: 510, fault: 5, alarm: 15 },
];

export function LinesView() {
  const [activeLine, setActiveLine] = useState(MOCK_LINES[0].id);
  const [activeTab, setActiveTab] = useState<'monitor' | 'config' | 'history' | 'calibration'>('monitor');
  const [selectedWs, setSelectedWs] = useState<string | null>('WS-022');

  const line = MOCK_LINES.find(l => l.id === activeLine);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NORMAL': return 'bg-emerald-500 ring-emerald-200';
      case 'ALARM': return 'bg-rose-500 ring-rose-200 animate-pulse';
      case 'OFFLINE': return 'bg-slate-400 ring-slate-200';
      default: return 'bg-slate-400';
    }
  };

  const handleExport = () => {
    alert("Excel导出功能 (模拟)");
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">选择产线</p>
              <select 
                value={activeLine}
                onChange={e => setActiveLine(e.target.value)}
                className="text-lg font-bold text-slate-800 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none"
              >
                {MOCK_LINES.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="w-px h-8 bg-slate-200"></div>
          
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">状态</p>
              <p className={`font-semibold mt-0.5 flex items-center gap-1.5 ${line?.status === 'RUNNING' ? 'text-emerald-600' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${line?.status === 'RUNNING' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {line?.status === 'RUNNING' ? '运作中' : '已停线'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">当前工艺</p>
              <p className="font-semibold text-slate-700 mt-0.5">{line?.process}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">负责人</p>
              <p className="font-semibold text-slate-700 mt-0.5">{line?.manager}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          {[
            { id: 'monitor', label: '实时监控', icon: Activity },
            { id: 'config', label: '视图配置', icon: Settings },
            { id: 'history', label: '历史与统计', icon: History },
            { id: 'calibration', label: '标准校准', icon: ShieldCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* ===================== TAB: 实时监控 ===================== */}
        {activeTab === 'monitor' && (
          <div className="h-full flex gap-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* 左侧：产线平面图结构 */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-700">产线 2D 工位布局图</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500"></span><span className="text-[10px] font-medium text-slate-500">正常</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-rose-500 animate-pulse"></span><span className="text-[10px] font-medium text-slate-500">报警</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-400"></span><span className="text-[10px] font-medium text-slate-500">离线</span></div>
                 </div>
               </div>
               <div className="flex-1 bg-slate-50 relative overflow-hidden border-b border-transparent group">
                  {/* Mock Background Image Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                     <Factory className="w-64 h-64" />
                  </div>
                  
                  {/* Workstation Dots */}
                  {MOCK_WS_LAYOUT.map(ws => (
                    <div 
                      key={ws.id} 
                      onClick={() => setSelectedWs(ws.id)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-110 ${selectedWs === ws.id ? 'z-10' : 'z-0'}`}
                      style={{ left: `${ws.x}%`, top: `${ws.y}%` }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ${getStatusColor(ws.status)} ${selectedWs === ws.id ? 'ring-offset-2' : ''}`}>
                         {ws.status === 'ALARM' && <AlertCircle className="w-4 h-4" />}
                         {ws.status === 'NORMAL' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className={`px-2 py-1 bg-white rounded shadow-md border ${selectedWs === ws.id ? 'border-blue-400 outline outline-1 outline-blue-400' : 'border-slate-200'} text-center`}>
                        <p className="text-[10px] font-bold text-slate-800 whitespace-nowrap">{ws.name}</p>
                        {ws.temp && <p className={`text-[10px] font-mono mt-0.5 ${ws.status === 'ALARM' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{ws.temp}°C</p>}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 右侧：工位与设备详情 */}
            <div className="w-[400px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
               {selectedWs ? (
                 <>
                  {(() => {
                    const ws = MOCK_WS_LAYOUT.find(w => w.id === selectedWs);
                    return (
                      <>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">{ws?.name}</h3>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">ID: {ws?.id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ws?.status === 'ALARM' ? 'bg-rose-100 text-rose-700' : ws?.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                              {ws?.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                           {/* 实时曲线 */}
                           {ws?.status !== 'OFFLINE' && (
                             <div>
                               <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-blue-500"/> 实时度量曲线</h4>
                               <div className="h-48 w-full">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={MOCK_CURVE_DATA} margin={{top: 5, right: 5, left: -20, bottom: 0}}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                      <Line type="monotone" name="实时温度" dataKey="temp" stroke={ws?.status === 'ALARM' ? '#e11d48' : '#3b82f6'} strokeWidth={2} dot={false} isAnimationActive={false} />
                                      <Line type="step" name="工艺设定值" dataKey="setpoint" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                                    </LineChart>
                                 </ResponsiveContainer>
                               </div>
                             </div>
                           )}

                           {/* 设备列表 */}
                           <div>
                              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><Cpu className="w-4 h-4 text-emerald-500"/> 接入设备状态</h4>
                              <div className="space-y-3">
                                {ws?.status === 'OFFLINE' ? (
                                   <div className="p-4 border border-slate-100 rounded-lg text-center text-xs text-slate-400 bg-slate-50">设备由于断网离线中</div>
                                ) : (
                                   <>
                                    <div className={`p-3 border rounded-lg flex justify-between items-center ${ws?.status === 'ALARM' ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-white shadow-sm'}`}>
                                      <div>
                                        <p className="text-xs font-bold text-slate-800">无铅焊台 Pro</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">SN: 9001 · 运行中</p>
                                      </div>
                                      <div className="text-right">
                                        <p className={`font-mono font-bold ${ws?.status === 'ALARM' ? 'text-rose-600' : 'text-slate-700'}`}>{ws?.temp}°C</p>
                                      </div>
                                    </div>
                                    <div className="p-3 border border-slate-100 bg-white rounded-lg shadow-sm flex justify-between items-center">
                                      <div>
                                        <p className="text-xs font-bold text-slate-800">静电腕带</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">SN: ESD-11 · 在线</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-mono font-bold text-slate-700">{ws?.esd}kV</p>
                                      </div>
                                    </div>
                                   </>
                                )}
                              </div>
                           </div>
                        </div>
                      </>
                    )
                  })()}
                 </>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
                   <MapPin className="w-8 h-8 opacity-20" />
                   <p>点击左侧拓扑图查看工位详情</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* ===================== TAB: 视图配置 ===================== */}
        {activeTab === 'config' && (
          <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-y-auto animate-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">产线参数与视图装配</h3>
                  <p className="text-xs text-slate-500 mt-1">支持拖拽调整工位位置，设置底图和产线管理员。</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-md hover:bg-slate-800">保存配置</button>
             </div>

             <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 space-y-6">
                   <div>
                     <label className="text-xs font-bold text-slate-700 block mb-2">产线名称</label>
                     <input type="text" defaultValue={line?.name} className="w-full border border-slate-200 rounded-md p-2 text-sm text-slate-800 focus:border-blue-500 outline-none" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-700 block mb-2">产线管理员</label>
                     <select className="w-full border border-slate-200 rounded-md p-2 text-sm text-slate-800 bg-white focus:border-blue-500 outline-none">
                       <option>{line?.manager}</option>
                       <option>员工 A</option>
                       <option>员工 B</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center justify-between">
                       底图背景 (URL)
                       <button className="text-[10px] text-blue-600 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> 上传</button>
                     </label>
                     <input type="text" placeholder="https://..." className="w-full border border-slate-200 rounded-md p-2 text-sm text-slate-800 focus:border-blue-500 outline-none" />
                   </div>
                </div>

                <div className="col-span-2">
                   <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500"/> 工位坐标映射 (拖拽调整)</label>
                   <div className="aspect-video bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden border-dashed border-2">
                      {MOCK_WS_LAYOUT.map(ws => (
                        <div 
                          key={ws.id} 
                          className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-[10px] font-bold text-slate-700 cursor-move hover:border-blue-500 hover:text-blue-600 transition-colors`}
                          style={{ left: `${ws.x}%`, top: `${ws.y}%` }}
                        >
                          {ws.name}
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity bg-blue-500 pointer-events-none"></div>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 text-right">如需新增工位，请在 [拓扑管理] 模块将工位绑定至当前区域。</p>
                </div>
             </div>
          </div>
        )}

        {/* ===================== TAB: 历史与统计 ===================== */}
        {activeTab === 'history' && (
          <div className="h-full flex gap-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
               <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> 运行时长统计 (月度)</h3>
               </div>
               <div className="p-5 flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_STATS} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis dataKey="month" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dx={-10} />
                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                      <Bar dataKey="online" name="在线(h)" stackId="a" fill="#10b981" barSize={20} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="alarm" name="报警(h)" stackId="a" fill="#f59e0b" barSize={20} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="fault" name="故障(h)" stackId="a" fill="#e11d48" barSize={20} radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
               <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500"/> 设备日志记录</h3>
                 <div className="flex gap-2">
                   <select className="text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-600">
                     <option>全部事件</option>
                     <option>仅报警/故障</option>
                   </select>
                   <button onClick={handleExport} className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-700 rounded-md font-bold shadow-sm hover:bg-slate-50 flex items-center gap-1.5">
                     <Download className="w-3.5 h-3.5" /> 导出 Excel
                   </button>
                 </div>
               </div>
               <div className="flex-1 overflow-auto p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="p-4 py-3">时间</th>
                        <th className="p-4 py-3">事件类型</th>
                        <th className="p-4 py-3">工位</th>
                        <th className="p-4 py-3">设备</th>
                        <th className="p-4 py-3">描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_HISTORY.map(row => (
                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-500">{row.time}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                              row.type === 'ALARM' ? 'bg-amber-100 text-amber-700' :
                              row.type === 'FAULT' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>{row.type}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-700 text-xs">{row.ws}</td>
                          <td className="p-4 text-slate-600 text-xs">{row.device}</td>
                          <td className="p-4 text-slate-800 font-medium text-xs">{row.event}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: 标准与校准 ===================== */}
        {activeTab === 'calibration' && (
          <div className="h-full bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Thermometer className="w-4 h-4 text-rose-500"/> 温度校准记录追踪</h3>
                  <p className="text-[10px] text-slate-500 mt-1">评估设备实际运行数据与工艺标准 (Process SOP) 的匹配度。</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-md hover:bg-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4"/> 录入人工校验
                </button>
             </div>
             <div className="flex-1 overflow-auto p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="p-4 py-3">设备 (SN)</th>
                        <th className="p-4 py-3">工位</th>
                        <th className="p-4 py-3">工艺设定值</th>
                        <th className="p-4 py-3">上次校准/评估实测值</th>
                        <th className="p-4 py-3">校准时间</th>
                        <th className="p-4 py-3">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 text-xs text-blue-600">无铅焊台 (SN-S-9001)</td>
                        <td className="p-4 text-slate-600 text-xs">STN-021</td>
                        <td className="p-4 font-mono text-xs text-slate-500">350°C (±5°C)</td>
                        <td className="p-4 font-mono text-xs text-emerald-600 font-bold">349.5°C</td>
                        <td className="p-4 text-slate-500 text-xs">2023-10-25 08:30</td>
                        <td className="p-4"><span className="px-2 py-0.5 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded text-[10px] font-bold">已校准 合格</span></td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-amber-50/30">
                        <td className="p-4 font-bold text-slate-700 text-xs text-blue-600">测温仪 (SN-T-5510)</td>
                        <td className="p-4 text-slate-600 text-xs">STN-022</td>
                        <td className="p-4 font-mono text-xs text-slate-500">基准设备</td>
                        <td className="p-4 font-mono text-xs text-amber-600 font-bold">偏离 +1.2°C</td>
                        <td className="p-4 text-slate-500 text-xs">2023-09-10 10:00</td>
                        <td className="p-4"><span className="px-2 py-0.5 border border-amber-200 text-amber-700 bg-amber-50 rounded text-[10px] font-bold">即期复检</span></td>
                      </tr>
                    </tbody>
                  </table>
               </div>
          </div>
        )}
      </div>

    </div>
  );
}
