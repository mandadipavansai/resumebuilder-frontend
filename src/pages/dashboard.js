// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import API from '../api/api';
// import styles from './dashboard.module.css';
// import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'; // Added icons for actions

// const Dashboard = () => {
//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const fetchResumes = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get('/api/resume'); // Correct singular route
//       setResumes(data);
//     } catch (err) {
//       setError('Failed to fetch resumes. Please log out and log back in.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchResumes();
//   }, [fetchResumes]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this resume?')) {
//       try {

//         await API.delete(`/api/resume/${id}`);
//         fetchResumes(); 
//       } catch (err) {
//         setError('Failed to delete resume. Please try again.');
//         console.error(err);
//       }
//     }
//   };
  
//   const handleDownload = async (resume) => {
//     try {

//         const response = await API.post(`/api/resume/preview`, {
//             resumeData: resume.resumeData,
//             templateName: resume.templateName,
//         }, {
//             responseType: 'blob',
//         });
//         const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//         const link = document.createElement('a');
//         link.href = url;

//         const fileName = `${(resume.resumeData?.personalDetails?.name || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
//         link.setAttribute('download', fileName);
//         document.body.appendChild(link);
//         link.click();
//         link.parentNode.removeChild(link);
//         window.URL.revokeObjectURL(url);
//     } catch (err) {
//         setError('Failed to download PDF. Please try again.');
//         console.error(err);
//     }
//   };

//   if (loading) {
//     return <div className={styles.centered}>Loading your resumes...</div>;
//   }

//   return (
//     <div className={styles.mainContainer}>
//       <header className={styles.header}>
//         {/* --- FIX: Correctly accessing user's name from context --- */}
//         <h1 className={styles.headerTitle}>Welcome, {user?.username || 'User'}!</h1>
//         <Link to="/templates" className={styles.createButton}>
//           <FiPlus />
//           Create New Resume
//         </Link>
//       </header>

//       {error && <p className={styles.errorBox}>{error}</p>}

//       {resumes.length > 0 ? (
//         <div className={styles.grid}>
//           {resumes.map((resume) => (
//             <div key={resume._id} className={styles.card}>
//               <div className={styles.cardPreview}>
//                 {/* --- FIX: Correctly accessing templateName --- */}
//                 <img src={`/${resume.templateName}.png`} alt={`${resume.templateName} template preview`} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x565/eee/ccc?text=Preview' }}/>
//               </div>
//               <div className={styles.cardContent}>
//                 {/* --- FIX: Correctly accessing the resume title --- */}
//                 <h2 className={styles.cardTitle}>{resume.resumeData?.personalDetails?.name || 'Untitled Resume'}</h2>
//                 <p className={styles.cardSubtitle}>{resume.templateName} Template</p>
//               </div>
//               <div className={styles.cardActions}>
//                 <button onClick={() => navigate(`/editor/${resume._id}`)} className={styles.actionButton}><FiEdit /> Edit</button>
//                 <button onClick={() => handleDownload(resume)} className={styles.actionButton}>Download</button>
//                 <button onClick={() => handleDelete(resume._id)} className={`${styles.actionButton} ${styles.deleteButton}`}><FiTrash2 /> Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         !error && (
//             <div className={styles.emptyState}>
//                 <div className={styles.emptyStateIcon}>📄</div>
//                 <h3>No Resumes Yet</h3>
//                 <p>Your created resumes will appear here. Click "Create New Resume" to get started.</p>
//             </div>
//         )
//       )}
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import styles from './dashboard.module.css';
// *** FIX: Added FiDownload icon ***
import { FiPlus, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi'; 

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/resume'); // Correct singular route
      setResumes(data);
    } catch (err) {
      setError('Failed to fetch resumes. Please log out and log back in.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {

        await API.delete(`/api/resume/${id}`);
        fetchResumes(); 
      } catch (err) {
        setError('Failed to delete resume. Please try again.');
        console.error(err);
      }
    }
  };
  
  const handleDownload = async (resume) => {
    try {
        
        // *** THIS IS THE FIX: Added resume._id to the URL to match your backend route ***
        const response = await API.post(`/api/resume/preview/${resume._id}`, {
            resumeData: resume.resumeData,
            templateName: resume.templateName,
        }, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;

        const fileName = `${(resume.resumeData?.personalDetails?.name || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        setError('Failed to download PDF. Please try again.');
        console.error(err);
    }
  };

  if (loading) {
    // A loading state is good practice, kept from your code
    return <div className={styles.centeredMessage}>Loading your resumes...</div>; 
  }

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Welcome, {user?.username || 'User'}!</h1>
        <Link to="/templates" className={styles.createButton}>
          <FiPlus />
          Create New Resume
        </Link>
      </header>

      {error && <p className={styles.errorBox}>{error}</p>}

      {resumes.length > 0 ? (
        <div className={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume._id} className={styles.card}>
              <div className={styles.cardPreview}>
                {/* Use templateName.toLowerCase() to match 'professional.png' */}
                <img src={`/${resume.templateName.toLowerCase()}.png`} alt={`${resume.templateName} template preview`} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x565/eee/ccc?text=Preview' }}/>
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{resume.resumeData?.personalDetails?.name || 'Untitled Resume'}</h2>
                <p className={styles.cardSubtitle}>{resume.templateName} Template</p>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => navigate(`/editor/${resume._id}`)} className={styles.actionButton}><FiEdit /> Edit</button>
                {/* *** FIX: Added icon to Download button *** */}
                <button onClick={() => handleDownload(resume)} className={styles.actionButton}><FiDownload /> Download</button>
                <button onClick={() => handleDelete(resume._id)} className={`${styles.actionButton} ${styles.deleteButton}`}><FiTrash2 /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && (
            <div className={styles.emptyState}>
                {/* You can add an icon here if you like */}
                {/* <div className={styles.emptyStateIcon}>📄</div> */}
                <h3>No Resumes Yet</h3>
                <p>Your created resumes will appear here. Click "Create New Resume" to get started.</p>
            </div>
        )
      )}
    </div>
  );
};

export default Dashboard;