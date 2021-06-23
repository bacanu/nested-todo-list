import './App.css';
import { useState } from 'react';
import _ from 'lodash';
import CheckboxItemComponent from './components/CheckboxItem';
import ComputedItemComponent from './components/ComputedItem';
import InputItemComponent from './components/InputItem';
import MarkdownBlock from './components/MarkdownBlock';

enum ComputeRule {
  All,
  One,
  AtLeastOne,
}

enum ItemTag {
  Computed,
  Checkbox,
  Input
}

type ComputedItem = {
  tag: ItemTag.Computed;
  content: string;
  children: Item[];
  rule: ComputeRule;
};

type CheckboxItem = {
  tag: ItemTag.Checkbox;
  content: string;
  checked: boolean;
};

type InputItem = {
  tag: ItemTag.Input;
  content: string;
  checked: boolean;
  input: string;
};

type Item =
  | ComputedItem
  | CheckboxItem
  | InputItem;

let initialTree: Item = {
  content: "# hello",
  tag: ItemTag.Computed,
  rule: ComputeRule.All,
  children: [
    {
      tag: ItemTag.Checkbox,
      content: "# bonjour",
      checked: false,
    },
    {
      tag: ItemTag.Input,
      content: "# salut",
      checked: true,
      input: "some text"
    }
  ]
};

type DrawItemProps = {
  item: Item;
  setCheckedGenerator: (item: Item) => () => void;
};

let DrawItem = ({ item, setCheckedGenerator }: DrawItemProps) => {
  let element = (() => {
    switch (item.tag) {
      case ItemTag.Computed:
        return <ComputedItemComponent checked={isChecked(item)} content={item.content}>
          {item.children.map((c: Item) => <DrawItem item={c} key={c.content} setCheckedGenerator={setCheckedGenerator} />)}
        </ComputedItemComponent>;
      case ItemTag.Checkbox:
        return <CheckboxItemComponent checked={isChecked(item)} content={item.content} setChecked={setCheckedGenerator(item)} />;
      case ItemTag.Input:
        return <InputItemComponent checked={isChecked(item)} content={item.content} setChecked={setCheckedGenerator(item)} />;
    }
  })();

  return <div className="ms-4">
    {element}
  </div>;
};

let isChecked = (item: Item): boolean => {

  let computedIsChecked = (item: ComputedItem): boolean => {
    switch (item.rule) {
      case ComputeRule.All:
        return item.children.map(isChecked).every(_.identity);
      case ComputeRule.AtLeastOne:
        return item.children.map(isChecked).find(_.identity) || false;
      case ComputeRule.One:
        return item.children.map(isChecked).filter(_.identity).length === 1;
    }
  };

  switch (item.tag) {
    case ItemTag.Computed:
      return computedIsChecked(item);
    default:
      return item.checked;
  }
};


type DrawTreeProps = {
  tree: Item;
  setCheckedGenerator: (item: Item) => () => void;
};

const DrawTree = ({ tree, setCheckedGenerator }: DrawTreeProps) => {
  return <form className="form">
    <DrawItem item={tree} setCheckedGenerator={setCheckedGenerator} />
  </form>;
};

function App() {
  const [tree, setTree] = useState(initialTree);

  function traverse(item: Item, map: (a: Item) => Item) {
    if (item.tag === ItemTag.Computed) {
      item.children.map(map);
      return { ...item };
    } else {
      return map(item);
    }
  }

  let setCheckedGeneratorGenerator = (tree: Item, setTree: (tree: Item) => void) => {
    return (toToggle: Item) => () => {
      setTree(traverse(tree, (item) => {
        if (item.tag === ItemTag.Input || item.tag === ItemTag.Checkbox) {
          if (item === toToggle) {
            item.checked = !item.checked;
            return { ...item };
          }
        }

        return { ...item };
      }));
    };
  };

  let setCheckedGenerator = setCheckedGeneratorGenerator(tree, (tree) => {
    console.log(JSON.stringify(tree));
    setTree(tree);
  });
  return (
    <div className="container-fluid">
      <div className="col">
        <DrawTree tree={tree} setCheckedGenerator={setCheckedGenerator} />
      </div>
    </div>
  );
}

export default App;
