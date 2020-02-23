import {Menu, Icon, Avatar} from 'antd';
import styles from './sider.less';
import {connect} from 'dva';

const {SubMenu} = Menu;

function Sider({routers}) {
  return (
      <div className={styles.siderWrapper}>
        <div className={styles.userInfo}>
          <Avatar icon="user"/>
          <span className={styles.name}>管理员</span>

        </div>
        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
        >
          {
            routers.map(s =>
                s.children ?
                    <SubMenu key="sub1" title={<span><Icon type="mail"/><span>{s.name}</span></span>}
                    >
                      {
                        s.children.map(child=>
                            <Menu.Item key={child.path}>{child.name}</Menu.Item>
                        )
                      }
                    </SubMenu> : <Menu.Item key={s.path}>
                      <Icon type="pie-chart"/>
                      <span>{s.name}</span>
                    </Menu.Item>
            )
          }
        </Menu>
      </div>
  )
}

const mapStateToProps = ({layout}) => {
  return {
    routers: layout.routers,
  };
};

export default connect(mapStateToProps)(Sider);
