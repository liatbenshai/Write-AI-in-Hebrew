'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { LawyerProfile } from '@/types/lawyer';
import { saveLawyerProfile, loadLawyerProfile, isProfileComplete } from '@/lib/storage/profile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<LawyerProfile>({
    name: '',
    licenseNumber: '',
    officeAddress: '',
    phone: '',
    email: '',
    specialty: '',
    website: '',
  });
  
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LawyerProfile, string>>>({});

  // Load profile on mount
  useEffect(() => {
    const loaded = loadLawyerProfile();
    if (loaded.name) {
      setProfile(loaded);
    }
  }, []);

  // Validate field
  const validateField = (name: keyof LawyerProfile, value: string): string => {
    switch (name) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'כתובת אימייל לא תקינה';
        }
        break;
      case 'phone':
        if (value && !/^0\d{1,2}-?\d{7}$/.test(value.replace(/\s/g, ''))) {
          return 'מספר טלפון לא תקין (לדוגמה: 050-1234567)';
        }
        break;
      case 'licenseNumber':
        if (value && !/^\d+$/.test(value)) {
          return 'מספר רישיון חייב להיות מספרי';
        }
        break;
    }
    return '';
  };

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name as keyof LawyerProfile, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    setSaved(false);
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: 'logo' | 'stamp') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('גודל הקובץ חייב להיות קטן מ-2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('יש להעלות קובץ תמונה בלבד');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, [field]: reader.result as string }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = (field: 'logo' | 'stamp') => {
    setProfile(prev => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  // Validate all required fields
  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof LawyerProfile, string>> = {};
    
    if (!profile.name) newErrors.name = 'שדה חובה';
    if (!profile.licenseNumber) newErrors.licenseNumber = 'שדה חובה';
    if (!profile.officeAddress) newErrors.officeAddress = 'שדה חובה';
    if (!profile.phone) newErrors.phone = 'שדה חובה';
    if (!profile.email) newErrors.email = 'שדה חובה';
    
    // Validate format
    if (profile.email) {
      const emailError = validateField('email', profile.email);
      if (emailError) newErrors.email = emailError;
    }
    if (profile.phone) {
      const phoneError = validateField('phone', profile.phone);
      if (phoneError) newErrors.phone = phoneError;
    }
    if (profile.licenseNumber) {
      const licenseError = validateField('licenseNumber', profile.licenseNumber);
      if (licenseError) newErrors.licenseNumber = licenseError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const handleSave = () => {
    if (!validateAll()) {
      alert('אנא תקן את השגיאות בטופס');
      return;
    }
    
    saveLawyerProfile(profile);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const complete = isProfileComplete(profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">פרופיל עורך דין</h1>
              <p className="text-gray-600 mt-1">נהל את הפרטים המקצועיים שלך</p>
            </div>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>חזרה לדף הבית</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Status Badge */}
        {complete ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium">הפרופיל שלך מושלם! כל הפרטים החובה מולאו</span>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
            <svg className="w-6 h-6 text-yellow-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-yellow-800 font-medium">השלם את הפרטים החובה כדי להתחיל ליצור מסמכים</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Basic Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-3 text-sm">1</span>
              פרטים בסיסיים
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  שם מלא <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="עו״ד פלוני אלמוני"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  מספר רישיון <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12345"
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              {/* Specialty */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  תחום התמחות (אופציונלי)
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={profile.specialty || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="דיני משפחה, דיני ירושה, נזיקין..."
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-3 text-sm">2</span>
              פרטי קשר
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  טלפון <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="050-1234567"
                  dir="ltr"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  אימייל <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="lawyer@example.com"
                  dir="ltr"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Office Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  כתובת המשרד <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="officeAddress"
                  value={profile.officeAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.officeAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="רחוב הרצל 1, תל אביב-יפו"
                />
                {errors.officeAddress && <p className="text-red-500 text-sm mt-1">{errors.officeAddress}</p>}
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  אתר אינטרנט (אופציונלי)
                </label>
                <input
                  type="url"
                  name="website"
                  value={profile.website || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.example.com"
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* Branding */}
          <section className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-3 text-sm">3</span>
              מיתוג (אופציונלי)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  לוגו המשרד
                </label>
                {profile.logo ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <img src={profile.logo} alt="Logo" className="max-h-32 mx-auto mb-3" />
                    <button
                      onClick={() => removeImage('logo')}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      הסר לוגו
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">העלה לוגו</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG עד 2MB</p>
                  </div>
                )}
              </div>

              {/* Stamp */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  חותמת דיגיטלית
                </label>
                {profile.stamp ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <img src={profile.stamp} alt="Stamp" className="max-h-32 mx-auto mb-3" />
                    <button
                      onClick={() => removeImage('stamp')}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      הסר חותמת
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">העלה חותמת</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'stamp')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG עד 2MB</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <div>
              {saved && (
                <span className="text-green-600 font-medium flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  הפרופיל נשמר בהצלחה!
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              💾 שמור פרופיל
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            למה צריך פרופיל?
          </h3>
          <p className="text-blue-800 text-sm">
            הפרטים שמולאים כאן ישמשו אוטומטית בכל המסמכים שתיצור - הסכמי שכר טרחה, צוואות, כתבי טענות ועוד. 
            כך תחסוך זמן ותבטיח עקביות בכל המסמכים שלך.
          </p>
        </div>

      </main>
    </div>
  );
}

