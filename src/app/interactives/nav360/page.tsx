'use client'
import { getNodes360, getNodes360ById } from '@/api/admin/nodes360-api'
import Node360Viewer from '@/components/admin/nodes360/node360-viewer'
import { PhotogrametryStructure } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const Nav360 = () => {
  const param = useSearchParams()
  const nodeId = param.get('nodeId')

  const [Open360Dialog, setOpen360Dialog] = useState<boolean>(true)
  const [nodeSelected, setNodeSelected] = useState<PhotogrametryStructure | null>(null)
  const [nodes360, setNodes360] = useState<PhotogrametryStructure[] | null>(null)

  const getInitialNode = () => {
    getNodes360ById(Number(nodeId))
      .then((response) => {
        setNodeSelected(response.data.data)
      })
      .catch((error) => {
        console.error("Error fetching node 360 data:", error);
      })
  }

  const getNodesAll = () => {
    getNodes360()
      .then((response) => {
        setNodes360(response.data.data)
        console.log("meeeeeee", response.data.data)
      })
      .catch((error) => {
        console.error("Error fetching nodes 360 data:", error);
      })
  }

  useEffect(() => {
    getNodesAll()
  }, [])

  useEffect(() => {
    if (nodeId) {
      getInitialNode()
    }
  }, [nodeId])




  return (
    <div>
      {Open360Dialog ?
        <Node360Viewer selectedNode={nodeSelected} allNodes={nodes360} dialogOpen={Open360Dialog} setDialogOpen={setOpen360Dialog} />
        : null
      }
    </div>
  )
}

export default Nav360