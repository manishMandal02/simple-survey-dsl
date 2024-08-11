import SurveyInput from '../survey-input';

const Home = () => {
  return (
    <div className='flex overflow-hidden'>
      <section className='w-[34%] '>
        <SurveyInput />
      </section>
      <section className='bg-slate-300/80 w-[64%] p-2'>Survey </section>
    </div>
  );
};

export default Home;
