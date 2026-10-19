import React from 'react';
import { ViewTab, AppConfig } from '../types';
import { Menu, Printer, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: ViewTab;
  onOpenMobileMenu: () => void;
  config: AppConfig;
  onQuickPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  config,
  onQuickPrint
}) => {
  const getTabTitle = (tab: ViewTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard Utama', subtitle: 'Ringkasan Aktivitas dan Statistik Pembelajaran Daring' };
      case 'identitas':
        return { title: 'Identitas Guru & Sekolah', subtitle: 'Konfigurasi Profil Pengajar, Kepala Sekolah, dan Kop Resmi' };
      case 'laporan':
        return { title: 'Laporan Harian Pembelajaran', subtitle: 'Pencatatan Rencana, Pelaksanaan, Evaluasi, dan Rekap Sesi' };
      case 'siswa':
        return { title: 'Data Peserta Didik', subtitle: 'Manajemen Daftar Siswa Kelas, Status Aktif, dan Impor/Ekspor CSV' };
      case 'kehadiran':
        return { title: 'Presensi & Kehadiran Siswa', subtitle: 'Pencatatan Real-time Rasio Kehadiran per Tanggal dan Sesi' };
      case 'nilai':
        return { title: 'Penilaian & Tugas Siswa', subtitle: 'Pencatatan Nilai Asesmen Formatif, Tugas Mandiri, dan Rata-rata Kelas' };
      case 'rekap':
        return { title: 'Rekapitulasi Bulanan', subtitle: 'Akumulasi Data Pembelajaran Bulanan untuk Laporan Dinas' };
      case 'ekspor':
        return { title: 'Pusat Cetak & Ekspor', subtitle: 'Cetak Lembar A4 PDF Standar dan Unduh Dokumen Word (.doc)' };
      case 'pengaturan':
        return { title: 'Pengaturan & Cadangan', subtitle: 'Pencadangan Berkas JSON, Pemulihan Data, dan Standarisasi Kop' };
      case 'tentang':
        return { title: 'Tentang Aplikasi SIPEDA', subtitle: 'Informasi Pengembang Siti Nuryati, S.Pd., Gr. dan Petunjuk Sistem' };
      default:
        return { title: 'SIPEDA', subtitle: 'Sistem Informasi Pelaporan Pembelajaran Daring' };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Buka Menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck size={12} />
              Offline Ready
            </span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right User & School Profile Info */}
      <div className="flex items-center gap-3">
        {onQuickPrint && (
          <button
            onClick={onQuickPrint}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-all"
            title="Cetak Halaman Ini"
          >
            <Printer size={14} />
            <span>Cetak Cepat</span>
          </button>
        )}

        <div className="text-right border-l border-slate-200 pl-3">
          <div className="text-xs sm:text-sm font-bold text-blue-900 line-clamp-1">
            {config.teacherName || 'Siti Nuryati, S.Pd., Gr.'}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
            <span>{config.schoolName || 'SDN 32 Rantau Bayur'}</span>
            <span className="text-amber-500 font-bold">•</span>
            <span>{config.className || 'Kelas IV'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
