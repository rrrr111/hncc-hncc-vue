import request from '@/utils/request'

// 查询药品剂型列表
export function listDosage(query) {
  return request({
    url: '/dms/dosage/list',
    method: 'get',
    params: query
  })
}

// 查询药品剂型所有列表
export function listAllDosage() {
  return request({
    url: '/dms/dosage/listAll',
    method: 'get',
  })
}

// 查询药品剂型详细
export function getDosage(id) {
  return request({
    url: '/dms/dosage/' + id,
    method: 'get'
  })
}

// 新增药品剂型
export function addDosage(data) {
  return request({
    url: '/dms/dosage/create',
    method: 'post',
    data: data
  })
}

// 修改药品剂型
export function updateDosage(data,id) {
  return request({
    url: '/dms/dosage/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除药品剂型
export function delDosage(id) {
  return request({
    url: '/dms/dosage/delete' + id,
    method: 'delete'
  })
}

// 导出药品剂型
export function exportDosage(query) {
  return request({
    url: '/dms/dosage/export',
    method: 'get',
    params: query
  })
}
