import request from '@/config/axios'
// import { filterParam } from '@/utils'

export const getProperty = (params: any) => {
  return request.get({ url: '/Assets/selectPageInfo', params })
}
export const AddProperty = (data: any) => {
  return request.post({ url: '/Assets/update', data })
}
export const deleteProperty = (params: any) => {
  return request.get({ url: '/Assets/deleteById', params })
}
export const EditProperty = (params: any) => {
  return request.put({ url: '/Assets/update', params })
}
