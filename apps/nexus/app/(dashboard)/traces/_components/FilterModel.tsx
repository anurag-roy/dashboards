import { ModelMultiSelect } from '@/components/ModelMultiSelect';

type FilterModelProps = {
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  className?: string;
  triggerClassName?: string;
};

export function FilterModel({ selectedModels, onModelsChange, className, triggerClassName }: FilterModelProps) {
  return (
    <ModelMultiSelect
      selectedModels={selectedModels}
      onModelsChange={onModelsChange}
      allLabel='All models'
      className={className}
      label='Model'
      triggerClassName={triggerClassName}
    />
  );
}
