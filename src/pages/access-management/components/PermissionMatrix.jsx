import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PermissionMatrix = ({ permissions, roles, resources, onUpdatePermission }) => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [draggedItem, setDraggedItem] = useState(null);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...roles?.map(role => ({ value: role?.id, label: role?.name }))
  ];

  const resourceOptions = [
    { value: 'all', label: 'All Resources' },
    ...resources?.map(resource => ({ value: resource?.id, label: resource?.name }))
  ];

  const filteredPermissions = permissions?.filter(permission => {
    const roleMatch = selectedRole === 'all' || permission?.roleId === selectedRole;
    const resourceMatch = selectedResource === 'all' || permission?.resourceId === selectedResource;
    return roleMatch && resourceMatch;
  });

  const getPermissionLevel = (permission) => {
    if (permission?.read && permission?.write && permission?.delete) return 'full';
    if (permission?.read && permission?.write) return 'write';
    if (permission?.read) return 'read';
    return 'none';
  };

  const getPermissionColor = (level) => {
    switch (level) {
      case 'full': return 'bg-success text-success-foreground';
      case 'write': return 'bg-warning text-warning-foreground';
      case 'read': return 'bg-accent text-accent-foreground';
      case 'none': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handlePermissionChange = (permissionId, level) => {
    const updates = {
      read: level !== 'none',
      write: level === 'write' || level === 'full',
      delete: level === 'full'
    };
    onUpdatePermission(permissionId, updates);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e?.preventDefault();
    if (draggedItem && draggedItem?.id !== targetItem?.id) {
      // Handle role/resource reordering logic here
      console.log('Reordering:', draggedItem, 'to', targetItem);
    }
    setDraggedItem(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Permission Matrix</h3>
            <p className="text-sm text-muted-foreground">Manage role-based access controls</p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export Matrix
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Filter by Role"
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
          />
          <Select
            label="Filter by Resource"
            options={resourceOptions}
            value={selectedResource}
            onChange={setSelectedResource}
          />
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Resource</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Permission Level</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions?.map((permission) => {
                const role = roles?.find(r => r?.id === permission?.roleId);
                const resource = resources?.find(r => r?.id === permission?.resourceId);
                const level = getPermissionLevel(permission);

                return (
                  <tr
                    key={permission?.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, permission)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, permission)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${role?.color || 'bg-muted'}`} />
                        <span className="font-medium text-foreground">{role?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Icon name={resource?.icon || 'Shield'} size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{resource?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${getPermissionColor(level)}`}>
                        {level?.charAt(0)?.toUpperCase() + level?.slice(1)} Access
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant={level === 'none' ? 'default' : 'ghost'}
                          size="xs"
                          onClick={() => handlePermissionChange(permission?.id, 'none')}
                        >
                          None
                        </Button>
                        <Button
                          variant={level === 'read' ? 'default' : 'ghost'}
                          size="xs"
                          onClick={() => handlePermissionChange(permission?.id, 'read')}
                        >
                          Read
                        </Button>
                        <Button
                          variant={level === 'write' ? 'default' : 'ghost'}
                          size="xs"
                          onClick={() => handlePermissionChange(permission?.id, 'write')}
                        >
                          Write
                        </Button>
                        <Button
                          variant={level === 'full' ? 'default' : 'ghost'}
                          size="xs"
                          onClick={() => handlePermissionChange(permission?.id, 'full')}
                        >
                          Full
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(permission.lastModified)?.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPermissions?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No permissions found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionMatrix;