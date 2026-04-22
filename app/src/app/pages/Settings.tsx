import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  Users, 
  Settings as SettingsIcon,
  Database,
  Mail,
  Smartphone,
  Calendar,
  Clock,
  Eye,
  Download,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState('personal');
  const { tr } = useLocale();

  const tabs = [
    { id: 'personal', label: 'Personal Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'administration', label: 'Administration', icon: Shield },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-1 dark:text-white">{tr('Settings')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tr('Manage your account and system preferences')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <Button className="bg-[#0B71C7] hover:bg-[#106ebe]">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors rounded-none ${
                  selectedTab === tab.id
                    ? 'border-[#0B71C7] text-[#0B71C7] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {selectedTab === 'personal' && <PersonalSettings />}
          {selectedTab === 'security' && <SecuritySettings />}
          {selectedTab === 'notifications' && <NotificationSettings />}
          {selectedTab === 'appearance' && <AppearanceSettings />}
          {selectedTab === 'system' && <SystemSettings />}
          {selectedTab === 'administration' && <AdministrationSettings />}
        </div>
      </div>
    </div>
  );
}

function PersonalSettings() {
  const { locale, setLocale, tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-5 h-5 text-[#0B71C7]" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#0B71C7] flex items-center justify-center text-white text-2xl font-semibold">
              SJ
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                {tr('Change Photo')}
              </Button>
              <Button variant="outline" size="sm">{tr('Remove')}</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('First Name')}</label>
              <Input defaultValue="Sarah" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Last Name')}</label>
              <Input defaultValue="Johnson" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Email Address')}</label>
              <Input defaultValue="sarah.johnson@company.com" type="email" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Phone Number')}</label>
              <Input defaultValue="+1 (555) 123-4567" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Job Title')}</label>
              <Input defaultValue={tr('Sales Manager')} className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Department')}</label>
              <Input defaultValue={tr('Sales')} className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0B71C7]" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Time Zone')}</label>
              <Input defaultValue="(UTC-05:00) Eastern Time (US & Canada)" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Language')}</label>
              <Select value={locale} onValueChange={(value) => setLocale(value === 'tr' ? 'tr' : 'en')}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={tr('Choose language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{tr('English (United States)')}</SelectItem>
                  <SelectItem value="tr">{tr('Turkish (Türkiye)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Date Format')}</label>
              <Input defaultValue={locale === 'tr' ? 'DD.MM.YYYY' : 'MM/DD/YYYY'} className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Time Format')}</label>
              <Input defaultValue={locale === 'tr' ? tr('24-hour') : tr('12-hour (AM/PM)')} className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0B71C7]" />
            Work Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Work Days')}</label>
              <Input defaultValue={tr('Monday - Friday')} className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Work Hours')}</label>
              <Input defaultValue={tr('9:00 AM - 5:00 PM')} className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  const { tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#0B71C7]" />
            Password & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm text-green-900">{tr('Two-Factor Authentication Enabled')}</p>
                <p className="text-xs text-green-700">{tr('Your account is secured with 2FA')}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">{tr('Manage')}</Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Current Password')}</label>
              <Input type="password" placeholder="Enter current password" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('New Password')}</label>
              <Input type="password" placeholder="Enter new password" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Confirm New Password')}</label>
              <Input type="password" placeholder="Confirm new password" className="h-9" />
            </div>
            <Button variant="outline" className="mt-2">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#0B71C7]" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { device: 'Windows PC - Chrome', location: 'New York, USA', time: 'Active now', current: true },
            { device: 'iPhone 15 Pro - Safari', location: 'New York, USA', time: '2 hours ago', current: false },
            { device: 'MacBook Pro - Chrome', location: 'Boston, USA', time: 'Yesterday', current: false },
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.device}</p>
                    {session.current && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">{tr('Current')}</Badge>}
                  </div>
                  <p className="text-xs text-gray-600">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  {tr('Revoke')}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0B71C7]" />
            Privacy & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { label: 'Allow others to see my online status', enabled: true },
            { label: 'Show my profile in directory', enabled: true },
            { label: 'Allow calendar sharing', enabled: false },
            { label: 'Enable activity tracking', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <span className="text-sm">{tr(item.label)}</span>
              <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#0B71C7]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${item.enabled ? 'ml-5' : 'ml-0.5'}`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  const { tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#0B71C7]" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { label: 'New leads assigned to me', enabled: true },
            { label: 'Opportunities reaching close date', enabled: true },
            { label: 'Daily activity summary', enabled: false },
            { label: 'Team performance reports', enabled: true },
            { label: 'System updates and maintenance', enabled: true },
            { label: 'Marketing campaign results', enabled: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm">{tr(item.label)}</span>
              <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#0B71C7]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${item.enabled ? 'ml-5' : 'ml-0.5'}`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0B71C7]" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { label: 'Desktop notifications', enabled: true },
            { label: 'Mobile notifications', enabled: true },
            { label: 'Browser notifications', enabled: false },
            { label: 'Sound alerts', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm">{tr(item.label)}</span>
              <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#0B71C7]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${item.enabled ? 'ml-5' : 'ml-0.5'}`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0B71C7]" />
            Notification Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Do Not Disturb Start')}</label>
              <Input defaultValue="9:00 PM" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Do Not Disturb End')}</label>
              <Input defaultValue="8:00 AM" className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-base flex items-center gap-2 dark:text-white">
            <Palette className="w-5 h-5 text-[#0B71C7]" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {(['light', 'dark', 'auto'] as const).map((themeOption) => (
              <div
                key={themeOption}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  theme === themeOption 
                    ? 'border-[#0B71C7] bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => setTheme(themeOption)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm dark:text-white">{tr(themeOption === 'light' ? 'Light' : themeOption === 'dark' ? 'Dark' : 'Auto')}</span>
                  {theme === themeOption && <CheckCircle className="w-4 h-4 text-[#0B71C7]" />}
                </div>
                <div className={`h-16 rounded border ${
                  themeOption === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
                    : themeOption === 'auto'
                    ? 'bg-gradient-to-r from-white to-gray-900 border-gray-300'
                    : 'bg-white border-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#0B71C7]" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Sidebar Width')}</label>
            <div className="flex items-center gap-4">
              <input type="range" min="200" max="320" defaultValue="240" className="flex-1" />
              <span className="text-sm text-gray-600 w-16">240px</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Font Size')}</label>
            <div className="flex items-center gap-4">
              <input type="range" min="12" max="18" defaultValue="14" className="flex-1" />
              <span className="text-sm text-gray-600 w-16">14px</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Compact mode', enabled: false },
              { label: 'Show sidebar icons', enabled: true },
              { label: 'Enable animations', enabled: true },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-sm">{tr(item.label)}</span>
                <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#0B71C7]' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${item.enabled ? 'ml-5' : 'ml-0.5'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-[#0B71C7]" />
            Data Display
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Records Per Page')}</label>
            <Input defaultValue="50" type="number" className="h-9" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{tr('Default View')}</label>
            <Input defaultValue={tr('Grid View')} className="h-9" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemSettings() {
  const { tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-[#0B71C7]" />
            Data & Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Total Storage')}</p>
              <p className="text-xl font-semibold">500 GB</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Used Storage')}</p>
              <p className="text-xl font-semibold">327 GB</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Available')}</p>
              <p className="text-xl font-semibold text-green-600">173 GB</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{tr('Storage Usage')}</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0B71C7]" style={{ width: '65%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-[#0B71C7]" />
            Data Export & Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-sm">{tr('Last Backup')}</p>
              <p className="text-xs text-gray-600">{tr('March 24, 2026 at 11:45 PM')}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button className="flex-1 bg-[#0B71C7] hover:bg-[#106ebe]">
              <Upload className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#0B71C7]" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">{tr('Version')}</p>
              <p className="font-medium">Dynamics 365 v9.2.2026.03</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">{tr('Environment')}</p>
              <p className="font-medium">{tr('Production')}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">{tr('Instance URL')}</p>
              <p className="font-medium text-[#0B71C7]">crm.company.dynamics.com</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">{tr('Region')}</p>
              <p className="font-medium">{tr('North America (East US)')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdministrationSettings() {
  const { tr } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0B71C7]" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Total Users')}</p>
              <p className="text-xl font-semibold">247</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Active Users')}</p>
              <p className="text-xl font-semibold text-green-600">189</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Pending Invites')}</p>
              <p className="text-xl font-semibold text-orange-600">12</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">{tr('Licenses Used')}</p>
              <p className="text-xl font-semibold">247/300</p>
            </div>
          </div>
          <Button className="w-full bg-[#0B71C7] hover:bg-[#106ebe]">
            <Users className="w-4 h-4 mr-2" />
            Manage Users & Roles
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0B71C7]" />
            Security Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { label: 'Require two-factor authentication', enabled: true },
            { label: 'Enforce strong password policy', enabled: true },
            { label: 'Auto-lock after 15 minutes of inactivity', enabled: true },
            { label: 'Allow external sharing', enabled: false },
            { label: 'Enable audit logging', enabled: true },
            { label: 'Require device encryption', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm">{tr(item.label)}</span>
              <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#0B71C7]' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${item.enabled ? 'ml-5' : 'ml-0.5'}`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#0B71C7]" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">{tr('Storage Limit Warning')}</p>
              <p className="text-xs text-yellow-700 mt-1">{tr("You're using 65% of available storage. Consider upgrading your plan.")}</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{tr('System Update Available')}</p>
              <p className="text-xs text-blue-700 mt-1">{tr('Dynamics 365 v9.2.2026.04 is available. Schedule update for April 1, 2026.')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-[#0B71C7]" />
            Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { name: 'Microsoft Teams', status: 'Connected', color: 'green' },
            { name: 'Outlook', status: 'Connected', color: 'green' },
            { name: 'Power BI', status: 'Connected', color: 'green' },
            { name: 'SharePoint', status: 'Connected', color: 'green' },
            { name: 'LinkedIn Sales Navigator', status: 'Not Connected', color: 'gray' },
          ].map((integration, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${integration.color === 'green' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <p className="text-sm font-medium">{integration.name}</p>
                  <p className="text-xs text-gray-600">{tr(integration.status)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {integration.color === 'green' ? tr('Manage') : tr('Connect')}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
