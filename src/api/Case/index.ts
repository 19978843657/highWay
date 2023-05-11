import request from '@/config/axios'
// import { filterParam } from '@/utils'

export const getCase = (params: any) => {
  return request.get({ url: '/Case/selectPageInfo', params })
}
export const AddCase = (data: any) => {
  return request.post({ url: '/Case/insert', data })
}
export const deleteCase = (params: any) => {
  return request.get({ url: '/Case/delete', params })
}
export const getCaseCount = (params: any) => {
  return request.get({ url: '/Case/selectCount', params })
}
export const EditCase = (params: any) => {
  return request.put({ url: '/Case/updateById', params })
}
