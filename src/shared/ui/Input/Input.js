import styles from './styles.module.scss';

export const Input = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Содержание задачи"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
    />
  );
};