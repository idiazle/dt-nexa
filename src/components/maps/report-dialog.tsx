import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';

interface ReportDialogProps {
  openReporteDialog: boolean;
  setOpenReporteDialog: (open: boolean) => void;
  reportData: any;
}

const ReportDialog = ({ openReporteDialog, setOpenReporteDialog, reportData }: ReportDialogProps) => {
  return (
     <Dialog open={openReporteDialog} onOpenChange={setOpenReporteDialog}>
        <DialogContent className="max-h-[90vh] min-w-[80%] bg-gray-200 flex flex-col">
          <DialogHeader>
            <DialogTitle className=''>REPORTE DE CONDICIÓN DE EQUIPO</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col bg-white text-xs overflow-y-auto rounded-sm w-full max-h-[calc(80vh-20px)] p-2 gap-2">
              <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Semana:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["SEMANA"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Condicion:</Label>
                  <h1 className={`px-2 py-1 w-full rounded-md font-bold
                  ${reportData?.["CONDICION ACT."] === 'ALARMA' ? 'bg-[#F20000]' :
                      reportData?.["CONDICION ACT."] === 'PRECAUCION' ? 'bg-[#FFC000]' :
                        reportData?.["CONDICION ACT."] === 'TOLERABLE' ? 'bg-[#FFFF00]' :
                          reportData?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#00A049]' :
                            reportData?.["CONDICION ACT."] === 'NORMAL' ? 'bg-[#B0B0B0]' :
                              'bg-white'}
                    `}>{reportData?.["CONDICION ACT."]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">Fecha:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["FECHA"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 items-center w-1/3">
                  <Label className="font-bold">TAG:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["TAG"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-2/3">
                  <Label className="font-bold">Equipo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["ACTIVO"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Área:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["AREA"]}</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Diagnóstico/Observación:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md whitespace-pre-line">
                  {reportData?.["PLAN DE ACCIÓN"]}
                </h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">Plan de acción:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md whitespace-pre-line">{reportData?.["PLAN DE ACCIÓN"]}</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="font-bold">N° de aviso:</Label>
                <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["N° AVISO"]}</h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Técnica:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["Técnica"] === '' ? "Sin técnica registrada" : reportData?.["Técnica"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Modo de falla:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["Modo de falla"] === "" ? "Sin modo de falla registrado" : reportData?.["Modo de falla"]}</h1>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold"># Orden de Trabajo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["OT"] === 0 ? "Sin orden de trabajo" : reportData?.["OT"]}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center w-1/2">
                  <Label className="font-bold">Fecha de inicio extremo:</Label>
                  <h1 className="bg-gray-100 px-2 py-1 w-full rounded-md">{reportData?.["Fecha Inicio Extremo"] === "" ? "Sin fecha de inicio extremo registrada" : reportData?.["Fecha Inicio Extremo"]}</h1>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default ReportDialog
