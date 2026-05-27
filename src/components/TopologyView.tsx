import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FolderClosed, Layers, MapPin, Cpu, Users, Plus, Trash2, Server, ShieldCheck } from 'lucide-react';
import { Region, Workstation, Device, Employee } from '../types';

const INITIAL_REGIONS: Region[] = [
  { id: 'R1', name: '南区制造工厂', parentId: null, level: 1, childRule: 'SUB_REGION' },
  { id: 'R1-1', name: '电子元件 A区', parentId: 'R1', level: 2, childRule: 'WORKSTATION' },
  { id: 'R1-2', name: '总装封测 B区', parentId: 'R1', level: 2, childRule: 'UNASSIGNED' },
  { id: 'R2', name: '北区包装车间', parentId: null, level: 1, childRule: 'WORKSTATION' },
];

const INITIAL_WORKSTATIONS: Workstation[] = [
  { id: 'WS-021', name: 'STN-021 (回流焊)', regionId: 'R1-1', deviceIds: ['D-001', 'D-002'], employeeIds: ['E-001'] },
  { id: 'WS-022', name: 'STN-022 (检测)', regionId: 'R1-1', deviceIds: ['D-003'], employeeIds: [] },
  { id: 'WS-101', name: 'PACK-01 (自动封箱)', regionId: 'R2', deviceIds: [], employeeIds: ['E-002'] },
];

const INITIAL_DEVICES: Device[] = [
  { id: 'D-001', sn: 'SN-S-9001', name: '无铅焊台 Pro', category: 'SOLDERING_STATION', workstationId: 'WS-021', mqttTopicSub: '', mqttTopicPub: '', status: 'ONLINE', lastActive: '2023-10-27 14:05:12' },
  { id: 'D-002', sn: 'SN-F-2200', name: '工业烟雾净化器', category: 'FUME_EXTRACTOR', workstationId: 'WS-021', mqttTopicSub: '', mqttTopicPub: '', status: 'ONLINE', lastActive: '2023-10-27 14:05:12' },
  { id: 'D-003', sn: 'SN-T-5510', name: '高精度测温仪', category: 'THERMOMETER', workstationId: 'WS-022', mqttTopicSub: '', mqttTopicPub: '', status: 'ONLINE', lastActive: '2023-10-27 14:05:12' },
  { id: 'D-004', sn: 'SN-I-8800', name: '悬挂式离子风机', category: 'ION_FAN', workstationId: undefined, mqttTopicSub: '', mqttTopicPub: '', status: 'OFFLINE', lastActive: '' },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'E-001', name: '张伟', badgeNumber: 'EMP-T-001' },
  { id: 'E-002', name: '李静', badgeNumber: 'EMP-T-002' },
  { id: 'E-003', name: '王强', badgeNumber: 'EMP-T-003' },
];

export function TopologyView() {
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [workstations, setWorkstations] = useState<Workstation[]>(INITIAL_WORKSTATIONS);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const [expandedNodes, setExpandedNodes] = useState<string[]>(['R1', 'R1-1', 'R2']);
  const [selectedNode, setSelectedNode] = useState<{ id: string, type: 'region' | 'workstation' }>({ id: 'R1-1', type: 'region' });

  const [modalState, setModalState] = useState<{ type: 'ROOT' | 'SUB' | 'WS' | null, parentId?: string, parentLevel?: number, isOpen: boolean, name: string }>({ type: null, isOpen: false, name: '' });

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const executeAdd = () => {
    const { type, name, parentId, parentLevel } = modalState;
    if (!name.trim()) return;

    if (type === 'ROOT') {
      const newRegion: Region = {
        id: `R${Date.now()}`,
        name,
        parentId: null,
        level: 1,
        childRule: 'UNASSIGNED',
      };
      setRegions([...regions, newRegion]);
      setExpandedNodes([...expandedNodes, newRegion.id]);
      setSelectedNode({ id: newRegion.id, type: 'region' });
    } else if (type === 'SUB' && parentId !== undefined && parentLevel !== undefined) {
      const newRegion: Region = {
        id: `R${Date.now()}`,
        name,
        parentId,
        level: parentLevel + 1,
        childRule: 'UNASSIGNED',
      };
      setRegions([...regions, newRegion]);
      if (!expandedNodes.includes(parentId)) {
        setExpandedNodes([...expandedNodes, parentId]);
      }
    } else if (type === 'WS' && parentId !== undefined) {
      const newWs: Workstation = {
        id: `WS-${Date.now()}`,
        name,
        regionId: parentId,
        deviceIds: [],
        employeeIds: []
      };
      setWorkstations([...workstations, newWs]);
      if (!expandedNodes.includes(parentId)) {
        setExpandedNodes([...expandedNodes, parentId]);
      }
    }
    setModalState({ type: null, isOpen: false, name: '' });
  };

  const deleteRegion = (id: string) => {
    const hasChildren = regions.some(r => r.parentId === id) || workstations.some(w => w.regionId === id);
    if (hasChildren) {
      alert('无法删除：该区域下存在子区域或工位数据！');
      return;
    }
    setRegions(prev => prev.filter(r => r.id !== id));
    if (selectedNode.id === id) {
      const rootReg = regions.find(r => r.parentId === null);
      if(rootReg) {
         setSelectedNode({ id: rootReg.id, type: 'region' });
      } else {
         setSelectedNode({ id: '', type: 'region' });
      }
    }
  };
  
  const deleteWorkstation = (id: string) => {
    const ws = workstations.find(w => w.id === id);
    if(ws && (ws.deviceIds.length > 0 || ws.employeeIds.length > 0)) {
      alert('无法删除：该工位下已绑定设备或员工！');
      return;
    }
    if(confirm('确定要删除该工位吗？')) {
      setWorkstations(prev => prev.filter(w => w.id !== id));
      if (selectedNode.id === id) {
        if(ws) setSelectedNode({ id: ws.regionId, type: 'region' });
      }
    }
  };

  const bindDeviceToWorkstation = (wsId: string, deviceId: string) => {
    setWorkstations(prev => prev.map(ws => ws.id === wsId ? { ...ws, deviceIds: [...ws.deviceIds, deviceId] } : ws));
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, workstationId: wsId } : d));
  };

  const unbindDevice = (wsId: string, deviceId: string) => {
    setWorkstations(prev => prev.map(ws => ws.id === wsId ? { ...ws, deviceIds: ws.deviceIds.filter(id => id !== deviceId) } : ws));
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, workstationId: undefined } : d));
  };

  const bindEmployeeToWorkstation = (wsId: string, employeeId: string) => {
    if (!workstations.find(ws => ws.id === wsId)?.employeeIds.includes(employeeId)) {
      setWorkstations(prev => prev.map(ws => ws.id === wsId ? { ...ws, employeeIds: [...ws.employeeIds, employeeId] } : ws));
    }
  };

  const unbindEmployee = (wsId: string, employeeId: string) => {
    setWorkstations(prev => prev.map(ws => ws.id === wsId ? { ...ws, employeeIds: ws.employeeIds.filter(id => id !== employeeId) } : ws));
  };

  const renderTree = (parentId: string | null) => {
    const nodes = regions.filter(r => r.parentId === parentId);
    if (nodes.length === 0) return null;

    return (
      <div className="space-y-1 mt-1">
        {nodes.map(region => {
          const isExpanded = expandedNodes.includes(region.id);
          const isSelected = selectedNode.id === region.id && selectedNode.type === 'region';
          const childrenRegions = regions.filter(r => r.parentId === region.id);
          const childrenWs = workstations.filter(w => w.regionId === region.id);
          const hasChildren = childrenRegions.length > 0 || childrenWs.length > 0;

          return (
            <div key={region.id} className="ml-3">
              <div
                onClick={() => setSelectedNode({ id: region.id, type: 'region' })}
                className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleExpand(region.id); }} 
                  className={`p-0.5 mr-1 rounded-sm hover:bg-slate-200 text-slate-500 ${!hasChildren && 'opacity-0 cursor-default'}`}
                  disabled={!hasChildren}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                <FolderClosed className={`w-4 h-4 mr-2 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{region.name}</span>
              </div>
              
              {isExpanded && (
                <div className="border-l border-slate-200 ml-3.5 pl-2">
                  {region.childRule === 'SUB_REGION' && renderTree(region.id)}
                  
                  {region.childRule === 'WORKSTATION' && childrenWs.map(ws => {
                    const isWsSelected = selectedNode.id === ws.id && selectedNode.type === 'workstation';
                    return (
                      <div
                        key={ws.id}
                        onClick={() => setSelectedNode({ id: ws.id, type: 'workstation' })}
                        className={`flex items-center py-1.5 px-2 mt-1 rounded-md cursor-pointer transition-colors ${isWsSelected ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                         <span className="w-4 h-4 mr-2.5"></span> {/* Alignment spacer */}
                         <MapPin className={`w-3.5 h-3.5 mr-2 ${isWsSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                         <span className={`text-sm ${isWsSelected ? 'font-bold' : 'font-medium'}`}>{ws.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (selectedNode.type === 'region') {
      const region = regions.find(r => r.id === selectedNode.id);
      if (!region) return null;

      const childrenRegions = regions.filter(r => r.parentId === region.id);
      const childrenWs = workstations.filter(w => w.regionId === region.id);

      return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
           <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded bg-blue-100/50 border border-blue-100 flex justify-center items-center">
                 <Layers className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                 <h2 className="text-xl font-bold tracking-tight text-slate-800">{region.name}</h2>
                 <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-wider">REGION ID: {region.id} | LEVEL {region.level}</p>
               </div>
             </div>
             <button 
               onClick={() => deleteRegion(region.id)}
               className="px-3 py-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-md font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1"
             >
               <Trash2 className="w-3.5 h-3.5" /> 删除区域
             </button>
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto">
             <div className="mb-8">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">区域业务规则 (Child Rule)</h3>
               <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm max-w-md">
                 <p className="text-xs text-slate-500 mb-3">区域下级只能统一分配为“子区域”或“工位”，不可混用以保证拓扑清晰。</p>
                 <select 
                   value={region.childRule} 
                   onChange={(e) => setRegions(prev => prev.map(r => r.id === region.id ? { ...r, childRule: e.target.value as any } : r))}
                   disabled={childrenRegions.length > 0 || childrenWs.length > 0}
                   className="w-full border border-slate-200 rounded-md text-sm font-medium p-2 text-slate-700 bg-slate-50 focus:border-blue-500 outline-none disabled:opacity-50"
                 >
                   <option value="UNASSIGNED">未设定 (Unassigned)</option>
                   <option value="SUB_REGION">允许添加子区域 (Sub-Regions)</option>
                   <option value="WORKSTATION">允许添加工位 (Workstations)</option>
                 </select>
               </div>
             </div>

             {region.childRule === 'SUB_REGION' && (
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xs font-bold text-slate-700">子区域列表 ({childrenRegions.length})</h3>
                     <button onClick={() => setModalState({ type: 'SUB', parentId: region.id, parentLevel: region.level, isOpen: true, name: '' })} className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-800 shadow-sm"><Plus className="w-3 h-3"/> 新增子区</button>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                     <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                         <tr><th className="p-3 border-b border-slate-100">名称</th><th className="p-3 border-b border-slate-100 text-right">操作</th></tr>
                       </thead>
                       <tbody>
                         {childrenRegions.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-xs text-slate-400">暂无子区域数据</td></tr>}
                         {childrenRegions.map(r => (
                           <tr key={r.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-none">
                             <td className="p-3 font-semibold text-slate-700">{r.name}</td>
                             <td className="p-3 text-right">
                               <button onClick={() => setSelectedNode({ id: r.id, type: 'region' })} className="text-blue-600 text-xs font-bold hover:underline">查看</button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
             )}

             {region.childRule === 'WORKSTATION' && (
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xs font-bold text-slate-700">关联工位列表 ({childrenWs.length})</h3>
                     <button onClick={() => setModalState({ type: 'WS', parentId: region.id, isOpen: true, name: '' })} className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-800 shadow-sm"><Plus className="w-3 h-3"/> 注册新工位</button>
                   </div>
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                     {childrenWs.map(ws => (
                       <div key={ws.id} onClick={() => setSelectedNode({ id: ws.id, type: 'workstation' })} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                         <div className="flex items-center gap-2 mb-2">
                           <MapPin className="w-4 h-4 text-emerald-600" />
                           <h4 className="font-bold text-sm text-slate-800">{ws.name}</h4>
                         </div>
                         <div className="flex gap-4 mt-3 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-slate-400"/> {ws.deviceIds.length} 设备</span>
                           <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400"/> {ws.employeeIds.length} 员工</span>
                         </div>
                       </div>
                     ))}
                     {childrenWs.length === 0 && (
                        <div className="col-span-full py-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">暂无工位，点击注册新工位添加</div>
                     )}
                   </div>
                </div>
             )}
           </div>
        </div>
      );
    }

    if (selectedNode.type === 'workstation') {
      const ws = workstations.find(w => w.id === selectedNode.id);
      if (!ws) return null;

      const wsDevices = devices.filter(d => ws.deviceIds.includes(d.id));
      const wsEmployees = employees.filter(e => ws.employeeIds.includes(e.id));
      
      const unassignedDevices = devices.filter(d => !d.workstationId);
      const unassignedEmployees = employees.filter(e => !workstations.some(w => w.employeeIds.includes(e.id)));

      return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 bg-slate-50/50">
           <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded bg-emerald-100/50 border border-emerald-100 flex justify-center items-center">
                 <MapPin className="w-5 h-5 text-emerald-600" />
               </div>
               <div>
                 <h2 className="text-xl font-bold tracking-tight text-slate-800">{ws.name}</h2>
                 <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-wider">WORKSTATION ID: {ws.id}</p>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> Authorized Zone
               </div>
               <button 
                 onClick={() => deleteWorkstation(ws.id)}
                 className="px-3 py-1.5 text-xs text-rose-600 bg-white border border-rose-200 shadow-sm rounded-md font-semibold hover:bg-rose-50 transition-colors flex items-center gap-1"
               >
                 <Trash2 className="w-3.5 h-3.5" /> 移除工位
               </button>
             </div>
           </div>

           <div className="p-6 flex-1 overflow-y-auto grid grid-cols-2 gap-6">
              {/* 设备面板 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                     <Server className="w-4 h-4 text-blue-500"/>
                     生产设备绑定情况 ({wsDevices.length})
                   </h3>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-2">
                   {wsDevices.map(d => (
                     <div key={d.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors group">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                           <Cpu className="w-4 h-4 text-slate-600" />
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-800">{d.name}</p>
                           <p className="text-[10px] font-mono text-slate-500 mt-0.5">{d.sn} | {d.category}</p>
                         </div>
                       </div>
                       <button onClick={() => unbindDevice(ws.id, d.id)} className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 px-2 py-1 bg-rose-50 rounded hover:bg-rose-100 transition-all">解绑</button>
                     </div>
                   ))}
                   {wsDevices.length === 0 && <p className="text-center text-xs text-slate-400 py-6">此工位未绑定设备</p>}
                </div>
                {unassignedDevices.length > 0 && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
                    <select id="device-select" className="flex-1 text-xs border border-slate-200 rounded-md p-1.5 py-2 font-medium bg-white">
                      {unassignedDevices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.sn})</option>)}
                    </select>
                    <button 
                      onClick={() => {
                        const val = (document.getElementById('device-select') as HTMLSelectElement).value;
                        if(val) bindDeviceToWorkstation(ws.id, val);
                      }}
                      className="px-3 text-xs bg-slate-900 text-white font-bold rounded-md hover:bg-slate-800 shadow-sm"
                    >添加</button>
                  </div>
                )}
              </div>

              {/* 员工面板 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                     <Users className="w-4 h-4 text-emerald-500"/>
                     资质员工绑定情况 ({wsEmployees.length})
                   </h3>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-2">
                   {wsEmployees.map(e => (
                     <div key={e.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors group">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                           {e.name[0]}
                         </div>
                         <div>
                           <p className="text-xs font-bold text-slate-800">{e.name}</p>
                           <p className="text-[10px] font-mono text-slate-500 mt-0.5">{e.badgeNumber}</p>
                         </div>
                       </div>
                       <button onClick={() => unbindEmployee(ws.id, e.id)} className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 px-2 py-1 bg-rose-50 rounded hover:bg-rose-100 transition-all">解绑</button>
                     </div>
                   ))}
                   {wsEmployees.length === 0 && <p className="text-center text-xs text-slate-400 py-6">无人员驻守</p>}
                </div>
                {unassignedEmployees.length > 0 && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
                    <select id="emp-select" className="flex-1 text-xs border border-slate-200 rounded-md p-1.5 py-2 font-medium bg-white">
                      {unassignedEmployees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.badgeNumber})</option>)}
                    </select>
                    <button 
                      onClick={() => {
                        const val = (document.getElementById('emp-select') as HTMLSelectElement).value;
                        if(val) bindEmployeeToWorkstation(ws.id, val);
                      }}
                      className="px-3 text-xs bg-slate-900 text-white font-bold rounded-md hover:bg-slate-800 shadow-sm"
                    >排班</button>
                  </div>
                )}
              </div>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 h-full flex gap-6 overflow-hidden max-w-[1400px] mx-auto">
      {/* 左侧拓扑树 */}
      <div className="w-80 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-700">组织架构树 (Topology)</h3>
          <button onClick={() => setModalState({ type: 'ROOT', isOpen: true, name: '' })} className="w-6 h-6 flex items-center justify-center rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="添加一级区域">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 overflow-y-auto flex-1 text-sm bg-white">
          {renderTree(null)}
          {regions.length === 0 && (
             <div className="text-xs text-slate-400 mt-4 text-center">暂无组织架构，请先添加一级区域。</div>
          )}
        </div>
      </div>
      
      {/* 右侧详情 */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
         {renderContent()}
         {!selectedNode.id && regions.length > 0 && (
             <div className="flex items-center justify-center h-full text-slate-400 text-sm">请在左侧选择区域或工位查看详情</div>
         )}
      </div>

      {/* 新建模态框 */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {modalState.type === 'ROOT' ? '新增一级区域' : modalState.type === 'SUB' ? '新增子区域' : '注册新工位'}
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">名称 *</label>
              <input 
                type="text" 
                autoFocus
                value={modalState.name}
                onChange={e => setModalState({ ...modalState, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && executeAdd()}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder={modalState.type === 'WS' ? '如: WS-01 测试岗' : '输入区域名称...'}
              />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setModalState({ type: null, isOpen: false, name: '' })}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={executeAdd}
                disabled={!modalState.name.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
