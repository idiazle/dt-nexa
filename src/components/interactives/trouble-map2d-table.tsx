import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function TroubleMap2dTable ({ problems }: any) {
  return (
        <Table>
            <TableHeader>
                <TableRow className='bg-[#848484]'>
                    <TableHead className='text-white text-xs text-center font-semibold'>Problema</TableHead>
                    <TableHead className='text-white text-xs text-center font-semibold'>Causa del problema</TableHead>
                    <TableHead className='text-white text-xs text-center font-semibold'>Solución</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='bg-white'>
                {problems?.map((problem: any) => (
                  problem.problem_causes.flatMap((cause: any, causeIndex: number) => (
                    cause.solutions.map((solution: any, solutionIndex: number) => (
                            <TableRow className='text-black' key={`${problem.id}_${causeIndex}_${solutionIndex}`}>
                                {causeIndex === 0 && solutionIndex === 0 && (
                                    <TableCell rowSpan={problem.problem_causes.flatMap((cause: any) => cause.solutions).length} className='border text-xs w-3/12 whitespace-normal'>
                                        {problem.problem}
                                    </TableCell>
                                )}
                                {solutionIndex === 0 && (
                                    <TableCell rowSpan={cause.solutions.length} className='border text-xs w-4/12 whitespace-normal'>
                                        {cause.cause}
                                    </TableCell>
                                )}
                                <TableCell className='border text-xs w-5/12 whitespace-normal'>{solution.solution}</TableCell>
                            </TableRow>
                    ))
                  ))
                ))}
            </TableBody>
        </Table>
  )
}
