import request from '@/utils/request'

// 查询挂号级别列表
export function listRankAll() {
  return request({
    url: '/sms/registrationrank/listAll',
    method: 'get',
  })
}

// 查询挂号级别列表
export function listRank(query) {
  return request({
    url: '/sms/registrationrank/list',
    method: 'get',
    params: query
  })
}

// 查询挂号级别详细
export function getRank(id) {
  return request({
    url: '/sms/registrationrank/' + id,
    method: 'get'
  })
}

// 新增挂号级别
export function addRank(data) {
  return request({
    url: '/sms/registrationrank/create',
    method: 'post',
    data: data
  })
}

// 修改挂号级别
export function updateRank(id,data) {
  return request({
    url: '/sms/registrationrank/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除挂号级别
export function delRank(id) {
  return request({
    url: '/sms/registrationrank/delete/' + id,
    method: 'delete'
  })
}

// 导出挂号级别
export function exportRank(query) {
  return request({
    url: '/sms/registrationrank/export',
    method: 'get',
    params: query
  })
}
