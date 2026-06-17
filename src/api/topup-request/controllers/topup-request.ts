import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::topup-request.topup-request', ({ strapi }) => ({
  
  // 1. Intercept Next.js frontend submissions (Both Public and Authenticated roles)
  async create(ctx) {
    const currentUser = ctx.state.user;
    
    if (!currentUser) {
      return ctx.unauthorized('Bạn phải đăng nhập để thực hiện nạp tiền.');
    }

    // Capture the request payload
    const body = ctx.request.body as any;
    if (body && body.data) {
      // Force the initial status to 'pending' so users can't approve their own money
      body.data.requestStatus = 'pending';
      
      // Remove it from the validation payload to prevent the "Invalid users_permissions_user" error
      if (body.data.users_permissions_user) {
        delete body.data.users_permissions_user;
      }
    }

    // Let Strapi validate and create the basic ticket document row safely
    const response = await super.create(ctx);

    // After validation passes, safely link the user via the internal document service
    if (response && response.data) {
      console.log(`🔒 Securely linking ticket ${response.data.documentId} to user: ${currentUser.username}`);
      
      await strapi.documents('api::topup-request.topup-request').update({
        documentId: response.data.documentId,
        data: {
          users_permissions_user: currentUser.documentId
        } as any
      });
    }

    return response;
  },

  // 2. Keep your friend's custom Postman action intact
  async adjustBalance(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Bạn phải đăng nhập để thực hiện.');

    const { userDocumentId, amount } = ctx.request.body as any;
    if (!userDocumentId || amount === undefined) return ctx.badRequest('Missing variables.');

    const targetUser: any = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userDocumentId,
    });

    if (!targetUser) return ctx.notFound('User not found.');

    const newBalance = (targetUser.balance || 0) + parseInt(amount, 10);

    const updatedUser = await strapi.documents('plugin::users-permissions.user').update({
      documentId: userDocumentId,
      data: { balance: newBalance },
    });

    return { success: true, balance: updatedUser.balance };
  }
}));