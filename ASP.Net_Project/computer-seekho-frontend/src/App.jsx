import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Placeholder Pages
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Placement from './pages/Placement';
import Faculty from './pages/Faculty';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Enquiry from './pages/admin/Enquiry';
import Followups from './pages/admin/Followups';
import StudentRegistration from './pages/admin/StudentRegistration';
import Masters from './pages/admin/Masters';
import Students from './pages/admin/Students';
import Payments from './pages/admin/Payments';
import I18nTest from './pages/I18nTest';
import { AuthProvider } from './context/AuthContext';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "257143483955-8kkd3avqj6hpl02de3gr8kravf67soms.apps.googleusercontent.com";

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <div className="d-flex flex-column min-vh-100">
              <Header />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/placement" element={<Placement />} />
                  <Route path="/faculty" element={<Faculty />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/i18n-test" element={<I18nTest />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/enquiries" element={<Enquiry />} />
                  <Route path="/admin/followups" element={<Followups />} />
                  <Route path="/admin/register-student" element={<StudentRegistration />} />
                  <Route path="/admin/masters" element={<Masters />} />
                  <Route path="/admin/students" element={<Students />} />
                  <Route path="/admin/payments" element={<Payments />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </GoogleOAuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
