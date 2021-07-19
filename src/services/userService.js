
import http from './httpService';
const apiEndPoint = "/auth/register";

export function register(user) {
    return http.post(apiEndPoint, user);
}

function userUrl(id) {
    return `/auth/${id}`;
}

export function getUser(id) {
    return http.get(userUrl(id));
}

export function getLoggedUser(){
    return http.get('/auth/me');
}

export function getAllUsers() {
    return http.get("/auth");
}

export function deleteUser(id) {
    return http.delete(userUrl(id));
}

export function updateUser(id, user) {
    return http.put(userUrl(id), user);
}
