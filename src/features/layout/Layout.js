import styles from './style.module.scss';

export const Layout = ({ children }) => {
  return (
    <>
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
};