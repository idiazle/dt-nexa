import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PlansMap from '@/components/maps/plans-map'

interface ShapesPlanDialogStructure {
    id: number | null
    dialogOpen: boolean
    setDialogOpen: (value: boolean) => void
}


export default function ShapesPlanDialog({ id, dialogOpen, setDialogOpen }: ShapesPlanDialogStructure) {
    
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when are done.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <h1>Hola</h1>
                    <PlansMap/>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
