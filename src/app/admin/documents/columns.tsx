import { DocumentStructure } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnsDocsPropsStructure {
    onEdit: (obj: any) => void
    onDelete: (obj: any) => void
}

export const columnsDocuments = ({ onEdit, onDelete }: ColumnsDocsPropsStructure): ColumnDef<DocumentStructure>[] => [
    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        header: 'Título',
        accessorKey: 'title'
      },
]