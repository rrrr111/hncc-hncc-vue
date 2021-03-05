import request from '@/utils/request'

// 查询就诊(门诊)信息列表
export function listRegistration(query) {
  return request({
    url: '/dms/registration/list',
    method: 'get',
    params: query
  })
}

// 查询就诊(门诊)信息详细
export function getRegistration(id) {
  return request({
    url: '/dms/registration/' + id,
    method: 'get'
  })
}

// 新增就诊(门诊)信息
export function addRegistration(data) {
  return request({
    url: '/dms/registration',
    method: 'post',
    data: data
  })
}

// 修改就诊(门诊)信息
export function updateRegistration(data) {
  return request({
    url: '/dms/registration',
    method: 'put',
    data: data
  })
}

// 删除就诊(门诊)信息
export function delRegistration(id) {
  return request({
    url: '/dms/registration/delete/' + id,
    method: 'delete'
  })
}

// 导出就诊(门诊)信息
export function exportRegistration(query) {
  return request({
    url: '/dms/registration/export',
    method: 'get',
    params: query
  })
}
