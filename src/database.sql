
-- Create the SOS_MIS database
CREATE DATABASE IF NOT EXISTS SOS_MIS;
USE SOS_MIS;

-- Users table
CREATE TABLE Users (
  Users_Id INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(50) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL
);

-- Trades table
CREATE TABLE Trades (
  Trade_Id INT AUTO_INCREMENT PRIMARY KEY,
  Trade_Name VARCHAR(100) NOT NULL
);

-- Trainees table
CREATE TABLE Trainees (
  Trainee_Id INT AUTO_INCREMENT PRIMARY KEY,
  FirstNames VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  Gender VARCHAR(10) NOT NULL,
  Trade_Id INT NOT NULL,
  FOREIGN KEY (Trade_Id) REFERENCES Trades(Trade_Id)
);

-- Modules table
CREATE TABLE Modules (
  Module_Id INT AUTO_INCREMENT PRIMARY KEY,
  ModName VARCHAR(100) NOT NULL,
  ModCredits INT NOT NULL
);

-- Marks table
CREATE TABLE Marks (
  Mark_ID INT AUTO_INCREMENT PRIMARY KEY,
  Trainee_Id INT NOT NULL,
  Trade_Id INT NOT NULL,
  Module_Id INT NOT NULL,
  User_Id INT NOT NULL,
  Formative_Ass DECIMAL(5,2) NOT NULL,
  Summative_Ass DECIMAL(5,2) NOT NULL,
  Comprehensive_Ass DECIMAL(5,2) NOT NULL,
  Total_Marks_100 DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (Trainee_Id) REFERENCES Trainees(Trainee_Id),
  FOREIGN KEY (Trade_Id) REFERENCES Trades(Trade_Id),
  FOREIGN KEY (Module_Id) REFERENCES Modules(Module_Id),
  FOREIGN KEY (User_Id) REFERENCES Users(Users_Id)
);

-- Insert sample users
INSERT INTO Users (UserName, Password) VALUES
('admin', 'admin123'),
('deputy', 'deputy123');

-- Insert sample trades
INSERT INTO Trades (Trade_Name) VALUES
('Software Development L3'),
('Software Development L4'),
('Software Development L5'),
('Multimedia L3'),
('Multimedia L4');

-- Insert sample modules
INSERT INTO Modules (ModName, ModCredits) VALUES
('Web Development', 20),
('Database Design', 15),
('Programming Fundamentals', 25),
('UI/UX Design', 15),
('Mobile Development', 20);

-- Insert sample trainees
INSERT INTO Trainees (FirstNames, LastName, Gender, Trade_Id) VALUES
('John', 'Doe', 'Male', 1),
('Jane', 'Smith', 'Female', 1),
('Michael', 'Johnson', 'Male', 2),
('Emily', 'Wilson', 'Female', 3),
('David', 'Brown', 'Male', 4);

-- Insert sample marks
INSERT INTO Marks (Trainee_Id, Trade_Id, Module_Id, User_Id, Formative_Ass, Summative_Ass, Comprehensive_Ass, Total_Marks_100) VALUES
(1, 1, 1, 2, 80, 75, 85, 80.5),
(1, 1, 2, 2, 70, 80, 75, 75),
(2, 1, 1, 2, 85, 90, 80, 84.5),
(3, 2, 3, 2, 75, 70, 80, 75.5),
(4, 3, 5, 2, 90, 85, 95, 90.5);
