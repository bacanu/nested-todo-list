type Props = {
  checked: boolean,
  content: string,
  children: React.ReactNode,
};

const ComputedItem: React.FC<Props> = ({ checked, content, children }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        readOnly={true}
        checked={checked} />
      <div>{content}</div>
      <div>{children}</div>
    </div>
  );
};

export default ComputedItem;
