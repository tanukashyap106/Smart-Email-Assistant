import { useState } from 'react';
import axios from 'axios';
import {
  Mail,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent.trim()) return;

    setLoading(true);
    setError('');
    
    // Build combined prompt content if additional instructions exist
    let contentToSubmit = emailContent;
    if (additionalInstructions.trim()) {
      contentToSubmit += `\n\nAdditional Instructions: ${additionalInstructions.trim()}`;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent: contentToSubmit,
        tone: tone
      });
      const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate email reply. Please check backend connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="app-wrapper">
      {/* Background Glow Effects */}
      <div className="bg-ambient">
        <div className="bg-blob-top-left" />
        <div className="bg-blob-bottom-left" />
        <div className="bg-blob-bottom-right" />
        <div className="bg-sparkle-icon">
          <Sparkles size={28} />
        </div>
      </div>

      {/* Top Navbar Header */}
      <header className="top-navbar">
        <div className="nav-brand">
          <div className="nav-logo-box">
            <Mail size={20} />
          </div>
          <span className="nav-title">Email Reply Generator</span>
          <span className="nav-divider" />
          <span className="nav-subtitle">Turn your ideas into the perfect reply</span>
        </div>
        <div className="nav-badge">
          <Sparkles size={14} />
          <span>AI Powered</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-container">
        <div className="card-wrapper">
          <div className="main-card">
            
            {/* Header section inside card */}
            <div className="card-header-icon-box">
              <Sparkles size={26} />
            </div>
            <h1 className="card-title">Email Reply Generator</h1>
            <p className="card-subtitle">
              Write clear, professional and well-crafted email replies in seconds.
            </p>

            {/* Field 1: Original Email Content */}
            <div className="form-section">
              <div className="form-label-row">
                <div className="label-icon-box">
                  <Mail size={16} />
                </div>
                <label htmlFor="email-content" className="form-label">
                  Original Email Content <span className="required-star">*</span>
                </label>
              </div>
              <textarea
                id="email-content"
                className="custom-textarea"
                rows={5}
                placeholder="Paste the original email content here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>

            {/* Field 2: Tone (Optional) */}
            <div className="form-section">
              <div className="form-label-row">
                <div className="label-icon-box">
                  <SlidersHorizontal size={16} />
                </div>
                <label htmlFor="tone-select" className="form-label">
                  Tone (Optional)
                </label>
              </div>
              <div className="select-wrapper">
                <select
                  id="tone-select"
                  className={`custom-select ${!tone ? 'has-placeholder' : ''}`}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select tone (e.g., Professional, Friendly, Formal, Casual)
                  </option>
                  <option value="">None (Default Tone)</option>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Enthusiastic">Enthusiastic</option>
                  <option value="Apologetic">Apologetic</option>
                  <option value="Concise">Concise</option>
                </select>
                <ChevronDown className="select-chevron" size={18} />
              </div>
            </div>

            {/* Field 3: Additional Instructions (Optional) */}
            <div className="form-section">
              <div className="form-label-row">
                <div className="label-icon-box">
                  <Sparkles size={16} />
                </div>
                <label htmlFor="instructions" className="form-label">
                  Additional Instructions (Optional)
                </label>
              </div>
              <textarea
                id="instructions"
                className="custom-textarea"
                rows={3}
                placeholder="Add any specific instructions or details..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
              />
            </div>

            {/* Error Notification */}
            {error && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="actions-row">
              <button
                type="button"
                className="btn-generate"
                onClick={handleSubmit}
                disabled={!emailContent.trim() || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    <span>Generating Reply...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Reply</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                disabled={!generatedReply}
                title="Copy generated reply"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Reply Output Display */}
            {generatedReply && (
              <div className="result-section">
                <div className="result-header">
                  <div className="result-title-group">
                    <span className="result-title">Generated Email Reply</span>
                    <span className="result-badge">Ready</span>
                  </div>
                </div>
                <textarea
                  className="result-box"
                  value={generatedReply}
                  onChange={(e) => setGeneratedReply(e.target.value)}
                  rows={6}
                />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
