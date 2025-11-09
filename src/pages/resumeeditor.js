


// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/api';
// import styles from './resumeeditor.module.css';
// import { FiSave, FiPlus, FiTrash2, FiEdit, FiArrowUp, FiArrowDown, FiRefreshCw, FiChevronDown, FiStar, FiZap, FiFileText, FiCheckCircle, FiBold } from 'react-icons/fi';


// const AddSectionModal = ({ onAddSection, onClose }) => {
//     const [sectionName, setSectionName] = useState('');
//     const [sectionType, setSectionType] = useState('list-with-bullets');

//     const handleAdd = () => {
//         if (sectionName.trim()) {
//             onAddSection(sectionName, sectionType);
//             onClose();
//         }
//     };

//     return (
//         <div className={styles.modalOverlay}>
//             <div className={styles.modalContent}>
//                 <h3>Add New Section</h3>
//                 <label>Section Name:</label>
//                 <input
//                     type="text"
//                     value={sectionName}
//                     onChange={(e) => setSectionName(e.target.value)}
//                     placeholder="e.g., Certifications, Volunteer Work"
//                 />
//                 <label>Section Type:</label>
//                 <select value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
//                     <option value="list-with-bullets">List with Bullet Points</option>
//                     <option value="single-input-and-description">Single Box with Description</option>
//                     <option value="single-text-area">Single Text Area</option>
//                 </select>
//                 <div className={styles.modalActions}>
//                     <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
//                     <button onClick={handleAdd} className={styles.addButton}>Add Section</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Re-usable input component with AI and bolding features
// const AiInputField = ({ path, value, placeholder, onChange, onImprove, improvingPath, type = 'input' }) => {
//     const isImproving = improvingPath === path;
//     const InputComponent = type === 'textarea' ? 'textarea' : 'input';

//     const handleBoldClick = () => {
//         const textToBold = window.getSelection().toString();
//         if (textToBold && value) {
//             const newText = value.replace(textToBold, `**${textToBold}**`);
//             onChange(path, newText);
//         }
//     };

//     return (
//         <div className={styles.inputWithAi}>
//             <InputComponent
//                 type={type === 'textarea' ? undefined : type}
//                 placeholder={placeholder}
//                 value={value || ''}
//                 onChange={e => onChange(path, e.target.value)}
//                 className={styles.inputField}
//             />
//             <div className={styles.inputControls}>
//                 <button onClick={handleBoldClick} className={styles.boldButton} title="Bold selected text">
//                     <FiBold />
//                 </button>
//                 <button onClick={() => onImprove(path, value)} className={styles.aiButton} title="Improve Writing with AI" disabled={isImproving}>
//                     {isImproving ? <FiRefreshCw className={styles.spinning} /> : <FiEdit />}
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Collapsible Section Component
// const Section = ({ title, children, sectionControls }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//         <div className={`${styles.formSection} ${isOpen ? styles.open : ''}`}>
//             <div className={styles.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
//                 <h3>{title}</h3>
//                 <div className={styles.sectionControls}>
//                     {sectionControls}
//                     <FiChevronDown className={styles.chevron} />
//                 </div>
//             </div>
//             <div className={styles.sectionContent}>{children}</div>
//         </div>
//     );
// };

// const ResumeEditor = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [resume, setResume] = useState(null);
//     const [pdfUrl, setPdfUrl] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [previewLoading, setPreviewLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [mode, setMode] = useState('EDIT');
//     const [jobDescription, setJobDescription] = useState('');
//     const [aiResult, setAiResult] = useState(null);
//     const [aiLoading, setAiLoading] = useState(false);
//     const [improvingText, setImprovingText] = useState(null);
//     const [isJobDescVisible, setIsJobDescVisible] = useState(true);
//     const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

//     const updatePreview = useCallback(async () => {
//         if (!id || !resume) return;
//         setPreviewLoading(true);
//         setError('');
//         try {
//             const response = await api.post(`/api/resume/preview/${id}`, {
//                 resumeData: resume.resumeData,
//                 templateName: resume.templateName
//             }, { responseType: 'blob' });

//             const newPdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//             setPdfUrl(prevUrl => {
//                 if (prevUrl) window.URL.revokeObjectURL(prevUrl);
//                 return newPdfUrl;
//             });
//         } catch (err) {
//             console.error("Preview Error:", err);
//             setError("Failed to generate PDF preview.");
//         } finally {
//             setPreviewLoading(false);
//         }
//     }, [id, resume]);

//     useEffect(() => {
//         const fetchResumeData = async () => {
//             if (!id) {
//                 navigate('/dashboard');
//                 return;
//             }
//             setLoading(true);
//             try {
//                 const { data } = await api.get(`/api/resume/${id}`);
//                 setResume(data);
//             } catch (err) {
//                 setError('Failed to load resume data.');
//                 navigate('/dashboard');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchResumeData();
//     }, [id, navigate]);

//     useEffect(() => {
//         return () => {
//             if (pdfUrl) {
//                 window.URL.revokeObjectURL(pdfUrl);
//             }
//         };
//     }, [pdfUrl]);

//     // Helper to get a nested property from an object using a string path
//     const getNestedValue = (obj, path) => {
//         if (!path) return obj;
//         return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
//     };

//     const handleDataChange = (path, value) => {
//         setResume(prev => {
//             if (!prev) return null;
            
//             let newPath = path;
//             if (path.startsWith('professionalSummary')) newPath = path.replace('professionalSummary', 'summary');
//             if (path.startsWith('workExperience')) newPath = path.replace('workExperience', 'experience');

//             const keys = newPath.split('.');
//             const newResumeData = structuredClone(prev.resumeData);

//             if (newPath.startsWith('summary') && newResumeData.hasOwnProperty('professionalSummary')) {
//                 delete newResumeData.professionalSummary;
//             }
//             if (newPath.startsWith('experience') && newResumeData.hasOwnProperty('workExperience')) {
//                 delete newResumeData.workExperience;
//             }

//             let current = newResumeData;
//             for (let i = 0; i < keys.length - 1; i++) {
//                 const key = keys[i];
//                 const nextKey = keys[i + 1];
//                 if (!current[key]) {
//                   current[key] = isNaN(parseInt(nextKey)) ? {} : [];
//                 }
//                 current = current[key];
//             }
//             current[keys[keys.length - 1]] = value;
//             return { ...prev, resumeData: newResumeData };
//         });
//     };

//     const handleSaveAndClose = async () => {
//         if (!resume) return;
//         setSaving(true);
//         setError('');
//         try {
//             await api.put(`/api/resume/${id}`, { resumeData: resume.resumeData, templateName: resume.templateName });
//             navigate('/dashboard');
//         } catch (err) {
//             setError('Failed to save resume.');
//         } finally {
//             setSaving(false);
//         }
//     };
    
//     const handleImproveWriting = async (path, currentText) => {
//         if (!currentText || improvingText) return;
//         setImprovingText(path);
//         try {
//             const { data } = await api.post('/api/ai/improve', { text: currentText });
//             handleDataChange(path, data.improvedText);
//         } catch (err) {
//             alert("Could not improve text. Please try again.");
//         } finally {
//             setImprovingText(null);
//         }
//     };
    
//     const handleGetAtsScore = async () => {
//         if (!resume) return;
//         setMode('ATS');
//         setAiLoading(true); setAiResult(null);
//         try {
//             const { data } = await api.post('/api/ai/atsscore', { resumeData: resume.resumeData });
//             setAiResult(data);
//         } catch (err) {
//             setAiResult({ error: err.response?.data?.message || 'Could not get ATS score.' });
//         } finally {
//             setAiLoading(false);
//         }
//     };
    
//     const handlePersonalize = async () => {
//         if (!resume || !jobDescription.trim()) { alert("Please paste a job description first."); return; }
//         setIsJobDescVisible(false);
//         setAiLoading(true); setAiResult(null);
//         try {
//             const { data } = await api.post('/api/ai/personalize', { resumeData: resume.resumeData, jobDescription });
//             setAiResult(data);
//         } catch (err) {
//             setAiResult({ error: err.response?.data?.message || 'Error personalizing resume.' });
//         } finally {
//             setAiLoading(false);
//         }
//     };
    
//     // --- THIS IS THE FIX ---
//     const addArrayItem = (path, defaultItem = {}) => {
//         if (!resume) return;
//         const currentItems = getNestedValue(resume.resumeData, path) || [];
//         handleDataChange(path, [...currentItems, defaultItem]);
//     };

//     const removeArrayItem = (path, index) => {
//         if (!resume) return;
//         const currentItems = getNestedValue(resume.resumeData, path) || [];
//         handleDataChange(path, currentItems.filter((_, i) => i !== index));
//     };
    
//     const addSection = (name, type) => {
//         const newSectionKey = name.toLowerCase().replace(/\s+/g, '');
//         const newSections = [...(resume.resumeData.sections || []), { key: newSectionKey, title: name, isCustom: true, type }];
        
//         const newResumeData = { ...resume.resumeData };
//         if (type === 'list-with-bullets') {
//             newResumeData[newSectionKey] = [{ title: '', bulletPoints: [''] }];
//         } else if (type === 'single-text-area') {
//             newResumeData[newSectionKey] = '';
//         } else if (type === 'single-input-and-description') {
//             newResumeData[newSectionKey] = [{ title: '', description: '' }];
//         }
        
//         setResume(prev => ({ ...prev, resumeData: {...newResumeData, sections: newSections} }));
//     };

//     const deleteSection = (sectionKey) => {
//         if (!resume || !window.confirm('Are you sure you want to delete this entire section?')) return;
//         setResume(prev => {
//             const newResumeData = structuredClone(prev.resumeData);
//             newResumeData.sections = newResumeData.sections.filter(sec => sec.key !== sectionKey);
//             delete newResumeData[sectionKey];
//             return { ...prev, resumeData: newResumeData };
//         });
//     };

//     const moveSection = (index, direction) => {
//         if (!resume) return;
//         const sections = [...resume.resumeData.sections];
//         const newIndex = index + direction;
//         if (newIndex < 0 || newIndex >= sections.length) return;
//         const [movedSection] = sections.splice(index, 1);
//         sections.splice(newIndex, 0, movedSection);
//         handleDataChange('sections', sections);
//     };

//     // --- RENDER METHODS ---
//     const renderPersonalDetails = () => (
//         <div className={styles.sectionFields}>
//             <div className={styles.inputGroup}><label>Your Name</label><AiInputField path="personalDetails.name" value={resume.resumeData.personalDetails?.name} placeholder="Pavan Sai Kumar" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//             <div className={styles.inputGroup}><label>Email Address</label><AiInputField path="personalDetails.email" value={resume.resumeData.personalDetails?.email} placeholder="your.email@example.com" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="email" /></div>
//             <div className={styles.inputGroup}><label>Phone Number</label><AiInputField path="personalDetails.phone" value={resume.resumeData.personalDetails?.phone} placeholder="123-456-7890" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="tel" /></div>
//             <div className={styles.inputGroup}><label>LinkedIn</label><AiInputField path="personalDetails.linkedin" value={resume.resumeData.personalDetails?.linkedin} placeholder="linkedin.com/in/yourprofile" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//             <div className={styles.inputGroup}><label>GitHub URL</label><AiInputField path="personalDetails.github" value={resume.resumeData.personalDetails?.github} placeholder="github.com/yourusername" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//         </div>
//     );

//     const renderProfessionalSummary = () => (
//         <div className={styles.sectionFields}><label>Professional Summary</label><AiInputField path="summary" value={resume.resumeData.summary ?? resume.resumeData.professionalSummary} placeholder="A brief professional summary about you..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>
//     );

//     const renderWorkExperience = () => {
//         const experienceItems = resume.resumeData.experience ?? resume.resumeData.workExperience;
//         return (<div className={styles.sectionFields}>{(experienceItems || []).map((exp, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{exp.jobTitle || `Work Experience ${index + 1}`}</h4><button onClick={() => removeArrayItem('experience', index)}><FiTrash2 /></button></div><AiInputField path={`experience.${index}.jobTitle`} value={exp.jobTitle} placeholder="Job Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`experience.${index}.company`} value={exp.company} placeholder="Company Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`experience.${index}.location`} value={exp.location} placeholder="City, State" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`experience.${index}.duration`} value={exp.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><label>Description</label><AiInputField path={`experience.${index}.description`} value={exp.description} placeholder="A short description of your responsibilities..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>))}<button onClick={() => addArrayItem('experience', {})} className={styles.addButton}><FiPlus /> Add Experience</button></div>);
//     }

//     const renderProjects = () => (<div className={styles.sectionFields}>{(resume.resumeData.projects || []).map((project, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{project.projectTitle || `Project ${index + 1}`}</h4><button onClick={() => removeArrayItem('projects', index)}><FiTrash2 /></button></div><AiInputField path={`projects.${index}.projectTitle`} value={project.projectTitle} placeholder="Project Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`projects.${index}.description`} value={project.description} placeholder="A brief overview of the project..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /><div className={styles.bulletPoints}>{(project.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`projects.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="A specific feature you implemented..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><button onClick={() => removeArrayItem(`projects.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`projects.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}<button onClick={() => addArrayItem('projects', { bulletPoints: [''] })} className={styles.addButton}><FiPlus /> Add Project</button></div>);

//     const renderEducation = () => (<div className={styles.sectionFields}>{(resume.resumeData.education || []).map((edu, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{edu.universityName || `Education ${index + 1}`}</h4><button onClick={() => removeArrayItem('education', index)}><FiTrash2 /></button></div><div className={styles.inputRow}><AiInputField path={`education.${index}.universityName`} value={edu.universityName} placeholder="University Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`education.${index}.degree`} value={edu.degree} placeholder="Your Degree" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div><AiInputField path={`education.${index}.duration`} value={edu.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>))}<button onClick={() => addArrayItem('education', {})} className={styles.addButton}><FiPlus /> Add Education</button></div>);

//     const renderSkills = () => (<div className={styles.sectionFields}>{(resume.resumeData.skills || []).map((skillGroup, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{`Skill Group ${index + 1}`}</h4><button onClick={() => removeArrayItem('skills', index)}><FiTrash2 /></button></div><AiInputField path={`skills.${index}`} value={skillGroup} placeholder="Programming, C++, Data Structures..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>))}<button onClick={() => addArrayItem('skills', '')} className={styles.addButton}><FiPlus /> Add Skill Group</button></div>);

//     const renderCustomSection = (section) => (
//         <div className={styles.sectionFields}>
//             {section.type === 'list-with-bullets' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><div className={styles.bulletPoints}>{(item.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`${section.key}.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="Bullet Point" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><button onClick={() => removeArrayItem(`${section.key}.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`${section.key}.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}<button onClick={() => addArrayItem(section.key, { bulletPoints: [''] })} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) :
//             section.type === 'single-text-area' ? (<AiInputField path={section.key} value={resume.resumeData[section.key]} placeholder={`Enter details for ${section.title}`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" />) :
//             section.type === 'single-input-and-description' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`${section.key}.${index}.description`} value={item.description} placeholder="Description" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>))}<button onClick={() => addArrayItem(section.key, {})} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) : null}
//         </div>
//     );

//     const renderEditorPanel = () => (
//         <><div className={styles.panelContent}><header className={styles.header}><h2 className={styles.title}>{resume.resumeData.personalDetails?.name || 'Untitled Resume'}</h2><button onClick={() => setIsAddSectionModalOpen(true)} className={styles.actionButton}><FiPlus /> Add Section</button></header>{(resume.resumeData.sections || []).map((section, index) => (<Section key={`${section.key}-${index}`} title={section.title} sectionControls={<><button onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }} disabled={index === 0} title="Move Up"><FiArrowUp /></button><button onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }} disabled={index === resume.resumeData.sections.length - 1} title="Move Down"><FiArrowDown /></button>{section.isCustom && <button onClick={(e) => { e.stopPropagation(); deleteSection(section.key); }} title="Delete Section"><FiTrash2/></button>}</>}>{section.key === 'personalDetails' && renderPersonalDetails()}{(section.key === 'summary' || section.key === 'professionalSummary') && renderProfessionalSummary()}{(section.key === 'experience' || section.key === 'workExperience') && renderWorkExperience()}{section.key === 'projects' && renderProjects()}{section.key === 'education' && renderEducation()}{section.key === 'skills' && renderSkills()}{section.isCustom && renderCustomSection(section)}</Section>))}</div>{isAddSectionModalOpen && <AddSectionModal onAddSection={addSection} onClose={() => setIsAddSectionModalOpen(false)} />}</>
//     );

//     // *** UPDATED renderAiPanel Function ***
//     const renderAiPanel = () => {
//         if (mode === 'ATS') {
//             return (
//                 <div className={`${styles.aiPanel} ${styles.panelContent}`}>
//                     <h2>ATS Score & Analysis</h2>
//                     {aiLoading ? (
//                         <div className={styles.centeredMessage}>Analyzing...</div>
//                     ) : aiResult ? (
//                         <div className={styles.aiResults}>
//                             {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}
//                             {aiResult.score !== undefined && (
//                                 <div className={styles.scoreCircle} style={{'--score': `${aiResult.score * 3.6}deg`}}>
//                                     <span>{aiResult.score}<small>/100</small></span>
//                                 </div>
//                             )}
//                             {aiResult.summary && <p className={styles.summary}>{aiResult.summary}</p>}
//                             {aiResult.suggestions && aiResult.suggestions.length > 0 && (
//                                 <div className={styles.aiFeedbackSection}>
//                                     <h3>Actionable Suggestions</h3>
//                                     <ul className={styles.suggestionList}>
//                                         {aiResult.suggestions.map((s, i) => <li key={i}><FiCheckCircle /> {s}</li>)}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                          <div className={styles.centeredMessage}>Click "ATS Score" to analyze.</div>
//                     )}
//                 </div>
//             );
//         }

//         if (mode === 'PERSONALIZE') {
//             return (
//                 <div className={`${styles.aiPanel} ${styles.panelContent}`}>
//                     {/* Job Description Section */}
//                     <div className={styles.jobDescriptionContainer}>
//                         <div className={styles.jobDescriptionHeader} onClick={() => setIsJobDescVisible(!isJobDescVisible)}>
//                             <h3><FiFileText /> Job Description</h3>
//                             <FiChevronDown className={`${styles.chevron} ${isJobDescVisible ? styles.open : ''}`} />
//                         </div>
//                         {isJobDescVisible && (
//                             <div className={styles.jobDescriptionContent}>
//                                 <textarea
//                                     value={jobDescription}
//                                     onChange={(e) => setJobDescription(e.target.value)}
//                                     placeholder="Paste the full job description here..."
//                                 />
//                                 <button onClick={handlePersonalize} disabled={aiLoading || !jobDescription.trim()} className={styles.aiActionButton}>
//                                     {aiLoading ? 'Personalizing...' : <><FiZap /> Personalize Resume</>}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* AI Results Display Area */}
//                     <div className={styles.aiResults}>
//                         {aiLoading && <div className={styles.centeredMessage}>Our AI is crafting your personalized feedback...</div>}

//                         {/* --- START: Corrected Rendering Logic --- */}
//                         {aiResult && !aiLoading && (
//                             <>
//                                 {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}

//                                 {aiResult.strategicFeedback && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3><FiStar /> Strategic Feedback</h3>
//                                         <p>{aiResult.strategicFeedback}</p>
//                                     </div>
//                                 )}

//                                 {aiResult.summary && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Summary</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.summary.feedback}</p>
//                                         <p><strong>Rewritten:</strong> {aiResult.summary.rewrittenText}</p>
//                                     </div>
//                                 )}

//                                 {aiResult.experience && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Experience</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.experience.feedback}</p>
//                                         {aiResult.experience.rewrittenItems && aiResult.experience.rewrittenItems.length > 0 && (
//                                             <>
//                                                 <h4>Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.experience.rewrittenItems.map((item, index) => (
//                                                         <li key={`exp-${index}`}>
//                                                             <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                             <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.projects && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Projects</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.projects.feedback}</p>
//                                         {aiResult.projects.rewrittenItems && aiResult.projects.rewrittenItems.length > 0 && (
//                                              <>
//                                                 <h4>Rewrite Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.projects.rewrittenItems.map((item, index) => (
//                                                         <li key={`proj-rewrite-${index}`}>
//                                                             <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                             <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                              </>
//                                         )}
//                                         {aiResult.projects.newProjectIdeas && aiResult.projects.newProjectIdeas.length > 0 && (
//                                             <>
//                                                 <h4>New Project Ideas:</h4>
//                                                 <ul>
//                                                     {aiResult.projects.newProjectIdeas.map((idea, index) => (
//                                                         <li key={`proj-idea-${index}`}>{idea}</li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.education && (
//                                      <div className={styles.aiFeedbackSection}>
//                                         <h3>Education</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.education.feedback}</p>
//                                         {aiResult.education.rewrittenItems && aiResult.education.rewrittenItems.length > 0 && (
//                                              <>
//                                                 <h4>Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.education.rewrittenItems.map((item, index) => (
//                                                         <li key={`edu-${index}`}>
//                                                              <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                              <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.skills && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Skills</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.skills.feedback}</p>
//                                         {aiResult.skills.missingSkills && aiResult.skills.missingSkills.length > 0 && (
//                                             <>
//                                                 <h4>Missing Skills to Add:</h4>
//                                                 <ul>
//                                                     {aiResult.skills.missingSkills.map((skill, index) => (
//                                                         <li key={`skill-missing-${index}`}>{skill}</li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                         {aiResult.skills.suggestedSkillsList && (
//                                             <p><strong>Suggested List:</strong> {aiResult.skills.suggestedSkillsList}</p>
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                         {/* --- END: Corrected Rendering Logic --- */}

//                         {/* Message if no results yet */}
//                         {!aiResult && !aiLoading && (
//                              <div className={styles.centeredMessage}>Paste a job description and click "Personalize Resume".</div>
//                         )}
//                     </div>
//                 </div>
//             );
//         }

//         return null; // Should not happen in normal flow
//     };
//     // *** END UPDATED renderAiPanel Function ***

//     const renderPreviewPanel = () => (
//         <div className={styles.previewPanel}><div className={styles.previewHeader}><h3>Live Preview</h3><button onClick={updatePreview} disabled={previewLoading} className={styles.updatePreviewButton}><FiRefreshCw className={previewLoading ? styles.spinning : ''} /><span>Refresh</span></button></div><div className={styles.pdfViewer}>{error && <div className={styles.centeredMessage}>{error}</div>}{!error && pdfUrl && <iframe src={pdfUrl} title="Resume Preview" className={styles.pdfPreview} />}{!error && !pdfUrl && <div className={styles.centeredMessage}>{previewLoading ? 'Generating...' : 'No Preview Available'}</div>}</div></div>
//     );

//     if (loading || !resume) return <div className={styles.centeredMessage}>Loading Editor...</div>;
    
//     return (
//         <div className={styles.editorLayout}>
//             <header className={styles.controlsHeader}>
//                 <div className={styles.controls}>
//                     <button onClick={() => setMode('EDIT')} className={mode === 'EDIT' ? styles.active : ''} data-tooltip="Editor">Edit</button>
//                     <button onClick={handleGetAtsScore} className={mode === 'ATS' ? styles.active : ''} data-tooltip="ATS Score & Analysis">ATS Score</button>
//                     <button onClick={() => { setMode('PERSONALIZE'); setAiResult(null); }} className={mode === 'PERSONALIZE' ? styles.active : ''} data-tooltip="Personalize with AI for a Job">Personalize</button>
//                 </div>
//                 <button onClick={handleSaveAndClose} disabled={saving} className={styles.saveButton} data-tooltip="Save and exit">
//                     <FiSave /> {saving ? 'Saving...' : 'Save & Close'}
//                 </button>
//             </header>

//             <main className={styles.leftPanelContainer}>
//                 {(mode === 'EDIT' || mode === 'PERSONALIZE') ? renderEditorPanel() : renderAiPanel()}
//             </main>
            
//             <aside className={styles.rightPanelContainer}>
//                 {(mode === 'EDIT' || mode === 'ATS') ? renderPreviewPanel() : renderAiPanel()}
//             </aside>
//         </div>
//     );
// };

// export default ResumeEditor;




// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/api';
// import styles from './resumeeditor.module.css';
// import { FiSave, FiPlus, FiTrash2, FiEdit, FiArrowUp, FiArrowDown, FiRefreshCw, FiChevronDown, FiStar, FiZap, FiFileText, FiCheckCircle, FiBold } from 'react-icons/fi';

// // Modal component for adding a custom section (No Changes)
// const AddSectionModal = ({ onAddSection, onClose }) => {
//     const [sectionName, setSectionName] = useState('');
//     const [sectionType, setSectionType] = useState('list-with-bullets');

//     const handleAdd = () => {
//         if (sectionName.trim()) {
//             onAddSection(sectionName, sectionType);
//             onClose();
//         }
//     };

//     return (
//         <div className={styles.modalOverlay}>
//             <div className={styles.modalContent}>
//                 <h3>Add New Section</h3>
//                 <label>Section Name:</label>
//                 <input
//                     type="text"
//                     value={sectionName}
//                     onChange={(e) => setSectionName(e.target.value)}
//                     placeholder="e.g., Certifications, Volunteer Work"
//                 />
//                 <label>Section Type:</label>
//                 <select value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
//                     <option value="list-with-bullets">List with Bullet Points</option>
//                     <option value="single-input-and-description">Single Box with Description</option>
//                     <option value="single-text-area">Single Text Area</option>
//                 </select>
//                 <div className={styles.modalActions}>
//                     <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
//                     <button onClick={handleAdd} className={styles.addButton}>Add Section</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Re-usable input component with AI and bolding features (No Changes)
// const AiInputField = ({ path, value, placeholder, onChange, onImprove, improvingPath, type = 'input' }) => {
//     const isImproving = improvingPath === path;
//     const InputComponent = type === 'textarea' ? 'textarea' : 'input';

//     const handleBoldClick = () => {
//         const textToBold = window.getSelection().toString();
//         if (textToBold && value) {
//             const newText = value.replace(textToBold, `**${textToBold}**`);
//             onChange(path, newText);
//         }
//     };

//     return (
//         <div className={styles.inputWithAi}>
//             <InputComponent
//                 type={type === 'textarea' ? undefined : type}
//                 placeholder={placeholder}
//                 value={value || ''}
//                 onChange={e => onChange(path, e.target.value)}
//                 className={styles.inputField}
//             />
//             <div className={styles.inputControls}>
//                 <button onClick={handleBoldClick} className={styles.boldButton} title="Bold selected text">
//                     <FiBold />
//                 </button>
//                 <button onClick={() => onImprove(path, value)} className={styles.aiButton} title="Improve Writing with AI" disabled={isImproving}>
//                     {isImproving ? <FiRefreshCw className={styles.spinning} /> : <FiEdit />}
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Collapsible Section Component (No Changes)
// const Section = ({ title, children, sectionControls }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//         <div className={`${styles.formSection} ${isOpen ? styles.open : ''}`}>
//             <div className={styles.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
//                 <h3>{title}</h3>
//                 <div className={styles.sectionControls}>
//                     {sectionControls}
//                     <FiChevronDown className={styles.chevron} />
//                 </div>
//             </div>
//             <div className={styles.sectionContent}>{children}</div>
//         </div>
//     );
// };

// const ResumeEditor = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [resume, setResume] = useState(null);
//     const [pdfUrl, setPdfUrl] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [previewLoading, setPreviewLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [mode, setMode] = useState('EDIT');
//     const [jobDescription, setJobDescription] = useState('');
//     const [aiResult, setAiResult] = useState(null);
//     const [aiLoading, setAiLoading] = useState(false);
//     const [improvingText, setImprovingText] = useState(null);
//     const [isJobDescVisible, setIsJobDescVisible] = useState(true);
//     const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

//     // --- updatePreview: No changes from original ---
//     const updatePreview = useCallback(async () => {
//         if (!id || !resume) return;
//         setPreviewLoading(true);
//         setError('');
//         try {
//             const response = await api.post(`/api/resume/preview/${id}`, {
//                 resumeData: resume.resumeData,
//                 templateName: resume.templateName
//             }, { responseType: 'blob' });

//             const newPdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//             setPdfUrl(prevUrl => {
//                 if (prevUrl) window.URL.revokeObjectURL(prevUrl);
//                 return newPdfUrl;
//             });
//         } catch (err) {
//             console.error("Preview Error:", err);
//             setError("Failed to generate PDF preview.");
//         } finally {
//             setPreviewLoading(false);
//         }
//     }, [id, resume]);

//     // --- useEffect fetchResumeData: No changes from original ---
//     useEffect(() => {
//         const fetchResumeData = async () => {
//             if (!id) {
//                 navigate('/dashboard');
//                 return;
//             }
//             setLoading(true);
//             try {
//                 const { data } = await api.get(`/api/resume/${id}`);
//                 setResume(data);
//             } catch (err) {
//                 setError('Failed to load resume data.');
//                 navigate('/dashboard');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchResumeData();
//     }, [id, navigate]);
    
//     // --- useEffect pdfUrl cleanup: No changes from original ---
//     useEffect(() => {
//         return () => {
//             if (pdfUrl) {
//                 window.URL.revokeObjectURL(pdfUrl);
//             }
//         };
//     }, [pdfUrl]);

//     // Helper to get a nested property from an object using a string path
//     const getNestedValue = (obj, path) => {
//         if (!path) return obj;
//         return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
//     };

//     // --- handleDataChange: No changes from original ---
//     const handleDataChange = (path, value) => {
//         setResume(prev => {
//             if (!prev) return null;
            
//             let newPath = path;
//             if (path.startsWith('professionalSummary')) newPath = path.replace('professionalSummary', 'summary');
//             if (path.startsWith('workExperience')) newPath = path.replace('workExperience', 'experience');

//             const keys = newPath.split('.');
//             const newResumeData = structuredClone(prev.resumeData);

//             if (newPath.startsWith('summary') && newResumeData.hasOwnProperty('professionalSummary')) {
//                 delete newResumeData.professionalSummary;
//             }
//             if (newPath.startsWith('experience') && newResumeData.hasOwnProperty('workExperience')) {
//                 delete newResumeData.workExperience;
//             }

//             let current = newResumeData;
//             for (let i = 0; i < keys.length - 1; i++) {
//                 const key = keys[i];
//                 const nextKey = keys[i + 1];
//                 if (!current[key]) {
//                   current[key] = isNaN(parseInt(nextKey)) ? {} : [];
//                 }
//                 current = current[key];
//             }
//             current[keys[keys.length - 1]] = value;
//             return { ...prev, resumeData: newResumeData };
//         });
//     };

//     // --- handleSaveAndClose: No changes from original ---
//     const handleSaveAndClose = async () => {
//         if (!resume) return;
//         setSaving(true);
//         setError('');
//         try {
//             await api.put(`/api/resume/${id}`, { resumeData: resume.resumeData, templateName: resume.templateName });
//             navigate('/dashboard');
//         } catch (err) {
//             setError('Failed to save resume.');
//         } finally {
//             setSaving(false);
//         }
//     };
    
//     // --- handleImproveWriting: No changes from original ---
//     const handleImproveWriting = async (path, currentText) => {
//         if (!currentText || improvingText) return;
//         setImprovingText(path);
//         try {
//             const { data } = await api.post('/api/ai/improve', { text: currentText });
//             handleDataChange(path, data.improvedText);
//         } catch (err) {
//             alert("Could not improve text. Please try again.");
//         } finally {
//             setImprovingText(null);
//         }
//     };
    
//     // --- handleGetAtsScore: No changes from original ---
//     const handleGetAtsScore = async () => {
//         if (!resume) return;
//         setMode('ATS');
//         setAiLoading(true); setAiResult(null);
//         try {
//             const { data } = await api.post('/api/ai/atsscore', { resumeData: resume.resumeData });
//             setAiResult(data);
//         } catch (err) {
//             setAiResult({ error: err.response?.data?.message || 'Could not get ATS score.' });
//         } finally {
//             setAiLoading(false);
//         }
//     };
    
//     // --- handlePersonalize: No changes from original ---
//     const handlePersonalize = async () => {
//         if (!resume || !jobDescription.trim()) { alert("Please paste a job description first."); return; }
//         setIsJobDescVisible(false);
//         setAiLoading(true); setAiResult(null);
//         try {
//             const { data } = await api.post('/api/ai/personalize', { resumeData: resume.resumeData, jobDescription });
//             setAiResult(data);
//         } catch (err) {
//             setAiResult({ error: err.response?.data?.message || 'Error personalizing resume.' });
//         } finally {
//             setAiLoading(false);
//         }
//     };
    
//     // *** POINT 6 FIX: Replaced addArrayItem/removeArrayItem with path-aware versions ***
//     const addArrayItem = (path, defaultItem = {}) => {
//         if (!resume) return;
//         const currentItems = getNestedValue(resume.resumeData, path) || [];
//         // Ensure we're adding to an array
//         const itemsArray = Array.isArray(currentItems) ? currentItems : [];
//         handleDataChange(path, [...itemsArray, defaultItem]);
//     };

//     const removeArrayItem = (path, index) => {
//         if (!resume) return;
//         const currentItems = getNestedValue(resume.resumeData, path) || [];
//         if (!Array.isArray(currentItems)) return; // Do nothing if it's not an array
//         handleDataChange(path, currentItems.filter((_, i) => i !== index));
//     };
    
//     // --- addSection: No changes from original ---
//     const addSection = (name, type) => {
//         const newSectionKey = name.toLowerCase().replace(/\s+/g, '');
//         const newSections = [...(resume.resumeData.sections || []), { key: newSectionKey, title: name, isCustom: true, type }];
        
//         const newResumeData = { ...resume.resumeData };
//         if (type === 'list-with-bullets') {
//             newResumeData[newSectionKey] = [{ title: '', bulletPoints: [''] }];
//         } else if (type === 'single-text-area') {
//             newResumeData[newSectionKey] = '';
//         } else if (type === 'single-input-and-description') {
//             newResumeData[newSectionKey] = [{ title: '', description: '' }];
//         }
        
//         setResume(prev => ({ ...prev, resumeData: {...newResumeData, sections: newSections} }));
//     };

//     // --- deleteSection: No changes from original ---
//     const deleteSection = (sectionKey) => {
//         if (!resume || !window.confirm('Are you sure you want to delete this entire section?')) return;
//         setResume(prev => {
//             const newResumeData = structuredClone(prev.resumeData);
//             newResumeData.sections = newResumeData.sections.filter(sec => sec.key !== sectionKey);
//             delete newResumeData[sectionKey];
//             return { ...prev, resumeData: newResumeData };
//         });
//     };

//     // --- moveSection: No changes from original ---
//     const moveSection = (index, direction) => {
//         if (!resume) return;
//         const sections = [...resume.resumeData.sections];
//         const newIndex = index + direction;
//         if (newIndex < 0 || newIndex >= sections.length) return;
//         const [movedSection] = sections.splice(index, 1);
//         sections.splice(newIndex, 0, movedSection);
//         handleDataChange('sections', sections);
//     };

//     // --- RENDER METHODS ---
//     // --- renderPersonalDetails: Removed professionalTitle field to match PDF ---
//     const renderPersonalDetails = () => (
//         <div className={styles.sectionFields}>
//             <div className={styles.inputGroup}><label>Your Name</label><AiInputField path="personalDetails.name" value={resume.resumeData.personalDetails?.name} placeholder="Pavan Sai Kumar" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//             {/* <div className={styles.inputGroup}><label>Professional Title</label><AiInputField path="personalDetails.professionalTitle" value={resume.resumeData.personalDetails?.professionalTitle} placeholder="Professional Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div> */}
//             <div className={styles.inputGroup}><label>Email Address</label><AiInputField path="personalDetails.email" value={resume.resumeData.personalDetails?.email} placeholder="your.email@example.com" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="email" /></div>
//             <div className={styles.inputGroup}><label>Phone Number</label><AiInputField path="personalDetails.phone" value={resume.resumeData.personalDetails?.phone} placeholder="123-456-7890" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="tel" /></div>
//             <div className={styles.inputGroup}><label>LinkedIn</label><AiInputField path="personalDetails.linkedin" value={resume.resumeData.personalDetails?.linkedin} placeholder="linkedin.com/in/yourprofile" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//             <div className={styles.inputGroup}><label>GitHub URL</label><AiInputField path="personalDetails.github" value={resume.resumeData.personalDetails?.github} placeholder="github.com/yourusername" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
//         </div>
//     );

//     // --- renderProfessionalSummary: No changes from original ---
//     const renderProfessionalSummary = () => (
//         <div className={styles.sectionFields}><label>Professional Summary</label><AiInputField path="summary" value={resume.resumeData.summary ?? resume.resumeData.professionalSummary} placeholder="A brief professional summary about you..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>
//     );

//     // *** POINT 6 FIX: Modified renderWorkExperience ***
//     const renderWorkExperience = () => {
//         const experienceItems = resume.resumeData.experience ?? resume.resumeData.workExperience;
//         return (
//             <div className={styles.sectionFields}>
//                 {(experienceItems || []).map((exp, index) => (
//                     <div key={index} className={styles.subsection}>
//                         <div className={styles.subsectionHeader}>
//                             <h4>{exp.jobTitle || `Work Experience ${index + 1}`}</h4>
//                             <button onClick={() => removeArrayItem('experience', index)} title="Remove Experience"><FiTrash2 /></button>
//                         </div>
//                         <AiInputField path={`experience.${index}.jobTitle`} value={exp.jobTitle} placeholder="Job Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//                         <AiInputField path={`experience.${index}.company`} value={exp.company} placeholder="Company Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//                         <AiInputField path={`experience.${index}.location`} value={exp.location} placeholder="City, State" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//                         <AiInputField path={`experience.${index}.duration`} value={exp.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
                        
//                         {/* --- Start Description Handling (as bullet points) --- */}
//                         <label>Description (Bullet Points):</label>
//                         <div className={styles.bulletPoints}>
//                             {/* Ensure exp.description is an array before mapping */}
//                             {(Array.isArray(exp.description) ? exp.description : []).map((point, bulletIndex) => (
//                                 <div key={bulletIndex} className={styles.bulletItem}>
//                                     <AiInputField
//                                         path={`experience.${index}.description.${bulletIndex}`}
//                                         value={point}
//                                         placeholder="Responsibility or achievement..."
//                                         onChange={handleDataChange}
//                                         onImprove={handleImproveWriting}
//                                         improvingPath={improvingText}
//                                         type="textarea"
//                                     />
//                                     <button onClick={() => removeArrayItem(`experience.${index}.description`, bulletIndex)} title="Remove Bullet Point">
//                                         <FiTrash2 />
//                                     </button>
//                                 </div>
//                             ))}
//                             {/* Button to add a new bullet point to the description array */}
//                             <button onClick={() => addArrayItem(`experience.${index}.description`, '')} className={styles.addButton}>
//                                 <FiPlus /> Add Bullet Point
//                             </button>
//                         </div>
//                         {/* --- End Description Handling --- */}
//                     </div>
//                 ))}
//                 {/* Button to add a new experience item with description as an array */}
//                 <button onClick={() => addArrayItem('experience', { jobTitle: '', company: '', location: '', duration: '', description: [''] })} className={styles.addButton}>
//                     <FiPlus /> Add Experience
//                 </button>
//             </div>
//         );
//     }
//     // *** END MODIFIED renderWorkExperience ***


//     // --- renderProjects: Removed description field, fixed add button ---
//     const renderProjects = () => (<div className={styles.sectionFields}>{(resume.resumeData.projects || []).map((project, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{project.projectTitle || `Project ${index + 1}`}</h4><button onClick={() => removeArrayItem('projects', index)}><FiTrash2 /></button></div><AiInputField path={`projects.${index}.projectTitle`} value={project.projectTitle} placeholder="Project Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//         {/* <AiInputField path={`projects.${index}.description`} value={project.description} placeholder="A brief overview of the project..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /> */}
//         <div className={styles.bulletPoints}>{(project.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`projects.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="A specific feature you implemented..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><button onClick={() => removeArrayItem(`projects.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`projects.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}
//         <button onClick={() => addArrayItem('projects', { bulletPoints: [''] })} className={styles.addButton}><FiPlus /> Add Project</button>
//     </div>);

//     // --- renderEducation: Added GPA field, fixed add button ---
//     const renderEducation = () => (<div className={styles.sectionFields}>{(resume.resumeData.education || []).map((edu, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{edu.universityName || `Education ${index + 1}`}</h4><button onClick={() => removeArrayItem('education', index)}><FiTrash2 /></button></div><div className={styles.inputRow}><AiInputField path={`education.${index}.universityName`} value={edu.universityName} placeholder="University Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`education.${index}.degree`} value={edu.degree} placeholder="Your Degree" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div><AiInputField path={`education.${index}.duration`} value={edu.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//         {/* *** ADDED GPA Field like PDF *** */}
//         <AiInputField path={`education.${index}.gpa`} value={edu.gpa} placeholder="GPA or Score (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
//     </div>))}<button onClick={() => addArrayItem('education', { gpa: '' })} className={styles.addButton}><FiPlus /> Add Education</button></div>);

//     // --- renderSkills: Changed AiInputField to textarea for better multiline editing ---
//     const renderSkills = () => (<div className={styles.sectionFields}>{(resume.resumeData.skills || []).map((skillGroup, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{`Skill Group ${index + 1}`}</h4><button onClick={() => removeArrayItem('skills', index)}><FiTrash2 /></button></div>
//         <AiInputField 
//             path={`skills.${index}`} 
//             value={skillGroup} 
//             placeholder="Programming: C++, C | Frontend: React..." 
//             onChange={handleDataChange} 
//             onImprove={handleImproveWriting} 
//             improvingPath={improvingText}
//             type="textarea" // Use textarea for easier editing
//         />
//     </div>))}<button onClick={() => addArrayItem('skills', '')} className={styles.addButton}><FiPlus /> Add Skill Group</button></div>);

//     // --- renderCustomSection: Fixed add button ---
//     const renderCustomSection = (section) => (
//         <div className={styles.sectionFields}>
//             {section.type === 'list-with-bullets' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><div className={styles.bulletPoints}>{(item.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`${section.key}.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="Bullet Point" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><button onClick={() => removeArrayItem(`${section.key}.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`${section.key}.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}
//             <button onClick={() => addArrayItem(section.key, { bulletPoints: [''] })} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) :
//             section.type === 'single-text-area' ? (<AiInputField path={section.key} value={resume.resumeData[section.key]} placeholder={`Enter details for ${section.title}`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" />) :
//             section.type === 'single-input-and-description' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`${section.key}.${index}.description`} value={item.description} placeholder="Description" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>))}<button onClick={() => addArrayItem(section.key, {})} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) : null}
//         </div>
//     );

//     // --- renderEditorPanel: No changes from original ---
//     const renderEditorPanel = () => (
//         <><div className={styles.panelContent}><header className={styles.header}><h2 className={styles.title}>{resume.resumeData.personalDetails?.name || 'Untitled Resume'}</h2><button onClick={() => setIsAddSectionModalOpen(true)} className={styles.actionButton}><FiPlus /> Add Section</button></header>{(resume.resumeData.sections || []).map((section, index) => (<Section key={`${section.key}-${index}`} title={section.title} sectionControls={<><button onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }} disabled={index === 0} title="Move Up"><FiArrowUp /></button><button onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }} disabled={index === resume.resumeData.sections.length - 1} title="Move Down"><FiArrowDown /></button>{section.isCustom && <button onClick={(e) => { e.stopPropagation(); deleteSection(section.key, index); }} title="Delete Section"><FiTrash2/></button>}</>}>{section.key === 'personalDetails' && renderPersonalDetails()}{(section.key === 'summary' || section.key === 'professionalSummary') && renderProfessionalSummary()}{(section.key === 'experience' || section.key === 'workExperience') && renderWorkExperience()}{section.key === 'projects' && renderProjects()}{section.key === 'education' && renderEducation()}{section.key === 'skills' && renderSkills()}{section.isCustom && renderCustomSection(section)}</Section>))}</div>{isAddSectionModalOpen && <AddSectionModal onAddSection={addSection} onClose={() => setIsAddSectionModalOpen(false)} />}</>
//     );

//     // --- renderAiPanel: Using the correct, detailed version from your prompt ---
//     const renderAiPanel = () => {
//         if (mode === 'ATS') {
//             return (
//                 <div className={`${styles.aiPanel} ${styles.panelContent}`}>
//                     <h2>ATS Score & Analysis</h2>
//                     {aiLoading ? (
//                         <div className={styles.centeredMessage}>Analyzing...</div>
//                     ) : aiResult ? (
//                         <div className={styles.aiResults}>
//                             {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}
//                             {aiResult.score !== undefined && (
//                                 <div className={styles.scoreCircle} style={{'--score': `${aiResult.score * 3.6}deg`}}>
//                                     <span>{aiResult.score}<small>/100</small></span>
//                                 </div>
//                             )}
//                             {aiResult.summary && <p className={styles.summary}>{aiResult.summary}</p>}
//                             {aiResult.suggestions && aiResult.suggestions.length > 0 && (
//                                 <div className={styles.aiFeedbackSection}>
//                                     <h3>Actionable Suggestions</h3>
//                                     <ul className={styles.suggestionList}>
//                                         {aiResult.suggestions.map((s, i) => <li key={i}><FiCheckCircle /> {s}</li>)}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                          <div className={styles.centeredMessage}>Click "ATS Score" to analyze.</div>
//                     )}
//                 </div>
//             );
//         }

//         if (mode === 'PERSONALIZE') {
//             return (
//                 <div className={`${styles.aiPanel} ${styles.panelContent}`}>
//                     {/* Job Description Section */}
//                     <div className={styles.jobDescriptionContainer}>
//                         <div className={styles.jobDescriptionHeader} onClick={() => setIsJobDescVisible(!isJobDescVisible)}>
//                             <h3><FiFileText /> Job Description</h3>
//                             <FiChevronDown className={`${styles.chevron} ${isJobDescVisible ? styles.open : ''}`} />
//                         </div>
//                         {isJobDescVisible && (
//                             <div className={styles.jobDescriptionContent}>
//                                 <textarea
//                                     value={jobDescription}
//                                     onChange={(e) => setJobDescription(e.target.value)}
//                                     placeholder="Paste the full job description here..."
//                                 />
//                                 <button onClick={handlePersonalize} disabled={aiLoading || !jobDescription.trim()} className={styles.aiActionButton}>
//                                     {aiLoading ? 'Personalizing...' : <><FiZap /> Personalize Resume</>}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* AI Results Display Area */}
//                     <div className={styles.aiResults}>
//                         {aiLoading && <div className={styles.centeredMessage}>Our AI is crafting your personalized feedback...</div>}

//                         {/* --- START: Corrected Rendering Logic --- */}
//                         {aiResult && !aiLoading && (
//                             <>
//                                 {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}

//                                 {aiResult.strategicFeedback && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3><FiStar /> Strategic Feedback</h3>
//                                         <p>{aiResult.strategicFeedback}</p>
//                                     </div>
//                                 )}

//                                 {aiResult.summary && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Summary</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.summary.feedback}</p>
//                                         <p><strong>Rewritten:</strong> {aiResult.summary.rewrittenText}</p>
//                                     </div>
//                                 )}

//                                 {aiResult.experience && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Experience</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.experience.feedback}</p>
//                                         {aiResult.experience.rewrittenItems && aiResult.experience.rewrittenItems.length > 0 && (
//                                             <>
//                                                 <h4>Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.experience.rewrittenItems.map((item, index) => (
//                                                         <li key={`exp-${index}`}>
//                                                             <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                             <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.projects && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Projects</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.projects.feedback}</p>
//                                         {aiResult.projects.rewrittenItems && aiResult.projects.rewrittenItems.length > 0 && (
//                                              <>
//                                                 <h4>Rewrite Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.projects.rewrittenItems.map((item, index) => (
//                                                         <li key={`proj-rewrite-${index}`}>
//                                                             <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                             <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                              </>
//                                         )}
//                                         {aiResult.projects.newProjectIdeas && aiResult.projects.newProjectIdeas.length > 0 && (
//                                             <>
//                                                 <h4>New Project Ideas:</h4>
//                                                 <ul>
//                                                     {aiResult.projects.newProjectIdeas.map((idea, index) => (
//                                                         <li key={`proj-idea-${index}`}>{idea}</li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.education && (
//                                      <div className={styles.aiFeedbackSection}>
//                                         <h3>Education</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.education.feedback}</p>
//                                         {aiResult.education.rewrittenItems && aiResult.education.rewrittenItems.length > 0 && (
//                                              <>
//                                                 <h4>Suggestions:</h4>
//                                                 <ul>
//                                                     {aiResult.education.rewrittenItems.map((item, index) => (
//                                                         <li key={`edu-${index}`}>
//                                                              <strong>Original:</strong> {item.original || 'N/A'}<br />
//                                                              <strong>Suggestion:</strong> {item.suggestion}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}

//                                 {aiResult.skills && (
//                                     <div className={styles.aiFeedbackSection}>
//                                         <h3>Skills</h3>
//                                         <p><strong>Feedback:</strong> {aiResult.skills.feedback}</p>
//                                         {aiResult.skills.missingSkills && aiResult.skills.missingSkills.length > 0 && (
//                                             <>
//                                                 <h4>Missing Skills to Add:</h4>
//                                                 <ul>
//                                                     {aiResult.skills.missingSkills.map((skill, index) => (
//                                                         <li key={`skill-missing-${index}`}>{skill}</li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                         {aiResult.skills.suggestedSkillsList && (
//                                             <p><strong>Suggested List:</strong> {aiResult.skills.suggestedSkillsList}</p>
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                         {/* --- END: Corrected Rendering Logic --- */}

//                         {/* Message if no results yet */}
//                         {!aiResult && !aiLoading && (
//                              <div className={styles.centeredMessage}>Paste a job description and click "Personalize Resume".</div>
//                         )}
//                     </div>
//                 </div>
//             );
//         }

//         return null; // Should not happen in normal flow
//     };
//     // *** END UPDATED renderAiPanel Function ***

//     // --- renderPreviewPanel: No changes from original ---
//     const renderPreviewPanel = () => (
//         <div className={styles.previewPanel}><div className={styles.previewHeader}><h3>Live Preview</h3><button onClick={updatePreview} disabled={previewLoading} className={styles.updatePreviewButton}><FiRefreshCw className={previewLoading ? styles.spinning : ''} /><span>Refresh</span></button></div><div className={styles.pdfViewer}>{error && <div className={styles.centeredMessage}>{error}</div>}{!error && pdfUrl && <iframe src={pdfUrl} title="Resume Preview" className={styles.pdfPreview} />}{!error && !pdfUrl && <div className={styles.centeredMessage}>{previewLoading ? 'Generating...' : 'No Preview Available'}</div>}</div></div>
//     );

//     // --- Loading/Return: No changes from original ---
//     if (loading || !resume) return <div className={styles.centeredMessage}>Loading Editor...</div>;
    
//     return (
//         <div className={styles.editorLayout}>
//             <header className={styles.controlsHeader}>
//                 <div className={styles.controls}>
//                     <button onClick={() => setMode('EDIT')} className={mode === 'EDIT' ? styles.active : ''} data-tooltip="Editor">Edit</button>
//                     <button onClick={handleGetAtsScore} className={mode === 'ATS' ? styles.active : ''} data-tooltip="ATS Score & Analysis">ATS Score</button>
//                     <button onClick={() => { setMode('PERSONALIZE'); setAiResult(null); }} className={mode === 'PERSONALIZE' ? styles.active : ''} data-tooltip="Personalize with AI for a Job">Personalize</button>
//                 </div>
//                 <button onClick={handleSaveAndClose} disabled={saving} className={styles.saveButton} data-tooltip="Save and exit">
//                     <FiSave /> {saving ? 'Saving...' : 'Save & Close'}
//                 </button>
//             </header>

//             <main className={styles.leftPanelContainer}>
//                 {(mode === 'EDIT' || mode === 'PERSONALIZE') ? renderEditorPanel() : renderAiPanel()}
//             </main>
            
//             <aside className={styles.rightPanelContainer}>
//                 {(mode === 'EDIT' || mode === 'ATS') ? renderPreviewPanel() : renderAiPanel()}
//             </aside>
//         </div>
//     );
// };

// export default ResumeEditor;


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './resumeeditor.module.css';
import { FiSave, FiPlus, FiTrash2, FiEdit, FiArrowUp, FiArrowDown, FiRefreshCw, FiChevronDown, FiStar, FiZap, FiFileText, FiCheckCircle, FiBold } from 'react-icons/fi';

// Modal component for adding a custom section (No Changes)
const AddSectionModal = ({ onAddSection, onClose }) => {
    const [sectionName, setSectionName] = useState('');
    const [sectionType, setSectionType] = useState('list-with-bullets');

    const handleAdd = () => {
        if (sectionName.trim()) {
            onAddSection(sectionName, sectionType);
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Add New Section</h3>
                <label>Section Name:</label>
                <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="e.g., Certifications, Volunteer Work"
                />
                <label>Section Type:</label>
                <select value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
                    <option value="list-with-bullets">List with Bullet Points</option>
                    <option value="single-input-and-description">Single Box with Description</option>
                    <option value="single-text-area">Single Text Area</option>
                </select>
                <div className={styles.modalActions}>
                    <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    <button onClick={handleAdd} className={styles.addButton}>Add Section</button>
                </div>
            </div>
        </div>
    );
};

// Re-usable input component with AI and bolding features (No Changes)
const AiInputField = ({ path, value, placeholder, onChange, onImprove, improvingPath, type = 'input' }) => {
    const isImproving = improvingPath === path;
    const InputComponent = type === 'textarea' ? 'textarea' : 'input';

    const handleBoldClick = () => {
        const textToBold = window.getSelection().toString();
        if (textToBold && value) {
            const newText = value.replace(textToBold, `**${textToBold}**`);
            onChange(path, newText);
        }
    };

    return (
        <div className={styles.inputWithAi}>
            <InputComponent
                type={type === 'textarea' ? undefined : type}
                placeholder={placeholder}
                value={value || ''}
                onChange={e => onChange(path, e.target.value)}
                className={styles.inputField}
            />
            <div className={styles.inputControls}>
                <button onClick={handleBoldClick} className={styles.boldButton} title="Bold selected text">
                    <FiBold />
                </button>
                <button onClick={() => onImprove(path, value)} className={styles.aiButton} title="Improve Writing with AI" disabled={isImproving}>
                    {isImproving ? <FiRefreshCw className={styles.spinning} /> : <FiEdit />}
                </button>
            </div>
        </div>
    );
};

// Collapsible Section Component (No Changes)
const Section = ({ title, children, sectionControls }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className={`${styles.formSection} ${isOpen ? styles.open : ''}`}>
            <div className={styles.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <div className={styles.sectionControls}>
                    {sectionControls}
                    <FiChevronDown className={styles.chevron} />
                </div>
            </div>
            <div className={styles.sectionContent}>{children}</div>
        </div>
    );
};

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('EDIT');
    const [jobDescription, setJobDescription] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [improvingText, setImprovingText] = useState(null);
    const [isJobDescVisible, setIsJobDescVisible] = useState(true);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

    // --- updatePreview: No changes from original ---
    const updatePreview = useCallback(async () => {
        if (!id || !resume) return;
        setPreviewLoading(true);
        setError('');
        try {
            const response = await api.post(`/api/resume/preview/${id}`, {
                resumeData: resume.resumeData,
                templateName: resume.templateName
            }, { responseType: 'blob' });

            const newPdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfUrl(prevUrl => {
                if (prevUrl) window.URL.revokeObjectURL(prevUrl);
                return newPdfUrl;
            });
        } catch (err) {
            console.error("Preview Error:", err);
            setError("Failed to generate PDF preview.");
        } finally {
            setPreviewLoading(false);
        }
    }, [id, resume]);

    // --- useEffect fetchResumeData: No changes from original ---
    useEffect(() => {
        const fetchResumeData = async () => {
            if (!id) {
                navigate('/dashboard');
                return;
            }
            setLoading(true);
            try {
                const { data } = await api.get(`/api/resume/${id}`);
                setResume(data);
            } catch (err) {
                setError('Failed to load resume data.');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchResumeData();
    }, [id, navigate]);
    
    // --- useEffect pdfUrl cleanup: No changes from original ---
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    // --- getNestedValue: No changes from original ---
    const getNestedValue = (obj, path) => {
        if (!path) return obj;
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    };

    // --- handleDataChange: No changes from original ---
    const handleDataChange = (path, value) => {
        setResume(prev => {
            if (!prev) return null;
            
            let newPath = path;
            if (path.startsWith('professionalSummary')) newPath = path.replace('professionalSummary', 'summary');
            if (path.startsWith('workExperience')) newPath = path.replace('workExperience', 'experience');

            const keys = newPath.split('.');
            const newResumeData = structuredClone(prev.resumeData);

            if (newPath.startsWith('summary') && newResumeData.hasOwnProperty('professionalSummary')) {
                delete newResumeData.professionalSummary;
            }
            if (newPath.startsWith('experience') && newResumeData.hasOwnProperty('workExperience')) {
                delete newResumeData.workExperience;
            }

            let current = newResumeData;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                const nextKey = keys[i + 1];
                if (!current[key]) {
                  current[key] = isNaN(parseInt(nextKey)) ? {} : [];
                }
                current = current[key];
            }
            current[keys[keys.length - 1]] = value;
            return { ...prev, resumeData: newResumeData };
        });
    };

    // --- handleSaveAndClose: No changes from original ---
    const handleSaveAndClose = async () => {
        if (!resume) return;
        setSaving(true);
        setError('');
        try {
            await api.put(`/api/resume/${id}`, { resumeData: resume.resumeData, templateName: resume.templateName });
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to save resume.');
        } finally {
            setSaving(false);
        }
    };
    
    // --- handleImproveWriting: No changes from original ---
    const handleImproveWriting = async (path, currentText) => {
        if (!currentText || improvingText) return;
        setImprovingText(path);
        try {
            const { data } = await api.post('/api/ai/improve', { text: currentText });
            handleDataChange(path, data.improvedText);
        } catch (err) {
            alert("Could not improve text. Please try again.");
        } finally {
            setImprovingText(null);
        }
    };
    
    // --- handleGetAtsScore: No changes from original ---
    const handleGetAtsScore = async () => {
        if (!resume) return;
        setMode('ATS');
        setAiLoading(true); setAiResult(null);
        try {
            const { data } = await api.post('/api/ai/atsscore', { resumeData: resume.resumeData });
            setAiResult(data);
        } catch (err) {
            setAiResult({ error: err.response?.data?.message || 'Could not get ATS score.' });
        } finally {
            setAiLoading(false);
        }
    };
    
    // --- handlePersonalize: No changes from original ---
    const handlePersonalize = async () => {
        if (!resume || !jobDescription.trim()) { alert("Please paste a job description first."); return; }
        setIsJobDescVisible(false);
        setAiLoading(true); setAiResult(null);
        try {
            const { data } = await api.post('/api/ai/personalize', { resumeData: resume.resumeData, jobDescription });
            setAiResult(data);
        } catch (err) {
            setAiResult({ error: err.response?.data?.message || 'Error personalizing resume.' });
        } finally {
            setAiLoading(false);
        }
    };
    
    // *** FIX: Reverted to your original (correct) path-aware array helpers ***
    const addArrayItem = (path, defaultItem = {}) => {
        if (!resume) return;
        const currentItems = getNestedValue(resume.resumeData, path) || [];
        // Ensure we're adding to an array
        const itemsArray = Array.isArray(currentItems) ? currentItems : [];
        handleDataChange(path, [...itemsArray, defaultItem]);
    };

    const removeArrayItem = (path, index) => {
        if (!resume) return;
        const currentItems = getNestedValue(resume.resumeData, path) || [];
        if (!Array.isArray(currentItems)) return; // Do nothing if it's not an array
        handleDataChange(path, currentItems.filter((_, i) => i !== index));
    };
    
    // --- addSection: Added 'link' to default items ---
    const addSection = (name, type) => {
        const newSectionKey = name.toLowerCase().replace(/\s+/g, '');
        const newSections = [...(resume.resumeData.sections || []), { key: newSectionKey, title: name, isCustom: true, type }];
        
        const newResumeData = { ...resume.resumeData };
        if (type === 'list-with-bullets') {
            // *** ADDED link ***
            newResumeData[newSectionKey] = [{ title: '', bulletPoints: [''], link: '' }];
        } else if (type === 'single-text-area') {
            newResumeData[newSectionKey] = '';
        } else if (type === 'single-input-and-description') {
            // *** ADDED link ***
            newResumeData[newSectionKey] = [{ title: '', description: '', link: '' }];
        }
        
        setResume(prev => ({ ...prev, resumeData: {...newResumeData, sections: newSections} }));
    };

    // --- deleteSection: No changes from original ---
    const deleteSection = (sectionKey) => {
        if (!resume || !window.confirm('Are you sure you want to delete this entire section?')) return;
        setResume(prev => {
            const newResumeData = structuredClone(prev.resumeData);
            newResumeData.sections = newResumeData.sections.filter(sec => sec.key !== sectionKey);
            delete newResumeData[sectionKey];
            return { ...prev, resumeData: newResumeData };
        });
    };

    // --- moveSection: No changes from original ---
    const moveSection = (index, direction) => {
        if (!resume) return;
        const sections = [...resume.resumeData.sections];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const [movedSection] = sections.splice(index, 1);
        sections.splice(newIndex, 0, movedSection);
        handleDataChange('sections', sections);
    };

    // --- RENDER METHODS ---
    // --- renderPersonalDetails: Removed professionalTitle field ---
    const renderPersonalDetails = () => (
        <div className={styles.sectionFields}>
            <div className={styles.inputGroup}><label>Your Name</label><AiInputField path="personalDetails.name" value={resume.resumeData.personalDetails?.name} placeholder="Pavan Sai Kumar" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
            {/* <div className={styles.inputGroup}><label>Professional Title</label><AiInputField path="personalDetails.professionalTitle" value={resume.resumeData.personalDetails?.professionalTitle} placeholder="Professional Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div> */}
            <div className={styles.inputGroup}><label>Email Address</label><AiInputField path="personalDetails.email" value={resume.resumeData.personalDetails?.email} placeholder="your.email@example.com" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="email" /></div>
            <div className={styles.inputGroup}><label>Phone Number</label><AiInputField path="personalDetails.phone" value={resume.resumeData.personalDetails?.phone} placeholder="123-456-7890" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="tel" /></div>
            <div className={styles.inputGroup}><label>LinkedIn</label><AiInputField path="personalDetails.linkedin" value={resume.resumeData.personalDetails?.linkedin} placeholder="linkedin.com/in/yourprofile" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
            <div className={styles.inputGroup}><label>GitHub URL</label><AiInputField path="personalDetails.github" value={resume.resumeData.personalDetails?.github} placeholder="github.com/yourusername" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div>
        </div>
    );

    // --- renderProfessionalSummary: No changes from original ---
    const renderProfessionalSummary = () => (
        <div className={styles.sectionFields}><label>Professional Summary</label><AiInputField path="summary" value={resume.resumeData.summary ?? resume.resumeData.professionalSummary} placeholder="A brief professional summary about you..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>
    );

    // *** POINT 6 & NEW LINK FIX: Modified renderWorkExperience ***
    const renderWorkExperience = () => {
        const experienceItems = resume.resumeData.experience ?? resume.resumeData.workExperience;
        return (
            <div className={styles.sectionFields}>
                {(experienceItems || []).map((exp, index) => (
                    <div key={index} className={styles.subsection}>
                        <div className={styles.subsectionHeader}>
                            <h4>{exp.jobTitle || `Work Experience ${index + 1}`}</h4>
                            <button onClick={() => removeArrayItem('experience', index)} title="Remove Experience"><FiTrash2 /></button>
                        </div>
                        <AiInputField path={`experience.${index}.jobTitle`} value={exp.jobTitle} placeholder="Job Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
                        <AiInputField path={`experience.${index}.company`} value={exp.company} placeholder="Company Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
                        <AiInputField path={`experience.${index}.location`} value={exp.location} placeholder="City, State" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
                        <AiInputField path={`experience.${index}.duration`} value={exp.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
                        {/* *** ADDED LINK FIELD *** */}
                        <AiInputField path={`experience.${index}.link`} value={exp.link} placeholder="Link (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />

                        {/* --- Start Description Handling (as bullet points) --- */}
                        <label>Description (Bullet Points):</label>
                        <div className={styles.bulletPoints}>
                            {/* Ensure exp.description is an array before mapping */}
                            {(Array.isArray(exp.description) ? exp.description : []).map((point, bulletIndex) => (
                                <div key={bulletIndex} className={styles.bulletItem}>
                                    <AiInputField
                                        path={`experience.${index}.description.${bulletIndex}`}
                                        value={point}
                                        placeholder="Responsibility or achievement..."
                                        onChange={handleDataChange}
                                        onImprove={handleImproveWriting}
                                        improvingPath={improvingText}
                                        type="textarea"
                                    />
                                    <button onClick={() => removeArrayItem(`experience.${index}.description`, bulletIndex)} title="Remove Bullet Point">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                            {/* Button to add a new bullet point to the description array */}
                            <button onClick={() => addArrayItem(`experience.${index}.description`, '')} className={styles.addButton}>
                                <FiPlus /> Add Bullet Point
                            </button>
                        </div>
                        {/* --- End Description Handling --- */}
                    </div>
                ))}
                {/* Button to add a new experience item with description as an array */}
                <button onClick={() => addArrayItem('experience', { jobTitle: '', company: '', location: '', duration: '', description: [''], link: '' })} className={styles.addButton}>
                    <FiPlus /> Add Experience
                </button>
            </div>
        );
    }
    // *** END MODIFIED renderWorkExperience ***


    // *** NEW LINK FIX: Modified renderProjects ***
    const renderProjects = () => (<div className={styles.sectionFields}>{(resume.resumeData.projects || []).map((project, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{project.projectTitle || `Project ${index + 1}`}</h4><button onClick={() => removeArrayItem('projects', index)}><FiTrash2 /></button></div><AiInputField path={`projects.${index}.projectTitle`} value={project.projectTitle} placeholder="Project Title" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
        {/* *** ADDED LINK FIELD *** */}
        <AiInputField path={`projects.${index}.link`} value={project.link} placeholder="Project Link (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
        {/* <AiInputField path={`projects.${index}.description`} value={project.description} placeholder="A brief overview of the project..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /> */}
        <div className={styles.bulletPoints}>{(project.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`projects.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="A specific feature you implemented..." onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /><button onClick={() => removeArrayItem(`projects.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`projects.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}
        <button onClick={() => addArrayItem('projects', { bulletPoints: [''], link: '' })} className={styles.addButton}><FiPlus /> Add Project</button>
    </div>);

    // *** NEW LINK FIX: Modified renderEducation ***
    const renderEducation = () => (<div className={styles.sectionFields}>{(resume.resumeData.education || []).map((edu, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{edu.universityName || `Education ${index + 1}`}</h4><button onClick={() => removeArrayItem('education', index)}><FiTrash2 /></button></div><div className={styles.inputRow}><AiInputField path={`education.${index}.universityName`} value={edu.universityName} placeholder="University Name" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><AiInputField path={`education.${index}.degree`} value={edu.degree} placeholder="Your Degree" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /></div><AiInputField path={`education.${index}.duration`} value={edu.duration} placeholder="Month Year - Month Year" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
        <AiInputField path={`education.${index}.gpa`} value={edu.gpa} placeholder="GPA or Score (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
        {/* *** ADDED LINK FIELD *** */}
        <AiInputField path={`education.${index}.link`} value={edu.link} placeholder="Link (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
    </div>))}<button onClick={() => addArrayItem('education', { gpa: '', link: '' })} className={styles.addButton}><FiPlus /> Add Education</button></div>);

    // --- renderSkills: Changed AiInputField to textarea ---
    const renderSkills = () => (<div className={styles.sectionFields}>{(resume.resumeData.skills || []).map((skillGroup, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{`Skill Group ${index + 1}`}</h4><button onClick={() => removeArrayItem('skills', index)}><FiTrash2 /></button></div>
        <AiInputField 
            path={`skills.${index}`} 
            value={skillGroup} 
            placeholder="Programming: C++, C | Frontend: React..." 
            onChange={handleDataChange} 
            onImprove={handleImproveWriting} 
            improvingPath={improvingText}
            type="textarea" // Use textarea for easier editing
        />
    </div>))}<button onClick={() => addArrayItem('skills', '')} className={styles.addButton}><FiPlus /> Add Skill Group</button></div>);

    // *** NEW LINK FIX: Modified renderCustomSection ***
    const renderCustomSection = (section) => (
        <div className={styles.sectionFields}>
            {section.type === 'list-with-bullets' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
            {/* *** ADDED LINK FIELD *** */}
            <AiInputField path={`${section.key}.${index}.link`} value={item.link} placeholder="Link (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
            <div className={styles.bulletPoints}>{(item.bulletPoints || []).map((point, bulletIndex) => (<div key={bulletIndex} className={styles.bulletItem}><AiInputField path={`${section.key}.${index}.bulletPoints.${bulletIndex}`} value={point} placeholder="Bullet Point" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} /><button onClick={() => removeArrayItem(`${section.key}.${index}.bulletPoints`, bulletIndex)}><FiTrash2 /></button></div>))}<button onClick={() => addArrayItem(`${section.key}.${index}.bulletPoints`, '')} className={styles.addButton}><FiPlus /> Add Bullet Point</button></div></div>))}
            <button onClick={() => addArrayItem(section.key, { bulletPoints: [''], link: '' })} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) :
            
            section.type === 'single-text-area' ? (<AiInputField path={section.key} value={resume.resumeData[section.key]} placeholder={`Enter details for ${section.title}`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" />) :
            
            section.type === 'single-input-and-description' ? (<>{(resume.resumeData[section.key] || []).map((item, index) => (<div key={index} className={styles.subsection}><div className={styles.subsectionHeader}><h4>{item.title || `${section.title} ${index + 1}`}</h4><button onClick={() => removeArrayItem(section.key, index)}><FiTrash2 /></button></div><AiInputField path={`${section.key}.${index}.title`} value={item.title} placeholder={`${section.title} Title`} onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
            {/* *** ADDED LINK FIELD *** */}
            <AiInputField path={`${section.key}.${index}.link`} value={item.link} placeholder="Link (Optional)" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} />
            <AiInputField path={`${section.key}.${index}.description`} value={item.description} placeholder="Description" onChange={handleDataChange} onImprove={handleImproveWriting} improvingPath={improvingText} type="textarea" /></div>))}
            <button onClick={() => addArrayItem(section.key, { link: '' })} className={styles.addButton}><FiPlus /> Add {section.title}</button></>) : null}
        </div>
    );

    // --- renderEditorPanel: Fixed deleteSection call ---
    const renderEditorPanel = () => (
        <><div className={styles.panelContent}><header className={styles.header}><h2 className={styles.title}>{resume.resumeData.personalDetails?.name || 'Untitled Resume'}</h2><button onClick={() => setIsAddSectionModalOpen(true)} className={styles.actionButton}><FiPlus /> Add Section</button></header>{(resume.resumeData.sections || []).map((section, index) => (<Section key={`${section.key}-${index}`} title={section.title} sectionControls={<><button onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }} disabled={index === 0} title="Move Up"><FiArrowUp /></button><button onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }} disabled={index === resume.resumeData.sections.length - 1} title="Move Down"><FiArrowDown /></button>
            {/* *** FIX: Pass key to deleteSection *** */}
            {section.isCustom && <button onClick={(e) => { e.stopPropagation(); deleteSection(section.key); }} title="Delete Section"><FiTrash2/></button>}</>}>
            {section.key === 'personalDetails' && renderPersonalDetails()}
            {(section.key === 'summary' || section.key === 'professionalSummary') && renderProfessionalSummary()}
            {(section.key === 'experience' || section.key === 'workExperience') && renderWorkExperience()}
            {section.key === 'projects' && renderProjects()}
            {section.key === 'education' && renderEducation()}
            {section.key === 'skills' && renderSkills()}
            {section.isCustom && renderCustomSection(section)}
        </Section>))}</div>{isAddSectionModalOpen && <AddSectionModal onAddSection={addSection} onClose={() => setIsAddSectionModalOpen(false)} />}</>
    );

    // --- renderAiPanel: Fixed AI result rendering ---
    const renderAiPanel = () => {
        if (mode === 'ATS') {
            return (
                <div className={`${styles.aiPanel} ${styles.panelContent}`}>
                    <h2>ATS Score & Analysis</h2>
                    {aiLoading ? (
                        <div className={styles.centeredMessage}>Analyzing...</div>
                    ) : aiResult ? (
                        <div className={styles.aiResults}>
                            {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}
                            {aiResult.score !== undefined && (
                                <div className={styles.scoreCircle} style={{'--score': `${aiResult.score * 3.6}deg`}}>
                                    <span>{aiResult.score}<small>/100</small></span>
                                </div>
                            )}
                            {aiResult.summary && <p className={styles.summary}>{aiResult.summary}</p>}
                            {aiResult.suggestions && aiResult.suggestions.length > 0 && (
                                <div className={styles.aiFeedbackSection}>
                                    <h3>Actionable Suggestions</h3>
                                    <ul className={styles.suggestionList}>
                                        {aiResult.suggestions.map((s, i) => <li key={i}><FiCheckCircle /> {s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : ( <div className={styles.centeredMessage}>Click "ATS Score" to analyze.</div> )}
                </div>
            )
        }
        if (mode === 'PERSONALIZE') {
            return (
                <div className={`${styles.aiPanel} ${styles.panelContent}`}>
                    <div className={styles.jobDescriptionContainer}>
                        <div className={styles.jobDescriptionHeader} onClick={() => setIsJobDescVisible(!isJobDescVisible)}>
                            <h3><FiFileText /> Job Description</h3>
                            <FiChevronDown className={`${styles.chevron} ${isJobDescVisible ? styles.open : ''}`} />
                        </div>
                        {isJobDescVisible && (
                            <div className={styles.jobDescriptionContent}>
                                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." />
                                <button onClick={handlePersonalize} disabled={aiLoading} className={styles.aiActionButton}>{aiLoading ? 'Personalizing...' : <><FiZap /> Personalize Resume</>}</button>
                            </div>
                        )}
                    </div>
                    <div className={styles.aiResults}>
                        {aiLoading && <div className={styles.centeredMessage}>Our AI is crafting your personalized feedback...</div>}
                        {aiResult && !aiLoading && (
                            <>
                                {aiResult.error && <p className={styles.errorText}>{aiResult.error}</p>}
                                {aiResult.strategicFeedback && (<div className={styles.aiFeedbackSection}><h3><FiStar/> Strategic Feedback</h3><p>{aiResult.strategicFeedback}</p></div>)}
                                {/* --- FIX: Re-added detailed AI result rendering --- */}
                                {aiResult.summary && ( <div className={styles.aiFeedbackSection}><h3>Summary</h3><p><strong>Feedback:</strong> {aiResult.summary.feedback}</p><p><strong>Rewritten:</strong> {aiResult.summary.rewrittenText}</p></div> )}
                                {aiResult.experience && ( <div className={styles.aiFeedbackSection}><h3>Experience</h3><p><strong>Feedback:</strong> {aiResult.experience.feedback}</p>{aiResult.experience.rewrittenItems?.length > 0 && (<><h4>Suggestions:</h4><ul>{aiResult.experience.rewrittenItems.map((item, index) => (<li key={`exp-${index}`}><strong>Original:</strong> {item.original || 'N/A'}<br /><strong>Suggestion:</strong> {item.suggestion}</li>))}</ul></>)}</div> )}
                                {aiResult.projects && ( <div className={styles.aiFeedbackSection}><h3>Projects</h3><p><strong>Feedback:</strong> {aiResult.projects.feedback}</p>{aiResult.projects.rewrittenItems?.length > 0 && (<><h4>Rewrite Suggestions:</h4><ul>{aiResult.projects.rewrittenItems.map((item, index) => (<li key={`proj-rewrite-${index}`}><strong>Original:</strong> {item.original || 'N/A'}<br /><strong>Suggestion:</strong> {item.suggestion}</li>))}</ul></>)}{aiResult.projects.newProjectIdeas?.length > 0 && (<><h4>New Project Ideas:</h4><ul>{aiResult.projects.newProjectIdeas.map((idea, index) => (<li key={`proj-idea-${index}`}>{idea}</li>))}</ul></>)}</div> )}
                                {aiResult.education && ( <div className={styles.aiFeedbackSection}><h3>Education</h3><p><strong>Feedback:</strong> {aiResult.education.feedback}</p>{aiResult.education.rewrittenItems?.length > 0 && (<><h4>Suggestions:</h4><ul>{aiResult.education.rewrittenItems.map((item, index) => (<li key={`edu-${index}`}><strong>Original:</strong> {item.original || 'N/A'}<br /><strong>Suggestion:</strong> {item.suggestion}</li>))}</ul></>)}</div> )}
                                {aiResult.skills && ( <div className={styles.aiFeedbackSection}><h3>Skills</h3><p><strong>Feedback:</strong> {aiResult.skills.feedback}</p>{aiResult.skills.missingSkills?.length > 0 && (<><h4>Missing Skills to Add:</h4><ul>{aiResult.skills.missingSkills.map((skill, index) => (<li key={`skill-missing-${index}`}>{skill}</li>))}</ul></>)}{aiResult.skills.suggestedSkillsList && (<p><strong>Suggested List:</strong> {aiResult.skills.suggestedSkillsList}</p>)}</div> )}
                            </>
                        )}
                         {!aiResult && !aiLoading && ( <div className={styles.centeredMessage}>Paste a job description and click "Personalize Resume".</div> )}
                    </div>
                </div>
            )
        }
        return null;
    };

    // --- renderPreviewPanel: No changes from original ---
    const renderPreviewPanel = () => (
        <div className={styles.previewPanel}><div className={styles.previewHeader}><h3>Live Preview</h3><button onClick={updatePreview} disabled={previewLoading} className={styles.updatePreviewButton}><FiRefreshCw className={previewLoading ? styles.spinning : ''} /><span>Refresh</span></button></div><div className={styles.pdfViewer}>{error && <div className={styles.centeredMessage}>{error}</div>}{!error && pdfUrl && <iframe src={pdfUrl} title="Resume Preview" className={styles.pdfPreview} />}{!error && !pdfUrl && <div className={styles.centeredMessage}>{previewLoading ? 'Generating...' : 'No Preview Available'}</div>}</div></div>
    );

    // --- Loading/Return: No changes from original ---
    if (loading || !resume) return <div className={styles.centeredMessage}>Loading Editor...</div>;
    
    return (
        <div className={styles.editorLayout}>
            <header className={styles.controlsHeader}>
                <div className={styles.controls}>
                    <button onClick={() => setMode('EDIT')} className={mode === 'EDIT' ? styles.active : ''} data-tooltip="Editor">Edit</button>
                    <button onClick={handleGetAtsScore} className={mode === 'ATS' ? styles.active : ''} data-tooltip="ATS Score & Analysis">ATS Score</button>
                    <button onClick={() => { setMode('PERSONALIZE'); setAiResult(null); }} className={mode === 'PERSONALIZE' ? styles.active : ''} data-tooltip="Personalize with AI for a Job">Personalize</button>
                </div>
                <button onClick={handleSaveAndClose} disabled={saving} className={styles.saveButton} data-tooltip="Save and exit">
                    <FiSave /> {saving ? 'Saving...' : 'Save & Close'}
                </button>
            </header>

            <main className={styles.leftPanelContainer}>
                {(mode === 'EDIT' || mode === 'PERSONALIZE') ? renderEditorPanel() : renderAiPanel()}
            </main>
            
            <aside className={styles.rightPanelContainer}>
                {(mode === 'EDIT' || mode === 'ATS') ? renderPreviewPanel() : renderAiPanel()}
            </aside>
        </div>
    );
};

export default ResumeEditor;