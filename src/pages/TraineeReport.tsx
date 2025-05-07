
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const TraineeReport: React.FC = () => {
  const { trainees, trades, modules, marks, getTraineeById, getTradeById, getModuleById, getTraineesByTrade } = useData();
  
  const [selectedTradeId, setSelectedTradeId] = useState<number | null>(null);
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(null);
  const [availableTrainees, setAvailableTrainees] = useState<typeof trainees>([]);

  const handleTradeChange = (tradeId: string) => {
    const id = parseInt(tradeId);
    setSelectedTradeId(id);
    
    // Get trainees for selected trade
    const filteredTrainees = getTraineesByTrade(id);
    setAvailableTrainees(filteredTrainees);
    
    // Reset selected trainee if changing trade
    setSelectedTraineeId(null);
  };

  const handleTraineeChange = (traineeId: string) => {
    setSelectedTraineeId(parseInt(traineeId));
  };

  // Get trainee information and their marks
  const trainee = selectedTraineeId ? getTraineeById(selectedTraineeId) : null;
  const trade = trainee && selectedTradeId ? getTradeById(selectedTradeId) : null;
  const traineeMarks = trainee 
    ? marks.filter(mark => mark.traineeId === trainee.traineeId)
    : [];

  // Calculate average score
  const totalScore = traineeMarks.reduce((total, mark) => total + mark.totalMarks100, 0);
  const averageScore = traineeMarks.length > 0 ? totalScore / traineeMarks.length : 0;
  
  // Determine pass status
  const isPassing = averageScore >= 60;
  
  // Calculate grade distribution
  const excellentCount = traineeMarks.filter(mark => mark.totalMarks100 >= 80).length;
  const goodCount = traineeMarks.filter(mark => mark.totalMarks100 >= 70 && mark.totalMarks100 < 80).length;
  const averageCount = traineeMarks.filter(mark => mark.totalMarks100 >= 60 && mark.totalMarks100 < 70).length;
  const poorCount = traineeMarks.filter(mark => mark.totalMarks100 < 60).length;

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Trainee Report</h1>
        <p className="text-gray-500">View and print detailed reports for individual trainees</p>
      </div>

      <div className="print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Generate Trainee Report</CardTitle>
            <CardDescription>
              Select a trade and trainee to view their detailed assessment report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Trade</label>
                <Select
                  value={selectedTradeId?.toString() || ""}
                  onValueChange={handleTradeChange}
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
                <label className="text-sm font-medium">Select Trainee</label>
                <Select
                  value={selectedTraineeId?.toString() || ""}
                  onValueChange={handleTraineeChange}
                  disabled={availableTrainees.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableTrainees.length === 0 ? "Select a trade first" : "Select a trainee"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTrainees.map((trainee) => (
                      <SelectItem key={trainee.traineeId} value={trainee.traineeId.toString()}>
                        {trainee.firstNames} {trainee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {trainee && trade && traineeMarks.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold text-gray-800">Report Card</h2>
            <Button onClick={printReport}>
              <Download className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-school-primary">SOS THS</h1>
                <p className="text-gray-500">Technical High School</p>
                <p className="text-gray-500">Kinyinya Sector, GASABO District</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">Report Card</h2>
                <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Trainee Information</h3>
                <p><span className="font-semibold">Name:</span> {trainee.firstNames} {trainee.lastName}</p>
                <p><span className="font-semibold">Gender:</span> {trainee.gender}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Program Details</h3>
                <p><span className="font-semibold">Trade:</span> {trade.tradeName}</p>
                <p><span className="font-semibold">Term:</span> First Term</p>
                <p><span className="font-semibold">Academic Year:</span> 2024-2025</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Assessment Results</h3>
            <div className="rounded-md border overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-center">Formative (30%)</TableHead>
                    <TableHead className="text-center">Summative (30%)</TableHead>
                    <TableHead className="text-center">Comprehensive (40%)</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traineeMarks.map((mark) => {
                    const module = getModuleById(mark.moduleId);
                    
                    // Determine grade
                    let grade;
                    if (mark.totalMarks100 >= 80) grade = 'Excellent';
                    else if (mark.totalMarks100 >= 70) grade = 'Good';
                    else if (mark.totalMarks100 >= 60) grade = 'Average';
                    else grade = 'Poor';
                    
                    // Determine color class based on grade
                    let colorClass;
                    if (mark.totalMarks100 >= 80) colorClass = 'text-green-600';
                    else if (mark.totalMarks100 >= 70) colorClass = 'text-blue-600';
                    else if (mark.totalMarks100 >= 60) colorClass = 'text-yellow-600';
                    else colorClass = 'text-red-600';
                    
                    return (
                      <TableRow key={mark.markId}>
                        <TableCell className="font-medium">
                          {module ? module.modName : 'Unknown Module'}
                        </TableCell>
                        <TableCell className="text-center">{mark.formativeAss}</TableCell>
                        <TableCell className="text-center">{mark.summativeAss}</TableCell>
                        <TableCell className="text-center">{mark.comprehensiveAss}</TableCell>
                        <TableCell className="text-center font-medium">{mark.totalMarks100}%</TableCell>
                        <TableCell className={`text-right font-medium ${colorClass}`}>{grade}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Summary</h3>
                <p><span className="font-semibold">Average Score:</span> {averageScore.toFixed(1)}%</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={isPassing ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {' '}{isPassing ? 'PASS' : 'FAIL'}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Grade Distribution</h3>
                <p><span className="font-semibold">Excellent (80-100%):</span> {excellentCount} {excellentCount === 1 ? 'module' : 'modules'}</p>
                <p><span className="font-semibold">Good (70-79%):</span> {goodCount} {goodCount === 1 ? 'module' : 'modules'}</p>
                <p><span className="font-semibold">Average (60-69%):</span> {averageCount} {averageCount === 1 ? 'module' : 'modules'}</p>
                <p><span className="font-semibold">Poor (0-59%):</span> {poorCount} {poorCount === 1 ? 'module' : 'modules'}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="font-semibold">Deputy School Manager</p>
                <div className="h-12 border-b border-dashed border-gray-300 w-40"></div>
                <p>Signature & Stamp</p>
              </div>
              <div className="space-y-4 md:text-right">
                <p className="font-semibold">Date Issued</p>
                <div className="h-12 border-b border-dashed border-gray-300 w-40 md:ml-auto"></div>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {trainee && traineeMarks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No Assessment Records Found</h3>
            <p className="text-gray-500 text-center mt-1">
              There are no assessment records available for this trainee.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSelectedTraineeId(null)}>
              Select Another Trainee
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!trainee && selectedTradeId && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ChevronRight className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Select a Trainee</h3>
            <p className="text-gray-500 text-center mt-1">
              Please select a trainee to view their report card.
            </p>
          </CardContent>
        </Card>
      )}
      
      {!selectedTradeId && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ChevronRight className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Select a Trade</h3>
            <p className="text-gray-500 text-center mt-1">
              Please select a trade to view available trainees.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TraineeReport;
