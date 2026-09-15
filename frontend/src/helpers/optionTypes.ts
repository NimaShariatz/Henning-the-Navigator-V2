export type OptionKey =
  | 'startPoint'
  | 'navigationPoint'
  | 'targetPoint'
  | 'egressPoint'
  | 'radar'
  | 'factory'
  | 'city'
  | 'railyard'
  | 'train'
  | 'oildepot'
  | 'tank'
  | 'ship'
  | 'bridge'
  | 'truck'
  | 'defence'
  | 'artillary'
  | 'airfield'
  | 'antiair'
  | 'unknown'
  | 'comment'
  | 'frontline';

export type OptionSelected = Record<OptionKey, boolean>;
