export interface AppConfig {
  teacherName: string;
  teacherNip: string;
  schoolName: string;
  academicYear: string;
  semester: string;
  className: string;
  principalName: string;
  principalNip: string;
  place: string;
  kop1: string;
  kop2: string;
  kop3: string;
  kopAddr: string;
  contact: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  className: string;
  gender: 'L' | 'P';
  status: 'Aktif' | 'Nonaktif';
}

export interface DailyReport {
  id: string;
  date: string; // YYYY-MM-DD
  className: string;
  subject: string;
  topic: string;
  time: string;
  objective: string;
  method: string;
  media: string;
  platform: string;
  link: string;
  intro: string;
  core: string;
  close: string;
  attTotal: number;
  attHadir: number;
  attSakit: number;
  attIzin: number;
  attAlpa: number;
  task: string;
  taskDeadline: string;
  result: string;
  obstacle: string;
  followup: string;
  reflection: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  session: string;
  records: Record<string, {
    status: 'Belum diisi' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
    notes?: string;
  }>;
  timestamp: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subject: string;
  taskName: string;
  score: number | null;
  status: 'Belum mengumpulkan' | 'Sudah mengumpulkan' | 'Perlu perbaikan';
  notes: string;
  date: string;
  deadline: string;
}

export type ViewTab =
  | 'dashboard'
  | 'identitas'
  | 'laporan'
  | 'siswa'
  | 'kehadiran'
  | 'nilai'
  | 'rekap'
  | 'ekspor'
  | 'pengaturan'
  | 'tentang';
