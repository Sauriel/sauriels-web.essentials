export type PartialRecord<K extends string | number | symbol, V> = Partial<
  Record<K, V>
>;

export function isRecordEmpty<K extends string | number | symbol, V>(
  record: PartialRecord<K, V>
): boolean {
  return Object.keys(record).length === 0;
}
