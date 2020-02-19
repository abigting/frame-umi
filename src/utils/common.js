import Cookies from 'js-cookie';
import config from 'config';
import request from '@/utils/request';

export function setCookie(name, val) {
  Cookies.set(name, val, { expires: 7, path: '/' });
}

export function getCookie(name) {
  return Cookies.get(name);
}

export function removeCookie(name) {
  Cookies.remove(name);
}

export function removeAllcookie() {
  Cookies.remove('userInfo');
  Cookies.remove('__authority');
}

export function getUserInfo() {
  return Cookies.getJSON('userInfo') || {};
}

export function packRespnseData(res) {
  let defRes = { code: '0', errorMsg: '', result: {}, ...res };
  return defRes;
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

///判断是否是群
export function isGroup(str) {
  return str && str.endsWith('@chatroom');
}

//判断是否是群消息
export function isGroupMessage(type) {
  return type === '10000';
}

/**
 * @desc 返回带有基础路径的url
 * @param {string} url
 * @returns 完整url
 */
export function urlWithBase(url) {
  return config.BASEURL + url;
}

export const num = (n) => n || 0;

/**
 * @desc 返回百分比
 * @param {number} a
 * @param {number} b
 * @returns {string} 33.30% 33%
 */
export const percent = (function() {
  const cc = /^\d+\.*(0+)$/;
  const zeroReg = /\.(0+)$/;
  return (a, b) => {
    if (!a) {
      return '0%';
    }
    if (!b) {
      return '-';
    }
    let ret = (num(a) * 100) / num(b);
    ret = ret.toFixed(2);
    if (cc.test(ret)) {
      ret = ret.replace(zeroReg, '');
    }
    return ret + '%';
  };
})();

export const rq = (url, data, method = 'GET') => {
  return request(urlWithBase(url), {
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: data,
  }).then((res) => {
    const { code, result } = res;
    if (+code !== 0) throw res;
    return result;
  });
};

export const delay = (t = 2000, cb) =>
    new Promise((resolve, reject) => {
      if (typeof cb === 'function') {
        setTimeout(() => cb(resolve, reject), t);
      } else {
        setTimeout(resolve, t);
      }
    });


/**
 *
 * @param {dom} dom
 * @param {object} config
 * @param {number} config.top
 * @param {number} config.left
 */
export const scroll = (dom, config) => {
  if (dom.scroll) {
    dom.scroll({ behavior: 'smooth', ...config });
  } else {
    if (config.top !== undefined) {
      dom.scrollTop = config.top;
    }
    if (config.left !== undefined) {
      dom.scrollLeft = config.left;
    }
  }
};

/**
 * @description obj to query string
 * @param {object} obj
 */
export const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

/**
 * @description 缩略图格式话
 * @param { string } url 图片链接
 * @param { object } options 图片缩放尺寸 { w:width, h: height }
 */
export function formatImg(url, options) {
  if (url && url.endsWith('.gif')) return url;
  else if (options) {
    if (/\?x\-oss\-process/.test(url)) {
      return `${url},image/resize,${options.w ? `w_${options.w},` : ''}${
          options.h ? `h_${options.h},` : ''
          }`;
    } else {
      return `${url}?x-oss-process=image/resize,${options.w ? `w_${options.w},` : ''}${
          options.h ? `h_${options.h},` : ''
          }`;
    }
  }
  return url;
}

/**
 * @description 下载文件
 * @param {*} file 文件对象 格式 { url: xxx, file_name: xxx, ...  }
 */
export function downloadFile(file, successCb, errorCb) {
  //txt等格式
  let xmlHttp = null;
  if (window.ActiveXObject) {
    // IE6, IE5 浏览器执行代码
    xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlHttp = new XMLHttpRequest();
  }
  //2.如果实例化成功，就调用open（）方法：
  if (xmlHttp != null) {
    xmlHttp.open('get', file.url, true);
    xmlHttp.responseType = 'blob';
    xmlHttp.send();
    xmlHttp.onreadystatechange = doResult; //设置回调函数
  }

  function doResult() {
    // 创建隐藏的可下载链接
    var aLink = document.createElement('a');
    aLink.download = file.file_name; //设置a标签的下载名字
    aLink.style.display = 'none';
    if (xmlHttp.readyState === 4) { //4表示执行完成
      if (xmlHttp.status === 200) { //200表示执行成功
        // 字符内容转变成blob地址
        var blob = new Blob([xmlHttp.response]);
        aLink.href = createObjectURL(blob);
        // 触发点击
        document.body.appendChild(aLink);
        aLink.click();
        // 然后移除
        document.body.removeChild(aLink);
        typeof successCb === 'function' && successCb();
      } else {
        typeof errorCb === 'function' && errorCb();
      }
    }
  }
}

export function createObjectURL(object) {
  // return (window.URL || window.webkitURL).createObjectURL(object);
  return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

/**
 * @description 判断能否录制音频
 */
export function adaptDediaDevices() {
  let getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.mediaDevices
  );
  if (!getUserMedia)
    return false;
  else
    return true;
}

/**
 * @description 获取blob长度
 * @param blob
 */
export function getAudioBlobDuration(blob) {
  const tempAudioEl = document.createElement('audio');

  const durationP = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, 200);

    tempAudioEl.addEventListener('loadedmetadata', () => {
      if (tempAudioEl.duration === Infinity) {
        tempAudioEl.currentTime = Number.MAX_SAFE_INTEGER;
        tempAudioEl.ontimeupdate = () => {
          tempAudioEl.ontimeupdate = null;
          resolve(tempAudioEl.duration);
          tempAudioEl.currentTime = 0;
        };
      } else {
        resolve(tempAudioEl.duration);
      }
    });
  });

  tempAudioEl.src = window.URL.createObjectURL(blob);

  return durationP;
}
