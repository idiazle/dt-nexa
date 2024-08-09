import React from 'react'

interface FormEntityStructure {
    setDialogOpen: (value: boolean) => void
    id: number | null
}
export default function FormEntity({ setDialogOpen, id }: FormEntityStructure) {
    return (
        <div>FormEntity</div>
    )
}
