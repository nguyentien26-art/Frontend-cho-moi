/**
 * topup-request controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::topup-request.topup-request', ({ strapi }) => ({
  // Override update action to auto-credit user balance upon approval
  async update(ctx) {
    const { id } = ctx.params; // documentId is passed as id in the params
    const { data } = ctx.request.body;

    if (data && data.requestStatus) {
      // Find the existing top-up request with user info populated
      const existingRequest = await strapi.documents('api::topup-request.topup-request').findOne({
        documentId: id,
        populate: ['users_permissions_user'],
      });

      if (!existingRequest) {
        return ctx.notFound('Không tìm thấy yêu cầu nạp tiền.');
      }

      // Check if transitioning from pending to approved
      if (data.requestStatus === 'approved' && existingRequest.requestStatus === 'pending') {
        const user = existingRequest.users_permissions_user;
        if (!user) {
          return ctx.badRequest('Yêu cầu nạp tiền không liên kết với người dùng nào.');
        }

        const amount = existingRequest.amount || 0;
        const currentBalance = user.balance !== undefined ? user.balance : 0;

        // Update the user's balance in the database
        await strapi.documents('plugin::users-permissions.user').update({
          documentId: user.documentId,
          data: {
            balance: currentBalance + amount,
          },
        });
      }
    }

    // Run core update action
    const response = await super.update(ctx);
    return response;
  },

  // Custom action to directly adjust user's balance (for Moderators / Admins)
  async adjustBalance(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Bạn phải đăng nhập để thực hiện.');
    }

    // Verify requester role
    const requesterDb = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: user.documentId || user.id?.toString(),
      populate: ['role'],
    });

    if (!requesterDb) {
      return ctx.badRequest('Không tìm thấy tài khoản người yêu cầu.');
    }

    const roleName = requesterDb.role?.type || requesterDb.role?.name;
    if (roleName !== 'moderator' && roleName !== 'admin') {
      return ctx.forbidden('Chỉ có kiểm duyệt viên hoặc quản trị viên mới có quyền cộng/trừ tiền trực tiếp.');
    }

    const { userDocumentId, amount } = ctx.request.body;
    if (!userDocumentId || amount === undefined) {
      return ctx.badRequest('Thiếu thông tin userDocumentId hoặc amount.');
    }

    // Get target user
    const targetUser = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userDocumentId,
    });

    if (!targetUser) {
      return ctx.notFound('Không tìm thấy tài khoản người dùng cần cộng/trừ tiền.');
    }

    const adjustAmount = parseInt(amount, 10);
    const newBalance = (targetUser.balance !== undefined ? targetUser.balance : 0) + adjustAmount;

    if (newBalance < 0) {
      return ctx.badRequest('Số dư tài khoản sau khi trừ không thể nhỏ hơn 0đ.');
    }

    // Update target user balance
    const updatedUser = await strapi.documents('plugin::users-permissions.user').update({
      documentId: userDocumentId,
      data: {
        balance: newBalance,
      },
    });

    return {
      success: true,
      balance: updatedUser.balance,
      user: {
        documentId: updatedUser.documentId,
        username: updatedUser.username,
        email: updatedUser.email,
      }
    };
  }
}));

