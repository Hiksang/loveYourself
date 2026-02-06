"use client";

type Props = {
  score: number;
  myVote: "up" | "down" | null;
  onVote: (value: "up" | "down" | "none") => void;
  disabled?: boolean;
};

export function VoteButton({ score, myVote, onVote, disabled }: Props) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onVote(myVote === "up" ? "none" : "up")}
        disabled={disabled}
        className={`rounded-lg px-2 py-1 text-sm transition-colors ${
          myVote === "up"
            ? "bg-primary/20 text-primary"
            : "text-muted hover:bg-surface"
        } disabled:opacity-50`}
      >
        +
      </button>
      <span className={`min-w-[2ch] text-center text-sm font-semibold ${score > 0 ? "text-primary" : score < 0 ? "text-red-500" : "text-muted"}`}>
        {score}
      </span>
      <button
        onClick={() => onVote(myVote === "down" ? "none" : "down")}
        disabled={disabled}
        className={`rounded-lg px-2 py-1 text-sm transition-colors ${
          myVote === "down"
            ? "bg-red-100 text-red-500"
            : "text-muted hover:bg-surface"
        } disabled:opacity-50`}
      >
        -
      </button>
    </div>
  );
}
