export type ResourceStatus = 'ONLINE' | 'OFFLINE' | 'ALARM' | 'MAINTENANCE';

export type DeviceCategory = 
  | 'SOLDERING_STATION'   // 无铅焊台
  | 'REWORK_STATION'      // 拆焊返修台
  | 'FUME_EXTRACTOR'      // 烟雾净化
  | 'ION_FAN'             // 离子风机
  | 'THERMOMETER'         // 测温仪
  | 'ANTI_STATIC_WRIST';  // 静电腕带

// 区域：支持无限层级（建议<=3），下级只能建子区域或工位（不可混用）
export interface Region {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  childRule: 'SUB_REGION' | 'WORKSTATION' | 'UNASSIGNED'; 
}

// 工位：归属于区域，是绑定设备和员工的最小物理单元，可被产线引用
export interface Workstation {
  id: string;
  name: string;
  regionId: string;
  deviceIds: string[];
  employeeIds: string[];
}

// 产线：由多个工位组合而成，可分配产线管理员，并配置工艺或产品用于实时评估
export interface ProductionLine {
  id: string;
  name: string;
  workstationIds: string[];
  adminIds: string[];
  activeProcessId?: string;
  activeProductId?: string;
  status: 'RUNNING' | 'STOPPED' | 'IDLE';
}

// 设备：通过 MQTT 接入平台，被分配到工位，负责上报数据和接收控制指令
export interface Device {
  id: string;
  sn: string; // 序列号
  name: string;
  category: DeviceCategory;
  workstationId?: string; // 绑定到具体的工位
  mqttTopicSub: string;
  mqttTopicPub: string;
  status: ResourceStatus;
  lastActive: string;
}

// 员工：绑定在工位上
export interface Employee {
  id: string;
  name: string;
  badgeNumber: string;
}

// 工艺：统一的参数配置模型
export interface Process {
  id: string;
  name: string;
  version: string;
  parameters: Record<string, any>; // 标准运行参数设定，如温度范围、风速等
}

// 产品：在工艺基础上增加了条码识别码，以便扫码快速匹配
export interface Product extends Process {
  barcode: string; // 扫码匹配识别码
  sku: string;
}

// 运行数据：设备上报的实时监控信息沉淀
export interface OperationData {
  id: string;
  deviceId: string;
  workstationId: string;
  productId?: string;
  timestamp: string;
  telemetry: Record<string, number | string | boolean>;
  isAlarm: boolean;
  alarmDetail?: string; // 如果超出了工艺(Process)定义的参数范围
}
