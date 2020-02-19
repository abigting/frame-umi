import Header from './header';
import Footer from './footer';
import styles from './index.less';


function BasicLayout(props) {
  return (
    <div >
      <Header/>
      {props.children}
      <Footer/>
    </div>
  );
}

export default BasicLayout;
