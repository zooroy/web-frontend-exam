export function isMobileUserAgent(userAgentValue: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgentValue);
}
