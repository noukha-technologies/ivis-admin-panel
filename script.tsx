import * as fs from 'fs';
const path = 'src/pages/master-management/MasterManagementPage.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Update Interface
content = content.replace(
  /interface CameraMaster \{[\s\S]*?description\?: string;\s*\}/,
  (match: string) => match.replace('description?: string;', 'description?: string;\n  centerCode?: string;')
);

// 2. Update Create
content = content.replace(
  /case 'Camera \/ ANPR':\s*setCameras\(\[\s*\{([\s\S]*?)description: formData\.description \|\| '',\s*\}/,
  (match: string, p1: string) => {
    return match.replace(
      "description: formData.description || '',",
      "description: formData.description || '',\n            centerCode: formData.centerCode || '',"
    );
  }
);

// 3. Update Create Modal
let createModalRegex = /<h3 className="text-\[18px\] font-bold text-\[#101828\]">Add Camera \/ ANPR<\/h3>([\s\S]*?)<label className="block text-\[13px\] font-semibold text-\[#344054\] mb-1\.5">Description<\/label>/;
content = content.replace(createModalRegex, (match: string) => {
  let updated = match.replace(
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>',
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Name</label>'
  );
  updated = updated.replace(
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>',
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Code</label>'
  );
  
  updated = updated.replace(
    /<div className="grid grid-cols-2 gap-4">\s*(<div>\s*<label className="block text-\[13px\] font-semibold text-\[#344054\] mb-1\.5">Type<\/label>[\s\S]*?<\/select>\s*<\/div>)\s*<\/div>/,
    `<div className="grid grid-cols-3 gap-4">
                    $1
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
                  </div>`
  );
  return updated;
});

// 4. Update Edit Modal
let editModalRegex = /<h3 className="text-\[18px\] font-bold text-\[#101828\]">Edit Camera \/ ANPR<\/h3>([\s\S]*?)<label className="block text-\[13px\] font-semibold text-\[#344054\] mb-1\.5">Description<\/label>/;
content = content.replace(editModalRegex, (match: string) => {
  let updated = match.replace(
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>',
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Name</label>'
  );
  updated = updated.replace(
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>',
    '<label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Camera Code</label>'
  );
  
  updated = updated.replace(
    /<div className="grid grid-cols-2 gap-4">\s*(<div>\s*<label className="block text-\[13px\] font-semibold text-\[#344054\] mb-1\.5">Type<\/label>[\s\S]*?<\/select>\s*<\/div>)\s*<\/div>/,
    `<div className="grid grid-cols-3 gap-4">
                    $1
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
                  </div>`
  );
  return updated;
});

// 5. Optionally, update the table view (if they want Center Code shown there) but wait, the prompt only asks "here add Name called camera Name ,code called camera code , add a cemter code".
// "here" meaning the modal in the screenshot. So the modal is done. 

fs.writeFileSync(path, content, 'utf8');
console.log('Modifications complete.');
