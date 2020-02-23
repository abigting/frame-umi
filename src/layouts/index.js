import HeaderContent from './header';
import FooterContent from './footer';
import SiderContent from './sider';
import styles from './index.less';
import {Layout} from 'antd';

const { Header, Footer, Sider, Content } = Layout;
function BasicLayout(props) {
  return (
      <Layout className={styles.wrapper}>
        <Sider>
          <SiderContent/>
        </Sider>
        <Layout>
          <HeaderContent/>
          <Content>{props.children}</Content>
        </Layout>
      </Layout>
  );
}

export default BasicLayout;
