import { NamespaceNotInitializedException } from './namespace-not-initialized.exception';

describe('NamespaceNotInitializedException', () => {
  const namespace = 'namespace';

  it('should format message', () => {
    const exception = new NamespaceNotInitializedException(namespace);
    expect(exception.message).toContain(namespace);
  });
});
