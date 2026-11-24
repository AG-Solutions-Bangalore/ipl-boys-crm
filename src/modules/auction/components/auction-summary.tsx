import { AlertCircle, CheckCircle2, Shield, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { asText } from "@/lib/format";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";

export function AuctionSummary({
  selectedPlayer,
  selectedTeam,
  price,
}: {
  selectedPlayer?: Player;
  selectedTeam?: FantasyTeam;
  price: string;
}) {
  const currentBudget = Number(selectedTeam?.budget || 0);
  const salePrice = Number(price || 0);
  const remainingBudget = selectedTeam ? currentBudget - salePrice : 0;
  const isDeficit = Boolean(selectedTeam && remainingBudget < 0);

  return (
    <Card className="border-border/70 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Wallet className="size-5" />
            <CardTitle className="text-base">Purchase audit</CardTitle>
          </div>
          {Boolean(selectedPlayer?.tier) && (
            <Badge variant="outline" className="font-mono text-xs">
              Tier {asText(selectedPlayer?.tier)}
            </Badge>
          )}
        </div>
        <CardDescription>
          Live financial ledger validation before committing database changes.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Spotlight Player Header */}
        <div className="rounded-lg border border-border/50 bg-background/40 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Target asset</p>
              <h4 className="mt-0.5 text-base font-semibold text-foreground">
                {asText(selectedPlayer?.name) || "No player selected"}
              </h4>
            </div>
            {Boolean(selectedPlayer?.role) && (
              <Badge variant="secondary" className="text-xs">
                {asText(selectedPlayer?.role)}
              </Badge>
            )}
          </div>
        </div>

        {/* Breakdown Ledger */}
        <div className="grid gap-2 text-xs">
          <div className="flex items-center justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">Purchasing franchise</span>
            <b className="font-medium text-foreground">{asText(selectedTeam?.name) || "—"}</b>
          </div>

          <div className="flex items-center justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">Current purse balance</span>
            <b className="font-mono text-foreground">
              {selectedTeam ? `₹${asText(selectedTeam.budget)} Cr` : "—"}
            </b>
          </div>

          <div className="flex items-center justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">Asset base price</span>
            <b className="font-mono text-foreground">
              {selectedPlayer ? `₹${asText(selectedPlayer.base_price || 0)} Cr` : "—"}
            </b>
          </div>

          <div className="flex items-center justify-between border-b border-border/40 py-2">
            <span className="text-muted-foreground">Agreed sale price</span>
            <b className="font-mono text-primary">
              {price ? `₹${price} Cr` : "—"}
            </b>
          </div>

          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="font-medium text-foreground">Purse after sale</span>
            <b
              className={`font-mono font-semibold ${
                !selectedTeam
                  ? "text-muted-foreground"
                  : isDeficit
                    ? "text-destructive"
                    : "text-emerald-400"
              }`}
            >
              {selectedTeam ? `₹${remainingBudget.toFixed(2)} Cr` : "—"}
            </b>
          </div>
        </div>

        {/* Status Validation Box */}
        {selectedTeam && (
          <div
            className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
              isDeficit
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isDeficit ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {isDeficit ? "Insufficient funds" : "Purse approved"}
              </p>
              <p className="opacity-90">
                {isDeficit
                  ? "Sale price exceeds franchise available budget ceiling."
                  : `Franchise retains ₹${remainingBudget.toFixed(2)} Cr for remaining auction rounds.`}
              </p>
            </div>
          </div>
        )}

        {/* Policy Hint */}
        <div className="flex items-start gap-2 rounded-lg border border-border/30 bg-background/20 p-3 text-[11px] text-muted-foreground">
          <Shield className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            IPL franchises count as auction assets and do not consume one of the 15–18 player roster slots.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
