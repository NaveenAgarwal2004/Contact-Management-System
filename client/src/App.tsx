
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Contacts from './Pages/Contacts'

function App() {

  return (
    
     <Router>
      <nav className='p-4 bg-gray-800 text-white flex gap-4'>
        <Link to="/" className='hover:underline'>Home</Link>
        <Link to="/contacts" className='hover:underline'>Contacts</Link>
      </nav>
      <div className='p-4'>
        <Routes>
          <Route path="/" element={<h1 className='text-2xl font-bold'>Welcome to the Home Page</h1>} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </div>
     </Router>
   
  )
}

export default App;
