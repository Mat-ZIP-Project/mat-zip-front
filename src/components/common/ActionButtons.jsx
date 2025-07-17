import '../../assets/styles/customCourse/actionButtons.css';

const ActionButtons = ({ buttons }) => {
    return (
      <div className="action-buttons">
        {buttons.map((btn, idx) => (
          <button key={idx} onClick={btn.onClick} disabled={btn.spots&& btn.spots.length===0}>
            {btn.text}
          </button>
        ))}
      </div>
    );
  };
  
  export default ActionButtons;
