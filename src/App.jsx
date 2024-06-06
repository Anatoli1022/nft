import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './layouts/layout';
import Home from './pages/Home';
import Profile from './pages/Profile';

import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="notFound" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
