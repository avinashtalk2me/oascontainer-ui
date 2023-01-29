import { ErrorMessage } from "@hookform/error-message";
import { IonText } from "@ionic/react";

export interface ErrorProps {
    name: string;
    errors: any;
}

const Error: React.FC<ErrorProps> = ({ name, errors }) => {
    return (<>
        {errors && errors[name] && (
            <IonText color="danger" className="ion-no-padding">
                <small>
                    <span role="alert" id={`${name}Error`}>
                        {errors[name].message}
                    </span>
                </small>
            </IonText>
        )}
    </>
        // <ErrorMessage
        //     errors={errors}
        //     name={name}
        //     as={
        //         <div style={{ color: 'red', fontSize: '12px', marginTop:'5px' }} />
        //     }
        // />
    )
}

export default Error;