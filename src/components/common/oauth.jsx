import React from "react";

const Oauth = () => {
  return (
    <>
      <hr />
      <div className="col-12 d-flex justify-content-center">OR log in with</div>
      <div className="col-12 d-flex justify-content-center">
        <div className="btn btn-danger m-2" style={{ color: "white" }}>
          <a
            href={process.env.REACT_APP_GOOGLE_OAUTH_URL}
            style={{ textDecoration: "none", color: "white" }}
          >
            <i className="fa fa-2x fa-google" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default Oauth;
