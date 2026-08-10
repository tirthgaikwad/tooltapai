export function migrateToolTapStorage(): void {
  const migrations: [string, string][] = [
    ['toolverse-saved-tools', 'tooltap-saved-tools'],
    ['toolverse_bookmarks', 'tooltap-saved-tools'],
    ['toolverse_history', 'tooltap-recently-viewed'],
    ['toolverse-recently-viewed', 'tooltap-recently-viewed'],
    ['toolverse_student_mode', 'tooltap-student-mode'],
    ['toolverse-student-mode', 'tooltap-student-mode'],
    ['toolverse_recent_searches', 'tooltap-recent-searches'],
    ['toolverse-recent-searches', 'tooltap-recent-searches'],
    ['toolverse-compare', 'tooltap-compare'],
    ['toolverse_compare', 'tooltap-compare'],
  ];

  migrations.forEach(([oldKey, newKey]) => {
    try {
      const existingValue = localStorage.getItem(oldKey);
      const newValue = localStorage.getItem(newKey);
      if (existingValue !== null && newValue === null) {
        localStorage.setItem(newKey, existingValue);
      }
    } catch {
      // Silently fail if localStorage is disabled or inaccessible
    }
  });
}
