'use client'
import { getNodes360, getNodes360ById } from '@/api/admin/nodes360-api'
import Node360Viewer from '@/components/admin/nodes360/node360-viewer'
import { PhotogrametryStructure } from '@/lib/utils'
import React, { useEffect, useState } from 'react'


const Nav360 = () => {
  const [Open360Dialog, setOpen360Dialog] = useState<boolean>(true)
  const [nodeSelected, setNodeSelected] = useState<PhotogrametryStructure | null>(null)
  const [nodes360, setNodes360] = useState<PhotogrametryStructure[] | null>(null)
  const [nodeId, setNodeId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nodeId = params.get('nodeId');
    if (nodeId) {
      setNodeId(nodeId);
    }
  }, []);

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
    if (nodeId && nodes360 !== null) {
      // const node = nodes360.find((n) => n.id === Number(nodeId))
      // if (node) {
      //   setNodeSelected(node)
      // } else {
      //   console.warn(`Node with ID ${nodeId} not found in nodes360.`);
      // }
      getInitialNode()
    }
  }, [nodeId, nodes360])

  return (
    <div>
      {Open360Dialog && nodeSelected !== null && nodes360 !== null
        ?
        <Node360Viewer selectedNode={nodeSelected} allNodes={nodes360} dialogOpen={Open360Dialog} setDialogOpen={setOpen360Dialog} />
        : null
      }
    </div>
  )
}

export default Nav360
