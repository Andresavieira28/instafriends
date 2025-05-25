import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './componentes/form/form';
import Timeline from './componentes/timeline/timeline';
import Profile from './componentes/profile/profile';
import About from './componentes/about/about';
import Password from './componentes/password/password';


function App() {
  return (
    <Router basename="/instafriends">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About/>} />
        <Route path="/Password" element={<Password />} />
      </Routes>
    </Router>
  );
}

export default App;
