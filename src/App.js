import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './componentes/form/form';
import Dashboard from './componentes/dashboard/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
