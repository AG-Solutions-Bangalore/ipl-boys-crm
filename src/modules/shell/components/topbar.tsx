import { ChevronDown, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { asText } from "@/lib/format";
import { useSession } from "@/modules/auth/hooks/use-session";
import { navigation } from "@/modules/shell/config/navigation";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { useRefreshData } from "@/shared/hooks/use-refresh-data";

export function Topbar() {
  const { profiles, profileId, setProfileId } = useAdminContext();
  const { user } = useSession();
  const refresh = useRefreshData();
  const location = useLocation();
  const activeItem = navigation.find((item) => item.path === location.pathname);
  const displayName = user?.user_metadata?.display_name || user?.email || "";
  const roleLabel = user?.roles?.includes("app_admin") ? "App admin" : "Profile admin";

  return (
    <header className="topbar">
      <div>
        <div className="crumb">
          CONTROL ROOM <span>/</span>
          {(activeItem?.label ?? "").toUpperCase()}
        </div>
        <h1>{activeItem?.label}</h1>
      </div>
      <div className="top-actions">
        {profiles.length > 0 && (
          <label className="profile-select">
            <span>LEAGUE</span>
            <select value={profileId} onChange={(e) => setProfileId(e.target.value)}>
              {profiles.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {asText(p.name)}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>
        )}
        <button className="icon-button" title="Refresh data" onClick={refresh}>
          <RefreshCw size={16} />
        </button>
        <div className="user-chip">
          <span className="avatar">{displayName.slice(0, 1).toUpperCase()}</span>
          <span>
            {displayName}
            <small>{roleLabel}</small>
          </span>
        </div>
      </div>
    </header>
  );
}
