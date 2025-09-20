import { SimpleChatbot } from "@/components/simple-chatbot"

export default function TestChatPage() {
  // Mock user data for testing
  const mockUserData = {
    name: "Test User",
    email: "test@example.com",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Career Advisor Chatbot Test
          </h1>
          <p className="text-gray-600">
            Testing basic chatbot functionality - works with or without API keys
          </p>
        </div>
        
        <SimpleChatbot userData={mockUserData} />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 This chatbot works in two modes:</p>
          <p><strong>With API keys:</strong> Real AI responses from Google AI or OpenAI</p>
          <p><strong>Without API keys:</strong> Smart mock responses for testing</p>
          <p>Add your API keys to <code>.env.local</code> to enable AI features.</p>
        </div>
      </div>
    </div>
  )
}