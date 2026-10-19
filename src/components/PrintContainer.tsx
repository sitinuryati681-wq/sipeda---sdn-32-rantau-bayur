import React from 'react';
import { AppConfig, DailyReport } from '../types';

export interface PrintData {
  type: 'single-report' | 'monthly-rekap';
  report?: DailyReport;
  reports?: DailyReport[];
  filterTitle?: string;
}

interface PrintContainerProps {
  data: PrintData | null;
  config: AppConfig;
}

export const PrintContainer: React.FC<PrintContainerProps> = ({ data, config }) => {
  if (!data) return null;

  const now = new Date();
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const formattedDate = `${now.getDate()} ${monthsIndo[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div id="print-area" className="hidden print:block bg-white text-black p-4 text-[11pt] leading-normal font-serif">
      {/* KOP RESMI SEKOLAH */}
      <div className="text-center border-b-2 border-black pb-2 mb-4">
        <h3 className="text-[12pt] font-bold uppercase tracking-wide leading-tight">{config.kop1 || 'PEMERINTAH KABUPATEN BANYUASIN'}</h3>
        <h3 className="text-[12pt] font-bold uppercase tracking-wide leading-tight">{config.kop2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</h3>
        <h2 className="text-[14pt] font-bold uppercase tracking-wider text-black my-0.5 leading-tight">{config.kop3 || 'SD NEGERI 32 RANTAU BAYUR'}</h2>
        <p className="text-[9pt] italic leading-tight text-gray-700">{config.kopAddr || 'Kecamatan Rantau Bayur, Kabupaten Banyuasin, Sumatera Selatan'}</p>
      </div>

      {/* TIPE 1: LAPORAN HARIAN TUNGGAL */}
      {data.type === 'single-report' && data.report && (
        <div>
          <div className="text-center font-bold text-[13pt] underline mb-4">
            LAPORAN PEMBELAJARAN DARING HARIAN
          </div>

          <table className="w-full border-collapse border border-black mb-3 text-[10pt]">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold w-1/4 bg-gray-50">Hari / Tanggal</td>
                <td className="border border-black p-1.5 w-1/4">{data.report.date}</td>
                <td className="border border-black p-1.5 font-bold w-1/4 bg-gray-50">Kelas / Semester</td>
                <td className="border border-black p-1.5 w-1/4">{data.report.className} / {config.semester}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Mata Pelajaran</td>
                <td className="border border-black p-1.5">{data.report.subject}</td>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Alokasi Waktu</td>
                <td className="border border-black p-1.5">{data.report.time || '2 x 35 Menit'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Materi Pokok</td>
                <td colSpan={3} className="border border-black p-1.5 font-semibold">{data.report.topic}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Tujuan Pembelajaran</td>
                <td colSpan={3} className="border border-black p-1.5">{data.report.objective || '-'}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-black mb-3 text-[10pt]">
            <thead>
              <tr className="bg-gray-100">
                <th colSpan={2} className="border border-black p-1.5 text-center font-bold">PELAKSANAAN & METODE PEMBELAJARAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold w-1/4 bg-gray-50">Metode & Media</td>
                <td className="border border-black p-1.5">{data.report.method || '-'} | Media: {data.report.media || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Platform / Tautan</td>
                <td className="border border-black p-1.5">{data.report.platform || '-'} {data.report.link ? `(${data.report.link})` : ''}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Kegiatan Pendahuluan</td>
                <td className="border border-black p-1.5">{data.report.intro || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Kegiatan Inti</td>
                <td className="border border-black p-1.5">{data.report.core || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Kegiatan Penutup</td>
                <td className="border border-black p-1.5">{data.report.close || '-'}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-black mb-3 text-[10pt]">
            <thead>
              <tr className="bg-gray-100">
                <th colSpan={5} className="border border-black p-1.5 text-center font-bold">REKAPITULASI KEHADIRAN SISWA</th>
              </tr>
              <tr className="bg-gray-50 text-center font-semibold">
                <th className="border border-black p-1">Total Siswa Terdaftar</th>
                <th className="border border-black p-1">Hadir</th>
                <th className="border border-black p-1">Sakit</th>
                <th className="border border-black p-1">Izin</th>
                <th className="border border-black p-1">Tanpa Keterangan (Alpa)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-black p-1.5">{data.report.attTotal}</td>
                <td className="border border-black p-1.5 font-bold">{data.report.attHadir}</td>
                <td className="border border-black p-1.5">{data.report.attSakit}</td>
                <td className="border border-black p-1.5">{data.report.attIzin}</td>
                <td className="border border-black p-1.5">{data.report.attAlpa}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-black mb-4 text-[10pt]">
            <thead>
              <tr className="bg-gray-100">
                <th colSpan={2} className="border border-black p-1.5 text-center font-bold">EVALUASI DAN TINDAK LANJUT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold w-1/4 bg-gray-50">Tugas / Asesmen</td>
                <td className="border border-black p-1.5">{data.report.task || '-'} {data.report.taskDeadline ? `(Batas: ${data.report.taskDeadline})` : ''}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Hasil Belajar Siswa</td>
                <td className="border border-black p-1.5">{data.report.result || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Kendala Ditemukan</td>
                <td className="border border-black p-1.5">{data.report.obstacle || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Tindak Lanjut Guru</td>
                <td className="border border-black p-1.5">{data.report.followup || '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-50">Refleksi Pembelajaran</td>
                <td className="border border-black p-1.5">{data.report.reflection || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TIPE 2: REKAPITULASI BULANAN */}
      {data.type === 'monthly-rekap' && data.reports && (
        <div>
          <div className="text-center font-bold text-[13pt] underline mb-1">
            REKAPITULASI LAPORAN PEMBELAJARAN DARING BULANAN
          </div>
          <div className="text-center text-[10pt] mb-3">
            {data.filterTitle || 'Laporan Periode Bulanan'} | Tahun Ajaran {config.academicYear}
          </div>

          <table className="w-full border-collapse border border-black mb-4 text-[9pt]">
            <thead>
              <tr className="bg-gray-100 text-center font-bold">
                <th className="border border-black p-1 w-8">No</th>
                <th className="border border-black p-1 w-20">Tanggal</th>
                <th className="border border-black p-1 w-28">Kelas & Mapel</th>
                <th className="border border-black p-1">Materi Pokok</th>
                <th className="border border-black p-1 w-32">Metode / Media</th>
                <th className="border border-black p-1 w-20">Presensi<br />(H/S/I/A)</th>
                <th className="border border-black p-1 w-36">Kendala & Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {data.reports.map((r, i) => (
                <tr key={r.id}>
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1 text-center">{r.date}</td>
                  <td className="border border-black p-1">{r.className}<br /><b>{r.subject}</b></td>
                  <td className="border border-black p-1 font-medium">{r.topic}</td>
                  <td className="border border-black p-1 text-[8.5pt]">{r.method || '-'}<br />Media: {r.media || '-'}</td>
                  <td className="border border-black p-1 text-center font-semibold">{r.attHadir}/{r.attSakit}/{r.attIzin}/{r.attAlpa}</td>
                  <td className="border border-black p-1 text-[8.5pt]">
                    {r.obstacle && <div><b>K:</b> {r.obstacle}</div>}
                    <div><b>TL:</b> {r.followup || '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KOTAK TANDA TANGAN DUA SISI */}
      <div className="w-full mt-8 flex justify-between break-inside-avoid text-[10pt]">
        <div className="w-[45%] text-center">
          <p>Mengetahui,</p>
          <p className="font-semibold">Kepala Sekolah</p>
          <div className="h-16"></div>
          <p className="font-bold underline uppercase">{config.principalName || '( ............................................... )'}</p>
          <p className="text-[9.5pt]">NIP. {config.principalNip || '-'}</p>
        </div>
        <div className="w-[45%] text-center">
          <p>{config.place || 'Rantau Bayur'}, {formattedDate}</p>
          <p className="font-semibold">Guru Kelas / Mata Pelajaran</p>
          <div className="h-16"></div>
          <p className="font-bold underline uppercase">{config.teacherName || 'Siti Nuryati, S.Pd., Gr.'}</p>
          <p className="text-[9.5pt]">NIP. {config.teacherNip || '-'}</p>
        </div>
      </div>
    </div>
  );
};
