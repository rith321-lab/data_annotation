import { useParams } from 'react-router-dom'

export function ProjectDetailPage() {
  const { projectId } = useParams()
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white">Project Details</h1>
      <p className="text-white/60 mt-2">Project ID: {projectId}</p>
    </div>
  )
}