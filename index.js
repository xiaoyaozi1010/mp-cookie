/*
* Description:
* Author: lizy(zhiyong.lizy@hotmail.com)
* */
const WX_APP_COOKIE_NAMESPACE = 'WX_APP_COOKIE_' // 模拟cookie命名空间

export default class WXCookie {
  /**
   * 种/取cookie
   * @param {Object} option 配置:
   * option.expires: 过期时间，单位毫秒
   * option.path cookie生效路径，如果配置，只对path所在页面生效
   */
  constructor(option = {}) {
    let _opt = Object.assign({}, { expires: 24 * 60 * 60 * 1000, path: '' }, option)
    this._opt = _opt
    this._namespace += _opt.path + '$$'
    this._namespace = WX_APP_COOKIE_NAMESPACE
    this._getStorage = wx.getStorageSync
    this._setStorage = wx.setStorageSync
    this._getStorageInfo = wx.getStorageInfoSync
    this._removeStorage = wx.removeStorageSync
  }
  /**
   * 种
   * @param {String} key cookie键名，不允许以$开头
   * @param {Any} value cookie值，需要存储的内容。
   *  只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。
   * set 已存在的key会覆盖原有的
   */
  set(key, value) {
    if (typeof key !== 'string') {
      throw `[set cookie]: key is not a string`
    }
    if (key.trim() === '') {
      throw `[set cookie]: key cannot be a empty string`
    }
    if (key.trim()[0] === '$') {
      throw `[set cookie]: the first letter of ${key} must not start with "$"`
    }
    try {
      JSON.stringify(value)
    }
    catch (err) {
      throw err
    }
    const now = Date.now()
    const privateKey = this._getPrivateKey(key)
    this._setStorage(privateKey, {
      _expires: now + this._opt.expires,
      _data: value
    })
  }
  /**
   * 获取cookie
   * @param {String|undefined} key cookie键名，不传入获取全部cookie
   */
  get(key) {
    if (key === undefined) {
      return this._getAll()
    }
    else {
      const _privateKey = this._getPrivateKey(key)
      return this._get(_privateKey)
    }
  }
  /**
   * 获取已过期数据
   * @param {String} key
   * @return {Object} 返回过期cookie
   */
  getExpired(key) {
    const privateKey = this._getPrivateKey(key)
    if (!privateKey) {
      return undefined
    }
    return this._get(privateKey, true)
  }
  /**
   * 删除cookie
   * @param {String} key cookie键名
   */
  remove(key) {
    if (key === undefined || key.trim() === '') console.warn('[remove cookie]: remove a cookie whose key is empty has failed.')
    const privateKey = this._getPrivateKey(key)
    try {
      this._removeStorage(privateKey)
    } catch (e) {
      throw e
    }
  }
  /**
   * 清除当前namespace所有cookie
   */
  clear() {
    const keys = this._getStorageInfo()
    const privateKeys = keys.filter(key => this._isPrivateKey(key))
    if (!privateKeys.length) return
    privateKeys.forEach(pkey => this._removeStorage(pkey))
  }
  _getAll() {
    const keys = this._getStorageInfo()
    const privateKeys = keys.filter(key => this._isPrivateKey(key))
    if (!privateKeys.length) return null
    return privateKeys.map(key => {
      const data = this._get(key)
      const tmp = {}
      const realKey = this._getKey(key)
      if (data) {
        tmp[realKey] = data
        return tmp
      }
      else return false
    }).filter(_ => !!_)
  }
  _get(key, isExpired) {
    const storage = this._getStorage(key)
    const now = Date.now()
    if (!storage) return storage
    // 获取过期cookie
    if (isExpired) {
      if (now - storage._expires > 0) {
        return storage._data
      }
      else {
        return undefined
      }
    }
    // 获取正常cookie
    if (now - storage._expires < 0) {
      return storage._data
    }
    else {
      return undefined
    }
  }
  _getKey(key) {
    return key.replace(this._namespace, '')
  }
  _getPrivateKey(key) {
    return this._namespace + key
  }
  _isPrivateKey(key) {
    return key.indexOf(this._namespace) === 0
  }
}
