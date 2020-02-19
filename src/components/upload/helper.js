import OSS from 'ali-oss';
import isArray from 'lodash/isArray';
import Compressor from 'compressorjs';
import startsWith from 'lodash/startsWith';
import { configService } from '@/services';
import moment from 'moment';
import config from 'config'

const ossConfig = {
  bucket: 'gaia-projectc',
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAIQKUOy7uiognp',
  accessKeySecret: 'mKpwgwAlhqpRkP31WrWT6xR1gfvWmt',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
};

// const BUCKET_DOMAIN_URL = `https://${ossConfig.bucket}.${ossConfig.endpoint}`;

const APPLICATION_DIR = 'img';

let CLIENT = null;

export function getClient(config) {
  if (config) {
    CLIENT = new OSS(config);
  } else {
    CLIENT = new OSS(ossConfig);
  }
  return CLIENT;
}

export function getFilePath(config, fileName) {
  return `https://${config.bucketName}.${config.region}.aliyuncs.com/${APPLICATION_DIR}/${fileName}`;
}

export function getRandom() {
  return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

export function getFileName(file) {
  return `${moment().format('YYYY/MM/DD')}/${getRandom()}${getExtName(file)}`;
}

export function getExtName(file) {
  let name = file.name || '';
  let fileNameList = name.split('.');
  return fileNameList.length > 0 ? `.${fileNameList[fileNameList.length - 1]}` : '';
}

export function getOriginFileObject(antUploader) {
  return antUploader.file;
}

export async function uploadWrapper(antUploader, fn) {
  try {
    const url = await fn();
    antUploader.onSuccess({ url }, antUploader);
  } catch (err) {
    antUploader.onError(err, {}, antUploader);
  }
}

export async function upload(antUploader) {
  await uploadWrapper(antUploader, async () => {
    const file = getOriginFileObject(antUploader);
    switch (config.UPLOADMODE) {
      case 'local':
        return uploadFileLocal(file, {}, antUploader);
        break;
      case 'ali-oss':
        return uploadFile(file, {}, antUploader);
      default:
        return uploadFileLocal(file, {}, antUploader);
        break;
    }
  });
}

/**
 * @description 上传方法
 * @param {File} file
 * @param {object} options
 * @param {number} options.quality 默认 0.8, 只支持图片压缩, 非图片类型的文件无用
 * @param {function} options.progress 上传进度回调方法, 第一个参数为进度 (进度值 0 - 1)
 */
export async function uploadFile(file, options = {}, antUploader = {}) {
  const _fileName = getFileName(file);
  const objectName = `/${APPLICATION_DIR}/${_fileName}`;
  let config = {};
  const { quality = 0.8, ...rest } = options;

  const upload = async (objName, f, opts) => {
    // 动态获取oss配置
    config = await configService.getUploadToken();
    const client = getClient({
      bucket: config.bucketName,
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      stsToken: config.securityToken,
      secure: true,
    });
    return client.multipartUpload(objName, f, {
      progress: (p) => antUploader.onProgress({ percent: p * 100 }, f),
      mime: f.type,
      ...opts,
    });
  };

  if (startsWith(file, 'image')) {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality,
        async success(result) {
          try {
            await upload(objectName, result, rest);
            resolve(getFilePath(config, _fileName));
          } catch (err) {
            reject(err);
          }
        },
        error(err) {
          console.log(err.message);
          reject(err);
        },
      });
    });
  } else {
    await upload(objectName, file, rest);
    return getFilePath(config, _fileName);
  }
}

// 上传音频
export async function uploadAudioWrapper(antUploader) {
  await uploadWrapper(antUploader, async () => {
    const file = getOriginFileObject(antUploader);
    return uploadAudio(file, {}, antUploader)
  });
}

export async function uploadAudio(file, options = {}, antUploader) {
  const { ...rest } = options;
  const { data } = antUploader;
  const upload = (f, opts) => {
    return configService.uploadAudio(getFormData({ ...data, file: f, type:file.type.substring(file.type.indexOf('/')+1)}));
  };
  return await upload(file, rest);
}

const getFormData = (obj) => {
  return Object.keys(obj).reduce((pre, next) => {
    pre.append(next, obj[next]);
    return pre;
  }, new FormData());
};
const getFilePathLocal = (url) => url;

export async function uploadFileLocal(file, options = {}, antUploader = {}) {
  const { quality = 0.8, ...rest } = options;

  const { data } = antUploader;
  const upload = (f, opts) => {
    return configService.uploadLocal(getFormData({ ...data, file: f }));
  };

  if (startsWith(file, 'image')) {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality,
        async success(result) {
          try {
            const _fileName = await upload(result, rest);
            resolve(getFilePathLocal(_fileName));
          } catch (err) {
            reject(err);
          }
        },
        error(err) {
          console.log(err.message);
          reject(err);
        },
      });
    });
  } else {
    const _fileName = await upload(file, rest);
    return getFilePathLocal(_fileName);
  }
}

function getType(url) {
  if (/(.png|.jpg|.jpeg|.gif|.bmp)$/.test(url)) {
    let type = url.match(/(png|jpg|jpeg|gif|bmp)$/i);
    return 'image/' + type[0];
  }
}

export function parseFileList(fileList) {
  let _fileList = fileList;
  if (fileList && typeof fileList === 'string') {
    _fileList = [fileList];
  }

  return isArray(_fileList) && _fileList.length
    ? _fileList.map((e) => {
        const item = typeof e === 'object' ? e : { name: e, url: e };
        return {
          uid: getRandom(),
          status: 'done',
          type: getType(e),
          response: {
            url: item.url,
          },
          ...item,
        };
      })
    : [];
}
