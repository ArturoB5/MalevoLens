import type { UiText } from "@/infrastructure/i18n";

type ControlsPanelProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  text: UiText;
};

export function ControlsPanel({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onReset,
  text
}: ControlsPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="control-button disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        type="button"
      >
        {text.previous}
      </button>
      <button
        className="primary-button disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        {text.next}
      </button>
      <button
        className="control-button"
        onClick={onReset}
        type="button"
      >
        {text.reset}
      </button>
    </div>
  );
}
