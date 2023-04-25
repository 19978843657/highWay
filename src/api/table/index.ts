import request from '@/config/axios'
// import type { TableData } from './types'
import axios from '@/config/axios'
import { filterParam } from '@/utils'

export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/example/list', params })
}
export const testApi = (): Promise<IResponse> => {
  return request.get({ url: '/Assets/selectAll' })
}
export const saveTableApi = (data): Promise<IResponse> => {
  return request.post({ url: '/example/save', data })
}

export const getTableDetApi = (id: string) => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/example/delete', data: { ids } })
}
export const getCaseData = (params) => {
  const obj = filterParam(params)
  return request.get({ url: '/Case/selectPageInfo', obj })
}
