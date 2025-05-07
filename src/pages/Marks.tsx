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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type MarkFormData = {
  traineeId: number;
  tradeId: number;
  moduleId: number;
  formativeAss: number;
  summativeAss: number;
  comprehensiveAss: number;
};

const initialFormData: MarkFormData = {
  traineeId: 0,
  tradeId: 0,
  moduleId: 0,
  formativeAss: 0,
  summativeAss: 0,
  comprehensiveAss: 0,
};

const Marks: React.FC = () => {
  const { user } = useAuth();
  const { 
    marks, 
    trainees, 
    trades, 
    modules, 
    deleteMark, 
    addMark, 
    updateMark, 
    getTraineeById, 
    getTradeById, 
    getModuleById,
    calculateTotalMarks,
    getTraineesByTrade 
  } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMarkId, setCurrentMarkId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MarkFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<number | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | null>(null);
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([]);

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentMarkId(null);
    setIsEditing(false);
  };

  const handleOpenDialog = (mark?: typeof marks[0]) => {
    if (mark) {
      setFormData({
        traineeId: mark.traineeId,
        tradeId: mark.tradeId,
        moduleId: mark.moduleId,
        formativeAss: mark.formativeAss,
        summativeAss: mark.summativeAss,
        comprehensiveAss: mark.comprehensiveAss,
      });
      setCurrentMarkId(mark.markId);
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
    
    const { traineeId, tradeId, moduleId, formativeAss, summativeAss, comprehensiveAss } = formData;
    
    if (!traineeId || !tradeId || !moduleId) {
      toast.error('Please select trainee, trade and module');
      return;
    }
    
    if (formativeAss < 0 || formativeAss > 100 || 
        summativeAss < 0 || summativeAss > 100 || 
        comprehensiveAss < 0 || comprehensiveAss > 100) {
      toast.error('All assessment scores must be between 0 and 100');
      return;
    }
    
    const totalMarks100 = calculateTotalMarks(formativeAss, summativeAss, comprehensiveAss);
    
    if (isEditing && currentMarkId) {
      updateMark({ 
        ...formData, 
        markId: currentMarkId, 
        userId: user?.userId || 0,
        totalMarks100 
      });
    } else {
      addMark({ 
        ...formData, 
        userId: user?.userId || 0,
        totalMarks100 
      });
    }
    
    handleCloseDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'formativeAss' || name === 'summativeAss' || name === 'comprehensiveAss' 
      ? Math.min(100, Math.max(0, parseInt(value) || 0)) 
      : parseInt(value) || 0;
    
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (name === 'tradeId') {
      // When trade changes, update the available trainees
      const traineesList = getTraineesByTrade(numValue);
      if (traineesList.length > 0) {
        setSelectedTrainees(traineesList.map(t => t.traineeId));
        // Auto-select the first trainee if the trade changes
        setFormData((prev) => ({ ...prev, [name]: numValue, traineeId: traineesList[0].traineeId }));
      } else {
        setSelectedTrainees([]);
        setFormData((prev) => ({ ...prev, [name]: numValue, traineeId: 0 }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  const filteredMarks = marks.filter((mark) => {
    const trainee = getTraineeById(mark.traineeId);
    const module = getModuleById(mark.moduleId);
    
    const fullName = trainee 
      ? `${trainee.firstNames} ${trainee.lastName}`.toLowerCase() 
      : '';
    const moduleName = module ? module.modName.toLowerCase() : '';
    
    const matchesSearch = searchTerm === '' || 
      fullName.includes(searchTerm.toLowerCase()) || 
      moduleName.includes(searchTerm.toLowerCase());
      
    const matchesTrade = selectedTradeFilter === null || mark.tradeId === selectedTradeFilter;
    const matchesModule = selectedModuleFilter === null || mark.moduleId === selectedModuleFilter;
    
    return matchesSearch && matchesTrade && matchesModule;
  });

  const getGradeClass = (marks: number): string => {
    if (marks >= 80) return 'bg-green-100 text-green-800';
    if (marks >= 70) return 'bg-blue-100 text-blue-800';
    if (marks >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marks Management</h1>
          <p className="text-gray-500">Record and manage trainee assessment marks</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-school-primary hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Marks
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Assessment Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by trainee name or module..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedTradeFilter?.toString() || ""}
                onValueChange={(value) => setSelectedTradeFilter(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by trade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  {trades.map((trade) => (
                    <SelectItem key={trade.tradeId} value={trade.tradeId.toString()}>
                      {trade.tradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedModuleFilter?.toString() || ""}
                onValueChange={(value) => setSelectedModuleFilter(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module.moduleId} value={module.moduleId.toString()}>
                      {module.modName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredMarks.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Trainee</TableHead>
                      <TableHead>Trade</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Formative (30%)</TableHead>
                      <TableHead>Summative (30%)</TableHead>
                      <TableHead>Comprehensive (40%)</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarks.map((mark) => {
                      const trainee = getTraineeById(mark.traineeId);
                      const trade = getTradeById(mark.tradeId);
                      const module = getModuleById(mark.moduleId);
                      
                      return (
                        <TableRow key={mark.markId}>
                          <TableCell className="font-medium">{mark.markId}</TableCell>
                          <TableCell>
                            {trainee ? `${trainee.firstNames} ${trainee.lastName}` : 'Unknown'}
                          </TableCell>
                          <TableCell>{trade ? trade.tradeName : 'Unknown'}</TableCell>
                          <TableCell>{module ? module.modName : 'Unknown'}</TableCell>
                          <TableCell>{mark.formativeAss}</TableCell>
                          <TableCell>{mark.summativeAss}</TableCell>
                          <TableCell>{mark.comprehensiveAss}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${getGradeClass(mark.totalMarks100)}`}>
                              {mark.totalMarks100}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(mark)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteMark(mark.markId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No marks found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Assessment Marks' : 'Add New Assessment Marks'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the assessment marks for this trainee.' : 'Enter assessment marks for a trainee.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tradeId">Trade</Label>
                <Select
                  value={formData.tradeId ? formData.tradeId.toString() : ""}
                  onValueChange={(value) => handleSelectChange('tradeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map((trade) => (
                      <SelectItem key={trade.tradeId} value={trade.tradeId.toString()}>
                        {trade.tradeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="traineeId">Trainee</Label>
                <Select
                  value={formData.traineeId ? formData.traineeId.toString() : ""}
                  onValueChange={(value) => handleSelectChange('traineeId', value)}
                  disabled={selectedTrainees.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedTrainees.length === 0 ? "Select a trade first" : "Select a trainee"} />
                  </SelectTrigger>
                  <SelectContent>
                    {trainees
                      .filter(trainee => selectedTrainees.includes(trainee.traineeId))
                      .map((trainee) => (
                        <SelectItem key={trainee.traineeId} value={trainee.traineeId.toString()}>
                          {`${trainee.firstNames} ${trainee.lastName}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moduleId">Module</Label>
                <Select
                  value={formData.moduleId ? formData.moduleId.toString() : ""}
                  onValueChange={(value) => handleSelectChange('moduleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.moduleId} value={module.moduleId.toString()}>
                        {module.modName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formativeAss">Formative (30%)</Label>
                  <Input
                    type="number"
                    id="formativeAss"
                    name="formativeAss"
                    value={formData.formativeAss}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summativeAss">Summative (30%)</Label>
                  <Input
                    type="number"
                    id="summativeAss"
                    name="summativeAss"
                    value={formData.summativeAss}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comprehensiveAss">Comprehensive (40%)</Label>
                  <Input
                    type="number"
                    id="comprehensiveAss"
                    name="comprehensiveAss"
                    value={formData.comprehensiveAss}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    required
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  Total Mark: <strong>{calculateTotalMarks(formData.formativeAss, formData.summativeAss, formData.comprehensiveAss)}%</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Formula: 30% Formative + 30% Summative + 40% Comprehensive)
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-school-primary hover:bg-blue-800">
                {isEditing ? 'Update' : 'Add'} Marks
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marks;
