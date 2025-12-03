import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Code } from 'lucide-react';

const MinWindowVisualizer = () => {
  const [example, setExample] = useState(0);
  const [showCode, setShowCode] = useState(true);
  
  const examples = [
    { s: "ADOBECODEBANC", t: "ABC", output: "BANC" },
    { s: "a", t: "a", output: "a" },
    { s: "a", t: "aa", output: "" }
  ];

  // Code lines with their content
  const codeLines = [
    { num: 1, code: 'def minWindow(self, s: str, t: str) -> str:', indent: 0 },
    { num: 2, code: 'if not t and not s:', indent: 1 },
    { num: 3, code: 'return ""', indent: 2 },
    { num: 4, code: '', indent: 0 },
    { num: 5, code: 'need = Counter(t)', indent: 1 },
    { num: 6, code: 'window = {}', indent: 1 },
    { num: 7, code: '', indent: 0 },
    { num: 8, code: 'required = len(need)', indent: 1 },
    { num: 9, code: 'formed = 0', indent: 1 },
    { num: 10, code: '', indent: 0 },
    { num: 11, code: 'left = 0', indent: 1 },
    { num: 12, code: 'ans_len = float("inf")', indent: 1 },
    { num: 13, code: 'ans_l = 0', indent: 1 },
    { num: 14, code: '', indent: 0 },
    { num: 15, code: 'for right, ch in enumerate(s):', indent: 1 },
    { num: 16, code: 'window[ch] = window.get(ch, 0) + 1', indent: 2 },
    { num: 17, code: '', indent: 0 },
    { num: 18, code: 'if ch in need and window[ch] == need[ch]:', indent: 2 },
    { num: 19, code: 'formed += 1', indent: 3 },
    { num: 20, code: '', indent: 0 },
    { num: 21, code: 'while formed == required:', indent: 2 },
    { num: 22, code: 'if right - left + 1 < ans_len:', indent: 3 },
    { num: 23, code: 'ans_len = right - left + 1', indent: 4 },
    { num: 24, code: 'ans_l = left', indent: 4 },
    { num: 25, code: '', indent: 0 },
    { num: 26, code: 'left_char = s[left]', indent: 3 },
    { num: 27, code: 'window[left_char] = window[left_char] - 1', indent: 3 },
    { num: 28, code: '', indent: 0 },
    { num: 29, code: 'if left_char in need and window[left_char] < need[left_char]:', indent: 3 },
    { num: 30, code: 'formed -= 1', indent: 4 },
    { num: 31, code: '', indent: 0 },
    { num: 32, code: 'left += 1', indent: 3 },
    { num: 33, code: '', indent: 0 },
    { num: 34, code: 'return "" if ans_len == float("inf") else s[ans_l : ans_l + ans_len]', indent: 1 }
  ];

  // Generate execution steps for current example
  const generateSteps = (s, t) => {
    const steps = [];
    const need = {};
    for (let char of t) {
      need[char] = (need[char] || 0) + 1;
    }
    
    const window = {};
    const required = Object.keys(need).length;
    let formed = 0;
    let left = 0;
    let ansLen = Infinity;
    let ansL = 0;

    steps.push({
      description: "Initialize: Count characters needed from string t",
      left: 0,
      right: -1,
      window: {},
      need: {...need},
      formed: 0,
      required: required,
      bestWindow: null,
      highlight: 'init',
      codeLine: [5, 6, 8, 9, 11, 12, 13]
    });

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      window[ch] = (window[ch] || 0) + 1;

      const formedBefore = formed;
      if (need[ch] && window[ch] === need[ch]) {
        formed += 1;
      }

      steps.push({
        description: `Expand: Add '${ch}' to window (right=${right})`,
        left: left,
        right: right,
        window: {...window},
        need: {...need},
        formed: formed,
        required: required,
        bestWindow: ansLen === Infinity ? null : [ansL, ansL + ansLen - 1],
        highlight: 'expand',
        charAdded: ch,
        formedChanged: formed !== formedBefore,
        codeLine: formed !== formedBefore ? [15, 16, 18, 19] : [15, 16, 18]
      });

      while (formed === required) {
        if (right - left + 1 < ansLen) {
          ansLen = right - left + 1;
          ansL = left;
          
          steps.push({
            description: `✓ Found valid window: "${s.substring(left, right + 1)}" (length=${ansLen})`,
            left: left,
            right: right,
            window: {...window},
            need: {...need},
            formed: formed,
            required: required,
            bestWindow: [ansL, ansL + ansLen - 1],
            highlight: 'found',
            codeLine: [21, 22, 23, 24]
          });
        }

        const leftChar = s[left];
        window[leftChar] -= 1;
        
        const formedBeforeContract = formed;
        if (need[leftChar] && window[leftChar] < need[leftChar]) {
          formed -= 1;
        }

        steps.push({
          description: `Contract: Remove '${leftChar}' from window (left=${left})`,
          left: left + 1,
          right: right,
          window: {...window},
          need: {...need},
          formed: formed,
          required: required,
          bestWindow: [ansL, ansL + ansLen - 1],
          highlight: 'contract',
          charRemoved: leftChar,
          formedChanged: formed !== formedBeforeContract,
          codeLine: formed !== formedBeforeContract ? [26, 27, 29, 30, 32] : [26, 27, 29, 32]
        });

        left += 1;
      }
    }

    const finalResult = ansLen === Infinity ? "" : s.substring(ansL, ansL + ansLen);
    steps.push({
      description: `Final Result: "${finalResult}"`,
      left: left,
      right: s.length - 1,
      window: {...window},
      need: {...need},
      formed: formed,
      required: required,
      bestWindow: ansLen === Infinity ? null : [ansL, ansL + ansLen - 1],
      highlight: 'final',
      result: finalResult,
      codeLine: [34]
    });

    return steps;
  };

  const [stepIndex, setStepIndex] = useState(0);
  const currentExample = examples[example];
  const steps = generateSteps(currentExample.s, currentExample.t);
  const currentStep = steps[stepIndex];

  const getCharColor = (index, step) => {
    if (step.bestWindow && index >= step.bestWindow[0] && index <= step.bestWindow[1]) {
      if (step.highlight === 'found') {
        return 'bg-green-400 border-green-600';
      }
      return 'bg-green-200 border-green-400';
    }
    
    if (index >= step.left && index <= step.right) {
      if (step.highlight === 'expand' && index === step.right) {
        return 'bg-blue-400 border-blue-600';
      }
      if (step.highlight === 'contract' && index === step.left - 1) {
        return 'bg-red-400 border-red-600';
      }
      return 'bg-yellow-200 border-yellow-400';
    }
    
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2 text-indigo-900">
        Minimum Window Substring Visualizer
      </h1>
      <p className="text-center text-gray-600 mb-6">Step through the sliding window algorithm</p>

      {/* Example Selector */}
      <div className="mb-6 flex gap-2 justify-center flex-wrap">
        {examples.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => {
              setExample(idx);
              setStepIndex(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              example === idx
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Example {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-700 text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <Code size={18} />
          {showCode ? 'Hide' : 'Show'} Code
        </button>
      </div>

      {/* Code Panel */}
      {showCode && (
        <div className="bg-gray-900 rounded-lg p-4 mb-6 shadow-lg overflow-x-auto">
          <div className="flex items-center gap-2 mb-3">
            <Code size={20} className="text-green-400" />
            <h3 className="text-lg font-semibold text-white">Algorithm Code</h3>
            <span className="text-sm text-gray-400 ml-2">
              (Highlighted lines are executing)
            </span>
          </div>
          <div className="font-mono text-sm">
            {codeLines.map((line) => {
              const isHighlighted = currentStep.codeLine && currentStep.codeLine.includes(line.num);
              return (
                <div
                  key={line.num}
                  className={`flex transition-all ${
                    isHighlighted
                      ? 'bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-400'
                      : ''
                  }`}
                >
                  <span
                    className={`inline-block w-10 text-right mr-4 select-none ${
                      isHighlighted ? 'text-yellow-400 font-bold' : 'text-gray-600'
                    }`}
                  >
                    {line.code ? line.num : ''}
                  </span>
                  <span
                    className={`${isHighlighted ? 'text-white font-semibold' : 'text-gray-300'}`}
                    style={{ paddingLeft: `${line.indent * 1.5}rem` }}
                  >
                    {line.code || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Problem Display */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-gray-700">String s:</span>
            <span className="ml-2 font-mono text-lg">{currentExample.s}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">String t:</span>
            <span className="ml-2 font-mono text-lg">{currentExample.t}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-semibold text-gray-700">Expected Output:</span>
          <span className="ml-2 font-mono text-lg text-green-600">
            "{currentExample.output}"
          </span>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        {/* String Visualization */}
        <div className="mb-6">
          <div className="flex gap-1 mb-4 flex-wrap justify-center">
            {currentExample.s.split('').map((char, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-mono text-xl font-bold transition-all ${getCharColor(
                    idx,
                    currentStep
                  )}`}
                >
                  {char}
                </div>
                <div className="text-xs text-gray-500 mt-1">{idx}</div>
              </div>
            ))}
          </div>

          {/* Pointers */}
          <div className="flex gap-4 justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded"></div>
              <span className="text-sm font-medium">Left: {currentStep.left}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 border-2 border-blue-600 rounded"></div>
              <span className="text-sm font-medium">Right: {currentStep.right}</span>
            </div>
            {currentStep.bestWindow && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 border-2 border-green-600 rounded"></div>
                <span className="text-sm font-medium">Best Window</span>
              </div>
            )}
          </div>
        </div>

        {/* Step Description */}
        <div className={`p-4 rounded-lg mb-4 ${
          currentStep.highlight === 'found' ? 'bg-green-100 border-2 border-green-400' :
          currentStep.highlight === 'expand' ? 'bg-blue-100 border-2 border-blue-400' :
          currentStep.highlight === 'contract' ? 'bg-red-100 border-2 border-red-400' :
          'bg-gray-100 border-2 border-gray-300'
        }`}>
          <p className="text-lg font-semibold text-gray-800">{currentStep.description}</p>
        </div>

        {/* Variables Panel */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4 border-2 border-purple-200">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <span className="text-lg">📊</span> Variables State
            <span className="text-xs text-gray-500 font-normal">(🔥 = changed from previous step)</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              const prevStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
              const variables = [
                { name: 'left', value: currentStep.left, prev: prevStep?.left },
                { name: 'right', value: currentStep.right, prev: prevStep?.right },
                { name: 'formed', value: currentStep.formed, prev: prevStep?.formed },
                { name: 'required', value: currentStep.required, prev: prevStep?.required },
                { 
                  name: 'ans_len', 
                  value: currentStep.bestWindow ? currentStep.bestWindow[1] - currentStep.bestWindow[0] + 1 : '∞',
                  prev: prevStep?.bestWindow ? prevStep.bestWindow[1] - prevStep.bestWindow[0] + 1 : '∞'
                },
                { 
                  name: 'ans_l', 
                  value: currentStep.bestWindow ? currentStep.bestWindow[0] : 0,
                  prev: prevStep?.bestWindow ? prevStep.bestWindow[0] : 0
                }
              ];

              return variables.map((v) => {
                const hasChanged = prevStep && v.value !== v.prev;
                return (
                  <div
                    key={v.name}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      hasChanged
                        ? 'bg-orange-100 border-orange-400 shadow-md animate-pulse'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-semibold text-gray-600">{v.name}</span>
                      {hasChanged && <span className="text-sm">🔥</span>}
                    </div>
                    <div className="font-mono text-xl font-bold text-gray-800">
                      {v.value}
                    </div>
                    {hasChanged && (
                      <div className="text-xs text-gray-500 mt-1">
                        was: {v.prev}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* State Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">Need (from t)</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentStep.need).map(([char, count]) => (
                <div key={char} className="bg-indigo-100 px-3 py-1 rounded border border-indigo-300">
                  <span className="font-mono font-bold">{char}</span>: {count}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">
              Window (current)
              {(() => {
                const prevStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
                if (!prevStep) return null;
                
                const changedKeys = new Set();
                Object.keys(currentStep.window).forEach(key => {
                  if (currentStep.window[key] !== prevStep.window[key]) {
                    changedKeys.add(key);
                  }
                });
                Object.keys(prevStep.window).forEach(key => {
                  if (currentStep.window[key] !== prevStep.window[key]) {
                    changedKeys.add(key);
                  }
                });
                
                return changedKeys.size > 0 ? (
                  <span className="text-xs text-orange-600 ml-2">🔥 changed</span>
                ) : null;
              })()}
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentStep.window).length > 0 ? (
                Object.entries(currentStep.window).map(([char, count]) => {
                  const prevStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
                  const prevCount = prevStep?.window[char];
                  const hasChanged = prevStep && count !== prevCount;
                  const isMatched = currentStep.need[char] && count >= currentStep.need[char];
                  
                  return (
                    <div
                      key={char}
                      className={`px-3 py-1 rounded border transition-all ${
                        hasChanged
                          ? 'bg-orange-200 border-orange-400 shadow-md ring-2 ring-orange-300'
                          : isMatched
                          ? 'bg-green-100 border-green-400'
                          : 'bg-yellow-100 border-yellow-300'
                      }`}
                    >
                      <span className="font-mono font-bold">{char}</span>: {count}
                      {hasChanged && <span className="ml-1">🔥</span>}
                      {hasChanged && prevCount !== undefined && (
                        <span className="text-xs text-gray-600 ml-1">({prevCount}→{count})</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-400 italic">Empty</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">
              Matched Characters: {currentStep.formed} / {currentStep.required}
            </span>
            <span className="text-sm text-gray-600">
              {currentStep.formed === currentStep.required ? '✓ Valid Window' : '✗ Invalid Window'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                currentStep.formed === currentStep.required ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(currentStep.formed / currentStep.required) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setStepIndex(0)}
          className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={stepIndex === 0}
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
          disabled={stepIndex === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="px-4 py-2 bg-white rounded-lg border-2 border-indigo-300 font-mono font-semibold">
          {stepIndex + 1} / {steps.length}
        </div>

        <button
          onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
          disabled={stepIndex === steps.length - 1}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-gray-700">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
            <span>Current Window</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 border-2 border-blue-600 rounded"></div>
            <span>Expanding (right)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-400 border-2 border-red-600 rounded"></div>
            <span>Contracting (left)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-400 border-2 border-green-600 rounded"></div>
            <span>Best Window Found</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinWindowVisualizer;
