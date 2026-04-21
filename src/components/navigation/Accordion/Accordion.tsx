import * as RadixAccordion from '@radix-ui/react-accordion';
import clsx from 'clsx';
import { forwardRef } from 'react';
import type * as React from 'react';
import './Accordion.css';

export type AccordionProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>;
export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>;
export type AccordionHeaderProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Header>;
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>;
export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>;

export const Accordion = ({ className, ...props }: AccordionProps) => (
  <RadixAccordion.Root className={clsx('mpc-accordion', className)} {...props} />
);

export const AccordionItem = ({ className, ...props }: AccordionItemProps) => (
  <RadixAccordion.Item className={clsx('mpc-accordion-item', className)} {...props} />
);

export const AccordionHeader = ({ className, ...props }: AccordionHeaderProps) => (
  <RadixAccordion.Header className={clsx('mpc-accordion-header', className)} {...props} />
);

export const AccordionTrigger = forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(({ className, ...props }, ref) => (
  <RadixAccordion.Trigger
    ref={ref}
    className={clsx('mpc-accordion-trigger', className)}
    {...props}
  />
));

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content
    ref={ref}
    className={clsx('mpc-accordion-content', className)}
    {...props}
  >
    <div className="mpc-accordion-content-inner">{children}</div>
  </RadixAccordion.Content>
));

AccordionContent.displayName = 'AccordionContent';
