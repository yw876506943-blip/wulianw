import React, { useState } from 'react';
import { Users, Search, Plus, Filter, Edit2, Trash2, CheckCircle2, Shield, Briefcase, BadgeCheck, X } from 'lucide-react';
import { Employee } from '../types';

type EmployeeLevel = Employee & { department: string; status: 'ACTIVE' | 'INACTIVE'; role: string; skillLevel: string };

const INITIAL_EMPLOYEES: EmployeeLevel[] = [
  { id: 'E1001', name: '李明', badgeNumber: 'EMP-SP-1001', department: '生产一部', status: 'ACTIVE', role: '操作员', skillLevel: 'L3(专家)' },
  { id: 'E1002', name: '王芳', badgeNumber: 'EMP-SP-1002', department: '生产二部', status: 'ACTIVE', role: '检验员', skillLevel: 'L2(熟练)' },
  { id: 'E1003', name: '张强', badgeNumber: 'EMP-SP-1003', department: '维修部', status: 'INACTIVE', role: '维修工', skillLevel: 'L3(专家)' },
  { id: 'E1004', name: '刘洋', badgeNumber: 'EMP-SP-1004', department: '生产一部', status: 'ACTIVE', role: '操作员', skillLevel: 'L1(初级)' },
  { id: 'E1005', name: '陈建国', badgeNumber: 'EMP-SP-1005', department: '工程部', status: 'ACTIVE', role: '工艺工程师', skillLevel: 'L4(导师)' },
];

export function EmployeesView() {
  const [employees, setEmployees] = useState<EmployeeLevel[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EmployeeLevel>>({});

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.includes(searchTerm) || emp.badgeNumber.includes(searchTerm);
    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenModal = (emp?: EmployeeLevel) => {
    if (emp) {
      setEditingId(emp.id);
      setFormData(emp);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        badgeNumber: '',
        department: '生产一部',
        status: 'ACTIVE',
        role: '操作员',
        skillLevel: 'L1(初级)',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.badgeNumber) return;

    if (editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? { ...emp, ...formData } as EmployeeLevel : emp));
    } else {
      const newEmp: EmployeeLevel = {
        ...(formData as Omit<EmployeeLevel, 'id'>),
        id: `E${Math.floor(1000 + Math.random() * 9000)}`,
      } as EmployeeLevel;
      setEmployees([newEmp, ...employees]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该员工信息吗？')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300 relative">
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">智能物联网平台</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Personnel & Skills Management</p>
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> 录入新员工
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索员工姓名、工号..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-md text-xs focus:border-blue-500 outline-none transition-colors" 
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="border border-slate-200 rounded-md text-xs px-3 py-1.5 outline-none text-slate-600 bg-white"
            >
              <option value="ALL">全部部门</option>
              <option value="生产一部">生产一部</option>
              <option value="生产二部">生产二部</option>
              <option value="维修部">维修部</option>
              <option value="工程部">工程部</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 text-slate-700 transition-colors">
            <Filter className="w-3.5 h-3.5" /> 高级筛选
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 z-10">
              <tr>
                <th className="p-4 py-3">基本信息</th>
                <th className="p-4 py-3">人员工号 (Badge ID)</th>
                <th className="p-4 py-3">所属部门</th>
                <th className="p-4 py-3">岗位角色</th>
                <th className="p-4 py-3">技能等级</th>
                <th className="p-4 py-3">在职状态</th>
                <th className="p-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded inline-flex border border-slate-200/60">
                      <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
                      {emp.badgeNumber}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">
                    {emp.department}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {emp.role}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold shadow-sm">
                      {emp.skillLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    {emp.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        在职 (ACTIVE)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        离职 (INACTIVE)
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-700 transition-colors" title="编辑信息">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        className="p-1.5 rounded hover:bg-rose-100 hover:text-rose-600 transition-colors" title="删除员工">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    暂无匹配的员工信息
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingId ? <Edit2 className="w-4 h-4 text-blue-500" /> : <Plus className="w-4 h-4 text-blue-500" />}
                {editingId ? '编辑员工信息' : '录入新员工'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">姓名 *</label>
                  <input 
                    type="text" 
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="输入员工姓名"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">人员工号 (Badge ID) *</label>
                  <input 
                    type="text" 
                    value={formData.badgeNumber || ''}
                    onChange={e => setFormData({...formData, badgeNumber: e.target.value})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 font-mono"
                    placeholder="例如: EMP-SP-1006"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">所属部门</label>
                  <select 
                    value={formData.department || '生产一部'}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="生产一部">生产一部</option>
                    <option value="生产二部">生产二部</option>
                    <option value="维修部">维修部</option>
                    <option value="工程部">工程部</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">岗位角色</label>
                  <input 
                    type="text" 
                    value={formData.role || ''}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="例如: 操作员"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">技能等级</label>
                  <select 
                    value={formData.skillLevel || 'L1(初级)'}
                    onChange={e => setFormData({...formData, skillLevel: e.target.value})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="L1(初级)">L1(初级)</option>
                    <option value="L2(熟练)">L2(熟练)</option>
                    <option value="L3(专家)">L3(专家)</option>
                    <option value="L4(导师)">L4(导师)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">在职状态</label>
                  <select 
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">在职 (ACTIVE)</option>
                    <option value="INACTIVE">离职 (INACTIVE)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.name || !formData.badgeNumber}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
