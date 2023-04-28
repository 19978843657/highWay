import request from '@/config/axios'
// import { filterParam } from '@/utils'

export const getProperty = (params: any) => {
  return request.get({ url: '/Assets/selectPageInfo', params })
}
export const AddProperty = (data: any) => {
  return request.post({ url: '/Assets/update', data })
}
export const deleteProperty = (id) => {
  return request.get({ url: '/Assets/deleteById', id })
}
export const EditProperty = (id: number, data: any) => {
  return request.put({ url: `/Assets/update/${id}`, data })
}
