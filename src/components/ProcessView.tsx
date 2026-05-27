import React, { useState } from 'react';
import { 
  FileBox, Barcode, FileText, Search, Plus, 
  Settings, CheckCircle2, Factory, Link, X, AlertTriangle, Trash2
} from 'lucide-react';

const INITIAL_PROCESSES = [
  { id: 'P-001', name: '无铅回流焊标准工艺 (Lead-Free)', version: 'V2.1.0', target: 'SOLDERING_STATION', params: { tempMin: 345, tempMax: 355, standbyTemp: 200, standbyTime: 15 } },
  { id: 'P-002', name: '静电防护等级A', version: 'V1.0.0', target: 'ANTI_STATIC_WRIST', params: { esdMax: 0.1 } },
  { id: 'P-003', name: '烟雾净化高转速模式', version: 'V1.2.0', target: 'FUME_EXTRACTOR', params: { fanSpeedRpm: 2200, filterAlarmLimit: 80 } },
];

const INITIAL_PRODUCTS = [
  { id: 'PRD-001', sku: 'SKU-9901', name: 'T-900 Ultra Slim Base', barcode: 'BAR-9901-X7', baseProcess: 'P-001' },
  { id: 'PRD-002', sku: 'SKU-9902', name: 'T-900 Pro Max Board', barcode: 'BAR-9902-X8', baseProcess: 'P-001' },
];

const INITIAL_LINES = [
  { id: 'L1', name: 'SMT-主板组装线 A区', activeProcess: 'P-001', activeProduct: null },
  { id: 'L2', name: 'DIP-插件线 B区', activeProcess: null, activeProduct: 'PRD-001' },
];

export function ProcessView() {
  const [activeTab, setActiveTab] = useState<'process' | 'product'>('process');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deployModal, setDeployModal] = useState<boolean>(false);
  const [selectedLineForDeploy, setSelectedLineForDeploy] = useState<string>('L1');

  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [lines, setLines] = useState(INITIAL_LINES);

  const deleteProcess = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('确定要删除该工艺吗？')) {
      setProcesses(prev => prev.filter(p => p.id !== id));
      if(selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const deleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('确定要删除该产品配置吗？')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if(selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const [addModalState, setAddModalState] = useState<{ isOpen: boolean, type: 'process' | 'product', name: string }>({ isOpen: false, type: 'process', name: '' });

  const executeAdd = () => {
    const name = addModalState.name.trim();
    if (!name) return;

    if (addModalState.type === 'process') {
      const newP = {
         id: `P-${Date.now()}`,
         name,
         version: 'V1.0.0',
         target: 'SOLDERING_STATION',
         params: { tempMin: 300, tempMax: 350 }
      };
      setProcesses([newP, ...processes]);
    } else {
      const newP = {
         id: `PRD-${Date.now()}`,
         sku: name,
         name: `新产品 ${name}`,
         barcode: `BAR-${Date.now()}`,
         baseProcess: processes[0]?.id || ''
      };
      setProducts([newP, ...products]);
    }
    setAddModalState({ isOpen: false, type: 'process', name: '' });
  };

  const executeDeploy = () => {
    setLines(prev => prev.map(l => {
      if(l.id === selectedLineForDeploy) {
         if (activeTab === 'process') {
            return { ...l, activeProcess: selectedItem.id, activeProduct: null };
         } else {
            return { ...l, activeProcess: null, activeProduct: selectedItem.id };
         }
      }
      return l;
    }));
    setDeployModal(false);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-amber-600">
            <FileBox className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">智能物联网平台</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Parameters & SOP Definitions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => { setActiveTab('process'); setSelectedItem(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'process' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />工艺模型库
          </button>
          <button
            onClick={() => { setActiveTab('product'); setSelectedItem(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'product' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Barcode className="w-4 h-4" />生产产品目录
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex gap-6">
        
        {/* ===================== 主列表区域 ===================== */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder={`搜索${activeTab === 'process' ? '工艺名称/代号' : '产品SKU/条码'}...`} className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                 </div>
               </div>
               <button onClick={() => setAddModalState({ isOpen: true, type: activeTab, name: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded shadow-sm hover:bg-slate-800">
                 <Plus className="w-3.5 h-3.5" /> 新建{activeTab === 'process' ? '工艺' : '产品'}
               </button>
             </div>
             
             <div className="flex-1 overflow-auto p-4">
               {activeTab === 'process' ? (
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                   {processes.map(proc => (
                     <div 
                       key={proc.id} 
                       onClick={() => setSelectedItem(proc)}
                       className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedItem?.id === proc.id ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'} group relative`}
                     >
                       <button 
                         onClick={(e) => deleteProcess(proc.id, e)}
                         className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                       <div className="flex justify-between items-start mb-3 pr-6">
                         <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                           <h3 className="font-bold text-slate-800 text-sm tracking-tight">{proc.name}</h3>
                         </div>
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono shrink-0">{proc.version}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">适配设备类：{proc.target}</p>
                       <div className="bg-slate-50 rounded text-[10px] font-mono text-slate-600 p-2 border border-slate-100">
                         {Object.entries(proc.params).slice(0, 2).map(([k, v]) => (
                           <div key={k} className="flex justify-between"><span>{k}:</span><span className="font-bold">{v as string|number}</span></div>
                         ))}
                         {Object.keys(proc.params).length > 2 && <div className="text-slate-400 mt-1">... 更多参数</div>}
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                   {products.map(prd => (
                     <div 
                       key={prd.id} 
                       onClick={() => setSelectedItem(prd)}
                       className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedItem?.id === prd.id ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'} group relative`}
                     >
                       <button 
                         onClick={(e) => deleteProduct(prd.id, e)}
                         className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                       <div className="flex justify-between items-start mb-3 pr-6">
                         <div className="flex items-center gap-2">
                           <Barcode className="w-4 h-4 text-blue-600 shrink-0" />
                           <h3 className="font-bold text-slate-800 text-sm tracking-tight">{prd.sku}</h3>
                         </div>
                       </div>
                       <p className="text-xs text-slate-700 font-semibold mb-1">{prd.name}</p>
                       <p className="text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 mb-3 break-all">ID: {prd.barcode}</p>
                       
                       <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3">
                         <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                         <span className="text-[10px] text-slate-500 truncate">绑定工艺: <span className="font-bold text-slate-700">{processes.find(p => p.id === prd.baseProcess)?.name || '未知'}</span></span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
        </div>

        {/* ===================== 右侧滑出面板：详情与下发 ===================== */}
        {selectedItem && (
          <div className="w-[450px] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-300">
             <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-base font-bold text-slate-800">{activeTab === 'process' ? selectedItem.name : selectedItem.sku}</h3>
                 </div>
                 <p className="font-mono text-xs text-slate-500">{activeTab === 'process' ? `ID: ${selectedItem.id} | Ver: ${selectedItem.version}` : `条码: ${selectedItem.barcode}`}</p>
               </div>
               <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-6">
                  {/* 内容展示区 */}
                  {activeTab === 'process' ? (
                     <div>
                       <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><Settings className="w-4 h-4 text-blue-500"/> 标准参数定义配置</h4>
                       <div className="bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-emerald-400">
<pre>{JSON.stringify(selectedItem.params, null, 2)}</pre>
                       </div>
                       <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">上述参数在下发到产线后，将作为工位对应设备的工艺评估标准。若设备运行数据偏离该参数范围，系统将产生报警。</p>
                     </div>
                  ) : (
                     <div>
                       <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-emerald-500"/> 继承工艺与扩展属性</h4>
                       <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 mb-4">
                         <p className="text-[10px] text-slate-500 mb-1">基础工艺模型</p>
                         <p className="text-xs font-bold text-slate-800">{processes.find(p => p.id === selectedItem.baseProcess)?.name || '未配置'}</p>
                       </div>
                       <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-start gap-2">
                         <Barcode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                         <p className="text-[10px] text-emerald-800 leading-relaxed">产品条码具备扫码快速就绪特性。现场使用扫码枪扫描此产品条码，工位关联设备即可自动加载对应的工艺标准并下发参数设定。</p>
                       </div>
                     </div>
                  )}

                  {/* 产线分配操作区 */}
                  <div className="border-t border-slate-100 pt-6">
                     <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><Factory className="w-4 h-4 text-indigo-500"/> 调度：应用至产线</h4>
                     <button 
                       onClick={() => setDeployModal(true)}
                       className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
                     >
                       选择产线并应用配置
                     </button>

                     <div className="mt-4 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">当前应用该模型的产线</p>
                        {lines.filter(l => activeTab === 'process' ? l.activeProcess === selectedItem.id : l.activeProduct === selectedItem.id).map(l => (
                          <div key={l.id} className="flex justify-between items-center p-2 border border-slate-100 rounded-md bg-white">
                            <span className="text-xs font-semibold text-slate-700">{l.name}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-200 shadow-sm">Active</span>
                          </div>
                        ))}
                        {lines.filter(l => activeTab === 'process' ? l.activeProcess === selectedItem.id : l.activeProduct === selectedItem.id).length === 0 && (
                          <p className="text-xs text-slate-400">目前没有任何产线应用该配置</p>
                        )}
                     </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 调度分配 Modal */}
      {deployModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">应用 {activeTab === 'process' ? '工艺' : '产品'} 到产线</h3>
              <button onClick={() => setDeployModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-700 block mb-2">目标下发产线</label>
                 <select 
                   value={selectedLineForDeploy}
                   onChange={e => setSelectedLineForDeploy(e.target.value)}
                   className="w-full border border-slate-200 rounded-md p-2 text-sm focus:border-blue-500 outline-none"
                 >
                   {lines.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                 </select>
               </div>
               
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                 <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                   <p className="font-bold">产线配置互斥规则 (Mutual Exclusion Rule)</p>
                   <p>为确保生产逻辑的一致性，同一条产线在同一时间内，<span className="font-bold">仅能生效一种工艺，或追踪一个特定产品型号</span>。</p>
                   {(() => {
                     const tl = lines.find((l: any) => l.id === selectedLineForDeploy);
                     if (activeTab === 'process' && tl?.activeProduct) {
                       return <p className="text-rose-600 font-bold mt-2 bg-rose-50 p-1.5 border border-rose-100 rounded">警告：该产线当前正追踪产品 (ID: {tl.activeProduct})。应用新工艺将清除该产品追踪状态！</p>;
                     }
                     if (activeTab === 'product' && tl?.activeProcess) {
                       return <p className="text-rose-600 font-bold mt-2 bg-rose-50 p-1.5 border border-rose-100 rounded">警告：该产线当前正应用工艺 (ID: {tl.activeProcess})。下发新产品配置将覆盖该工艺状态！</p>;
                     }
                     return null;
                   })()}
                 </div>
               </div>
               
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setDeployModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">取消</button>
              <button onClick={executeDeploy} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4"/> 确认替换并下发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建模态框 */}
      {addModalState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {addModalState.type === 'process' ? '新建工艺模型' : '新建产品目录'}
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {addModalState.type === 'process' ? '工艺名称 *' : '产品 SKU *'}
              </label>
              <input 
                type="text" 
                autoFocus
                value={addModalState.name}
                onChange={e => setAddModalState({ ...addModalState, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && executeAdd()}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder={addModalState.type === 'process' ? '例如: 无铅回流焊 A' : '例如: SKU-1000'}
              />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setAddModalState({ isOpen: false, type: 'process', name: '' })}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={executeAdd}
                disabled={!addModalState.name.trim()}
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
