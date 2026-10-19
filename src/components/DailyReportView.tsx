import React, { useState } from 'react';
import { DailyReport, Student, AppConfig } from '../types';
import {
  FileText,
  Plus,
  Save,
  RotateCcw,
  Printer,
  Edit2,
  Trash2,
  Search,
  Copy,
  AlertCircle
} from 'lucide-react';

interface DailyReportViewProps {
  reports: DailyReport[];
  students: Student[];
  config: AppConfig;
  onSaveReport: (report: DailyReport) => void;
  onDeleteReport: (id: string) => void;
  onPrintSingleReport: (report: DailyReport) => void;
}

export const DailyReportView: React.FC<DailyReportViewProps> = ({
  reports,
  students,
  config,
  onSaveReport,
  onDeleteReport,
  onPrintSingleReport
}) => {
  const activeStudentCount = students.filter(s => s.status === 'Aktif').length;
  const todayStr = new Date().toISOString().split('T')[0];

  const emptyFormData: DailyReport = {
    id: '',
    date: todayStr,
    className: config.className || 'Kelas IV',
    subject: '',
    topic: '',
    time: '2 x 35 Menit (08.00 - 09.10 WIB)',
    objective: '',
    method: 'Diskusi Daring, Pengamatan Mandiri',
    media: 'WhatsApp Group, Video Edukasi, LKPD Digital',
    platform: 'WhatsApp Group & Google Meet',
    link: '',
    intro: 'Guru menyapa, memeriksa kehadiran lewat WhatsApp Group, berdoa bersama, dan apersepsi motivasi.',
    core: 'Penyampaian materi pembelajaran, tanya jawab interaktif melalui voice note/chat, dan penugasan lembar kerja.',
    close: 'Guru dan siswa membuat kesimpulan bersama, refleksi pembelajaran, dan doa penutup.',
    attTotal: activeStudentCount || 15,
    attHadir: activeStudentCount || 15,
    attSakit: 0,
    attIzin: 0,
    attAlpa: 0,
    task: '',
    taskDeadline: todayStr,
    result: '',
    obstacle: '',
    followup: '',
    reflection: '',
    createdAt: ''
  };

  const [formData, setFormData] = useState<DailyReport>(emptyFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Semua');

  // Input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const recordedAttendance = formData.attHadir + formData.attSakit + formData.attIzin + formData.attAlpa;
  const unrecordedCount = Math.max(0, formData.attTotal - recordedAttendance);
  const isAttendanceOver = recordedAttendance > formData.attTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.className || !formData.subject || !formData.topic) {
      alert('Mohon lengkapi kolom wajib: Tanggal, Kelas, Mata Pelajaran, dan Pokok Bahasan Materi!');
      return;
    }

    if (isAttendanceOver) {
      alert(`Perhatian: Jumlah hadir (${formData.attHadir}) + sakit (${formData.attSakit}) + izin (${formData.attIzin}) + alpa (${formData.attAlpa}) = ${recordedAttendance}, melebihi total siswa (${formData.attTotal})!`);
      return;
    }

    const reportToSave: DailyReport = {
      ...formData,
      id: formData.id || `REP-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    onSaveReport(reportToSave);
    handleReset();
    alert('Laporan Pembelajaran Daring berhasil disimpan!');
  };

  const handleEdit = (report: DailyReport) => {
    setFormData(report);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicate = (report: DailyReport) => {
    setFormData({
      ...report,
      id: '',
      date: todayStr,
      taskDeadline: todayStr,
      topic: `${report.topic} (Lanjutan)`
    });
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      ...emptyFormData,
      attTotal: activeStudentCount || 15,
      attHadir: activeStudentCount || 15,
      className: config.className || 'Kelas IV'
    });
    setIsEditing(false);
  };

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.includes(searchQuery);

    const matchesSubject = filterSubject === 'Semua' || r.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Extract unique subjects for filter
  const uniqueSubjects = Array.from(new Set(reports.map(r => r.subject))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Sunting Laporan Pembelajaran' : 'Entri Laporan Pembelajaran Daring'}
              </h2>
              <p className="text-xs text-slate-500">
                Lengkapi rincian proses belajar, metode, presensi siswa, dan evaluasi hasil belajar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Formulir</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-7">
          {/* BAGIAN A: IDENTITAS PEMBELAJARAN */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center justify-center text-[10px]">A</span>
                <span>Identitas Pembelajaran</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">* Kolom wajib diisi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggal Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Kelas IV"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: IPAS, Matematika, B. Indonesia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="Contoh: 2 x 35 Menit (08.00 - 09.10)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Materi Pokok Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Bagian Tubuh Tumbuhan dan Fungsinya"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tujuan Pembelajaran
                </label>
                <textarea
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Kemampuan dan capaian yang diharapkan dikuasai peserta didik..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN B: PELAKSANAAN & METODE */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center justify-center text-[10px]">B</span>
                <span>Pelaksanaan & Metode Pembelajaran Daring</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Metode Pembelajaran
                </label>
                <input
                  type="text"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  placeholder="Diskusi daring, tanya jawab, penugasan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Media / Sumber Belajar
                </label>
                <input
                  type="text"
                  name="media"
                  value={formData.media}
                  onChange={handleChange}
                  placeholder="Video YouTube, Canva, LKPD Digital"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Daring
                </label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="WhatsApp Group, Google Meet, Zoom"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tautan / Link Materi
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Kegiatan Pendahuluan
                </label>
                <textarea
                  name="intro"
                  value={formData.intro}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Salam, absensi awal, doa, apersepsi, motivasi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Kegiatan Inti
                </label>
                <textarea
                  name="core"
                  value={formData.core}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Penyampaian konsep materi, interaksi tanya jawab, pengerjaan LKPD..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Kegiatan Penutup
                </label>
                <textarea
                  name="close"
                  value={formData.close}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Refleksi dan simpulan bersama siswa, umpan balik, doa penutup..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN C: REKAP KEHADIRAN SESI */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center justify-center text-[10px]">C</span>
                <span>Rekapitulasi Kehadiran Sesi Ini</span>
              </h3>
              {isAttendanceOver && (
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertCircle size={14} /> Kehadiran melebihi total siswa!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Total Siswa Terdaftar
                </label>
                <input
                  type="number"
                  min="0"
                  name="attTotal"
                  value={formData.attTotal}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 font-bold text-base rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                  Hadir
                </label>
                <input
                  type="number"
                  min="0"
                  name="attHadir"
                  value={formData.attHadir}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 font-bold text-base rounded-lg border border-emerald-300 bg-white text-emerald-900"
                />
              </div>

              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <label className="block text-[11px] font-bold text-amber-800 mb-1">
                  Sakit
                </label>
                <input
                  type="number"
                  min="0"
                  name="attSakit"
                  value={formData.attSakit}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 font-bold text-base rounded-lg border border-amber-300 bg-white text-amber-900"
                />
              </div>

              <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-200">
                <label className="block text-[11px] font-bold text-sky-800 mb-1">
                  Izin
                </label>
                <input
                  type="number"
                  min="0"
                  name="attIzin"
                  value={formData.attIzin}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 font-bold text-base rounded-lg border border-sky-300 bg-white text-sky-900"
                />
              </div>

              <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200">
                <label className="block text-[11px] font-bold text-rose-800 mb-1">
                  Alpa / Tanpa Ket.
                </label>
                <input
                  type="number"
                  min="0"
                  name="attAlpa"
                  value={formData.attAlpa}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 font-bold text-base rounded-lg border border-rose-300 bg-white text-rose-900"
                />
              </div>

              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Sisa Belum Terdata
                </label>
                <div className="text-base font-bold text-slate-700 py-1.5 px-3 bg-slate-200/60 rounded-lg">
                  {unrecordedCount}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN D: EVALUASI & TINDAK LANJUT */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center justify-center text-[10px]">D</span>
                <span>Evaluasi, Kendala & Tindak Lanjut Guru</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tugas / Asesmen yang Diberikan
                </label>
                <input
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  placeholder="Contoh: Latihan soal mandiri LKPD halaman 12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Batas Waktu Pengumpulan
                </label>
                <input
                  type="date"
                  name="taskDeadline"
                  value={formData.taskDeadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ringkasan Ketercapaian Hasil Belajar Siswa
                </label>
                <textarea
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Tingkat pemahaman siswa secara umum, persentase tuntas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kendala / Hambatan yang Ditemukan
                </label>
                <textarea
                  name="obstacle"
                  value={formData.obstacle}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Kendala sinyal, keterbatasan gawai, partisipasi aktif..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tindak Lanjut & Pendampingan Guru
                </label>
                <textarea
                  name="followup"
                  value={formData.followup}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Remedial, pendampingan japri WhatsApp, tugas susulan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Refleksi Diri Pengajar
                </label>
                <textarea
                  name="reflection"
                  value={formData.reflection}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Catatan perbaikan untuk perencanaan pembelajaran berikutnya..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {isEditing ? (
                <span className="font-semibold text-amber-700">Sedang menyunting laporan ID: {formData.id}</span>
              ) : (
                <span>Formulir entri baru siap disimpan</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal Sunting
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Save size={16} />
                <span>{isEditing ? 'Simpan Perubahan Laporan' : 'Simpan Laporan Pembelajaran'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Saved Reports List Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Laporan Pembelajaran Tersimpan ({filteredReports.length})
            </h2>
            <p className="text-xs text-slate-500">
              Arsip laporan pembelajaran harian SDN 32 Rantau Bayur
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari materi, mapel, tanggal..."
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 w-52 bg-white"
              />
            </div>

            {/* Filter Subject */}
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
                <th className="py-3 px-3.5 w-28">Tanggal</th>
                <th className="py-3 px-3.5 w-32">Kelas & Mapel</th>
                <th className="py-3 px-3.5">Materi Pokok</th>
                <th className="py-3 px-3.5 w-28 text-center">Kehadiran</th>
                <th className="py-3 px-3.5 w-36">Media & Platform</th>
                <th className="py-3 px-3.5 w-40 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada laporan pembelajaran ditemukan.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep, idx) => (
                  <tr key={rep.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3.5 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{rep.date}</td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-blue-900 block">{rep.subject}</span>
                      <span className="text-[11px] text-slate-500">{rep.className}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-slate-900 line-clamp-2">{rep.topic}</div>
                      {rep.task && (
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          Tugas: {rep.task}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rep.attHadir} / {rep.attTotal}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        S:{rep.attSakit} I:{rep.attIzin} A:{rep.attAlpa}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-[11px] text-slate-600">
                      <div>{rep.platform || '-'}</div>
                      <div className="text-slate-400 truncate max-w-[140px]">{rep.media || '-'}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintSingleReport(rep)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Cetak Lembar Laporan A4/PDF"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(rep)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Duplikasi Laporan"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(rep)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Sunting Laporan"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus laporan pembelajaran "${rep.subject} - ${rep.topic}" pada tanggal ${rep.date}?`)) {
                              onDeleteReport(rep.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Laporan"
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
