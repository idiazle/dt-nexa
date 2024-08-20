'use client'
import PlansMap from '@/components/maps/plans-map'
import PdfViewer from '@/components/viewers/pdf-viewer'
import React from 'react'

export default function page() {
  const planx = {
    id: 40006,
    documents: [
      {
        id: 20002,
        document_id: {
          id: 30002,
          title: 'aWX',
          filename: 'Testtt.pdf',
          author: 'awxwax',
          aux_type_id: {
            id: 422,
            name: 'Plano PFD',
            code: '',
            initials: '',
            icon_url: 'http://192.168.1.95:5000/',
            parent: 207
          },
          aux_discipline_id: {
            id: 207,
            name: 'General por gerencia planta',
            code: 'GGP',
            initials: '',
            icon_url: 'http://192.168.1.95:5000/',
            parent: 102
          },
          aux_module_id: {
            id: 102,
            name: 'Operaciones',
            code: '',
            initials: '',
            icon_url: 'http://192.168.1.95:5000/',
            parent: 1
          },
          confidential: 0,
          file_url:
            'https://almdigital1.blob.core.windows.net/lasbambas/files/30002/30002_2024-08-16 10:04:29.816114.pdf',
          date_doc: '2024-08-16T00:00:00Z',
          date_load: '2024-08-16T00:00:00Z',
          date_expired: null,
          days_expired: 0,
          user_id: 1,
          deleted: false,
          created_at: '2024-08-16T15:04:29.611239Z',
          vendor: null,
          client: null
        },
        entity_id: 40006,
        user_id: 1,
        type: 6,
        entity_data: {
          id: 40006,
          image:
            'https://almdigital1.blob.core.windows.net/lasbambas/entity_images/40006/FLR-A9SN-EP-3600-EE-DW-1102_R1.jpg',
          description: 'XAXA',
          active: true,
          name: 'TETSINT 123',
          code: '0011-AS',
          type: 6,
          blocked: false,
          parent_id: 30002,
          user_id: 1,
          deleted: false,
          plan_image: null,
          children: []
        }
      }
    ],
    parent: {
      id: 30002,
      image: null,
      description: 'waxaw',
      active: true,
      name: 'Area Testing',
      code: 'Azzx',
      type: 5,
      blocked: false,
      parent_id: 1,
      user_id: 123,
      deleted: false,
      plan_image: null,
      children: [
        {
          id: 40006,
          name: 'TETSINT 123',
          image:
            'https://almdigital1.blob.core.windows.net/lasbambas/entity_images/40006/FLR-A9SN-EP-3600-EE-DW-1102_R1.jpg',
          description: 'XAXA',
          code: '0011-AS',
          type: 6,
          plan_image: null,
          active: true,
          blocked: false,
          user_id: 1,
          deleted: false,
          created_at: '2024-08-16T15:04:29.431352Z',
          deleted_at: null,
          updated_at: '2024-08-19T15:30:26.941044Z',
          parent: 30002
        }
      ]
    },
    name: 'TETSINT 123',
    image:
      'https://almdigital1.blob.core.windows.net/lasbambas/entity_images/40006/FLR-A9SN-EP-3600-EE-DW-1102_R1.jpg',
    description: 'XAXA',
    code: '0011-AS',
    type: 6,
    plan_image: null,
    active: true,
    blocked: false,
    user_id: 1
  }
  return (

    <p>dwadwa</p>
    // <PlansMap plan={planx} />
  )
}
