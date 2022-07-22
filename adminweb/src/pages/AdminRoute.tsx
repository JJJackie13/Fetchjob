import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router';
import { IRootState } from '../redux/state';

function AdminRoute(props: RouteProps) {
    const isAdmin = useSelector((state: IRootState) => state.auth.user?.is_admin);
    const isLoading = useSelector((state: IRootState) => state.auth.isLoading);

    const { component, children, ...restProps } = props

    const Content = component ? component as any : children

    return <Route {...restProps}>
        {
            isLoading ? 'loading...' :
                !isAdmin ?
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    /> :
                    <Content />
        }
    </Route>
}

export default AdminRoute;
