import { IonText } from "@ionic/react";

const NoItem: React.FC = () => {
    return (
        <div className="text-wrapper noitem">
            <IonText className="ion-no-padding">
                No items found. Add a new item.
            </IonText>
        </div>
    )
}

export default NoItem;