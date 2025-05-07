
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
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

type TradeFormData = {
  tradeName: string;
};

const initialFormData: TradeFormData = {
  tradeName: '',
};

const Trades: React.FC = () => {
  const { trades, deleteTrade, addTrade, updateTrade, getTraineesByTrade } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTradeId, setCurrentTradeId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TradeFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentTradeId(null);
    setIsEditing(false);
  };

  const handleOpenDialog = (trade?: typeof trades[0]) => {
    if (trade) {
      setFormData({
        tradeName: trade.tradeName,
      });
      setCurrentTradeId(trade.tradeId);
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
    
    if (!formData.tradeName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isEditing && currentTradeId) {
      updateTrade({ ...formData, tradeId: currentTradeId });
    } else {
      addTrade(formData);
    }
    
    handleCloseDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteTrade = (tradeId: number) => {
    deleteTrade(tradeId);
  };

  const filteredTrades = trades.filter((trade) =>
    trade.tradeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trades</h1>
          <p className="text-gray-500">Manage SOS THS trades and courses</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-school-primary hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Trade
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Trade List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search trades..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredTrades.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Trade Name</TableHead>
                    <TableHead>Number of Trainees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => {
                    const traineesInTrade = getTraineesByTrade(trade.tradeId).length;
                    
                    return (
                      <TableRow key={trade.tradeId}>
                        <TableCell className="font-medium">{trade.tradeId}</TableCell>
                        <TableCell>{trade.tradeName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{traineesInTrade}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(trade)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTrade(trade.tradeId)}
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
              No trades found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Trade' : 'Add New Trade'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the trade information.' : 'Enter the name of the new trade.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tradeName">Trade Name</Label>
                <Input
                  id="tradeName"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  placeholder="e.g., Software Development L3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-school-primary hover:bg-blue-800">
                {isEditing ? 'Update' : 'Add'} Trade
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trades;
