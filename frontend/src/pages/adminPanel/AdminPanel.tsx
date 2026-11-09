import { getAdmin, getAdminStats, type AdminStats } from '../../api/User';
import Menu from '../../components/menu/Menu';
import { adminHeader } from '../../constants';
import styles from './AdminPanel.module.css';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { useNavigate } from 'react-router';

// note: the mui stuff does add a bit to the bundle size. so you can lazy load with React.lazy so only that stuff
// is loaded only for admins

function AdminPanel() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [monthPick, setMonthPick] = useState(''); // "YYYY-MM"

  useEffect(() => {
    const [y, m] = monthPick
      ? monthPick.split('-').map(Number)
      : [undefined, undefined];
    getAdmin()
      .then(() => getAdminStats(y, m))
      .then(setStats)
      .catch(() => navigate('/'));
  }, [navigate, monthPick]);

  return (
    <>
      <Menu />

      <div className={styles.initialContainer}>
        <h1>Admin Panel</h1>
        <img src={adminHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.usersContainer}>
          <h2>Data</h2>

          {stats && (
            <>
              <p>
                Total Users: {stats.totals.users} · Total Sessions:{' '}
                {stats.totals.sessions}
              </p>

              <h4>New accounts per month</h4>
              <BarChart
                height={300}
                xAxis={[
                  {
                    scaleType: 'band',
                    data: stats.new_users_per_month.map((r) => r.label),
                  },
                ]}
                series={[
                  {
                    data: stats.new_users_per_month.map((r) => r.count),
                    label: 'New users',
                  },
                ]}
              />

              <h4>Sessions per month</h4>
              <LineChart
                height={300}
                xAxis={[
                  {
                    scaleType: 'point',
                    data: stats.sessions_per_month.map((r) => r.label),
                  },
                ]}
                series={[
                  {
                    data: stats.sessions_per_month.map((r) => r.count),
                    label: 'Sessions',
                  },
                ]}
              />

              <h4>Edit access</h4>
              <PieChart
                height={250}
                series={[
                  {
                    data: stats.edit_access.map((r, i) => ({
                      id: i,
                      value: r.count,
                      label: r.label,
                    })),
                  },
                ]}
              />

              <h4>Accounts in a month</h4>
              <input
                type="month"
                value={monthPick}
                onChange={(e) => setMonthPick(e.target.value)}
              />
              {stats.users_in_month !== null && (
                <p>{stats.users_in_month} accounts created</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
