export const API_CONFIG = {
  // Base URL — change this to your ASP.NET Core Web API URL when ready
  baseUrl: '/api',

  endpoints: {
    // Parking Slots
    slots: {
      getAll: '/api/parking-slots',
      getById: '/api/parking-slots/:id',
      create: '/api/parking-slots',
      update: '/api/parking-slots/:id',
      delete: '/api/parking-slots/:id',
    },

    // Parking Sessions (Vehicle Entry/Exit)
    sessions: {
      getAll: '/api/parking-sessions',
      getById: '/api/parking-sessions/:id',
      create: '/api/parking-sessions',
      update: '/api/parking-sessions/:id',
      complete: '/api/parking-sessions/:id/complete',
    },

    // Parking Records
    records: {
      getAll: '/api/parking-records',
      search: '/api/parking-records/search',
    },

    // Dashboard
    dashboard: {
      stats: '/api/dashboard/stats',
      recentActivity: '/api/dashboard/recent-activity',
    },
  },
};
