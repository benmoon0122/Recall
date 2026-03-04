// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


function App() {
  return (
    /* The outer container: Dark background for contrast */
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      
      {/* This div uses your exact Figma properties: 
          flex, py-5 (20px), px-4 (16px), items-center, self-stretch */}
      <div className="flex py-5 px-4 items-center self-stretch bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-w-2xl mx-auto">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">
            Figma Design Applied
          </h1>
          <p className="text-slate-400">
            This container uses <code className="text-blue-400">flex py-5 px-4 items-center self-stretch</code> 
            to match your Figma inspection.
          </p>
        </div>

      </div>

    </div>
  )
}

export default App