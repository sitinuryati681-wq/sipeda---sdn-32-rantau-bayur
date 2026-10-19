import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Save, UserCheck, CheckCircle2, Building, Eye } from 'lucide-react';

interface TeacherProfileViewProps {
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  config,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Success Notification */}
      {showNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-xs transition-all">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Profil Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">Semua kop surat, tanda tangan cetak, dan data header telah diperbarui.</p>
          </div>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Identitas Guru & Satuan Pendidikan</h2>
            <p className="text-xs text-slate-500">Data ini akan tercetak otomatis pada Kop Surat dan Lembar Pengesahan Laporan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Bagian 1: Data Guru */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 text-blue-900 flex items-center gap-2">
              <span>A. Data Guru Pengajar / Pembimbing</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Guru & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Siti Nuryati, S.Pd., Gr."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NIP Guru (Kosongkan jika belum ada)
                </label>
                <input
                  type="text"
                  name="teacherNip"
                  value={formData.teacherNip}
                  onChange={handleChange}
                  placeholder="198804152019032008"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Kontak / WhatsApp
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="082176346929"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Data Satuan Pendidikan & Akademik */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 text-blue-900 flex items-center gap-2">
              <span>B. Satuan Pendidikan & Kelas Bimbingan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Satuan Pendidikan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  placeholder="SDN 32 Rantau Bayur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kelas yang Diajar
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Kelas IV"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2025/2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="1 (Ganjil)">1 (Ganjil)</option>
                  <option value="2 (Genap)">2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Titimangsa Laporan (Tempat)
                </label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  placeholder="Rantau Bayur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Data Pengesahan Kepala Sekolah */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 text-blue-900 flex items-center gap-2">
              <span>C. Pengesahan Kepala Sekolah</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Kepala Sekolah & Gelar
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  placeholder="Nazarudin, S.Pd., M.Si."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principalNip"
                  value={formData.principalNip}
                  onChange={handleChange}
                  placeholder="196903121992031004"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bagian 4: Format Kop Standar Surat */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 text-blue-900 flex items-center gap-2">
              <Building size={16} />
              <span>D. Format Standar Kop Surat Resmi Cetak</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kop Baris 1 (Pemerintah Daerah)
                </label>
                <input
                  type="text"
                  name="kop1"
                  value={formData.kop1}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kop Baris 2 (Dinas Terkait)
                </label>
                <input
                  type="text"
                  name="kop2"
                  value={formData.kop2}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kop Baris 3 (Nama Satuan Pendidikan)
                </label>
                <input
                  type="text"
                  name="kop3"
                  value={formData.kop3}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap & Kontak Satuan Pendidikan
                </label>
                <input
                  type="text"
                  name="kopAddr"
                  value={formData.kopAddr}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Save size={16} />
              <span>Simpan Perubahan Identitas</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Box of Letterhead & Signatures */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800 font-bold text-sm">
          <Eye size={16} className="text-amber-500" />
          <span>Pratinjau Kop & Tanda Tangan Cetak Real-Time</span>
        </div>

        <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-xl font-serif">
          {/* Header Preview */}
          <div className="text-center border-b-2 border-black pb-2 mb-4">
            <div className="text-xs font-bold uppercase">{formData.kop1 || 'PEMERINTAH KABUPATEN BANYUASIN'}</div>
            <div className="text-xs font-bold uppercase">{formData.kop2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</div>
            <div className="text-sm font-bold uppercase mt-0.5">{formData.kop3 || 'SD NEGERI 32 RANTAU BAYUR'}</div>
            <div className="text-[10px] italic text-slate-600">{formData.kopAddr}</div>
          </div>

          <div className="text-center font-bold text-xs underline my-2">
            CONTOH KOP LAPORAN PEMBELAJARAN DARING
          </div>

          {/* Signature Preview */}
          <div className="mt-8 pt-4 flex justify-between text-xs text-center">
            <div className="w-[45%]">
              <div>Mengetahui,</div>
              <div className="font-semibold">Kepala Sekolah</div>
              <div className="h-12 flex items-center justify-center text-slate-300 italic text-[11px]">(Tanda Tangan & Cap)</div>
              <div className="font-bold underline">{formData.principalName || '(Nama Kepala Sekolah)'}</div>
              <div className="text-[10px] text-slate-500">NIP. {formData.principalNip || '-'}</div>
            </div>
            <div className="w-[45%]">
              <div>{formData.place || 'Rantau Bayur'}, {new Date().toLocaleDateString('id-ID')}</div>
              <div className="font-semibold">Guru Pengajar</div>
              <div className="h-12 flex items-center justify-center text-slate-300 italic text-[11px]">(Tanda Tangan)</div>
              <div className="font-bold underline">{formData.teacherName || 'Siti Nuryati, S.Pd., Gr.'}</div>
              <div className="text-[10px] text-slate-500">NIP. {formData.teacherNip || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
