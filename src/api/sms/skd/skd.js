import request from '@/utils/request'

// 查询排班时间列表
export function listSkd(query) {
  return request({
    url: '/sms/skd/list',
    method: 'get',
    params: query
  })
}

// 查询排班时间详细
export function getSkd(id) {
  return request({
    url: '/sms/skd/' + id,
    method: 'get'
  })
}

// 新增排班时间
export function addSkd(data) {
  return request({
    url: '/sms/skd',
    method: 'post',
    data: data
  })
}

// 修改排班时间
export function updateSkd(data) {
  return request({
    url: '/sms/skd',
    method: 'put',
    data: data
  })
}

// 删除排班时间
export function delSkd(id) {
  return request({
    url: '/sms/skd/' + id,
    method: 'delete'
  })
}

// 导出排班时间
export function exportSkd(query) {
  return request({
    url: '/sms/skd/export',
    method: 'get',
    params: query
  })
}