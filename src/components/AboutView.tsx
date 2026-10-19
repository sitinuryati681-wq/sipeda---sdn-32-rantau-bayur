import React from 'react';
import {
  Info,
  School,
  User,
  Phone,
  MapPin,
  CheckCircle,
  FileCheck,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Info size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tentang Aplikasi SIPEDA</h2>
            <p className="text-xs text-slate-500">
              Sistem Informasi Pelaporan Pembelajaran Daring SDN 32 Rantau Bayur
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            <strong className="text-blue-900">SIPEDA</strong> adalah sistem informasi administrasi pendidikan yang dirancang khusus untuk memenuhi kebutuhan pelaporan proses belajar mengajar secara daring pada jenjang sekolah dasar. Aplikasi ini membantu guru dalam mencatat pelaksanaan materi, media pembelajaran, presensi siswa secara real-time, evaluasi belajar, serta menyusun rekapitulasi bulanan yang siap cetak standar A4 maupun ekspor dokumen Word dan Excel.
          </p>

          {/* Official Developer Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-slate-50 to-blue-50/50 border border-amber-200/80 shadow-2xs">
            <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2 mb-3">
              <School size={18} className="text-amber-600" />
              <span>Identitas Resmi Pengembang & Satuan Pendidikan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <User size={16} className="text-slate-400 shrink-0" />
                <span><b>Nama Pengembang:</b> Siti Nuryati, S.Pd., Gr.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <School size={16} className="text-slate-400 shrink-0" />
                <span><b>Satuan Pendidikan:</b> SDN 32 Rantau Bayur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span><b>Nomor Kontak / WA:</b> 082176346929</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span><b>Wilayah:</b> Kec. Rantau Bayur, Kab. Banyuasin, Sumsel</span>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Keunggulan & Fitur Utama SIPEDA:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block">Kalkulasi Kehadiran & Nilai Otomatis</strong>
                  <span className="text-slate-600">Perhitungan persentase kehadiran dan rata-rata kelas otomatis tanpa risiko pembagian nol.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block">Format Cetak A4 Standar Dinas</strong>
                  <span className="text-slate-600">Dilengkapi Kop Surat resmi Kabupaten Banyuasin dan kolom tanda tangan dua sisi (Kepsek & Guru).</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block">Ekspor Lengkap Microsoft Word (.doc) & CSV</strong>
                  <span className="text-slate-600">Dapat diunduh dalam berkas Word murni yang mudah disunting kembali untuk arsip laporan.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block">Penyimpanan Luring (100% Offline-Ready)</strong>
                  <span className="text-slate-600">Bekerja penuh di browser tanpa memerlukan server database atau ketergantungan koneksi internet konstan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Guide */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Petunjuk Alur Kerja Praktis:</h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
              <li><strong className="text-slate-800">Langkah 1:</strong> Buka menu <b>Identitas Guru</b>, pastikan nama guru, NIP, nama kepala sekolah, dan data kelas sudah sesuai.</li>
              <li><strong className="text-slate-800">Langkah 2:</strong> Buka menu <b>Data Siswa</b>, lengkapi daftar siswa kelas atau gunakan fitur <b>Impor CSV</b>.</li>
              <li><strong className="text-slate-800">Langkah 3:</strong> Pada hari pembelajaran daring, buka menu <b>Laporan Harian</b> untuk mencatat materi, metode, dan rekap partisipasi.</li>
              <li><strong className="text-slate-800">Langkah 4:</strong> Catat presensi harian per sesi di menu <b>Kehadiran Siswa</b> dan nilai latihan siswa di menu <b>Nilai & Tugas</b>.</li>
              <li><strong className="text-slate-800">Langkah 5:</strong> Pada akhir bulan, buka menu <b>Rekap Bulanan</b>, lalu cetak laporan atau unduh dokumen Word (.doc) untuk diserahkan kepada pihak sekolah.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
