export interface SummaryProps {
  text: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

export const formatResult = ({ text, setResult }: SummaryProps) => {
  // Replace single asterisks with hyphens
  const replacedDoubleAsterisks = text.replace(
    /^\*\* (.*?) \*\*/gm,
    "<h2>$1</h2>"
  );

  // Replace lines starting with single asterisks with <p> tags
  const replacedSingleAsterisks = replacedDoubleAsterisks.replace(
    /^\* (.*?)(?=\n|$)/gm,
    "<p>$1</p>"
  );

  setResult(replacedSingleAsterisks);
};
