import React, { useState, useEffect, useRef } from 'react';

// Interfaces for our different Master types
interface VehicleMaster {
  id: string;
  name: string;
  chassisNo: string;
  category: string;
  fuelType: string;
  capacityRange: string;
  code: string;
  details: string;
  status: 'Active' | 'Inactive';
  created: string;
}

interface TestMaster {
  id: string;
  name: string;
  testCode: string;
  category: string;
  resultType: string;
  details: string;
  status: 'Active' | 'Inactive';
  created: string;
}

interface CentreMaster {
  id: string;
  name: string;
  code: string;
  city: string;
  region: string;
  description: string;
  status: 'Active' | 'Inactive';
  created: string;
}

interface LineMaster {
  id: string;
  name: string;
  code: string;
  module?: string;
  displayOrder?: string;
  details: string;
  status: 'Active' | 'Inactive';
  created: string;
}

interface AdminPcMaster {
  id: string;
  name: string;
  ipAddress: string;
  centre: string;
  assignedUser: string;
  status: 'Active' | 'Inactive';
  created: string;
  code?: string;
  description?: string;
}

interface CameraMaster {
  id: string;
  name: string;
  type?: string;
  line: string;
  status: 'Active' | 'Inactive';
  created: string;
  code?: string;
  description?: string;
  centerCode?: string;
}

interface PaymentMaster {
  id: string;
  name: string;
  terminalId: string;
  type: 'POS' | 'Online' | 'Cash';
  accountNo: string;
  status: 'Active' | 'Inactive';
  created: string;
  code?: string;
  description?: string;
}

interface DocumentMaster {
  id: string;
  name: string;
  docCode: string;
  isRequired: 'Yes' | 'No';
  fileFormat: string;
  status: 'Active' | 'Inactive';
  created: string;
  code?: string;
  description?: string;
}

type TabType = 'Vehicle' | 'Manual Test' | 'Centre' | 'Line' | 'Admin PC' | 'Camera / ANPR' | 'Payment' | 'Document / File';

const MasterManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Vehicle');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [sortAsc, setSortAsc] = useState<boolean | null>(true); // true = Asc, false = Desc, null = unsorted
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 8;

  // Modals Detail State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Reset page on search or tab change
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
    setSortAsc(true);
    setActiveDropdownId(null);
  }, [activeTab]);

  // Master Lists States
  const [vehicles, setVehicles] = useState<VehicleMaster[]>([
    { id: 'V-101', name: 'Sedan', chassisNo: 'CH-SED-2026-001', category: 'Light Vehicle', fuelType: 'Petrol', capacityRange: '1.5L-2.0L', code: 'VT-SED Light', details: 'Standard passenger sedan', status: 'Active', created: '2026-01-10' },
    { id: 'V-102', name: 'SUV', chassisNo: 'CH-SUV-2026-042', category: 'Heavy Vehicle', fuelType: 'Diesel', capacityRange: '2.5L-3.0L', code: 'VT-SUV Heavy', details: 'Sports utility vehicle', status: 'Active', created: '2026-02-14' },
    { id: 'V-103', name: 'Hatchback', chassisNo: 'CH-HAT-2026-113', category: 'Light Vehicle', fuelType: 'Electric', capacityRange: '100kW-150kW', code: 'VT-HB Compact', details: 'Compact electric hatchback', status: 'Active', created: '2026-03-01' },
    { id: 'V-104', name: 'Coupe', chassisNo: 'CH-COU-2026-088', category: 'Light Vehicle', fuelType: 'Petrol', capacityRange: '2.0L-3.0L', code: 'VT-COU Sport', details: 'Two-door sports coupe', status: 'Inactive', created: '2026-03-15' },
    { id: 'V-105', name: 'Motorcycle', chassisNo: 'CH-MTC-2026-205', category: 'Two-Wheeler', fuelType: 'Petrol', capacityRange: '0.5L-1.0L', code: 'VT-MC Standard', details: 'Standard motorcycle', status: 'Active', created: '2026-04-02' },
    { id: 'V-106', name: 'Truck', chassisNo: 'CH-TRK-2026-017', category: 'Commercial', fuelType: 'Diesel', capacityRange: '5.0L-8.0L', code: 'VT-TRK Heavy', details: 'Heavy commercial duty truck', status: 'Active', created: '2026-04-10' },
    { id: 'V-107', name: 'Pickup', chassisNo: 'CH-PKP-2026-092', category: 'Commercial', fuelType: 'Petrol', capacityRange: '3.5L', code: 'VT-PKP Mid', details: 'Mid-size utility pickup', status: 'Active', created: '2026-04-18' },
  ]);

  const [tests, setTests] = useState<TestMaster[]>([
    { id: 'T-201', name: 'Brake Test', testCode: 'TEST-BRK', category: 'Safety', resultType: 'Numeric', details: 'Efficiency & Balance', status: 'Active', created: '2026-01-05' },
    { id: 'T-202', name: 'Emission Test', testCode: 'TEST-EMS', category: 'Environmental', resultType: 'Numeric', details: 'CO2 & Opacity level', status: 'Active', created: '2026-01-08' },
    { id: 'T-203', name: 'Headlight Alignment', testCode: 'TEST-HDL', category: 'Visual', resultType: 'Pass/Fail', details: 'Intensity & Aiming', status: 'Active', created: '2026-01-12' },
    { id: 'T-204', name: 'Suspension Play', testCode: 'TEST-SUS', category: 'Mechanical', resultType: 'Pass/Fail', details: 'Visual & Play Detector', status: 'Inactive', created: '2026-02-20' },
    { id: 'T-205', name: 'Side Slip Test', testCode: 'TEST-SSL', category: 'Safety', resultType: 'Numeric', details: 'Wheel alignment dev', status: 'Active', created: '2026-03-02' },
  ]);

  const [centres, setCentres] = useState<CentreMaster[]>([
    { id: 'C-301', name: 'Muscat Main Hub', code: 'MCT-01', city: 'Muscat', region: 'Muscat Governorate', description: 'Main inspection hub in Al Azaiba', status: 'Active', created: '2025-11-15' },
    { id: 'C-302', name: 'Salalah Centre', code: 'SLL-02', city: 'Salalah', region: 'Dhofar Governorate', description: 'Primary hub for the southern region', status: 'Active', created: '2025-12-01' },
    { id: 'C-303', name: 'Sohar Branch', code: 'SOH-03', city: 'Sohar', region: 'Al Batinah North', description: 'Serves the Batinah coast and port area', status: 'Active', created: '2026-01-20' },
    { id: 'C-304', name: 'Nizwa Station', code: 'NZW-04', city: 'Nizwa', region: 'Ad Dakhiliyah', description: 'Interior region diagnostic facility', status: 'Inactive', created: '2026-02-10' },
  ]);

  const [lines, setLines] = useState<LineMaster[]>([
    { id: 'L-401', name: 'Line 1 (Light)', code: 'LINE-01', module: 'Visual', displayOrder: '1', details: 'Light vehicle inspection lane at Muscat Main Hub', status: 'Active', created: '2026-01-01' },
    { id: 'L-402', name: 'Line 2 (Heavy)', code: 'LINE-02', module: 'Safety', displayOrder: '2', details: 'Heavy duty truck inspection lane at Muscat Main Hub', status: 'Active', created: '2026-01-01' },
    { id: 'L-403', name: 'Line 3 (Mixed)', code: 'LINE-03', module: 'Environmental', displayOrder: '3', details: 'Mixed vehicle lane at Salalah Centre', status: 'Active', created: '2026-01-10' },
    { id: 'L-404', name: 'Line 4 (Bikes)', code: 'LINE-04', module: 'Mechanical', displayOrder: '4', details: 'Two-wheeler inspection at Muscat Main Hub', status: 'Inactive', created: '2026-02-15' },
  ]);

  const [pcs, setPcs] = useState<AdminPcMaster[]>([
    { id: 'P-501', name: 'MCT-RECP-01', ipAddress: '192.168.10.15', centre: 'Muscat Main Hub', assignedUser: 'Ramesh', status: 'Active', created: '2026-01-02' },
    { id: 'P-502', name: 'MCT-LINE-PC1', ipAddress: '192.168.10.21', centre: 'Muscat Main Hub', assignedUser: 'Suleiman', status: 'Active', created: '2026-01-02' },
    { id: 'P-503', name: 'SLL-RECP-01', ipAddress: '192.168.20.15', centre: 'Salalah Centre', assignedUser: 'Fatima', status: 'Active', created: '2026-01-12' },
    { id: 'P-504', name: 'SOH-LINE-PC1', ipAddress: '192.168.30.21', centre: 'Sohar Branch', assignedUser: 'Ali', status: 'Inactive', created: '2026-02-18' },
  ]);

  const [cameras, setCameras] = useState<CameraMaster[]>([
    { id: 'CAM-601', name: 'ANPR-MCT-IN-1', type: 'ANPR', code: 'CAM-IN-01', line: 'Line 1 (Light)', description: 'Main entrance ANPR', status: 'Active', created: '2026-01-05' },
    { id: 'CAM-602', name: 'ANPR-MCT-OUT-1', type: 'ANPR', code: 'CAM-OUT-01', line: 'Line 1 (Light)', description: 'Main exit ANPR', status: 'Active', created: '2026-01-05' },
    { id: 'CAM-603', name: 'ANPR-SLL-IN-1', type: 'CCTV', code: 'CAM-SLL-01', line: 'Line 3 (Mixed)', description: 'Salalah entrance', status: 'Active', created: '2026-01-15' },
  ]);

  const [payments, setPayments] = useState<PaymentMaster[]>([
    { id: 'PAY-701', name: 'Bank Muscat POS 1', terminalId: 'TERM-BM-01', type: 'POS', accountNo: '0301-XXXX-XX23', status: 'Active', created: '2026-01-01' },
    { id: 'PAY-702', name: 'OmanNet Gateway', terminalId: 'GW-OMANNET', type: 'Online', accountNo: '0342-XXXX-XX44', status: 'Active', created: '2026-01-01' },
    { id: 'PAY-703', name: 'Cash Terminal 1', terminalId: 'CSH-MCT-01', type: 'Cash', accountNo: 'N/A (Cash Drawer)', status: 'Inactive', created: '2026-01-05' },
  ]);

  const [documents, setDocuments] = useState<DocumentMaster[]>([
    { id: 'DOC-801', name: 'Mulkiya (Registration)', docCode: 'REQ-01', isRequired: 'Yes', fileFormat: 'PDF, JPG', status: 'Active', created: '2026-01-01' },
    { id: 'DOC-802', name: 'Insurance Policy', docCode: 'REQ-02', isRequired: 'Yes', fileFormat: 'PDF', status: 'Active', created: '2026-01-01' },
    { id: 'DOC-803', name: 'Civil ID / Passport', docCode: 'REQ-03', isRequired: 'Yes', fileFormat: 'PDF, PNG, JPG', status: 'Active', created: '2026-01-01' },
    { id: 'DOC-804', name: 'Customs Release', docCode: 'REQ-04', isRequired: 'No', fileFormat: 'PDF', status: 'Inactive', created: '2026-02-28' },
  ]);

  // Form states for creating/editing
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    chassisNo: '',
    code: '',
    details: '',
    status: 'Active',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      chassisNo: '',
      code: '',
      module: '',
      displayOrder: '',
      details: '',
      category: '',
      resultType: '',
      fuelType: '',
      capacityRange: '',
      centreCode: '',
      location: '',
      capacity: '',
      city: '',
      region: '',
      description: '',
      lineCode: '',
      centre: '',
      type: '',
      ipAddress: '',
      assignedUser: '',
      streamUrl: '',
      line: '',
      terminalId: '',
      accountNo: '',
      docCode: '',
      isRequired: 'Yes',
      fileFormat: '',
      status: 'Active',
    });
  };

  // Helper to open Add modal
  const handleOpenAddModal = () => {
    resetForm();
    setShowNewModal(true);
  };

  // Helper to open Edit modal
  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    const formVals = { ...item };
    if (activeTab === 'Payment' && item.terminalId) {
      formVals.code = item.terminalId;
    } else if (activeTab === 'Document / File' && item.docCode) {
      formVals.code = item.docCode;
    } else if (activeTab === 'Manual Test' && item.testCode) {
      formVals.code = item.testCode;
    }
    setFormData(formVals);
    setShowEditModal(true);
    setActiveDropdownId(null);
  };

  // Helper to open View details modal
  const handleOpenView = (item: any) => {
    setSelectedItem(item);
    setShowViewModal(true);
    setActiveDropdownId(null);
  };

  // CRUD handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const generatedId = `ID-${Math.floor(100 + Math.random() * 900)}`;

    switch (activeTab) {
      case 'Vehicle':
        setVehicles([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            chassisNo: formData.chassisNo || '',
            category: formData.category || 'Light Vehicle',
            fuelType: formData.fuelType || 'Petrol',
            capacityRange: formData.capacityRange || 'N/A',
            code: formData.code || 'N/A',
            details: formData.details || 'N/A',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...vehicles,
        ]);
        break;
      case 'Manual Test':
        setTests([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            testCode: formData.code || 'N/A',
            category: formData.category || 'N/A',
            resultType: formData.resultType || 'Pass/Fail',
            details: formData.details || 'N/A',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...tests,
        ]);
        break;
      case 'Centre':
        setCentres([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            code: formData.code || 'N/A',
            city: formData.city || '',
            region: formData.region || '',
            description: formData.description || '',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...centres,
        ]);
        break;
      case 'Line':
        setLines([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            code: formData.code || 'N/A',
            module: formData.module || '',
            displayOrder: formData.displayOrder || '',
            details: formData.details || 'N/A',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...lines,
        ]);
        break;
      case 'Admin PC':
        setPcs([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            ipAddress: formData.ipAddress || '127.0.0.1',
            centre: formData.centre || 'Muscat Main Hub',
            assignedUser: formData.assignedUser || 'Staff',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
            code: formData.code || '',
            description: formData.description || '',
          },
          ...pcs,
        ]);
        break;
      case 'Camera / ANPR':
        setCameras([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            type: formData.type || '',
            line: formData.line || 'Line 1 (Light)',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
            code: formData.code || '',
            description: formData.description || '',
            centerCode: formData.centerCode || '',
          },
          ...cameras,
        ]);
        break;
      case 'Payment':
        setPayments([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            terminalId: formData.code || formData.terminalId || 'N/A',
            type: (formData.type as 'POS' | 'Online' | 'Cash') || 'POS',
            accountNo: formData.accountNo || 'N/A',
            description: formData.description || '',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...payments,
        ]);
        break;
      case 'Document / File':
        setDocuments([
          {
            id: generatedId,
            name: formData.name || 'Unnamed',
            docCode: formData.code || formData.docCode || 'N/A',
            isRequired: (formData.isRequired as 'Yes' | 'No') || 'Yes',
            fileFormat: formData.fileFormat || 'PDF',
            description: formData.description || '',
            status: (formData.status as 'Active' | 'Inactive') || 'Active',
            created: formattedDate,
          },
          ...documents,
        ]);
        break;
    }

    setShowNewModal(false);
    resetForm();
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    switch (activeTab) {
      case 'Vehicle':
        setVehicles(vehicles.map(v => (v.id === selectedItem.id ? { ...v, ...formData } as VehicleMaster : v)));
        break;
      case 'Manual Test':
        setTests(tests.map(t => (t.id === selectedItem.id ? { ...t, ...formData, testCode: formData.code } as unknown as TestMaster : t)));
        break;
      case 'Centre':
        setCentres(centres.map(c => (c.id === selectedItem.id ? { ...c, ...formData } as CentreMaster : c)));
        break;
      case 'Line':
        setLines(lines.map(l => (l.id === selectedItem.id ? { ...l, ...formData } as LineMaster : l)));
        break;
      case 'Admin PC':
        setPcs(pcs.map(p => (p.id === selectedItem.id ? { ...p, ...formData } as AdminPcMaster : p)));
        break;
      case 'Camera / ANPR':
        setCameras(cameras.map(c => (c.id === selectedItem.id ? { ...c, ...formData } as CameraMaster : c)));
        break;
      case 'Payment':
        setPayments(payments.map(p => (p.id === selectedItem.id ? { ...p, ...formData, terminalId: formData.code } as PaymentMaster : p)));
        break;
      case 'Document / File':
        setDocuments(documents.map(d => (d.id === selectedItem.id ? { ...d, ...formData, docCode: formData.code } as DocumentMaster : d)));
        break;
    }

    setShowEditModal(false);
    setSelectedItem(null);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
    setActiveDropdownId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    switch (activeTab) {
      case 'Vehicle':
        setVehicles(vehicles.filter(v => v.id !== deleteId));
        break;
      case 'Manual Test':
        setTests(tests.filter(t => t.id !== deleteId));
        break;
      case 'Centre':
        setCentres(centres.filter(c => c.id !== deleteId));
        break;
      case 'Line':
        setLines(lines.filter(l => l.id !== deleteId));
        break;
      case 'Admin PC':
        setPcs(pcs.filter(p => p.id !== deleteId));
        break;
      case 'Camera / ANPR':
        setCameras(cameras.filter(c => c.id !== deleteId));
        break;
      case 'Payment':
        setPayments(payments.filter(p => p.id !== deleteId));
        break;
      case 'Document / File':
        setDocuments(documents.filter(d => d.id !== deleteId));
        break;
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Switch display details based on active tab
  const getTabLabelAndSubtitle = () => {
    switch (activeTab) {
      case 'Vehicle':
        return { title: 'Vehicle Master', subtitle: 'Vehicle types, categories, fuel & capacity ranges' };
      case 'Manual Test':
        return { title: 'Manual Testing Master', subtitle: 'Manage testing categories, result types, and criteria' };
      case 'Centre':
        return { title: 'Centre Master', subtitle: 'Manage testing centers, locations, and operational capacities' };
      case 'Line':
        return { title: 'Line Master', subtitle: 'Inspection lines, lanes, and configurations per center' };
      case 'Admin PC':
        return { title: 'Admin PC Master', subtitle: 'Configured computer terminals and assigned receptionist users' };
      case 'Camera / ANPR':
        return { title: 'Camera & ANPR Master', subtitle: 'Automatic Number Plate Recognition (ANPR) cameras and feed setups' };
      case 'Payment':
        return { title: 'Payment Master', subtitle: 'Payment gateways, card reader terminals, and cash points' };
      case 'Document / File':
        return { title: 'Document Master', subtitle: 'Required attachments, documents, and upload formats' };
      default:
        return { title: 'Master Management', subtitle: 'Manage core system parameters and database registers' };
    }
  };

  const { title, subtitle } = getTabLabelAndSubtitle();

  // Retrieve current active list and filter/sort/slice it
  const getActiveList = (): any[] => {
    switch (activeTab) {
      case 'Vehicle': return vehicles;
      case 'Manual Test': return tests;
      case 'Centre': return centres;
      case 'Line': return lines;
      case 'Admin PC': return pcs;
      case 'Camera / ANPR': return cameras;
      case 'Payment': return payments;
      case 'Document / File': return documents;
      default: return [];
    }
  };

  const activeRawList = getActiveList();

  // Filter list by searchQuery
  const filteredList = activeRawList.filter((item: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    // Search across name, code/chassisNo/ipAddress/terminalId/location based on item
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      (item.chassisNo && item.chassisNo.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.fuelType && item.fuelType.toLowerCase().includes(q)) ||
      (item.capacityRange && item.capacityRange.toLowerCase().includes(q)) ||
      (item.testCode && item.testCode.toLowerCase().includes(q)) ||
      (item.centreCode && item.centreCode.toLowerCase().includes(q)) ||
      (item.lineCode && item.lineCode.toLowerCase().includes(q)) ||
      (item.ipAddress && item.ipAddress.toLowerCase().includes(q)) ||
      (item.terminalId && item.terminalId.toLowerCase().includes(q)) ||
      (item.docCode && item.docCode.toLowerCase().includes(q)) ||
      (item.details && item.details.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.capacity && item.capacity.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.region && item.region.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  // Sort list by Name
  const sortedList = [...filteredList].sort((a: any, b: any) => {
    if (sortAsc === null) return 0;
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Slice list for pagination
  const totalPages = Math.ceil(sortedList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = sortedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSort = () => {
    if (sortAsc === true) setSortAsc(false);
    else if (sortAsc === false) setSortAsc(true);
    else setSortAsc(true);
  };

  return (
    <div className="w-full flex flex-col pt-3 pb-8">
      {/* Title & Subtitle block */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight mb-1">{title}</h1>
        <p className="text-[14px] text-[#64748b] font-normal">{subtitle}</p>
      </div>

      {/* Tabs Header bar (placed directly on the page background) */}
      <div className="mb-5 flex flex-row">
        <div className="inline-flex bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          {(['Vehicle', 'Manual Test', 'Centre', 'Line', 'Admin PC', 'Camera / ANPR'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-[13.5px] font-semibold transition-all duration-150 cursor-pointer border-r border-neutral-200 last:border-r-0 ${isActive
                  ? 'bg-[#F5F7FA] text-[#101828] font-bold'
                  : 'bg-white text-[#475467] hover:bg-neutral-50 hover:text-[#101828]'
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search bar & Action Button (placed directly on the page background) */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
        {/* Search box */}
        <div className="relative w-full max-w-[340px]">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* New Button */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white font-medium text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
          </svg>
          <span>{activeTab === 'Camera / ANPR' ? 'Add Camera/ANPR' : `New ${activeTab === 'Document / File' ? 'Document' : activeTab}`}</span>
        </button>
      </div>

      {/* Main card box containing only the table */}
      <div className="w-full bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Table representation */}
        <div className="w-full overflow-x-auto">
          {paginatedList.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1e293b] mb-0.5">No Master Records Found</p>
              <p className="text-[13px] text-[#64748b] max-w-[280px]">No entries match your filter. Try adjusting your search query or clear the filter.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-[13px] rounded-lg transition-all cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  <th
                    onClick={toggleSort}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '20%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Name
                      <svg
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${!sortAsc ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </th>

                  {activeTab === 'Vehicle' && (
                    <>
                      <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px' }}>Chassis No</th>
                      <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px' }}>Code</th>
                      <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px' }}>Details</th>
                    </>
                  )}

                  {activeTab !== 'Vehicle' && (
                    <>
                      <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px' }}>Code</th>
                      <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px' }}>Details</th>
                    </>
                  )}

                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '10%' }}>Status</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '12%' }}>Created</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold text-right" style={{ padding: '12px 20px', width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 transition-colors duration-150 hover:bg-gray-50/80 bg-white group">
                    {/* Name */}
                    <td className="px-6 py-4.5 text-sm font-semibold text-gray-900">
                      {item.name}
                    </td>

                    {/* Vehicle-specific */}
                    {activeTab === 'Vehicle' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.chassisNo || '—'}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.code}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium truncate max-w-[200px]" title={item.details}>
                          {item.details}
                        </td>
                      </>
                    )}

                    {/* Test-specific */}
                    {activeTab === 'Manual Test' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.testCode}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{item.details || '—'}</td>
                      </>
                    )}

                    {/* Centre-specific */}
                    {activeTab === 'Centre' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.code}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{item.city}, {item.region} — {item.description}</td>
                      </>
                    )}

                    {/* Line-specific */}
                    {activeTab === 'Line' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.code}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium truncate max-w-[200px]" title={item.details}>{item.details || '—'}</td>
                      </>
                    )}

                    {/* Admin PC-specific */}
                    {activeTab === 'Admin PC' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.ipAddress}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{item.centre} — Assigned: {item.assignedUser}</td>
                      </>
                    )}

                    {/* Camera-specific */}
                    {activeTab === 'Camera / ANPR' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.code || '—'}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium truncate max-w-[200px]" title={item.description || item.type}>
                          {item.type ? `[${item.type}] ` : ''}{item.description || '—'}
                        </td>
                      </>
                    )}

                    {/* Payment-specific */}
                    {activeTab === 'Payment' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.terminalId}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{item.type} — Account: {item.accountNo}</td>
                      </>
                    )}

                    {/* Document-specific */}
                    {activeTab === 'Document / File' && (
                      <>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.docCode}</td>
                        <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">Required: {item.isRequired} — Formats: {item.fileFormat}</td>
                      </>
                    )}

                    {/* Status badge */}
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                      <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border select-none ${item.status === 'Active'
                        ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                        : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
                        }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                      {item.created}
                    </td>

                    {/* Action button */}
                    <td className="px-6 py-4.5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                        }}
                        className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors inline-flex cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdownId === item.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-6 mt-1 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleOpenView(item)}
                            className="w-full px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer font-medium"
                          >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="w-full px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer font-medium"
                          >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            <span>Edit Record</span>
                          </button>
                          <div className="border-t border-neutral-100 my-1"></div>
                          <button
                            onClick={() => openDeleteModal(item.id)}
                            className="w-full px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer font-semibold"
                          >
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination control */}
        {sortedList.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between bg-white text-[13.5px]">
            <span className="text-gray-500 font-medium">
              Showing <span className="font-semibold text-neutral-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-semibold text-neutral-800">
                {Math.min(currentPage * ITEMS_PER_PAGE, sortedList.length)}
              </span>{' '}
              of <span className="font-semibold text-neutral-800">{sortedList.length}</span> results
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-gray-500 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer font-medium"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8.5 h-8.5 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${currentPage === pg
                    ? 'bg-[#171717] text-white shadow-sm border border-[#171717]'
                    : 'border border-neutral-200 text-gray-500 hover:bg-neutral-50'
                    }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-gray-500 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-neutral-800">Master Record Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-neutral-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-[14px]">
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Record ID</span>
                <span className="col-span-2 text-neutral-800 font-mono font-bold">{selectedItem.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.name}</span>
              </div>

              {activeTab === 'Vehicle' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Code</span>
                    <span className="col-span-2 text-neutral-800 font-semibold">{selectedItem.code}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Category</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.category}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Fuel Type</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.fuelType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Capacity Range</span>
                    <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.capacityRange}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Description</span>
                    <span className="col-span-2 text-neutral-700">{selectedItem.details}</span>
                  </div>
                </>
              )}

              {activeTab === 'Manual Test' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Code</span>
                    <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.testCode}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Test Type</span>
                    <span className="col-span-2 text-neutral-800 font-medium">{selectedItem.category}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Result Type</span>
                    <span className="col-span-2 text-neutral-800 font-medium">{selectedItem.resultType || '—'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Description</span>
                    <span className="col-span-2 text-neutral-700">{selectedItem.details || '—'}</span>
                  </div>
                </>
              )}

              {activeTab === 'Centre' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Centre Code</span>
                    <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.code}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">City</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.city}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Region</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.region}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Description</span>
                    <span className="col-span-2 text-neutral-700">{selectedItem.description}</span>
                  </div>
                </>
              )}

              {activeTab === 'Line' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Code</span>
                    <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.code}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Module</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.module || '—'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Display Order</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.displayOrder || '—'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Details</span>
                    <span className="col-span-2 text-neutral-700">{selectedItem.details}</span>
                  </div>
                </>
              )}

              {activeTab === 'Admin PC' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">IP Address</span>
                    <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.ipAddress}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Centre</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.centre}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Assigned User</span>
                    <span className="col-span-2 text-neutral-700">{selectedItem.assignedUser}</span>
                  </div>
                </>
              )}

              {activeTab === 'Camera / ANPR' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Camera IP</span>
                    <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.ipAddress}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Line Location</span>
                    <span className="col-span-2 text-neutral-800">{selectedItem.line}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Stream URL</span>
                    <span className="col-span-2 text-neutral-600 font-mono text-[12px] break-all">{selectedItem.streamUrl}</span>
                  </div>
                </>
              )}

              {activeTab === 'Payment' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Terminal ID</span>
                    <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.terminalId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Type</span>
                    <span className="col-span-2 text-neutral-800 font-semibold">{selectedItem.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Account / Drawer</span>
                    <span className="col-span-2 text-neutral-700 font-mono">{selectedItem.accountNo}</span>
                  </div>
                </>
              )}

              {activeTab === 'Document / File' && (
                <>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Document Code</span>
                    <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.docCode}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Required?</span>
                    <span className="col-span-2 text-neutral-800 font-semibold">{selectedItem.isRequired}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="text-gray-400 font-medium">Allowed Formats</span>
                    <span className="col-span-2 text-neutral-700 font-mono">{selectedItem.fileFormat}</span>
                  </div>
                </>
              )}

              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12.5px] font-bold ${selectedItem.status === 'Active' ? 'bg-emerald-50 text-[#047857]' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                    {selectedItem.status}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5">
                <span className="text-gray-400 font-medium">Created Date</span>
                <span className="col-span-2 text-neutral-700">{selectedItem.created}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[13px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          {activeTab === 'Vehicle' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[480px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Vehicle</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category, Fuel Type, Capacity Range */}
                  <div className="grid grid-cols-10 gap-3">
                    <div className="col-span-4">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Category</label>
                      <select
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 10px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '18px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Light Vehicle">Light Vehicle</option>
                        <option value="Heavy Vehicle">Heavy Vehicle</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Two-Wheeler">Two-Wheeler</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Fuel Type</label>
                      <select
                        required
                        value={formData.fuelType || ''}
                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 10px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '18px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Capacity Range</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.capacityRange || ''}
                        onChange={(e) => setFormData({ ...formData, capacityRange: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 3: Description Details */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center justify-between py-2 border-t border-b border-neutral-50">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#344054]">Status</span>
                      <span className="text-[12.5px] text-[#667085]">Set the operational status of the vehicle</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Manual Test' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[480px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Test</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Test Type & Result Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Test Type</label>
                      <select
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Safety">Safety</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Visual">Visual</option>
                        <option value="Mechanical">Mechanical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Result Type</label>
                      <select
                        required
                        value={formData.resultType || ''}
                        onChange={(e) => setFormData({ ...formData, resultType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Pass/Fail">Pass/Fail</option>
                        <option value="Numeric">Numeric</option>
                        <option value="Visual Confirmation">Visual Confirmation</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[14px] font-semibold text-[#344054]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Centre' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Centre</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: City & Region */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">City</label>
                      <select
                        required
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Muscat">Muscat</option>
                        <option value="Salalah">Salalah</option>
                        <option value="Sohar">Sohar</option>
                        <option value="Nizwa">Nizwa</option>
                        <option value="Sur">Sur</option>
                        <option value="Ibri">Ibri</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Region</label>
                      <select
                        required
                        value={formData.region || ''}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Muscat Governorate">Muscat Governorate</option>
                        <option value="Dhofar Governorate">Dhofar Governorate</option>
                        <option value="Al Batinah North">Al Batinah North</option>
                        <option value="Ad Dakhiliyah">Ad Dakhiliyah</option>
                        <option value="Ash Sharqiyah South">Ash Sharqiyah South</option>
                        <option value="Ad Dhahirah">Ad Dhahirah</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Line' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Line</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Module & Display Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Module</label>
                      <select
                        required
                        value={formData.module || ''}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Safety">Safety</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Visual">Visual</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Display Order</label>
                      <select
                        required
                        value={formData.displayOrder || ''}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={String(num)}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Admin PC' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Admin PC</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">IP Address</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.ipAddress || ''}
                        onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                      <select
                        required
                        value={formData.centre || ''}
                        onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Camera / ANPR' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Camera / ANPR</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                      <select
                        required
                        value={formData.line || ''}
                        onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {lines.map(l => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Center Code</label>
                      <input
                        type="text"
                        placeholder="Enter"
                        value={formData.centerCode || ''}
                        onChange={(e) => setFormData({ ...formData, centerCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Payment' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Payment</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.accountNo || ''}
                        onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Terminal Mode</label>
                      <select
                        required
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="POS">POS Terminal</option>
                        <option value="Online">Online Gateway</option>
                        <option value="Cash">Cash Counter Drawer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Document / File' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Add Document</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Allowed Formats</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PDF, JPG, PNG"
                        value={formData.fileFormat || ''}
                        onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Mandatory</label>
                      <select
                        required
                        value={formData.isRequired || ''}
                        onChange={(e) => setFormData({ ...formData, isRequired: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          {activeTab === 'Vehicle' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[480px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Vehicle</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category, Fuel Type, Capacity Range */}
                  <div className="grid grid-cols-10 gap-3">
                    <div className="col-span-4">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Category</label>
                      <select
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 10px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '18px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Light Vehicle">Light Vehicle</option>
                        <option value="Heavy Vehicle">Heavy Vehicle</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Two-Wheeler">Two-Wheeler</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Fuel Type</label>
                      <select
                        required
                        value={formData.fuelType || ''}
                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 10px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '18px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Capacity Range</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.capacityRange || ''}
                        onChange={(e) => setFormData({ ...formData, capacityRange: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 3: Description Details */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center justify-between py-2 border-t border-b border-neutral-50">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#344054]">Status</span>
                      <span className="text-[12.5px] text-[#667085]">Set the operational status of the vehicle</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Manual Test' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[480px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Test</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.testCode || formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Test Type & Result Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Test Type</label>
                      <select
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Safety">Safety</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Visual">Visual</option>
                        <option value="Mechanical">Mechanical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Result Type</label>
                      <select
                        required
                        value={formData.resultType || ''}
                        onChange={(e) => setFormData({ ...formData, resultType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Pass/Fail">Pass/Fail</option>
                        <option value="Numeric">Numeric</option>
                        <option value="Visual Confirmation">Visual Confirmation</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[14px] font-semibold text-[#344054]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Centre' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Centre</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: City & Region */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">City</label>
                      <select
                        required
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Muscat">Muscat</option>
                        <option value="Salalah">Salalah</option>
                        <option value="Sohar">Sohar</option>
                        <option value="Nizwa">Nizwa</option>
                        <option value="Sur">Sur</option>
                        <option value="Ibri">Ibri</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Region</label>
                      <select
                        required
                        value={formData.region || ''}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Muscat Governorate">Muscat Governorate</option>
                        <option value="Dhofar Governorate">Dhofar Governorate</option>
                        <option value="Al Batinah North">Al Batinah North</option>
                        <option value="Ad Dakhiliyah">Ad Dakhiliyah</option>
                        <option value="Ash Sharqiyah South">Ash Sharqiyah South</option>
                        <option value="Ad Dhahirah">Ad Dhahirah</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Line' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Line</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Module & Display Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Module</label>
                      <select
                        required
                        value={formData.module || ''}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Safety">Safety</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Visual">Visual</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Display Order</label>
                      <select
                        required
                        value={formData.displayOrder || ''}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={String(num)}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Admin PC' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Admin PC</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: IP Address & Line */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">IP Address</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.ipAddress || ''}
                        onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                      <select
                        required
                        value={formData.centre || ''}
                        onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Camera / ANPR' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Camera / ANPR</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Type & Line */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                      <select
                        required
                        value={formData.line || ''}
                        onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        {lines.map(l => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Center Code</label>
                      <input
                        type="text"
                        placeholder="Enter"
                        value={formData.centerCode || ''}
                        onChange={(e) => setFormData({ ...formData, centerCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 4: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 5: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 6: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Payment' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Payment</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Account Number & Terminal Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.accountNo || ''}
                        onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Terminal Mode</label>
                      <select
                        required
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="POS">POS Terminal</option>
                        <option value="Online">Online Gateway</option>
                        <option value="Cash">Cash Counter Drawer</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === 'Document / File' ? (
            <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[500px] border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="text-[18px] font-bold text-[#101828]">Edit Document</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="p-6 space-y-5">
                  {/* Row 1: Name & Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Allowed Formats & Mandatory */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Allowed Formats</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PDF, JPG, PNG"
                        value={formData.fileFormat || ''}
                        onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Mandatory</label>
                      <select
                        required
                        value={formData.isRequired || ''}
                        onChange={(e) => setFormData({ ...formData, isRequired: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '16px',
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Row 4: Custom Capsule Active Toggle */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active'
                      })}
                      className="focus:outline-none cursor-pointer flex items-center gap-3"
                    >
                      <div className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                        ? 'bg-[#171717] border-[#171717]'
                        : 'bg-[#f2f4f7] border-[#d0d5dd]'
                        }`}>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-opacity duration-200 leading-none ${formData.status === 'Active' ? 'text-white opacity-100' : 'text-transparent opacity-0'
                          }`}>
                          |
                        </span>
                        <div className={`absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-[24px]' : 'translate-x-0'
                          }`} />
                      </div>
                      <span className="text-[15px] font-semibold text-[#101828]">Active</span>
                    </button>
                  </div>

                  {/* Row 5: Action buttons in bottom right */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-[16px] w-[400px] p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" style={{ fill: '#FEE4E2', fillOpacity: 1 }} />
                <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" style={{ stroke: '#FEF3F2', strokeOpacity: 1 }} strokeWidth="8" />
                <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#D92D20" style={{ stroke: '#D92D20', strokeOpacity: 1 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Delete Record</h3>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-[14px] text-slate-700 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#dc2626] font-semibold text-[14px] rounded-lg transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterManagementPage;
