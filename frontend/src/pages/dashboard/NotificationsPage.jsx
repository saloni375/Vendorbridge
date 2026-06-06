import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { activityLogs as mockActivityLogs, notifications as mockNotifications } from "../../data/procurementData.js";
import { activityLogsApi, notificationsApi } from "../../services/procurementService.js";
import { formatDate } from "../../utils/formatters.js";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activityLogs, setActivityLogs] = useState(mockActivityLogs);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([notificationsApi.list(), activityLogsApi.list()])
      .then(([notificationRows, logRows]) => {
        if (!isMounted) return;
        setNotifications(
          notificationRows.map((notification) => ({
            id: notification.id,
            title: notification.is_read ? "Read notification" : "Unread notification",
            message: notification.message,
            type: notification.is_read ? "Read" : "New",
            time: notification.created_at,
          }))
        );
        setActivityLogs(
          logRows.map((log) => ({
            id: log.id,
            actor: log.user_id ? `User #${log.user_id}` : "System",
            action: log.action,
            module: log.entity_type || "ERP",
            time: log.created_at,
          }))
        );
      })
      .catch((error) => setMessage(error.message || "Could not load notifications from database."));

    return () => {
      isMounted = false;
    };
  }, []);

  const markRead = async (notificationId) => {
    await notificationsApi.markRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, title: "Read notification", type: "Read" }
          : notification
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track system alerts, vendor submissions, approval reminders, invoice due dates, and module-level activity logs."
        eyebrow="Control Center"
        title="Notifications"
      />

      {message ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-950">Notifications</h2>
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => (
              <div className="rounded-lg border border-line p-4" key={notification.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{notification.message}</p>
                  </div>
                  <StatusBadge status={notification.type} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-gray-500">{formatDate(notification.time)}</p>
                  {notification.type !== "Read" ? (
                    <button
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      onClick={() => markRead(notification.id)}
                      type="button"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-950">Activity Logs</h2>
          <div className="mt-4 space-y-4">
            {activityLogs.map((log) => (
              <div className="border-l-2 border-brand-600 pl-4" key={log.id}>
                <p className="text-sm font-semibold text-gray-950">{log.actor}</p>
                <p className="mt-1 text-sm text-gray-600">{log.action}</p>
                <p className="mt-2 text-xs font-semibold uppercase text-gray-500">
                  {log.module} - {log.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
