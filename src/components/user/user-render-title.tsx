'use client'
import { OptionAsideContext } from '@/context/option-aside-context'
import { useSearchParams } from 'next/navigation'
import React, { useContext } from 'react'

function UserRenderTitle() {
    const { option } = useContext(OptionAsideContext)
    const optionType = useSearchParams().get('option-type')

    const renderTitle = () => {
        if (option) {
            if (optionType === '1') {
                return option.name
            } else {
                return option.name
            }
        }
    }
    return (
        <h1 className='text font-semibold'>{renderTitle()}</h1>

    )
}

export default UserRenderTitle