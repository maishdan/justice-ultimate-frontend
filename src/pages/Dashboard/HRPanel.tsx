import React from 'react';
// Update the import path below if the file is located elsewhere
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { EmployeeList } from '../../components/dashboard/hr/EmployeeList';
import PayrollManager from '../../components/dashboard/hr/PayrollManager';
import LeaveManager from '../../components/dashboard/hr/LeaveManager';

export default function HRPanel() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Human Resource Panel</h2>
        <Tabs>
          <TabsList>
            <TabsTrigger label="Employees" selected={true} onClick={() => {}} />
            <TabsTrigger label="Payroll" selected={false} onClick={() => {}} />
            <TabsTrigger label="Leave Management" selected={false} onClick={() => {}} />
          </TabsList>

          <TabsContent>
            <EmployeeList />
          </TabsContent>

          <TabsContent>
            <PayrollManager />
          </TabsContent>

          <TabsContent>
            <LeaveManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}