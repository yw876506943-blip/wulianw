import React, { useState } from 'react';
import { 
  Settings, Users, Database, Shield, Download, 
  RefreshCcw, Globe, Moon, Sun, Key, Plus, 
  Archive, FileSpreadsheet, Lock
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 'U1', name: '张伟', username: 'admin_zw', role: 'PLATFORM_ADMIN', scope: '全局所有资源', status: 'ACTIVE' },
  { id: 'U2', name: '李静', username: 'lijing_op', role: 'LINE_ADMIN', scope: '产线: SMT-主板组装线 A区', status: 'ACTIVE' },
  { id: 'U3', name: '王强', username: 'wangq_rd', role: 'READ_ONLY', scope: '区域: 北区包装车间', status: 'ACTIVE' },
];

const INITIAL_EXPORTS = [
  { id: 'EXP-901', name: '09月设备报警记录报表.xlsx', time: '2023-10-01 10:00:00', size: '2.4 MB', status: 'COMPLETED' },
  { id: 'EXP-902', name: 'A区产线历史工艺数据_Q3.xlsx', time: '2023-10-15 14:30:00', size: '15.8 MB', status: 'COMPLETED' },
];

const INITIAL_BACKUPS = [
  { id: 'BAK-001', name: 'SYS_DB_BACKUP_20231020.sql', time: '2023-10-20 02:00:00', size: '48.2 MB', type: 'AUTO' },
  { id: 'BAK-002', name: 'SYS_DB_BACKUP_20231027_MANUAL.sql', time: '2023-10-27 10:15:00', size: '49.1 MB', type: 'MANUAL' },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'users' | 'data' | 'system'>('data');
  const [backupCycle, setBackupCycle] = useState('WEEKLY');
  const [theme, setTheme] = useState('LIGHT');
  const [lang, setLang] = useState('ZH_CN');
  
  const [users, setUsers] = useState(INITIAL_USERS);
  const [exports, setExports] = useState(INITIAL_EXPORTS);
  const [backups, setBackups] = useState(INITIAL_BACKUPS);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '' });

  const executeAddUser = () => {
    if(!newUser.name.trim() || !newUser.username.trim()) return;
    const nUser = {
      id: `U-${Date.now()}`,
      name: newUser.name,
      username: newUser.username,
      role: 'READ_ONLY',
      scope: '访客权限',
      status: 'ACTIVE'
    };
    setUsers([...users, nUser]);
    setUserModalOpen(false);
    setNewUser({ name: '', username: '' });
  };

  const performBackup = () => {
    const newBak = {
      id: `BAK-${Date.now()}`,
      name: `SYS_DB_BACKUP_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_MANUAL.sql`,
      time: new Date().toLocaleString(),
      size: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
      type: 'MANUAL'
    };
    setBackups([newBak, ...backups]);
    alert("手动备份执行完毕。");
  };

  const deleteBackup = (id: string) => {
    if(confirm('确定删除该备份文件吗？将不可恢复！')) {
      setBackups(prev => prev.filter(b => b.id !== id));
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if(u.id === id) {
         return { ...u, status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' };
      }
      return u;
    }));
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'PLATFORM_ADMIN': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'LINE_ADMIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'READ_ONLY': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case 'PLATFORM_ADMIN': return '平台系统管理员';
      case 'LINE_ADMIN': return '产线管理员';
      case 'READ_ONLY': return '只读访客';
      default: return role;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">智能物联网平台</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">System Preferences & Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'data' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />数据与备份
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'users' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />用户与权限
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'system' 
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />系统设置
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        
        {/* ===================== TAB: 数据与备份 ===================== */}
        {activeTab === 'data' && (
          <div className="h-full flex gap-6 animate-in slide-in-from-bottom-2 duration-300">
             {/* 数据库备份设定 */}
             <div className="w-[450px] flex flex-col gap-6 shrink-0">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-700">系统数据备份配置</h3>
                  </div>
                  <div className="p-5 flex-1 space-y-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">自动备份周期</label>
                      <select 
                        value={backupCycle}
                        onChange={e => setBackupCycle(e.target.value)}
                        className="w-full border border-slate-200 rounded-md p-2 text-sm focus:border-blue-500 outline-none"
                      >
                        <option value="DAILY">每天凌晨 02:00 (Daily)</option>
                        <option value="WEEKLY">每周日凌晨 02:00 (Weekly)</option>
                        <option value="MONTHLY">每月 1 号凌晨 02:00 (Monthly)</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1.5">系统将定期将设备运行数据、工艺记录备份为 SQL 文件存储。</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <button onClick={performBackup} className="w-full py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <Archive className="w-4 h-4" /> 立即执行手动备份
                      </button>
                    </div>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-700">历史导出报表中心</h3>
                  </div>
                  <div className="p-0 overflow-y-auto flex-1">
                    {exports.map(exp => (
                      <div key={exp.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-800 break-words pr-2">{exp.name}</p>
                          <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors shrink-0">
                            <Download className="w-4 h-4"/>
                          </button>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                           <span>{exp.time}</span>
                           <span>{exp.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             </div>

             {/* 历史备份记录列表 */}
             <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Archive className="w-4 h-4 text-indigo-500" /> 历史 SQL 备份文件
                  </h3>
                  <button className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="p-4 py-3">备份文件名</th>
                        <th className="p-4 py-3">生成时间</th>
                        <th className="p-4 py-3">文件大小</th>
                        <th className="p-4 py-3">触发类型</th>
                        <th className="p-4 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backups.map(bak => (
                        <tr key={bak.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-xs font-bold text-slate-700 font-mono">{bak.name}</td>
                          <td className="p-4 text-xs text-slate-500">{bak.time}</td>
                          <td className="p-4 text-xs text-slate-600">{bak.size}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border shadow-sm ${bak.type === 'AUTO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                              {bak.type}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => alert('开始下载...')} className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-slate-700 hover:bg-slate-50 mr-2">下载</button>
                            <button onClick={() => deleteBackup(bak.id)} className="text-[10px] font-bold bg-rose-50 border border-rose-100 px-2 py-1 rounded shadow-sm text-rose-600 hover:bg-rose-100">删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {/* ===================== TAB: 用户与权限 ===================== */}
        {activeTab === 'users' && (
          <div className="h-full bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-500" /> 用户与数据范围授权</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">严格控制平台级、区域级、产线级的访问及操作权限。</p>
               </div>
               <button onClick={() => setUserModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded shadow-sm hover:bg-slate-800">
                 <Plus className="w-3.5 h-3.5" /> 注册新用户
               </button>
             </div>
             
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                   <tr>
                     <th className="p-4 py-3">姓名</th>
                     <th className="p-4 py-3">登录账号</th>
                     <th className="p-4 py-3">系统角色</th>
                     <th className="p-4 py-3">授权数据边界规范</th>
                     <th className="p-4 py-3">账号状态</th>
                     <th className="p-4 py-3 text-right">管理操作</th>
                   </tr>
                 </thead>
                 <tbody>
                   {users.map(user => (
                     <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="p-4 text-xs font-bold text-slate-800">{user.name}</td>
                       <td className="p-4 text-xs font-mono text-slate-500">{user.username}</td>
                       <td className="p-4">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm ${getRoleBadge(user.role)}`}>
                           {getRoleName(user.role)}
                         </span>
                       </td>
                       <td className="p-4 text-xs font-semibold text-slate-600">{user.scope}</td>
                       <td className="p-4">
                         <span className={`text-[10px] font-bold border px-2 py-0.5 rounded shadow-sm ${user.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-100 border-slate-200'}`}>
                           {user.status === 'ACTIVE' ? '正常 (ACTIVE)' : '封禁 (DISABLED)'}
                         </span>
                       </td>
                       <td className="p-4 text-right">
                         <button onClick={() => window.alert('编辑用户功能占位')} className="text-[10px] font-bold text-blue-600 hover:underline mx-2">权限编辑</button>
                         <button onClick={() => toggleUserStatus(user.id)} className="text-[10px] font-bold text-rose-600 hover:underline">{user.status === 'ACTIVE' ? '封禁' : '解封'}</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* ===================== TAB: 系统设置 ===================== */}
        {activeTab === 'system' && (
          <div className="h-full flex gap-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm animate-in slide-in-from-bottom-2 duration-300">
             
             {/* 授权信息 */}
             <div className="w-1/3 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4"><Key className="w-4 h-4 text-amber-500" /> 商业平台授权激活</h3>
                  <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield className="w-24 h-24" />
                     </div>
                     <div className="relative z-10">
                       <div className="flex justify-between items-center mb-4">
                         <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-wider">Activated Valid</span>
                       </div>
                       <h4 className="text-lg font-bold mb-1">Enterprise Plus 旗舰版</h4>
                       <p className="text-xs text-slate-400 font-mono mb-6">LIC-8829-XJ99-2023</p>
                       
                       <div className="space-y-3 text-xs text-slate-300">
                         <div className="flex justify-between border-b border-white/10 pb-2">
                           <span>到期时间</span>
                           <span className="font-bold text-white">2029-12-31</span>
                         </div>
                         <div className="flex justify-between border-b border-white/10 pb-2">
                           <span>授权节点支持</span>
                           <span className="font-bold text-white">无限节点 (Unlimited)</span>
                         </div>
                         <div className="flex justify-between">
                           <span>技术支持服务</span>
                           <span className="font-bold text-white">VIP 专线支持</span>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
             </div>

             {/* 个性化与语言 */}
             <div className="w-2/3 space-y-8 pl-8 border-l border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 block mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500"/> 系统语言偏好 (Language)</h3>
                  <div className="flex gap-4">
                    {[
                      { id: 'ZH_CN', label: '简体中文' },
                      { id: 'ZH_TW', label: '繁體中文' },
                      { id: 'EN', label: 'English' }
                    ].map(l => (
                       <label key={l.id} className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all flex items-center gap-3 ${lang === l.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${lang === l.id ? 'border-blue-500' : 'border-slate-300'}`}>
                           {lang === l.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                         </div>
                         <span className={`text-sm font-bold ${lang === l.id ? 'text-blue-700' : 'text-slate-700'}`}>{l.label}</span>
                       </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-700 block mb-4 flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500"/> 主题外观 (Theme)</h3>
                  <div className="flex gap-4">
                    <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all flex items-center gap-3 ${theme === 'LIGHT' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => setTheme('LIGHT')}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${theme === 'LIGHT' ? 'border-blue-500' : 'border-slate-300'}`}>
                         {theme === 'LIGHT' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <Sun className="w-4 h-4 text-slate-600" />
                      <span className={`text-sm font-bold ${theme === 'LIGHT' ? 'text-blue-700' : 'text-slate-700'}`}>高亮模式 (Light)</span>
                    </label>
                    <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all flex items-center gap-3 ${theme === 'DARK' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => setTheme('DARK')}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${theme === 'DARK' ? 'border-blue-500' : 'border-slate-300'}`}>
                         {theme === 'DARK' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <Moon className="w-4 h-4 text-slate-600" />
                      <span className={`text-sm font-bold ${theme === 'DARK' ? 'text-blue-700' : 'text-slate-700'}`}>深夜模式 (Dark)</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">注：主题切换功能在本预览环境中仅作展示。</p>
                </div>
             </div>

          </div>
        )}
      </div>

      {/* 新建用户模态框 */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                注册新用户
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">姓名 *</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="例如: 张三"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">登录账号 *</label>
                <input 
                  type="text" 
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && executeAddUser()}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="例如: zhangsan"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => { setUserModalOpen(false); setNewUser({ name: '', username: '' }); }}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={executeAddUser}
                disabled={!newUser.name.trim() || !newUser.username.trim()}
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
