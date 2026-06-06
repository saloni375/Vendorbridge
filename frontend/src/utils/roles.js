export const ROLES = {
  ADMIN: "admin",
  PROCUREMENT_OFFICER: "procurement_officer",
  VENDOR: "vendor",
  MANAGER: "manager",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.PROCUREMENT_OFFICER]: "Procurement Officer",
  [ROLES.VENDOR]: "Vendor",
  [ROLES.MANAGER]: "Manager",
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
