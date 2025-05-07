
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

type TraineeFormData = {
  firstNames: string;
  lastName: string;
  gender: string;
  tradeId: number;
};

const initialFormData: TraineeFormData = {
  firstNames: '',
  lastName: '',
  gender: 'Male',
  tradeId: 0,
};

const Trainees: React.FC = () => {
  const { trainees, trades, deleteTrainee, addTrainee, updateTrainee, getTradeById } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTraineeId, setCurrentTraineeId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TraineeFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<number | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentTraineeId(null);
    setIsEditing(false);
  };

  const handleOpenDialog = (trainee?: typeof trainees[0]) => {
    if (trainee) {
      setFormData({
        firstNames: trainee.firstNames,
        lastName: trainee.lastName,
        gender: trainee.gender,
        tradeId: trainee.tradeId,
      });
      setCurrentTraineeId(trainee.traineeId);
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
    
    if (!formData.firstNames || !formData.lastName || !formData.tradeId) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (isEditing && currentTraineeId) {
      updateTrainee({ ...formData, traineeId: currentTraineeId });
    } else {
      addTrainee(formData);
    }
    
    handleCloseDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === 'tradeId' ? parseInt(value) : value }));
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      trainee.firstNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTrade = selectedTrade ? trainee.tradeId === selectedTrade : true;
    
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trainees</h1>
          <p className="text-gray-500">Manage trainee information</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-school-primary hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Trainee
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Trainee List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search trainees..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedTrade?.toString() || ""}
                onValueChange={(value) => setSelectedTrade(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by trade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Trades</SelectItem>
                  {trades.map((trade) => (
                    <SelectItem key={trade.tradeId} value={trade.tradeId.toString()}>
                      {trade.tradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTrainees.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>First Names</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Trade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainees.map((trainee) => {
                    const trade = getTradeById(trainee.tradeId);
                    
                    return (
                      <TableRow key={trainee.traineeId}>
                        <TableCell className="font-medium">{trainee.traineeId}</TableCell>
                        <TableCell>{trainee.firstNames}</TableCell>
                        <TableCell>{trainee.lastName}</TableCell>
                        <TableCell>{trainee.gender}</TableCell>
                        <TableCell>
                          {trade ? trade.tradeName : 'Unknown Trade'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(trainee)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTrainee(trainee.traineeId)}
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
          ) : (
            <div className="text-center p-8 text-gray-500">
              No trainees found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Trainee' : 'Add New Trainee'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the trainee information.' : 'Enter the details of the new trainee.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstNames">First Names</Label>
                  <Input
                    id="firstNames"
                    name="firstNames"
                    value={formData.firstNames}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trade">Trade</Label>
                <Select
                  value={formData.tradeId.toString()}
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
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-school-primary hover:bg-blue-800">
                {isEditing ? 'Update' : 'Add'} Trainee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trainees;
