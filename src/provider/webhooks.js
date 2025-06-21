import prism from '../config/prisma.db.js';

export const handleWebhook = async (Message, id) => {
  const webhook = await prism.webhook.findMany({
    where: { sessionId: id },
  });
  if (!webhook || webhook.length === 0) return;
  for (const wh of webhook) {
    try {
      const response = await fetch(wh.url, {
        method: wh.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: Message,
          payload: wh.payload || {},
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        logs({ status: 'error', error: response.statusText }, wh.id);
      }
      await logs({ status: 'success' }, wh.id);
    } catch (error) {
      await logs({ status: 'error', error: error.message }, wh.id);
    }
  }
};

const logs = async (payload, id) => {
  await prism.logWebhook.create({
    data: {
      idWebhook: id,
      DateTriger: new Date(),
      Status: payload.status || 'success',
      payload: payload.error || 'No error',
    },
  });
};
