import { useEffect, useState } from 'react';

const CloseIcon = (
  <svg
    width='15'
    height='15'
    viewBox='0 0 15 15'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='pointer-events-auto'
  >
    <path
      d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
);

type Props = {
  msg: string;
  anchor?: 'parent' | 'body';
  type?: 'success' | 'error';
  show: boolean;
  onClose?: () => void;
};

const SNACKBAR_TIMEOUT = 40000;

const Snackbar = ({ show, msg, onClose, type = 'success', anchor = 'body' }: Props) => {
  const [showState, setShowState] = useState(false);

  const handleClose = () => {
    setShowState(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!show) return;
    console.log('🚀 ~ file: Snackbar.tsx:47 ~ useEffect ~ show:', show);

    setShowState(true);

    // remove snackbar after 3.5 seconds

    const timer = setTimeout(() => {
      handleClose();
    }, SNACKBAR_TIMEOUT);

    // clean up
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show]);

  return showState ? (
    <div
      className={` z-50 flex items-end justify-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end w-fit
        ${anchor === 'body' ? 'fixed bottom-2 right-2' : 'absolute bottom-[5.8rem]  left-[2.5px] w-full'}
        `}
    >
      <div
        className={`
            w-full  text-[14px] rounded border  flex justify-between items-center mb-1 px-3 py-2 leading-[1.2rem]
        ${
          type === 'success'
            ? ' bg-emerald-200 border-emerald-500/80 text-emerald-800'
            : 'bg-red-200 border-rose-500/70 text-rose-900'
        }
        `}
      >
        {msg}
        <button onClick={handleClose} className='scale-[1.25] opacity-70 mr-2'>
          {CloseIcon}
        </button>
      </div>
    </div>
  ) : null;
};

export default Snackbar;
