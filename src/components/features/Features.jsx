import React from 'react';
import './Features.css';

export function Features() {
  const features = [
    {
      title: "Gym Management",
      description: "Gym owners can easily add and manage their gyms through our platform",
      icon: "🏢"
    },
    {
      title: "User Management",
      description: "Manage gym members, track their activities, and handle memberships efficiently",
      icon: "👥"
    },
    {
      title: "Photo Gallery",
      description: "Showcase your gym facilities with photo galleries and virtual tours",
      icon: "📸"
    },
    {
      title: "Visibility",
      description: "Increase your gym's visibility to potential customers in the area",
      icon: "👀"
    },
    {
      title: "Location-Based Search",
      description: "Users can find nearby gyms in their area with ease",
      icon: "📍"
    },
    {
      title: "Online Registration",
      description: "Users can join gyms directly through the platform",
      icon: "✍️"
    },
    {
      title: "Billing Management",
      description: "Track and manage member payments and pending bills",
      icon: "💰"
    },
    {
      title: "Analytics Dashboard",
      description: "Get insights about your gym's performance and member activities",
      icon: "📊"
    }
  ];

  return (
    <div className="features-container">
      <h2>Our Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}