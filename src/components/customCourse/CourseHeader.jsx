import '../../assets/styles/customCourse/courseHeader.css';

const CourseHeader = ({ title, setTitle, editable }) => {
    return (
      <div className="course-header">
        {editable ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <h2>{title}</h2>
        )}
      </div>
    );
  };
  
  export default CourseHeader;