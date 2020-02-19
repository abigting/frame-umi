import { extend } from 'umi-request';
import { message } from 'antd';
import { getUserInfo, packRespnseData } from './common';
import { urlWithBase } from '@/utils/common';
import config from 'config';
import startsWith from 'lodash/startsWith';

const request = extend({});

request.interceptors.request.use((url, options) => {
  const { headers, ...rest } = options;
  return {
    options: {
      ...rest,
      headers: {
        token: getUserInfo().token,
        ...headers,
      },
    },
  };
});

request.interceptors.response.use(async (response) => {
  try {
    const data = await response.clone().json();
    if (data.code !== '0') {
      // 防止连续弹出多个message
      message.destroy();
      message.warning(data.errorMsg);
      if (data.code === '401') {
        // router.push('/login');
        window.location.href = '/login';
      }
    } else {
    }
  } catch (e) {

  }
  return response;
});

/**
 * @description 格式化接口返回结果
 * @param  {...any} args
 */
export const request2 = (url, ...args) => {
  if (!startsWith(url, config.BASEURL) && !startsWith('http')) {
    url = urlWithBase(url);
  }
  return request(url, ...args).then((res) => {
    const { code, result } = packRespnseData(res);
    if (code === '0') {
      return result;
    }
  });
};

export default request;
