import { MantineProvider } from '@mantine/core';
import Home from './components/home/Home';

function App() {
  return (
    <MantineProvider>
      <main className='w-screen h-screen bg-slate-900 '>
        <nav className='w-full h-[6%] flex items-center justify-start px-8 shadow shadow-slate-800 '>
          <p className='text-slate-300/90 text-[18px] tracking-wide font-light select-none'>
            {' '}
            Simple ISurvey DSL
          </p>
        </nav>
        <div className='h-[94%]'>
          <Home />
        </div>
      </main>
    </MantineProvider>
  );
}

export default App;
