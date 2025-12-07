'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useActivityLogStore } from '../store/activity-log-store';
import { cn } from '@/lib/utils';

const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const getEventColor = (event: string) => {
  switch (event) {
    case 'created': return 'bg-green-50 text-green-700';
    case 'updated': return 'bg-blue-50 text-blue-700';
    case 'deleted': return 'bg-red-50 text-red-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

export function ActivityLogDetailModal() {
  const { open, setOpen, currentRow } = useActivityLogStore();

  if (!currentRow) return null;

  return (
    <Dialog open={open === 'view'} onOpenChange={(state) => !state && setOpen(null)}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity Log Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-sm font-semibold">{currentRow.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Event</label>
              <div className="mt-1">
                <Badge className={cn('text-xs', getEventColor(currentRow.event))}>
                  {capitalize(currentRow.event)}
                </Badge>
              </div>
            </div>
          </div>

          {/* User Info */}
          {currentRow.causer && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Performed By</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm">{currentRow.causer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm">{currentRow.causer.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subject Info */}
          {currentRow.subject && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Subject</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="mt-1 text-sm">{currentRow.subject.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm">{currentRow.subject.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Changes */}
          {currentRow.changes && currentRow.changes.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Changes</h3>
              <div className="space-y-3">
                {currentRow.changes.map((change, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {capitalize(change.field.replace(/_/g, ' '))}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Old Value</label>
                        <p className="mt-1 text-sm text-red-600">
                          {change.old !== null && change.old !== undefined 
                            ? String(change.old) 
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">New Value</label>
                        <p className="mt-1 text-sm text-green-600">
                          {change.new !== null && change.new !== undefined 
                            ? String(change.new) 
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Time</label>
                <p className="mt-1 text-sm">{currentRow.created_at_human}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Date</label>
                <p className="mt-1 text-sm">
                  {new Date(currentRow.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Properties (if any additional data) */}
          {currentRow.properties && Object.keys(currentRow.properties).length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Additional Properties</h3>
              <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(currentRow.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
