import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './componentes/form/form';
import Timeline from './componentes/timeline/timeline';

function App() {
  return (
    <Router basename="/instafriends">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </Router>
  );
}

export default App;
