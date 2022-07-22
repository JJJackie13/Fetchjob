import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonCard,
  IonButton,
  IonThumbnail, IonBadge, useIonToast
} from '@ionic/react';
import { chatboxEllipses, people, receipt, settingsSharp, ellipsisVertical, barChart, business, arrowUndoOutline, notifications, businessOutline, peopleOutline, receiptOutline, alertOutline } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserStatus, logoutThunk } from '../redux/auth';
import { IRootState } from '../redux/state';
import './Menu.css';
import { useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import { settings } from 'cluster';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// __________________________________________________________________
// __________________________________________________________________
// __________________________________________________________________
// __________________________________________________________________





// type Props = {
//   sidebarOpen: boolean;
//   closeSidebar: () => void;
// };

interface AppPage {
  url: string;
  icon: string;
  title: string;
}


const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/Dashboard',
    icon: barChart,
  },
  {
    title: 'Companyboard',
    url: '/Company',
    icon: business,
  },
  {
    title: 'Userboard',
    url: '/Users',
    icon: people,
  },
  {
    title: 'Postboard',
    url: '/Posts',
    icon: receipt,
  },
  {
    title: 'Reportboard',
    url: '/Report',
    icon: chatboxEllipses,
  },
  {
    title: 'Account Management',
    url: '/adminInfo',
    icon: settingsSharp,
  }

  // {
  //   title: 'Post Report',
  //   url: '/ReportPost',
  //   icon: alertOutline,
  // },
  // {
  //   title: 'AlertExample',
  //   url: '/AlertExample',
  //   icon: ellipsisVertical,
  // }
];



const Menu: React.FC<{ notify: () => void }> = ({ notify }) => {
  // console.log("Menu")
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const username = useSelector((state: IRootState) => state.auth.user?.name)
  const useremail = useSelector((state: IRootState) => state.auth.user?.email)
  const haslogin = useSelector((state: IRootState) => !!state.auth.user)

  useEffect(() => {
    console.log("checkUserStatus")
    dispatch(checkUserStatus(history));
  }, []);

  const logout = () => {
    dispatch(logoutThunk());
    history.push('/login');
  };

  return (
    <IonMenu contentId="main" type="overlay" hidden={!haslogin}>
      <IonContent>
        <IonList id="inbox-list">
          <a href="/">
            <img height="67px" width="200px" src='/assets/icon/facejobmenu.png' />
          </a>
          {/* <IonIcon slot="start" icon={duplicate} onClick={() => closeSidebar()} /> */}

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonCard className="adminCard">
          <IonList id="labels-list" className="adminList">
            <IonItem>
              <IonThumbnail slot="start">
                <IonAvatar>
                  <a href="/adminInfo">
                    <img src='/assets/icon/admin.png' />
                  </a>
                </IonAvatar>
              </IonThumbnail>
              &emsp;
              <IonLabel className="adminName"><IonBadge color="primary">Admin:</IonBadge> {username}</IonLabel>
            </IonItem>
            <IonListHeader lines="inset">
              &emsp;&emsp; <IonLabel>{useremail}</IonLabel>
            </IonListHeader>
            <div >
              <IonButton color="danger" margin-bottom="20px" onClick={logout} href="/login" className="adminButton">
                <IonIcon icon={arrowUndoOutline} slot="start" />
                Logout
              </IonButton>
            </div>
          </IonList>
        </IonCard>
        {/* <IonItem>
          <IonIcon slot="start" icon={notifications} />
          <button onClick={notify}>Notify!</button>
        </IonItem> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;




















// _________________________________________________________________________________________
// _________________________________________________________________________________________
// _________________________________________________________________________________________
// _________________________________________________________________________________________
// _________________________________________________________________________________________


// interface AppPage {
//   url: string;
//   icon: string;
//   title: string;
// }

// const appPages: AppPage[] = [
//   {
//     title: 'Dashboard',
//     url: '/Dashboard',
//     icon: barChart,
//   },
//   {
//     title: 'Company',
//     url: '/Company',
//     icon: business,
//   },
//   {
//     title: 'Users',
//     url: '/Users',
//     icon: people,
//   },
//   {
//     title: 'Posts',
//     url: '/Posts',
//     icon: receipt,
//   },
//   {
//     title: 'Admin',
//     url: '/Admin',
//     icon: ellipsisVertical,
//   },
//   {
//     title: 'Setting',
//     url: '/Setting',
//     icon: settings,
//   }

// ];



// const Menu: React.FC = () => {
//   const location = useLocation();

//   return (
//     <IonMenu contentId="main" type="overlay">
//       <IonContent>
//         <IonList id="inbox-list">
//           <img height="67px" width="200px" src='/assets/icon/facejobmenu.png' />

//           {appPages.map((appPage, index) => {
//             return (
//               <IonMenuToggle key={index} autoHide={false}>
//                 <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
//                   <IonIcon slot="start" icon={appPage.icon} />
//                   <IonLabel>{appPage.title}</IonLabel>
//                 </IonItem>
//               </IonMenuToggle>
//             );
//           })}

//         </IonList>




//         <IonList id="labels-list">
//           <IonItem>
//             <IonThumbnail slot="start">
//               <IonAvatar>
//                 <img src='/assets/icon/admin.png' />
//               </IonAvatar>
//             </IonThumbnail>
//             &emsp;<IonLabel>Admin Name</IonLabel>
//           </IonItem>
//           <IonListHeader lines="inset">
//             &emsp;&emsp; <IonLabel>admin@facejob.com</IonLabel>
//           </IonListHeader>
//           <div >
//             <IonButton color="danger" margin-bottom="20px">
//               <IonIcon icon={arrowUndoOutline} slot="start" />Logout</IonButton></div>
//         </IonList>
//       </IonContent>
//     </IonMenu>
//   );
// };

// export default Menu;
