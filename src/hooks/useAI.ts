import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export const useAI = () => {
  const { apiKey } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate summary from text
  const generateSummary = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes academic content.'
            },
            {
              role: 'user',
              content: `Please provide a comprehensive summary of the following text: ${text.substring(0, 8000)}`
            }
          ],
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Failed to generate summary.';
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create flashcards from text
  const createFlashcards = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You create educational flashcards from academic content.'
            },
            {
              role: 'user',
              content: `Create 10 flashcards in JSON format with 'question' and 'answer' fields from the following text: ${text.substring(0, 8000)}`
            }
          ],
          max_tokens: 1500
        })
      });
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                        content.match(/\[([\s\S]*)\]/) ||
                        [null, content];
                        
      try {
        return JSON.parse(jsonMatch[1] || content);
      } catch (e) {
        console.error('Error parsing JSON from AI response:', e);
        return [];
      }
    } catch (error) {
      console.error('Error creating flashcards:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate quiz from text
  const generateQuiz = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You create educational quizzes from academic content.'
            },
            {
              role: 'user',
              content: `Create a quiz with 5 multiple-choice questions in JSON format. Each question should have a 'question' field, an 'options' array with 4 choices, and a 'correctAnswer' field indicating the index of the correct option. Base this quiz on the following text: ${text.substring(0, 8000)}`
            }
          ],
          max_tokens: 1500
        })
      });
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                      content.match(/\[([\s\S]*)\]/) ||
                      [null, content];
                      
      try {
        return JSON.parse(jsonMatch[1] || content);
      } catch (e) {
        console.error('Error parsing JSON from AI response:', e);
        return [];
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ask question about the document
  const askQuestion = async (text: string, question: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that answers questions based on provided text.'
            },
            {
              role: 'user',
              content: `Based on the following text, please answer this question: "${question}"\n\nText: ${text.substring(0, 8000)}`
            }
          ],
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error asking question:', error);
      return 'Failed to get an answer.';
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    generateSummary,
    createFlashcards,
    generateQuiz,
    askQuestion,
    isLoading
  };
}; 