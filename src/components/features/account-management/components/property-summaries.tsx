import PropertySummary from './property-summary';

export default function PropertySummaries({
  propertySummaries,
}: {
  propertySummaries: any[];
}) {
  return (
    <ul>
      {(propertySummaries ?? []).map((propertySummary) => (
        <PropertySummary
          key={propertySummary.property?.split('/')[1]}
          propertySummary={propertySummary}
        />
      ))}
    </ul>
  );
}
