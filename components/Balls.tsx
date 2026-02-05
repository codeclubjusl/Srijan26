export default function Balls() {
  return (
    <div className="fixed w-full h-full overflow-hidden">
      <div
        className="ball"
        style={
          {
            "--delay": "0s",
            "--size": "0.4",
            "--speed": "20s",
          } as React.CSSProperties
        }
      ></div>
      <div
        className="ball"
        style={
          {
            "--delay": "-12s",
            "--size": "0.35",
            "--speed": "25s",
          } as React.CSSProperties
        }
      ></div>
      <div
        className="ball"
        style={
          {
            "--delay": "-10s",
            "--size": "0.3",
            "--speed": "15s",
          } as React.CSSProperties
        }
      ></div>
      {/* add more balls as you dare */}
    </div>
  );
}
