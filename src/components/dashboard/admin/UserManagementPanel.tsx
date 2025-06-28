// 📁 src/components/dashboard/admin/UserManagementPanel.tsx

import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
// Update the import path below to the correct relative path if the file exists, for example:
import { Table, TableHeader, TableRow, TableCell } from '../../ui/table';
// Or create the file at src/components/ui/table.tsx if it does not exist.
// Update the import path below to the correct relative path if the file exists, for example:
import { Switch } from '../../ui/switch';
// Or create the file at src/components/ui/switch.tsx if it does not exist.
import { Select, SelectItem } from '../../ui/select';

export default function UserManagementPanel() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">User Management Panel</h2>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <Input placeholder="Search by name, email, phone" />
          <Select>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </Select>
          <Select>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </Select>
        </div>

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>2FA</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          {/* Map actual data here */}
          <tbody>
            <TableRow>
              <TableCell><img src="/avatar.png" alt="User" className="h-8 w-8 rounded-full" /></TableCell>
              <TableCell>Admin Justice</TableCell>
              <TableCell>admin@test.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell><span className="text-green-500">Active</span></TableCell>
              <TableCell><Switch checked={true} onChange={() => {}} /></TableCell>
              <TableCell><Button size="sm">Impersonate</Button></TableCell>
            </TableRow>
          </tbody>
        </Table>

        {/* Add/Edit User Form - Example Only */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold">Add New User</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Email" />
            <Select>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </Select>
            <Input placeholder="Phone Number" />
            <Input type="password" placeholder="Password" />
            <Button className="col-span-1 md:col-span-2">Save</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}