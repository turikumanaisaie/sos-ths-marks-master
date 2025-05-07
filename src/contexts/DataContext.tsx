
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

// Define interfaces for our data models
export interface User {
  userId: number;
  username: string;
}

export interface Trade {
  tradeId: number;
  tradeName: string;
}

export interface Trainee {
  traineeId: number;
  firstNames: string;
  lastName: string;
  gender: string;
  tradeId: number;
}

export interface Module {
  moduleId: number;
  modName: string;
  modCredits: number;
}

export interface Mark {
  markId: number;
  traineeId: number;
  tradeId: number;
  moduleId: number;
  userId: number;
  formativeAss: number;
  summativeAss: number;
  comprehensiveAss: number;
  totalMarks100: number;
}

// Define the structure of our data context
interface DataContextType {
  // Data collections
  trades: Trade[];
  trainees: Trainee[];
  modules: Module[];
  marks: Mark[];
  users: User[];
  
  // Trade CRUD operations
  addTrade: (trade: Omit<Trade, 'tradeId'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: number) => void;
  
  // Trainee CRUD operations
  addTrainee: (trainee: Omit<Trainee, 'traineeId'>) => void;
  updateTrainee: (trainee: Trainee) => void;
  deleteTrainee: (traineeId: number) => void;
  
  // Module CRUD operations
  addModule: (module: Omit<Module, 'moduleId'>) => void;
  updateModule: (module: Module) => void;
  deleteModule: (moduleId: number) => void;
  
  // Mark CRUD operations
  addMark: (mark: Omit<Mark, 'markId'>) => void;
  updateMark: (mark: Mark) => void;
  deleteMark: (markId: number) => void;
  
  // Helper functions for getting related data
  getTradeById: (tradeId: number) => Trade | undefined;
  getTraineeById: (traineeId: number) => Trainee | undefined;
  getModuleById: (moduleId: number) => Module | undefined;
  getUserById: (userId: number) => User | undefined;
  getTraineesByTrade: (tradeId: number) => Trainee[];
  getMarksByTrainee: (traineeId: number) => Mark[];
  getMarksByModule: (moduleId: number) => Mark[];
  calculateTotalMarks: (formative: number, summative: number, comprehensive: number) => number;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Custom hook for using the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockTrades: Trade[] = [
  { tradeId: 1, tradeName: 'Software Development L3' },
  { tradeId: 2, tradeName: 'Software Development L4' },
  { tradeId: 3, tradeName: 'Software Development L5' },
  { tradeId: 4, tradeName: 'Multimedia L3' },
  { tradeId: 5, tradeName: 'Multimedia L4' },
];

const mockTrainees: Trainee[] = [
  { traineeId: 1, firstNames: 'John', lastName: 'Doe', gender: 'Male', tradeId: 1 },
  { traineeId: 2, firstNames: 'Jane', lastName: 'Smith', gender: 'Female', tradeId: 1 },
  { traineeId: 3, firstNames: 'Michael', lastName: 'Johnson', gender: 'Male', tradeId: 2 },
  { traineeId: 4, firstNames: 'Emily', lastName: 'Wilson', gender: 'Female', tradeId: 3 },
  { traineeId: 5, firstNames: 'David', lastName: 'Brown', gender: 'Male', tradeId: 4 },
];

const mockModules: Module[] = [
  { moduleId: 1, modName: 'Web Development', modCredits: 20 },
  { moduleId: 2, modName: 'Database Design', modCredits: 15 },
  { moduleId: 3, modName: 'Programming Fundamentals', modCredits: 25 },
  { moduleId: 4, modName: 'UI/UX Design', modCredits: 15 },
  { moduleId: 5, modName: 'Mobile Development', modCredits: 20 },
];

const mockUsers: User[] = [
  { userId: 1, username: 'admin' },
  { userId: 2, username: 'deputy' },
];

const mockMarks: Mark[] = [
  { markId: 1, traineeId: 1, tradeId: 1, moduleId: 1, userId: 2, formativeAss: 80, summativeAss: 75, comprehensiveAss: 85, totalMarks100: 80 },
  { markId: 2, traineeId: 1, tradeId: 1, moduleId: 2, userId: 2, formativeAss: 70, summativeAss: 80, comprehensiveAss: 75, totalMarks100: 75 },
  { markId: 3, traineeId: 2, tradeId: 1, moduleId: 1, userId: 2, formativeAss: 85, summativeAss: 90, comprehensiveAss: 80, totalMarks100: 85 },
  { markId: 4, traineeId: 3, tradeId: 2, moduleId: 3, userId: 2, formativeAss: 75, summativeAss: 70, comprehensiveAss: 80, totalMarks100: 75 },
  { markId: 5, traineeId: 4, tradeId: 3, moduleId: 5, userId: 2, formativeAss: 90, summativeAss: 85, comprehensiveAss: 95, totalMarks100: 90 },
];

// Data provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize with mock data
  useEffect(() => {
    // Check localStorage first
    const storedTrades = localStorage.getItem('sosTrades');
    const storedTrainees = localStorage.getItem('sosTrainees');
    const storedModules = localStorage.getItem('sosModules');
    const storedMarks = localStorage.getItem('sosMarks');
    const storedUsers = localStorage.getItem('sosUsers');

    // Set data from localStorage or use mock data
    setTrades(storedTrades ? JSON.parse(storedTrades) : mockTrades);
    setTrainees(storedTrainees ? JSON.parse(storedTrainees) : mockTrainees);
    setModules(storedModules ? JSON.parse(storedModules) : mockModules);
    setMarks(storedMarks ? JSON.parse(storedMarks) : mockMarks);
    setUsers(storedUsers ? JSON.parse(storedUsers) : mockUsers);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sosTrades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('sosTrainees', JSON.stringify(trainees));
  }, [trainees]);

  useEffect(() => {
    localStorage.setItem('sosModules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('sosMarks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('sosUsers', JSON.stringify(users));
  }, [users]);

  // Trade CRUD operations
  const addTrade = (trade: Omit<Trade, 'tradeId'>) => {
    const newTradeId = trades.length > 0 ? Math.max(...trades.map(t => t.tradeId)) + 1 : 1;
    const newTrade = { ...trade, tradeId: newTradeId };
    setTrades([...trades, newTrade]);
    toast.success('Trade added successfully');
  };

  const updateTrade = (trade: Trade) => {
    setTrades(trades.map(t => t.tradeId === trade.tradeId ? trade : t));
    toast.success('Trade updated successfully');
  };

  const deleteTrade = (tradeId: number) => {
    // Check if any trainees are assigned to this trade
    const assignedTrainees = trainees.filter(t => t.tradeId === tradeId);
    if (assignedTrainees.length > 0) {
      toast.error('Cannot delete trade: There are trainees assigned to this trade');
      return;
    }

    // Check if any marks are associated with this trade
    const associatedMarks = marks.filter(m => m.tradeId === tradeId);
    if (associatedMarks.length > 0) {
      toast.error('Cannot delete trade: There are marks associated with this trade');
      return;
    }

    setTrades(trades.filter(t => t.tradeId !== tradeId));
    toast.success('Trade deleted successfully');
  };

  // Trainee CRUD operations
  const addTrainee = (trainee: Omit<Trainee, 'traineeId'>) => {
    const newTraineeId = trainees.length > 0 ? Math.max(...trainees.map(t => t.traineeId)) + 1 : 1;
    const newTrainee = { ...trainee, traineeId: newTraineeId };
    setTrainees([...trainees, newTrainee]);
    toast.success('Trainee added successfully');
  };

  const updateTrainee = (trainee: Trainee) => {
    setTrainees(trainees.map(t => t.traineeId === trainee.traineeId ? trainee : t));
    toast.success('Trainee updated successfully');
  };

  const deleteTrainee = (traineeId: number) => {
    // Check if any marks are associated with this trainee
    const associatedMarks = marks.filter(m => m.traineeId === traineeId);
    if (associatedMarks.length > 0) {
      toast.error('Cannot delete trainee: There are marks associated with this trainee');
      return;
    }

    setTrainees(trainees.filter(t => t.traineeId !== traineeId));
    toast.success('Trainee deleted successfully');
  };

  // Module CRUD operations
  const addModule = (module: Omit<Module, 'moduleId'>) => {
    const newModuleId = modules.length > 0 ? Math.max(...modules.map(m => m.moduleId)) + 1 : 1;
    const newModule = { ...module, moduleId: newModuleId };
    setModules([...modules, newModule]);
    toast.success('Module added successfully');
  };

  const updateModule = (module: Module) => {
    setModules(modules.map(m => m.moduleId === module.moduleId ? module : m));
    toast.success('Module updated successfully');
  };

  const deleteModule = (moduleId: number) => {
    // Check if any marks are associated with this module
    const associatedMarks = marks.filter(m => m.moduleId === moduleId);
    if (associatedMarks.length > 0) {
      toast.error('Cannot delete module: There are marks associated with this module');
      return;
    }

    setModules(modules.filter(m => m.moduleId !== moduleId));
    toast.success('Module deleted successfully');
  };

  // Mark CRUD operations
  const calculateTotalMarks = (formative: number, summative: number, comprehensive: number): number => {
    // 30% formative, 30% summative, 40% comprehensive
    return Math.round((0.3 * formative) + (0.3 * summative) + (0.4 * comprehensive));
  };

  const addMark = (mark: Omit<Mark, 'markId'>) => {
    const newMarkId = marks.length > 0 ? Math.max(...marks.map(m => m.markId)) + 1 : 1;
    
    // Calculate total marks if not provided
    const totalMarks = mark.totalMarks100 || 
      calculateTotalMarks(mark.formativeAss, mark.summativeAss, mark.comprehensiveAss);
    
    const newMark = { ...mark, markId: newMarkId, totalMarks100: totalMarks };
    setMarks([...marks, newMark]);
    toast.success('Mark added successfully');
  };

  const updateMark = (mark: Mark) => {
    // Recalculate total marks
    const totalMarks = calculateTotalMarks(mark.formativeAss, mark.summativeAss, mark.comprehensiveAss);
    const updatedMark = { ...mark, totalMarks100: totalMarks };
    
    setMarks(marks.map(m => m.markId === mark.markId ? updatedMark : m));
    toast.success('Mark updated successfully');
  };

  const deleteMark = (markId: number) => {
    setMarks(marks.filter(m => m.markId !== markId));
    toast.success('Mark deleted successfully');
  };

  // Helper functions
  const getTradeById = (tradeId: number) => {
    return trades.find(t => t.tradeId === tradeId);
  };

  const getTraineeById = (traineeId: number) => {
    return trainees.find(t => t.traineeId === traineeId);
  };

  const getModuleById = (moduleId: number) => {
    return modules.find(m => m.moduleId === moduleId);
  };

  const getUserById = (userId: number) => {
    return users.find(u => u.userId === userId);
  };

  const getTraineesByTrade = (tradeId: number) => {
    return trainees.filter(t => t.tradeId === tradeId);
  };

  const getMarksByTrainee = (traineeId: number) => {
    return marks.filter(m => m.traineeId === traineeId);
  };

  const getMarksByModule = (moduleId: number) => {
    return marks.filter(m => m.moduleId === moduleId);
  };

  return (
    <DataContext.Provider value={{
      trades,
      trainees,
      modules,
      marks,
      users,
      
      addTrade,
      updateTrade,
      deleteTrade,
      
      addTrainee,
      updateTrainee,
      deleteTrainee,
      
      addModule,
      updateModule,
      deleteModule,
      
      addMark,
      updateMark,
      deleteMark,
      
      getTradeById,
      getTraineeById,
      getModuleById,
      getUserById,
      getTraineesByTrade,
      getMarksByTrainee,
      getMarksByModule,
      calculateTotalMarks,
    }}>
      {children}
    </DataContext.Provider>
  );
};
