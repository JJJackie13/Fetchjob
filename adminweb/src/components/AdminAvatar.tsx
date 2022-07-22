import { IonAvatar } from '@ionic/react'
// import './UserAvatar.css'
// import './AdminAvatar.css'

const AdminAvatar = (props: { icon: string; name: string }) => {
    return (
        <div className="admin-avatar-container">
            <IonAvatar className="user-avatar">
                <img src={props.icon}></img>
            </IonAvatar>
            <p>{props.name}</p>
        </div>
    )
}
export default AdminAvatar