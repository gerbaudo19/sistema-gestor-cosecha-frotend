export const Logo = () => {
  return (
    <div className="logo-container">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="60"
          cy="60"
          r="59.25"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="logo-circle"
        />

        <path
          id="circlePath"
          d="M 60,60 m -46,0
             a 46,46 0 1,1 92,0
             a 46,46 0 1,1 -92,0"
          fill="none"
        />

        <text className="logo-text" dy="-2">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ESTABLECIMIENTO GENERAL PAZ - ORDOÑEZ -
          </textPath>
        </text>

        <text
          x="60"
          y="78"
          textAnchor="middle"
          className="logo-r"
        >
          R
        </text>
      </svg>

      <h2 className="company-name">REMONTA</h2>
    </div>
  );
};
