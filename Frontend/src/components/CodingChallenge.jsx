import React, { useState, useEffect } from "react";
import {
  Play,
  Send,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  User,
  Crown,
} from "lucide-react";

const CodingChallenge = () => {
  const [code, setCode] = useState(`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`);

  const [activeTab, setActiveTab] = useState("Description");
  const [language, setLanguage] = useState("C++");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  const testCases = [
    { nums: "[2,7,11,15]", target: "9", expected: "[0,1]" },
    { nums: "[3,2,4]", target: "6", expected: "[1,2]" },
    { nums: "[3,3]", target: "6", expected: "[0,1]" },
  ];

  const tabs = ["Description", "Editorial", "Solutions", "Submissions"];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const movePanelLeft = () => {
    setLeftPanelWidth(Math.max(30, leftPanelWidth - 10));
  };

  const movePanelRight = () => {
    setLeftPanelWidth(Math.min(70, leftPanelWidth + 10));
  };

  // Syntax highlighting function
  const highlightSyntax = (code) => {
    // Keywords
    let highlighted = code.replace(
      /\b(class|public|private|protected|vector|int|string|bool|void|return|if|else|for|while|do|switch|case|break|continue|const|static|virtual|override|namespace|using|include|define|typedef|struct|enum|template|typename|auto|nullptr|true|false)\b/g,
      '<span class="text-blue-400">$1</span>'
    );

    // Types
    highlighted = highlighted.replace(
      /\b(int|string|bool|char|float|double|long|short|unsigned|signed|size_t|vector|map|set|unordered_map|unordered_set|pair|queue|stack|priority_queue|deque|list|array)\b/g,
      '<span class="text-green-400">$1</span>'
    );

    // Strings
    highlighted = highlighted.replace(
      /"([^"\\]|\\.)*"/g,
      '<span class="text-yellow-300">  // Dragging functionality</span>'
    );

    // Comments
    highlighted = highlighted.replace(
      /\/\/.*$/gm,
      '<span class="text-gray-500">  // Dragging functionality</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b\d+\b/g,
      '<span class="text-purple-400">  // Dragging functionality</span>'
    );

    // Operators
    highlighted = highlighted.replace(
      /([+\-*/=<>!&|^%])/g,
      '<span class="text-red-400">$1</span>'
    );

    // Brackets and parentheses
    highlighted = highlighted.replace(
      /([{}()\[\]])/g,
      '<span class="text-yellow-400">$1</span>'
    );

    return highlighted;
  };

  const handleCodeChange = (e) => {
    const textarea = e.target;
    const code = textarea.value;
    setCode(code);

    // Calculate cursor position
    const lines = code.substring(0, textarea.selectionStart).split("\n");
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    setCursorPosition({ line: currentLine, col: currentCol });
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;

    // Auto-indent on Enter
    if (e.key === "Enter") {
      const lines = textarea.value
        .substring(0, textarea.selectionStart)
        .split("\n");
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^\s*/)[0];

      // Add extra indent for opening braces
      const extraIndent = currentLine.trim().endsWith("{") ? "    " : "";

      setTimeout(() => {
        const start = textarea.selectionStart;
        const newValue =
          textarea.value.substring(0, start) +
          indent +
          extraIndent +
          textarea.value.substring(start);
        setCode(newValue);
        textarea.selectionStart = textarea.selectionEnd =
          start + indent.length + extraIndent.length;
      }, 0);
    }

    // Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        textarea.value.substring(0, start) +
        "    " +
        textarea.value.substring(end);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartWidth(leftPanelWidth);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;
    const containerWidth = window.innerWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newWidth = Math.max(25, Math.min(75, dragStartWidth + deltaPercent));

    setLeftPanelWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStartX, dragStartWidth]);

  return (
    <div
      className={`h-screen bg-gray-900 flex flex-col text-white ${
        isDragging ? "select-none" : ""
      }`}
    >
      {/* Top Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            <span className="text-gray-300">Problem List</span>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-yellow-500">0</span>
            <User className="w-5 h-5 text-gray-400" />
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500">Premium</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div
          className="bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Panel Controls */}
          <div className="flex items-center justify-between bg-gray-750 px-4 py-2 border-b border-gray-700">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-sm rounded ${
                    activeTab === tab
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={movePanelLeft}
                className="p-1 hover:bg-gray-700 rounded"
                title="Move panel left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={movePanelRight}
                className="p-1 hover:bg-gray-700 rounded"
                title="Move panel right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1 hover:bg-gray-700 rounded"
                title="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Problem Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Problem Title */}
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-semibold">1. Two Sum</h1>
                <span className="px-2 py-1 bg-green-600 text-green-100 rounded text-sm font-medium">
                  Solved
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center space-x-4">
                <span className="px-2 py-1 bg-green-500 text-green-100 rounded text-sm">
                  Easy
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                  Topics
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                  Hint
                </span>
              </div>

              {/* Problem Description */}
              <div className="space-y-4 text-gray-300">
                <p>
                  Given an array of integers{" "}
                  <code className="bg-gray-700 px-1 rounded">nums</code> and an
                  integer{" "}
                  <code className="bg-gray-700 px-1 rounded">target</code>,
                  return{" "}
                  <em>indices of the two numbers such that they add up to</em>{" "}
                  <code className="bg-gray-700 px-1 rounded">target</code>.
                </p>
                <p>
                  You may assume that each input would have{" "}
                  <strong>exactly one solution</strong>, and you may not use the{" "}
                  <em>same</em> element twice.
                </p>
                <p>You can return the answer in any order.</p>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Example 1:</h3>
                  <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                    <div>
                      <strong>Input:</strong> nums = [2,7,11,15], target = 9
                    </div>
                    <div>
                      <strong>Output:</strong> [0,1]
                    </div>
                    <div>
                      <strong>Explanation:</strong> Because nums[0] + nums[1] ==
                      9, we return [0, 1].
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Example 2:</h3>
                  <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                    <div>
                      <strong>Input:</strong> nums = [3,2,4], target = 6
                    </div>
                    <div>
                      <strong>Output:</strong> [1,2]
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Example 3:</h3>
                  <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                    <div>
                      <strong>Input:</strong> nums = [3,3], target = 6
                    </div>
                    <div>
                      <strong>Output:</strong> [0,1]
                    </div>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="font-semibold mb-2">Constraints:</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• 2 ≤ nums.length ≤ 10⁴</li>
                  <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>• -10⁹ ≤ target ≤ 10⁹</li>
                  <li>
                    • <strong>Only one valid answer exists.</strong>
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-400 pt-4 border-t border-gray-700">
                <span>👤 62.2K</span>
                <span>💬 1.4K</span>
                <span>⭐</span>
                <span>📋</span>
                <span>💡</span>
                <span className="text-green-400">● 2094 Online</span>
                <span>🔗 Source</span>
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Divider */}
        {!isFullscreen && (
          <div
            className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize relative group flex-shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 w-3 -ml-1" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-8 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}

        {/* Right Panel - Code Editor */}
        <div
          className={`flex flex-col bg-gray-900 ${
            isFullscreen ? "w-full" : ""
          }`}
          style={{ width: isFullscreen ? "100%" : `${100 - leftPanelWidth}%` }}
        >
          {/* Code Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-green-400">✓ Code</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
              >
                <option>C++</option>
                <option>Java</option>
                <option>Python</option>
                <option>JavaScript</option>
              </select>
              <span className="text-gray-400 text-sm">Auto</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-700 rounded">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative bg-gray-900 font-mono text-sm">
            {/* Line Numbers */}
            <div className="absolute left-0 top-0 w-12 bg-gray-850 h-full border-r border-gray-700 flex flex-col text-center text-xs text-gray-500 pt-4 z-10">
              {code.split("\n").map((_, i) => (
                <div key={i + 1} className="h-6 leading-6 px-1">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Syntax Highlighted Overlay */}
            <div
              className="absolute left-12 top-0 right-0 bottom-0 p-4 pointer-events-none text-white whitespace-pre-wrap break-words overflow-hidden"
              style={{
                lineHeight: "1.5",
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              }}
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(code),
              }}
            />

            {/* Invisible Textarea for Input */}
            <textarea
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              className="absolute left-12 top-0 right-0 bottom-0 bg-transparent text-transparent caret-white p-4 resize-none outline-none border-none font-mono text-sm"
              style={{
                lineHeight: "1.5",
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                tabSize: 4,
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />

            {/* Current Line Highlight */}
            <div
              className="absolute left-12 right-0 bg-gray-800/30 pointer-events-none"
              style={{
                top: `${(cursorPosition.line - 1) * 24 + 16}px`,
                height: "24px",
              }}
            />
          </div>

          {/* Bottom Panel */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                <button className="px-3 py-1 bg-gray-700 text-white rounded text-sm">
                  Testcase
                </button>
                <button className="px-3 py-1 text-gray-400 hover:text-white rounded text-sm">
                  Test Result
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm">
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            </div>

            {/* Test Cases */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                {testCases.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestCase(index)}
                    className={`px-3 py-1 rounded text-sm ${
                      activeTestCase === index
                        ? "bg-gray-700 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
                <button className="px-2 py-1 text-gray-400 hover:text-white">
                  +
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">nums =</span>
                  <div className="bg-gray-900 p-2 rounded mt-1 font-mono">
                    {testCases[activeTestCase].nums}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">target =</span>
                  <div className="bg-gray-900 p-2 rounded mt-1 font-mono">
                    {testCases[activeTestCase].target}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              Ln {cursorPosition.line}, Col {cursorPosition.col} Saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;
