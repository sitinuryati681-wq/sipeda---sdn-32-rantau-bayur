import React from 'react';
import { AppConfig, DailyReport, Student, GradeRecord, ViewTab } from '../types';
import { exportMonthlyWordDoc } from '../utils/exportWord';
import { exportStudentsToCsv, exportGradesToCsv, exportReportsToCsv } from '../utils/exportCsv';
import { exportBackupJSON } from '../utils/storage';
import {
  Printer,
  FileDown,
  FileSpreadsheet,
  Database,
  Users,
  GraduationCap,
  FileText,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ExportCenterViewProps {
  config: AppConfig;
  reports: DailyReport[];
  students: Student[];
  grades: GradeRecord[];
  attendance: any[];
  onNavigate: (tab: ViewTab) => void;
  onPrintRecap: (reports: DailyReport[], title: string) => void;
}

export const ExportCenterView: React.FC<ExportCenterViewProps> = ({
  config,
  reports,
  students,
  grades,
  attendance,
  onNavigate,
  onPrintRecap
}) => {
  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Printer size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pusat Cetak & Ekspor Dokumen Resmi</h2>
            <p className="text-xs text-slate-500">
              Pilih format berkas untuk keperluan cetak fisik kertas A4, arsip digital pengawas, atau pengolahan lebih lanjut
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Option 1: Cetak Lembar Harian */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Cetak Laporan Harian (A4/PDF)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cetak 1 lembar laporan pembelajaran harian lengkap dengan Kop Sekolah resmi dan tanda tangan dua sisi.
              </p>
            </div>
            <button
              onClick={() => onNavigate('laporan')}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              <span>Pilih Laporan di Menu Laporan</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Option 2: Cetak Rekap Bulanan */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-purple-50/40 hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3">
                <Printer size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Cetak Rekap Bulanan (A4/PDF)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cetak rekapitulasi satu bulan penuh yang terstruktur rapi untuk pelaporan dinas dan pengesahan kepala sekolah.
              </p>
            </div>
            <button
              onClick={() => onNavigate('rekap')}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors"
            >
              <span>Buka Menu Rekap Bulanan</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Option 3: Unduh Dokumen Word (.doc) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FileDown size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ekspor Microsoft Word (.doc)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unduh seluruh rekaman laporan pembelajaran dalam format dokumen Word murni yang dapat disunting kembali di laptop.
              </p>
            </div>
            <button
              onClick={() => exportMonthlyWordDoc(config, reports, 'Rekapitulasi Seluruh Pembelajaran Daring')}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              <span>Unduh Word (.doc) Sekarang</span>
            </button>
          </div>

          {/* Option 4: Ekspor Laporan CSV */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/40 hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ekspor Laporan ke CSV / Excel</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Simpan data laporan dalam tabel terpisah (.csv) yang kompatibel dengan Microsoft Excel dan Google Sheets.
              </p>
            </div>
            <button
              onClick={() => exportReportsToCsv(reports)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
            >
              <span>Unduh Laporan (.csv)</span>
            </button>
          </div>

          {/* Option 5: Ekspor Siswa CSV */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/40 hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ekspor Daftar Siswa (.csv)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unduh berkas NIS, nama lengkap, jenis kelamin, dan status keaktifan seluruh siswa SDN 32 Rantau Bayur.
              </p>
            </div>
            <button
              onClick={() => exportStudentsToCsv(students)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors"
            >
              <span>Unduh Siswa (.csv)</span>
            </button>
          </div>

          {/* Option 6: Cadangan Lengkap JSON */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-3">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Cadangan Database Lengkap (.json)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Arsipkan seluruh laporan, siswa, nilai, presensi, dan profil guru dalam satu berkas cadangan aman.
              </p>
            </div>
            <button
              onClick={() => exportBackupJSON(config, students, reports, grades, attendance)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              <span>Unduh Backup JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
