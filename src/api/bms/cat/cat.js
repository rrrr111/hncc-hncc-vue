import request from '@/utils/request'

// 查询j结算类别列表
export function listCatAll() {
  return request({
    url: '/bms/settlementcat/listAll',
    method: 'get',
  })
}

// 查询j结算类别列表
export function listCat(query) {
  return request({
    url: '/bms/settlementcat/list',
    method: 'get',
    params: query
  })
}

// 查询j结算类别详细
export function getCat(id) {
  return request({
    url: '/bms/settlementcat/' + id,
    method: 'get'
  })
}

// 新增j结算类别
export function addCat(data) {
  return request({
    url: '/bms/settlementcat/create',
    method: 'post',
    data: data
  })
}

// 修改j结算类别
export function updateCat(data,id) {
  return request({
    url: '/bms/settlementcat/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除j结算类别
export function delCat(id) {
  return request({
    url: '/bms/settlementcat/delete/' + id,
    method: 'delete'
  })
}

// 导出j结算类别
export function exportCat(query) {
  return request({
    url: '/bms/settlementcat/export',
    method: 'get',
    params: query
  })
}
