import request from '@/utils/request'

// 查询排班规则列表
export function listRule(query) {
  return request({
    url: '/sms/skdrule/list',
    method: 'get',
    params: query
  })
}

// 查询排班规则详细
export function getRule(id) {
  return request({
    url: '/sms/skdrule/getById',
    method: 'get',
    params: id
  })
}

// 新增排班规则
export function addRule(data) {
  return request({
    url: '/sms/skdrule/create',
    method: 'post',
    data: data
  })
}

// 修改排班规则
export function updateRule(data,id) {
  return request({
    url: '/sms/skdrule/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除排班规则
export function delRule(id) {
  return request({
    url: '/sms/skdrule/' + id,
    method: 'delete'
  })
}

// 导出排班规则
export function exportRule(query) {
  return request({
    url: '/sms/skdrule/export',
    method: 'get',
    params: query
  })
}
