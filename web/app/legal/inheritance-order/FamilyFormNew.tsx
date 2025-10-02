'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { InheritanceOrderData, FamilyMember } from './types';

interface FamilyFormProps {
  data: InheritanceOrderData;
  onUpdate: (updates: Partial<InheritanceOrderData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FamilyForm({ data, onUpdate, onNext, onBack }: FamilyFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateChild = (index: number, updates: Partial<FamilyMember>) => {
    const newChildren = [...data.children];
    newChildren[index] = { ...newChildren[index], ...updates };
    onUpdate({ children: newChildren });
  };

  const updateSibling = (index: number, updates: Partial<FamilyMember>) => {
    const newSiblings = [...data.siblings];
    newSiblings[index] = { ...newSiblings[index], ...updates };
    onUpdate({ siblings: newSiblings });
  };

  // כאשר משנים מספר ילדים - יוצרים/מוחקים רשומות
  const handleChildrenCountChange = (count: number) => {
    const newChildren = Array.from({ length: count }, (_, i) => 
      data.children[i] || { name: '', id: '', address: '' }
    );
    onUpdate({ childrenCount: count, children: newChildren });
  };

  // כאשר משנים מספר אחים - יוצרים/מוחקים רשומות
  const handleSiblingsCountChange = (count: number) => {
    const newSiblings = Array.from({ length: count }, (_, i) => 
      data.siblings[i] || { name: '', id: '', address: '' }
    );
    onUpdate({ siblingsCount: count, siblings: newSiblings });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">משפחה ויורשים</h2>
        <p className="text-gray-600">מלא פרטים על בני המשפחה</p>
      </div>

      {/* בן/בת זוג */}
      <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="hasSpouse"
            checked={data.hasSpouse}
            onChange={(e) => {
              onUpdate({ 
                hasSpouse: e.target.checked,
                spouse: e.target.checked ? (data.spouse || { name: '', id: '', address: '' }) : undefined
              });
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasSpouse" className="text-lg font-semibold text-gray-900">
            💑 היה למנוח בן/בת זוג?
          </label>
        </div>

        {data.hasSpouse && (
          <div className="space-y-4 mt-4 pr-8">
            <Input
              label="שם מלא"
              required
              value={data.spouse?.name || ''}
              onChange={(e) => onUpdate({ spouse: { ...(data.spouse || { name: '', id: '', address: '' }), name: e.target.value } })}
              placeholder="שם בן/בת הזוג"
            />
            <IsraeliIDInput
              label="תעודת זהות"
              required
              value={data.spouse?.id || ''}
              onChange={(e) => onUpdate({ spouse: { ...(data.spouse || { name: '', id: '', address: '' }), id: e.target.value } })}
            />
            <Input
              label="כתובת"
              value={data.spouse?.address || ''}
              onChange={(e) => onUpdate({ spouse: { ...(data.spouse || { name: '', id: '', address: '' }), address: e.target.value } })}
              placeholder="כתובת מגורים"
            />
          </div>
        )}
      </div>

      {/* ילדים */}
      <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-semibold text-gray-900">
            👶 ילדים
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              max="20"
              value={data.childrenCount}
              onChange={(e) => handleChildrenCountChange(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
            <span className="text-gray-600">ילדים</span>
          </div>
        </div>

        {data.childrenCount > 0 && (
          <div className="space-y-6 mt-6">
            {data.children.map((child, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">ילד/ה {index + 1}</h4>
                <div className="space-y-3">
                  <Input
                    label="שם מלא"
                    required
                    value={child.name}
                    onChange={(e) => updateChild(index, { name: e.target.value })}
                    placeholder="שם מלא"
                  />
                  <IsraeliIDInput
                    label="תעודת זהות"
                    required
                    value={child.id}
                    onChange={(e) => updateChild(index, { id: e.target.value })}
                  />
                  <Input
                    label="כתובת"
                    value={child.address || ''}
                    onChange={(e) => updateChild(index, { address: e.target.value })}
                    placeholder="כתובת מגורים"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* הורים */}
      <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👴👵 הורי המנוח</h3>
        
        {/* אב */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="hasFather"
              checked={data.hasFather}
              onChange={(e) => {
                onUpdate({ 
                  hasFather: e.target.checked,
                  father: e.target.checked ? (data.father || { name: '', id: '', address: '' }) : undefined
                });
              }}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="hasFather" className="font-medium text-gray-900">
              האב חי
            </label>
          </div>
          
          {data.hasFather && (
            <div className="space-y-3 pr-8">
              <Input
                label="שם האב"
                required
                value={data.father?.name || ''}
                onChange={(e) => onUpdate({ father: { ...(data.father || { name: '', id: '', address: '' }), name: e.target.value } })}
                placeholder="שם מלא"
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={data.father?.id || ''}
                onChange={(e) => onUpdate({ father: { ...(data.father || { name: '', id: '', address: '' }), id: e.target.value } })}
              />
            </div>
          )}
        </div>

        {/* אם */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="hasMother"
              checked={data.hasMother}
              onChange={(e) => {
                onUpdate({ 
                  hasMother: e.target.checked,
                  mother: e.target.checked ? (data.mother || { name: '', id: '', address: '' }) : undefined
                });
              }}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="hasMother" className="font-medium text-gray-900">
              האם חיה
            </label>
          </div>
          
          {data.hasMother && (
            <div className="space-y-3 pr-8">
              <Input
                label="שם האם"
                required
                value={data.mother?.name || ''}
                onChange={(e) => onUpdate({ mother: { ...(data.mother || { name: '', id: '', address: '' }), name: e.target.value } })}
                placeholder="שם מלא"
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={data.mother?.id || ''}
                onChange={(e) => onUpdate({ mother: { ...(data.mother || { name: '', id: '', address: '' }), id: e.target.value } })}
              />
            </div>
          )}
        </div>
      </div>

      {/* אחים */}
      <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-semibold text-gray-900">
            👫 אחים/אחיות
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              max="20"
              value={data.siblingsCount}
              onChange={(e) => handleSiblingsCountChange(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
            <span className="text-gray-600">אחים</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-4">
          אחים יורשים רק אם אין בן זוג, ילדים או הורים
        </p>

        {data.siblingsCount > 0 && (
          <div className="space-y-4 mt-4">
            {data.siblings.map((sibling, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-3">אח/אחות {index + 1}</h4>
                <div className="space-y-3">
                  <Input
                    label="שם מלא"
                    required
                    value={sibling.name}
                    onChange={(e) => updateSibling(index, { name: e.target.value })}
                    placeholder="שם מלא"
                  />
                  <IsraeliIDInput
                    label="תעודת זהות"
                    required
                    value={sibling.id}
                    onChange={(e) => updateSibling(index, { id: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          → חזור
        </Button>
        <Button type="submit" variant="primary" size="lg">
          סיכום ←
        </Button>
      </div>
    </form>
  );
}

