type RobotChoiceProps = {
  choice: string;
};

export default function RobotChoice({ choice }: RobotChoiceProps) {
  return (
    <div className="mt-2">
      Robot chose: <span className="font-semibold capitalize">{choice}</span>
    </div>
  );
}
