import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAI } from '@/hooks/useAI';
import { Loader2 } from 'lucide-react';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfText, setPdfText] = useState<string>('');
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const [activeTab, setActiveTab] = useState('viewer');
  
  // States for AI-generated content
  const [summary, setSummary] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [activeFlashcard, setActiveFlashcard] = useState<number>(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  const { generateSummary, createFlashcards, generateQuiz, askQuestion, isLoading } = useAI();
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    extractTextFromPDF();
  };
  
  const extractTextFromPDF = async () => {
    try {
      // This is a simplified version - in a real implementation, 
      // you'd use a more robust PDF text extraction method
      let pdfSource: string | ArrayBuffer;
      
      if (typeof file === 'string') {
        pdfSource = file;
      } else {
        // Convert File to ArrayBuffer
        pdfSource = await file.arrayBuffer();
      }
      
      const loadingTask = pdfjs.getDocument(pdfSource);
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str).join(' ');
        fullText += textItems + ' ';
      }
      
      setPdfText(fullText);
      setIsTextExtracted(true);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!isTextExtracted) return;
    
    const result = await generateSummary(pdfText);
    setSummary(result);
  };
  
  const handleCreateFlashcards = async () => {
    if (!isTextExtracted) return;
    
    const cards = await createFlashcards(pdfText);
    setFlashcards(cards);
    setActiveFlashcard(0);
    setShowFlashcardAnswer(false);
  };
  
  const handleGenerateQuiz = async () => {
    if (!isTextExtracted) return;
    
    const quizQuestions = await generateQuiz(pdfText);
    setQuiz(quizQuestions);
    setSelectedQuizAnswers(new Array(quizQuestions.length).fill(-1));
    setShowQuizResults(false);
  };
  
  const handleAskQuestion = async () => {
    if (!chatQuestion.trim() || !isTextExtracted) return;
    
    const answer = await askQuestion(pdfText, chatQuestion);
    setChatAnswer(answer);
  };
  
  const nextPage = () => {
    if (pageNumber < (numPages || 0)) {
      setPageNumber(pageNumber + 1);
    }
  };
  
  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  
  const nextFlashcard = () => {
    if (activeFlashcard < flashcards.length - 1) {
      setActiveFlashcard(activeFlashcard + 1);
      setShowFlashcardAnswer(false);
    }
  };
  
  const prevFlashcard = () => {
    if (activeFlashcard > 0) {
      setActiveFlashcard(activeFlashcard - 1);
      setShowFlashcardAnswer(false);
    }
  };
  
  const handleSelectQuizAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedQuizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedQuizAnswers(newAnswers);
  };
  
  const calculateQuizScore = () => {
    let correct = 0;
    quiz.forEach((question, index) => {
      if (selectedQuizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: correct,
      total: quiz.length,
      percentage: Math.round((correct / quiz.length) * 100)
    };
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="border rounded-lg overflow-hidden mb-4 bg-white dark:bg-gray-900">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center"
          >
            <Page 
              pageNumber={pageNumber} 
              width={350}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          
          <p className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </p>
          
          <Button 
            variant="outline" 
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 0)}
          >
            Next
          </Button>
        </div>
      </div>
      
      <div className="w-full md:w-1/2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="chat">Ask Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {summary ? (
                  <div className="prose dark:prose-invert max-w-full">
                    <h3 className="text-lg font-medium mb-4">Document Summary</h3>
                    <div className="whitespace-pre-line">{summary}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Generate an AI-powered summary of this document.
                    </p>
                    <Button 
                      onClick={handleGenerateSummary} 
                      disabled={isLoading || !isTextExtracted}
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : "Generate Summary"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="flashcards" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {flashcards.length > 0 ? (
                  <div>
                    <div 
                      className="border rounded-lg p-6 min-h-40 mb-4 flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        Card {activeFlashcard + 1} of {flashcards.length}
                      </p>
                      <p className="text-lg font-medium mb-4 text-center">
                        {flashcards[activeFlashcard].question}
                      </p>
                      {showFlashcardAnswer && (
                        <div className="mt-4 p-4 bg-muted rounded-md w-full">
                          <p className="font-medium text-sm mb-1">Answer:</p>
                          <p>{flashcards[activeFlashcard].answer}</p>
                        </div>
                      )}
                      {!showFlashcardAnswer && (
                        <p className="text-muted-foreground text-sm">Click to reveal answer</p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={prevFlashcard}
                        disabled={activeFlashcard <= 0}
                      >
                        Previous Card
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={nextFlashcard}
                        disabled={activeFlashcard >= flashcards.length - 1}
                      >
                        Next Card
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Generate flashcards from this document to help you study.
                    </p>
                    <Button 
                      onClick={handleCreateFlashcards} 
                      disabled={isLoading || !isTextExtracted}
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : "Create Flashcards"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {quiz.length > 0 ? (
                  <div>
                    {showQuizResults ? (
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-2">Quiz Results</h3>
                        <div className="text-3xl font-bold my-4">
                          {calculateQuizScore().score} / {calculateQuizScore().total}
                        </div>
                        <p className="text-muted-foreground mb-4">
                          You scored {calculateQuizScore().percentage}%
                        </p>
                        <Button onClick={() => setShowQuizResults(false)}>
                          Review Answers
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-6 mb-6">
                          {quiz.map((question, qIndex) => (
                            <div key={qIndex} className="border rounded-lg p-4">
                              <p className="font-medium mb-3">
                                {qIndex + 1}. {question.question}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <div 
                                    key={oIndex}
                                    className={`
                                      p-3 rounded-md cursor-pointer 
                                      ${selectedQuizAnswers[qIndex] === oIndex 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted hover:bg-muted/80'
                                      }
                                    `}
                                    onClick={() => handleSelectQuizAnswer(qIndex, oIndex)}
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button 
                          onClick={() => setShowQuizResults(true)}
                          disabled={selectedQuizAnswers.includes(-1)}
                          className="w-full"
                        >
                          Submit Answers
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Generate a quiz based on this document to test your knowledge.
                    </p>
                    <Button 
                      onClick={handleGenerateQuiz} 
                      disabled={isLoading || !isTextExtracted}
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : "Generate Quiz"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Ask a question about this document:</p>
                  <div className="flex gap-2">
                    <Input
                      value={chatQuestion}
                      onChange={(e) => setChatQuestion(e.target.value)}
                      placeholder="e.g. What are the main concepts discussed?"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAskQuestion} 
                      disabled={isLoading || !chatQuestion.trim() || !isTextExtracted}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : "Ask"}
                    </Button>
                  </div>
                </div>
                
                {chatAnswer && (
                  <div className="p-4 border rounded-lg mt-4 bg-muted/50">
                    <p className="font-medium mb-2">Answer:</p>
                    <div className="whitespace-pre-line">{chatAnswer}</div>
                  </div>
                )}
                
                {!chatAnswer && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Ask a question to get AI-powered insights from this document.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PDFViewer; 