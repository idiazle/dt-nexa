import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'

export default function PlansMap() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/plans-map-container'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
                <Map posix={[4.79029, -75.69003]} />
            </div>
        </>
    )
}
