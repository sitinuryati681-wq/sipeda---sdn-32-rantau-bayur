import React, { useState } from 'react';
import { AppConfig, Student, DailyReport, GradeRecord, AttendanceRecord } from '../types';
import { exportBackupJSON, clearLocalStorage, resetToDemoData } from '../utils/storage';
import {
  Settings,
  Database,
  Upload,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  ShieldAlert,
  Info
} from 'lucide-react';

interface SettingsViewProps {
  config: AppConfig;
  students: Student[];
  reports: DailyReport[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onRestoreData: (
    config: AppConfig,
    students: Student[],
    reports: DailyReport[],
    grades: GradeRecord[],
    attendance: AttendanceRecord[]
  ) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  students,
  reports,
  grades,
  attendance,
  onRestoreData,
  onResetDemo,
  onClearAll
}) => {
  const [successMsg, setSuccessMsg] = useState('');

  const handleBackup = () => {
    exportBackupJSON(config, students, reports, grades, attendance);
    setSuccessMsg('Berkas cadangan JSON berhasil diunduh!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.app || parsed.app !== 'SIPEDA') {
          alert('Format berkas cadangan tidak dikenali. Pastikan file berasal dari ekspor resmi SIPEDA.');
          return;
        }

        if (confirm(`Pulihkan data dari cadangan "${parsed.school || 'SIPEDA'}" (Diekspor: ${parsed.exportedAt || '-'})? Seluruh data saat ini akan digantikan.`)) {
          onRestoreData(
            parsed.config || config,
            parsed.students || students,
            parsed.reports || reports,
            parsed.grades || grades,
            parsed.attendanceRecords || attendance
          );
          setSuccessMsg('Data cadangan berhasil dipulihkan secara utuh!');
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON. Berkas mungkin rusak atau tidak sesuai.');
      }
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  const handleResetToDemo = () => {
    if (confirm('Muat ulang data contoh resmi SDN 32 Rantau Bayur? Ini akan memperbarui data contoh siswa, laporan, dan nilai.')) {
      onResetDemo();
      setSuccessMsg('Data contoh SDN 32 Rantau Bayur berhasil dimuat!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleWipeAll = () => {
    const confirmation = prompt('PERINGATAN: Tindakan ini akan mengosongkan SELURUH data laporan, presensi, siswa, dan nilai dari peramban ini!\n\nKetik kata "HAPUS" dengan huruf kapital untuk menyetujui:');
    if (confirmation === 'HAPUS') {
      onClearAll();
      alert('Seluruh data aplikasi berhasil dikosongkan.');
    } else {
      alert('Pengosongan dibatalkan. Kata konfirmasi tidak cocok.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{successMsg}</p>
        </div>
      )}

      {/* Database Management Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manajemen Cadangan & Pemulihan Data</h2>
            <p className="text-xs text-slate-500">
              Simpan berkas cadangan secara berkala agar arsip pembelajaran tetap aman
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Keamanan Data Peramban Lokal:</span> Seluruh data SIPEDA tersimpan dalam peramban (browser) laptop/komputer Anda secara luring <i>(offline)</i> tanpa perlu server eksternal. Lakukan pengunduhan cadangan JSON sebelum membersihkan riwayat cache browser atau berpindah ke perangkat lain.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleBackup}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Download size={16} />
            <span>Unduh Cadangan Lengkap (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 cursor-pointer transition-colors">
            <Upload size={16} />
            <span>Pulihkan Data dari Berkas JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Database Status Chips */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Status Penyimpanan Lokal Saat Ini
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Laporan Tersimpan</span>
              <span className="text-base font-bold text-slate-900">{reports.length} Berkas</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Peserta Didik</span>
              <span className="text-base font-bold text-slate-900">{students.length} Siswa</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Data Penilaian</span>
              <span className="text-base font-bold text-slate-900">{grades.length} Nilai</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Presensi Sesi</span>
              <span className="text-base font-bold text-slate-900">{attendance.length} Rekaman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-rose-200 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-rose-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-950">Zona Tindakan Khusus & Pembersihan</h2>
            <p className="text-xs text-rose-600">
              Tindakan di bawah ini memengaruhi seluruh isi data tersimpan di peramban
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900">Muat Ulang Data Contoh SDN 32</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mengembalikan data contoh asli (Siti Nuryati, S.Pd., Gr., 15 siswa, dan sample laporan)
              </p>
            </div>
            <button
              onClick={handleResetToDemo}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors shrink-0"
            >
              Muat Ulang Demo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-rose-50/60 border border-rose-200 gap-3">
            <div>
              <p className="text-xs font-bold text-rose-900">Kosongkan Seluruh Basis Data</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Menghapus semua laporan, catatan nilai, kehadiran, dan data siswa secara permanen
              </p>
            </div>
            <button
              onClick={handleWipeAll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              Kosongkan Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
