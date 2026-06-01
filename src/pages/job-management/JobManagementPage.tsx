import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';
import { toast } from 'sonner';
import { useJobs } from '../../features/jobs/hooks/useJobs';
import type { JobTabFilter } from '../../features/jobs/types';
import { DataTable } from '../../components/ui/DataTable';
import { ROUTES } from '../../router/routes';
import { cn } from '../../utils/cn';

function CheckboxDropdown({ label, options, selectedValues, onChange }: {
  label: string;
  options: { label: string, value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[140px] bg-white border border-[#D0D5DD] text-[#475467] text-sm font-medium rounded-lg px-4 py-2 hover:bg-neutral-50 transition-all shadow-sm"
      >
        <span className="truncate">{label}</span>
        <svg className="w-4 h-4 ml-2 text-[#475467]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[160px] bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50 animate-fadeInMenu text-left">
          {options.map(opt => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <label key={opt.value} className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => toggleOption(opt.value)}
                />
                <div className={cn(
                  "w-[16px] h-[16px] rounded-[4px] border border-[#D0D5DD] flex items-center justify-center transition-all bg-white group-hover:border-[#344054]",
                  isSelected ? "border-[#344054]" : ""
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-[#344054]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[13.5px] font-medium text-[#1D2939]">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

const JobManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobTabFilter>('Job Queue');
  const jobsApi = useJobs(activeTab);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // Filter states
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);

  // Form states for New Job
  const [newVehicle, setNewVehicle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newCenter, setNewCenter] = useState('Muscat');
  const [newLine, setNewLine] = useState('Line 1');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Jobs are created when a payment is marked Paid');
    setShowNewJobModal(false);
  };

  const columns = [
    {
      header: 'Job ID',
      accessorKey: 'displayId',
      cell: ({ row }: any) => (
        <span className="underline text-gray-900 hover:text-gray-600 transition-colors font-semibold">
          {row.displayId}
        </span>
      ),
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle',
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
    },
    {
      header: 'Source',
      accessorKey: 'source',
    },
    {
      header: 'Center',
      accessorKey: 'center',
    },
    {
      header: 'Line',
      accessorKey: 'line',
    },
    {
      header: 'ROP API status',
      accessorKey: 'ropApiStatus',
    },
    {
      header: 'Created',
      accessorKey: 'created',
    },
    {
      header: 'Action',
      id: 'action',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }: any) => (
        <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.JOB_DETAIL.replace(':id', row.id));
            }}
            className="text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-100"
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toast(`Editing inspection job: ${row.id}`);
            }}
            className="text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-100"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete inspection job ${row.displayId}?`)) {
                void jobsApi.removeJob(row.id);
              }
            }}
            className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 rounded-md hover:bg-rose-50"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Tabs & Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[#D0D5DD] overflow-hidden bg-white">
            {(['Job Queue', 'Pending', 'In progress', 'Redo Test', 'Completed'] as const).map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-medium transition-all cursor-pointer border-r border-[#D0D5DD] last:border-r-0 ${activeTab === tab
                    ? 'bg-[#F8F9FC] text-[#1D2939]'
                    : 'bg-white text-[#344054] hover:bg-[#F9FAFB]'
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <CheckboxDropdown
            label="Select Center"
            options={[
              { label: 'Center 1', value: 'Center 1' },
              { label: 'Center 2', value: 'Center 2' },
              { label: 'Muscat', value: 'Muscat' },
            ]}
            selectedValues={selectedCenters}
            onChange={setSelectedCenters}
          />

          <CheckboxDropdown
            label="Select Line"
            options={[
              { label: 'Line 1', value: 'Line 1' },
              { label: 'Line 2', value: 'Line 2' },
              { label: 'Line 3', value: 'Line 3' },
            ]}
            selectedValues={selectedLines}
            onChange={setSelectedLines}
          />
        </div>


      </div>

      <DataTable
        data={jobsApi.items || []}
        columns={columns}
        loading={jobsApi.isLoading}
        searchPlaceholder="Search..."
        onRowClick={(job: any) => {
          navigate(ROUTES.JOB_DETAIL.replace(':id', job.id));
        }}
        leftElement={
          <div className="flex items-center gap-3">
            <PermissionGate permission={PERMISSIONS.JOBS_CREATE}>
              <button
                onClick={() => setShowNewJobModal(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
                </svg>
                <span>New Job</span>
              </button>
            </PermissionGate>
            <button
              onClick={() => {
                void jobsApi.fetchList();
                toast.success('Queue refreshed');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-white border border-[#D0D5DD] hover:bg-neutral-50 text-[#344054] font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            >
              <svg className="w-4 h-4 text-[#344054]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Refresh now</span>
            </button>
          </div>
        }
      />

    {/* MODAL: New Job Entry Form */}
    {showNewJobModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 transition-all" style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
        <div
          style={{
            width: '460px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px 28px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #f3f4f6'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>New Inspection Job</h3>
            <button
              type="button"
              onClick={() => setShowNewJobModal(false)}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: '1.5px solid #6b7280',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: '#4b5563'
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Vehicle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Vehicle (Plate) *</label>
              <input
                type="text"
                placeholder="Enter Plate (e.g. OM-1000)"
                value={newVehicle}
                onChange={(e) => setNewVehicle(e.target.value)}
                required
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Customer */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Customer Name *</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                required
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Center */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Center *</label>
              <select
                value={newCenter}
                onChange={(e) => setNewCenter(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Muscat">Muscat</option>
                <option value="Sohar">Sohar</option>
                <option value="Nizwa">Nizwa</option>
                <option value="Salalah">Salalah</option>
              </select>
            </div>

            {/* Line */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Line *</label>
              <select
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1f2937',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Line 1">Line 1</option>
                <option value="Line 2">Line 2</option>
                <option value="Line 3">Line 3</option>
                <option value="Muscat">Muscat</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#4b5563',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '10px 0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: '#111827',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '10px 0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default JobManagementPage;
