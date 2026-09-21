const placeholderPatterns = [
  /^replace_with_/i,
  /^your[-_]/i,
  /^<.+>$/,
  /@yourcompany\.com$/i,
];

export function isConfigured(value: string | undefined) {
  return Boolean(value && value.trim() && !placeholderPatterns.some((pattern) => pattern.test(value.trim())));
}

export function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!isConfigured(value)) throw new Error(`${name} must be configured before this operation is enabled.`);
  return value as string;
}
