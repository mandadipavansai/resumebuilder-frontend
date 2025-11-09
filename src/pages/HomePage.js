import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.homeContainer}>
      <header className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Build Your Professional Resume with AI
        </h1>
        <p className={styles.heroSubtitle}>
          Create a standout resume in minutes. Our AI tools help you tailor your resume for any job, boosting your chances of getting hired.
        </p>
        <div className={styles.ctaContainer}>
          {user ? (
            <Link to="/dashboard" className={styles.ctaButton}>
              Go to Your Dashboard
            </Link>
          ) : (
            <Link to="/auth" className={styles.ctaButton}>
              Get Started for Free
            </Link>
          )}
        </div>
      </header>

      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Why Choose ResumeWise AI?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>AI-Powered Writing</h3>
            <p className={styles.featureCardText}>
              Enhance your resume's impact with AI suggestions to improve clarity, grammar, and professional tone.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>ATS Optimization</h3>
            <p className={styles.featureCardText}>
              Get an instant analysis of how well your resume will perform with Applicant Tracking Systems (ATS).
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Job Personalization</h3>
            <p className={styles.featureCardText}>
              Tailor your resume for specific job descriptions by identifying and including crucial keywords and skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;