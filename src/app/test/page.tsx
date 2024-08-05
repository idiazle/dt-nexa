'use client'
import PdfViewer from '@/components/viewers/pdf-viewer'
import React from 'react'

export default function page() {
  return (
    <PdfViewer file={'https://almdigital1.blob.core.windows.net/tintaya/files/3/1.1. Descripción General de las Operaciones.pdf.pdf'}/>
  )
}
