
import { getEntities } from '@/api/admin/entities-api'
import { getMenuIcons } from '@/api/admin/menu-api'
import RenderDataMenu from '@/components/menu/render-data-menu'
import { EntityStructure, MenuIconsStructure } from '@/lib/utils'


const getApiMenuIcons = async (): Promise<MenuIconsStructure[]> => {
  const response = await getMenuIcons()
  return response.data.data
}

const getApiPlants = async (): Promise<EntityStructure[]> => {
  const response = await getEntities()
  return response.data.data.filter((obj: EntityStructure) => obj.type === 4)
}



export default async function Menu() {

  const data = await getApiMenuIcons()
  const dataPlants = await getApiPlants()


  return (
    <RenderDataMenu data={data} dataPlants={dataPlants}/>
  )
}
