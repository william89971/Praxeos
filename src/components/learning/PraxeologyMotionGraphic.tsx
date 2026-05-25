type PraxeologyMotionGraphicProps = {
  variant: "action-map" | "tradeoff-balance";
};

export function PraxeologyMotionGraphic({ variant }: PraxeologyMotionGraphicProps) {
  if (variant === "tradeoff-balance") {
    return (
      <figure
        className="praxeology-motion praxeology-motion--balance"
        aria-label="Animated opportunity cost balance showing a chosen path and a given up path."
      >
        <div className="praxeology-motion__rail" aria-hidden="true" />
        <div className="praxeology-motion__choice praxeology-motion__choice--chosen">
          <span>Chosen</span>
          <strong>what you did</strong>
        </div>
        <div className="praxeology-motion__balance-beam" aria-hidden="true">
          <span />
        </div>
        <div className="praxeology-motion__choice praxeology-motion__choice--cost">
          <span>Given up</span>
          <strong>next best thing</strong>
        </div>
      </figure>
    );
  }

  return (
    <figure
      className="praxeology-motion praxeology-motion--map"
      aria-label="Animated praxeology map moving from actor to end to means to tradeoff."
    >
      <div className="praxeology-motion__node praxeology-motion__node--actor">
        <span>Actor</span>
        <strong>who chose</strong>
      </div>
      <div className="praxeology-motion__node praxeology-motion__node--end">
        <span>End</span>
        <strong>what they wanted</strong>
      </div>
      <div className="praxeology-motion__node praxeology-motion__node--means">
        <span>Means</span>
        <strong>what they used</strong>
      </div>
      <div className="praxeology-motion__node praxeology-motion__node--tradeoff">
        <span>Tradeoff</span>
        <strong>what moved aside</strong>
      </div>
      <div className="praxeology-motion__route" aria-hidden="true" />
      <div className="praxeology-motion__pulse" aria-hidden="true" />
    </figure>
  );
}
