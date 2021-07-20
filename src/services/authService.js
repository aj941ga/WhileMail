import jwt_decode from "jwt-decode";

const getCurrentUserFromStorage = () => {
    // check token for expiry
    for (let key in localStorage) {
        if (key.includes("idToken")) {
            let data = jwt_decode(localStorage[key]);
            if (Date.now() >= data.exp * 1000) {
                return null;
            }
            return data;
        }
    }
    return null;
};

export default { getCurrentUserFromStorage };