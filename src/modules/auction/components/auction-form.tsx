import { Gavel, Loader2, Search } from "lucide-react";
import type { FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { asText } from "@/lib/format";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50";

export function AuctionForm({
  teams,
  unassigned,
  teamId,
  playerId,
  price,
  filter,
  selectedPlayer,
  selectedTeam,
  busy,
  onTeamChange,
  onPlayerChange,
  onPriceChange,
  onFilterChange,
  onSubmit,
}: {
  teams: FantasyTeam[];
  unassigned: Player[];
  teamId: string;
  playerId: string;
  price: string;
  filter: string;
  selectedPlayer?: Player;
  selectedTeam?: FantasyTeam;
  busy: boolean;
  onTeamChange: (value: string) => void;
  onPlayerChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const basePriceNum = Number(selectedPlayer?.base_price) || 0;
  const currentPriceNum = Number(price) || 0;
  const isBelowBase = currentPriceNum < basePriceNum;

  return (
    <Card className="border-border/70 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Gavel className="size-5" />
            <CardTitle className="text-base">Sale recorder</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Live desk
          </Badge>
        </div>
        <CardDescription>
          Assign an unsold player to a fantasy franchise and deduct from their purse.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          {/* Buyer Team */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="buyer-team" className="text-xs text-muted-foreground">
                Buyer fantasy team
              </Label>
              {selectedTeam && (
                <span className="font-mono text-xs text-muted-foreground">
                  Purse:{" "}
                  <span className="font-medium text-foreground">
                    ₹{asText(selectedTeam.budget)} Cr
                  </span>
                </span>
              )}
            </div>
            <select
              id="buyer-team"
              required
              value={teamId}
              onChange={(e) => onTeamChange(e.target.value)}
              className={selectClass}
            >
              {teams.length === 0 && (
                <option value="" disabled className="bg-card text-foreground">
                  No fantasy teams in this league
                </option>
              )}
              {teams.map((team) => (
                <option
                  value={String(team.id)}
                  key={String(team.id)}
                  className="bg-card text-foreground"
                >
                  {asText(team.name)} — Budget ₹{asText(team.budget)} Cr
                </option>
              ))}
            </select>
          </div>

          {/* Search Player Pool */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="search-player" className="text-xs text-muted-foreground">
                Filter unsold pool
              </Label>
              <span className="font-mono text-xs text-muted-foreground">
                {unassigned.length} available
              </span>
            </div>
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-player"
                placeholder="Type to filter player name or franchise…"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="bg-secondary pl-8"
              />
            </div>
          </div>

          {/* Select Player */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="select-player" className="text-xs text-muted-foreground">
                Target player
              </Label>
              {selectedPlayer && (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-muted-foreground">Base:</span>
                  <Badge variant="secondary" className="px-1.5 py-0 font-mono text-[11px]">
                    ₹{asText(selectedPlayer.base_price || 0)} Cr
                  </Badge>
                </div>
              )}
            </div>
            <select
              id="select-player"
              required
              value={playerId}
              onChange={(e) => onPlayerChange(e.target.value)}
              className={selectClass}
            >
              {unassigned.map((player) => (
                <option
                  value={String(player.id)}
                  key={String(player.id)}
                  className="bg-card text-foreground"
                >
                  {asText(player.name)} ({asText(player.role) || "Player"}) · Base ₹
                  {asText(player.base_price || 0)} Cr
                </option>
              ))}
            </select>
          </div>

          {/* Sale Price Input */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sale-price" className="text-xs text-muted-foreground">
                Final hammer price (₹ Cr)
              </Label>
              {selectedPlayer && (
                <button
                  type="button"
                  onClick={() => onPriceChange(asText(selectedPlayer.base_price || 0))}
                  className="text-xs text-primary transition-colors hover:underline"
                >
                  Reset to base
                </button>
              )}
            </div>
            <Input
              id="sale-price"
              type="number"
              step="0.05"
              min={basePriceNum}
              required
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0.00"
              className="bg-secondary font-mono text-base font-medium"
            />
            {isBelowBase && (
              <p className="text-[11px] text-destructive">
                Sale price cannot be lower than player's base price (₹{basePriceNum} Cr).
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
          <div className="text-xs text-muted-foreground">
            {selectedPlayer && selectedTeam ? (
              <span>
                Selling to{" "}
                <b className="font-medium text-foreground">{asText(selectedTeam.name)}</b>
              </span>
            ) : (
              <span>Select team and player to proceed</span>
            )}
          </div>
          <Button
            type="submit"
            disabled={busy || !selectedPlayer || !selectedTeam || isBelowBase}
            className="gap-2"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Gavel className="size-4" />}
            {busy ? "Recording sale…" : "Confirm sale"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
