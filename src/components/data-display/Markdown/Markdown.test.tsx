import { render, screen } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('dedents multiline content by default', () => {
    render(<Markdown>{`    ## Title\n    Paragraph`}</Markdown>);

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders gfm tables and math content', () => {
    render(
      <Markdown>
        {`| A | B |\n| - | - |\n| 1 | 2 |\n\n$E = mc^2$`}
      </Markdown>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(document.querySelector('.katex')).not.toBeNull();
  });

  it('applies slug ids to headings', () => {
    render(<Markdown>{`# A Heading`}</Markdown>);
    expect(screen.getByRole('heading', { name: 'A Heading' })).toHaveAttribute('id', 'a-heading');
  });
});
