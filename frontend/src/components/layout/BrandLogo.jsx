import logo from "../../assets/vendorbridge-logo.svg";

export default function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="VendorBridge"
        className={compact ? "h-9 w-9 object-left" : "h-10 w-auto"}
        src={logo}
      />
      {compact ? <span className="text-lg font-bold text-gray-950">VendorBridge</span> : null}
    </div>
  );
}
