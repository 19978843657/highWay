import request from '@/config/axios'
// import { filterParam } from '@/utils'

export const getUser = (params: any) => {
  return request.get({ url: '/User/selectPageInfo', params })
}
export const AddUser = (data: any) => {
  return request.post({ url: '/User/insert', data })
}
export const deleteUser = (params: any) => {
  return request.get({ url: '/User/deleteById', params })
}
export const EditUser = (params: any) => {
  return request.put({ url: '/User/update', params })
}
