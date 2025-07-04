'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TbView360Number } from 'react-icons/tb';

const OptionsNav = () => {
  const [openPFDlist, setOpenPFDList] = useState(false);
  const [openPNDList, setOpenPNDList] = useState(false);
  const [open360list, setOpen360List] = useState(false);
  const [hoveringPFD, setHoveringPFD] = useState<'pfd' | null>(null);
  const [hoveringPND, setHoveringPND] = useState<'pnd' | null>(null);
  const [hovering360, setHovering360] = useState<'360' | null>(null);

  const searchParams = useSearchParams();
  const mapType = searchParams.get('map-type');
  const is360View = typeof window !== 'undefined' && window.location.pathname.includes('nav360');
  const admin = typeof window !== 'undefined' && window.location.pathname.includes('/admin/nodes360-photos');

  const handleToggle = (menu: 'pfd' | 'pnd' | '360') => {
    setOpenPFDList(menu === 'pfd' ? !openPFDlist : false);
    setOpenPNDList(menu === 'pnd' ? !openPNDList : false);
    setOpen360List(menu === '360' ? !open360list : false);
  };

  const showPFDMenu = openPFDlist || hoveringPFD === 'pfd';
  const showPNDMenu = openPNDList || hoveringPND === 'pnd';
  const show360Menu = open360list || hovering360 === '360';

  return (
    <div className='absolute flex flex-row-rever bottom-3 left-1/2 -translate-x-1/2 z-50 p-2 rounded-md gap-1'>
      {/* PFD */}
      <div className='flex flex-col items-center w-32 gap-2 mb-5 relative'>
        {showPFDMenu && (
          <div
            className='absolute flex flex-col items-center w-40 bottom-28 mb-16 bg-white rounded-sm z-10'
            onMouseEnter={() => setHoveringPFD('pfd')}
            onMouseLeave={() => setHoveringPFD(null)}
          >
            <a href={"/interactives?map-id=10013&map-type=1"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 10</a>
            <a href={"/interactives?map-id=20013&map-type=1"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20</a>
            <a href={"/interactives?map-id=10006&map-type=1"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25</a>
          </div>
        )}
        <button
          onClick={() => handleToggle('pfd')}
          onMouseEnter={() => setHoveringPFD('pfd')}
          onMouseLeave={() => setHoveringPFD(null)}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center hover:bg-[#002645] hover:text-white ${openPFDlist || mapType === "1" ? 'bg-[#002645] text-white' : 'text-white bg-[#47657C]'} `}
        >
          PFD
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama de Flujo de Confiabilidad</span>
      </div>

      {/* PND */}
      <div className='flex flex-col items-center w-32 gap-2 relative'>
        {showPNDMenu && (
          <div
            onMouseEnter={() => setHoveringPND('pnd')}
            onMouseLeave={() => setHoveringPND(null)}
            className='absolute flex flex-col items-center w-40 bottom-28 mb-16 bg-white rounded-sm z-10'>
            <a href={"/interactives?map-id=20019&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 10</a>
            <a href={"/interactives?map-id=10007&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20-1</a>
            <a href={"/interactives?map-id=10010&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20-2</a>
            <a href={"/interactives?map-id=10011&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20-3</a>
            <a href={"/interactives?map-id=10012&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20-4</a>
            <a href={"/interactives?map-id=20015&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25-1</a>
            <a href={"/interactives?map-id=20016&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25-2</a>
            <a href={"/interactives?map-id=20017&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25-3</a>
            <a href={"/interactives?map-id=20018&map-type=3"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25-4</a>
          </div>
        )}
        <button
          onClick={() => handleToggle('pnd')}
          onMouseEnter={() => setHoveringPND('pnd')}
          onMouseLeave={() => setHoveringPND(null)}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center hover:bg-[#002645] hover:text-white ${openPNDList || mapType === '3' ? 'bg-[#002645] text-white' : 'text-white bg-[#47657C]'}`}
        >
          PND
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama de Navegación de Planta</span>
      </div>

      {/* RBD */}
      <div className='flex flex-col items-center w-32 gap-2'>
        <a href={"#"} className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-slate-400 opacity-80 cursor-default">
          RBD
        </a>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama de Bloques de Confiabilidad</span>
      </div>

      {/* 360 View */}
      <div className='flex flex-col items-center w-32 gap-2 relative'>
        {show360Menu && (
          <div
            onMouseEnter={() => setHovering360('360')}
            onMouseLeave={() => setHovering360(null)}
            className='absolute flex flex-col items-center w-40 bottom-28 mb-16 bg-white rounded-sm z-10'>
            <a href={"/interactives/nav360?nodeId=626"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 10</a>
            <a href={"/interactives/nav360?nodeId=9"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 20</a>
            <a href={"/interactives/nav360?nodeId=167"} className='w-full text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 rounded-sm'>Seccion 25</a>
          </div>
        )}
        <button
          onClick={() => handleToggle('360')}
          onMouseEnter={() => setHovering360('360')}
          onMouseLeave={() => setHovering360(null)}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center hover:bg-[#002645] hover:text-white ${open360list || is360View ? 'bg-[#002645] text-white' : 'text-white bg-[#47657C]'}`}
        >
          <TbView360Number size={55} />
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Navegación 360°</span>
      </div>
    </div>
  );
};

export default OptionsNav
