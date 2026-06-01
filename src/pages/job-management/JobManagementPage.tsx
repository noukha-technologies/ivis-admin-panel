import React, { useState } from 'react';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';
import { toast } from 'sonner';
import { useJobs } from '../../features/jobs/hooks/useJobs';
import type { JobTabFilter } from '../../features/jobs/types';
import { DataTable } from '../../components/ui/DataTable';
import { ROUTES } from '../../router/routes';

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
            <button
              onClick={() => setShowNewJobModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
              <span>New Job</span>
            </button>
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

          {/* Step 2: In File */}
          <div
        onClick={() => setCurrentStep(2)}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 border-r border-[#D0D5DD] text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${currentStep >= 2
          ? 'bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5]'
          : 'bg-white text-[#344054] hover:bg-gray-50'
          }`}
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-none ${currentStep >= 2 ? 'bg-[#15803D] text-white' : 'bg-[#475467] text-white'
          }`}>
          {currentStep >= 3 ? (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : '2'}
        </span>
        <span>In File</span>
      </div>

      {/* Step 3: Test & Submit */}
      <div
        onClick={() => setCurrentStep(3)}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${currentStep >= 3
          ? 'bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5]'
          : 'bg-white text-[#344054] hover:bg-gray-50'
          }`}
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-none ${currentStep >= 3 ? 'bg-[#15803D] text-white' : 'bg-[#475467] text-white'
          }`}>
          3
        </span>
        <span>Test & Submit</span>
      </div>
    </div>

        {/* Dropdowns side-by-side (Only visible in Step 1) */ }
  {
    currentStep === 1 && (
      <div className="grid grid-cols-2 gap-4 max-w-250">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Admin PC</label>
          <select
            value={adminPc}
            onChange={(e) => setAdminPc(e.target.value)}
            className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold cursor-pointer"
          >
            <option value="Ramesh">Ramesh</option>
            <option value="Suresh">Suresh</option>
            <option value="Ali">Ali</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Line</label>
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold cursor-pointer"
          >
            <option value="C001">C001</option>
            <option value="C002">C002</option>
            <option value="C003">C003</option>
          </select>
        </div>
      </div>
    )
  }

  {/* Detail Content List */ }
  <div className="flex flex-col gap-5 w-full">
    {currentStep === 1 && (
      <>
        {/* Card 1: Job Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-[#F9FAFB]">
            <h3 className="text-sm font-bold text-gray-900">Job Info</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Job ID</span>
              <span className="text-gray-900 font-bold">{selectedJob.id}</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Job Status</span>
              <span className="text-gray-900 font-bold">{selectedJob.status}</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Centre</span>
              <span className="text-gray-900 font-bold">{selectedJob.center}</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Created</span>
              <span className="text-gray-900 font-bold">{selectedJob.created}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Vehicle Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-[#F9FAFB]">
            <h3 className="text-sm font-bold text-gray-900">Vehicle Information</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Plate Number</span>
              <span className="text-gray-900 font-bold">{selectedJob.vehicle}</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Chassis</span>
              <span className="text-gray-900 font-bold">JT2BF22K0W0123456</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Type</span>
              <span className="text-gray-900 font-bold">Sedan</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Brand / Model</span>
              <span className="text-gray-900 font-bold">Toyota Corolla</span>
            </div>
          </div>
        </div>

        {/* Card 3: Customer Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-[#F9FAFB]">
            <h3 className="text-sm font-bold text-gray-900">Customer Info</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="text-gray-900 font-bold">{selectedJob.customer}</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Phone</span>
              <span className="text-gray-900 font-bold">+986 91000000</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">ID Number</span>
              <span className="text-gray-900 font-bold">ID20000000</span>
            </div>
          </div>
        </div>

        {/* Card 4: Payment Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-[#F9FAFB]">
            <h3 className="text-sm font-bold text-gray-900">Payment Info</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="text-gray-900 font-bold">OMR 25.000</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Payment Id / Date</span>
              <span className="text-gray-900 font-bold">T1729 / 06.05.26</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Tax (5%)</span>
              <span className="text-gray-900 font-bold">OMR 1.250</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-gray-900 font-bold">OMR 26.250</span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                Paid
              </span>
            </div>
          </div>
        </div>
      </>
    )}

    {currentStep === 2 && (
      <>
        {/* Combined In File Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-6">

          {/* XML File Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900">In File</h3>

            <div className="flex items-center gap-4 border border-[#E4E7EC] rounded-xl p-4 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-gray-900 truncate">IN_JOB-2000.xml</p>
                <p className="text-xs text-[#667085] mt-0.5 font-semibold">200 KB | May 22 2026</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => toast('Opening preview...')}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-32.5 text-center shadow-sm"
              >
                Preview
              </button>
              <button
                onClick={() => toast.success('Downloading XML file...')}
                className="px-5 py-2.5 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-32.5 text-center shadow-sm"
              >
                Download
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Image Gallery Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">In File</h3>
              <button
                onClick={() => toast('Camera activated to capture image...')}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Capture Image
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={carImage} alt="Car" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-video rounded-lg border border-gray-200 bg-[#EFEFEF]"></div>
              <div className="aspect-video rounded-lg border border-gray-200 bg-[#EFEFEF]"></div>
            </div>
          </div>

        </div>
      </>
    )}

    {currentStep === 3 && (
      <>
        {/* Out File Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 text-left">Out File</h3>

          <div className="flex items-center gap-4 border border-[#E4E7EC] rounded-xl p-4 bg-white">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-gray-900 truncate">OUT_JOB-2000.xml</p>
              <p className="text-xs text-[#667085] mt-0.5 font-semibold">200 KB | May 22 2026</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast('Opening preview...')}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-32.5 text-center shadow-sm"
            >
              Preview
            </button>
            <button
              onClick={() => toast.success('Downloading XML file...')}
              className="px-5 py-2.5 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-32.5 text-center shadow-sm"
            >
              Download
            </button>
          </div>
        </div>

        {/* System Test Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-4 text-left">
          <h3 className="text-sm font-bold text-gray-900">System Test</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Brake System */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Brake System</p>
                <p className="text-sm font-bold text-gray-900">Safety</p>
              </div>
            </div>
            {/* Headlights */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Headlights</p>
                <p className="text-sm font-bold text-gray-900">Lights</p>
              </div>
            </div>
            {/* Suspension */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Suspension</p>
                <p className="text-sm font-bold text-gray-900">Mechanical</p>
              </div>
            </div>
            {/* Emissions */}
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center text-white flex-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Emissions</p>
                <p className="text-sm font-bold text-gray-900">Environment</p>
              </div>
            </div>
            {/* Tyres & Wheels */}
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center text-white flex-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Tyres & Wheels</p>
                <p className="text-sm font-bold text-gray-900">Safety</p>
              </div>
            </div>
            {/* Steering */}
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center text-white flex-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Steering</p>
                <p className="text-sm font-bold text-gray-900">Mechanical</p>
              </div>
            </div>
          </div>
        </div>

        {/* In File (Image Gallery) Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900">In File</h3>
            <button
              onClick={() => toast('Camera activated to capture image...')}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Capture Image
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={carImage} alt="Car" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video rounded-lg border border-gray-200 bg-[#EFEFEF]"></div>
            <div className="aspect-video rounded-lg border border-gray-200 bg-[#EFEFEF]"></div>
          </div>
        </div>

        {/* Manual Test Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-4 text-left">
          <h3 className="text-sm font-bold text-gray-900">Manual Test</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Brake System */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Brake System</p>
                <p className="text-sm font-bold text-gray-900">Safety</p>
              </div>
            </div>
            {/* Headlights */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Headlights</p>
                <p className="text-sm font-bold text-gray-900">Lights</p>
              </div>
            </div>
            {/* Suspension */}
            <div className="bg-[#f2fbf4] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-3">
              <img src={tickImg} alt="Tick" className="w-4.75 h-4.75 flex-none" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Suspension</p>
                <p className="text-sm font-bold text-gray-900">Mechanical</p>
              </div>
            </div>
            {/* Emissions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-none bg-white"></div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Emissions</p>
                <p className="text-sm font-bold text-gray-900">Environment</p>
              </div>
            </div>
            {/* Tyres & Wheels */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-none bg-white"></div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Tyres & Wheels</p>
                <p className="text-sm font-bold text-gray-900">Safety</p>
              </div>
            </div>
            {/* Steering */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-none bg-white"></div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Steering</p>
                <p className="text-sm font-bold text-gray-900">Mechanical</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 flex justify-end gap-3 w-full">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => toast.success('Submitting & Printing...')}
            className="px-6 py-2.5 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Submit & Print
          </button>
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-2.5 bg-[#1F2937] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Redo Test
          </button>
        </div>
      </>
    )}
  </div>
      </div >
    );
  }

return (
  <div className="flex flex-col gap-4" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
    <DataTable
      data={jobsApi.items || []}
      columns={columns}
      loading={jobsApi.isLoading}
      searchPlaceholder="Search..."
      onRowClick={async (job: any) => {
        setSelectedJob(job);
        await jobsApi.loadDetail(job.id);
        if (job.status === 'Pending') setCurrentStep(1);
        else if (job.status === 'Completed') setCurrentStep(3);
        else setCurrentStep(2);
      }}
      leftElement={
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[#D0D5DD] overflow-hidden bg-white">
            {(['Pending', 'In progress', 'Redo Test', 'Completed'] as const).map((tab) => {
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
