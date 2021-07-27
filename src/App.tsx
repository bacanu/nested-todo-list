import './App.css';
import { useState } from 'react';
import _ from 'lodash';
import CheckboxItemComponent from './components/CheckboxItem';
import ComputedItemComponent from './components/ComputedItem';
import InputItemComponent from './components/InputItem';
import { ComputedItem, ComputeRule, Item, ItemTag } from './Types';
import EditItem from './components/EditItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from './store';
import { updateItem } from './slices/formSlice';


type DrawItemProps = {
  item: Item;
};

let DrawItem = ({ item }: DrawItemProps) => {
  const dispatch = useDispatch();


  let element = (() => {
    switch (item.tag) {
      case ItemTag.Computed:
        return <ComputedItemComponent checked={isChecked(item)} content={item.content}>
          {item.children.map((c: Item) => <DrawItem item={c} key={c.content} />)}
        </ComputedItemComponent>;
      case ItemTag.Checkbox:
        return <CheckboxItemComponent
          checked={isChecked(item)}
          setChecked={(checked) => {
            dispatch(updateItem({ ...item, checked }));
          }}
          content={item.content} />;
      case ItemTag.Input:
        return <InputItemComponent
          checked={isChecked(item)}
          setChecked={(checked) => {
            dispatch(updateItem({ ...item, checked }));
          }}
          content={item.content} />;
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
};

const DrawTree = ({ tree }: DrawTreeProps) => {
  return <form className="form" onSubmit={(e) => e.preventDefault()}>
    <DrawItem item={tree} />
  </form>;
};

type DrawEditTreeProps = {
  tree: Item;
};
const DrawEditTree = ({ tree }: DrawEditTreeProps) => {
  return <form className="form" onSubmit={(e) => e.preventDefault()}>
    <EditItem item={tree} isRoot={true} />
  </form>;
};


enum FormMode {
  Fill,
  Edit
}

function App() {
  const tree = useSelector((state: RootStore) => state.form.tree);
  const [mode, setMode] = useState(FormMode.Edit);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <button onClick={() => setMode(FormMode.Fill)}>Mode fill</button>
          <button onClick={() => setMode(FormMode.Edit)}>Mode edit</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {mode === FormMode.Fill
            ? <DrawTree tree={tree} />
            : <DrawEditTree tree={tree} />}
        </div>
      </div>
    </div>
  );
}

function TItem({ children, firstInList = false }: any) {
  return (
    <div className="item">
      <div className="control control-1 in">
        <button className="btn btn-sm btn-secondary me-1">Paste [copy ctx]</button>
        <button className="btn btn-sm btn-secondary me-1">Add</button>
      </div>
      <div className="content">Some content</div>
      <div className="control control-2 out">
        <button className="btn btn-sm btn-secondary me-1">Cut</button>
        <button className="btn btn-sm btn-secondary me-1">Copy</button>
        <button className="btn btn-sm btn-secondary me-1">Duplicate</button>
      </div>
      <div className="list">{children}</div>
      {children?.length > 0 &&
        <div className="control-3">
          <button className="btn btn-sm btn-secondary me-1">New computed</button>
          <button className="btn btn-sm btn-secondary me-1">New checkbox</button>
          <button className="btn btn-sm btn-secondary me-1">New Input</button>
          <button className="btn btn-sm btn-secondary me-1">Paste [copy ctx]</button>
        </div>}
    </div>
  );
}

function App2() {
  return (
    <div className="main">

      <TItem>
        <TItem></TItem>
        <TItem></TItem>
        <TItem>
          <TItem>
            <TItem></TItem>
            <TItem></TItem>
            <TItem></TItem>
          </TItem>
          <TItem></TItem>
          <TItem></TItem>
        </TItem>
      </TItem>
    </div>
  );
}

export default App;
