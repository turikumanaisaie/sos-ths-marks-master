
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
import { FileText, Download, ChevronRight, BarChart3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CourseReport: React.FC = () => {
  const { modules, marks, trainees, trades, getTraineeById, getModuleById, getTradeById } = useData();
  
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(parseInt(moduleId));
  };

  // Get module information and related marks
  const module = selectedModuleId ? getModuleById(selectedModuleId) : null;
  const moduleMarks = module 
    ? marks.filter(mark => mark.moduleId === module.moduleId)
    : [];

  // Calculate statistics
  const totalMarks = moduleMarks.reduce((total, mark) => total + mark.totalMarks100, 0);
  const averageMark = moduleMarks.length > 0 ? totalMarks / moduleMarks.length : 0;
  const passRate = moduleMarks.length > 0 
    ? (moduleMarks.filter(mark => mark.totalMarks100 >= 60).length / moduleMarks.length) * 100
    : 0;
  
  // Find highest and lowest marks
  let highestMark = 0;
  let highestMarkTrainee = null;
  let lowestMark = 100;
  let lowestMarkTrainee = null;
  
  moduleMarks.forEach(mark => {
    const trainee = getTraineeById(mark.traineeId);
    
    if (mark.totalMarks100 > highestMark) {
      highestMark = mark.totalMarks100;
      highestMarkTrainee = trainee;
    }
    
    if (mark.totalMarks100 < lowestMark) {
      lowestMark = mark.totalMarks100;
      lowestMarkTrainee = trainee;
    }
  });

  // Prepare data for the chart
  const chartData = moduleMarks.map(mark => {
    const trainee = getTraineeById(mark.traineeId);
    return {
      name: trainee ? `${trainee.firstNames.charAt(0)}. ${trainee.lastName}` : `Unknown`,
      score: mark.totalMarks100,
      color: mark.totalMarks100 >= 80 ? '#22c55e' : 
            mark.totalMarks100 >= 70 ? '#3b82f6' : 
            mark.totalMarks100 >= 60 ? '#eab308' : 
            '#ef4444'
    };
  });

  const printReport = () => {
    window.print();
  };

  const getGradeClass = (marks: number): string => {
    if (marks >= 80) return 'text-green-600';
    if (marks >= 70) return 'text-blue-600';
    if (marks >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Module Report</h1>
        <p className="text-gray-500">View detailed performance reports for specific modules</p>
      </div>

      <div className="print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Generate Module Report</CardTitle>
            <CardDescription>
              Select a module to view detailed assessment statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Module</label>
                <Select
                  value={selectedModuleId?.toString() || ""}
                  onValueChange={handleModuleChange}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {module && moduleMarks.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold text-gray-800">Module Report</h2>
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
                <h2 className="text-xl font-bold">Module Performance Report</h2>
                <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Module Information</h3>
                <p><span className="font-semibold">Module Name:</span> {module.modName}</p>
                <p><span className="font-semibold">Credits:</span> {module.modCredits}</p>
                <p><span className="font-semibold">Total Students:</span> {moduleMarks.length}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Performance Summary</h3>
                <p><span className="font-semibold">Average Score:</span> {averageMark.toFixed(1)}%</p>
                <p><span className="font-semibold">Pass Rate:</span> {passRate.toFixed(1)}%</p>
                <p>
                  <span className="font-semibold">Highest Score:</span> {highestMark}% 
                  ({highestMarkTrainee ? `${highestMarkTrainee.firstNames} ${highestMarkTrainee.lastName}` : 'Unknown'})
                </p>
                <p>
                  <span className="font-semibold">Lowest Score:</span> {lowestMark}% 
                  ({lowestMarkTrainee ? `${lowestMarkTrainee.firstNames} ${lowestMarkTrainee.lastName}` : 'Unknown'})
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Performance Distribution</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0} 
                    />
                    <YAxis 
                      label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                      domain={[0, 100]} 
                    />
                    <Tooltip />
                    <Bar dataKey="score">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Detailed Results</h3>
            <div className="rounded-md border overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Trade</TableHead>
                    <TableHead className="text-center">Formative</TableHead>
                    <TableHead className="text-center">Summative</TableHead>
                    <TableHead className="text-center">Comprehensive</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moduleMarks
                    .sort((a, b) => b.totalMarks100 - a.totalMarks100)
                    .map((mark) => {
                    const trainee = getTraineeById(mark.traineeId);
                    const trade = getTradeById(mark.tradeId);
                    
                    // Determine grade
                    let grade;
                    if (mark.totalMarks100 >= 80) grade = 'Excellent';
                    else if (mark.totalMarks100 >= 70) grade = 'Good';
                    else if (mark.totalMarks100 >= 60) grade = 'Average';
                    else grade = 'Poor';
                    
                    return (
                      <TableRow key={mark.markId}>
                        <TableCell className="font-medium">
                          {trainee ? `${trainee.firstNames} ${trainee.lastName}` : 'Unknown'}
                        </TableCell>
                        <TableCell>{trade ? trade.tradeName : 'Unknown'}</TableCell>
                        <TableCell className="text-center">{mark.formativeAss}</TableCell>
                        <TableCell className="text-center">{mark.summativeAss}</TableCell>
                        <TableCell className="text-center">{mark.comprehensiveAss}</TableCell>
                        <TableCell className="text-center font-medium">{mark.totalMarks100}%</TableCell>
                        <TableCell className={`text-right font-medium ${getGradeClass(mark.totalMarks100)}`}>
                          {grade}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
      
      {module && moduleMarks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No Assessment Records Found</h3>
            <p className="text-gray-500 text-center mt-1">
              There are no assessment records available for this module.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSelectedModuleId(null)}>
              Select Another Module
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!module && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Select a Module</h3>
            <p className="text-gray-500 text-center mt-1">
              Please select a module to view performance statistics and reports.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseReport;
