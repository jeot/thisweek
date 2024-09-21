import './styles.css';
import '../prototypes.ts';
import { DateView, Today } from '../my_types.ts';

export default function Header({ today }: { today: Today }) {
  if (today === undefined) return;
  function build_date_string(dw: DateView | null) {
    if (dw === null) return null;
    else return `${dw.weekday}, ${dw.day} ${dw.month} ${dw.year}`;
  }
  const main_date = build_date_string(today.main_date_view);
  const aux_date = build_date_string(today.aux_date_view);
  return (
    <div className="header">
      <div className="" dir="auto">
        {main_date}
      </div>
      {aux_date && <div>
        &nbsp;&nbsp;|&nbsp;&nbsp;
      </div>}
      {aux_date && <div className="" dir="auto">
        {aux_date}
      </div>}
    </div>
  );

}
