import React, { useState } from 'react';
import { 
  Server, Cpu, Wifi, Search, Filter, Play, Square, 
  Settings, Power, RefreshCw, Zap, TableProperties, 
  Activity, X, Check, ArrowRight, Trash2, Plus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';

const CATEGORIES: Record<string, string> = {
  'SOLDERING_STATION': '无铅焊台',
  'REWORK_STATION': '拆焊返修台',
  'FUME_EXTRACTOR': '烟雾净化',
  'ION_FAN': '离子风机',
  'THERMOMETER': '测温仪',
  'ANTI_STATIC_WRIST': '静电腕带'
};

const INITIAL_DISCOVERED = [
  { mac: '00:1B:44:11:3A:B7', ip: '192.168.1.102', type: 'SOLDERING_STATION', rssi: '-45dBm' },
  { mac: '00:1B:44:11:3A:C1', ip: '192.168.1.105', type: 'ION_FAN', rssi: '-60dBm' },
];

const INITIAL_DEVICES = [
  { id: 'D-001', sn: 'SN-S-9001', name: 'A区回流焊台主设备', category: 'SOLDERING_STATION', ws: 'STN-021', mqtt: true, status: 'ONLINE', temp: 350 },
  { id: 'D-002', sn: 'SN-F-2200', name: 'A区主烟雾净化', category: 'FUME_EXTRACTOR', ws: 'STN-021', mqtt: true, status: 'ONLINE', filter: '85%' },
  { id: 'D-003', sn: 'SN-T-5510', name: '高精度测温仪', category: 'THERMOMETER', ws: 'STN-022', mqtt: false, status: 'OFFLINE', temp: null },
  { id: 'D-004', sn: 'SN-I-8800', name: '悬挂式离子风机', category: 'ION_FAN', ws: '未分配', mqtt: true, status: 'ALARM', balance: '+15V' },
];

const MOCK_CURVE_DATA = [
  { time: '14:00', value: 348 }, { time: '14:01', value: 350 }, 
  { time: '14:02', value: 351 }, { time: '14:03', value: 349 }, 
  { time: '14:04', value: 352 }, { time: '14:05', value: 350 }, 
];

export function DevicesView() {
  const [activeTab, setActiveTab] = useState<'managed' | 'discovery'>('managed');
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'remote' | 'data'>('info');

  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [discovered, setDiscovered] = useState(INITIAL_DISCOVERED);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeviceParams, setNewDeviceParams] = useState<any>({ name: '', sn: '', category: 'SOLDERING_STATION' });

  const deleteDevice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('确定要删除此设备吗？')) {
      setDevices(prev => prev.filter(d => d.id !== id));
      if(selectedDevice?.id === id) {
        setSelectedDevice(null);
      }
    }
  };

  const handleAddDevice = () => {
    if(!newDeviceParams.name || !newDeviceParams.sn) return;
    const newD = {
      id: `D-${Date.now()}`,
      sn: newDeviceParams.sn,
      name: newDeviceParams.name,
      category: newDeviceParams.category,
      ws: '未分配',
      mqtt: false,
      status: 'OFFLINE'
    };
    setDevices([newD, ...devices]);
    setIsAddModalOpen(false);
    setNewDeviceParams({ name: '', sn: '', category: 'SOLDERING_STATION' });
  };

  const activateDiscovered = (mac: string) => {
    const dev = discovered.find(d => d.mac === mac);
    if (!dev) return;
    const newD = {
      id: `D-${Date.now()}`,
      sn: `AUTO-${mac.slice(-5).replace(':', '')}`,
      name: `新网域设备 (${dev.ip})`,
      category: dev.type,
      ws: '未分配',
      mqtt: true,
      status: 'ONLINE'
    };
    setDevices([newD, ...devices]);
    setDiscovered(prev => prev.filter(d => d.mac !== mac));
  };

  const activateAllDiscovered = () => {
    const newDs = discovered.map((dev, i) => ({
      id: `D-${Date.now()}-${i}`,
      sn: `AUTO-${dev.mac.slice(-5).replace(':', '')}`,
      name: `新网域设备 (${dev.ip})`,
      category: dev.type,
      ws: '未分配',
      mqtt: true,
      status: 'ONLINE'
    }));
    setDevices([...newDs, ...devices]);
    setDiscovered([]);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">智能物联网平台</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">MQTT Broker Connected · {devices.length} Online</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <button
            onClick={() => setActiveTab('managed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'managed' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-4 h-4" />管控列表
          </button>
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'discovery' 
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Wifi className="w-4 h-4" />发现与接入 {discovered.length > 0 && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px]">{discovered.length}</span>}
          </button>
          </div>
          {activeTab === 'managed' && (
             <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors">
               <Plus className="w-4 h-4" /> 手工登记设备
             </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex gap-6">
        
        {/* ===================== TAB: 管控列表 ===================== */}
        {activeTab === 'managed' && (
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-2 duration-300">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="搜索设备 S/N 或名称..." className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                 </div>
                 <select className="border border-slate-200 rounded-md text-xs px-3 py-1.5 outline-none text-slate-600 bg-white">
                   <option>所有设备类别</option>
                   {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                 </select>
               </div>
               <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 text-slate-700">
                 <Filter className="w-3.5 h-3.5" /> 高级筛选
               </button>
             </div>
             
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                   <tr>
                     <th className="p-4 py-3">设备序列号 (S/N)</th>
                     <th className="p-4 py-3">自定义名称</th>
                     <th className="p-4 py-3">类别</th>
                     <th className="p-4 py-3">绑定工位</th>
                     <th className="p-4 py-3">MQTT 状态</th>
                     <th className="p-4 py-3">运行状态</th>
                     <th className="p-4 py-3 text-right">操作</th>
                   </tr>
                 </thead>
                 <tbody>
                   {devices.map(device => (
                     <tr key={device.id} className={`border-b border-slate-100 transition-colors cursor-pointer ${selectedDevice?.id === device.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                       <td className="p-4 font-mono text-xs font-bold text-slate-700">{device.sn}</td>
                       <td className="p-4 text-xs font-semibold text-blue-600">{device.name}</td>
                       <td className="p-4 text-xs text-slate-600">{CATEGORIES[device.category]}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 text-[10px] font-bold rounded ${device.ws !== '未分配' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                           {device.ws}
                         </span>
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-1.5">
                           <div className={`w-6 h-4 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${device.mqtt ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                              <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                           </div>
                           <span className="text-[10px] text-slate-500 font-mono uppercase">{device.mqtt ? 'Enabled' : 'Disabled'}</span>
                         </div>
                       </td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                           device.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' :
                           device.status === 'ALARM' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                         }`}>
                           {device.status}
                         </span>
                       </td>
                       <td className="p-4 text-right flex items-center gap-2 justify-end">
                         <button 
                           onClick={() => { setSelectedDevice(device); setDetailTab('info'); }}
                           className="text-[10px] font-bold text-blue-600 hover:underline"
                         >详细管控</button>
                         <button 
                           onClick={(e) => deleteDevice(device.id, e)}
                           className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {devices.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">暂无管控设备</td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* ===================== TAB: 发现与接入 ===================== */}
        {activeTab === 'discovery' && (
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right-2 duration-300">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">局域网设备扫描</h3>
                  <p className="text-xs text-slate-500 mt-1">自动发现支持 MQTT 自动配网的未激活设备，支持批量启用接入。</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> 重新扫描
                  </button>
                  <button onClick={activateAllDiscovered} disabled={discovered.length === 0} className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-md hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Check className="w-4 h-4" /> 批量一键接入
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               {discovered.map((dev, idx) => (
                 <div key={idx} className="border border-emerald-200 bg-emerald-50/20 rounded-xl p-5 shadow-sm hover:border-emerald-400 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                          <Server className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{CATEGORIES[dev.type]} 设备</h4>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">New Device Detected</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{dev.rssi}</span>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">MAC 地址</span>
                        <span className="font-mono font-bold text-slate-700">{dev.mac}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">IP 分配</span>
                        <span className="font-mono font-bold text-slate-700">{dev.ip}</span>
                      </div>
                    </div>
                    <button onClick={() => activateDiscovered(dev.mac)} className="w-full py-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-xs rounded hover:bg-emerald-50 transition-colors flex justify-center items-center gap-1">
                      启用并配置 MQTT <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                 </div>
               ))}
               {discovered.length === 0 && (
                   <div className="col-span-full text-center py-12 text-slate-400 text-sm">暂无新发现的局域网设备</div>
               )}
             </div>
          </div>
        )}

        {/* ===================== 右侧滑出面板：设备详情 ===================== */}
        {selectedDevice && activeTab === 'managed' && (
          <div className="w-[450px] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-300">
             <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-base font-bold text-slate-800">{selectedDevice.name}</h3>
                   <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${selectedDevice.status === 'ALARM' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                     {selectedDevice.status}
                   </span>
                 </div>
                 <p className="font-mono text-xs text-slate-500">{selectedDevice.sn} | {CATEGORIES[selectedDevice.category]}</p>
               </div>
               <button onClick={() => setSelectedDevice(null)} className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="flex border-b border-slate-100 bg-slate-50/50">
               <button onClick={() => setDetailTab('info')} className={`flex-1 py-2 text-xs font-bold transition-colors ${detailTab === 'info' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>基础与实时数据</button>
               <button onClick={() => setDetailTab('remote')} className={`flex-1 py-2 text-xs font-bold transition-colors ${detailTab === 'remote' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>远程控制与下发</button>
               <button onClick={() => setDetailTab('data')} className={`flex-1 py-2 text-xs font-bold transition-colors ${detailTab === 'data' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>工艺评估与记录</button>
             </div>

             <div className="flex-1 overflow-y-auto p-5">
               
               {/* 详情子卡片：基础与数据 */}
               {detailTab === 'info' && (
                 <div className="space-y-6 animate-in fade-in">
                   <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">实时度量曲线</h4>
                     <div className="h-40 w-full bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MOCK_CURVE_DATA} margin={{top: 5, right: 5, left: -25, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={5} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                            <Line type="monotone" dataKey="value" stroke={selectedDevice.status === 'ALARM' ? '#e11d48' : '#3b82f6'} strokeWidth={2} dot={false} isAnimationActive={false} />
                          </LineChart>
                        </ResponsiveContainer>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">运行数据明细 (JSON Payload)</h4>
                     <div className="bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto">
<pre>{`{
  "timestamp": "2023-10-27T14:05:12Z",
  "device_id": "${selectedDevice.sn}",
  "telemetry": {
    "temperature": ${selectedDevice.temp || 0},
    "power_w": 120,
    "uptime_s": 34021
  },
  "status": "${selectedDevice.status}"
}`}</pre>
                     </div>
                   </div>
                 </div>
               )}

               {/* 详情子卡片：远程控制 */}
               {detailTab === 'remote' && (
                 <div className="space-y-6 animate-in fade-in">
                   <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                     <h4 className="text-xs font-bold text-rose-800 flex items-center gap-2 mb-2"><Power className="w-4 h-4"/> 强电控制指令</h4>
                     <p className="text-[10px] text-rose-600 mb-4">警告：远程上下电可能影响正在进行的生产流程。</p>
                     <div className="flex gap-3">
                       <button className="flex-1 bg-white border border-slate-200 py-2 rounded text-xs font-bold text-emerald-600 shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"><Play className="w-3.5 h-3.5 fill-current"/>远程开机</button>
                       <button className="flex-1 bg-rose-600 text-white py-2 rounded text-xs font-bold shadow-sm hover:bg-rose-700 flex items-center justify-center gap-2"><Square className="w-3.5 h-3.5 fill-current"/>强制关机</button>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><Settings className="w-4 h-4 text-blue-500"/> 设备特定参数下发</h4>
                     {selectedDevice.category === 'SOLDERING_STATION' && (
                        <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">目标温度设定 (°C)</label>
                            <input type="number" defaultValue="350" className="w-full border border-slate-200 rounded p-1.5 text-xs focus:border-blue-500 outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">休眠时间 (分钟)</label>
                            <input type="number" defaultValue="15" className="w-full border border-slate-200 rounded p-1.5 text-xs focus:border-blue-500 outline-none" />
                          </div>
                          <button className="w-full py-2 bg-slate-900 text-white rounded text-xs font-bold shadow-sm">通过 MQTT 下发配置</button>
                        </div>
                     )}
                     {selectedDevice.category === 'ION_FAN' && (
                        <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                           <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 rounded text-xs font-bold shadow-sm hover:bg-blue-50 flex justify-center items-center gap-2"><Zap className="w-4 h-4"/>触发自动清洁电极</button>
                           <button className="w-full py-2 bg-slate-900 text-white rounded text-xs font-bold shadow-sm">更新离子平衡校准值</button>
                        </div>
                     )}
                     {!['SOLDERING_STATION', 'ION_FAN'].includes(selectedDevice.category) && (
                        <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg text-center">该类设备暂无特定下发参数</p>
                     )}
                   </div>
                 </div>
               )}

               {/* 详情子卡片：工艺评估 */}
               {detailTab === 'data' && (
                 <div className="space-y-6 animate-in fade-in">
                   <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                     <h4 className="text-xs font-bold text-emerald-800 mb-1">当前匹配工艺</h4>
                     <p className="text-[10px] text-emerald-600">SOP-908-A 无铅回流焊 (合规度: 99.2%)</p>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">历史偏离记录 (Out-of-Spec Logs)</h4>
                     <div className="space-y-2">
                       <div className="p-3 border border-slate-100 rounded-lg bg-white flex justify-between items-center">
                         <div>
                           <p className="text-xs font-bold text-slate-800">温度异常波动</p>
                           <p className="text-[10px] text-slate-500 mt-0.5">2023-10-25 14:20:00</p>
                         </div>
                         <span className="text-[10px] font-mono text-rose-600 font-bold">412°C</span>
                       </div>
                       <div className="p-3 border border-slate-100 rounded-lg bg-white flex justify-between items-center">
                         <div>
                           <p className="text-xs font-bold text-slate-800">设备主动休眠</p>
                           <p className="text-[10px] text-slate-500 mt-0.5">2023-10-24 18:30:00</p>
                         </div>
                         <span className="text-[10px] font-mono text-slate-400 font-bold">0°C</span>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[450px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">手工登记设备</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">设备序列号 (S/N) *</label>
                <input 
                  type="text" 
                  value={newDeviceParams.sn}
                  onChange={e => setNewDeviceParams({...newDeviceParams, sn: e.target.value})}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 font-mono"
                  placeholder="SN-XXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">自定义名称 *</label>
                <input 
                  type="text" 
                  value={newDeviceParams.name}
                  onChange={e => setNewDeviceParams({...newDeviceParams, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="例如: A区主打螺丝机"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">设备类别 *</label>
                <select 
                  value={newDeviceParams.category}
                  onChange={e => setNewDeviceParams({...newDeviceParams, category: e.target.value})}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v} ({k})</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleAddDevice}
                disabled={!newDeviceParams.name || !newDeviceParams.sn}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建设备
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
