import {notification} from "antd";

export const pushNotification = (mesage, description, type) => {
    notification[type]({
        message: `${mesage}`,
        description:`${description}`,
        placement: 'bottomRight'
    });
};