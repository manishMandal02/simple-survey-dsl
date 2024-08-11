import { MantineProvider } from '@mantine/core';
import Home from './components/home';

function App() {
  return (
    <MantineProvider>
      <main className='w-screen h-screen bg-slate-900 overflow-hidden'>
        <nav className='w-full flex items-center justify-start py-3 px-8 shadow shadow-slate-800 '>
          <p className='text-slate-300/90 text-[18px] tracking-wide font-light select-none'>
            {' '}
            Simple Survey DSL
          </p>
        </nav>
        <Home />
      </main>
    </MantineProvider>
  );
}

export default App;
