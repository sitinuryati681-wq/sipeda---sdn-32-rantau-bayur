import { Student, DailyReport, GradeRecord } from '../types';

export function exportStudentsToCsv(students: Student[]): void {
  let csv = 'NIS,Nama Siswa,Kelas,Jenis Kelamin,Status\n';
  students.forEach(s => {
    csv += `"${s.nis || ''}","${(s.name || '').replace(/"/g, '""')}","${s.className || ''}","${s.gender || ''}","${s.status || ''}"\n`;
  });

  downloadCsv(csv, `Data_Siswa_SDN32_${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportGradesToCsv(grades: GradeRecord[], students: Student[]): void {
  let csv = 'No,Nama Siswa,Mata Pelajaran,Nama Tugas,Nilai,Status,Catatan,Tanggal,Batas Waktu\n';
  grades.forEach((g, idx) => {
    const student = students.find(s => s.id === g.studentId);
    const name = student ? student.name : 'Unknown';
    csv += `${idx + 1},"${name.replace(/"/g, '""')}","${g.subject.replace(/"/g, '""')}","${g.taskName.replace(/"/g, '""')}","${g.score !== null ? g.score : ''}","${g.status}","${(g.notes || '').replace(/"/g, '""')}","${g.date || ''}","${g.deadline || ''}"\n`;
  });

  downloadCsv(csv, `Rekap_Nilai_SDN32_${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportReportsToCsv(reports: DailyReport[]): void {
  let csv = 'No,Tanggal,Kelas,Mata Pelajaran,Materi,Waktu,Metode,Media,Platform,Total Siswa,Hadir,Sakit,Izin,Alpa,Tugas,Hasil,Kendala,Tindak Lanjut\n';
  reports.forEach((r, idx) => {
    csv += `${idx + 1},"${r.date}","${r.className}","${r.subject.replace(/"/g, '""')}","${r.topic.replace(/"/g, '""')}","${r.time}","${(r.method || '').replace(/"/g, '""')}","${(r.media || '').replace(/"/g, '""')}","${(r.platform || '').replace(/"/g, '""')}",${r.attTotal},${r.attHadir},${r.attSakit},${r.attIzin},${r.attAlpa},"${(r.task || '').replace(/"/g, '""')}","${(r.result || '').replace(/"/g, '""')}","${(r.obstacle || '').replace(/"/g, '""')}","${(r.followup || '').replace(/"/g, '""')}"\n`;
  });

  downloadCsv(csv, `Laporan_Pembelajaran_SDN32_${new Date().toISOString().split('T')[0]}.csv`);
}

function downloadCsv(content: string, filename: string): void {
  // Add BOM for Microsoft Excel UTF-8 display
  const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
