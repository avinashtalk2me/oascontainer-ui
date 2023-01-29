import { IonText } from "@ionic/react";

export interface ServerErrorProps {
    errorMsg: string;
}


const ServerError: React.FC<ServerErrorProps> = ({ errorMsg }) => {
    return (
        <div className="text-wrapper error" color="danger">
            <IonText className="ion-no-padding">
                {errorMsg}
            </IonText>
        </div>
    )
}

export default ServerError;