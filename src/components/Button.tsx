import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  let base = 'font-bold rounded-full transition-colors duration-200 focus:outline-none';
  let style: React.CSSProperties = {};
  switch (variant) {
    case 'primary':
      style = { backgroundColor: 'var(--primary-pink-main)', color: 'white' };
      break;
    case 'secondary':
      style = { backgroundColor: 'var(--primary-pink-light)', color: 'var(--primary-pink-dark)', border: '1px solid var(--primary-pink-main)' };
      break;
    case 'danger':
      style = { backgroundColor: 'var(--error-red)', color: 'white' };
      break;
    case 'outline':
      style = { backgroundColor: 'transparent', color: 'var(--primary-pink-main)', border: '1px solid var(--primary-pink-main)' };
      break;
    default:
      style = { backgroundColor: 'var(--primary-pink-main)', color: 'white' };
  }
  const width = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${base} ${width} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 