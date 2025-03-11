import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // 后端服务器地址

const App = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 先从 /scrape 接口获取数据
    fetch('http://localhost:3000/scrape')
      .then(response => response.json())
      .then(res => {
        setArticles(res.data);
      })
      .catch(error => {
        console.error('Error fetching initial data:', error);
      });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('update', (data) => {
      console.log('Received update:', data);
      setArticles((prevArticles) => [data, ...prevArticles]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('update');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>海事局数据</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            Title: {article.title}, Date: {article.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;