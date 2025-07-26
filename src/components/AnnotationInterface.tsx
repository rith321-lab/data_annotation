import { useState, useEffect } from 'react'

// Icons for AI features
const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L13.09 8.26L19 9L13.45 13.45L15.82 20L12 16L8.18 20L10.55 13.45L5 9L10.91 8.26L12 2Z"/>
  </svg>
)

const ThumbsUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
)

const ThumbsDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
)

// Question type definitions
export type QuestionType = 
  | 'text_classification'
  | 'text_generation'
  | 'image_classification'
  | 'image_annotation'
  | 'video_classification'
  | 'audio_transcription'
  | 'named_entity_recognition'
  | 'sentiment_analysis'
  | 'multiple_choice'
  | 'ranking'
  | 'comparison'

interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  data: any
  options?: string[]
  required: boolean
}

interface AnnotationInterfaceProps {
  projectId: string
  taskId: string
  questions: Question[]
  onSubmit: (responses: any) => void
}

interface AISuggestion {
  label: string
  confidence: number
  explanation?: string
}

// AI Suggestion Component
const AISuggestionBox = ({ 
  suggestion, 
  onAccept, 
  onReject 
}: { 
  suggestion: AISuggestion | null
  onAccept: () => void
  onReject: () => void
}) => {
  if (!suggestion) return null

  return (
    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <SparklesIcon />
          <div>
            <p className="text-sm font-medium text-purple-900">AI Suggestion</p>
            <p className="text-sm text-purple-700 mt-1">
              <span className="font-medium">{suggestion.label}</span>
              <span className="text-purple-600 ml-2">
                ({(suggestion.confidence * 100).toFixed(1)}% confident)
              </span>
            </p>
            {suggestion.explanation && (
              <p className="text-xs text-purple-600 mt-1">{suggestion.explanation}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
            title="Accept suggestion"
          >
            <ThumbsUpIcon />
          </button>
          <button
            onClick={onReject}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Reject suggestion"
          >
            <ThumbsDownIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

// Individual question components with AI support
const TextClassificationQuestion = ({ question, value, onChange, aiSuggestion }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <div className="space-y-2">
      {question.options?.map((option: string) => (
        <label key={option} className={`flex items-center space-x-2 p-2 rounded-lg border ${
          value === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm">{option}</span>
          {aiSuggestion?.label === option && (
            <span className="ml-auto text-xs text-purple-600 flex items-center gap-1">
              <SparklesIcon />
              AI suggested
            </span>
          )}
        </label>
      ))}
    </div>
  </div>
)

const TextGenerationQuestion = ({ question, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
      rows={4}
      placeholder="Enter your response..."
    />
  </div>
)

const MultipleChoiceQuestion = ({ question, value, onChange, aiSuggestions }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <div className="space-y-2">
      {question.options?.map((option: string) => {
        const suggestion = aiSuggestions?.find((s: any) => s.label === option)
        return (
          <label key={option} className={`flex items-center space-x-2 p-2 rounded-lg border ${
            value?.includes(option) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <input
              type="checkbox"
              value={option}
              checked={value?.includes(option) || false}
              onChange={(e) => {
                const newValue = value || []
                if (e.target.checked) {
                  onChange([...newValue, option])
                } else {
                  onChange(newValue.filter((v: string) => v !== option))
                }
              }}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm">{option}</span>
            {suggestion && (
              <span className="ml-auto text-xs text-purple-600 flex items-center gap-1">
                <SparklesIcon />
                {(suggestion.confidence * 100).toFixed(0)}%
              </span>
            )}
          </label>
        )
      })}
    </div>
  </div>
)

const ImageClassificationQuestion = ({ question, value, onChange, aiSuggestion }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <div className="mb-4">
      <img 
        src={question.data.imageUrl} 
        alt="Image to classify" 
        className="max-w-full h-auto rounded-lg shadow-lg"
      />
    </div>
    <div className="space-y-2">
      {question.options?.map((option: string) => (
        <label key={option} className={`flex items-center space-x-2 p-2 rounded-lg border ${
          value === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm">{option}</span>
          {aiSuggestion?.label === option && (
            <span className="ml-auto text-xs text-purple-600 flex items-center gap-1">
              <SparklesIcon />
              AI suggested ({(aiSuggestion.confidence * 100).toFixed(0)}%)
            </span>
          )}
        </label>
      ))}
    </div>
  </div>
)

const RankingQuestion = ({ question, value, onChange }: any) => {
  const [items, setItems] = useState(value || question.options || [])

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    if (direction === 'up' && index > 0) {
      ;[newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
    } else if (direction === 'down' && index < newItems.length - 1) {
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    }
    setItems(newItems)
    onChange(newItems)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{question.title}</label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <div className="space-y-2">
        {items.map((item: string, index: number) => (
          <div key={item} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
            <span className="flex-1 text-sm">{item}</span>
            <button
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
              className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-100 disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={() => moveItem(index, 'down')}
              disabled={index === items.length - 1}
              className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-100 disabled:opacity-50"
            >
              ↓
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main annotation interface component with AI support
export const AnnotationInterface = ({ projectId, taskId, questions, onSubmit }: AnnotationInterfaceProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({})
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)

  const currentQuestion = questions[currentQuestionIndex]

  // Fetch AI suggestions when question changes
  useEffect(() => {
    if (aiEnabled && currentQuestion && !aiSuggestions[currentQuestion.id]) {
      fetchAISuggestion(currentQuestion)
    }
  }, [currentQuestionIndex, aiEnabled])

  const fetchAISuggestion = async (question: Question) => {
    setIsLoadingAI(true)
    try {
      // Mock AI suggestion - in production, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockSuggestions: Record<string, any> = {
        'text_classification': {
          label: question.options?.[0],
          confidence: 0.85,
          explanation: "Based on keyword analysis"
        },
        'image_classification': {
          label: question.options?.[1],
          confidence: 0.92,
          explanation: "Visual features detected"
        },
        'multiple_choice': [
          { label: question.options?.[0], confidence: 0.78 },
          { label: question.options?.[2], confidence: 0.65 }
        ]
      }

      const suggestion = mockSuggestions[question.type]
      if (suggestion) {
        setAiSuggestions({ ...aiSuggestions, [question.id]: suggestion })
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestion:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value })
  }

  const handleAcceptSuggestion = () => {
    const suggestion = aiSuggestions[currentQuestion.id]
    if (suggestion) {
      if (Array.isArray(suggestion)) {
        // Multiple choice
        handleResponseChange(currentQuestion.id, suggestion.map(s => s.label))
      } else {
        // Single choice
        handleResponseChange(currentQuestion.id, suggestion.label)
      }
    }
  }

  const handleRejectSuggestion = () => {
    // Log feedback for model improvement
    console.log('Suggestion rejected for question:', currentQuestion.id)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    // Validate required questions
    const unanswered = questions.filter(q => q.required && !responses[q.id])
    if (unanswered.length > 0) {
      alert(`Please answer all required questions. Missing: ${unanswered.map(q => q.title).join(', ')}`)
      return
    }
    onSubmit(responses)
  }

  const renderQuestion = (question: Question) => {
    const value = responses[question.id]
    const onChange = (val: any) => handleResponseChange(question.id, val)
    const aiSuggestion = aiSuggestions[question.id]

    switch (question.type) {
      case 'text_classification':
        return <TextClassificationQuestion question={question} value={value} onChange={onChange} aiSuggestion={aiSuggestion} />
      case 'text_generation':
        return <TextGenerationQuestion question={question} value={value} onChange={onChange} />
      case 'multiple_choice':
        return <MultipleChoiceQuestion question={question} value={value} onChange={onChange} aiSuggestions={aiSuggestion} />
      case 'image_classification':
        return <ImageClassificationQuestion question={question} value={value} onChange={onChange} aiSuggestion={aiSuggestion} />
      case 'ranking':
        return <RankingQuestion question={question} value={value} onChange={onChange} />
      default:
        return <div>Question type "{question.type}" not implemented yet</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* AI Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                <SparklesIcon />
                AI Assistance
              </span>
            </label>
            {isLoadingAI && (
              <span className="text-xs text-gray-500">Loading suggestions...</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question content */}
        <div className="mb-6">
          {renderQuestion(currentQuestion)}
          
          {/* AI Suggestion Box */}
          {aiEnabled && aiSuggestions[currentQuestion.id] && !responses[currentQuestion.id] && (
            <AISuggestionBox
              suggestion={
                Array.isArray(aiSuggestions[currentQuestion.id]) 
                  ? aiSuggestions[currentQuestion.id][0]
                  : aiSuggestions[currentQuestion.id]
              }
              onAccept={handleAcceptSuggestion}
              onReject={handleRejectSuggestion}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-purple-600 text-white'
                    : responses[questions[index].id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}