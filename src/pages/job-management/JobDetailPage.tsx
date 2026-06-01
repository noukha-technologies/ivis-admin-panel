import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import carImage from '../../assets/images/Png/car.png';
import tickImg from '../../assets/icons/tick_img.svg';
import { jobService } from '../../api/services/job.service';
import { toJobDetailView } from '../../features/jobs/mappers';
import type { JobDetailView } from '../../features/jobs/types';
import { getApiErrorMessage } from '../../api/apiResponse';
import { ROUTES } from '../../router/routes';
import { DataTable } from '../../components/ui/DataTable';
import { JobPaymentForm } from '../../components/jobs/JobPaymentForm';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);


  // Form states for Step 1
  const [customerName, setCustomerName] = useState('Ramesh');
  const [customerContact, setCustomerContact] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');

  // Payment tables configuration
  const paymentColumns = [
    {
      header: 'Payment Id',
      accessorKey: 'paymentId',
      cell: ({ row }: any) => (
        <span className="font-bold text-gray-900">{row.paymentId}</span>
      ),
    },
    {
      header: 'Pay Date',
      accessorKey: 'payDate',
    },
    {
      header: 'Payment Type',
      accessorKey: 'paymentType',
    },
    {
      header: 'Charges',
      accessorKey: 'charges',
    },
    {
      header: 'Vat',
      accessorKey: 'vat',
    },
    {
      header: 'Grant Total inc. vat',
      accessorKey: 'grandTotal',
    },
  ];

  const advanceAmountData = [
    {
      paymentId: 'O012',
      payDate: '2026-05-07',
      paymentType: 'Mix',
      charges: '30',
      vat: '1.50',
      grandTotal: '31.50',
    },
  ];

  const paymentData = [
    {
      paymentId: 'O012',
      payDate: '2026-05-07',
      paymentType: 'Mix',
      charges: '30',
      vat: '1.50',
      grandTotal: '31.50',
    },
  ];

  const loadJobDetail = async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getById(jobId);
      const mapped = toJobDetailView(data);
      setJob(mapped);

      // Always default to Step 1 (Created) on detail page load
      setCurrentStep(1);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load job details'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      void loadJobDetail(id);
    }
  }, [id]);

  const handleStartTest = async (): Promise<void> => {
    if (id && job) {
      try {
        await jobService.update(id, { status: 'InProgress' });
        setJob({ ...job, status: 'InProgress' });
        setCurrentStep(2);
        toast.success('Job started');
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to start test'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-900 gap-4" style={{ marginLeft: '20px', marginRight: '20px' }}>
        <p className="text-red-500 font-semibold">{error || 'Job not found'}</p>
        <button
          onClick={() => navigate(ROUTES.JOB_MANAGEMENT)}
          className="px-4 py-2 bg-gray-950 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Back to Job Management
        </button>
      </div>
    );
  }

  const jobLabel = job.displayId;
  const invoiceId = job.displayId.replace('#', '').replace('J', 'JO') + '-INV01';
  const invoiceDate = '11 May 2026';
  const customerPhone = job.raw.customer?.phone || '+968 91000000';
  const customerId = job.raw.customer?.id_number || 'ID20000000';
  const vin = job.raw.vehicleRecord?.chassis_no || 'JT2BF22K0W0123456';
  const mulkiyaId = '00093 0394';
  const brandModel = job.raw.vehicleRecord?.make && job.raw.vehicleRecord?.model
    ? `${job.raw.vehicleRecord.make} ${job.raw.vehicleRecord.model}`
    : 'Toyota Corolla';

  return (
    <div className="flex flex-col gap-6 text-gray-900" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5 text-sm font-medium text-gray-500">
        <button
          onClick={() => navigate(ROUTES.JOB_MANAGEMENT)}
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
            {`${job.vehicle} • ${job.center} • ${job.line}`}
          </p>
        </div>
        {currentStep === 1 && (
          <button
            onClick={handleStartTest}
            className="bg-[#111827] text-white w-40 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer text-center"
          >
            Start Test
          </button>
        )}

      </div>

      {/* Stepper progress indicator with Actions on the right */}
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="max-w-150 flex-1 flex rounded-lg border border-[#D0D5DD] overflow-hidden bg-white select-none">
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

          {/* Step 2: Invoice Details */}
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
            <span>Invoice Details</span>
          </div>

          {/* Step 3: Payment */}
          <div
            onClick={() => setCurrentStep(3)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 border-r border-[#D0D5DD] text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${currentStep >= 3
              ? 'bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5]'
              : 'bg-white text-[#344054] hover:bg-gray-50'
              }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-none ${currentStep >= 3 ? 'bg-[#15803D] text-white' : 'bg-[#475467] text-white'
              }`}>
              {currentStep >= 4 ? (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : '3'}
            </span>
            <span>Payment</span>
          </div>

          {/* Step 4: Test & Submit */}
          <div
            onClick={() => setCurrentStep(4)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${currentStep >= 4
              ? 'bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5]'
              : 'bg-white text-[#344054] hover:bg-gray-50'
              }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-none ${currentStep >= 4 ? 'bg-[#15803D] text-white' : 'bg-[#475467] text-white'
              }`}>
              4
            </span>
            <span>Test & Submit</span>
          </div>
        </div>

        {currentStep === 2 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast('Printing invoice...')}
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Print
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm animate-pulse-subtle"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20.49 9A9 9 0 005.64 5.64L4 4m16.01 16.01A9 9 0 018.36 18.36L20 20" />
              </svg>
              Refresh now
            </button>
          </div>
        )}
      </div>

      {/* Form fields (Only visible in Step 1) */}
      {currentStep === 1 && (
        <div className="grid grid-cols-2 gap-4 max-w-250 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Customer Name</label>
            <select
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold cursor-pointer"
            >
              <option value="">Select</option>
              <option value="Ramesh">Ramesh</option>
              <option value="Suresh">Suresh</option>
              <option value="Ali">Ali</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Customer Contact No</label>
            <input
              type="text"
              placeholder="Enter"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Driver Name</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold cursor-pointer"
            >
              <option value="">Select</option>
              <option value="John">John</option>
              <option value="Smith">Smith</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Driver Contact No</label>
            <input
              type="text"
              placeholder="Enter"
              value={driverContact}
              onChange={(e) => setDriverContact(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold"
            />
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
                  <span className="text-gray-900 font-bold">{job.id}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Job Status</span>
                  <span className="text-gray-900 font-bold">{job.status}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Source</span>
                  <span className="text-gray-900 font-bold">{job.center}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Created</span>
                  <span className="text-gray-900 font-bold">{job.created}</span>
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
                  <span className="text-gray-900 font-bold">{job.vehicle}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">VIN</span>
                  <span className="text-gray-900 font-bold">JT2BF22K0W0123456</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Type / Category</span>
                  <span className="text-gray-900 font-bold">Sedan</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Mulkiya Id</span>
                  <span className="text-gray-900 font-bold">Toyota Corolla</span>
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
                  <span className="text-gray-900 font-bold">{job.customer}</span>
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

            {/* Advance Amount Info Table Card */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[15px] font-bold text-gray-900 text-left px-1">Advance Amount Info</h3>
              <DataTable
                data={advanceAmountData}
                columns={paymentColumns}
                showControls={false}
                showPagination={false}
              />
            </div>

            {/* Payment Info Table Card */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[15px] font-bold text-gray-900 text-left px-1">Payment Info</h3>
              <DataTable
                data={paymentData}
                columns={paymentColumns}
                showControls={false}
                showPagination={false}
              />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <JobPaymentForm
            job={job}
            invoiceId={invoiceId}
            onCancel={() => setCurrentStep(2)}
            onSuccess={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 2 && (
          <>
            {/* Invoice Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 text-left">
              <h3 className="text-[15px] font-bold text-gray-900">Invoice Details</h3>
              <div className="flex items-center gap-8 text-sm">
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Invoice ID</span>
                  <span className="text-gray-900 font-bold">{invoiceId}</span>
                </div>
                <div className="text-gray-300">|</div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Invoice Date</span>
                  <span className="text-gray-900 font-bold">{invoiceDate}</span>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-left">
              <div className="px-5 py-3 border-b border-gray-100 bg-white">
                <h3 className="text-[15px] font-bold text-gray-900">Customer Info</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Name</span>
                  <span className="text-gray-900 font-bold">{job.customer}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Phone</span>
                  <span className="text-gray-900 font-bold">{customerPhone}</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">ID Number</span>
                  <span className="text-gray-900 font-bold">{customerId}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-gray-900 border-b border-gray-100 pb-3 -mx-5 px-5">Vehicle Info</h3>
              <div className="divide-y divide-gray-100">
                <div className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Plate Number</span>
                  <span className="text-gray-900 font-bold">{job.vehicle}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">VIN</span>
                  <span className="text-gray-900 font-bold">{vin}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Mulkiya Id</span>
                  <span className="text-gray-900 font-bold">{mulkiyaId}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Brand / Model</span>
                  <span className="text-gray-900 font-bold">{brandModel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Type (fetch job) *</label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Category / Invoice Category(fetch from master)*</label>
                  <select
                    className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 font-semibold cursor-pointer"
                  >
                    <option value="">Select</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Charges Breakdown Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-gray-900 border-b border-gray-100 pb-3 -mx-5 px-5">Charges Breakdown</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cetner Charges</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    15.000 OMR
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">ROP Charges</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    15.000 OMR
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">VAT%</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    5%
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Grand Total INC VAT(A)</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    31.500 OMR
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Matrix Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Advanced Amount inc tax(B)</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    31.500 OMR
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Customer Payable Amount(A-B)</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    0
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Collected Amount</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    0
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">VAT Amount</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    0
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Collected Amount</label>
                  <div className="bg-[#F8F9FC] border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-bold">
                    0 OMR
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex justify-end gap-3 w-full mt-2">
              <button
                onClick={() => toast('Printing invoice...')}
                className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Print
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            {/* In File / Out File Card */}
            <div className="grid grid-cols-2 gap-5 w-full">
              {/* In File */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-900 text-left">In File</h3>
                <div className="flex items-center gap-3 border border-[#E4E7EC] rounded-xl p-3.5 bg-white">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-none">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-900 truncate">IN_JOB-{job.displayId.replace('#', '')}</p>
                    <p className="text-xs text-[#667085] mt-0.5 font-semibold">200 KB | May 22 2026</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Out File */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-900 text-left">Out File</h3>
                <div className="flex items-center gap-3 border border-[#E4E7EC] rounded-xl p-3.5 bg-white">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-none">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-900 truncate">OUT_JOB-{job.displayId.replace('#', '')}</p>
                    <p className="text-xs text-[#667085] mt-0.5 font-semibold">200 KB | May 22 2026</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
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
                onClick={() => setCurrentStep(3)}
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
};

export default JobDetailPage;
