import { useState } from 'react';
import { SurveyData } from '../survey-json/useSurveyParser';
import SurveyJSON from '../survey-json/SurveyJSON';
import Survey from '../survey';

const Home = () => {
  const [surveyData, setSurveyData] = useState<SurveyData>();

  return (
    <div className='flex overflow-hidden h-full flex-wrap'>
      <section className='w-[34%] h-full'>
        <SurveyJSON loadSurvey={setSurveyData} />
      </section>
      <section className=' max-h-full bg-slate-50 w-[66%] p-2 flex items-start justify-center  overflow-hidden'>
        {surveyData ? (
          <Survey data={surveyData} />
        ) : (
          <p className='mt-72 text-[16px] text-slate-800/90 font-light'>Load JSON to start survey</p>
        )}
      </section>
    </div>
  );
};

export default Home;
