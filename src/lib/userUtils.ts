import { AppUser } from '../types';

const USER_NAMES_DICT: Record<string, string> = {
  "vatsalpatelwork20@gmail.com": "Vatsal Patel",
  "vatsalpatel1720@gmail.com": "Vatsal Patel",
  "vatsal.assetscout@gmail.com": "Vatsal Patel",
  "rushikeshpote14@gmail.com": "Rushikesh Pote",
  "kavita.assetscout@gmail.com": "Kavita Patel",
  "assetscout007rohan@gmail.com": "Rohan Patel",
  "1859": "Pratap More",
  "9531": "Rushikesh Pote",
  "5595": "Kavita Patel",
  "4001": "Vatsal Patel",
  "8888": "Vatsal Patel",
  "admin": "Admin",
  "pratap more": "Pratap More",
  "rushikesh pote": "Rushikesh Pote",
  "kavita patel": "Kavita Patel",
  "vatsal patel": "Vatsal Patel"
};

/**
 * Dynamically register names from fetched Google Sheets projects
 */
export const registerNamesFromProjects = (projects: any[]): void => {
  if (!projects || !Array.isArray(projects)) return;
  projects.forEach((p) => {
    if (p.userId && p.users && p.users.length > 0) {
      const uId = String(p.userId).trim().toLowerCase();
      const rawUser = p.users[0];
      if (rawUser && rawUser.trim()) {
        const trimmedUser = rawUser.trim();
        let formattedName = trimmedUser;
        // Format if it's all lowercase or simple
        if (trimmedUser === trimmedUser.toLowerCase()) {
          formattedName = trimmedUser
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        }
        USER_NAMES_DICT[uId] = formattedName;
      }
    }
  });
};

/**
 * Resolves a user ID or email address to a formatted display name.
 */
export const getUserDisplayName = (email: string | null | undefined, allowedUsers: AppUser[] = []): string => {
  if (!email) return '';
  const val = email.trim().toLowerCase();

  if (USER_NAMES_DICT[val]) {
    return USER_NAMES_DICT[val];
  }

  // Also check email prefix
  const prefix = val.split('@')[0];
  if (USER_NAMES_DICT[prefix]) {
    return USER_NAMES_DICT[prefix];
  }

  // Find in allowedUsers and prefer non-generic placeholder name
  const matched = allowedUsers.find((u) => u.email.trim().toLowerCase() === val);
  if (matched && matched.name && matched.name.trim() && !/^User\s+\d+$/i.test(matched.name.trim())) {
    return matched.name;
  }

  // Check if purely numeric
  if (/^\d+$/.test(val)) {
    if (val === '8888') return 'Vatsal Patel';
    if (matched && matched.name && matched.name.trim()) {
      return matched.name;
    }
    return `User ${val}`;
  }

  // Fallback: format prefix of email
  const formatted = prefix
    .split(/[\._\-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return formatted;
};

