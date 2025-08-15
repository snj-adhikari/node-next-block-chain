import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BlockchainConfigForm } from '../../../src/components/blockchain/BlockchainConfigForm';

describe('Blockchain Creation Flow', () => {
  it('should create a blockchain successfully', async () => {
    const mockOnSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <BlockchainConfigForm onSubmit={mockOnSubmit} isLoading={false} errors={{}} />
    );

    // Fill out the form
    fireEvent.change(getByLabelText('Blockchain Name *'), { target: { value: 'Test Blockchain' } });
    fireEvent.change(getByLabelText('Symbol *'), { target: { value: 'TB' } });
    fireEvent.change(getByLabelText('Description *'), { target: { value: 'A test blockchain' } });

    // Submit the form
    fireEvent.click(getByText('Create Blockchain'));

    // Wait for the success message
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should handle validation errors', async () => {
    const mockOnSubmit = jest.fn();
    const { getByText, rerender } = render(
      <BlockchainConfigForm onSubmit={mockOnSubmit} isLoading={false} errors={{}} />
    );

    rerender(
      <BlockchainConfigForm onSubmit={mockOnSubmit} isLoading={false} errors={{ name: 'Name is required' }} />
    );

    // Wait for the error message
    await waitFor(() => {
      expect(getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('should handle file system errors', async () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId, rerender } = render(
      <BlockchainConfigForm onSubmit={mockOnSubmit} isLoading={false} errors={{}} />
    );

    rerender(
      <BlockchainConfigForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        errors={{ api: 'A problem occurred with our storage system. Please try again later.' }}
      />
    );

    // Wait for the error message
    await waitFor(() => {
      expect(getByTestId('api-error')).toBeInTheDocument();
    });
  });

  it('should handle unexpected errors', async () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId, rerender } = render(
      <BlockchainConfigForm onSubmit={mockOnSubmit} isLoading={false} errors={{}} />
    );

    rerender(
      <BlockchainConfigForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        errors={{ api: 'An unexpected error occurred. Our team has been notified.' }}
      />
    );

    // Wait for the error message
    await waitFor(() => {
      expect(getByTestId('api-error')).toBeInTheDocument();
    });
  });
});