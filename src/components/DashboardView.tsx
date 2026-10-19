import React, { useEffect, useRef } from 'react';
import { AppConfig, DailyReport, Student, GradeRecord, ViewTab } from '../types';
import {
  FileText,
  Video,
  Users,
  Percent,
  TrendingUp,
  PlusCircle,
  CalendarCheck,
  GraduationCap,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  config: AppConfig;
  reports: DailyReport[];
  students: Student[];
  grades: GradeRecord[];
  onNavigate: (tab: ViewTab) => void;
  onPrintReport: (report: DailyReport) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  config,
  reports,
  students,
  grades,
  onNavigate,
  onPrintReport
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate statistics
  const totalReports = reports.length;
  const activeStudents = students.filter(s => s.status === 'Aktif').length;

  let sumHadir = 0;
  let sumTarget = 0;
  reports.forEach(r => {
    sumHadir += r.attHadir || 0;
    sumTarget += r.attTotal || 0;
  });
  const avgAttendance = sumTarget > 0 ? ((sumHadir / sumTarget) * 100).toFixed(1) : '0';

  // Draw 6-month canvas chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Last 6 months
    const months: { label: string; key: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      months.push({
        label: d.toLocaleDateString('id-ID', { month: 'short' }),
        key: `${yStr}-${mStr}`
      });
    }

    const counts = months.map(m => reports.filter(r => r.date && r.date.startsWith(m.key)).length);
    const maxVal = Math.max(...counts, 4);

    // High-DPI Canvas Rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 200;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 20, bottom: 40, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Horizontal grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartH / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      const labelVal = Math.round(maxVal - (maxVal / gridSteps) * i);
      ctx.fillText(String(labelVal), padding.left - 8, y + 3);
    }

    // Bars
    const colWidth = chartW / months.length;
    const barWidth = Math.min(36, colWidth * 0.55);

    months.forEach((m, idx) => {
      const val = counts[idx];
      const barH = (val / maxVal) * chartH;
      const x = padding.left + idx * colWidth + (colWidth - barWidth) / 2;
      const y = padding.top + chartH - barH;

      // Gradient bar fill
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, '#2563eb');
      grad.addColorStop(1, '#1e3a8a');

      ctx.fillStyle = val > 0 ? grad : '#e2e8f0';
      ctx.beginPath();
      const radius = 6;
      if (barH > radius) {
        ctx.roundRect(x, y, barWidth, barH, [radius, radius, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, Math.max(3, barH));
      }
      ctx.fill();

      // Top value badge
      if (val > 0) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(val), x + barWidth / 2, y - 6);
      }

      // X-axis label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m.label, x + barWidth / 2, height - padding.bottom + 20);
    });
  }, [reports]);

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome School Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Sparkles size={220} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <span>Sistem Informasi Pelaporan Pembelajaran Daring (SIPEDA)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {config.teacherName || 'Ibu Guru'}!
          </h2>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            Aplikasi administrasi pembelajaran daring SDN 32 Rantau Bayur. Kelola laporan harian, rekapitulasi kehadiran, data peserta didik, dan penilaian secara mandiri dan siap cetak standar A4/PDF.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('laporan')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              <PlusCircle size={15} />
              <span>Entri Laporan Baru</span>
            </button>
            <button
              onClick={() => onNavigate('kehadiran')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <CalendarCheck size={15} />
              <span>Presensi Sesi Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Laporan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Laporan</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalReports}</span>
            <span className="text-xs text-slate-500 font-medium">berkas</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Tersimpan dalam memori peramban</p>
        </div>

        {/* Sesi Pembelajaran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sesi Daring</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Video size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalReports}</span>
            <span className="text-xs text-slate-500 font-medium">pertemuan</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{config.academicYear || '2025/2026'}</p>
        </div>

        {/* Siswa Terdaftar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Siswa Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeStudents}</span>
            <span className="text-xs text-slate-500 font-medium">orang</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{config.className || 'Kelas IV'}</p>
        </div>

        {/* Rata-rata Kehadiran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kehadiran</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgAttendance}%</span>
            <span className="text-xs font-semibold text-emerald-600">Kumulatif</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Dari total target presensi</p>
        </div>
      </div>

      {/* Main Grid: Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 Spans) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                <span>Statistik Laporan Pembelajaran (6 Bulan Terakhir)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Jumlah pertemuan daring yang dilaporkan setiap bulan</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Offline Canvas Engine
            </span>
          </div>

          <div className="mt-4 w-full overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-48 block" />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SD Negeri 32 Rantau Bayur</span>
            <span>Diperbarui otomatis saat entri laporan disimpan</span>
          </div>
        </div>

        {/* Quick Actions & School Info (1 Span) */}
        <div className="space-y-6">
          {/* Quick Action Navigation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('laporan')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 text-xs font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <PlusCircle size={15} />
                  </div>
                  <span>Buat Laporan Baru</span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('kehadiran')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-slate-700 text-xs font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CalendarCheck size={15} />
                  </div>
                  <span>Presensi Sesi Siswa</span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('nilai')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 transition-colors text-slate-700 text-xs font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <GraduationCap size={15} />
                  </div>
                  <span>Input Nilai & Tugas</span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('rekap')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition-colors text-slate-700 text-xs font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Printer size={15} />
                  </div>
                  <span>Rekap Bulanan & Cetak</span>
                </div>
                <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Teacher Profile Summary Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Profil Pengajar</h4>
            <div className="text-sm font-bold text-slate-900">{config.teacherName}</div>
            <div className="text-xs text-slate-600 mt-0.5">NIP: {config.teacherNip || 'Belum diisi'}</div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div><b>Satuan:</b> {config.schoolName}</div>
              <div><b>Semester:</b> {config.semester} ({config.academicYear})</div>
              <div><b>Kepala Sekolah:</b> {config.principalName || '-'}</div>
            </div>
            <button
              onClick={() => onNavigate('identitas')}
              className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-900 underline block"
            >
              Ubah Data Identitas & Kop →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Aktivitas Laporan Pembelajaran Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar berkas sesi pembelajaran daring yang baru saja dibuat</p>
          </div>
          <button
            onClick={() => onNavigate('laporan')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Lihat Semua ({reports.length}) →
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Belum ada laporan pembelajaran yang tersimpan. Klik "Entri Laporan Baru" untuk memulai!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {recentReports.map(rep => (
              <div key={rep.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {rep.date}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">{rep.subject}</span>
                    <span className="text-xs text-slate-500">• {rep.className}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-800">{rep.topic}</div>
                  <div className="text-xs text-slate-500">
                    Kehadiran: <b className="text-emerald-700">{rep.attHadir} Hadir</b> dari {rep.attTotal} Siswa • Platform: {rep.platform || '-'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPrintReport(rep)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    <Printer size={13} />
                    <span>Cetak Lembar</span>
                  </button>
                  <button
                    onClick={() => onNavigate('laporan')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                  >
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
