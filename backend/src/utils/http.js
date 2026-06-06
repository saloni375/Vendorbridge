export function sendOk(res, data, status = 200) {
  return res.status(status).json(data);
}

export function notFound(res, label = "Resource") {
  return res.status(404).json({ message: `${label} not found` });
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function pickDefined(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== "")
  );
}
