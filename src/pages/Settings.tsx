import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'

interface SettingsState {
  email: string
  twoFactorAuth: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  invoiceReminders: boolean
  currency: string
  timezone: string
  dateFormat: string
  vaHourlyRate: string
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    email: 'admin@thehumancapital.com',
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    invoiceReminders: true,
    currency: 'USD',
    timezone: 'America/Denver',
    dateFormat: 'MM/DD/YYYY',
    vaHourlyRate: '60'
  })

  const handleToggle = (key: keyof SettingsState) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    })
  }

  const handleInputChange = (key: keyof SettingsState, value: string) => {
    setSettings({
      ...settings,
      [key]: value
    })
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  return (
    <>
      <Header
        title="Settings"
        subtitle="System configuration and preferences"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-bold font-serif text-black mb-6">
            Account Settings
          </h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <Input
              label="Change Password"
              type="password"
              placeholder="Enter new password"
            />
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-black">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold font-serif text-black mb-6">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'pushNotifications' as const, label: 'Push Notifications', desc: 'Receive push notifications in browser' },
              { key: 'smsNotifications' as const, label: 'SMS Notifications', desc: 'Receive text message notifications' },
              { key: 'invoiceReminders' as const, label: 'Invoice Reminders', desc: 'Get reminded about unpaid invoices' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-black">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[item.key] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold font-serif text-black mb-6">
            System Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Default Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="input w-full"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Default Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="input w-full"
              >
                <option value="America/Denver">Mountain Time (US)</option>
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="input w-full"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <Input
              label="VA Hourly Rate ($)"
              type="number"
              value={settings.vaHourlyRate}
              onChange={(e) => handleInputChange('vaHourlyRate', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold font-serif text-black mb-6">
            Data & Privacy
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-black mb-2">Export All Data</p>
              <p className="text-sm text-gray-500 mb-4">
                Download a complete copy of your data in JSON format
              </p>
              <Button variant="secondary" onClick={() => console.log('Exporting data...')}>
                Export Data
              </Button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="font-semibold text-error mb-2">Delete Account</p>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete your account and all associated data
              </p>
              <Button
                variant="secondary"
                className="bg-error/10 text-error border-error/20 hover:bg-error/20"
                onClick={() => console.log('Delete account requested')}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  )
}
