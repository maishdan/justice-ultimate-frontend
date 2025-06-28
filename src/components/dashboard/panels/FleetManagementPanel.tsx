import React from 'react';
import { Card, CardContent } from '../../ui/card';

export default function FleetManagementPanel() {
  return (
    <Card className="p-4 shadow-xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Fleet Management</h2>
        <ul className="space-y-2">
          <li>✅ Vehicle Tracker</li>
          <li>🧾 Maintenance Logs</li>
          <li>🚐 Fuel Usage</li>
          <li>📅 Service Reminders</li>
          <li>📍 GPS Live Map Integration</li>
        </ul>
      </CardContent>
    </Card>
  );
}
