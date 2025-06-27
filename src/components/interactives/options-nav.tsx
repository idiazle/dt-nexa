'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TbView360Number } from 'react-icons/tb';

const OptionsNav = () => {
  const [openPFDlist, setOpenPFDList] = useState<boolean>(false);
  const [openPNDList, setOpenPNDList] = useState<boolean>(false);
  const [open360list, setOpen360List] = useState<boolean>(false);
  const searchParams = useSearchParams()
  const mapType = searchParams.get('map-type')

  const is360View = window.location.pathname.includes('nav360');

  console.log("is360View", is360View);

  return (
    <div className='absolute flex flex-row-rever bottom-3 left-1/2 -translate-x-1/2 z-50 p-2 rounded-md gap-1'>
      <div className='flex flex-col items-center w-32 gap-2 mb-5'>
        {
          openPFDlist ?
            < div className='absolute flex flex-col items-center w-40 bottom-28 gap-1 mb-16 bg-white rounded-sm border border-gray-400'>
              <a href={"/interactives?map-id=10013&map-type=1"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 10</a>
              <a href={"/interactives?map-id=20013&map-type=1"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200 '>Seccion 20</a>
              <a href={"/interactives?map-id=10006&map-type=1"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25</a>
            </div>
            : null
        }
        <button
          onClick={() => {
            setOpenPFDList(!openPFDlist);
          }}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center border-2 border-[#002645] hover:bg-[#002645] hover:text-white ${mapType === '1' ? 'bg-[#002645] text-white' : 'bg-white text-black'}`}>
          PFD
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama de Flujo de Confiabilidad </span>
      </div>
      <div className='flex flex-col items-center w-32 gap-2'>
        {
          openPNDList ?
            < div className='absolute flex flex-col items-center w-40 bottom-28 gap-1 mb-16 bg-white rounded-sm border border-gray-400'>
              <a href={"/interactives?map-id=20019&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 10</a>
              <a href={"/interactives?map-id=10007&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 20-1</a>
              <a href={"/interactives?map-id=10010&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 20-2</a>
              <a href={"/interactives?map-id=10011&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 20-3</a>
              <a href={"/interactives?map-id=10012&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 20-4</a>
              <a href={"/interactives?map-id=20015&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25-1</a>
              <a href={"/interactives?map-id=20016&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25-2</a>
              <a href={"/interactives?map-id=20017&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25-3</a>
              <a href={"/interactives?map-id=20018&map-type=3"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25-4</a>
            </div>
            : null
        }
        <button
          onClick={() => {
            setOpenPNDList(!openPNDList);
          }}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center border-2 border-[#002645] hover:bg-[#002645] hover:text-white ${mapType === '3' ? 'bg-[#002645] text-white' : 'bg-white text-black'}`}>
          PND
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama de Navegación de Planta</span>
      </div>
      <div className='flex flex-col items-center w-32 gap-2'>
        <a href={"#"} className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-slate-400 opacity-80 cursor-default">
          PLD
        </a>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Diagrama Lógico Funcional</span>
      </div>
      <div className='flex flex-col items-center w-32 gap-2'>
        {
          open360list ?
            < div className='absolute flex flex-col items-center w-40 bottom-28 gap-1 mb-16 bg-white rounded-sm border border-gray-400'>
              <a href={"/interactives/nav360?nodeId=626"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 10</a>
              <a href={"/interactives/nav360?nodeId=9"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 20</a>
              <a href={"/interactives/nav360?nodeId=167"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#002645] hover:text-white cursor-pointer bg-gray-200'>Seccion 25</a>
            </div>
            : null
        }
        <button
          onClick={() => {
            setOpen360List(!open360list);
          }}
          className={`font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center border-2 border-[#002645] hover:bg-[#002645] hover:text-white ${is360View ? 'bg-[#002645] text-white' : 'text-black bg-white'}`}>
          <TbView360Number size={55} />
        </button>
        <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1 text-white'>Navegación 360°</span>
      </div>
    </div>
  )
}

export default OptionsNav
