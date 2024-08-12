import React from 'react'
interface EquipmentDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
}
export default function EquipmentDialog({ id, dialogOpen, setDialogOpen }: EquipmentDialogStructure) {
  return (
    <div>EquipmentDialog</div>
  )
}
