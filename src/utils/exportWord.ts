import { AppConfig, DailyReport } from '../types';

export function exportMonthlyWordDoc(
  config: AppConfig,
  reports: DailyReport[],
  filterTitle: string
): void {
  if (reports.length === 0) {
    alert('Tidak ada laporan untuk diekspor!');
    return;
  }

  // Format table rows
  let rows = '';
  let sumHadir = 0;
  let sumSakit = 0;
  let sumIzin = 0;
  let sumAlpa = 0;
  let sumTotal = 0;

  reports.forEach((r, idx) => {
    sumHadir += r.attHadir || 0;
    sumSakit += r.attSakit || 0;
    sumIzin += r.attIzin || 0;
    sumAlpa += r.attAlpa || 0;
    sumTotal += r.attTotal || 0;

    rows += `
      <tr>
        <td align="center">${idx + 1}</td>
        <td>${r.date}</td>
        <td>${r.className} - ${r.subject}</td>
        <td><b>${r.topic}</b></td>
        <td>${r.method || '-'}<br/><small>Media: ${r.media || '-'}</small></td>
        <td align="center">${r.attHadir} / ${r.attSakit} / ${r.attIzin} / ${r.attAlpa}</td>
        <td>${r.obstacle ? `Kendala: ${r.obstacle}<br/>` : ''}Tindak Lanjut: ${r.followup || '-'}</td>
      </tr>
    `;
  });

  const avgPercent = sumTotal > 0 ? ((sumHadir / sumTotal) * 100).toFixed(1) : '0';
  const now = new Date();
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentDateIndo = `${now.getDate()} ${monthsIndo[now.getMonth()]} ${now.getFullYear()}`;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>SIPEDA - Rekap Laporan Pembelajaran</title>
      <style>
        body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
        .kop h3 { margin: 0; font-size: 12pt; text-transform: uppercase; font-weight: bold; }
        .kop h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; }
        .kop p { margin: 0; font-size: 9pt; }
        .title { text-align: center; font-size: 12pt; font-weight: bold; text-decoration: underline; margin-bottom: 6px; }
        .sub-title { text-align: center; font-size: 10pt; margin-bottom: 14px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
        table.data-table th, table.data-table td { border: 1px solid #000; padding: 5px 6px; vertical-align: top; }
        table.data-table th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .stats-box { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; margin-bottom: 12px; font-size: 10pt; }
        .ttd-table { width: 100%; border: none; margin-top: 30px; font-size: 10.5pt; }
        .ttd-table td { border: none; vertical-align: top; text-align: center; width: 50%; }
        .ttd-space { height: 60px; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h3>${config.kop1 || 'PEMERINTAH KABUPATEN BANYUASIN'}</h3>
        <h3>${config.kop2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</h3>
        <h2>${config.kop3 || 'SD NEGERI 32 RANTAU BAYUR'}</h2>
        <p>${config.kopAddr || 'Kecamatan Rantau Bayur, Kabupaten Banyuasin, Sumatera Selatan'}</p>
      </div>

      <div class="title">REKAPITULASI PELAPORAN PEMBELAJARAN DARING</div>
      <div class="sub-title">${filterTitle} | Tahun Ajaran ${config.academicYear} (Semester ${config.semester})</div>

      <div class="stats-box">
        <strong>Ringkasan Akumulasi:</strong> Total Sesi: <b>${reports.length}</b> Pertemuan |
        Akumulasi Kehadiran: Hadir: <b>${sumHadir}</b> | Sakit: <b>${sumSakit}</b> | Izin: <b>${sumIzin}</b> | Alpa: <b>${sumAlpa}</b> |
        Tingkat Kehadiran: <b>${avgPercent}%</b>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th width="4%">No</th>
            <th width="11%">Tanggal</th>
            <th width="15%">Kelas & Mapel</th>
            <th width="22%">Materi Pembelajaran</th>
            <th width="18%">Metode & Media</th>
            <th width="12%">Kehadiran<br/>(H/S/I/A)</th>
            <th width="18%">Kendala & Tindak Lanjut</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <table class="ttd-table">
        <tr>
          <td>
            Mengetahui,<br/>
            Kepala Sekolah<br/>
            <div class="ttd-space"></div>
            <b><u>${config.principalName || '( ............................................... )'}</u></b><br/>
            NIP. ${config.principalNip || '-'}
          </td>
          <td>
            ${config.place || 'Rantau Bayur'}, ${currentDateIndo}<br/>
            Guru Kelas / Mata Pelajaran<br/>
            <div class="ttd-space"></div>
            <b><u>${config.teacherName || 'Siti Nuryati, S.Pd., Gr.'}</u></b><br/>
            NIP. ${config.teacherNip || '-'}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeDate = new Date().toISOString().split('T')[0];
  a.download = `SIPEDA_Rekap_SDN32_${safeDate}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
