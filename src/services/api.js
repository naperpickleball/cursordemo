// This is a mock API service based on what you likely had in your original project
// Adjust this to match your original implementation if needed

const API = {
  get: (endpoint) => {
    console.log(`Mock GET request to: ${endpoint}`);
    
    // Mock responses based on endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add mock data for different endpoints
        if (endpoint === '/leagues') {
          resolve({
            data: [
              {
                leagueId: 1,
                leagueName: "Spring 2025 League",
                startDate: "2025-03-01",
                endDate: "2025-05-31",
                playingDay: "Wednesday",
                startTime: "18:00",
                endTime: "21:00",
                location: "Naperville Pickleball Club",
                description: "Weekly pickleball league for intermediate players",
                isActive: true
              }
            ]
          });
        } else if (endpoint === '/players') {
          resolve({
            data: [
              {
                playerId: 1,
                firstName: "John",
                lastName: "Smith",
                email: "john@example.com",
                phone: "555-123-4567",
                skillLevel: 3.5,
                isActive: true
              },
              {
                playerId: 2,
                firstName: "Jane",
                lastName: "Doe",
                email: "jane@example.com",
                phone: "555-987-6543",
                skillLevel: 4.0,
                isActive: true
              }
            ]
          });
        } else {
          // Default empty response
          resolve({ data: [] });
        }
      }, 500);
    });
  },
  
  post: (endpoint, data) => {
    console.log(`Mock POST request to: ${endpoint}`, data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return successful response with the data
        resolve({
          data: {
            ...data,
            id: Math.floor(Math.random() * 1000)
          }
        });
      }, 800);
    });
  },
  
  put: (endpoint, data) => {
    console.log(`Mock PUT request to: ${endpoint}`, data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true
          }
        });
      }, 600);
    });
  },
  
  delete: (endpoint) => {
    console.log(`Mock DELETE request to: ${endpoint}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true
          }
        });
      }, 600);
    });
  }
};

export default API;
