export const calculatePopularity = (
  voteCount: number,
  answerCount: number,
  created: Date
): number => {
  const hoursAge = (new Date().getTime() - created.getTime()) / (1000 * 60 * 60);
  const timeDecay = Math.max(1, (24 - hoursAge) / 24);

  return (voteCount + answerCount) * timeDecay;
};
