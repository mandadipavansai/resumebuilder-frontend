

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/api';
// import styles from './template.module.css';


// const templates = [
//   { name: 'Academic', preview: '/classic.png' },
//   { name: 'Professional', preview: '/professional.png' },
// ];

// const TemplatesPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(null);
//   const [error, setError] = useState('');

//   const handleUseTemplate = async (templateName) => {
//     setLoading(templateName);
//     setError('');
//     try {
//       const { data } = await api.post('/api/resume', {
//         templateName: templateName,
//         resumeData: {
//           personalDetails: { name: "Your Name" },
//           summary: '', 
//           experience: [
//             { jobTitle: '', company: '', location: '', duration: '', description: '' }
//           ],
//           projects: [
//             { projectTitle: '', description: '', bulletPoints: [''] }
//           ],
//           education: [
//             { universityName: '', degree: '', duration: '' }
//           ],
//           skills: [''],
//           sections: [
//             { key: 'personalDetails', title: 'Personal Details' },
//             { key: 'summary', title: 'Professional Summary' },
//             { key: 'experience', title: 'Work Experience' },
//             { key: 'projects', title: 'Projects' },
//             { key: 'education', title: 'Education' },
//             { key: 'skills', title: 'Skills' },
//           ]
//         }
//       });
//       navigate(`/editor/${data._id}`);
//     } catch (err) {
//       console.error('Failed to create resume from template', err);
//       setError('Could not create resume. Please try again.');
//       setLoading(null);
//     }
//   };

//   return (
//     <div className={styles.templatesContainer}>
//       <h1 className={styles.title}>Choose Your Template</h1>
//       <p className={styles.subtitle}>Select a template to start building your professional resume.</p>
//       {error && <p className={styles.errorText}>{error}</p>}
//       <div className={styles.templatesGrid}>
//         {templates.map((template) => (
//           <div key={template.name} className={styles.templateCard}>
//             <img src={template.preview} alt={`${template.name} resume template preview`} className={styles.previewImage} />
//             <div className={styles.cardOverlay}>
//               <h3 className={styles.templateName}>{template.name}</h3>
//               <button
//                 onClick={() => handleUseTemplate(template.name)}
//                 className={styles.useButton}
//                 disabled={loading === template.name}
//               >
//                 {loading === template.name ? 'Creating...' : 'Use This Template'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemplatesPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './template.module.css';


const templates = [
  { name: 'Academic', preview: '/classic.png' },
  { name: 'Professional', preview: '/professional.png' },
];

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handleUseTemplate = async (templateName) => {
    setLoading(templateName);
    setError('');
    try {
      const { data } = await api.post('/api/resume', {
        templateName: templateName,
        resumeData: {
          personalDetails: { name: "Your Name", phone: "", email: "", linkedin: "", github: "" },
          summary: '', 
          experience: [
            // *** FIX: Initialize description as an array, add link ***
            { jobTitle: '', company: '', location: '', duration: '', description: [''], link: '' }
          ],
          projects: [
            // *** FIX: Add link ***
            { projectTitle: '', description: '', bulletPoints: [''], link: '' }
          ],
          education: [
            // *** FIX: Add gpa and link ***
            { universityName: '', degree: '', duration: '', gpa: '', link: '' }
          ],
          skills: [''],
          sections: [
            { key: 'personalDetails', title: 'Personal Details', isCustom: false },
            { key: 'summary', title: 'Professional Summary', isCustom: false },
            { key: 'experience', title: 'Work Experience', isCustom: false },
            { key: 'projects', title: 'Projects', isCustom: false },
            { key: 'education', title: 'Education', isCustom: false },
            { key: 'skills', title: 'Skills', isCustom: false },
          ]
        }
      });
      navigate(`/editor/${data._id}`);
    } catch (err) {
      console.error('Failed to create resume from template', err);
      setError('Could not create resume. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className={styles.templatesContainer}>
      <h1 className={styles.title}>Choose Your Template</h1>
      <p className={styles.subtitle}>Select a template to start building your professional resume.</p>
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.templatesGrid}>
        {templates.map((template) => (
          <div key={template.name} className={styles.templateCard}>
            <img src={template.preview} alt={`${template.name} resume template preview`} className={styles.previewImage} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.templateName}>{template.name}</h3>
              <button
                onClick={() => handleUseTemplate(template.name)}
                className={styles.useButton}
                disabled={loading === template.name}
              >
                {loading === template.name ? 'Creating...' : 'Use This Template'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;