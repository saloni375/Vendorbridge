export async function createActivityLog(client, { actorId, module, action, referenceId }) {
  await client.query(
    `insert into activity_logs (user_id, entity_type, action, entity_id)
     values ($1, $2, $3, $4)`,
    [actorId || null, module, action, referenceId || null]
  );
}

export async function createNotification(client, { userId, title, message, type, referenceId }) {
  await client.query(
    `insert into notifications (user_id, message, is_read)
     values ($1, $2, false)`,
    [userId || null, message || title || `${type || "Notification"} ${referenceId || ""}`.trim()]
  );
}
