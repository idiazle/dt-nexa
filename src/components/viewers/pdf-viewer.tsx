import React from 'react'
import { Viewer, Worker, SpecialZoomLevel, type LoadError } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import es_ES from '@react-pdf-viewer/locales/lib/es_ES.json'
import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode'
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import packageJson from '../../../package.json'
const pdfjsVersion = packageJson.dependencies['pdfjs-dist']

const PdfViewer = ({ file }: any) => {
  // console.log("pdfjsVersion",pdfjsVersion);
  const selectionModePluginInstance = selectionModePlugin()

  const zoomPluginInstance = zoomPlugin()


  const { SwitchSelectionModeButton } = selectionModePluginInstance
  const customToolbar = (Toolbar: any) => (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
      }}
    >
      <Toolbar>
        {(props: any) => {
          const {
            CurrentPageInput,
            Download,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
            Rotate
          } = props
          return (
            <>
              <div style={{ padding: '0px 2px' }}>
                <ShowSearchPopover />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomOut />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Zoom />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomIn />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: '0px 2px', width: '4rem' }}>
                <CurrentPageInput />
              </div>
              <div className='text-black' style={{ padding: '0px 2px' }}>
                / <NumberOfPages />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <GoToNextPage />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <EnterFullScreen />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Download />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Print />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Rotate />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <SwitchSelectionModeButton mode={SelectionMode.Hand} />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <SwitchSelectionModeButton mode={SelectionMode.Text} />
              </div>
            </>
          )
        }}
      </Toolbar>
    </div>
  )

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: customToolbar,
    sidebarTabs: defaultTabs => [
      // Remove the attachments tab (\`defaultTabs[2]\`)
      // defaultTabs[0], // Bookmarks tab
      defaultTabs[0], // Thumbnails tab
      defaultTabs[1]
    ]
  })
  const renderError = (error: LoadError) => {
    let message = ''
    switch (error.name) {
      case 'InvalidPDFException':
        message = 'El documento no es válido o está dañado'
        break
      case 'MissingPDFException':
        message = 'El documento no se encuentra disponible'
        break
      case 'UnexpectedResponseException':
        message = 'Respuesta inesperada del servidor'
        break
      default:
        message = 'No se puede cargar el documento'
        break
    }

    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: '#e53e3e',
            borderRadius: '0.25rem',
            color: '#fff',
            padding: '0.5rem'
          }}
        >
          {message}
        </div>
      </div>
    )
  }

  const { zoomTo } = zoomPluginInstance
zoomTo(SpecialZoomLevel.PageWidth)
  return (
    // <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>

      <div className='h-full w-full'>
        {(file)
          ? <Viewer
            localization={es_ES}
            fileUrl={file}
            defaultScale={1}
            renderError={renderError}
            plugins={[
              defaultLayoutPluginInstance,
              selectionModePluginInstance,
              zoomPluginInstance
            ]}
          />
          : null}

      </div>
    </Worker>
  )
}

export default PdfViewer
