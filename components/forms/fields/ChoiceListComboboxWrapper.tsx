'use client';

import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { Control } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CHOICE_LIST_REGISTRY,
  type ChoiceListAddHook,
  type ChoiceListGetHook,
  type ChoiceListKey,
} from '@/lib/shared/choice-list-registry';
import { cn } from '@/lib/shared/utils';
import type { GenericObject } from '@/types/types';

const ADD_OPTION_PREFIX = '__add__';

interface BaseFieldProps {
  control: Control<any>;
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  warning?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  direction?: 'horizontal' | 'vertical';
  showLabel?: boolean;
}

interface ChoiceListComboboxInnerProps extends BaseFieldProps {
  useGet: ChoiceListGetHook;
  useAdd: ChoiceListAddHook;
}

interface ChoiceListComboboxFieldProps extends BaseFieldProps {
  choiceList: ChoiceListKey;
}

function extractChoiceListItemId(
  result: unknown,
  name: string,
  options: GenericObject[],
): string | undefined {
  if (result && typeof result === 'object') {
    const record = result as Record<string, unknown>;

    if (typeof record.id === 'string') {
      return record.id;
    }

    const nested = record.data;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      const nestedRecord = nested as Record<string, unknown>;
      if (typeof nestedRecord.id === 'string') {
        return nestedRecord.id;
      }
    }

    if (Array.isArray(nested)) {
      const match = nested.find(
        (item) =>
          item &&
          typeof item === 'object' &&
          'name' in item &&
          typeof item.name === 'string' &&
          item.name.toLowerCase() === name.toLowerCase(),
      ) as GenericObject | undefined;
      if (match?.id) {
        return match.id;
      }
    }
  }

  return options.find(
    (option) => option.name?.toLowerCase() === name.toLowerCase(),
  )?.id;
}

export function ChoiceListComboboxFieldInner({
  control,
  name,
  label,
  useGet,
  useAdd,
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  emptyText = 'No option found.',
  searchPlaceholder = 'Search...',
  direction = 'horizontal',
  showLabel = true,
}: ChoiceListComboboxInnerProps) {
  const { data: options = [], isLoading, refetch } = useGet();
  const { mutateAsync, isPending: isAdding } = useAdd();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const trimmedSearch = search.trim();

  const filteredOptions = useMemo(() => {
    if (!trimmedSearch) return options;
    return options.filter(
      (option) =>
        option.name?.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
        option.id?.toLowerCase().includes(trimmedSearch.toLowerCase()),
    );
  }, [options, trimmedSearch]);

  const canCreateOption = useMemo(() => {
    if (!trimmedSearch) return false;
    return !options.some(
      (option) =>
        option.name?.trim().toLowerCase() === trimmedSearch.toLowerCase(),
    );
  }, [options, trimmedSearch]);

  const handleCreateOption = useCallback(
    async (value: string, onChange: (id: string) => void) => {
      const nextName = value.trim();
      if (!nextName) return;

      try {
        const result = await mutateAsync({ name: nextName });
        const refetchResult = await refetch();
        const refreshedOptions =
          (refetchResult as { data?: GenericObject[] }).data ?? options;
        const newId = extractChoiceListItemId(
          result,
          nextName,
          refreshedOptions,
        );

        if (newId) {
          onChange(newId);
          setOpen(false);
          setSearch('');
          return;
        }

        toast.error(`Added "${nextName}" but could not select it automatically.`);
      } catch {
        toast.error(`Failed to add "${nextName}".`);
      }
    },
    [mutateAsync, options, refetch],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleSelect = (id: string) => {
          if (id.startsWith(ADD_OPTION_PREFIX)) {
            void handleCreateOption(
              id.slice(ADD_OPTION_PREFIX.length),
              field.onChange,
            );
            return;
          }

          const option = options.find((opt) => opt.id === id);
          if (option?.id) {
            field.onChange(option.id);
            setOpen(false);
            setSearch('');
          }
        };

        const selectedLabel = options.find((o) => o.id === field.value)?.name;

        return (
          <FormItem
            className={cn(
              'w-full',
              direction === 'horizontal'
                ? 'flex items-center gap-4'
                : 'flex flex-col',
            )}
          >
            {showLabel && (
              <FormLabel
                className={cn(
                  direction === 'horizontal'
                    ? 'w-[10rem] flex items-center justify-end text-right shrink-0'
                    : 'mb-1',
                )}
              >
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FormLabel>
            )}

            <div className="flex-1 flex flex-col">
              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen);
                  if (!newOpen) setSearch('');
                }}
                modal
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={disabled || isLoading}
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground',
                        className,
                      )}
                    >
                      {isLoading
                        ? 'Loading...'
                        : field.value
                          ? selectedLabel
                          : placeholder || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={search}
                      onValueChange={setSearch}
                      autoFocus
                    />
                    <CommandList>
                      {filteredOptions.length === 0 && !canCreateOption && (
                        <CommandEmpty>{emptyText}</CommandEmpty>
                      )}
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.name}
                            onSelect={() => handleSelect(option.id ?? '')}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                option.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {option.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {canCreateOption && (
                        <>
                          {filteredOptions.length > 0 && <CommandSeparator />}
                          <CommandGroup>
                            <CommandItem
                              value={`add-${trimmedSearch}`}
                              onSelect={() =>
                                handleSelect(`${ADD_OPTION_PREFIX}${trimmedSearch}`)
                              }
                              disabled={isAdding}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {isAdding
                                ? `Adding "${trimmedSearch}"...`
                                : `Add "${trimmedSearch}"`}
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
              {warning && (
                <span className="text-xs text-amber-500 mt-1">{warning}</span>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export function ChoiceListComboboxField({
  choiceList,
  ...props
}: ChoiceListComboboxFieldProps) {
  const hooks = CHOICE_LIST_REGISTRY[choiceList];

  return (
    <ChoiceListComboboxFieldInner
      {...props}
      useGet={hooks.useGet}
      useAdd={hooks.useAdd}
    />
  );
}
