import request from '@/config/axios'
// import { filterParam } from '@/utils'

export const getProperty = (params: any) => {
  return request.get({ url: '/User/selectPageInfo', params })
}
export const AddProperty = (data: any) => {
  return request.post({ url: '/User/insert', data })
}
export const deleteProperty = (params: any) => {
  return request.get({ url: '/User/deleteById', params })
}
export const EditProperty = (params: any) => {
  return request.put({ url: '/User/update', params })
}
