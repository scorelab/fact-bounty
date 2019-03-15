import { UPDATE_ERRORS } from "../../core/types";

export const updateError = payload => dispatch =>
  dispatch({ type: UPDATE_ERRORS, payload });
