import "react";

type MdProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  disabled?: boolean;
  type?: string;
  href?: string;
  label?: string;
  selected?: boolean;
  value?: string | number;
  open?: boolean;
  name?: string;
  required?: boolean;
  variant?: string;
  autocomplete?: string;
  minlength?: number;
  inputmode?: string;
  onCancel?: (event: Event) => void;
  onInput?: (event: Event) => void;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": MdProps;
      "md-outlined-button": MdProps;
      "md-text-button": MdProps;
      "md-outlined-text-field": MdProps;
      "md-outlined-select": MdProps;
      "md-select-option": MdProps;
      "md-filter-chip": MdProps;
      "md-linear-progress": MdProps;
      "md-dialog": MdProps;
      "md-fab": MdProps;
      "md-checkbox": MdProps;
    }
  }
}
