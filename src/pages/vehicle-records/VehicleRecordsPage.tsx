import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { buildAnprCapturePayload } from '@/features/anpr/buildAnprCapturePayload';
import { useAnprCaptures } from '../../features/anpr/hooks/useAnprCaptures';
import { useRopVerifications } from '../../features/rop/hooks/useRopVerifications';
import { useIntake } from '../../features/intake/IntakeContext';
import { useMasterLookups } from '../../hooks/useMasterLookups';
import { DataTable } from '../../components/ui/DataTable';
import type { ColumnDef } from '../../interfaces/ui.interfaces';

const VehicleRecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANPR capture' | 'ROP verification'>('ANPR capture');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const intake = useIntake();
  const { cameras } = useMasterLookups();
  const anpr = useAnprCaptures({ enabled: activeTab === 'ANPR capture' });
  const rop = useRopVerifications({ enabled: activeTab === 'ROP verification' });

  React.useEffect(() => {
    if (cameras.length && !cameraId) {
      setCameraId(cameras[0].id);
    }
  }, [cameras, cameraId]);

  React.useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleCreateCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !cameraId) {
      toast.error('Plate number and camera are required');
      return;
    }
    const created = await anpr.createCapture(buildAnprCapturePayload(plateNumber.trim(), cameraId));
    if (created) {
      intake.setFromAnpr(created);
      toast.success('ANPR capture created — ROP processed automatically');
      setShowCreateModal(false);
    } else if (anpr.error) {
      toast.error(anpr.error);
    }
  };

  const records = anpr.items;
  const ropItems = rop.items;

  const anprColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'plate',
      header: 'Plate',
      accessorKey: 'plate',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'captureTime',
      header: 'Capture Time',
      accessorKey: 'captureTime',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'cameraId',
      header: 'Camera',
      accessorKey: 'cameraId',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'confidence',
      header: 'Confidence',
      accessorKey: 'confidence',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const badgeClass =
          value === 'Validated'
            ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
            : value === 'Pending'
              ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
              : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60';
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border ${badgeClass}`}>
            {value}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      id: 'action',
      header: 'Action',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="relative text-right" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdownId(activeDropdownId === row.id ? null : row.id);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            ⋮
          </button>
          {activeDropdownId === row.id && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 text-[13px] text-left">
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50"
                onClick={() => {
                  intake.setFromAnpr(row.raw);
                  toast.success('Capture linked to intake session');
                  setActiveDropdownId(null);
                }}
              >
                Use for intake
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                onClick={async () => {
                  if (window.confirm(`Delete capture ${row.plate}?`)) {
                    const ok = await anpr.removeCapture(row.id);
                    if (ok) toast.success('Deleted');
                    else if (anpr.error) toast.error(anpr.error);
                  }
                  setActiveDropdownId(null);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdownId, intake, anpr]);

  const ropColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'owner',
      header: 'Owner',
      accessorKey: 'owner',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'make',
      header: 'Make',
      accessorKey: 'make',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'model',
      header: 'Model',
      accessorKey: 'model',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'regNo',
      header: 'Reg No',
      accessorKey: 'regNo',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'chassisNo',
      header: 'Chassis No',
      accessorKey: 'chassisNo',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'fetchStatus',
      header: 'Fetch Status',
      accessorKey: 'fetchStatus',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
  ], []);

  React.useEffect(() => {
    if (anpr.error) {
      toast.error(anpr.error);
    }
  }, [anpr.error]);

  React.useEffect(() => {
    if (rop.error) {
      toast.error(rop.error);
    }
  }, [rop.error]);

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>

      <DataTable
        loading={activeTab === 'ANPR capture' ? anpr.isLoading : rop.isLoading}
        data={activeTab === 'ANPR capture' ? records : ropItems}
        columns={activeTab === 'ANPR capture' ? anprColumns : ropColumns}
        searchPlaceholder="Search"
        leftElement={
          <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '38px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('ANPR capture')}
              className={`px-4 py-2 text-sm transition-all duration-200 border-r border-gray-200 cursor-pointer ${
                activeTab === 'ANPR capture'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
              style={{ whiteSpace: 'nowrap' }}
            >
              ANPR capture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ROP verification')}
              className={`px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'ROP verification'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
              style={{ whiteSpace: 'nowrap' }}
            >
              ROP verification
            </button>
          </div>
        }
        filterElement={
          activeTab === 'ANPR capture' ? (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#1e293b] rounded-lg hover:bg-[#334155] cursor-pointer shrink-0"
              style={{ height: '38px', whiteSpace: 'nowrap' }}
            >
              New ANPR Capture
            </button>
          ) : undefined
        }
      />

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/35">
          <form
            onSubmit={handleCreateCapture}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">New ANPR Capture</h3>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Plate number</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
            />
            <label className="block text-sm font-semibold text-gray-600 mb-1">Camera</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
              required
            >
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mb-4">Simulated ROP and vehicle record upsert will run automatically.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={anpr.isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1e293b] rounded-lg disabled:opacity-50"
              >
                {anpr.isSubmitting ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleRecordsPage;
