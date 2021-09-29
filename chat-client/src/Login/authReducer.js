export const loginAction = (user) => ({
  type: "LOCAL_LOGIN",
  payload: user,
});

export const authLoading = () => ({
  type: "AUTH_LOADING",
});

export const authFail = () => ({
  type: "AUTH_FAIL",
});

export const authPass = (user) => ({
  type: "Auth_PASS",
  payload: user,
});

export default (
  prevState = { loading: false, authenticated: false },
  { type, payload }
) => {
  switch (type) {
    case "LOCAL_LOGIN":
      return { user: payload, authenticated: true, loading: false };
    case "AUTH_LOADING":
      return { user: null, authenticated: false, loading: true };
    case "AUTH_FAIL":
      return { user: null, authenticated: false, loading: false };
    case "Auth_PASS":
      return { user: payload, authenticated: true, loading: false };
    default:
      return prevState;
  }
};
