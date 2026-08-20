import React, { useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { clearStorage, getFromStorage } from '../utils/storage';
import { Settings as SettingsIcon, Download, Upload, Trash2 } from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings } = useFinance();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = {
      transactions: getFromStorage('transactions', []),
      budgets: getFromStorage('budgets', []),
      goals: getFromStorage('goals', []),
      settings: getFromStorage('settings', {})
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.transactions) localStorage.setItem('finance_transactions', JSON.stringify(data.transactions));
        if (data.budgets) localStorage.setItem('finance_budgets', JSON.stringify(data.budgets));
        if (data.goals) localStorage.setItem('finance_goals', JSON.stringify(data.goals));
        if (data.settings) localStorage.setItem('finance_settings', JSON.stringify(data.settings));
        alert('Data imported successfully! The page will now reload.');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse the backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you absolutely sure you want to clear ALL data? This cannot be undone.')) {
      clearStorage();
      // Prevent seed data from being injected again after reload
      localStorage.setItem('finance_first_launch', 'false');
      alert('All data cleared. The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-finance-text mb-2">Settings</h1>
        <p className="text-finance-muted">Manage your application preferences and data.</p>
      </header>

      <div className="bg-finance-card rounded-2xl border border-finance-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-finance-border flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-finance-muted" />
          <h2 className="text-lg font-semibold text-finance-text">Preferences</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-finance-text">Currency</h3>
              <p className="text-sm text-finance-muted">Choose your primary display currency.</p>
            </div>
            <select 
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="bg-finance-bg border border-finance-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-finance-green/50 w-full sm:w-auto"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-finance-card rounded-2xl border border-finance-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-finance-border flex items-center gap-3">
          <Download className="w-5 h-5 text-finance-muted" />
          <h2 className="text-lg font-semibold text-finance-text">Data Management</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-finance-text">Export Data</h3>
              <p className="text-sm text-finance-muted">Download a complete backup of your data as JSON.</p>
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors font-medium w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-finance-border">
            <div>
              <h3 className="font-medium text-finance-text">Import Data</h3>
              <p className="text-sm text-finance-muted">Restore your data from a JSON backup file.</p>
            </div>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImport}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-xl transition-colors font-medium border border-gray-200 w-full sm:w-auto"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-finance-border">
            <div>
              <h3 className="font-medium text-rose-600">Danger Zone</h3>
              <p className="text-sm text-finance-muted">Permanently delete all your stored data.</p>
            </div>
            <button 
              onClick={handleClearData}
              className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-5 py-2.5 rounded-xl transition-colors font-medium w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
