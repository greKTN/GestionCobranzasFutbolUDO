import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { VistaGeneral } from './pages/VistaGeneral';
import { GestionJugadores } from './pages/GestionJugadores';
import { RegistroPagos } from './pages/RegistroPagos';
import { Reportes } from './pages/Reportes';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen bg-[#464144] font-sans antialiased overflow-x-hidden">
      {/* Sidebar controla la navegación */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main 
        className={`flex-1 p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300
          ${isSidebarOpen ? 'pl-4 md:pl-72' : 'pl-4 md:pl-24'}
        `}
      >
        <Routes>
          <Route path="/" element={<VistaGeneral />} />
          <Route path="/jugadores" element={<GestionJugadores />} />
          <Route path="/cobranza" element={<RegistroPagos />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;