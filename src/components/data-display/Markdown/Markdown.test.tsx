import { render, screen, waitFor } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('dedents multiline content by default', () => {
    render(<Markdown>{`    ## Title\n    Paragraph`}</Markdown>);

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders gfm tables and math content', async () => {
    render(
      <Markdown>
        {`| A | B |\n| - | - |\n| 1 | 2 |\n\n$E = mc^2$`}
      </Markdown>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelector('.katex')).not.toBeNull();
    });
  });

  it('applies slug ids to headings', () => {
    render(<Markdown>{`# A Heading`}</Markdown>);
    expect(screen.getByRole('heading', { name: 'A Heading' })).toHaveAttribute('id', 'a-heading');
  });

  it('renders highlighted code blocks with the old theme classes', async () => {
    render(<Markdown>{'```js\nconst answer = 42;\n```'}</Markdown>);

    await waitFor(() => {
      const code = document.querySelector('pre code');
      expect(code).not.toBeNull();
      expect(code?.className).toContain('hljs');
    });
  });
});
