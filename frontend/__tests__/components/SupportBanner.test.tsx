import React from 'react';
import { render } from '@testing-library/react';
import { SupportBanner } from '../../../src/components/common/SupportBanner';

describe('SupportBanner', () => {
  it('should render the support banner correctly', () => {
    const { getByTestId } = render(<SupportBanner />);

    expect(getByTestId('support-banner')).toBeInTheDocument();
    expect(getByTestId('support-link')).toHaveAttribute('href', 'https://buymeacoffee.com/notjustweb');
  });
});