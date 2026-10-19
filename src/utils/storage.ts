import { AppConfig, Student, DailyReport, GradeRecord, AttendanceRecord } from '../types';
import { defaultAppConfig, defaultStudents, defaultReports, defaultGrades, defaultAttendanceRecords } from '../data/defaultData';

export const STORAGE_KEY_CONFIG = 'sipeda_config';
export const STORAGE_KEY_STUDENTS = 'sipeda_students';
export const STORAGE_KEY_REPORTS = 'sipeda_reports';
export const STORAGE_KEY_GRADES = 'sipeda_grades';
export const STORAGE_KEY_ATTENDANCE = 'sipeda_attendance';

export function loadAppConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) return { ...defaultAppConfig, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load app config:', e);
  }
  return defaultAppConfig;
}

export function saveAppConfig(config: AppConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students:', e);
  }
  return defaultStudents;
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
}

export function loadReports(): DailyReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load reports:', e);
  }
  return defaultReports;
}

export function saveReports(reports: DailyReport[]): void {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
}

export function loadGrades(): GradeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GRADES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load grades:', e);
  }
  return defaultGrades;
}

export function saveGrades(grades: GradeRecord[]): void {
  localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(grades));
}

export function loadAttendanceRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load attendance:', e);
  }
  return defaultAttendanceRecords;
}

export function saveAttendanceRecords(records: AttendanceRecord[]): void {
  localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
}

export function exportBackupJSON(
  config: AppConfig,
  students: Student[],
  reports: DailyReport[],
  grades: GradeRecord[],
  attendance: AttendanceRecord[]
): void {
  const backup = {
    app: "SIPEDA",
    school: "SDN 32 Rantau Bayur",
    developer: "Siti Nuryati, S.Pd., Gr.",
    contact: "082176346929",
    exportedAt: new Date().toISOString(),
    config,
    students,
    reports,
    grades,
    attendanceRecords: attendance
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `SIPEDA_Backup_SDN32_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  localStorage.removeItem(STORAGE_KEY_STUDENTS);
  localStorage.removeItem(STORAGE_KEY_REPORTS);
  localStorage.removeItem(STORAGE_KEY_GRADES);
  localStorage.removeItem(STORAGE_KEY_ATTENDANCE);
}

export function resetToDemoData(): void {
  saveAppConfig(defaultAppConfig);
  saveStudents(defaultStudents);
  saveReports(defaultReports);
  saveGrades(defaultGrades);
  saveAttendanceRecords(defaultAttendanceRecords);
}
