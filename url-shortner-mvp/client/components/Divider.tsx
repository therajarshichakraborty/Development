interface DividerProps {
  width?: string;
}

const Divider = ({ width = "w-48" }: DividerProps) => {
  return (
    <div className="w-full flex justify-center my-6">
      <div
        className={`h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent ${width} rounded-full opacity-60`}
      />
    </div>
  );
};

export default Divider;
