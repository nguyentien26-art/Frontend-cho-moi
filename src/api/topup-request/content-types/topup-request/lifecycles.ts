export default {
  async beforeUpdate(event) {
    const { params } = event;
    const incomingData = params.data;
    
    // Grab whatever identifier Strapi is throwing at us
    const targetId = params.where?.documentId || params.where?.id;

    console.log("=== 🔄 DATABASE LIFECYCLE TRIGGERED ===");
    console.log(`🔍 Checking Ticket Identifier: ${targetId} (Type: ${typeof targetId})`);

    if (!incomingData || !incomingData.requestStatus) {
      console.log("ℹ️ No status change detected. Skipping wallet math.");
      return;
    }

    const incomingStatus = incomingData.requestStatus;
    console.log(`📥 Incoming Status: "${incomingStatus}"`);

    try {
      let existingRequest: any = null;

      // Strapi v5 Smart Identifier Routing
      if (typeof targetId === 'string' && targetId.length > 10) {
        // Looks like a real documentId string
        existingRequest = await strapi.documents('api::topup-request.topup-request').findOne({
          documentId: targetId,
          populate: ['users_permissions_user'] as any
        });
      } else {
        // It's an integer ID (like 90). Find it using the database layer directly
        console.log(`⚙️ Integer ID detected. Falling back to DB layer query...`);
        const records = await strapi.db.query('api::topup-request.topup-request').findMany({
          where: { id: targetId },
          populate: ['users_permissions_user']
        });
        existingRequest = records?.[0];
      }

      if (!existingRequest) {
        console.log("❌ Ticket completely missing from database lookup.");
        return;
      }

      const currentStatus = existingRequest.requestStatus;
      console.log(`📊 Current DB Status: "${currentStatus}" -> New Status: "${incomingStatus}"`);

      if (currentStatus === 'pending' && incomingStatus === 'approved') {
        // Find the linked user. Handle both Document Service layout and DB query layout structures
        const linkedUser = existingRequest.users_permissions_user;

        if (!linkedUser) {
          console.log("❌ Aborted: This ticket is not linked to any user inside 'users_permissions_user'!");
          return;
        }

        // Target the correct field identifier for the user account profile record lookup
        const userDocId = linkedUser.documentId || linkedUser.id?.toString();
        console.log(`👤 Found owner: ${linkedUser.username} (User Identifier: ${userDocId})`);

        const userProfile: any = await strapi.documents('plugin::users-permissions.user').findOne({
          documentId: userDocId
        });

        const amount = Number(existingRequest.amount) || 0;
        const currentBalance = Number(userProfile?.balance) || 0;
        const newBalance = currentBalance + amount;

        console.log(`💰 Adding ${amount}đ to ${userProfile.username}. New Total Balance: ${newBalance}đ`);

        await strapi.documents('plugin::users-permissions.user').update({
          documentId: userDocId,
          data: { balance: newBalance },
        });

        console.log("✅ Balance credited smoothly via Lifecycle Framework Hook execution!");
      } else {
        console.log("ℹ️ Conditions not met to add balance.");
      }
    } catch (err) {
      console.error("❌ Lifecycle System Error:", err);
    }
  }
};