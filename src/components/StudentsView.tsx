import React, { useState } from 'react';
import { Student, AppConfig } from '../types';
import { exportStudentsToCsv } from '../utils/exportCsv';
import {
  Users,
  UserPlus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  config: AppConfig;
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onImportStudents: (students: Student[]) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  config,
  onSaveStudent,
  onDeleteStudent,
  onImportStudents
}) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // New or edit form state
  const [formNis, setFormNis] = useState('');
  const [formName, setFormName] = useState('');
  const [formClass, setFormClass] = useState(config.className || 'Kelas IV');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama lengkap siswa wajib diisi!');
      return;
    }

    const studentToSave: Student = {
      id: editingStudent ? editingStudent.id : `STU-${Date.now()}`,
      nis: formNis.trim(),
      name: formName.trim(),
      className: formClass.trim() || config.className || 'Kelas IV',
      gender: formGender,
      status: formStatus
    };

    onSaveStudent(studentToSave);
    handleReset();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormNis(student.nis || '');
    setFormName(student.name);
    setFormClass(student.className);
    setFormGender(student.gender);
    setFormStatus(student.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingStudent(null);
    setFormNis('');
    setFormName('');
    setFormClass(config.className || 'Kelas IV');
    setFormGender('L');
    setFormStatus('Aktif');
  };

  // CSV Import
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r\n|\n/);
      const newStudents: Student[] = [];

      // Skip header if line 0 has 'NIS' or 'Nama'
      const startIdx = lines[0].toLowerCase().includes('nama') || lines[0].toLowerCase().includes('nis') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV splitter handling quoted values
        const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 2 && cols[1]) {
          const nis = cols[0] || '';
          const name = cols[1];
          const className = cols[2] || config.className || 'Kelas IV';
          const gender = (cols[3] && cols[3].toUpperCase().startsWith('P')) ? 'P' : 'L';
          const status = (cols[4] && cols[4].toLowerCase().includes('non')) ? 'Nonaktif' : 'Aktif';

          newStudents.push({
            id: `STU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nis,
            name,
            className,
            gender,
            status
          });
        }
      }

      if (newStudents.length > 0) {
        onImportStudents(newStudents);
        alert(`Berhasil mengimpor ${newStudents.length} data siswa dari berkas CSV!`);
      } else {
        alert('Tidak ada baris data siswa yang valid ditemukan dalam file CSV.');
      }
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === 'Semua' || s.gender === filterGender;
    const matchesStatus = filterStatus === 'Semua' || s.status === filterStatus;
    return matchesSearch && matchesGender && matchesStatus;
  });

  const totalActive = students.filter(s => s.status === 'Aktif').length;
  const countL = students.filter(s => s.gender === 'L' && s.status === 'Aktif').length;
  const countP = students.filter(s => s.gender === 'P' && s.status === 'Aktif').length;

  return (
    <div className="space-y-6">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Siswa Terdaftar</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{students.length} Siswa</p>
            <p className="text-[11px] text-emerald-600 font-medium">{totalActive} siswa berstatus aktif</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Laki-laki (L)</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{countL} Siswa</p>
            <p className="text-[11px] text-slate-500 font-medium">{totalActive > 0 ? ((countL / totalActive) * 100).toFixed(0) : 0}% dari siswa aktif</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            L
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Perempuan (P)</p>
            <p className="text-2xl font-black text-pink-600 mt-1">{countP} Siswa</p>
            <p className="text-[11px] text-slate-500 font-medium">{totalActive > 0 ? ((countP / totalActive) * 100).toFixed(0) : 0}% dari siswa aktif</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm">
            P
          </div>
        </div>
      </div>

      {/* Add / Edit Student Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingStudent ? `Sunting Data Siswa: ${editingStudent.name}` : 'Tambah Peserta Didik Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Masukkan identitas siswa untuk keperluan absensi daring dan rekap nilai
              </p>
            </div>
          </div>

          {/* Import / Export Buttons */}
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-200 transition-colors">
              <Upload size={14} />
              <span>Impor CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={() => exportStudentsToCsv(students)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Download size={14} />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NIS / NISN
              </label>
              <input
                type="text"
                value={formNis}
                onChange={e => setFormNis(e.target.value)}
                placeholder="20240401"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                required
                placeholder="Nama lengkap siswa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kelas
              </label>
              <input
                type="text"
                value={formClass}
                onChange={e => setFormClass(e.target.value)}
                placeholder="Kelas IV"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jenis Kelamin
              </label>
              <select
                value={formGender}
                onChange={e => setFormGender(e.target.value as 'L' | 'P')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formStatus === 'Aktif'}
                  onChange={e => setFormStatus(e.target.checked ? 'Aktif' : 'Nonaktif')}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span>Status Peserta Didik Aktif</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              {editingStudent && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Save size={15} />
                <span>{editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Peserta Didik ({filteredStudents.length})
            </h2>
            <p className="text-xs text-slate-500">
              Siswa SDN 32 Rantau Bayur yang terdaftar pada sistem
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIS..."
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 w-48 bg-white"
              />
            </div>

            {/* Gender filter */}
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Semua">Semua Gender</option>
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5 w-10 text-center">No</th>
                <th className="py-3 px-3.5 w-28">NIS / NISN</th>
                <th className="py-3 px-3.5">Nama Lengkap Siswa</th>
                <th className="py-3 px-3.5 w-24">Kelas</th>
                <th className="py-3 px-3.5 w-20 text-center">L/P</th>
                <th className="py-3 px-3.5 w-28 text-center">Status</th>
                <th className="py-3 px-3.5 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada data peserta didik yang cocok.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3.5 font-mono text-slate-600">{st.nis || '-'}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900">{st.name}</td>
                    <td className="py-3 px-3.5 text-slate-600">{st.className}</td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          st.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {st.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          st.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(st)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Sunting Siswa"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data peserta didik "${st.name}"?`)) {
                              onDeleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
