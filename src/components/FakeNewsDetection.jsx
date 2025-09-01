// import React, { useState } from 'react';
// import './FakeNewsDetection.css';

// const FakeNewsDetection = () => {
//   const [title, setTitle] = useState('');
//   const [text, setText] = useState('');
//   const [result, setResult] = useState('');
//   const [confidence, setConfidence] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleDetect = async () => {
//     if (!title.trim() && !text.trim()) {
//       alert("Please enter the news title and/or text.");
//       return;
//     }

//     setLoading(true);
//     setResult('');
//     setConfidence('');

//     try {
//       //combined text sent as POST Request in backend
//       const combinedText = title + ' ' + text;

//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ news: combinedText }),
//       });

//       const data = await response.json();

//       if (data.prediction !== undefined) {
//         setResult(data.prediction === 1 ? "The news is Real" : "The news is Fake");
//         setConfidence((data.probability * 100).toFixed(2) + "%");
//       } else {
//         setResult("Error: No result received.");
//       }
//     } catch (error) {
//       setResult("Error connecting to backend.");
//       console.error("Error:", error);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="fnd-container">
//       <h1 className="fnd-title">Fake News Detection</h1>

//       <input
//         type="text"
//         className="fnd-input"
//         placeholder="Enter news title..."
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <textarea
//         className="fnd-textarea"
//         placeholder="Enter news content..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={6}
//       />

//       <button className="fnd-button" onClick={handleDetect}>
//         {loading ? "Detecting..." : "Detect Fake News"}
//       </button>

//       {result && (
//         <div className="fnd-result">
//           <div>
//             Result:{" "}
//             <span className={result === "Fake" ? "fake" : "real"}>
//               {result}
//             </span>
//           </div>
//           {confidence && <div>Confidence: {confidence}</div>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FakeNewsDetection;


import React, { useState } from 'react';
import './FakeNewsDetection.css';

const FakeNewsDetection = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [confidence, setConfidence] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!title.trim() && !text.trim()) {
      alert("Please enter the news title and/or text.");
      return;
    }

    setLoading(true);
    setResult('');
    setConfidence('');

    try {
      // Send title and content separately to backend
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,  // sent separately
          news: text     // sent separately
        }),
      });

      const data = await response.json();

      if (data.prediction !== undefined) {
        setResult(data.prediction === 1 ? "The news is Real" : "The news is Fake");
        setConfidence((data.probability * 100).toFixed(2) + "%");
      } else {
        setResult("Error: No result received.");
      }
    } catch (error) {
      setResult("Error connecting to backend.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="fnd-container">
      <h1 className="fnd-title">Fake News Detection</h1>

      <input
        type="text"
        className="fnd-input"
        placeholder="Enter news title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="fnd-textarea"
        placeholder="Enter news content..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />

      <button className="fnd-button" onClick={handleDetect}>
        {loading ? "Detecting..." : "Detect Fake News"}
      </button>

      {result && (
        <div className="fnd-result">
          <div>
            Result:{" "}
            <span className={result.includes("Fake") ? "fake" : "real"}>
              {result}
            </span>
          </div>
          {confidence && <div>Confidence: {confidence}</div>}
        </div>
      )}
    </div>
  );
};

export default FakeNewsDetection;



