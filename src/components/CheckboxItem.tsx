import MarkdownBlock from "./MarkdownBlock";

type Props = {
  checked: boolean,
  content: string;
  setChecked: (isChedcked: boolean) => void;
};


function CheckboxItem({ checked, content, setChecked }: Props) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        onChange={(e) => setChecked(e.target.checked)}
        checked={checked} />
      <div><MarkdownBlock content={content} /></div>
    </div>
  );
}

export default CheckboxItem;
