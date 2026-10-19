import React, { useState } from 'react';
import { GradeRecord, Student } from '../types';
import { exportGradesToCsv } from '../utils/exportCsv';
import {
  GraduationCap,
  Save,
  RotateCcw,
  Download,
  Search,
  Edit2,
  Trash2,
  Award,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface GradesViewProps {
  grades: GradeRecord[];
  students: Student[];
  onSaveGrade: (grade: GradeRecord) => void;
  onDeleteGrade: (id: string) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  grades,
  students,
  onSaveGrade,
  onDeleteGrade
}) => {
  const activeStudents = students.filter(s => s.status === 'Aktif');
  const todayStr = new Date().toISOString().split('T')[0];

  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);
  const [formStudentId, setFormStudentId] = useState('');
  const [formSubject, setFormSubject] = useState('Matematika');
  const [formTaskName, setFormTaskName] = useState('');
  const [formScore, setFormScore] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Belum mengumpulkan' | 'Sudah mengumpulkan' | 'Perlu perbaikan'>('Sudah mengumpulkan');
  const [formNotes, setFormNotes] = useState('');
  const [formDate, setFormDate] = useState(todayStr);
  const [formDeadline, setFormDeadline] = useState(todayStr);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Semua');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formSubject || !formTaskName.trim()) {
      alert('Pilih siswa, mata pelajaran, dan nama tugas!');
      return;
    }

    const numericScore = formScore !== '' ? parseFloat(formScore) : null;
    if (numericScore !== null && (numericScore < 0 || numericScore > 100)) {
      alert('Rentang nilai harus berada di antara 0 sampai 100!');
      return;
    }

    const gradeToSave: GradeRecord = {
      id: editingGrade ? editingGrade.id : `GRD-${Date.now()}`,
      studentId: formStudentId,
      subject: formSubject.trim(),
      taskName: formTaskName.trim(),
      score: numericScore,
      status: formStatus,
      notes: formNotes.trim(),
      date: formDate,
      deadline: formDeadline
    };

    onSaveGrade(gradeToSave);
    handleReset();
    alert('Catatan nilai berhasil disimpan!');
  };

  const handleEdit = (grade: GradeRecord) => {
    setEditingGrade(grade);
    setFormStudentId(grade.studentId);
    setFormSubject(grade.subject);
    setFormTaskName(grade.taskName);
    setFormScore(grade.score !== null ? String(grade.score) : '');
    setFormStatus(grade.status);
    setFormNotes(grade.notes || '');
    setFormDate(grade.date || todayStr);
    setFormDeadline(grade.deadline || todayStr);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingGrade(null);
    setFormStudentId('');
    setFormTaskName('');
    setFormScore('');
    setFormStatus('Sudah mengumpulkan');
    setFormNotes('');
  };

  // Calculate statistics
  let totalScore = 0;
  let gradedCount = 0;
  let highestScore = 0;
  let lowestScore = 100;

  grades.forEach(g => {
    if (g.score !== null && !isNaN(g.score)) {
      totalScore += g.score;
      gradedCount++;
      if (g.score > highestScore) highestScore = g.score;
      if (g.score < lowestScore) lowestScore = g.score;
    }
  });

  const avgScore = gradedCount > 0 ? (totalScore / gradedCount).toFixed(1) : '-';

  // Filtered grades
  const filteredGrades = grades.filter(g => {
    const student = students.find(s => s.id === g.studentId);
    const studentName = student ? student.name.toLowerCase() : '';
    const matchesSearch =
      studentName.includes(searchQuery.toLowerCase()) ||
      g.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = filterSubject === 'Semua' || g.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subject))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Nilai Dinilai</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{gradedCount} Tugas</p>
            <p className="text-[11px] text-slate-500 font-medium">Dari {grades.length} entri penugasan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Rata-rata Kelas</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{avgScore}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Skala 0 - 100</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Nilai Tertinggi</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{gradedCount > 0 ? highestScore : '-'}</p>
            <p className="text-[11px] text-slate-500 font-medium">Hasil belajar terbaik</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            MAX
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Nilai Terendah</p>
            <p className="text-2xl font-black text-rose-700 mt-1">{gradedCount > 0 ? lowestScore : '-'}</p>
            <p className="text-[11px] text-slate-500 font-medium">Perlu bimbingan lanjutan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
            MIN
          </div>
        </div>
      </div>

      {/* Grade Entry Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingGrade ? 'Sunting Data Nilai & Tugas' : 'Pencatatan Nilai & Tugas Siswa'}
              </h2>
              <p className="text-xs text-slate-500">
                Rekap capaian asesmen formatif, lembar kerja, dan latihan mandiri peserta didik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportGradesToCsv(grades, students)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Download size={14} />
              <span>Ekspor Nilai CSV</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Siswa <span className="text-rose-500">*</span>
              </label>
              <select
                value={formStudentId}
                onChange={e => setFormStudentId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Pilih Siswa --</option>
                {activeStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.nis || 'No NIS'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                required
                placeholder="Contoh: Matematika, IPAS"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Tugas / Asesmen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formTaskName}
                onChange={e => setFormTaskName(e.target.value)}
                required
                placeholder="Contoh: Latihan Soal Pecahan Senilai No 1-5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nilai Angka (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={formScore}
                onChange={e => setFormScore(e.target.value)}
                placeholder="0 - 100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Pengumpulan
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Sudah mengumpulkan">Sudah mengumpulkan</option>
                <option value="Belum mengumpulkan">Belum mengumpulkan</option>
                <option value="Perlu perbaikan">Perlu perbaikan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Diberikan
              </label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Batas Pengumpulan
              </label>
              <input
                type="date"
                value={formDeadline}
                onChange={e => setFormDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Evaluasi Guru
              </label>
              <input
                type="text"
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                placeholder="Umpan balik, apresiasi hasil kerja, atau materi yang perlu diperbaiki"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingGrade && (
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
              <span>{editingGrade ? 'Simpan Perubahan' : 'Simpan Data Nilai'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Rekapitulasi Penilaian Siswa ({filteredGrades.length})
            </h2>
            <p className="text-xs text-slate-500">
              Daftar nilai tugas peserta didik SDN 32 Rantau Bayur
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
                placeholder="Cari nama atau tugas..."
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 w-48 bg-white"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Semua">Semua Mapel</option>
              {uniqueSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5 w-10 text-center">No</th>
                <th className="py-3 px-3.5">Nama Peserta Didik</th>
                <th className="py-3 px-3.5 w-28">Mata Pelajaran</th>
                <th className="py-3 px-3.5">Nama Asesmen / Tugas</th>
                <th className="py-3 px-3.5 w-32 text-center">Status</th>
                <th className="py-3 px-3.5 w-20 text-center">Nilai</th>
                <th className="py-3 px-3.5">Catatan Evaluasi</th>
                <th className="py-3 px-3.5 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Belum ada catatan nilai yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g, idx) => {
                  const student = students.find(s => s.id === g.studentId);
                  const name = student ? student.name : '(Siswa telah dihapus)';

                  return (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">{name}</td>
                      <td className="py-3 px-3.5 text-blue-900 font-semibold">{g.subject}</td>
                      <td className="py-3 px-3.5 font-medium text-slate-800">{g.taskName}</td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                            g.status === 'Sudah mengumpulkan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : g.status === 'Perlu perbaikan'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {g.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`text-sm font-extrabold ${
                            g.score !== null && g.score >= 80
                              ? 'text-emerald-700'
                              : g.score !== null && g.score >= 70
                              ? 'text-blue-700'
                              : g.score !== null
                              ? 'text-rose-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {g.score !== null ? g.score : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-500 text-[11px] max-w-xs truncate">
                        {g.notes || '-'}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEdit(g)}
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Sunting Nilai"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus catatan nilai tugas ini?`)) {
                                onDeleteGrade(g.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Nilai"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
