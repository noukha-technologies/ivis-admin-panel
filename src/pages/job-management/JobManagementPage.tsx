import React, { useState } from 'react';
import { toast } from 'sonner';
import carImage from '../../assets/images/Png/car.png';
import tickImg from '../../assets/icons/tick_img.svg';
import { useJobs } from '../../features/jobs/hooks/useJobs';
import type { JobDetailView, JobListItem, JobTabFilter } from '../../features/jobs/types';

const JobManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<JobTabFilter>('Pending');
  const jobsApi = useJobs(activeTab);
  const [selectedJob, setSelectedJob] = useState<JobListItem | JobDetailView | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Detail Page states
  const [adminPc, setAdminPc] = useState('Ramesh');
  const [selectedLine, setSelectedLine] = useState('C002');

  // Form states for New Job
  const [newVehicle, setNewVehicle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newCenter, setNewCenter] = useState('Muscat');
  const [newLine, setNewLine] = useState('Line 1');

  const displayJob = jobsApi.selectedDetail ?? selectedJob;

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Jobs are created when a payment is marked Paid');
    setShowNewJobModal(false);
  };

  const handleStartTest = async (): Promise<void> => {
    if (selectedJob) {
      const ok = await jobsApi.updateJobStatus(selectedJob.id, 'InProgress');
      if (ok) {
        setSelectedJob({ ...selectedJob, status: 'In progress' });
        setCurrentStep(2);
        toast.success('Job started');
      }
    }
  };

  const paginatedJobs = jobsApi.items;

  // If a job is selected, show the detail view
  if (selectedJob && displayJob) {
    const jobLabel =
      'displayId' in displayJob
        ? displayJob.displayId
        : (displayJob as JobDetailView).id;
    return (
      <div className="flex flex-col gap-6 text-gray-900" style={{ marginLeft: '20px', marginRight: '20px' }}>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-500">
          <button
            onClick={() => { setSelectedJob(null); jobsApi.setSelectedDetail(null); }}
            className="hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0 font-medium text-sm"
          >
            Job Management
          </button>
          <span>&gt;</span>
          <div className="flex items-center gap-1.5 text-gray-900 cursor-pointer">
            <span>{jobLabel}</span>
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
              Job - {jobLabel}
            </h1>
            <p className="text-sm text-gray-500 mt-1.5 font-semibold">
              {'vehicle' in selectedJob ? `${selectedJob.vehicle} • ${selectedJob.center} • ${selectedJob.line}` : ''}
            </p>
          </div>
          {currentStep === 1 ? (
            <button
              onClick={handleStartTest}
              className="bg-[#111827] text-white w-40 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer text-center"
            >
              Start Test
            </button>
          ) : (
            <button
              onClick={() => toast.success('Jobs refreshed!')}
              className="flex items-center justify-center gap-1.5 bg-white text-gray-700 border border-[#D0D5DD] w-40 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Refresh now</span>
            </button>
          )}
        </div>

        {/* Stepper progress indicator */}
        <div className="max-w-100 flex rounded-lg border border-[#D0D5DD] overflow-hidden bg-white select-none">
          {/* Step 1: Created */}
          <div
            onClick={() => setCurrentStep(1)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 border-r border-[#D0D5DD] text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${currentStep >= 1
              ? 'bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5]'
              : 'bg-white text-[#344054] hover:bg-gray-50'
              }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-none ${currentStep >= 1 ? 'bg-[#15803D] text-white' : 'bg-[#475467] text-white'
              }`}>
              {currentStep >= 2 ? (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : '1'}
            </span>
            <span>Created</span>
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

        {/* Dropdowns side-by-side (Only visible in Step 1) */}
        {currentStep === 1 && (
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
        )}

        {/* Detail Content List */}
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>

      {/* Top Controls Bar */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        {/* Left Side: Search Box */}
        <div className="relative" style={{ width: '320px' }}>
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <svg className="w-4.5 h-4.5" fill="none" stroke="#64748b" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={jobsApi.searchQuery}
            onChange={(e) => jobsApi.setSearchQuery(e.target.value)}
            className="bg-white transition-all focus:outline-none focus:border-[#98A2B3]"
            style={{
              width: '100%',
              height: '38px',
              border: '1px solid #D0D5DD',
              borderRadius: '10px',
              paddingLeft: '40px',
              paddingRight: '16px',
              fontSize: '14px',
              color: '#1D2939',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Right Side: Switcher Tabs & New Job Button */}
        <div className="flex items-center gap-3">
          {/* Switcher Tab Buttons */}
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

          {/* New Job Button */}
          <button
            onClick={() => setShowNewJobModal(true)}
            className="transition-all cursor-pointer hover:bg-opacity-95"
            style={{
              backgroundColor: '#1c1c1e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              height: '38px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '400', lineHeight: '1', display: 'inline-block', position: 'relative', top: '-1px' }}>+</span>
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none" style={{ padding: '12px 20px' }}>
                <div className="flex items-center gap-1">
                  Job ID
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Vehicle</th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Customer</th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Center</th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Line</th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Created</th>
              <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap w-12 text-right" style={{ padding: '12px 20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobsApi.isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">Loading…</td>
              </tr>
            ) : paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={async () => {
                    setSelectedJob(job);
                    await jobsApi.loadDetail(job.id);
                    if (job.status === 'Pending') setCurrentStep(1);
                    else if (job.status === 'Completed') setCurrentStep(3);
                    else setCurrentStep(2);
                  }}
                  className="border-b border-gray-50 transition-colors duration-150 hover:bg-gray-50/80 bg-white cursor-pointer"
                >
                  <td className="px-6 py-4.5 text-sm font-semibold text-gray-900">
                    <span className="underline text-gray-900 hover:text-gray-600 transition-colors font-semibold">
                      {job.displayId}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{job.vehicle}</td>
                  <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{job.customer}</td>
                  <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{job.center}</td>
                  <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{job.line}</td>
                  <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{job.created}</td>
                  <td className="px-6 py-4.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === job.id ? null : job.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center ml-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {activeDropdownId === job.id && (
                        <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 font-semibold text-[13px] text-gray-700 text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              if (job.status === 'Pending') {
                                setCurrentStep(1);
                              } else if (job.status === 'Completed') {
                                setCurrentStep(3);
                              } else {
                                setCurrentStep(2);
                              }
                              setActiveDropdownId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast(`Editing inspection job: ${job.id}`);
                              setActiveDropdownId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete inspection job ${job.displayId}?`)) {
                                void jobsApi.removeJob(job.id);
                              }
                              setActiveDropdownId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5 transition-colors font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                  No jobs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer / Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-[#ffffff]">
          <span className="text-xs font-semibold text-gray-500">
            Page {jobsApi.page} of {jobsApi.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => jobsApi.setPage(p => Math.max(1, p - 1))}
              disabled={jobsApi.page === 1}
              className={`px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold transition-all duration-150 bg-white ${jobsApi.page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
            >
              Previous
            </button>
            <button
              onClick={() => jobsApi.setPage(p => Math.min(jobsApi.totalPages, p + 1))}
              disabled={jobsApi.page >= jobsApi.totalPages}
              className={`px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold transition-all duration-150 bg-white ${jobsApi.page >= jobsApi.totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
            >
              Next
            </button>
          </div>
        </div>

      </div>

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
