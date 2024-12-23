import { useEffect } from 'react'
import JsonLookup from './components/JsonLookup'

function App() {
  useEffect(() => {
    document.title = "Symbaroum lookup tool"
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLookup />
    </div>
  )
}

export default App
