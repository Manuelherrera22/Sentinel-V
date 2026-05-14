import { get, set, update } from 'idb-keyval';

const SCANS_KEY = 'offline_scans';

export interface OfflineScan {
  token: string;
  timestamp: number;
  synced: boolean;
}

export async function saveScanOffline(token: string) {
  await update(SCANS_KEY, (val) => {
    const scans: OfflineScan[] = val || [];
    return [...scans, { token, timestamp: Date.now(), synced: false }];
  });
}

export async function getPendingOfflineScans() {
  const scans: OfflineScan[] = await get(SCANS_KEY) || [];
  return scans.filter(s => !s.synced);
}

export async function markScansAsSynced(timestamps: number[]) {
  await update(SCANS_KEY, (val) => {
    const scans: OfflineScan[] = val || [];
    return scans.map(s => 
      timestamps.includes(s.timestamp) ? { ...s, synced: true } : s
    );
  });
}
