'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Input, PhoneInput, EmailInput } from '../../../components/forms';
import { addClient, type Client } from '../../../lib/storage/clients';
import { useRouter } from 'next/navigation';

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    id: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.id || !formData.address) {
        alert('אנא מלא את כל השדות החובה');
        return;
      }

      const newClient: Client = {
        id: formData.id,
        name: formData.name,
        address: formData.address,
        phone: formData.phone || '',
        email: formData.email || '',
        notes: formData.notes || '',
        documents: [],
      };

      addClient(newClient);
      router.push('/clients');
    } catch (error) {
      console.error('Error adding client:', error);
      alert('שגיאה בהוספת הלקוח');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👤 לקוח חדש</h1>
            <p className="text-sm text-gray-600 mt-1">הוסף לקוח חדש למערכת</p>
          </div>
          <Link 
            href="/clients"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← חזרה ללקוחות
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* פרטים אישיים */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="שם מלא *"
                required
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="שם פרטי ושם משפחה"
              />
              <Input
                label="תעודת זהות *"
                required
                value={formData.id || ''}
                onChange={(e) => updateField('id', e.target.value)}
                placeholder="9 ספרות"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="כתובת *"
                required
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="רחוב, מספר, עיר"
              />
              <PhoneInput
                label="טלפון"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <EmailInput
                label="אימייל"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <div></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הערות
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="הערות נוספות על הלקוח..."
              />
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'שומר...' : 'הוסף לקוח'}
              </Button>
              <Link href="/clients">
                <Button variant="outline" type="button">
                  ביטול
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
