import { Icon } from 'antd';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1171527_mf86yrsaoee.js',
});

export default function(props) {
  return <IconFont {...props} />;
}
