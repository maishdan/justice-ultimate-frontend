// 📁 src/components/dashboard/admin/ReportsPanel.tsx

import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { BarChart, LineChart, PieChart } from '../widgets/Charts'; // Adjusted import path
import { Button } from '../../ui/button';
import { Select, SelectItem } from '../../ui/select';
// import { DateRangePicker } from '@/components/ui/date-range-picker'; // You can create or use third-party
import { DateRangePicker } from 'react-date-range'; // Example: using a third-party package
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function ReportsPanel() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Reports Panel</h2>

        <div className="flex flex-wrap gap-4">
          <DateRangePicker />
          <Select>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="nairobi">Nairobi</SelectItem>
            <SelectItem value="mombasa">Mombasa</SelectItem>
          </Select>
          <Button>Export PDF</Button>
          <Button variant="outline">Download CSV</Button>
        </div>

        <Tabs>
          <TabsList>
            <TabsTrigger label="Sales" selected={false} onClick={() => {}} />
            <TabsTrigger label="Revenue" selected={false} onClick={() => {}} />
            <TabsTrigger label="Vehicles" selected={false} onClick={() => {}} />
            <TabsTrigger label="Engagement" selected={false} onClick={() => {}} />
          </TabsList>

          <TabsContent>
  <h3 className="font-semibold mb-2">Sales Report</h3>
  <LineChart />
</TabsContent>

<TabsContent>
  <h3 className="font-semibold mb-2">Revenue Report</h3>
  <BarChart />
</TabsContent>

<TabsContent>
  <h3 className="font-semibold mb-2">Vehicle Performance</h3>
  <PieChart />
</TabsContent>

<TabsContent>
  <h3 className="font-semibold mb-2">User Engagement</h3>
  <LineChart />
</TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
