
import React from 'react';
import { useData } from '@/contexts/DataContext';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { trainees, trades, modules, marks } = useData();

  // Calculate passing rate
  const passedMarks = marks.filter(mark => mark.totalMarks100 >= 60).length;
  const passingRate = marks.length > 0 ? (passedMarks / marks.length) * 100 : 0;

  // Data for grade distribution chart
  const excellentCount = marks.filter(mark => mark.totalMarks100 >= 80).length;
  const goodCount = marks.filter(mark => mark.totalMarks100 >= 70 && mark.totalMarks100 < 80).length;
  const averageCount = marks.filter(mark => mark.totalMarks100 >= 60 && mark.totalMarks100 < 70).length;
  const poorCount = marks.filter(mark => mark.totalMarks100 < 60).length;

  const gradeData = [
    { name: 'Excellent', value: excellentCount, color: '#22c55e' },
    { name: 'Good', value: goodCount, color: '#3b82f6' },
    { name: 'Average', value: averageCount, color: '#eab308' },
    { name: 'Poor', value: poorCount, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Get recent marks
  const recentMarks = [...marks]
    .sort((a, b) => b.markId - a.markId)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of SOS THS Marks Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Trainees"
          value={trainees.length}
          icon={<Users size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Trades"
          value={trades.length}
          icon={<GraduationCap size={24} />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Modules"
          value={modules.length}
          icon={<BookOpen size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Assessments"
          value={marks.length}
          icon={<ClipboardList size={24} />}
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>
              Distribution of grades across all assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gradeData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {gradeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No grade data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Added Marks</CardTitle>
            <CardDescription>
              Latest assessment results entered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMarks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Total Mark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMarks.map((mark) => {
                    const trainee = trainees.find(t => t.traineeId === mark.traineeId);
                    const module = modules.find(m => m.moduleId === mark.moduleId);
                    
                    return (
                      <TableRow key={mark.markId}>
                        <TableCell>
                          {trainee ? `${trainee.firstNames} ${trainee.lastName}` : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {module ? module.modName : 'Unknown'}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span 
                            className={`px-2 py-1 rounded text-xs ${
                              mark.totalMarks100 >= 80 
                                ? 'bg-green-100 text-green-800' 
                                : mark.totalMarks100 >= 60 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {mark.totalMarks100}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No recent marks available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
