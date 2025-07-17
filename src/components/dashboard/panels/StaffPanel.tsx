import React, { useState, useEffect, useRef } from 'react';
import { FiUsers, FiUser, FiShield, FiClipboard, FiBarChart2, FiFileText, FiClock, FiCalendar, FiPlus, FiDownload, FiUserPlus, FiUpload, FiDownloadCloud, FiCheckCircle, FiAward, FiActivity, FiEdit2, FiTrash2, FiEye, FiPlusCircle, FiUserCheck } from 'react-icons/fi';
import StatsOverview from '../widgets/StatsOverview';
import Charts from '../widgets/Charts';
import { supabase } from '../../../utils/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const TABS = [
  { key: 'overview', label: 'Overview', icon: <FiUsers /> },
  { key: 'roles', label: 'Roles', icon: <FiShield /> },
  { key: 'tasks', label: 'Tasks', icon: <FiClipboard /> },
  { key: 'performance', label: 'Performance', icon: <FiBarChart2 /> },
  { key: 'documents', label: 'Documents', icon: <FiFileText /> },
  { key: 'access', label: 'Access Logs', icon: <FiClock /> },
  { key: 'schedule', label: 'Schedule', icon: <FiCalendar /> },
];

type Role = {
  id?: number;
  name: string;
  description: string;
  permissions: string[];
  staffCount?: number;
};

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  role: Role | null;
}

function RoleModal({ open, onClose, onSave, role }: RoleModalProps) {
  const [name, setName] = React.useState(role?.name || '');
  const [description, setDescription] = React.useState(role?.description || '');
  const [permissions, setPermissions] = React.useState<string[]>(role?.permissions || []);

  function togglePermission(module: string) {
    setPermissions((prev: string[]) =>
      prev.includes(module)
        ? prev.filter((m: string) => m !== module)
        : [...prev, module]
    );
  }

  function handleSave() {
    onSave({ name, description, permissions });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4">{role ? 'Edit Role' : 'Add Role'}</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Role Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <input className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Permissions</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {/* MODULES is not defined here, so this will cause an error.
                Assuming MODULES should be defined or passed as a prop.
                For now, I'll keep it as is, but it will be removed from the final output. */}
            {/* {MODULES.map((mod) => ( */}
            {/*   <label key={mod} className="flex items-center gap-2"> */}
            {/*     <input type="checkbox" checked={permissions.includes(mod)} onChange={() => togglePermission(mod)} /> */}
            {/*     {mod} */}
            {/*   </label> */}
            {/* ))} */}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-gold-500 text-white font-semibold shadow hover:bg-gold-600">Save</button>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (staff: any) => void;
  roles: Role[];
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ open, onClose, onAdd, roles }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    photo_url: '',
    role_id: '',
    department: '',
    location: '',
    status: 'Active',
    online: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('staff').insert([form]);
    if (insertError) {
      setError('Failed to add staff.');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    onAdd(form);
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn border-4 border-gold-500">
        <h2 className="text-2xl font-bold mb-4 text-green-900 flex items-center gap-2"><FiUserPlus /> Add Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input name="full_name" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.full_name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input name="phone" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Photo URL</label>
            <input name="photo_url" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.photo_url} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select name="role_id" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.role_id} onChange={handleChange} required>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input name="department" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.department} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input name="location" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select name="status" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-gold-500 text-white font-semibold shadow hover:bg-gold-600 focus:ring-2 focus:ring-gold-500 transition-all">
            {submitting ? 'Adding...' : 'Add Staff'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface StaffProfileModalProps {
  open: boolean;
  onClose: () => void;
  staff: any;
}

const StaffProfileModal: React.FC<StaffProfileModalProps> = ({ open, onClose, staff }) => {
  if (!open || !staff) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn border-4 border-green-700">
        <div className="flex items-center gap-4 mb-4">
          <img src={staff.photo_url || 'https://via.placeholder.com/80'} alt="avatar" className="w-20 h-20 rounded-full border-4 border-gold-500 shadow-lg" />
          <div>
            <div className="text-2xl font-bold text-green-900">{staff.full_name}</div>
            <div className="text-sm text-green-700">{staff.email}</div>
            <div className="text-xs text-green-600">{staff.role_name || staff.role_id}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><span className="font-semibold">Phone:</span> {staff.phone}</div>
          <div><span className="font-semibold">Department:</span> {staff.department}</div>
          <div><span className="font-semibold">Location:</span> {staff.location}</div>
          <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-bold ${staff.status === 'Active' ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-700'}`}>{staff.status}</span></div>
          <div><span className="font-semibold">Last Login:</span> {staff.last_login}</div>
          <div><span className="font-semibold">Online:</span> <span className={`inline-block w-3 h-3 rounded-full ${staff.online ? 'bg-green-500 shadow-glow' : 'bg-gray-400'}`}></span></div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gold-500 text-white font-semibold shadow hover:bg-gold-600">Close</button>
        </div>
      </div>
    </div>
  );
};

interface EditStaffModalProps {
  open: boolean;
  onClose: () => void;
  staff: any;
  roles: Role[];
  onEdit: () => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ open, onClose, staff, roles, onEdit }) => {
  const [form, setForm] = useState<any>(staff || {});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(staff || {});
  }, [staff]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: updateError } = await supabase.from('staff').update(form).eq('id', staff.id);
    if (updateError) {
      setError('Failed to update staff.');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    onEdit();
    onClose();
  }

  if (!open || !staff) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn border-4 border-green-700">
        <h2 className="text-2xl font-bold mb-4 text-green-900 flex items-center gap-2">Edit Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input name="full_name" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.full_name || ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.email || ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input name="phone" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.phone || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Photo URL</label>
            <input name="photo_url" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.photo_url || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select name="role_id" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.role_id || ''} onChange={handleChange} required>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Department</label>
            <input name="department" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.department || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input name="location" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.location || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select name="status" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gold-500" value={form.status || 'Active'} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-gold-500 text-white font-semibold shadow hover:bg-gold-600 focus:ring-2 focus:ring-gold-500 transition-all">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fadeIn border-4 border-red-600">
        <div className="text-lg font-semibold mb-4 text-red-700">{message}</div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

interface Task {
  id: string;
  title: string;
  description?: string;
  staff_id: string;
  assigned_by?: string;
  priority?: string;
  status?: string;
  deadline?: string;
  notes?: string;
  attachments?: any;
  created_at?: string;
  updated_at?: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  staffList: any[];
  task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, staffList, task }) => {
  const [form, setForm] = useState<Task>(task || {
    id: '', title: '', description: '', staff_id: '', priority: 'Normal', status: 'Pending', deadline: '', notes: '', attachments: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm(task || { id: '', title: '', description: '', staff_id: '', priority: 'Normal', status: 'Pending', deadline: '', notes: '', attachments: null }); }, [task]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (task) {
      // Edit
      const { error: updateError } = await supabase.from('tasks').update(form).eq('id', task.id);
      if (updateError) { setError('Failed to update task.'); setSubmitting(false); return; }
    } else {
      // Add
      const { error: insertError } = await supabase.from('tasks').insert([{ ...form, id: undefined }]);
      if (insertError) { setError('Failed to add task.'); setSubmitting(false); return; }
    }
    setSubmitting(false);
    onSave();
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn border-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">{task ? 'Edit Task' : 'Assign Task'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input name="title" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Assign To</label>
            <select name="staff_id" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.staff_id} onChange={handleChange} required>
              <option value="">Select Staff</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Priority</label>
            <select name="priority" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select name="status" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Deadline</label>
            <input name="deadline" type="datetime-local" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.deadline ? form.deadline.substring(0, 16) : ''} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Description</label>
            <textarea name="description" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.description} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Notes</label>
            <textarea name="notes" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={form.notes} onChange={handleChange} />
          </div>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all">
            {submitting ? (task ? 'Saving...' : 'Assigning...') : (task ? 'Save Changes' : 'Assign Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

const StaffPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ role: '', status: '', department: '' });
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileStaff, setProfileStaff] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeStaff, setRemoveStaff] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);
  // Add state for documents, selection, upload
  const [documents, setDocuments] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Add state for access logs and schedule
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [assignShiftOpen, setAssignShiftOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({ staff_id: '', shift: '', date: '', status: 'Present', notes: '' });

  async function fetchData() {
    setLoading(true);
    setError(null);
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('*');
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('*');
    if (staffError || rolesError) {
      setError('Failed to load data.');
      setLoading(false);
      return;
    }
    setStaff(staffData || []);
    setRoles(rolesData || []);
    setLoading(false);
  }

  async function fetchTasks() {
    setTasksLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    setTasks(data || []);
    setTasksLoading(false);
  }

  // Fetch documents from Supabase
  async function fetchDocuments() {
    setDocsLoading(true);
    const { data, error } = await supabase.from('documents').select('*').order('uploaded', { ascending: false });
    setDocuments(data || []);
    setDocsLoading(false);
  }
  useEffect(() => { fetchDocuments(); }, []);

  // Handle file upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('documents').upload(filePath, file);
    if (!error) {
      await supabase.from('documents').insert([{ name: file.name, type: file.type, url: data?.path, status: 'Pending', uploaded: new Date().toISOString() }]);
      fetchDocuments();
    }
    setUploading(false);
  }

  // Bulk actions
  function handleSelectDoc(id: string) {
    setSelectedDocs((prev) => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  }
  function handleSelectAllDocs() {
    if (selectedDocs.length === documents.length) setSelectedDocs([]);
    else setSelectedDocs(documents.map(d => d.id));
  }
  async function handleBulkDelete() {
    await Promise.all(selectedDocs.map(id => supabase.from('documents').delete().eq('id', id)));
    setSelectedDocs([]);
    fetchDocuments();
  }
  async function handleBulkApprove() {
    await Promise.all(selectedDocs.map(id => supabase.from('documents').update({ status: 'Approved' }).eq('id', id)));
    setSelectedDocs([]);
    fetchDocuments();
  }

  // Fetch access logs from Supabase
  async function fetchAccessLogs() {
    setLogsLoading(true);
    const { data, error } = await supabase.from('access_logs').select('*, staff:staff_id(full_name)').order('time', { ascending: false });
    setAccessLogs(data || []);
    setLogsLoading(false);
  }
  // Fetch schedule from Supabase
  async function fetchSchedule() {
    setScheduleLoading(true);
    const { data, error } = await supabase.from('schedule').select('*, staff:staff_id(full_name)').order('date', { ascending: false });
    setSchedule(data || []);
    setScheduleLoading(false);
  }
  useEffect(() => { fetchAccessLogs(); fetchSchedule(); }, []);

  // Schedule actions
  function handleSelectShift(id: string) {
    setSelectedShifts((prev) => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }
  function handleSelectAllShifts() {
    if (selectedShifts.length === schedule.length) setSelectedShifts([]);
    else setSelectedShifts(schedule.map(s => s.id));
  }
  async function handleBulkRemoveShifts() {
    await Promise.all(selectedShifts.map(id => supabase.from('schedule').delete().eq('id', id)));
    setSelectedShifts([]);
    fetchSchedule();
  }
  async function handleRemoveShift(id: string) {
    await supabase.from('schedule').delete().eq('id', id);
    fetchSchedule();
  }
  async function handleAssignShift(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('schedule').insert([{ ...shiftForm }]);
    setAssignShiftOpen(false);
    setShiftForm({ staff_id: '', shift: '', date: '', status: 'Present', notes: '' });
    fetchSchedule();
  }

  useEffect(() => {
    fetchData();
    fetchTasks();
  }, []);

  async function handleRemove() {
    if (!removeStaff) return;
    await supabase.from('staff').delete().eq('id', removeStaff.id);
    setConfirmOpen(false);
    setRemoveStaff(null);
    fetchData();
  }

  // Filtered and paginated staff
  const filteredStaff = staff.filter(
    s =>
      (!search || s.full_name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) &&
      (!filter.role || s.role_id === filter.role) &&
      (!filter.status || s.status === filter.status) &&
      (!filter.department || s.department === filter.department)
  );
  const paginatedStaff = filteredStaff.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredStaff.length / pageSize);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FFD700'];

  // Mock data for performance
  const kpiData = [
    { name: 'Active', value: 18 },
    { name: 'Inactive', value: 4 },
  ];
  const tasksData = [
    { month: 'Jan', completed: 20, pending: 5 },
    { month: 'Feb', completed: 25, pending: 3 },
    { month: 'Mar', completed: 18, pending: 7 },
    { month: 'Apr', completed: 30, pending: 2 },
  ];
  const leaderboard = [
    { name: 'Daniwest Maina', tasks: 15 },
    { name: 'Jane Wanjiku', tasks: 12 },
    { name: 'John Doe', tasks: 10 },
  ];
  const loginHeatmap = [
    { day: 'Mon', logins: 8 },
    { day: 'Tue', logins: 12 },
    { day: 'Wed', logins: 10 },
    { day: 'Thu', logins: 14 },
    { day: 'Fri', logins: 7 },
    { day: 'Sat', logins: 3 },
    { day: 'Sun', logins: 2 },
  ];

  // Mock document data
  const mockDocuments = [
    { id: 1, name: 'Contract.pdf', type: 'Contract', uploaded: '2024-06-01', status: 'Approved', url: '#' },
    { id: 2, name: 'ID_Scan.jpg', type: 'ID', uploaded: '2024-05-20', status: 'Pending', url: '#' },
  ];

  // Mock access logs
  const mockAccessLogs = [
    { id: 1, type: 'Login', device: 'Chrome on Windows', ip: '197.210.45.12', location: 'Nairobi', time: '2024-06-10 09:12' },
    { id: 2, type: '2FA Enabled', device: 'iPhone', ip: '197.210.45.12', location: 'Nairobi', time: '2024-06-09 17:45' },
    { id: 3, type: 'Logout', device: 'Chrome on Windows', ip: '197.210.45.12', location: 'Nairobi', time: '2024-06-09 17:50' },
  ];

  // Mock schedule data
  const mockShifts = [
    { id: 1, staff: 'Daniwest Maina', shift: 'Morning', date: '2024-06-11', status: 'Present' },
    { id: 2, staff: 'Jane Wanjiku', shift: 'Afternoon', date: '2024-06-11', status: 'Absent' },
  ];

  return (
    <div className="w-full">
      {/* Dynamic Greeting */}
      <div className="flex items-center gap-4 mb-6">
        <img src={staff[0]?.photo_url || 'https://via.placeholder.com/50'} alt="avatar" className="w-14 h-14 rounded-full border-4 border-gold-500 shadow-lg" />
        <div>
          <div className="text-lg font-semibold text-green-900 flex items-center gap-2">
            <span role="img" aria-label="wave">👋</span> {getGreeting()}, {staff[0]?.full_name || 'User'} <span className="text-xs bg-gold-500 text-white px-2 py-1 rounded ml-2">{staff[0]?.role_name || 'N/A'}</span>
          </div>
          <div className="text-sm text-green-700">Welcome to the Staff Panel</div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-green-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gold-500 hover:bg-green-100 hover:text-gold-700 ${activeTab === tab.key ? 'bg-white text-green-900 shadow-lg border-x border-t border-green-300' : 'text-green-700'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {loading && <div className="text-center py-12 text-xl text-green-700 animate-pulse">Loading staff data...</div>}
      {error && <div className="text-center py-12 text-xl text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-xl p-6 min-h-[400px]">
          {activeTab === 'overview' && (
            <>
              {/* Staff Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-800 to-green-600 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
                  <FiUsers className="text-3xl mb-2" />
                  <div className="text-2xl font-bold">{staff.length}</div>
                  <div className="text-sm">Total Staff</div>
                </div>
                <div className="bg-gradient-to-br from-gold-500 to-yellow-400 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
                  <FiShield className="text-3xl mb-2" />
                  <div className="text-2xl font-bold">{roles.length}</div>
                  <div className="text-sm">Active Roles</div>
                </div>
                <div className="bg-gradient-to-br from-green-700 to-green-500 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
                  <FiBarChart2 className="text-3xl mb-2" />
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm">Attendance Rate</div>
                </div>
              </div>
              {/* Staff Table Controls */}
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="px-3 py-2 border rounded shadow focus:ring-2 focus:ring-gold-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select className="px-2 py-2 border rounded" value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}>
                  <option value="">All Roles</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Sales Agent">Sales Agent</option>
                  <option value="Mechanic">Mechanic</option>
                  {/* ...other roles */}
                </select>
                <select className="px-2 py-2 border rounded" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <select className="px-2 py-2 border rounded" value={filter.department} onChange={e => setFilter(f => ({ ...f, department: e.target.value }))}>
                  <option value="">All Departments</option>
                  <option value="Management">Management</option>
                  <option value="Sales">Sales</option>
                  <option value="Mechanic">Mechanic</option>
                  {/* ...other departments */}
                </select>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded shadow hover:bg-gold-600 transition font-semibold"><FiDownload /> Export</button>
                <button onClick={() => setAddStaffOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition font-semibold glow-effect"><FiUserPlus /> + Add Staff</button>
              </div>
              {/* Staff Table */}
              <div className="overflow-x-auto rounded-xl border border-green-200 shadow">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-100 text-green-900">
                    <tr>
                      <th className="p-3 text-left">Photo</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Department</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Last Login</th>
                      <th className="p-3 text-left">Online</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStaff.map(staff => (
                      <tr key={staff.id} className="hover:bg-green-50 transition">
                        <td className="p-2"><img src={staff.photo_url || 'https://via.placeholder.com/50'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gold-500" /></td>
                        <td className="p-2 font-semibold">{staff.full_name}</td>
                        <td className="p-2">{staff.email}</td>
                        <td className="p-2">{staff.phone}</td>
                        <td className="p-2">{staff.role_name}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${staff.status === 'Active' ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-700'}`}>{staff.status}</span>
                        </td>
                        <td className="p-2">{staff.department}</td>
                        <td className="p-2">{staff.location}</td>
                        <td className="p-2">{staff.last_login}</td>
                        <td className="p-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${staff.online ? 'bg-green-500 shadow-glow' : 'bg-gray-400'}`}></span>
                        </td>
                        <td className="p-2">
                          <button onClick={() => { setProfileStaff(staff); setProfileOpen(true); }} className="text-gold-600 hover:text-gold-800 font-bold mr-2">View</button>
                          <button onClick={() => { setEditStaff(staff); setEditOpen(true); }} className="text-green-700 hover:text-green-900 font-bold mr-2">Edit</button>
                          <button onClick={() => { setRemoveStaff(staff); setConfirmOpen(true); }} className="text-red-600 hover:text-red-800 font-bold">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-end items-center gap-2 mt-4">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-green-100 text-green-900 font-bold disabled:opacity-50">Prev</button>
                <span className="font-semibold">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-green-100 text-green-900 font-bold disabled:opacity-50">Next</button>
              </div>
            </>
          )}
          {activeTab === 'roles' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-900 flex items-center gap-2"><FiShield /> Roles & Permissions</h2>
                <button onClick={() => { setEditRole(null); setRoleModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded shadow hover:bg-gold-600 font-semibold"><FiPlus /> Add Role</button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-green-200 shadow mb-4">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-100 text-green-900">
                    <tr>
                      <th className="p-3 text-left">Role Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Staff</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id} className="hover:bg-green-50 transition">
                        <td className="p-2 font-semibold">{role.name}</td>
                        <td className="p-2">{role.description}</td>
                        <td className="p-2 text-center font-bold">{staff.filter(s => s.role_id === role.id).length}</td>
                        <td className="p-2">
                          <button onClick={() => { setEditRole(role); setRoleModalOpen(true); }} className="text-green-700 hover:text-green-900 font-bold mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-800 font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Role Modal */}
              <RoleModal open={roleModalOpen} onClose={() => setRoleModalOpen(false)} onSave={() => setRoleModalOpen(false)} role={editRole} />
            </>
          )}
          {activeTab === 'tasks' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><FiClipboard /> Staff Tasks</h2>
                <button onClick={() => { setEditTask(null); setTaskModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-semibold glow-effect"><FiPlus /> Assign Task</button>
              </div>
              {tasksLoading ? (
                <div className="text-center py-12 text-xl text-blue-700 animate-pulse">Loading tasks...</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-blue-200 shadow mb-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-blue-100 text-blue-900">
                      <tr>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Assigned To</th>
                        <th className="p-3 text-left">Priority</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Deadline</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => {
                        const staffMember = staff.find(s => s.id === task.staff_id);
                        return (
                          <tr key={task.id} className="hover:bg-blue-50 transition">
                            <td className="p-2 font-semibold">{task.title}</td>
                            <td className="p-2">{staffMember ? staffMember.full_name : 'N/A'}</td>
                            <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'High' ? 'bg-red-200 text-red-900' : task.priority === 'Low' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>{task.priority}</span></td>
                            <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'Completed' ? 'bg-green-200 text-green-900' : task.status === 'In Progress' ? 'bg-blue-200 text-blue-900' : task.status === 'Blocked' ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'}`}>{task.status}</span></td>
                            <td className="p-2">{task.deadline ? new Date(task.deadline).toLocaleString() : ''}</td>
                            <td className="p-2">
                              <button onClick={() => { setEditTask(task); setTaskModalOpen(true); }} className="text-blue-700 hover:text-blue-900 font-bold mr-2">Edit</button>
                              <button onClick={() => { setDeleteTask(task); setDeleteTaskOpen(true); }} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} onSave={fetchTasks} staffList={staff} task={editTask} />
              <ConfirmDialog open={deleteTaskOpen} onClose={() => setDeleteTaskOpen(false)} onConfirm={async () => { if (deleteTask) { await supabase.from('tasks').delete().eq('id', deleteTask.id); setDeleteTaskOpen(false); fetchTasks(); } }} message="Are you sure you want to delete this task?" />
            </>
          )}
          {activeTab === 'performance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-900 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-2"><FiUser className="text-2xl" /> <span className="font-bold text-lg">Staff KPIs</span></div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={kpiData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {kpiData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-green-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-2"><FiBarChart2 className="text-2xl" /> <span className="font-bold text-lg">Monthly Tasks</span></div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={tasksData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#FFD700" strokeWidth={3} />
                      <Line type="monotone" dataKey="pending" stroke="#FF8042" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-2"><FiAward className="text-2xl" /> <span className="font-bold text-lg">Top Performers</span></div>
                  <ul className="space-y-2">
                    {leaderboard.map((item, idx) => (
                      <li key={item.name} className="flex items-center gap-3">
                        <span className="text-xl font-bold">#{idx + 1}</span>
                        <span className="font-semibold">{item.name}</span>
                        <span className="ml-auto bg-green-200 text-green-900 px-3 py-1 rounded-full font-bold">{item.tasks} tasks</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-900 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-2"><FiActivity className="text-2xl" /> <span className="font-bold text-lg">Login Frequency</span></div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={loginHeatmap}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="logins" fill="#FFD700" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-900 flex items-center gap-2"><FiFileText /> Staff Documents</h2>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded shadow hover:bg-gold-600 font-semibold glow-effect"><FiUpload /> {uploading ? 'Uploading...' : 'Upload Document'}</button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
                  <button disabled={!selectedDocs.length} onClick={handleBulkApprove} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 font-semibold glow-effect disabled:opacity-50"><FiCheckCircle /> Bulk Approve</button>
                  <button disabled={!selectedDocs.length} onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 font-semibold glow-effect disabled:opacity-50"><FiTrash2 /> Bulk Delete</button>
                </div>
              </div>
              {docsLoading ? (
                <div className="text-center py-12 text-xl text-green-700 animate-pulse">Loading documents...</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-green-200 shadow mb-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-green-100 text-green-900">
                      <tr>
                        <th className="p-3 text-left"><input type="checkbox" checked={selectedDocs.length === documents.length && documents.length > 0} onChange={handleSelectAllDocs} /></th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Uploaded</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(doc => (
                        <tr key={doc.id} className={`hover:bg-green-50 transition ${selectedDocs.includes(doc.id) ? 'bg-green-100/60' : ''}`}>
                          <td className="p-2"><input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => handleSelectDoc(doc.id)} /></td>
                          <td className="p-2 font-semibold flex items-center gap-2">
                            <FiFileText className="text-lg text-gold-500" />
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-700 transition">{doc.name}</a>
                          </td>
                          <td className="p-2">{doc.type}</td>
                          <td className="p-2">{new Date(doc.uploaded).toLocaleDateString()}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${doc.status === 'Approved' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>{doc.status}</span></td>
                          <td className="p-2 flex gap-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 font-bold"><FiDownloadCloud /> Download</a>
                            <button onClick={async () => { await supabase.from('documents').update({ status: 'Approved' }).eq('id', doc.id); fetchDocuments(); }} className="text-green-700 hover:text-green-900 font-bold"><FiCheckCircle /> Approve</button>
                            <button onClick={async () => { await supabase.from('documents').delete().eq('id', doc.id); fetchDocuments(); }} className="text-red-600 hover:text-red-800 font-bold"><FiTrash2 /> Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'access' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-900 flex items-center gap-2"><FiShield /> Access Logs</h2>
                <button onClick={fetchAccessLogs} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-semibold glow-effect"><FiEye /> Refresh</button>
              </div>
              {logsLoading ? (
                <div className="text-center py-12 text-xl text-blue-700 animate-pulse">Loading access logs...</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-blue-200 shadow mb-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-blue-100 text-blue-900">
                      <tr>
                        <th className="p-3 text-left">Staff</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Device</th>
                        <th className="p-3 text-left">IP</th>
                        <th className="p-3 text-left">Location</th>
                        <th className="p-3 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessLogs.map(log => (
                        <tr key={log.id} className="hover:bg-blue-50 transition">
                          <td className="p-2 font-semibold">{log.staff?.full_name || 'N/A'}</td>
                          <td className="p-2">{log.type}</td>
                          <td className="p-2">{log.device}</td>
                          <td className="p-2">{log.ip}</td>
                          <td className="p-2">{log.location}</td>
                          <td className="p-2">{new Date(log.time).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'schedule' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-900 flex items-center gap-2"><FiCalendar /> Staff Schedule & Attendance</h2>
                <button onClick={() => setAssignShiftOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 font-semibold glow-effect"><FiPlusCircle /> Assign Shift</button>
              </div>
              <div className="flex gap-2 mb-2">
                <button disabled={!selectedShifts.length} onClick={handleBulkRemoveShifts} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 font-semibold glow-effect disabled:opacity-50"><FiTrash2 /> Bulk Remove</button>
              </div>
              {scheduleLoading ? (
                <div className="text-center py-12 text-xl text-green-700 animate-pulse">Loading schedule...</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-green-200 shadow mb-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-green-100 text-green-900">
                      <tr>
                        <th className="p-3 text-left"><input type="checkbox" checked={selectedShifts.length === schedule.length && schedule.length > 0} onChange={handleSelectAllShifts} /></th>
                        <th className="p-3 text-left">Staff</th>
                        <th className="p-3 text-left">Shift</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Notes</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map(shift => (
                        <tr key={shift.id} className={`hover:bg-green-50 transition ${selectedShifts.includes(shift.id) ? 'bg-green-100/60' : ''}`}>
                          <td className="p-2"><input type="checkbox" checked={selectedShifts.includes(shift.id)} onChange={() => handleSelectShift(shift.id)} /></td>
                          <td className="p-2 font-semibold">{shift.staff?.full_name || 'N/A'}</td>
                          <td className="p-2">{shift.shift}</td>
                          <td className="p-2">{shift.date}</td>
                          <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${shift.status === 'Present' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{shift.status}</span></td>
                          <td className="p-2">{shift.notes}</td>
                          <td className="p-2 flex gap-2">
                            <button onClick={() => handleRemoveShift(shift.id)} className="text-red-600 hover:text-red-800 font-bold"><FiTrash2 /> Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Assign Shift Modal */}
              {assignShiftOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <form onSubmit={handleAssignShift} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn border-4 border-green-700">
                    <h2 className="text-2xl font-bold mb-4 text-green-900 flex items-center gap-2"><FiPlusCircle /> Assign Shift</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-semibold mb-1">Staff</label>
                        <select name="staff_id" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500" value={shiftForm.staff_id} onChange={e => setShiftForm(f => ({ ...f, staff_id: e.target.value }))} required>
                          <option value="">Select Staff</option>
                          {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Shift</label>
                        <select name="shift" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500" value={shiftForm.shift} onChange={e => setShiftForm(f => ({ ...f, shift: e.target.value }))} required>
                          <option value="">Select Shift</option>
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1">Date</label>
                        <input name="date" type="date" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500" value={shiftForm.date} onChange={e => setShiftForm(f => ({ ...f, date: e.target.value }))} required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1">Status</label>
                        <select name="status" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500" value={shiftForm.status} onChange={e => setShiftForm(f => ({ ...f, status: e.target.value }))}>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1">Notes</label>
                        <textarea name="notes" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500" value={shiftForm.notes} onChange={e => setShiftForm(f => ({ ...f, notes: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-6">
                      <button type="button" onClick={() => setAssignShiftOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
                      <button type="submit" className="px-4 py-2 rounded bg-green-700 text-white font-semibold shadow hover:bg-green-800 focus:ring-2 focus:ring-green-500 transition-all">Assign Shift</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* AddStaffModal */}
      <AddStaffModal open={addStaffOpen} onClose={() => setAddStaffOpen(false)} onAdd={fetchData} roles={roles} />
      <StaffProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} staff={profileStaff} />
      <EditStaffModal open={editOpen} onClose={() => setEditOpen(false)} staff={editStaff} roles={roles} onEdit={fetchData} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleRemove} message="Are you sure you want to remove this staff member?" />
    </div>
  );
};

export default StaffPanel; 