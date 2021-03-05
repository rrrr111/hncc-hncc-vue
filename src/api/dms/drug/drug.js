import request from '@/utils/request'

// 查询药品项目（包括了重要、中成药、草药）列表
export function listDrug(query) {
  return request({
    url: '/dms/drug/list',
    method: 'get',
    params: query
  })
}

// 查询药品项目（包括了重要、中成药、草药）详细
export function getDrug(id) {
  return request({
    url: '/dms/drug/' + id,
    method: 'get'
  })
}

// 新增药品项目（包括了重要、中成药、草药）
export function addDrug(data) {
  return request({
    url: '/dms/drug/create',
    method: 'post',
    data: data
  })
}

// 修改药品项目（包括了重要、中成药、草药）
export function updateDrug(data,id) {
  return request({
    url: '/dms/drug/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除药品项目（包括了重要、中成药、草药）
export function delDrug(id) {
  return request({
    url: '/dms/drug/delete/' + id,
    method: 'delete'
  })
}

// 导出药品项目（包括了重要、中成药、草药）
export function exportDrug(query) {
  return request({
    url: '/dms/drug/export',
    method: 'get',
    params: query
  })
}
