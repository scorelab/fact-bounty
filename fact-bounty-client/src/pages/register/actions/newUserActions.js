import axios from "axios";
import { GET_ERRORS } from "../../../core/types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      if (res.status === 202) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.message
        });
      } else {
        history.push("/login");
      }
    }) // re-direct to login on successful register
    .catch(err => {
      if (err && err.response) {
        let payload = err.response.data;
        if (typeof payload === "string") {
          payload = { fetch: err.response.data };
        }
        dispatch({
          type: GET_ERRORS,
          payload
        });
      }
    });
};
