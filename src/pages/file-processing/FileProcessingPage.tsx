import React, { useState, useRef, useEffect } from 'react';

interface FileLog {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  dateUploaded: string;
  totalRecords: number;
  status: 'Processed' | 'Processing' | 'Failed';
  failureReason?: string;
}

const FileProcessingPage: React.FC = () => {
  const [logs, setLogs] = useState<FileLog[]>([
    { id: 'FILE-301', fileName: 'ANPR_Muscat_Capture_20260522.csv', fileSize: '1.4 MB', uploadedBy: 'Salim Al-Harthy', dateUploaded: '2026-05-22', totalRecords: 4850, status: 'Processed' },
    { id: 'FILE-302', fileName: 'Vehicle_Sync_Salalah_Dump.xml', fileSize: '820 KB', uploadedBy: 'Ahmed Al-Riyami', dateUploaded: '2026-05-21', totalRecords: 1200, status: 'Processed' },
    { id: 'FILE-303', fileName: 'ROP_Blacklist_Updates.csv', fileSize: '340 KB', uploadedBy: 'Fatima Al-Siyabi', dateUploaded: '2026-05-20', totalRecords: 150, status: 'Processed' },
    { id: 'FILE-304', fileName: 'Sohar_Lane2_Corrupt_Log.csv', fileSize: '2.1 MB', uploadedBy: 'Mazin Al-Busaidi', dateUploaded: '2026-05-19', totalRecords: 0, status: 'Failed', failureReason: 'Parsing Error: Invalid UTF-8 delimiter at line 452' },
    { id: 'FILE-305', fileName: 'ANPR_Nizwa_Weekly_Backup.zip', fileSize: '14.5 MB', uploadedBy: 'Khalfan Al-Nabhani', dateUploaded: '2026-05-15', totalRecords: 12400, status: 'Processed' },
  ]);

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      simulateFileUpload(file.name, file.size);
    }
  };

  const simulateFileUpload = (name: string, size: number) => {
    setUploadFileName(name);
    setUploadState('uploading');
    setUploadProgress(0);

    // Simulate upload percentage
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(uploadInterval);
        
        // Move to processing state
        setUploadState('processing');
        
        setTimeout(() => {
          // Prepend new record to state list
          const sizeStr = size > 1024 * 1024 
            ? `${(size / (1024 * 1024)).toFixed(1)} MB` 
            : `${(size / 1024).toFixed(0)} KB`;

          const newLog: FileLog = {
            id: `FILE-${Math.floor(306 + Math.random() * 900)}`,
            fileName: name,
            fileSize: sizeStr,
            uploadedBy: 'Operator',
            dateUploaded: new Date().toISOString().split('T')[0],
            totalRecords: Math.floor(100 + Math.random() * 5000),
            status: 'Processed'
          };

          setLogs(prev => [newLog, ...prev]);
          setUploadState('done');
          
          setTimeout(() => {
            setUploadState('idle');
            setUploadProgress(null);
            setUploadFileName('');
          }, 2000);
        }, 1500);
      }
    }, 150);
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    setActiveDropdownId(null);
  };

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      log.fileName.toLowerCase().includes(q) ||
      log.uploadedBy.toLowerCase().includes(q) ||
      log.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full flex flex-col pt-3 pb-8">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight mb-1">File Processing</h1>
        <p className="text-[14px] text-[#64748b] font-normal font-sans">Import vehicle registration registers, ANPR daily log sheets, and database backups</p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="mb-6 bg-white border-2 border-dashed border-neutral-300 hover:border-neutral-400/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all shadow-sm">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".csv,.xml,.zip,.xlsx" 
        />
        
        {uploadState === 'idle' ? (
          <>
            <div className="w-14 h-14 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-500 border border-neutral-100 shadow-sm mb-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-800 mb-1">Select files to upload and process</h3>
            <p className="text-[12px] text-gray-400 mb-4 max-w-[360px]">Support CSV, XML, XLSX database backups, or compressed ANPR logs up to 50MB</p>
            <button 
              onClick={triggerFileSelect}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-[13px] rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Browse Files
            </button>
          </>
        ) : (
          <div className="w-full max-w-[420px] flex flex-col items-center py-2">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
              {uploadState === 'uploading' && (
                <svg className="w-5 h-5 animate-bounce text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5m0 0L7.5 12M12 16.5L16.5 12" />
                </svg>
              )}
              {uploadState === 'processing' && (
                <svg className="w-5 h-5 animate-spin text-neutral-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {uploadState === 'done' && (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>

            <p className="text-[14px] font-bold text-gray-800 truncate max-w-xs">{uploadFileName}</p>
            
            {uploadState === 'uploading' && (
              <div className="w-full mt-3">
                <div className="flex justify-between text-[11.5px] text-gray-500 font-bold mb-1 font-mono">
                  <span>Uploading to IVIS Server</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-800 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {uploadState === 'processing' && (
              <p className="text-[12.5px] text-neutral-500 mt-1 font-semibold animate-pulse">Validating data structure & uploading records to ROP register...</p>
            )}

            {uploadState === 'done' && (
              <p className="text-[12.5px] text-emerald-600 mt-1 font-bold">Successfully imported and logged!</p>
            )}
          </div>
        )}
      </div>

      {/* History log header and search */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-[16px] font-bold text-gray-800">Processing Activity History</h2>
        
        {/* Search */}
        <div className="relative w-full max-w-[280px]">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-[13px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="w-full bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <p className="text-[15px] font-semibold text-[#1e293b] mb-0.5">No Import Logs Found</p>
              <p className="text-[13px] text-[#64748b]">Try typing a different file name.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">File Name</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">Size</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">Imported By</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">Date Uploaded</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">Total Records</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold">Status</th>
                  <th className="px-5 py-3 text-[13.5px] text-[#667085] font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/80 bg-white transition-colors duration-150">
                    <td className="px-6 py-4.5 text-sm font-semibold text-gray-900">
                      <div className="flex flex-col">
                        <span>{log.fileName}</span>
                        {log.status === 'Failed' && log.failureReason && (
                          <span className="text-[11.5px] text-rose-500 mt-1 font-semibold font-mono">{log.failureReason}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 font-mono font-medium">{log.fileSize}</td>
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{log.uploadedBy}</td>
                    <td className="px-6 py-4.5 text-sm text-gray-500 font-medium">{log.dateUploaded}</td>
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-mono font-medium">
                      {log.totalRecords > 0 ? log.totalRecords.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4.5 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border select-none ${
                        log.status === 'Processed'
                          ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                          : log.status === 'Processing'
                          ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]'
                          : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-right relative">
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === log.id ? null : log.id)}
                        className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all cursor-pointer ml-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      </button>

                      {activeDropdownId === log.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-6 top-10 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeInMenu"
                        >
                          <button
                            onClick={() => { alert('Downloading source file...'); setActiveDropdownId(null); }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                          >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span>Download Source</span>
                          </button>
                          <button
                            onClick={() => { alert('Displaying import summary stats...'); setActiveDropdownId(null); }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                          >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <span>View Summary Log</span>
                          </button>
                          <div className="h-[1px] bg-neutral-100 my-1"></div>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                          >
                            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <span>Delete Record</span>
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
      </div>
    </div>
  );
};

export default FileProcessingPage;
