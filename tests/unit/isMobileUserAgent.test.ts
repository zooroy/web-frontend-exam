import { describe, expect, it } from 'vitest';

import { isMobileUserAgent } from '../../lib/utils/isMobileUserAgent';

describe('isMobileUserAgent', () => {
  it('returns true for iphone user agents', () => {
    expect(
      isMobileUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      ),
    ).toBe(true);
  });

  it('returns true for android user agents', () => {
    expect(
      isMobileUserAgent(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/123.0 Mobile Safari/537.36',
      ),
    ).toBe(true);
  });

  it('returns false for desktop user agents', () => {
    expect(
      isMobileUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/123.0 Safari/537.36',
      ),
    ).toBe(false);
  });
});
