import { useState } from 'react'

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

// Individual question components
const TextClassificationQuestion = ({ question, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <div className="space-y-2">
      {question.options?.map((option: string) => (
        <label key={option} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm">{option}</span>
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

const MultipleChoiceQuestion = ({ question, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{question.title}</label>
    {question.description && (
      <p className="text-sm text-gray-500">{question.description}</p>
    )}
    <div className="space-y-2">
      {question.options?.map((option: string) => (
        <label key={option} className="flex items-center space-x-2">
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
        </label>
      ))}
    </div>
  </div>
)

const ImageClassificationQuestion = ({ question, value, onChange }: any) => (
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
        <label key={option} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm">{option}</span>
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

// Main annotation interface component
export const AnnotationInterface = ({ projectId, taskId, questions, onSubmit }: AnnotationInterfaceProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value })
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

    switch (question.type) {
      case 'text_classification':
        return <TextClassificationQuestion question={question} value={value} onChange={onChange} />
      case 'text_generation':
        return <TextGenerationQuestion question={question} value={value} onChange={onChange} />
      case 'multiple_choice':
        return <MultipleChoiceQuestion question={question} value={value} onChange={onChange} />
      case 'image_classification':
        return <ImageClassificationQuestion question={question} value={value} onChange={onChange} />
      case 'ranking':
        return <RankingQuestion question={question} value={value} onChange={onChange} />
      default:
        return <div>Question type "{question.type}" not implemented yet</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
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