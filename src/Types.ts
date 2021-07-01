
export enum ComputeRule {
  All,
  One,
  AtLeastOne,
}

export enum ItemTag {
  Computed,
  Checkbox,
  Input
}

export type ComputedItem = {
  uuid: string,
  tag: ItemTag.Computed;
  content: string;
  children: Item[];
  rule: ComputeRule;
};

export type CheckboxItem = {
  uuid: string,
  tag: ItemTag.Checkbox;
  content: string;
  checked: boolean;
};

export type InputItem = {
  uuid: string,
  tag: ItemTag.Input;
  content: string;
  checked: boolean;
  input: string;
};

export type Item =
  | ComputedItem
  | CheckboxItem
  | InputItem;
  

