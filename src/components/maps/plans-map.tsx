import { Map2dShapesStructure, Map2dStructure, PlanStructure } from '@/lib/utils'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'



interface MapRenderStructure {
    data: Map2dStructure | null
}

export default function PlansMap({ data }: MapRenderStructure) {
    console.log("MY DATEISHON", data);
    
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/plans-map-container'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (

        <div className='w-full h-full bg-white'>
            <Map mapSelected={data} posix={[4.79029, -75.69003]} />
        </div>

    )
}
