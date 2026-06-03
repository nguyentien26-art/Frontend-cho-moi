export default {
  routes: [
    {
      method: 'POST',
      path: '/topup-requests/adjust-balance',
      handler: 'topup-request.adjustBalance',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
