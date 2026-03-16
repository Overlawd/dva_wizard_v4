import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Download, FileText } from 'lucide-react';
import { QuestionnaireState } from '../types/auth';

const QUESTIONS = [
  { id: 'service_branch', label: 'Which branch of service were you in?', options: ['Army', 'Navy', 'Air Force'] },
  { id: 'service_start', label: 'Year of enlistment', type: 'number' },
  { id: 'service_end', label: 'Year of discharge', type: 'number' },
  { id: 'conflict', label: 'Did you serve in a declared conflict?', options: ['Yes', 'No'] },
  { id: 'primary_condition', label: 'What is your primary medical condition?', type: 'text' },
  // ... truncated for brevity, represents up to 50 questions
];

interface QuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
}

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [state, setState] = useState<QuestionnaireState>({
    currentStep: 0,
    answers: {},
    completed: false
  });

  const currentQuestion = QUESTIONS[state.currentStep];
  const progress = ((state.currentStep + 1) / QUESTIONS.length) * 100;

  const handleNext = (value: string) => {
    const newAnswers = { ...state.answers, [currentQuestion.id]: value };
    
    if (state.currentStep < QUESTIONS.length - 1) {
      setState({
        ...state,
        currentStep: state.currentStep + 1,
        answers: newAnswers
      });
    } else {
      setState({ ...state, answers: newAnswers, completed: true });
      onComplete(newAnswers);
    }
  };

  if (state.completed) {
    return (
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
            Entitlement Assessment Complete
          </CardTitle>
          <CardDescription>Based on your service history and conditions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold mb-2">Likely Entitlements</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              <li>MRCA Rehabilitation (Tier 2)</li>
              <li>Disability Compensation (75%+) - Pending Medical Evidence</li>
              <li>Income Support Supplement</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold mb-2 text-blue-800">Recommended Next Steps</h4>
            <p className="text-sm text-blue-700 mb-2">
              1. Gather GP reports for {state.answers['primary_condition']}.<br/>
              2. Complete DVA Form D0164.
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Start Claim Process
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Summary (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>Claims Questionnaire</CardTitle>
          <span className="text-sm text-slate-500">Step {state.currentStep + 1} of {QUESTIONS.length}</span>
        </div>
        {/* Custom Progress Bar using standard Tailwind */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQuestion.label}</h3>
            
            {currentQuestion.options ? (
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((opt) => (
                  <Button
                    key={opt}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 border-slate-300"
                    onClick={() => handleNext(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <input 
                  type={currentQuestion.type || 'text'}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleNext((e.target as HTMLInputElement).value)}
                />
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if(input) handleNext(input.value);
                  }}
                >
                  Next Question
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}