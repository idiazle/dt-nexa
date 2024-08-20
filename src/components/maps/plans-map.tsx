import { PlanStructure } from '@/lib/utils'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'



interface PlansMapStructure {
    plan: PlanStructure | null
}

export default function PlansMap({ plan }: PlansMapStructure) {
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/plans-map-container'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (

        <div className='w-full h-full bg-white'>
            <Map planSelected={plan} posix={[4.79029, -75.69003]} />
        </div>

    )
}
