import React, {
  useMemo,
  useState,
  useEffect
} from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, useIonRouter, UseIonRouterResult } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './redux/store';
import NoMatch from './pages/NotMatch';
import LoginPage from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { CompanyPage } from './pages/ListCompanyPage';
import { UsersPage } from './pages/ListUsersPage';
import { PostPage } from './pages/ListPostPage';
import { ReportPage } from './pages/ListReportPage';
import { CompanyInfo } from './pages/InfoCompany';
import { UserInfo } from './pages/InfoUser';
import { InfoPost } from './pages/InfoPost';
import { ReportInfo } from './pages/InfoReport';
import { UsersPostList } from './pages/PostUsersList';
import { CompanyPostList } from './pages/PostListCompany';
import { PostLikesList } from './pages/PostLikesList';
import { PostCommentList } from './pages/PostCommentList';
import { ReportPostList } from './pages/ReportPostList';


import { Dashboard } from './pages/Dashboard';
import { AlertExample } from './pages/Header';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserStatus } from './redux/auth';
import { IRootState } from './redux/state';
import AdminRoute from './pages/AdminRoute';
import { io, Socket } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





// import { AdminLoginPage } from './pages/AdminLoginPage';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { notify } from './components/Toast';

const { REACT_APP_API_SERVER } = process.env;

const socket = io(`${REACT_APP_API_SERVER}/admin`, {
  autoConnect: false,
  // transports: ['websocket'],
  // upgrade: false,
})




const NoticeContainer = () => {
  const router = useIonRouter()

  const isAdmin = useSelector((state: IRootState) => state.auth.user?.is_admin);

  useEffect(() => {
    if (isAdmin) {
      socket.connect()

      socket.on("report:post", (reportId) => {
        notify("Received a new Post Report " + reportId, () => router.push('/ReportInfo/post/' + reportId))
      })
      socket.on("report:user", (reportId) => {
        notify("Received a new User Report " + reportId, () => router.push('/ReportInfo/user/' + reportId))
      })
      socket.on("report:company", (reportId) => {
        notify("Received a new Company Report " + reportId, () => router.push('/ReportInfo/company/' + reportId))
      })

    } else {
      socket.disconnect()
    }

  }, [isAdmin])



  return <>
    <Menu notify={() => notify("WOW", () => router.push('/Report'))} />
  </>
}

const App: React.FC = () => {

  const isAdmin = useSelector((state: IRootState) => state.auth.user?.is_admin);
  // if (REACT_APP_API_SERVER && isAdmin) {
  //   socket = io(`${REACT_APP_API_SERVER}`,{
  //     auth:{
  //       isAdmin: true
  //     }
  //   })
  // }

  return (
    <IonApp>
      <ToastContainer />
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <NoticeContainer />
          <IonRouterOutlet id="main" className="main-div">
            <Route path="/" exact={true}>
              <Redirect to={`${!isAdmin ? "/Dashboard" : "/login"}`} />
            </Route>

            <Route path="/login" exact={true}><LoginPage /></Route>
            <Route component={NoMatch} />
            <AdminRoute path="/Dashboard" exact={true} component={Dashboard} />
            <AdminRoute path="/Company" exact={true} component={CompanyPage} />
            <AdminRoute path="/Users" exact={true} component={UsersPage} />
            <AdminRoute path="/Posts" exact={true} component={PostPage} />

            <AdminRoute path="/Report" exact component={ReportPage} />
            <AdminRoute path="/AlertExample" exact component={AlertExample} />
            <AdminRoute path="/adminInfo" exact={true} component={AdminPage} />


            <AdminRoute path="/companyInfo/:id" component={CompanyInfo} />
            <AdminRoute exact path="/UserInfo/:id" component={UserInfo} />
            <AdminRoute exact path="/InfoPost/:id" component={InfoPost} />
            <AdminRoute exact path="/ReportInfo/:report_table/:report_id" component={ReportInfo} />
            <AdminRoute path="/UsersPostList/:id" component={UsersPostList} />
            <AdminRoute path="/CompanyPostList/:id" component={CompanyPostList} />
            <AdminRoute path="/PostLikesList/:id" component={PostLikesList} />
            <AdminRoute path="/PostCommentList/:id" component={PostCommentList} />

            <AdminRoute path="/ReportPostList/:id" component={ReportPostList} />


            <Route path="/page/:name" exact={true}><Page /></Route>

          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
