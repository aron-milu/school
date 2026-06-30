export function getDashboardTab<T extends string>(
  pathname: string,
  validTabs: readonly T[],
  fallback: T
): T {
  const tab = pathname.split('/').filter(Boolean)[1] as T | undefined;
  return tab && validTabs.includes(tab) ? tab : fallback;
}

export function getDashboardTabPath<T extends string>(basePath: string, tab: T) {
  return `${basePath}/${tab}`;
}
