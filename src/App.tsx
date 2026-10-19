import React, { useState, useEffect } from 'react';
import { ViewTab, AppConfig, Student, DailyReport, GradeRecord, AttendanceRecord } from './types';
import {
  loadAppConfig,
  saveAppConfig,
  loadStudents,
  saveStudents,
  loadReports,
  saveReports,
  loadGrades,
  saveGrades,
  loadAttendanceRecords,
  saveAttendanceRecords,
  resetToDemoData,
  clearLocalStorage
} from './utils/storage';
import { defaultAppConfig, defaultStudents, defaultReports, defaultGrades, defaultAttendanceRecords } from './data/defaultData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PrintContainer, PrintData } from './components/PrintContainer';
import { DashboardView } from './components/DashboardView';
import { TeacherProfileView } from './components/TeacherProfileView';
import { DailyReportView } from './components/DailyReportView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { GradesView } from './components/GradesView';
import { MonthlyRecapView } from './components/MonthlyRecapView';
import { ExportCenterView } from './components/ExportCenterView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App persistent states
  const [config, setConfig] = useState<AppConfig>(loadAppConfig);
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [reports, setReports] = useState<DailyReport[]>(loadReports);
  const [grades, setGrades] = useState<GradeRecord[]>(loadGrades);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(loadAttendanceRecords);

  // Print state
  const [printData, setPrintData] = useState<PrintData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveAppConfig(config);
  }, [config]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveGrades(grades);
  }, [grades]);

  useEffect(() => {
    saveAttendanceRecords(attendance);
  }, [attendance]);

  // Handlers
  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  const handleSaveReport = (report: DailyReport) => {
    setReports(prev => {
      const idx = prev.findIndex(r => r.id === report.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = report;
        return updated;
      }
      return [report, ...prev];
    });
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveStudent = (student: Student) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === student.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = student;
        return updated;
      }
      return [...prev, student];
    });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleImportStudents = (newStudents: Student[]) => {
    setStudents(prev => [...prev, ...newStudents]);
  };

  const handleSaveGrade = (grade: GradeRecord) => {
    setGrades(prev => {
      const idx = prev.findIndex(g => g.id === grade.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = grade;
        return updated;
      }
      return [grade, ...prev];
    });
  };

  const handleDeleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  const handleSaveAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.date === record.date && a.session === record.session);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = record;
        return updated;
      }
      return [record, ...prev];
    });
  };

  const handleRestoreData = (
    newConfig: AppConfig,
    newStudents: Student[],
    newReports: DailyReport[],
    newGrades: GradeRecord[],
    newAttendance: AttendanceRecord[]
  ) => {
    setConfig(newConfig);
    setStudents(newStudents);
    setReports(newReports);
    setGrades(newGrades);
    setAttendance(newAttendance);
  };

  const handleResetDemo = () => {
    resetToDemoData();
    setConfig(defaultAppConfig);
    setStudents(defaultStudents);
    setReports(defaultReports);
    setGrades(defaultGrades);
    setAttendance(defaultAttendanceRecords);
  };

  const handleClearAll = () => {
    clearLocalStorage();
    setConfig(defaultAppConfig);
    setStudents([]);
    setReports([]);
    setGrades([]);
    setAttendance([]);
  };

  // Print handlers
  const handlePrintSingleReport = (report: DailyReport) => {
    setPrintData({ type: 'single-report', report });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintRecap = (filteredReports: DailyReport[], filterTitle: string) => {
    setPrintData({ type: 'monthly-rekap', reports: filteredReports, filterTitle });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        reportsCount={reports.length}
        studentsCount={students.filter(s => s.status === 'Aktif').length}
      />

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 print:pl-0">
        {/* HEADER */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          config={config}
          onQuickPrint={() => {
            if (activeTab === 'laporan' && reports.length > 0) {
              handlePrintSingleReport(reports[0]);
            } else if (activeTab === 'rekap') {
              handlePrintRecap(reports, 'Rekapitulasi Laporan Pembelajaran');
            } else {
              window.print();
            }
          }}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto print:hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              config={config}
              reports={reports}
              students={students}
              grades={grades}
              onNavigate={setActiveTab}
              onPrintReport={handlePrintSingleReport}
            />
          )}

          {activeTab === 'identitas' && (
            <TeacherProfileView
              config={config}
              onSaveConfig={handleSaveConfig}
            />
          )}

          {activeTab === 'laporan' && (
            <DailyReportView
              reports={reports}
              students={students}
              config={config}
              onSaveReport={handleSaveReport}
              onDeleteReport={handleDeleteReport}
              onPrintSingleReport={handlePrintSingleReport}
            />
          )}

          {activeTab === 'siswa' && (
            <StudentsView
              students={students}
              config={config}
              onSaveStudent={handleSaveStudent}
              onDeleteStudent={handleDeleteStudent}
              onImportStudents={handleImportStudents}
            />
          )}

          {activeTab === 'kehadiran' && (
            <AttendanceView
              students={students}
              attendanceRecords={attendance}
              onSaveAttendanceRecord={handleSaveAttendance}
            />
          )}

          {activeTab === 'nilai' && (
            <GradesView
              grades={grades}
              students={students}
              onSaveGrade={handleSaveGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          )}

          {activeTab === 'rekap' && (
            <MonthlyRecapView
              reports={reports}
              config={config}
              onPrintRecap={handlePrintRecap}
            />
          )}

          {activeTab === 'ekspor' && (
            <ExportCenterView
              config={config}
              reports={reports}
              students={students}
              grades={grades}
              attendance={attendance}
              onNavigate={setActiveTab}
              onPrintRecap={handlePrintRecap}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              config={config}
              students={students}
              reports={reports}
              grades={grades}
              attendance={attendance}
              onRestoreData={handleRestoreData}
              onResetDemo={handleResetDemo}
              onClearAll={handleClearAll}
            />
          )}

          {activeTab === 'tentang' && <AboutView />}
        </main>

        {/* OFFICIAL FOOTER */}
        <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-500 print:hidden mt-auto">
          SIPEDA dikembangkan oleh <strong className="text-slate-800 font-bold">{config.teacherName || 'Siti Nuryati, S.Pd., Gr.'}</strong> — {config.schoolName || 'SDN 32 Rantau Bayur'} | Kontak Resmi:{' '}
          <span className="font-mono font-semibold text-slate-700">{config.contact || '082176346929'}</span>
        </footer>
      </div>

      {/* DEDICATED PRINT CONTAINER (Active only during browser print) */}
      <PrintContainer data={printData} config={config} />
    </div>
  );
}
