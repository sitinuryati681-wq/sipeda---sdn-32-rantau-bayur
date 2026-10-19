import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Save,
  Users,
  Check,
  RotateCcw,
  Sparkles,
  Search
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendanceRecord: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendanceRecords,
  onSaveAttendanceRecord
}) => {
  const activeStudents = students.filter(s => s.status === 'Aktif');
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [session, setSession] = useState('IPAS - Bagian Tubuh Tumbuhan');
  const [statusMap, setStatusMap] = useState<
    Record<string, { status: 'Belum diisi' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'; notes?: string }>
  >({});
  const [searchFilter, setSearchFilter] = useState('');
  const [saveAlert, setSaveAlert] = useState(false);

  // Load existing records when date or session changes
  useEffect(() => {
    const existing = attendanceRecords.find(a => a.date === date && a.session === session);
    if (existing) {
      setStatusMap(existing.records);
    } else {
      // Default to "Belum diisi" as requested in architecture
      const initial: Record<string, { status: 'Belum diisi' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'; notes?: string }> = {};
      activeStudents.forEach(s => {
        initial[s.id] = { status: 'Belum diisi', notes: '' };
      });
      setStatusMap(initial);
    }
  }, [date, session, attendanceRecords, students]);

  // Status counters
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpa = 0;
  let belumDiisi = 0;

  activeStudents.forEach(s => {
    const st = statusMap[s.id]?.status || 'Belum diisi';
    if (st === 'Hadir') hadir++;
    else if (st === 'Sakit') sakit++;
    else if (st === 'Izin') izin++;
    else if (st === 'Alpa') alpa++;
    else belumDiisi++;
  });

  const totalActive = activeStudents.length;
  const attendanceRate = totalActive > 0 ? ((hadir / totalActive) * 100).toFixed(1) : '0';

  const handleStatusChange = (
    studentId: string,
    status: 'Belum diisi' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'
  ) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status || 'Belum diisi',
        notes
      }
    }));
  };

  const markAllPresent = () => {
    const updated: typeof statusMap = {};
    activeStudents.forEach(s => {
      updated[s.id] = {
        status: 'Hadir',
        notes: statusMap[s.id]?.notes || ''
      };
    });
    setStatusMap(updated);
  };

  const resetAll = () => {
    const updated: typeof statusMap = {};
    activeStudents.forEach(s => {
      updated[s.id] = {
        status: 'Belum diisi',
        notes: ''
      };
    });
    setStatusMap(updated);
  };

  const handleSave = () => {
    if (!date) {
      alert('Tentukan tanggal presensi pembelajaran!');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      date,
      session: session.trim() || 'Reguler',
      records: statusMap,
      timestamp: new Date().toISOString()
    };

    onSaveAttendanceRecord(newRecord);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const filteredStudents = activeStudents.filter(s =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Alert */}
      {saveAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Presensi Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">Catatan kehadiran untuk sesi ini telah tersimpan dalam database lokal.</p>
          </div>
        </div>
      )}

      {/* Control Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pencatatan Presensi & Kehadiran Daring</h2>
              <p className="text-xs text-slate-500">
                Pilih tanggal dan sesi mata pelajaran untuk merekap partisipasi siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllPresent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
            >
              <Check size={14} />
              <span>Tandai Semua Hadir</span>
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Semua</span>
            </button>
          </div>
        </div>

        {/* Filter / Session Selectors */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal Presensi Sesi <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sesi / Mata Pelajaran / Pokok Bahasan
            </label>
            <input
              type="text"
              value={session}
              onChange={e => setSession(e.target.value)}
              placeholder="Contoh: IPAS - Bagian Tubuh Tumbuhan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Live Counters */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-[11px] font-bold uppercase text-emerald-800 block">Hadir</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">{hadir}</span>
            <span className="text-[10px] text-emerald-700">Siswa aktif</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
            <span className="text-[11px] font-bold uppercase text-amber-800 block">Sakit</span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">{sakit}</span>
            <span className="text-[10px] text-amber-700">Surat/kabar WA</span>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200/80">
            <span className="text-[11px] font-bold uppercase text-sky-800 block">Izin</span>
            <span className="text-2xl font-black text-sky-900 mt-1 block">{izin}</span>
            <span className="text-[10px] text-sky-700">Izin keluarga</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80">
            <span className="text-[11px] font-bold uppercase text-rose-800 block">Alpa</span>
            <span className="text-2xl font-black text-rose-900 mt-1 block">{alpa}</span>
            <span className="text-[10px] text-rose-700">Tanpa kabar</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-600 block">Belum Diisi</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{belumDiisi}</span>
            <span className="text-[10px] text-slate-500">Perlu ditandai</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/80">
            <span className="text-[11px] font-bold uppercase text-blue-800 block">% Kehadiran</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">{attendanceRate}%</span>
            <span className="text-[10px] text-blue-700">Hadir / Total</span>
          </div>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900">
              Lembar Presensi Peserta Didik ({filteredStudents.length} Siswa)
            </h3>
            <p className="text-xs text-slate-500">
              Status bawaan adalah <i>Belum diisi</i> agar rekap kehadiran tetap terhitung secara objektif
            </p>
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Cari nama siswa..."
              className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 w-52 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5 w-10 text-center">No</th>
                <th className="py-3 px-3.5 w-24">NIS</th>
                <th className="py-3 px-3.5">Nama Siswa</th>
                <th className="py-3 px-3.5 w-20">Kelas</th>
                <th className="py-3 px-3.5 w-48">Status Kehadiran</th>
                <th className="py-3 px-3.5">Catatan Khusus (Opsional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Belum ada data siswa aktif. Silakan tambahkan pada menu Data Siswa.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const studentStatus = statusMap[st.id]?.status || 'Belum diisi';
                  const notes = statusMap[st.id]?.notes || '';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-600">{st.nis || '-'}</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">{st.name}</td>
                      <td className="py-3 px-3.5 text-slate-600">{st.className}</td>
                      <td className="py-3 px-3.5">
                        <select
                          value={studentStatus}
                          onChange={e => handleStatusChange(st.id, e.target.value as any)}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors ${
                            studentStatus === 'Hadir'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : studentStatus === 'Sakit'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : studentStatus === 'Izin'
                              ? 'bg-sky-50 border-sky-300 text-sky-800'
                              : studentStatus === 'Alpa'
                              ? 'bg-rose-50 border-rose-300 text-rose-800'
                              : 'bg-white border-slate-300 text-slate-600'
                          }`}
                        >
                          <option value="Belum diisi">-- Belum diisi --</option>
                          <option value="Hadir">Hadir</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Izin">Izin</option>
                          <option value="Alpa">Alpa (Tanpa Keterangan)</option>
                        </select>
                      </td>
                      <td className="py-3 px-3.5">
                        <input
                          type="text"
                          value={notes}
                          onChange={e => handleNotesChange(st.id, e.target.value)}
                          placeholder="Misal: Kendala sinyal, izin berobat"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:border-emerald-400 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Terakhir diselaraskan: {date} ({session || 'Reguler'})
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Save size={15} />
            <span>Simpan Presensi Sesi Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
