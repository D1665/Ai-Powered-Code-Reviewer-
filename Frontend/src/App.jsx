import { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🔒 prevents multiple parallel requests
  const requestInProgress = useRef(false)

  // ⏳ cooldown after request (ms)
  const COOLDOWN_TIME = 3000

  useEffect(() => {
    prism.highlightAll()
  }, [])

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
  }, [isLoading, isAuthenticated, loginWithRedirect])

  async function reviewCode() {
    // 🚫 block spam clicks
    if (requestInProgress.current) return

    requestInProgress.current = true
    setLoading(true)
    setError("")
    setReview("")

    try {
      const response = await axios.post(
        'http://localhost:3000/ai/get-review',
        { code }
      )

      setReview(response.data.review)

    } catch (err) {
      console.error(err)

      if (err.response?.status === 429) {
        setError("Rate limit reached. Please wait a few seconds and try again.")
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please re-login.")
      } else {
        setError("Failed to get AI review. Please try again.")
      }

    } finally {
      // ⏱ cooldown to protect API
      setTimeout(() => {
        requestInProgress.current = false
        setLoading(false)
      }, COOLDOWN_TIME)
    }
  }

  // ⏳ Show loading or wait for login
  if (isLoading || !isAuthenticated) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading authentication...
      </h2>
    )
  }

  return (
    <div className="app-container">
      <Navbar />

      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                overflow: "auto",
                width: "100%"
              }}
            />
          </div>

          <button
            onClick={reviewCode}
            className="review"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Reviewing..." : "Review"}
          </button>
        </div>

        <div className="right">
          {error && <p style={{ color: "red" }}>{error}</p>}

          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </div>
  )
}

export default App
