import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    ReactPhotoSphereViewer,
} from "react-photo-sphere-viewer";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { GalleryPlugin } from "@photo-sphere-viewer/gallery-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";
import { PhotogrametryStructure } from '@/lib/utils';
import MarkersLinksDialog from './markers-links-dialog';

interface Nodes360ViewerStructure {
    allNodes: PhotogrametryStructure[] | null
    selectedNode: PhotogrametryStructure | null
    dialogOpen: boolean
    setDialogOpen: (val: boolean) => void
}

const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";
const caption = "Cape Florida Light, Key Biscayne <b>&copy; Pixexid</b>";

export default function Node360Viewer({ allNodes, selectedNode, dialogOpen, setDialogOpen }: Nodes360ViewerStructure) {

    const pSRef = React.createRef();
    const [getCurrentNodeFunction, setGetCurrentNodeFunction] = React.useState(null);

    const handleReady = (instance) => {
        const virtualTour = instance.getPlugin(VirtualTourPlugin);
        if (!virtualTour) return;

        if (allNodes !== null && selectedNode !== null) {
            virtualTour.setNodes(
                allNodes.map((obj) => {
                    return {
                        ...obj,
                        links: JSON.parse(obj.links as string),
                        markers: JSON.parse(obj.markers as string).map((mark: any, index: number) => {
                            return {
                                ...mark,
                                id: mark.tooltip + index
                            }
                        })
                    }
                })
                ,
                selectedNode.id
            )
            console.log("MY ALL NNNNNNOOODES", allNodes);
        }


    };

    const handleClick = () => {
        const curr_node = getCurrentNodeFunction();
        console.log(curr_node);
    }

    const plugins = [
        MarkersPlugin,
        [
            GalleryPlugin,
            {
                thumbnailSize: { width: 100, height: 100 }
            }
        ],
        [
            VirtualTourPlugin,
            {
                renderMode: "3d"
            }
        ]
    ];

    const [dialogMarkLink, setDialogMarkLink] = useState({
        open: false,
        data: null
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className='max-h-[98vh] max-w-[95vw]'>
                <DialogHeader>
                    <DialogTitle>{selectedNode?.name}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <ReactPhotoSphereViewer
                    ref={pSRef}
                    // loadingImg={baseUrl + "loader.gif"}
                    touchmoveTwoFingers={true}
                    mousewheelCtrlKey={true}
                    navbar={["zoom", "move", "gallery", "download", "description", "caption", "fullscreen"]}
                    height={"85vh"}
                    width={"100%"}
                    hideNavbarButton={true}
                    onReady={handleReady}
                    onDblclick={(instance: any) => {
                        setDialogMarkLink({
                            ...dialogMarkLink,
                            open: true,
                            data: {
                                ...instance.data,
                                selectedNode: selectedNode
                            }
                        })
                    }}
                    plugins={plugins}
                    container={"container-360"}
                    src={selectedNode?.panorama}
                ></ReactPhotoSphereViewer>
            </DialogContent>
            {
                dialogMarkLink.open ? <MarkersLinksDialog setDialogFather={setDialogOpen} allNodes={allNodes} dialogData={dialogMarkLink} setDialogData={setDialogMarkLink} /> : null
            }
        </Dialog>
    )
}
