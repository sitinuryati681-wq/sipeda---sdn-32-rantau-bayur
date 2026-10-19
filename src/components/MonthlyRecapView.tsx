import React, { useState } from 'react';
import { DailyReport, AppConfig } from '../types';
import { exportMonthlyWordDoc } from '../utils/exportWord';
import {
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  Calendar,
  Layers,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MonthlyRecapViewProps {
  reports: DailyReport[];
  config: AppConfig;
  onPrintRecap: (reports: DailyReport[], filterTitle: string) => void;
}

export const MonthlyRecapView: React.FC<MonthlyRecapViewProps> = ({
  reports,
  config,
  onPrintRecap
}) => {
  const currentMonthStr = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentYearStr = String(new Date().getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  const monthsMap: Record<string, string> = {
    '01': 'Januari',
    '02': 'Februari',
    '03': 'Maret',
    '04': 'April',
    '05': 'Mei',
    '06': 'Juni',
    '07': 'Juli',
    '08': 'Agustus',
    '09': 'September',
    '10': 'Oktober',
    '11': 'November',
    '12': 'Desember'
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    if (!r.date) return false;
    const [y, m] = r.date.split('-');
    if (y !== selectedYear || m !== selectedMonth) return false;
    if (filterClass && !r.className.toLowerCase().includes(filterClass.toLowerCase())) return false;
    if (filterSubject && !r.subject.toLowerCase().includes(filterSubject.toLowerCase())) return false;
    return true;
  });

  // Sort chronologically
  filteredReports.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate stats
  let sumHadir = 0;
  let sumSakit = 0;
  let sumIzin = 0;
  let sumAlpa = 0;
  let sumTotal = 0;

  filteredReports.forEach(r => {
    sumHadir += r.attHadir || 0;
    sumSakit += r.attSakit || 0;
    sumIzin += r.attIzin || 0;
    sumAlpa += r.attAlpa || 0;
    sumTotal += r.attTotal || 0;
  });

  const avgAttendancePercent = sumTotal > 0 ? ((sumHadir / sumTotal) * 100).toFixed(1) : '0';
  const filterTitle = `Bulan ${monthsMap[selectedMonth]} Tahun ${selectedYear}${filterClass ? ` - ${filterClass}` : ''}${filterSubject ? ` - ${filterSubject}` : ''}`;

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Pembelajaran Bulanan</h2>
            <p className="text-xs text-slate-500">
              Filter berkas pembelajaran per bulan untuk pembuatan laporan resmi pengawas dan kepala sekolah
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bulan Pembelajaran
            </label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {Object.entries(monthsMap).map(([val, name]) => (
                <option key={val} value={val}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tahun
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Filter Kelas (Opsional)
            </label>
            <input
              type="text"
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              placeholder="Semua kelas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Filter Mata Pelajaran (Opsional)
            </label>
            <input
              type="text"
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              placeholder="Semua mata pelajaran"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Recap Output Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Hasil Rekapitulasi: {monthsMap[selectedMonth]} {selectedYear}
            </h3>
            <p className="text-xs text-slate-500">
              Ditemukan {filteredReports.length} sesi pembelajaran tercatat
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintRecap(filteredReports, filterTitle)}
              disabled={filteredReports.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white shadow-xs transition-all active:scale-95"
            >
              <Printer size={15} />
              <span>Cetak Rekap A4 / PDF</span>
            </button>

            <button
              onClick={() => exportMonthlyWordDoc(config, filteredReports, filterTitle)}
              disabled={filteredReports.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-all active:scale-95"
            >
              <FileDown size={15} />
              <span>Unduh Word (.doc)</span>
            </button>
          </div>
        </div>

        {/* Aggregated Statistics Summary */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-blue-50 border border-purple-200/70">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase text-purple-900">Total Sesi Bulan Ini</p>
              <p className="text-2xl font-black text-purple-950 mt-1">{filteredReports.length} Sesi</p>
              <p className="text-[11px] text-purple-700">Pertemuan daring</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-blue-900">Tingkat Kehadiran</p>
              <p className="text-2xl font-black text-blue-950 mt-1">{avgAttendancePercent}%</p>
              <p className="text-[11px] text-blue-700">Rata-rata kumulatif</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-emerald-900">Akumulasi Hadir</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">{sumHadir}</p>
              <p className="text-[11px] text-emerald-700">Total partisipasi siswa</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-slate-700">Absensi (S / I / A)</p>
              <p className="text-xl font-bold text-slate-800 mt-1.5">
                {sumSakit} / {sumIzin} / {sumAlpa}
              </p>
              <p className="text-[11px] text-slate-500">Sakit / Izin / Alpa</p>
            </div>
          </div>
        </div>

        {/* Table of Monthly Reports */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5 w-10 text-center">No</th>
                <th className="py-3 px-3.5 w-24">Tanggal</th>
                <th className="py-3 px-3.5 w-32">Kelas & Mapel</th>
                <th className="py-3 px-3.5">Materi Pokok</th>
                <th className="py-3 px-3.5 w-40">Metode & Media</th>
                <th className="py-3 px-3.5 w-24 text-center">Presensi<br />(H/S/I/A)</th>
                <th className="py-3 px-3.5">Kendala & Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada laporan pembelajaran pada bulan {monthsMap[selectedMonth]} {selectedYear}.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{r.date}</td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-purple-900 block">{r.subject}</span>
                      <span className="text-[11px] text-slate-500">{r.className}</span>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-900">{r.topic}</td>
                    <td className="py-3 px-3.5 text-[11px] text-slate-600">
                      <div>{r.method || '-'}</div>
                      <div className="text-slate-400 mt-0.5">Media: {r.media || '-'}</div>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="font-bold text-slate-900">
                        {r.attHadir} / {r.attSakit} / {r.attIzin} / {r.attAlpa}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-[11px] text-slate-600 max-w-xs">
                      {r.obstacle && (
                        <div>
                          <b className="text-amber-800">Kendala:</b> {r.obstacle}
                        </div>
                      )}
                      <div>
                        <b className="text-blue-800">Solusi:</b> {r.followup || '-'}
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
