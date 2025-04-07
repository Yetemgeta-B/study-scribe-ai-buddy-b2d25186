import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Calculator as CalculatorIcon,
  Code,
  Ruler,
  Thermometer,
  ArrowLeftRight,
  Clock,
  Lightbulb,
  Beaker
} from 'lucide-react';

type CalculatorMode = 'standard' | 'scientific' | 'programmer' | 'converter';
type ConverterType = 'area' | 'temperature' | 'length' | 'speed' | 'time' | 'energy';

const CalculatorPage: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [converterType, setConverterType] = useState<ConverterType>('temperature');
  const [programmingBase, setProgrammingBase] = useState<'dec' | 'bin' | 'oct' | 'hex'>('dec');
  const [memoryValue, setMemoryValue] = useState<number | null>(null);
  
  // Formatter for programming mode
  const formatProgrammingValue = (value: string) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) return '0';
    
    switch (programmingBase) {
      case 'bin':
        return num.toString(2);
      case 'oct':
        return num.toString(8);
      case 'hex':
        return num.toString(16).toUpperCase();
      default:
        return num.toString(10);
    }
  };

  const inputDigit = (digit: string) => {
    // Special case for programmer mode
    if (mode === 'programmer') {
      if (programmingBase === 'bin' && !['0', '1'].includes(digit)) return;
      if (programmingBase === 'oct' && parseInt(digit) >= 8) return;
    }
    
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    // No decimal in programmer mode
    if (mode === 'programmer') return;
    
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setOperation(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };
  
  const handleScientificOperation = (op: string) => {
    const currentValue = parseFloat(display);
    let result: number;
    
    switch (op) {
      case 'sin':
        result = Math.sin(currentValue);
        break;
      case 'cos':
        result = Math.cos(currentValue);
        break;
      case 'tan':
        result = Math.tan(currentValue);
        break;
      case 'ln':
        result = Math.log(currentValue);
        break;
      case 'log':
        result = Math.log10(currentValue);
        break;
      case 'sqrt':
        result = Math.sqrt(currentValue);
        break;
      case 'square':
        result = currentValue * currentValue;
        break;
      case 'cube':
        result = currentValue * currentValue * currentValue;
        break;
      case 'inv':
        result = 1 / currentValue;
        break;
      case 'fact': // Factorial
        if (currentValue < 0 || !Number.isInteger(currentValue)) {
          setDisplay('Error');
          return;
        }
        result = 1;
        for (let i = 2; i <= currentValue; i++) {
          result *= i;
        }
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = currentValue;
    }
    
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const handleMemoryOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    switch (op) {
      case 'MC': // Memory Clear
        setMemoryValue(null);
        break;
      case 'MR': // Memory Recall
        if (memoryValue !== null) {
          setDisplay(String(memoryValue));
          setWaitingForOperand(true);
        }
        break;
      case 'M+': // Memory Add
        setMemoryValue((prev) => (prev || 0) + currentValue);
        setWaitingForOperand(true);
        break;
      case 'M-': // Memory Subtract
        setMemoryValue((prev) => (prev || 0) - currentValue);
        setWaitingForOperand(true);
        break;
      case 'MS': // Memory Store
        setMemoryValue(currentValue);
        setWaitingForOperand(true);
        break;
    }
  };
  
  const handleProgrammingBaseChange = (base: 'dec' | 'bin' | 'oct' | 'hex') => {
    const currentValue = parseInt(display, 10);
    setProgrammingBase(base);
    if (!isNaN(currentValue)) {
      setDisplay(formatProgrammingValue(String(currentValue)));
    }
  };
  
  const renderConverter = () => {
    switch (converterType) {
      case 'temperature':
        return <TemperatureConverter />;
      case 'length':
        return <LengthConverter />;
      case 'area':
        return <AreaConverter />;
      case 'speed':
        return <SpeedConverter />;
      case 'time':
        return <TimeConverter />;
      case 'energy':
        return <EnergyConverter />;
      default:
        return <TemperatureConverter />;
    }
  };
  
  // Simple converters for the different types
  const TemperatureConverter = () => {
    const [celsius, setCelsius] = useState('0');
    const [fahrenheit, setFahrenheit] = useState('32');
    const [kelvin, setKelvin] = useState('273.15');
    
    const updateFromCelsius = (value: string) => {
      const c = parseFloat(value);
      setCelsius(value);
      if (!isNaN(c)) {
        setFahrenheit(((c * 9/5) + 32).toFixed(2));
        setKelvin((c + 273.15).toFixed(2));
      }
    };
    
    const updateFromFahrenheit = (value: string) => {
      const f = parseFloat(value);
      setFahrenheit(value);
      if (!isNaN(f)) {
        const c = (f - 32) * 5/9;
        setCelsius(c.toFixed(2));
        setKelvin((c + 273.15).toFixed(2));
      }
    };
    
    const updateFromKelvin = (value: string) => {
      const k = parseFloat(value);
      setKelvin(value);
      if (!isNaN(k)) {
        const c = k - 273.15;
        setCelsius(c.toFixed(2));
        setFahrenheit(((c * 9/5) + 32).toFixed(2));
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Celsius (°C)</label>
          <Input
            type="number"
            value={celsius}
            onChange={(e) => updateFromCelsius(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Fahrenheit (°F)</label>
          <Input
            type="number"
            value={fahrenheit}
            onChange={(e) => updateFromFahrenheit(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Kelvin (K)</label>
          <Input
            type="number"
            value={kelvin}
            onChange={(e) => updateFromKelvin(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  };
  
  // Placeholder components for other converters
  const LengthConverter = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Meters (m)</label>
        <Input type="number" defaultValue="1" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Feet (ft)</label>
        <Input type="number" defaultValue="3.28084" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Inches (in)</label>
        <Input type="number" defaultValue="39.3701" className="mt-1" />
      </div>
    </div>
  );
  
  const AreaConverter = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Square Meters (m²)</label>
        <Input type="number" defaultValue="1" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Square Feet (ft²)</label>
        <Input type="number" defaultValue="10.7639" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Acres</label>
        <Input type="number" defaultValue="0.000247105" className="mt-1" />
      </div>
    </div>
  );
  
  const SpeedConverter = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Kilometers per hour (km/h)</label>
        <Input type="number" defaultValue="1" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Miles per hour (mph)</label>
        <Input type="number" defaultValue="0.621371" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Meters per second (m/s)</label>
        <Input type="number" defaultValue="0.277778" className="mt-1" />
      </div>
    </div>
  );
  
  const TimeConverter = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Hours</label>
        <Input type="number" defaultValue="1" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Minutes</label>
        <Input type="number" defaultValue="60" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Seconds</label>
        <Input type="number" defaultValue="3600" className="mt-1" />
      </div>
    </div>
  );
  
  const EnergyConverter = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Joules (J)</label>
        <Input type="number" defaultValue="1" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Calories (cal)</label>
        <Input type="number" defaultValue="0.239006" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Kilowatt hours (kWh)</label>
        <Input type="number" defaultValue="0.000000278" className="mt-1" />
      </div>
    </div>
  );

  const renderStandardCalculator = () => (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="outline"
        onClick={clearDisplay}
        className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      >
        AC
      </Button>
      <Button variant="outline" onClick={toggleSign}>
        +/-
      </Button>
      <Button variant="outline" onClick={inputPercent}>
        %
      </Button>
      <Button
        variant="outline"
        onClick={() => performOperation('/')}
        className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      >
        ÷
      </Button>

      <Button variant="outline" onClick={() => inputDigit('7')}>
        7
      </Button>
      <Button variant="outline" onClick={() => inputDigit('8')}>
        8
      </Button>
      <Button variant="outline" onClick={() => inputDigit('9')}>
        9
      </Button>
      <Button
        variant="outline"
        onClick={() => performOperation('*')}
        className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      >
        ×
      </Button>

      <Button variant="outline" onClick={() => inputDigit('4')}>
        4
      </Button>
      <Button variant="outline" onClick={() => inputDigit('5')}>
        5
      </Button>
      <Button variant="outline" onClick={() => inputDigit('6')}>
        6
      </Button>
      <Button
        variant="outline"
        onClick={() => performOperation('-')}
        className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      >
        −
      </Button>

      <Button variant="outline" onClick={() => inputDigit('1')}>
        1
      </Button>
      <Button variant="outline" onClick={() => inputDigit('2')}>
        2
      </Button>
      <Button variant="outline" onClick={() => inputDigit('3')}>
        3
      </Button>
      <Button
        variant="outline"
        onClick={() => performOperation('+')}
        className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      >
        +
      </Button>

      <Button
        variant="outline"
        onClick={() => inputDigit('0')}
        className="col-span-2"
      >
        0
      </Button>
      <Button variant="outline" onClick={inputDecimal}>
        .
      </Button>
      <Button
        variant="outline"
        onClick={() => performOperation('=')}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        =
      </Button>
    </div>
  );
  
  const renderScientificCalculator = () => (
    <div className="grid grid-cols-5 gap-2">
      <Button size="sm" variant="outline" onClick={() => handleMemoryOperation('MC')}>MC</Button>
      <Button size="sm" variant="outline" onClick={() => handleMemoryOperation('MR')}>MR</Button>
      <Button size="sm" variant="outline" onClick={() => handleMemoryOperation('M+')}>M+</Button>
      <Button size="sm" variant="outline" onClick={() => handleMemoryOperation('M-')}>M-</Button>
      <Button size="sm" variant="outline" onClick={() => handleMemoryOperation('MS')}>MS</Button>
      
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('sin')}>sin</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('cos')}>cos</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('tan')}>tan</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('ln')}>ln</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('log')}>log</Button>
      
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('sqrt')}>√</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('square')}>x²</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('cube')}>x³</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('inv')}>1/x</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('fact')}>n!</Button>
      
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('pi')}>π</Button>
      <Button size="sm" variant="outline" onClick={() => handleScientificOperation('e')}>e</Button>
      
      <Button
        variant="outline"
        onClick={clearDisplay}
        className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      >
        AC
      </Button>
      <Button variant="outline" onClick={toggleSign}>+/-</Button>
      <Button variant="outline" onClick={inputPercent}>%</Button>
      
      <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
      <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
      <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
      <Button variant="outline" onClick={() => performOperation('/')} className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">÷</Button>
      <Button variant="outline" onClick={() => performOperation('*')} className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">×</Button>

      <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
      <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
      <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
      <Button variant="outline" onClick={() => performOperation('-')} className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">−</Button>
      <Button variant="outline" onClick={() => performOperation('+')} className="bg-amber-100 hover:bg-amber-200 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">+</Button>

      <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
      <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
      <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
      <Button variant="outline" onClick={inputDecimal}>.</Button>
      <Button variant="outline" onClick={() => performOperation('=')} className="bg-primary text-primary-foreground hover:bg-primary/90">=</Button>
      
      <Button variant="outline" onClick={() => inputDigit('0')} className="col-span-2">0</Button>
    </div>
  );
  
  const renderProgrammerCalculator = () => (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={programmingBase === 'hex' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleProgrammingBaseChange('hex')}
          className="flex-1"
        >
          HEX
        </Button>
        <Button 
          variant={programmingBase === 'dec' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleProgrammingBaseChange('dec')}
          className="flex-1"
        >
          DEC
        </Button>
        <Button 
          variant={programmingBase === 'oct' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleProgrammingBaseChange('oct')}
          className="flex-1"
        >
          OCT
        </Button>
        <Button 
          variant={programmingBase === 'bin' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleProgrammingBaseChange('bin')}
          className="flex-1"
        >
          BIN
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {/* Hex-specific buttons */}
        {programmingBase === 'hex' && (
          <>
            <Button variant="outline" onClick={() => inputDigit('A')} disabled={programmingBase !== 'hex'}>A</Button>
            <Button variant="outline" onClick={() => inputDigit('B')} disabled={programmingBase !== 'hex'}>B</Button>
            <Button variant="outline" onClick={() => inputDigit('C')} disabled={programmingBase !== 'hex'}>C</Button>
            <Button variant="outline" onClick={() => inputDigit('D')} disabled={programmingBase !== 'hex'}>D</Button>
            <Button variant="outline" onClick={() => inputDigit('E')} disabled={programmingBase !== 'hex'}>E</Button>
            <Button variant="outline" onClick={() => inputDigit('F')} disabled={programmingBase !== 'hex'}>F</Button>
            <Button variant="outline" className="col-span-2" onClick={clearDisplay}>AC</Button>
          </>
        )}
        
        {/* Common programmer buttons */}
        <Button variant="outline" onClick={clearDisplay} className={programmingBase === 'hex' ? '' : 'col-span-2'}>AC</Button>
        <Button variant="outline" onClick={() => {/* Bitwise NOT logic */}} className={programmingBase === 'hex' ? '' : 'col-span-2'}>NOT</Button>
        
        <Button variant="outline" onClick={() => {/* Bitwise AND logic */}}>AND</Button>
        <Button variant="outline" onClick={() => {/* Bitwise OR logic */}}>OR</Button>
        <Button variant="outline" onClick={() => {/* Bitwise XOR logic */}}>XOR</Button>
        <Button variant="outline" onClick={() => {/* Bit shift left */}}>{`<<`}</Button>
        
        <Button variant="outline" onClick={() => inputDigit('7')} disabled={programmingBase === 'bin'}>7</Button>
        <Button variant="outline" onClick={() => inputDigit('8')} disabled={programmingBase === 'bin' || programmingBase === 'oct'}>8</Button>
        <Button variant="outline" onClick={() => inputDigit('9')} disabled={programmingBase === 'bin' || programmingBase === 'oct'}>9</Button>
        <Button variant="outline" onClick={() => {/* Bit shift right */}}>{`>>`}</Button>
        
        <Button variant="outline" onClick={() => inputDigit('4')} disabled={programmingBase === 'bin'}>4</Button>
        <Button variant="outline" onClick={() => inputDigit('5')} disabled={programmingBase === 'bin'}>5</Button>
        <Button variant="outline" onClick={() => inputDigit('6')} disabled={programmingBase === 'bin'}>6</Button>
        <Button variant="outline" onClick={() => performOperation('*')}>×</Button>
        
        <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
        <Button variant="outline" onClick={() => inputDigit('2')} disabled={programmingBase === 'bin'}>2</Button>
        <Button variant="outline" onClick={() => inputDigit('3')} disabled={programmingBase === 'bin'}>3</Button>
        <Button variant="outline" onClick={() => performOperation('-')}>−</Button>
        
        <Button variant="outline" onClick={() => inputDigit('0')}>0</Button>
        <Button variant="outline" className="col-span-2" onClick={() => performOperation('=')}>=</Button>
        <Button variant="outline" onClick={() => performOperation('+')}>+</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Calculator</h2>
        <p className="text-muted-foreground">Perform various calculations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Calculator Mode Sidebar */}
        <div className="w-full md:w-64 bg-card rounded-lg p-4 shadow-md">
          <h3 className="font-medium mb-4">Calculator Modes</h3>
          <div className="space-y-2">
            <Button 
              variant={mode === 'standard' ? 'default' : 'outline'} 
              className="w-full justify-start" 
              onClick={() => setMode('standard')}
            >
              <CalculatorIcon className="mr-2 h-4 w-4" />
              Standard
            </Button>
            <Button 
              variant={mode === 'scientific' ? 'default' : 'outline'} 
              className="w-full justify-start" 
              onClick={() => setMode('scientific')}
            >
              <Beaker className="mr-2 h-4 w-4" />
              Scientific
            </Button>
            <Button 
              variant={mode === 'programmer' ? 'default' : 'outline'} 
              className="w-full justify-start" 
              onClick={() => setMode('programmer')}
            >
              <Code className="mr-2 h-4 w-4" />
              Programmer
            </Button>
            <Button 
              variant={mode === 'converter' ? 'default' : 'outline'} 
              className="w-full justify-start" 
              onClick={() => setMode('converter')}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Converter
            </Button>
          </div>
          
          {/* Converter Types (only shown when converter mode is active) */}
          {mode === 'converter' && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Converter Types</h3>
              <div className="space-y-2">
                <Button 
                  variant={converterType === 'temperature' ? 'default' : 'outline'} 
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setConverterType('temperature')}
                >
                  <Thermometer className="mr-2 h-4 w-4" />
                  Temperature
                </Button>
                <Button 
                  variant={converterType === 'length' ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setConverterType('length')}
                >
                  <Ruler className="mr-2 h-4 w-4" />
                  Length
                </Button>
                <Button 
                  variant={converterType === 'area' ? 'default' : 'outline'} 
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setConverterType('area')}
                >
                  <Ruler className="mr-2 h-4 w-4" />
                  Area
                </Button>
                <Button 
                  variant={converterType === 'speed' ? 'default' : 'outline'} 
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setConverterType('speed')}
                >
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Speed
                </Button>
                <Button 
                  variant={converterType === 'time' ? 'default' : 'outline'} 
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setConverterType('time')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Time
                </Button>
                <Button 
                  variant={converterType === 'energy' ? 'default' : 'outline'} 
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setConverterType('energy')}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Energy
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Calculator Display and Controls */}
        <Card className="flex-1 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle>
              {mode === 'standard' && 'Standard Calculator'}
              {mode === 'scientific' && 'Scientific Calculator'}
              {mode === 'programmer' && 'Programmer Calculator'}
              {mode === 'converter' && (
                <span>{converterType.charAt(0).toUpperCase() + converterType.slice(1)} Converter</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display for calculator modes */}
            {mode !== 'converter' && (
              <Input
                className="text-right text-2xl font-mono mb-4 h-14"
                value={mode === 'programmer' ? formatProgrammingValue(display) : display}
                readOnly
              />
            )}
            
            {/* Different calculator mode UIs */}
            {mode === 'standard' && renderStandardCalculator()}
            {mode === 'scientific' && renderScientificCalculator()}
            {mode === 'programmer' && renderProgrammerCalculator()}
            {mode === 'converter' && renderConverter()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorPage; 