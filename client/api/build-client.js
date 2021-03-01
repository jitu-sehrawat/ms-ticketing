import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on server.

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // we on browser.
    return axios.create({
      baseURL: '/'
    });
  }
}