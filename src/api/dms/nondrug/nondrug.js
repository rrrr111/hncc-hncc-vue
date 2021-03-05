import request from '@/utils/request'

// 查询非药品数据列表
export function listData(query) {
  return request({
    url: '/dms/nondrug/list',
    method: 'get',
    params: query
  })
}

// 获取非药品数据
export function getData(query) {
  return request({
    url: '/dms/nondrug/'+query,
    method: 'get',
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/dms/nondrug/create',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data,id) {
  return request({
    url: '/dms/nondrug/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/dms/nondrug/delete/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}
