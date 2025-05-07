
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Trash2, Download, Upload, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear local storage
      localStorage.removeItem('sosTrades');
      localStorage.removeItem('sosTrainees');
      localStorage.removeItem('sosModules');
      localStorage.removeItem('sosMarks');
      
      toast.success('All data has been cleared. Please refresh the page to see the changes.');
    }
  };

  const handleExportData = () => {
    // Gather all data from local storage
    const data = {
      trades: localStorage.getItem('sosTrades') ? JSON.parse(localStorage.getItem('sosTrades') as string) : [],
      trainees: localStorage.getItem('sosTrainees') ? JSON.parse(localStorage.getItem('sosTrainees') as string) : [],
      modules: localStorage.getItem('sosModules') ? JSON.parse(localStorage.getItem('sosModules') as string) : [],
      marks: localStorage.getItem('sosMarks') ? JSON.parse(localStorage.getItem('sosMarks') as string) : [],
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sos_mis_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.trades) localStorage.setItem('sosTrades', JSON.stringify(data.trades));
        if (data.trainees) localStorage.setItem('sosTrainees', JSON.stringify(data.trainees));
        if (data.modules) localStorage.setItem('sosModules', JSON.stringify(data.modules));
        if (data.marks) localStorage.setItem('sosMarks', JSON.stringify(data.marks));
        
        toast.success('Data imported successfully. Please refresh the page to see the changes.');
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be imported again if needed
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings? This will not affect your data.')) {
      toast.success('Settings reset successfully.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-500">Configure system settings and manage data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Import, export, or clear system data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-gray-500">Download all system data as a JSON file</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Import Data</h3>
                <p className="text-sm text-gray-500">Upload and restore data from a backup</p>
              </div>
              <div>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <label htmlFor="import-file">
                  <Button variant="outline" as="span">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </label>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Clear All Data</h3>
                <p className="text-sm text-gray-500">Remove all data from the system</p>
              </div>
              <Button variant="destructive" onClick={handleClearData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>
              Configure system behavior and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Print Header</h3>
                <p className="text-sm text-gray-500">Show school header on printed reports</p>
              </div>
              <Switch defaultChecked id="print-header" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Calculate Total</h3>
                <p className="text-sm text-gray-500">Automatically calculate total marks</p>
              </div>
              <Switch defaultChecked id="auto-calculate" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Send Email Notifications</h3>
                <p className="text-sm text-gray-500">Email notifications for new reports</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reset All Settings</h3>
                <p className="text-sm text-gray-500">Restore default system settings</p>
              </div>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Details about the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Application Name</h3>
              <p className="text-sm">SOS THS Marks Management System</p>
            </div>
            <div>
              <h3 className="font-medium">Version</h3>
              <p className="text-sm">1.0.0</p>
            </div>
            <div>
              <h3 className="font-medium">School</h3>
              <p className="text-sm">SOS Technical High School, Kigali</p>
            </div>
            <div>
              <h3 className="font-medium">Contact</h3>
              <p className="text-sm">info@sosths.edu.rw</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
