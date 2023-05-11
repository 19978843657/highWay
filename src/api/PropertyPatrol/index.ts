import request from '@/config/axios'

//Property API
export const getProperty = (params: any) => {
  return request.get({ url: '/Assets/selectPageInfo', params })
}
export const AddProperty = (params: any) => {
  return request.post({ url: '/Assets/insert', params })
}
export const deleteProperty = (params: any) => {
  return request.get({ url: '/Assets/deleteById', params })
}
export const EditProperty = (params: any) => {
  return request.put({ url: '/Assets/update', params })
}
export const getCountProperty = (params: any) => {
  return request.get({ url: '/Assets/selectCountType', params })
}
//Patrol API
export const getPatrol = (params: any) => {
  return request.get({ url: '/Schedule/selectPageInfo', params })
}
export const AddPatrol = (params: any) => {
  return request.post({ url: '/Schedule/insert', params })
}
export const deletePatrol = (params: any) => {
  return request.get({ url: '/Schedule/deleteById', params })
}
export const EditPatrol = (params: any) => {
  return request.put({ url: '/Schedule/update', params })
}
