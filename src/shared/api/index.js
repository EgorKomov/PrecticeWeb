import api from './config';
import { setupAuthInterceptor, setupUnauthorizedInterceptor } from './interceptors';

setupAuthInterceptor(api);
setupUnauthorizedInterceptor(api);

export default api;