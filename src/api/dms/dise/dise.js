import request from '@/utils/request'

// 查询诊断类型（疾病）列表
export function listDise(query) {
  return request({
    url: '/dms/dise/list',
    method: 'get',
    params: query
  })
}

// 查询诊断类型（疾病）详细
export function getDise(id) {
  return request({
    url: '/dms/dise/' + id,
    method: 'get'
  })
}

// 新增诊断类型（疾病）
export function addDise(data) {
  return request({
    url: '/dms/dise/create',
    method: 'post',
    data: data
  })
}

// 修改诊断类型（疾病）
export function updateDise(data,id) {
  return request({
    url: '/dms/dise/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除诊断类型（疾病）
export function delDise(id) {
  return request({
    url: '/dms/dise/delete/' + id,
    method: 'delete'
  })
}

// 导出诊断类型（疾病）
export function exportDise(query) {
  return request({
    url: '/dms/dise/export',
    method: 'get',
    params: query
  })
}
