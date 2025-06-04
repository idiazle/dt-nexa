'use client'
import React from 'react'
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'

function Dtwin() {
  const plugins = [
    [AutorotatePlugin, {
      start: true
    }
    ]
  ] as any

  return (
    <>
      <ReactPhotoSphereViewer
        src='/img/fondo_presentacion.jpg'
        width='100%'
        height='100%'
        navbar={false}
        container={'container-360'}
        plugins={plugins}
        mousemove={false}
        mousewheel={false}
        loadingImg='none'
      />
      <div className='absolute flex flex-row-rever gap-1 bottom-3 left-1/2 -translate-x-1/2 z-50 bg-gray-200 p-2 rounded-md'>
        <a href={"/interactives?map-id=10005&map-type=1"} className="font-bold text-3xl p-4 rounded-lg text-black bg-gray-400">PFD</a>
        <a href={'/interactives?map-id=10003&map-type=3'} className='font-bold text-3xl p-4 rounded-lg text-black bg-gray-400'> PND</a>
      </div>
    </>
  )
}

export default Dtwin
