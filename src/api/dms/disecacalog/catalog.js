import request from '@/utils/request'

// 查询诊断类型（疾病）目录列表
export function listCatalog(query) {
  return request({
    url: '/dms/disecatalog/list',
    method: 'get',
    params: query
  })
}

// 查询诊断类型（疾病）目录详细
export function getCatalog(id) {
  return request({
    url: '/dms/catalog/' + id,
    method: 'get'
  })
}

// 新增诊断类型（疾病）目录
export function addCatalog(data) {
  return request({
    url: '/dms/disecatalog/create',
    method: 'post',
    data: data
  })
}

// 修改诊断类型（疾病）目录
export function updateCatalog(data,id) {
  return request({
    url: '/dms/disecatalog/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除诊断类型（疾病）目录
export function delCatalog(id) {
  return request({
    url: '/dms/disecatalog/delete/' + id,
    method: 'delete'
  })
}

// 导出诊断类型（疾病）目录
export function exportCatalog(query) {
  return request({
    url: '/dms/catalog/export',
    method: 'get',
    params: query
  })
}
