/**
 * @description 上传组件
 */
import React from 'react';
import { Upload, message, Modal } from 'antd';
import { upload, parseFileList } from './helper';
import get from 'lodash/get';

/**
 *
 * @param {*} file
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * @description 上传组件
 * @returns fileList：文件列表， file： 文件， urlList： 文件url列表
 * @param {object} fileList 默认值
 * @param {number} maxSize 最大上传文件大小
 * @param {number} maxNum 最大上传数量
 */

export class Uploader extends React.Component {
  static defaultProps = {
    fileList: [],
    maxSize: 2 * 1024,
  };

  // static getDerivedStateFromProps(props, state) {
  //   if (props.fileList) {
  //     return {
  //       fileList: props.fileList,
  //     };
  //   }
  // }

  constructor(props) {
    super(props);
    this.state = {
      fileList: parseFileList(this.props.fileList),
      previewVisible: false,
      previewImage: '',
      saveLoading: false
    };
  }

  beforeUpload = (file, fileList) => {
    const { maxSize } = this.props;
    const kb = file.size / 1024;
    if (kb > maxSize) {
      message.warn(`文件最大不能超过${maxSize / 1024}M`);
      return false;
    }
    return true;
  };

  onChange = ({ file, fileList }) => {
    const { setLoading } = this.props;
    switch (file.status) {
      case 'uploading':
        if (setLoading) setLoading(true);
        return this.setState({ fileList, saveLoading: true });
      case 'done':
        if (setLoading) setLoading(false);
        return this.setState({ fileList, saveLoading: false }, () => {
          this.props.onChange &&
            this.props.onChange({
              file,
              fileList,
              urlList: this.getUrlList(fileList),
              ...(file.response || {}),
            });
        });
      default:
        if (setLoading) setLoading(false);
        return this.setState({
          fileList: this.filterFileByUid(file),
          saveLoading: false
        });
    }
  };

  filterFileByUid = file => {
    return this.state.fileList.filter(e => e.uid !== file.uid);
  };

  getUrlList = fileList => {
    const g = e => get(e, 'response.url');
    return fileList.filter(g).map(g);
  };

  handlePreview = async file => {
    if (/image\/\w+/.test(file.type)) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  onRemove = (file) => {
    this.setState(
      {
        fileList: this.filterFileByUid(file),
      },
      () => {
        if (this.props.onRemove) {
          this.props.onRemove(file);
        } else {
          const { fileList } = this.state;
          this.props.onChange &&
            this.props.onChange({
              fileList,
              urlList: this.getUrlList(fileList),
            });
        }
      },
    );
  };

  render() {
    const { children, beforeUpload, maxNum, ...rest } = this.props;
    const { previewVisible, previewImage, saveLoading, fileList } = this.state;
    return (
      <>
        <Upload
          {...rest}
          customRequest={upload}
          fileList={fileList}
          beforeUpload={beforeUpload || this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.onChange}
          onRemove={this.onRemove}
        >
          {/*{*/}
          {/*  saveLoading || fileList.length >= maxNum*/}
          {/*      ? null*/}
          {/*      : children*/}
          {/*}*/}
          {
            children
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

/**
 * @description 上传组件
 * @returns url: 返回单个url
 */
export class UploadToUrl extends React.Component {
  handleChange = ({ url }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(url)
    }
  }
  render() {
    const { children, value } = this.props;
    return (
      <Uploader
        {...this.props}
        fileList={value}
        onChange={this.handleChange}
      >
        {children}
      </Uploader>
    )
  }
}

/**
 * @description 上传组件
 * @returns urlList: 返回url列表
 */
export class UploadToUrlList extends UploadToUrl {
  handleChange = ({ urlList }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(urlList)
    }
  }
}
