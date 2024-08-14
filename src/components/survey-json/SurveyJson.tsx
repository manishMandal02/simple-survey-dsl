import { JsonInput } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '../../utils/cn';
import Snackbar from '../elements/Snackbar';
import { useZodParser } from './useZodParser';
import ActionsContainer from './ActionsContainer';
import { ISurvey } from '../../types/parser.types';
import { isJSON } from '../../utils/validate-json';
import { useRecursiveParse } from './useRecursiveParser';
import { parseJsonFile } from '../../utils/parse-json-file';
import sampleSurveyJson from '../../../public/sample-survey.json';

type Parser = 'Recursive Descent' | 'Zod';

type Props = {
  loadSurvey: (data: ISurvey) => void;
};

const SurveyJson = ({ loadSurvey }: Props) => {
  const [jsonInputValue, setJsonInputValue] = useState('');
  const [isValidJson, setIsValidJson] = useState<boolean | undefined>();
  const [selectedParser, setSelectedParser] = useState<Parser>('Recursive Descent');

  const [snackbar, setSnackbar] = useState({
    show: false,
    msg: '',
    type: 'success',
    anchor: 'body'
  });

  useEffect(() => {
    setJsonInputValue(JSON.stringify(sampleSurveyJson, null, 2));
    setIsValidJson(true);
  }, []);

  const { zodParser } = useZodParser();
  const { recursiveParser } = useRecursiveParse();

  const handleJSONInputChange = (value: string) => {
    setJsonInputValue(value);

    if (isJSON(value)) {
      setIsValidJson(true);
    } else {
      setIsValidJson(false);
    }
  };

  const handleResetJson = () => {
    setJsonInputValue(JSON.stringify(sampleSurveyJson, null, 2));
  };

  const handleParseJson = (string?: string) => {
    const jsonString = string ?? jsonInputValue;

    let data: ISurvey | null, err: string | null;

    if (selectedParser === 'Recursive Descent') {
      [data, err] = recursiveParser(jsonString);
    } else {
      [data, err] = zodParser(jsonString);
    }

    if (err) {
      setSnackbar({ msg: err, show: true, type: 'error', anchor: 'parent' });
      return;
    }

    if (!data) {
      setSnackbar({ msg: 'Error validating json', show: true, type: 'error', anchor: 'parent' });
      return;
    }

    // add parser to title
    data.title = `${data.title}  (${selectedParser})`;

    loadSurvey(data);
  };

  const handleParseJSONFromFile = async (file: File) => {
    try {
      const jsonString = await parseJsonFile(file);

      handleParseJson(jsonString);

      setSnackbar({ msg: 'File loaded successfully', show: true, type: 'success', anchor: 'parent' });
    } catch {
      setSnackbar({
        msg: 'Failed to load JSON file, try again.',
        show: true,
        type: 'error',
        anchor: 'parent'
      });
    }
  };

  const screenWidth = useMemo(() => screen.width, []);

  const inputMaxRows = useMemo(() => {
    if (screenWidth < 1500) {
      return 25;
    } else {
      return 30;
    }
  }, [screenWidth]);

  return (
    <div className='h-full flex flex-col'>
      <JsonInput
        placeholder='Enter your survey JSON'
        // validationError='Invalid JSON'
        formatOnBlur
        autosize
        minRows={inputMaxRows}
        maxRows={inputMaxRows}
        className='w-full relative overflow-hidden'
        styles={{
          input: {
            height: '100% !important'
          }
        }}
        classNames={{
          wrapper: 'h-full',
          input: cn(
            'w-full py-2 px-3 bg-slate-800 text-slate-300 outline-none border border-slate-700 !h-[100%] !overflow-y-auto !resize-none cc-scrollbar ',
            {
              '!border-rose-400/70': isValidJson === false
            }
          )
        }}
        // error={<span>Invalid JSON</span>}
        value={jsonInputValue}
        onChange={handleJSONInputChange}
      />

      <div className='relative'>
        {/* actions */}
        <ActionsContainer
          isJSONValid={!!isValidJson}
          selectedParser={selectedParser}
          onParserChange={parser => setSelectedParser(parser as Parser)}
          onParseClick={() => handleParseJson()}
          parseJsonFromFile={handleParseJSONFromFile}
          resetJSON={handleResetJson}
        />

        {/* snackbar */}
        <Snackbar
          msg={snackbar.msg}
          show={snackbar.show}
          type={snackbar.type as 'success' | 'error'}
          anchor={snackbar.anchor as 'parent' | 'body'}
          onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
        />
      </div>
    </div>
  );
};

export default SurveyJson;
