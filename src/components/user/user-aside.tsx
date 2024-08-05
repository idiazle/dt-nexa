import Image from 'next/image'
import React from 'react'
import UserGrInfoMenu from './user-gr-info-menu'
import UserAreaMenu from './user-area-menu'

export default function UserAside() {

  const optionArray = [
    1, 2, 3, 4
  ]
  const areaArray = [
    1, 2, 3, 4, 5, 6
  ]


  return (
    <div className='bg-[#001d39] w-full h-full p-7 flex flex-col'>
      <div className='flex justify-center items-center mb-5'>
        <Image
          style={{
            width: 'auto',
            height: 'auto'
          }}
          src="/img/icons/login-logo.png"
          width={175}
          height={175}
          alt="Picture of the author21421"
          priority
        />
      </div>
      {/* Información General */}
      <div className='flex flex-col justify-center items-center mt-8 w-full overflow-hidden h-1/2'>
        <div className='w-full border-b border-white'>
          <h4 className='text-sm w-full'>Información General</h4>
        </div>
        <div className='flex flex-col justify-center items-center p-2 gap-2 overflow-auto'>
          {
            optionArray.map((obj, index) => {
              return (
                <UserGrInfoMenu key={index} />
              )
            })
          }
        </div>
      </div>

      <div className='flex flex-col justify-start items-center w-full overflow-hidden h-1/2'>
        <div className='w-full border-b border-white'>
          <h4 className='text-sm w-full'>Áreas</h4>
        </div>
        <div className='flex flex-row justify-center items-center gap-3 flex-wrap overflow-auto mt-4 w-full'>
          {
            areaArray.map((obj, index) => {
              return (
                <UserAreaMenu key={index} />
              )
            })
          }
        </div>
      </div>

    </div>
  )
}
