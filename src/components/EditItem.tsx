import { useDispatch, useSelector } from 'react-redux';
import { addChild as addChildAction, changeItemTag, cutItem, Mode, pasteOnTarget, updateItem } from '../slices/formSlice';
import { RootStore } from '../store';
import { ComputedItem, ComputeRule, Item, ItemTag } from '../Types';

function AutoExpandTextarea(props: any) {
  return <div className="auto-expand">
    <pre>
      {props.value + " "}
    </pre>
    <textarea
      className="form-control" {...props}></textarea>
  </div>;
}

type HorizontalSelectProps = {
  items: any[],
  onSelect: (val: any) => void;
};
function HorizontalSelect({ items, onSelect }: HorizontalSelectProps) {

  return <div className="btn-group">
    {items.map(([name, val, selected]) =>
      <button key={val} className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-secondary'}`}
        onClick={(e) => onSelect(val)}>
        {name}
      </button>
    )}
  </div>;
}


type Props = {
  item: Item,
  isRoot?: boolean,
};

function EditItem({ item, isRoot = false }: Props) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootStore) => state.form.mode);


  let rules = (() => {



    if (item.tag === ItemTag.Computed) {
      let rules = [
        ["All", ComputeRule.All],
        ["At least one", ComputeRule.AtLeastOne],
        ["One", ComputeRule.One],
      ].map(([name, val]) => [name, val, val === item.rule]);

      return <HorizontalSelect items={rules} onSelect={(val) => dispatch(updateItem({ ...item, rule: val }))} />;
    }

    return null;
  })();

  let types = (() => {
    let types = ([
      ["Computed", ItemTag.Computed],
      ["Checkbox", ItemTag.Checkbox],
      ["Input", ItemTag.Input],
    ].map(([name, val]) => [name, val, val === item.tag]));


    return <HorizontalSelect items={types} onSelect={(val) => dispatch(changeItemTag({item, tag: val}))} />; 
  })();

  let children = (() => {
    if (item.tag === ItemTag.Computed) {
      return item.children.map((item) => <EditItem key={item.uuid} item={item} />);
    }
  })();

  let addChild = (item: ComputedItem) => <button key="addChild" onClick={() => dispatch(addChildAction(item))}>Add child</button>;
  let cut = (item: Item) => <button key="cut" onClick={() => dispatch(cutItem(item))}>Cut</button>;
  let paste = (item: Item) => <button key="paste" onClick={() => dispatch(pasteOnTarget(item))}>Paste</button>;

  let actionsBottom = (() => {
    switch (item.tag) {
      case ItemTag.Computed:
        if (isRoot) {
          return [addChild(item)];
        } else {
          return [addChild(item), cut(item)];
        }
      case ItemTag.Checkbox:
        return [cut(item)];
      case ItemTag.Input:
        return [cut(item)];
    }
  })();

  let actionsTop = (() => {
    switch (mode.tag) {
      case Mode.Standby:
        return null;
      case Mode.Cut:
        return [paste(item)];
      case Mode.Copy:
        return [paste(item)];
    }
  })();

  return (
    <div className="ms-4 mt-2 card">
      <div className="card-body">
        <div>{actionsTop}</div>
        <div><AutoExpandTextarea
          value={item.content}
          onChange={(e: any) => { dispatch(updateItem({ ...item, content: e.target?.value })); }} />
        </div>

        <div>{actionsBottom}</div>
        <div className="my-1">{types}</div>
        <div className="my-1">{rules}</div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default EditItem;
