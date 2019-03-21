import axios from "axios";
import setAuthToken from "../../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "../../../core/types";

export const OauthUser = creds => dispatch => {
  axios
    .post("/api/users/oauth", JSON.stringify(creds))
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      setAuthToken(token);

      const decoded = jwt_decode(token);

      dispatch({
        type: SET_CURRENT_USER,
        payload: decoded
      });
    })
    .catch(err => {
      let payload = err.response.data;
      if (typeof payload === "string") {
        payload = { fetch: err.response.data };
      }
      return dispatch({
        type: GET_ERRORS,
        payload
      });
    });
};
