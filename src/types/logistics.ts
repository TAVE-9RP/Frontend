export type LogisticsStatus = 'ASSIGNED' | 'REJECT' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type ItemProcessingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface LogisticsSummary {
  logisticsId: number;
  projectNumber: string;
  logisticsTitle: string;
  customer?: string;
  requestedAt?: string;
  assigneeSummary?: string;
  logisticsStatus: LogisticsStatus;

  logisticsAssignees?: string[];
  logisticsRequestedAt?: string;
}

export interface LogisticsDetail {
  projectNumber: string;
  logisticsAssignees: string[];
  logisticsTitle: string | null;
  logisticsDescription: string | null;
  logisticsCarrier: string | null;
  logisticsCarrierCompany: string | null;
  logisticsRequestedAt: string | null;
  logisticsStatus: string;
  items?: OutboundItem[];
}

export interface OutboundItem {
  logisticsItemId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  itemPrice: number;
  targetedQuantity: number;
  processedQuantity: number;
  tempProcessedQuantity?: number;
  itemTotalPrice: number;
  logisticsProcessingStatus: ItemProcessingStatus;
}

export interface AddOutboundItemsRequest {
  itemIds: number[];
}

export interface ProcessOutboundRequest {
  items: {
    logisticsItemId: number;
    processedQuantity: number;
  }[];
}

export interface UpdateLogisticsCommonRequest {
  logisticsTitle: string;
  logisticsCarrier: string;
  logisticsCarrierCompany: string;
  logisticsDescription: string;
}

export interface UpdateTargetQuantityRequest {
  items: {
    logisticsItemId: number;
    targetQuantity: number;
  }[];
}

export interface ApiResponse<T> {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: T;
}

export interface KpiDashboard {
  companyId: number;
  snapshotDate: string;
  safetyStockRate: number;
  shipmentLeadTimeAvg: number;
  shipmentCompletionRate: number;
  projectCompletionRate: number;
  longTermTaskRate: number;
  turnOverRate: number;
  predShipmentLeadTime: number;
  predTurnOverRate: number;
  totalTaskCount: number;
  logisticsTaskCount: number;
  inventoryTaskCount: number;
  totalDelayedCount: number;
  logisticsDelayedCount: number;
  inventoryDelayedCount: number;
}
