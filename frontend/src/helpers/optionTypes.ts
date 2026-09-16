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

export const TARGET_OPTION_KEYS: OptionKey[] = [
  'radar',
  'factory',
  'city',
  'railyard',
  'train',
  'oildepot',
  'tank',
  'ship',
  'bridge',
  'truck',
  'defence',
  'artillary',
  'airfield',
  'antiair',
  'unknown',
];

export const WAYPOINT_OPTION_KEYS: OptionKey[] = [
  'startPoint',
  'navigationPoint',
  'targetPoint',
  'egressPoint',
];
