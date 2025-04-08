import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calculator, Percent, Clock, Calendar, BarChart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

// Calculator mode types
type CalculatorMode = 'basic' | 'scientific' | 'gpa' | 'grade' | 'units' | 'date';

const AdvancedCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('basic');
  
  // Basic Calculator State
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  
  // GPA Calculator State
  const [courses, setCourses] = useState([
    { name: 'Course 1', credits: 3, grade: 'A' },
    { name: 'Course 2', credits: 4, grade: 'B+' },
  ]);
  const [gpaResult, setGpaResult] = useState(0);
  
  // Grade Calculator State
  const [gradeComponents, setGradeComponents] = useState([
    { name: 'Midterm', weight: 30, score: 85 },
    { name: 'Final Exam', weight: 40, score: 0 },
    { name: 'Assignments', weight: 20, score: 90 },
    { name: 'Participation', weight: 10, score: 95 },
  ]);
  const [targetGrade, setTargetGrade] = useState(80);
  const [requiredScore, setRequiredScore] = useState(0);
  
  // Date Calculator State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [dateDifference, setDateDifference] = useState({ days: 0, weeks: 0, months: 0 });
  
  // Utils for basic calculator operations
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };
  
  const clearDisplay = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const toggleSign = () => {
    setDisplayValue(String(-parseFloat(displayValue)));
  };
  
  const inputPercent = () => {
    const value = parseFloat(displayValue) / 100;
    setDisplayValue(String(value));
  };
  
  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };
  
  // Utils for GPA calculator
  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    courses.forEach(course => {
      const credits = course.credits;
      const gradePoint = gradePoints[course.grade] || 0;
      
      totalCredits += credits;
      totalPoints += credits * gradePoint;
    });
    
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGpaResult(parseFloat(gpa.toFixed(2)));
  };
  
  // Add a new course to GPA calculator
  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: 3, grade: 'B' }]);
  };
  
  // Remove a course from GPA calculator
  const removeCourse = (index: number) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };
  
  // Update a course in GPA calculator
  const updateCourse = (index: number, field: 'name' | 'credits' | 'grade', value: string | number) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };
  
  // Calculate required final exam score
  const calculateRequiredScore = () => {
    // Find the final exam component
    const finalExamIndex = gradeComponents.findIndex(c => c.name === 'Final Exam');
    if (finalExamIndex === -1) return;
    
    const finalExamWeight = gradeComponents[finalExamIndex].weight;
    
    // Calculate current weighted score without final exam
    let currentTotalWeight = 0;
    let currentWeightedScore = 0;
    
    gradeComponents.forEach((component, index) => {
      if (index !== finalExamIndex) {
        currentTotalWeight += component.weight;
        currentWeightedScore += (component.score * component.weight) / 100;
      }
    });
    
    // Calculate required score for final exam
    const remainingScore = targetGrade - currentWeightedScore;
    const requiredFinalScore = (remainingScore * 100) / finalExamWeight;
    
    setRequiredScore(parseFloat(requiredFinalScore.toFixed(2)));
  };
  
  // Calculate date difference
  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate weeks and months (approximate)
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average days in a month
    
    setDateDifference({
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths
    });
  };
  
  // Effect hooks
  useEffect(() => {
    calculateGPA();
  }, [courses]);
  
  useEffect(() => {
    calculateRequiredScore();
  }, [gradeComponents, targetGrade]);
  
  useEffect(() => {
    calculateDateDifference();
  }, [startDate, endDate]);
  
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Advanced Calculator</h2>
        <p className="text-muted-foreground">Multiple calculators for students</p>
      </div>
      
      <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as CalculatorMode)}>
        <div className="flex items-center justify-center mb-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="basic" className="flex flex-col items-center py-2 px-4">
              <Calculator className="h-4 w-4 mb-1" />
              <span className="text-xs">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="scientific" className="flex flex-col items-center py-2 px-4">
              <Calculator className="h-4 w-4 mb-1" />
              <span className="text-xs">Scientific</span>
            </TabsTrigger>
            <TabsTrigger value="gpa" className="flex flex-col items-center py-2 px-4">
              <Award className="h-4 w-4 mb-1" />
              <span className="text-xs">GPA</span>
            </TabsTrigger>
            <TabsTrigger value="grade" className="flex flex-col items-center py-2 px-4">
              <Percent className="h-4 w-4 mb-1" />
              <span className="text-xs">Grade</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="flex flex-col items-center py-2 px-4">
              <BarChart className="h-4 w-4 mb-1" />
              <span className="text-xs">Units</span>
            </TabsTrigger>
            <TabsTrigger value="date" className="flex flex-col items-center py-2 px-4">
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">Date</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Basic Calculator */}
        <TabsContent value="basic">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Basic Calculator</CardTitle>
              <CardDescription>
                Perform simple arithmetic calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="bg-muted p-4 rounded-md mb-4">
                  <div className="text-right text-3xl font-mono">
                    {displayValue}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" onClick={clearDisplay}>C</Button>
                  <Button variant="outline" onClick={toggleSign}>+/-</Button>
                  <Button variant="outline" onClick={inputPercent}>%</Button>
                  <Button variant="secondary" onClick={() => performOperation('/')}>/</Button>
                  
                  <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
                  <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
                  <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
                  <Button variant="secondary" onClick={() => performOperation('*')}>×</Button>
                  
                  <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
                  <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
                  <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
                  <Button variant="secondary" onClick={() => performOperation('-')}>-</Button>
                  
                  <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
                  <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
                  <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
                  <Button variant="secondary" onClick={() => performOperation('+')}>+</Button>
                  
                  <Button variant="outline" onClick={() => inputDigit('0')} className="col-span-2">0</Button>
                  <Button variant="outline" onClick={inputDecimal}>.</Button>
                  <Button variant="default" onClick={() => performOperation('=')}>=</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scientific Calculator */}
        <TabsContent value="scientific">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Scientific Calculator</CardTitle>
              <CardDescription>
                Advanced scientific calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                Scientific calculator features coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* GPA Calculator */}
        <TabsContent value="gpa">
          <Card>
            <CardHeader>
              <CardTitle>GPA Calculator</CardTitle>
              <CardDescription>
                Calculate your Grade Point Average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="mb-4 p-6 border rounded-md bg-muted/30">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Your GPA</h3>
                    <div className="text-5xl font-bold">{gpaResult.toFixed(2)}</div>
                    <p className="text-muted-foreground mt-2">
                      Based on {courses.length} courses
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Courses</h3>
                    <Button onClick={addCourse} size="sm">
                      Add Course
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-md flex flex-wrap items-center gap-4"
                      >
                        <div className="grow min-w-[200px]">
                          <Label htmlFor={`course-${index}`}>Course Name</Label>
                          <Input
                            id={`course-${index}`}
                            value={course.name}
                            onChange={(e) => updateCourse(index, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="w-24">
                          <Label htmlFor={`credits-${index}`}>Credits</Label>
                          <Select
                            value={course.credits.toString()}
                            onValueChange={(value) => updateCourse(index, 'credits', parseInt(value))}
                          >
                            <SelectTrigger id={`credits-${index}`} className="mt-1">
                              <SelectValue placeholder="Credits" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((credit) => (
                                <SelectItem key={credit} value={credit.toString()}>
                                  {credit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="w-24">
                          <Label htmlFor={`grade-${index}`}>Grade</Label>
                          <Select
                            value={course.grade}
                            onValueChange={(value) => updateCourse(index, 'grade', value)}
                          >
                            <SelectTrigger id={`grade-${index}`} className="mt-1">
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeCourse(index)}
                            className="mt-1"
                          >
                            Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Grade Calculator */}
        <TabsContent value="grade">
          <Card>
            <CardHeader>
              <CardTitle>Grade Calculator</CardTitle>
              <CardDescription>
                Calculate what you need on your final exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Components</h3>
                    {gradeComponents.map((component, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="mb-2">
                          <Label>{component.name}</Label>
                          <div className="text-muted-foreground text-sm">
                            Weight: {component.weight}%
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <Label>Score: {component.score}%</Label>
                          </div>
                          <Slider
                            value={[component.score]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => {
                              const newComponents = [...gradeComponents];
                              newComponents[index].score = value[0];
                              setGradeComponents(newComponents);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <Label>Target Overall Grade</Label>
                    <div className="text-muted-foreground text-sm mb-2">
                      What grade do you want to achieve?
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[targetGrade]}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                        onValueChange={(value) => setTargetGrade(value[0])}
                      />
                      <div className="w-16 text-center font-medium">
                        {targetGrade}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="p-6 border rounded-md bg-muted/30 flex-1 flex flex-col justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">
                        To achieve a {targetGrade}% overall grade
                      </h3>
                      <h4 className="text-md text-muted-foreground mb-4">
                        You need to score this on your Final Exam:
                      </h4>
                      
                      <div className="text-5xl font-bold mt-6 mb-2">
                        {requiredScore < 0 ? 0 : requiredScore > 100 ? '100+' : requiredScore}%
                      </div>
                      
                      <div className="mt-4 text-sm">
                        {requiredScore <= 0 ? (
                          <p className="text-green-500 dark:text-green-400">
                            You've already achieved your target grade!
                          </p>
                        ) : requiredScore > 100 ? (
                          <p className="text-destructive">
                            It's not possible to achieve your target grade.
                          </p>
                        ) : requiredScore > 90 ? (
                          <p className="text-amber-500 dark:text-amber-400">
                            This will be challenging. Consider adjusting your target.
                          </p>
                        ) : (
                          <p className="text-green-500 dark:text-green-400">
                            This is achievable with good preparation.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Unit Converter */}
        <TabsContent value="units">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Unit Converter</CardTitle>
              <CardDescription>
                Convert between different units of measurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                Unit converter features coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Date Calculator */}
        <TabsContent value="date">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Date Calculator</CardTitle>
              <CardDescription>
                Calculate the difference between dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  {endDate ? (
                    <div className="p-6 border rounded-md">
                      <h3 className="text-lg font-medium mb-4">Time Difference</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold">{dateDifference.days}</div>
                          <div className="text-sm text-muted-foreground">Days</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">{dateDifference.weeks}</div>
                          <div className="text-sm text-muted-foreground">Weeks</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">{dateDifference.months}</div>
                          <div className="text-sm text-muted-foreground">Months</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border rounded-md text-center text-muted-foreground">
                      Select both dates to calculate the difference
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCalculator; 