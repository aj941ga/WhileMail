import axios from 'axios';
import logger from './logService';
import { toast } from 'react-toastify';

axios.defaults.baseURL = process.env.REACT_APP_MAIL_API;

axios.interceptors.response.use(null, error => {

    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {

        logger.log(error);
        toast.error("An unexpected error occurred");
    }
    return Promise.reject(error);
});

async function setJwt(jwt) {

    console.log(jwt);
    axios.defaults.headers.common['Authorization'] = jwt;
}
function getJwtFromStorage() {
    for (let a in localStorage) {
        if (a.includes("idToken")) {
            setJwt(localStorage[a]);
        }
    }
}
getJwtFromStorage();

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    head: axios.head,
    setJwt
}