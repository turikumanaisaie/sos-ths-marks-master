
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';

type ModuleFormData = {
  modName: string;
  modCredits: number;
};

const initialFormData: ModuleFormData = {
  modName: '',
  modCredits: 10,
};

const Modules: React.FC = () => {
  const { modules, deleteModule, addModule, updateModule } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentModuleId(null);
    setIsEditing(false);
  };

  const handleOpenDialog = (module?: typeof modules[0]) => {
    if (module) {
      setFormData({
        modName: module.modName,
        modCredits: module.modCredits,
      });
      setCurrentModuleId(module.moduleId);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.modName || formData.modCredits <= 0) {
      toast.error('Please fill in all required fields with valid values');
      return;
    }
    
    if (isEditing && currentModuleId) {
      updateModule({ ...formData, moduleId: currentModuleId });
    } else {
      addModule(formData);
    }
    
    handleCloseDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'modCredits' ? parseInt(value) || 0 : value 
    }));
  };

  const filteredModules = modules.filter((module) =>
    module.modName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modules</h1>
          <p className="text-gray-500">Manage course modules and subjects</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-school-primary hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Module List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search modules..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredModules.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Module Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((module) => (
                    <TableRow key={module.moduleId}>
                      <TableCell className="font-medium">{module.moduleId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{module.modName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{module.modCredits}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(module)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteModule(module.moduleId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No modules found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Module' : 'Add New Module'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the module information.' : 'Enter the details of the new module.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="modName">Module Name</Label>
                <Input
                  id="modName"
                  name="modName"
                  value={formData.modName}
                  onChange={handleChange}
                  placeholder="e.g., Web Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modCredits">Credits</Label>
                <Input
                  type="number"
                  id="modCredits"
                  name="modCredits"
                  value={formData.modCredits}
                  onChange={handleChange}
                  min={1}
                  placeholder="e.g., 15"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-school-primary hover:bg-blue-800">
                {isEditing ? 'Update' : 'Add'} Module
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modules;
