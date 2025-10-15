import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Agents } from './pages/Agents';
import { InPatient } from './pages/departments/InPatient';
import { OutPatient } from './pages/departments/OutPatient';
import { Emergency } from './pages/departments/Emergency';
import { OperatingRoom } from './pages/departments/OperatingRoom';
import { KPIs } from './pages/KPIs';
import { OKRs } from './pages/OKRs';
import { Compliance } from './pages/Compliance';
import { Audit } from './pages/Audit';
import { BOSchema } from './pages/BOSchema';
import { APIDocs } from './pages/APIDocs';
import { ROI } from './pages/ROI';
import { CaseStudies } from './pages/CaseStudies';
import { Help } from './pages/Help';
import { Admin } from './pages/Admin';

function App() {
  return (
    <RoleProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/departments/ip" element={<InPatient />} />
            <Route path="/departments/op" element={<OutPatient />} />
            <Route path="/departments/ed" element={<Emergency />} />
            <Route path="/departments/or" element={<OperatingRoom />} />
            <Route path="/kpis" element={<KPIs />} />
            <Route path="/okrs" element={<OKRs />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/bo-schema" element={<BOSchema />} />
            <Route path="/api-docs" element={<APIDocs />} />
            <Route path="/roi" element={<ROI />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/help" element={<Help />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </RoleProvider>
  );
}

export default App;
