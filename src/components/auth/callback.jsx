import React, { useEffect } from "react";
import httpService from "../../services/httpService";
import queryString from "query-string";

export default function OauthCallBack(props) {

  useEffect(() => {
    async function getCurrentHeaders() {
      const params = queryString.parse(props.location.search);
      // loginWithJwt(params.token);
      document.location = "/";
    }
    getCurrentHeaders();
  }, []);

  return <div></div>;
}
