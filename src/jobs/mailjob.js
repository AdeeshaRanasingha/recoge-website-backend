import cron from 'node-cron';
import { Order } from '../infrastructure/entities/Order.js';
import { sendThankYouEmail } from '../application/emailService.js';

// Run every day at 9:00 AM
const emailJob = cron.schedule('0 9 * * *', async () => {
    console.log('📬 Running Email Job: Checking for recent deliveries...');

    try {
        // Find orders delivered more than 24 hours ago
        // AND haven't received an email yet
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            status: "Delivered",
            thankYouEmailSent: false,
            deliveredAt: { $lt: yesterday } // Delivered before this time yesterday
        });

        if (orders.length === 0) {
            console.log('No emails to send today.');
            return;
        }

        console.log(`Found ${orders.length} customers to email.`);

        // Loop through orders and send emails
        for (const order of orders) {
            if (order.customerEmail) {
                const sent = await sendThankYouEmail(order.customerEmail, order.customerName);
                
                if (sent) {
                    // Update database so we don't send it again
                    order.thankYouEmailSent = true;
                    await order.save();
                }
            }
        }
    } catch (error) {
        console.error("Error in Email Job:", error);
    }
});

export default emailJob;