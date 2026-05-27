import React, { useState } from 'react';
import { 
  ActivitySquare, AlertTriangle, ScrollText, Search, Filter, 
  CheckCircle2, Clock, ShieldAlert, Cpu, HardDrive, User, Download
} from 'lucide-react';

const INITIAL_ALARMS = [
  { id: 'ALM-1029', time: '2023-10-27 14:06:00', type: '超温报警 (Overtemp)', severity: 'CRITICAL', device: 'SN-S-9001 (无铅焊台)', ws: 'STN-022', line: 'SMT-主板组装线 A区', status: 'UNHANDLED', desc: '检测到温度 412°C，超出工艺上限目标值 355°C。' },
  { id: 'ALM-1028', time: '2023-10-27 13:45:12', type: '设备离线 (Offline)', severity: 'MEDIUM', device: 'SN-T-5510 (测温仪)', ws: 'STN-021', line: 'SMT-主板组装线 A区', status: 'HANDLED', desc: '设备心跳丢失超 3 分钟。' },
  { id: 'ALM-1027', time: '2023-10-27 13:10:05', type: 'ESD 防护失效', severity: 'CRITICAL', device: 'ESD-11 (静电腕带)', ws: 'STN-024', line: 'DIP-插件线 B区', status: 'UNHANDLED', desc: '接地阻抗无穷大，疑似脱落。' },
  { id: 'ALM-1026', time: '2023-10-27 11:20:00', type: '滤网堵塞预警', severity: 'LOW', device: 'SN-F-2200 (烟雾净化)', ws: 'STN-021', line: 'SMT-主板组装线 A区', status: 'HANDLED', desc: '压差传感器提示滤网透气率低于 20%，建议本周内更换。' },
];

const MOCK_LOGS = [
  { id: 'LOG-5501', time: '2023-10-27 14:20:11', user: '张伟 (Admin)', action: '工艺参数下发 (DEPLOY)', target: 'SMT-主板组装线 A区', result: 'SUCCESS', details: '应用模型: P-001 无铅回流焊标准工艺 V2.1.0' },
  { id: 'LOG-5500', time: '2023-10-27 14:15:30', user: '李静 (Operator)', action: '工位绑定 (BIND)', target: 'STN-021', result: 'SUCCESS', details: '为工位绑定设备 SN-S-9001' },
  { id: 'LOG-5499', time: '2023-10-27 14:00:05', user: 'SYSTEM (Broker)', action: '设备自动发现 (DISCOVER)', target: '192.168.1.102', result: 'SUCCESS', details: '检测到未配网设备 MAC: 00:1B:44:11:3A:B7' },
  { id: 'LOG-5498', time: '2023-10-27 13:58:20', user: '张伟 (Admin)', action: '拓扑结构修改 (DELETE)', target: '南区制造工厂 -> 老化房', result: 'FAILED', details: '校验拒绝：该区域下存在关联工位，无法直接删除。' },
];

export function AlarmsView() {
  const [activeTab, setActiveTab] = useState<'alarms' | 'logs'>('alarms');
  const [alarmStatusFilter, setAlarmStatusFilter] = useState<'ALL' | 'UNHANDLED' | 'HANDLED'>('ALL');
  
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);

  const filteredAlarms = alarms.filter(a => alarmStatusFilter === 'ALL' || a.status === alarmStatusFilter);

  const resolveAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, status: 'HANDLED' } : a));
  };

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getResultStyle = (result: string) => {
    return result === 'SUCCESS' 
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm'
      : 'text-rose-600 bg-rose-50 border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-rose-50 flex items-center justify-center text-rose-600">
            <ActivitySquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">智能物联网平台</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Alarms & Audit Trail Logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('alarms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'alarms' 
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />异常报警追溯
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'logs' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ScrollText className="w-4 h-4" />系统操作日志
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        
        {/* ===================== TAB: 报警中心 ===================== */}
        {activeTab === 'alarms' && (
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-2 duration-300">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="搜索设备、工位或报警描述..." className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-md text-xs focus:border-rose-500 outline-none" />
                 </div>
                 <select 
                   value={alarmStatusFilter}
                   onChange={e => setAlarmStatusFilter(e.target.value as any)}
                   className="border border-slate-200 rounded-md text-xs px-3 py-1.5 outline-none text-slate-600 bg-white"
                 >
                   <option value="ALL">全部处理状态</option>
                   <option value="UNHANDLED">待处理 (Unhandled)</option>
                   <option value="HANDLED">已处理 (Handled)</option>
                 </select>
                 <select className="border border-slate-200 rounded-md text-xs px-3 py-1.5 outline-none text-slate-600 bg-white">
                   <option>全部等级 (Severity)</option>
                   <option>CRITICAL (严重)</option>
                   <option>MEDIUM (中告警)</option>
                   <option>LOW (提示)</option>
                 </select>
               </div>
               <div className="flex gap-2">
                 <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 text-slate-700">
                   <Filter className="w-3.5 h-3.5" /> 更多筛选
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 text-slate-700">
                   <Download className="w-3.5 h-3.5" /> 导出数据
                 </button>
               </div>
             </div>
             
             <div className="flex-1 overflow-auto bg-slate-50/30">
               <div className="p-4 space-y-3">
                 {filteredAlarms.map(alarm => (
                   <div key={alarm.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors flex gap-4">
                     <div className="shrink-0 flex flex-col items-center justify-center pt-1">
                       <ShieldAlert className={`w-8 h-8 ${alarm.severity === 'CRITICAL' ? 'text-rose-500' : alarm.severity === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'}`} />
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                           <h3 className="font-bold text-slate-800 text-sm tracking-tight">{alarm.type}</h3>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase shadow-sm ${getSeverityStyle(alarm.severity)}`}>
                             {alarm.severity}
                           </span>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase shadow-sm ${alarm.status === 'UNHANDLED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                             {alarm.status === 'UNHANDLED' ? '待处理' : '已归档'}
                           </span>
                         </div>
                         <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                           <Clock className="w-3 h-3" /> {alarm.time}
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4 mb-3">
                         <div className="flex items-center gap-2 text-xs text-slate-600">
                           <Cpu className="w-3.5 h-3.5 text-slate-400"/>
                           <span className="font-bold text-slate-700 truncate">{alarm.device}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-600">
                           <HardDrive className="w-3.5 h-3.5 text-slate-400"/>
                           <span className="font-bold text-slate-700 truncate">{alarm.ws}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-600">
                           <ActivitySquare className="w-3.5 h-3.5 text-slate-400"/>
                           <span className="font-bold text-slate-700 truncate">{alarm.line}</span>
                         </div>
                       </div>
                       
                       <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-700 leading-relaxed font-medium">
                         <span className="text-slate-400 font-bold uppercase text-[10px] mr-2">DETAIL_MSG:</span>
                         {alarm.desc}
                       </div>
                     </div>
                     <div className="shrink-0 flex flex-col justify-end gap-2 pr-2 border-l border-slate-100 pl-4 py-1">
                        {alarm.status === 'UNHANDLED' ? (
                          <>
                            <button onClick={() => resolveAlarm(alarm.id)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 shadow-sm transition-colors">标记处理</button>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 shadow-sm transition-colors">远程干预</button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block w-full text-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mx-auto" />
                          </div>
                        )}
                     </div>
                   </div>
                 ))}
                 
                 {filteredAlarms.length === 0 && (
                   <div className="text-center py-12 text-slate-400 text-sm">
                      暂无匹配的报警数据
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* ===================== TAB: 系统日志 ===================== */}
        {activeTab === 'logs' && (
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right-2 duration-300">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="搜索操作人、目标对象或动作..." className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                 </div>
                 <input type="date" className="border border-slate-200 rounded-md text-xs px-3 py-1.5 outline-none text-slate-600 bg-white" />
               </div>
               <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 text-slate-700">
                 <Download className="w-3.5 h-3.5" /> 导出审计日志
               </button>
             </div>
             
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                   <tr>
                     <th className="p-4 py-3">事件时间</th>
                     <th className="p-4 py-3">人员 / 角色</th>
                     <th className="p-4 py-3">执行动作</th>
                     <th className="p-4 py-3">目标对象 / 资源</th>
                     <th className="p-4 py-3">执行状态</th>
                     <th className="p-4 py-3">明细记录</th>
                   </tr>
                 </thead>
                 <tbody>
                   {MOCK_LOGS.map(log => (
                     <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                       <td className="p-4 text-xs font-mono text-slate-500">{log.time}</td>
                       <td className="p-4">
                         <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <User className="w-3 h-3" />
                           </div>
                           <span className="font-bold text-slate-700 text-xs">{log.user}</span>
                         </div>
                       </td>
                       <td className="p-4 text-xs font-bold text-slate-800">{log.action}</td>
                       <td className="p-4 text-xs text-blue-600 font-semibold">{log.target}</td>
                       <td className="p-4">
                         <span className={getResultStyle(log.result)}>{log.result}</span>
                       </td>
                       <td className="p-4 text-xs text-slate-600 max-w-xs truncate" title={log.details}>
                         {log.details}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
