import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';

interface User {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
  };
}

function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://randomuser.me/api');
      const newUser = {
        name: {
          first: response.data.results[0].name.first,
          last: response.data.results[0].name.last,
        },
        email: response.data.results[0].email,
        picture: {
          large: response.data.results[0].picture.large,
        },
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshClick = () => {
    localStorage.removeItem('user');
    setUser(null);
    fetchUser();
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error">Error fetching user data.</div>;
  }

  return (
    <div className="user-info">
      <img src={user.picture.large} alt="Profile" />
      <h2>{user.name.first} {user.name.last}</h2>
      <p>{user.email}</p>
      <button onClick={handleRefreshClick}>Refresh</button>
    </div>
  );
}

export default UserInfo;
