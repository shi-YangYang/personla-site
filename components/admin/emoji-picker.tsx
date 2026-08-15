"use client";

import { useMemo, useState } from "react";
import { Smile } from "lucide-react";
import { emojiCategories, type EmojiItem } from "@/lib/emoji";
import { cn } from "@/lib/utils";

export function EmojiPicker({
  onPick,
}: {
  onPick: (emoji: EmojiItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return emojiCategories
      .flatMap((c) => c.emojis)
      .filter(
        (e) =>
          e.label.toLowerCase().includes(q) || e.shortcode.includes(q),
      );
  }, [query]);

  function pick(e: EmojiItem) {
    onPick(e);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="插入表情"
        title="插入表情"
        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/20 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-brand hover:border-brand-primary/40 transition-colors"
      >
        <Smile size={14} />
        表情
      </button>

      {open && (
        <div className="absolute z-20 bottom-full mb-2 w-72 rounded-2xl glass border border-brand-primary/20 p-3 shadow-[var(--shadow-elevated)]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索表情..."
            autoFocus
            className="mb-2 w-full rounded-lg border border-brand-primary/20 bg-bg-base/60 px-2.5 py-1.5 text-xs outline-none focus:border-brand-primary/60"
          />

          {filtered ? (
            <div className="grid grid-cols-8 gap-1 max-h-56 overflow-y-auto">
              {filtered.map((e) => (
                <EmojiButton key={e.shortcode} item={e} onPick={pick} />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1 mb-2">
                {emojiCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveCategory(i)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full transition-colors",
                      activeCategory === i
                        ? "bg-brand-primary/20 text-text-brand"
                        : "text-text-muted hover:text-text-secondary",
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-8 gap-1 max-h-56 overflow-y-auto">
                {emojiCategories[activeCategory].emojis.map((e) => (
                  <EmojiButton key={e.shortcode} item={e} onPick={pick} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function EmojiButton({
  item,
  onPick,
}: {
  item: EmojiItem;
  onPick: (e: EmojiItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      title={`${item.shortcode} ${item.label}`}
      className="flex aspect-square items-center justify-center rounded-lg text-lg hover:bg-brand-primary/15 transition-colors"
    >
      {item.emoji}
    </button>
  );
}
