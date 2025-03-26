const Loader = ({ 
  text = "Loading...", 
  height = "100vh", 
  backgroundColor = "#0a0a0a",
  dotSize = "16px",
  dotColor = "#ff3547"
}) => {
  const styles = `
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loader {
      display: flex;
      gap: ${parseInt(dotSize) / 2}px;
    }

    .loader-circle {
      width: ${dotSize};
      height: ${dotSize};
      border-radius: 50%;
      background: ${dotColor};
      animation: loader 1s ease-in-out infinite;
    }

    .loader-circle:nth-child(2) {
      animation-delay: 0.2s;
    }

    .loader-circle:nth-child(3) {
      animation-delay: 0.4s;
    }

    .loader-text {
      margin-top: 20px;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 500;
      letter-spacing: 1px;
    }

    @keyframes loader {
      0%, 100% {
        transform: translateY(0);
        opacity: 1;
      }
      50% {
        transform: translateY(-${parseInt(dotSize)}px);
        opacity: 0.5;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="loader-container" style={{ height, background: backgroundColor }}>
        <div className="loader">
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
        </div>
        <p className="loader-text">{text}</p>
      </div>
    </>
  );
};

export default Loader;