import { sortArrayByProperty } from '@/src/lib/utils';
import PropertySummary from './property-summary';

export default function PropertySummaries({
  propertySummaries,
}: {
  propertySummaries: any[];
}) {
  const sortedPropertySummaries = sortArrayByProperty(
    propertySummaries,
    'displayName'
  );
  return (
    <ul>
      {(sortedPropertySummaries ?? []).map((propertySummary) => (
        <PropertySummary
          key={propertySummary.property?.split('/')[1]}
          propertySummary={propertySummary}
        />
      ))}
    </ul>
  );
}
