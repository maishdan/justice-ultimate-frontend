import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaPlus, FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaUsers, FaDownload } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tooltip } from "../../components/ui/tooltip";

interface Role {
  id: number;
  name: string;
  permissions: string[];
  active: boolean;
  usersAssigned: number;
}

const initialRoles: Role[] = [
  { id: 1, name: "Admin", permissions: ["manage-users", "edit-roles", "view-logs"], active: true, usersAssigned: 5 },
  { id: 2, name: "Sales Agent", permissions: ["manage-orders", "view-catalogue"], active: true, usersAssigned: 10 },
  { id: 3, name: "Mechanic", permissions: ["view-vehicles", "schedule-servicing"], active: false, usersAssigned: 3 },
];

export default function RolesPanel() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [search, setSearch] = useState("");

  const toggleRole = (id: number) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === id ? { ...role, active: !role.active } : role
      )
    );
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
            <FaUserShield /> Manage User Roles
          </h1>
          <Button className="bg-green-500 hover:bg-green-400 text-white flex items-center gap-2">
            <FaPlus /> New Role
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex items-center gap-2">
            <FaSearch className="text-yellow-400" />
            <Input
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-blue-100 text-black"
            />
          </div>
          <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:text-black">
            <FaDownload /> Export Roles
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredRoles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              className="bg-blue-900 p-5 rounded-xl border border-yellow-500 shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-yellow-300">{role.name}</h2>
                <Tooltip text={role.active ? "Deactivate Role" : "Activate Role"}>
                  <button
                    onClick={() => toggleRole(role.id)}
                    className="text-2xl"
                  >
                    {role.active ? (
                      <FaToggleOn className="text-green-400" />
                    ) : (
                      <FaToggleOff className="text-red-400" />
                    )}
                  </button>
                </Tooltip>
              </div>

              <p className="text-sm text-gray-300 mt-2">
                Permissions: {role.permissions.join(", ")}
              </p>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FaUsers /> {role.usersAssigned} user(s) assigned
                </div>
                <div className="flex gap-3">
                  <Tooltip text="Edit Role">
                    <button className="text-blue-400 hover:text-yellow-300">
                      <FaEdit />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Role">
                    <button className="text-red-400 hover:text-yellow-300">
                      <FaTrash />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <p className="text-center mt-10 text-gray-400">No roles found matching your search.</p>
        )}
      </motion.div>
    </div>
  );
}
