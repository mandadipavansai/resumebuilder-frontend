import React from 'react';
import { Link } from 'react-router-dom';
import styles from './notfoundpage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Oops! Page Not Found.</p>
      <p className={styles.description}>
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className={styles.homeButton}>
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;

