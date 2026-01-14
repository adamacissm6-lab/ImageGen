
import React, { useState, useCallback } from 'react';
import Uploader from './components/Uploader';
import { editImage } from './services/geminiService';
import { ImageState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    edited: null,
    isLoading: false,
    error: null,
  });

  const [prompt, setPrompt] = useState<string>('Remove the flag from the woman\'s shoulders and replace it with a clean white shirt. Keep the original face and background.');

  const handleUpload = (base64: string) => {
    setState({
      original: base64,
      edited: null,
      isLoading: false,
      error: null,
    });
  };

  const handleEdit = async () => {
    if (!state.original) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await editImage(state.original, prompt);
      setState(prev => ({
        ...prev,
        edited: result,
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to edit image. Please try again.',
      }));
    }
  };

  const handleReset = () => {
    setState({
      original: null,
      edited: null,
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <header className="py-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Image Magic <span className="text-indigo-600">Editor</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Instantly remove or replace objects in your images with the power of AI.
        </p>
      </header>

      <main className="space-y-8">
        {!state.original ? (
          <Uploader onUpload={handleUpload} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Control Panel */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  What would you like to do?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="e.g., Remove the flag and replace with a white shirt"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleEdit}
                  disabled={state.isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2 ${
                    state.isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {state.isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Magic...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Apply Edit
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Upload New Image
                </button>
              </div>

              {state.error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                   <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {state.error}
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-gray-200 aspect-[4/5] shadow-inner group">
                {state.isLoading && (
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="animate-pulse bg-indigo-500/20 p-8 rounded-full mb-4">
                        <svg className="w-16 h-16 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <p className="text-xl font-bold mb-2">Refining Details...</p>
                    <p className="text-sm opacity-80">Our AI is meticulously removing the flag and restructuring the outfit.</p>
                   </div>
                )}
                
                <img 
                  src={state.edited || state.original} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <span className="text-white text-xs font-bold uppercase tracking-widest px-2 py-1 bg-black/30 rounded-lg">
                    {state.edited ? 'Result' : 'Original'}
                  </span>
                  {state.edited && (
                    <a 
                      href={state.edited} 
                      download="magic-edit.png"
                      className="text-white hover:text-indigo-200 flex items-center gap-1 text-sm font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Download
                    </a>
                  )}
                </div>
              </div>

              {state.edited && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Original Image</p>
                    <div className="rounded-xl overflow-hidden aspect-square border border-gray-200">
                      <img src={state.original} alt="Original Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">AI Transformation</p>
                    <div className="rounded-xl overflow-hidden aspect-square border-2 border-indigo-500 shadow-md">
                      <img src={state.edited} alt="Edited Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
        <p>© 2025 Image Magic Editor. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;
