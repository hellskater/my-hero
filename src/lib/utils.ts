import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sha256 } from 'js-sha256';
import { generateUsername } from 'unique-username-generator';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGravatarImage = (address: string | undefined) => {
  if (!address) {
    return '';
  }
  const hash = sha256(address);

  return `https://www.gravatar.com/avatar/${hash}?d=monsterid`;
};

export const generateRandomUsername = () => {
  const username = generateUsername('', 2, 15);
  return username;
};

export const generateRandomName = () => {
  const generated = generateUsername('-');
  const name = generated
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return name;
};
