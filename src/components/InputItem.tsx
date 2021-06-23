import MarkdownBlock from "./MarkdownBlock";

type Props = {
  checked: boolean,
  content: string,
  setChecked: (isChecked: boolean) => void;
};

function InputItem({ checked, content, setChecked }: Props) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        onChange={(e) => setChecked(e.target.checked)}
        checked={checked} />
      <div><MarkdownBlock content={content} /></div>
      <div><input type="text" /></div>
    </div>
  );
}

export default InputItem;
