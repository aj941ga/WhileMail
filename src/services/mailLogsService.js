
import http from './httpService';

const apiEndPoint = "/history";

function mailUrl(id) {
    return `${apiEndPoint}/${id}`;
}
export function getMailLogs() {
    return http.get(apiEndPoint);
}

export function getMailLog(mailId) {
    return http.get(mailUrl(mailId));
}

export function deleteMailLog(mailId) {
    return http.delete(mailUrl(mailId));
}
