export const syncTasksToBackend = async (tasks, statuses) => {
    console.log('Syncing tasks to backend:', tasks);
    const payload = {};
    for (const status of statuses) {
      payload[status] = tasks[status].map((task, index) => ({
        id: task.id,
        order: index,
      }));
    }
  
    try {
    const res = await fetch('/api/taskboard/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('Synced:', data);
  } catch (err) {
    console.error('Sync error:', err);
  }
  };
  