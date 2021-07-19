
import http from './httpService';

const apiEndPoint = "/mails";

function mailUrl(id) {
    return `${apiEndPoint}/${id}`;
}
export function getMails() {
    return http.get(apiEndPoint);
}

export function getMail(mailId) {
    return http.get(mailUrl(mailId));
}

export function saveMail(data) {

    return http.post(apiEndPoint, data);

}

export function updateMail(_id, data) {

    return http.put(mailUrl(_id), data);

}


export function deleteMail(mailId) {
    return http.delete(mailUrl(mailId));
}
