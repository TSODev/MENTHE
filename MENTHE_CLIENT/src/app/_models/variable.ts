import { Variable } from '../_interfaces/publish.interface';

export class DBVariable {
  variable_id: string;                // ToDo - Remove it !
  process_id: string;                // ToDo - Remove it !
  name: string;
  defaultValue: string;
  type: string;
  direction: string;
}
