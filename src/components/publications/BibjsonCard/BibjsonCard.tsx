import { BibCard } from '../BibCard';

export interface BibjsonCardProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  bibjsonEntry: any;
  preventOpenAccessFetch?: boolean;
}

export const BibjsonCard = (props: BibjsonCardProps) => {
  return (
    <BibCard
      id={props.id}
      className={props.className}
      title={props.bibjsonEntry.title}
      author={props.bibjsonEntry.author}
      year={props.bibjsonEntry.year}
      journal={props.bibjsonEntry.journal}
      doi={props.bibjsonEntry.doi}
      openAccessUrl={props.bibjsonEntry.openAccessUrl}
      preventOpenAccessFetch={props.preventOpenAccessFetch}
    />
  );
};

