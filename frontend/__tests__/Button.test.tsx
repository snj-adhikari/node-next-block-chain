import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  test('renders button with destructive variant', () => {
    render(<Button variant="destructive">Delete Button</Button>);
    
    const button = screen.getByRole('button', { name: /delete button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  test('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-secondary');
  });

  test('renders button with large size', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
  });

  test('renders button with small size', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not handle click when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('bg-background');
  });

  test('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    
    const button = screen.getByRole('button', { name: /ghost button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('hover:bg-accent');
  });
});
