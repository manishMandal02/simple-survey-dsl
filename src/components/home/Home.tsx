import { useState } from 'react';
import SurveyJson from '../survey-json';
import { Survey } from '../../types/parser.types';
import SurveyView from '../survey-view';

const Home = () => {
  const [surveyData, setSurveyData] = useState<Survey>();

  return (
    <div className='flex overflow-hidden h-full flex-wrap'>
      <section className='w-[32%]  2xl:w-[24%] h-full'>
        <SurveyJson loadSurvey={setSurveyData} />
      </section>
      <section className='max-h-full bg-slate-50 w-[68%] 2xl:w-[76%] p-2 flex items-start justify-center  overflow-hidden'>
        {surveyData ? (
          <SurveyView data={surveyData} />
        ) : (
          <p className='mt-72 text-[16px] text-slate-800/90 font-light'>Load JSON to start survey</p>
        )}
      </section>
    </div>
  );
};

export default Home;
