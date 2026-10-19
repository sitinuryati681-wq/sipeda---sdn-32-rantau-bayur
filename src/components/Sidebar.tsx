import React from 'react';
import { ViewTab } from '../types';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Users,
  CalendarCheck,
  GraduationCap,
  FileSpreadsheet,
  Printer,
  Settings,
  Info,
  X,
  School
} from 'lucide-react';

interface SidebarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isOpen: boolean;
  onClose: () => void;
  reportsCount: number;
  studentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  reportsCount,
  studentsCount
}) => {
  const menuItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'identitas', label: 'Identitas Guru', icon: <UserCheck size={18} /> },
    { id: 'laporan', label: 'Laporan Harian', icon: <FileText size={18} />, badge: reportsCount },
    { id: 'siswa', label: 'Data Siswa', icon: <Users size={18} />, badge: studentsCount },
    { id: 'kehadiran', label: 'Kehadiran Siswa', icon: <CalendarCheck size={18} /> },
    { id: 'nilai', label: 'Nilai & Tugas', icon: <GraduationCap size={18} /> },
    { id: 'rekap', label: 'Rekap Bulanan', icon: <FileSpreadsheet size={18} /> },
    { id: 'ekspor', label: 'Cetak & Ekspor', icon: <Printer size={18} /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
    { id: 'tentang', label: 'Tentang Aplikasi', icon: <Info size={18} /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <School size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-amber-400">SIPEDA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-400/20 text-amber-300">v2.5</span>
              </div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-400">SDN 32 RANTAU BAYUR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Menu Utama
          </div>
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Developer Badge in Sidebar Bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Siti Nuryati, S.Pd., Gr.</p>
            <p className="text-[11px] text-slate-300 mt-0.5">Guru SDN 32 Rantau Bayur</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-amber-300">
              <span>Banyuasin, Sumsel</span>
              <span className="font-mono">082176346929</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
