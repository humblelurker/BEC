import instance from "./axios";


export const registerRequest = (user) => instance.post(`/registro`, user);

export const loginRequest = user => instance.post(`/login`, user);

export const verifyTokenRequest = () => instance.get('/verify');

