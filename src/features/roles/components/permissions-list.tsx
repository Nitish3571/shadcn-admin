'use client';

import { Checkbox } from '@/components/ui/checkbox';

type Permission = {
  id: number;
  rawName: string;
  name: string;
  description?: string;
};

type PermissionModule = {
  moduleName: string;
  moduleSlug: string | null;
  permissions: Permission[];
};

interface PermissionsManagerProps {
  modules: PermissionModule[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionName: string) => void;
  onModuleToggle: (module: PermissionModule) => void;
  onGlobalToggle?: (type: string) => void;
  disabled?: boolean;
}

export function PermissionsManager({
  modules,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
  onGlobalToggle,
  disabled = false,
}: PermissionsManagerProps) {
  const basicTypes = ['view', 'create', 'edit', 'delete'];

  // Check if a type is checked globally
  const isTypeCheckedGlobally = (type: string) => {
    return modules.every((mod) =>
      mod.permissions
        .filter((p) => p.name.endsWith(`.${type}`))
        .every((p) => selectedPermissions.includes(p.name))
    );
  };

  // Check if 'more' permissions are checked globally
  const isMoreCheckedGlobally = () => {
    return modules.every((mod) =>
      mod.permissions.some(
        (p) => !basicTypes.some((t) => p.name.endsWith(`.${t}`)) && selectedPermissions.includes(p.name)
      )
    );
  };

  return (
    <div className="space-y-2">
      {/* ---------- Global Header ---------- */}
      <div className="flex items-center gap-6 p-3 font-semibold border-b border-gray-300">
        <div className="min-w-[150px]">Module</div>
        <div className="flex items-center gap-6">
          {basicTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={isTypeCheckedGlobally(type)}
                onCheckedChange={() => onGlobalToggle?.(type)}
                disabled={disabled}
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isMoreCheckedGlobally()}
              onCheckedChange={() => onGlobalToggle?.('more')}
              disabled={disabled}
            />
            <span>More</span>
          </label>
        </div>
      </div>

      {/* ---------- Modules ---------- */}
      {modules.map((mod, idx) => {
        const perms = mod.permissions;
        const moduleAllChecked = perms.every((p) => selectedPermissions.includes(p.name));

        return (
          <div key={idx} className="flex items-center gap-6 p-3 rounded-md border border-gray-200 flex-wrap">
            {/* Module checkbox + name */}
            <div className="flex items-center gap-2 min-w-[150px]">
              <Checkbox
                checked={moduleAllChecked}
                onCheckedChange={() => onModuleToggle(mod)}
                disabled={disabled}
              />
              <span className="text-sm font-medium">{mod.moduleName}</span>
            </div>

            {/* Permissions horizontal */}
            <div className="flex items-center gap-6 flex-wrap">
              {basicTypes.map((type) => {
                const perm = perms.find((p) => p.name.endsWith(`.${type}`));
                if (!perm) {
                  return (
                    <label className="flex items-center gap-2 opacity-50" key={type}>
                      <Checkbox disabled />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  );
                }

                return (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedPermissions.includes(perm.name)}
                      onCheckedChange={() => onPermissionToggle(perm.name)}
                      disabled={disabled}
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                );
              })}

              {/* More permissions */}
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={perms.some((p) => {
                    return !basicTypes.some((t) => p.name.endsWith(`.${t}`)) && selectedPermissions.includes(p.name);
                  })}
                  onCheckedChange={() => onModuleToggle(mod)}
                  disabled={disabled}
                />
                <span className="text-sm">More</span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
