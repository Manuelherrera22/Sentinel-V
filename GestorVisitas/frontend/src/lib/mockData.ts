// frontend/src/lib/mockData.ts
export const mockInmates = [
  { id: 'INM-001', name: 'Carlos Mendoza', block: 'Block A', securityLevel: 'Medium', visitors: ['VIS-101', 'VIS-102'] },
  { id: 'INM-002', name: 'Javier Ramirez', block: 'Block B', securityLevel: 'High', visitors: ['VIS-103'] },
  { id: 'INM-003', name: 'Roberto Diaz', block: 'Block C', securityLevel: 'Low', visitors: ['VIS-104', 'VIS-105', 'VIS-106'] },
];

export const mockVisitors = [
  { id: 'VIS-101', name: 'Ana Silva', relation: 'Spouse', document: '12345678-9', photo: 'https://i.pravatar.cc/150?img=5' },
  { id: 'VIS-102', name: 'Luis Mendoza', relation: 'Son', document: '98765432-1', photo: 'https://i.pravatar.cc/150?img=11' },
  { id: 'VIS-103', name: 'Carmen Rojas', relation: 'Mother', document: '56473829-0', photo: 'https://i.pravatar.cc/150?img=9' },
  { id: 'VIS-104', name: 'Miguel Diaz', relation: 'Brother', document: '10293847-5', photo: 'https://i.pravatar.cc/150?img=12' },
];

export const mockPendingRequests = [
  { id: 'REQ-001', visitorName: 'Sofia Castro', relation: 'Friend', targetInmate: 'Javier Ramirez', date: '2026-05-15', status: 'pending' },
  { id: 'REQ-002', visitorName: 'Pedro Vargas', relation: 'Father', targetInmate: 'Roberto Diaz', date: '2026-05-16', status: 'pending' },
];

export const mockRecentAccess = [
  { id: 1, visitor: 'Ana Silva', inmate: 'Carlos Mendoza', time: '14:32', type: 'entry', status: 'valid' },
  { id: 2, visitor: 'Unknown', inmate: 'N/A', time: '14:15', type: 'denied', status: 'invalid_token' },
  { id: 3, visitor: 'Carmen Rojas', inmate: 'Javier Ramirez', time: '13:50', type: 'exit', status: 'valid' },
  { id: 4, visitor: 'Luis Mendoza', inmate: 'Carlos Mendoza', time: '13:10', type: 'entry', status: 'valid' },
];
