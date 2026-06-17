/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Bạn phải đăng nhập để đăng tin.');
    }

    // Get user details from the database including role and balance
    // In Strapi v5, user documents are fetched using the plugin::users-permissions.user UID
    const userDb = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: user.documentId || user.id?.toString(),
      populate: ['role'],
    });

    if (!userDb) {
      return ctx.badRequest('Không tìm thấy tài khoản người dùng.');
    }

    const roleName = userDb.role?.type || userDb.role?.name;
    const isModeratorOrAdmin = roleName === 'moderator' || roleName === 'admin';

    // If regular user, deduct 5,000 VND
    if (!isModeratorOrAdmin) {
      const cost = 5000;
      const currentBalance = userDb.balance !== undefined ? userDb.balance : 0;

      if (currentBalance < cost) {
        return ctx.badRequest('Số dư tài khoản không đủ để đăng tin (Cần tối thiểu 5,000đ). Vui lòng nạp thêm tiền.');
      }

      // Deduct balance
      await strapi.documents('plugin::users-permissions.user').update({
        documentId: userDb.documentId,
        data: {
          balance: currentBalance - cost,
        },
      });
    }

    // Call core create action
    const response = await super.create(ctx);
    return response;
  }
}));

